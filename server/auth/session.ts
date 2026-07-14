import { IncomingMessage, ServerResponse } from 'http';
import { getSupabaseAuthClient } from '../database/supabase.js';
import { getConfig } from '../config.js';

export interface AdminSession {
  id: string;
  email: string;
}

const ACCESS_COOKIE_NAME = 'sb-access-token';
const REFRESH_COOKIE_NAME = 'sb-refresh-token';

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts[0]?.trim();
    const val = parts.slice(1).join('=')?.trim();
    if (name) {
      list[name] = decodeURIComponent(val || '');
    }
  });

  return list;
}

export function setSessionCookies(
  res: ServerResponse,
  accessToken: string,
  refreshToken: string
) {
  const config = getConfig();
  const isProd = config.NODE_ENV === 'production';
  const secureFlag = isProd ? '; Secure' : '';

  // Access token: short-lived (e.g. 1 hour)
  const accessCookie = `${ACCESS_COOKIE_NAME}=${encodeURIComponent(
    accessToken
  )}; HttpOnly; SameSite=Strict${secureFlag}; Path=/; Max-Age=3600`;

  // Refresh token: long-lived (e.g. 7 days)
  const refreshCookie = `${REFRESH_COOKIE_NAME}=${encodeURIComponent(
    refreshToken
  )}; HttpOnly; SameSite=Strict${secureFlag}; Path=/; Max-Age=604800`;

  res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
}

export function clearSessionCookies(res: ServerResponse) {
  const config = getConfig();
  const isProd = config.NODE_ENV === 'production';
  const secureFlag = isProd ? '; Secure' : '';

  const clearAccess = `${ACCESS_COOKIE_NAME}=; HttpOnly; SameSite=Strict${secureFlag}; Path=/; Max-Age=0`;
  const clearRefresh = `${REFRESH_COOKIE_NAME}=; HttpOnly; SameSite=Strict${secureFlag}; Path=/; Max-Age=0`;

  res.setHeader('Set-Cookie', [clearAccess, clearRefresh]);
}

export async function verifyAdminSession(
  req: IncomingMessage,
  res: ServerResponse
): Promise<AdminSession | null> {
  const config = getConfig();
  const cookies = parseCookies(req.headers.cookie);
  const accessToken = cookies[ACCESS_COOKIE_NAME];
  const refreshToken = cookies[REFRESH_COOKIE_NAME];

  if (!accessToken) {
    // If no access token but refresh token exists, try refreshing
    if (refreshToken) {
      return handleRefresh(refreshToken, res);
    }
    return null;
  }

  const supabase = getSupabaseAuthClient();

  try {
    // 1. Verify access token with Supabase getUser
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      // Access token might be expired. Try refresh if refresh token is present.
      if (refreshToken) {
        return handleRefresh(refreshToken, res);
      }
      clearSessionCookies(res);
      return null;
    }

    // 2. Strict check: verified user ID must match ADMIN_USER_ID exactly
    if (user.id !== config.ADMIN_USER_ID) {
      clearSessionCookies(res);
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
    };
  } catch {
    if (refreshToken) {
      return handleRefresh(refreshToken, res);
    }
    clearSessionCookies(res);
    return null;
  }
}

async function handleRefresh(
  refreshToken: string,
  res: ServerResponse
): Promise<AdminSession | null> {
  const config = getConfig();
  const supabase = getSupabaseAuthClient();

  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data || !data.session || !data.user) {
      clearSessionCookies(res);
      return null;
    }

    const user = data.user;

    // Check if refreshed user ID matches ADMIN_USER_ID
    if (user.id !== config.ADMIN_USER_ID) {
      clearSessionCookies(res);
      return null;
    }

    // Rotate/set new session cookies
    setSessionCookies(res, data.session.access_token, data.session.refresh_token);

    return {
      id: user.id,
      email: user.email || '',
    };
  } catch {
    clearSessionCookies(res);
    return null;
  }
}
