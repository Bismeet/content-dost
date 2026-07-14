import { IncomingMessage, ServerResponse } from 'http';
import { getSupabaseAuthClient } from '../../server/database/supabase.js';
import { readAndValidateJson } from '../../server/security/request-size.js';
import { adminLoginSchema } from '../../server/validation/admin-schemas.js';
import { getClientIp, hashIp } from '../../server/security/ip.js';
import { checkRateLimit } from '../../server/security/rate-limiter.js';
import { validateOrigin } from '../../server/security/origin.js';
import { setSessionCookies } from '../../server/auth/session.js';
import { sendSuccess, sendError, sendGenericError } from '../../server/helpers/api-response.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // 1. Accept only POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendError(res, 405, 'Method Not Allowed');
  }

  // 2. Validate Origin header
  const originHeader = req.headers.origin;
  if (!validateOrigin(originHeader)) {
    return sendError(res, 403, 'Forbidden origin');
  }

  try {
    // 3. Size validation (max 10KB for login)
    const body = await readAndValidateJson(req, 10 * 1024);

    // 4. Validate login schema
    const parseResult = adminLoginSchema.safeParse(body);
    if (!parseResult.success) {
      return sendError(res, 400, 'Invalid login parameters');
    }

    const { email, password } = parseResult.data;

    // 5. Rate limiting per IP and email (we use hashed IP + hashed email as rate limit key)
    const rawIp = getClientIp(req);
    const ipHash = hashIp(rawIp);
    const emailHash = hashIp(email.toLowerCase());
    const rateLimitKey = `login:${ipHash}:${emailHash}`;

    try {
      const rateLimitResult = await checkRateLimit(rateLimitKey, 'admin-login');
      if (!rateLimitResult.success) {
        return sendError(res, 429, 'Too many login attempts. Please try again later.');
      }
    } catch (rlError: any) {
      console.error('[Rate Limit Error in admin login API]:', rlError?.message || rlError);
      return sendError(res, 503, 'Security service unavailable. Please try again later.');
    }

    // 6. Authenticate via Supabase Auth client
    const supabase = getSupabaseAuthClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // 7. Handle auth errors or missing sessions
    if (authError || !authData || !authData.session || !authData.user) {
      // Return a generic invalid credentials message to prevent account harvesting
      return sendError(res, 400, 'Invalid email or password');
    }

    // 8. Strict admin user ID check
    const { user, session } = authData;
    const config = await import('../../server/config.js');
    const adminUserId = config.getConfig().ADMIN_USER_ID;

    if (user.id !== adminUserId) {
      // Sign out immediately to clear any session on Supabase side
      await supabase.auth.signOut();
      return sendError(res, 403, 'Access denied');
    }

    // 9. Store access and refresh tokens in HttpOnly secure cookies
    setSessionCookies(res, session.access_token, session.refresh_token);

    return sendSuccess(res, 'Login successful');

  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred.';

    if (statusCode === 413 || statusCode === 415 || statusCode === 400) {
      return sendError(res, statusCode, message);
    }

    return sendGenericError(res, err);
  }
}
