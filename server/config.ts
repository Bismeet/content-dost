export interface Config {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_USER_ID: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  IP_HASH_SECRET: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  LEAD_NOTIFICATION_EMAIL: string;
  APP_ORIGIN: string;
  ADDITIONAL_ALLOWED_ORIGINS: string[];
  NODE_ENV: string;
}

export function maskKey(key: string | undefined): string {
  if (!key) return 'undefined';
  if (key.length <= 8) return 're_****';
  return `${key.slice(0, 3)}****${key.slice(-4)}`;
}

export function getConfig(): Config {
  const isDev = process.env.NODE_ENV === 'development';

  // Helper to get environment variable, normalize, and validate
  const getEnv = (key: string, required = true): string => {
    let val = process.env[key];
    if (val) {
      val = val.trim();
      // Remove wrapping double or single quotes
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      } else if (val.startsWith("'") && val.endsWith("'")) {
        val = val.slice(1, -1);
      }
      val = val.trim();
    }
    if (!val) {
      if (required && !isDev) {
        throw new Error(`Environment variable ${key} is required but missing`);
      }
      return val || '';
    }
    return val;
  };

  const resendApiKey = getEnv('RESEND_API_KEY', false);
  if (resendApiKey) {
    const isPlaceholder = 
      resendApiKey === 're_yourapikey' || 
      resendApiKey.includes('placeholder') || 
      resendApiKey.includes('actual_key');
    if (isPlaceholder) {
      throw new Error(`Environment variable RESEND_API_KEY contains placeholder value`);
    }
    if (!resendApiKey.startsWith('re_')) {
      throw new Error('Environment variable RESEND_API_KEY must start with "re_"');
    }
  } else if (!isDev) {
    throw new Error('Environment variable RESEND_API_KEY is required but missing');
  }

  const appOrigin = getEnv('APP_ORIGIN', true) || 'http://localhost:5173';
  const additionalOriginsRaw = getEnv('ADDITIONAL_ALLOWED_ORIGINS', false);
  const additionalOrigins = additionalOriginsRaw
    ? additionalOriginsRaw.split(',').map((o) => o.trim()).filter(Boolean)
    : [];

  return {
    SUPABASE_URL: getEnv('SUPABASE_URL'),
    SUPABASE_ANON_KEY: getEnv('SUPABASE_ANON_KEY'),
    SUPABASE_SERVICE_ROLE_KEY: getEnv('SUPABASE_SERVICE_ROLE_KEY'),
    ADMIN_USER_ID: getEnv('ADMIN_USER_ID'),
    UPSTASH_REDIS_REST_URL: getEnv('UPSTASH_REDIS_REST_URL'),
    UPSTASH_REDIS_REST_TOKEN: getEnv('UPSTASH_REDIS_REST_TOKEN'),
    IP_HASH_SECRET: getEnv('IP_HASH_SECRET') || 'dev_secret_hash_ip_key_must_be_changed',
    RESEND_API_KEY: resendApiKey,
    RESEND_FROM_EMAIL: getEnv('RESEND_FROM_EMAIL') || 'Content Dost <onboarding@resend.dev>',
    LEAD_NOTIFICATION_EMAIL: getEnv('LEAD_NOTIFICATION_EMAIL') || 'hello@contentdost.agency',
    APP_ORIGIN: appOrigin,
    ADDITIONAL_ALLOWED_ORIGINS: additionalOrigins,
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
}
