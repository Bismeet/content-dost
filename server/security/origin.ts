import { getConfig } from '../config.js';

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Return protocol + host (without trailing slash)
    return `${parsed.protocol}//${parsed.host}`.toLowerCase();
  } catch {
    return url.trim().toLowerCase().replace(/\/+$/, '');
  }
}

export function validateOrigin(originHeader: string | undefined): boolean {
  if (!originHeader) {
    // In production, Origin header must be present for mutations.
    const config = getConfig();
    if (config.NODE_ENV === 'production') {
      return false;
    }
    // Allow missing origin for local CLI testing/dev tools only in dev
    return true;
  }

  const normalizedOrigin = normalizeUrl(originHeader);
  const config = getConfig();

  // Allow explicitly configured main origin
  const mainOrigin = normalizeUrl(config.APP_ORIGIN);
  if (normalizedOrigin === mainOrigin) {
    return true;
  }

  // Allow additional explicitly configured origins
  for (const allowed of config.ADDITIONAL_ALLOWED_ORIGINS) {
    if (normalizedOrigin === normalizeUrl(allowed)) {
      return true;
    }
  }

  // In local development, allow any localhost or 127.0.0.1 origin
  if (config.NODE_ENV === 'development') {
    const isLocalhost = 
      normalizedOrigin.startsWith('http://localhost:') || 
      normalizedOrigin === 'http://localhost' || 
      normalizedOrigin.startsWith('http://127.0.0.1:') || 
      normalizedOrigin === 'http://127.0.0.1';
    if (isLocalhost) {
      return true;
    }
  }

  return false;
}
