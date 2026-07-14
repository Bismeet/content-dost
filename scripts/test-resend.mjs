import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

// Helper to mask the key safely
function maskKey(key) {
  if (!key) return 'undefined';
  if (key.length <= 8) return 're_****';
  return `${key.slice(0, 3)}****${key.slice(-4)}`;
}

// 1. Load environment variables manually
const env = {};

function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    const envContent = fs.readFileSync(filePath, 'utf8');
    envContent.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const parts = trimmed.split('=');
        const key = parts[0]?.trim();
        let value = parts.slice(1).join('=').trim();
        if (key) {
          // Trim and strip wrapping quotes
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
          }
          value = value.trim();

          if (env[key] === undefined) {
            env[key] = value;
          }
        }
      }
    });
  }
}

// Load env.local first, fallback to env
loadEnvFile(path.resolve(process.cwd(), '.env.local'));
loadEnvFile(path.resolve(process.cwd(), '.env'));

// 2. Validate Resend variables
const apiKey = env.RESEND_API_KEY;
const fromEmail = env.RESEND_FROM_EMAIL;
const toEmail = env.LEAD_NOTIFICATION_EMAIL;

console.log('--- Resend Configuration Diagnostics ---');
console.log('API Key Exists:', !!apiKey);
console.log('API Key Masked:', maskKey(apiKey));
console.log('From Email:', fromEmail || 'undefined');
console.log('To Email:', toEmail || 'undefined');
console.log('----------------------------------------\n');

if (!apiKey) {
  console.error('Error: RESEND_API_KEY is missing or empty.');
  process.exitCode = 1;
} else if (!apiKey.startsWith('re_')) {
  console.error('Error: RESEND_API_KEY must start with "re_".');
  process.exitCode = 1;
} else {
  const isPlaceholder = 
    apiKey === 're_yourapikey' || 
    apiKey.includes('placeholder') || 
    apiKey.includes('actual_key');
  if (isPlaceholder) {
    console.error('Error: RESEND_API_KEY contains a placeholder value.');
    process.exitCode = 1;
  }
}

if (!fromEmail) {
  console.error('Error: RESEND_FROM_EMAIL is missing or empty.');
  process.exitCode = 1;
}

if (!toEmail) {
  console.error('Error: LEAD_NOTIFICATION_EMAIL is missing or empty.');
  process.exitCode = 1;
}

if (process.exitCode === 1) {
  // If validation failed, stop here
  process.exit(1);
}

const resend = new Resend(apiKey);

async function runDiagnostic() {
  console.log('Attempting to send diagnostic email via Resend...');
  
  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: 'Content Dost Resend Diagnostic',
      text: 'Resend email delivery is working correctly.',
    });

    if (result.error) {
      console.error('\n❌ Resend returned a provider error:');
      console.error('Error Name:', result.error.name);
      console.error('Message:', result.error.message);
      if (result.error.statusCode) {
        console.error('Status Code:', result.error.statusCode);
      }

      // Check if no-domain testing / testing address restrictions apply (403 or specific messages)
      const isRestricted = 
        result.error.message.includes('restriction') || 
        result.error.message.includes('verify') || 
        result.error.statusCode === 403;
      
      if (isRestricted && fromEmail.includes('onboarding@resend.dev')) {
        console.error('\n💡 HINT: Since you are using the default "onboarding@resend.dev" sender address:');
        console.error('1. You can ONLY send emails to the email address associated with your Resend account.');
        console.error(`2. Make sure LEAD_NOTIFICATION_EMAIL (${toEmail}) exactly matches your Resend account email.`);
      }

      if (result.error.message.includes('API key') || result.error.message.includes('restricted to')) {
        console.error('\n💡 HINT: Your Resend API key appears to be restricted to another domain. Please create a new unrestricted API key in your Resend dashboard.');
      }

      // Use process.exitCode instead of process.exit to avoid Node 24 Windows async handle bugs
      process.exitCode = 1;
      return;
    }

    if (result.data?.id) {
      console.log('\n✅ Success! Resend diagnostic email sent.');
      console.log('Email Message ID:', result.data.id);
      process.exitCode = 0;
    } else {
      console.error('\n❌ Failure: Resend did not return a valid email ID.');
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('\n❌ Exception occurred while contacting Resend API:');
    console.error('Message:', error.message || error);
    process.exitCode = 1;
  }
}

runDiagnostic();
