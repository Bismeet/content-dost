/* oxlint-disable no-control-regex */
import { Resend } from 'resend';
import { getConfig } from '../config.js';

interface LeadNotificationData {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  profileUrl?: string | null;
  budget: string;
  needs: string[];
  projectDetails: string;
  createdAt: string;
}

export type EmailNotificationResult =
  | {
      success: true;
      emailId: string;
    }
  | {
      success: false;
      errorType: string;
      statusCode?: number;
      message: string;
    };

// Simple escaping for plain text to prevent formula injection or odd characters
function escapePlainText(str: string): string {
  if (!str) return '';
  // Strip control characters, keep standard text/symbols, escape HTML tags if any
  // eslint-disable-next-line no-control-regex
  return str
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function sendLeadNotificationEmail(
  lead: LeadNotificationData
): Promise<EmailNotificationResult> {
  const config = getConfig();

  if (!config.RESEND_API_KEY) {
    return {
      success: false,
      errorType: 'MISSING_API_KEY',
      message: 'RESEND_API_KEY is not configured',
    };
  }

  // Basic validation of the key format
  if (!config.RESEND_API_KEY.startsWith('re_')) {
    return {
      success: false,
      errorType: 'INVALID_API_KEY_FORMAT',
      message: 'RESEND_API_KEY must start with "re_"',
    };
  }

  try {
    const resend = new Resend(config.RESEND_API_KEY);

    const safeName = escapePlainText(lead.name);
    const safeEmail = escapePlainText(lead.email);
    const safeCompany = lead.company ? escapePlainText(lead.company) : 'N/A';
    const safeProfileUrl = lead.profileUrl ? escapePlainText(lead.profileUrl) : 'N/A';
    const safeBudget = escapePlainText(lead.budget);
    const safeNeeds = lead.needs.map(escapePlainText).join(', ');
    const safeDetails = escapePlainText(lead.projectDetails);
    const safeDate = escapePlainText(lead.createdAt);

    const emailBody = `
New Lead Enquiry Received

Lead ID: ${lead.id}
Submission Date: ${safeDate}

-- Contact Info --
Name: ${safeName}
Email: ${safeEmail}
Company: ${safeCompany}
Social Profile/Website: ${safeProfileUrl}

-- Project Details --
Budget Tier: ${safeBudget}
Requested Services: ${safeNeeds}

Project Description:
${safeDetails}
`;

    // Await the email request and inspect both data and error
    const result = await resend.emails.send({
      from: config.RESEND_FROM_EMAIL,
      to: [config.LEAD_NOTIFICATION_EMAIL],
      subject: `[Content Dost Lead] New Enquiry from ${safeName}`,
      text: emailBody,
    });

    if (result.error) {
      const err = result.error as any;
      return {
        success: false,
        errorType: err.name || 'PROVIDER_ERROR',
        statusCode: err.statusCode || 400,
        message: err.message || 'Resend provider returned an error',
      };
    }

    if (!result.data?.id) {
      return {
        success: false,
        errorType: 'MISSING_EMAIL_ID',
        message: 'Resend did not return a valid email message ID',
      };
    }

    return {
      success: true,
      emailId: result.data.id,
    };
  } catch (err: any) {
    return {
      success: false,
      errorType: err.name || 'EXCEPTION',
      statusCode: err.statusCode || 500,
      message: err.message || 'An unexpected exception occurred while sending email',
    };
  }
}
