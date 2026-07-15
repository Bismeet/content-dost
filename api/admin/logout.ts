import { IncomingMessage, ServerResponse } from 'http';
import { getSupabaseAuthClient } from '../../server/database/supabase.js';
import { validateOrigin } from '../../server/security/origin.js';
import { clearSessionCookies } from '../../server/auth/session.js';
import { sendSuccess, sendError, sendGenericError } from '../../server/helpers/api-response.js';
import { handleCors } from '../../server/security/cors.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    // Handle CORS preflight and headers
    if (handleCors(req, res)) {
      return;
    }

    // 1. Accept only POST
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return sendError(res, 405, 'Method Not Allowed');
    }

    // 2. Validate Origin
    const originHeader = req.headers.origin;
    if (!validateOrigin(originHeader)) {
      return sendError(res, 403, 'Forbidden origin');
    }

    // 3. Sign out from Supabase Auth (best effort)
    const supabase = getSupabaseAuthClient();
    await supabase.auth.signOut();

    // 4. Clear cookies on response
    clearSessionCookies(res);

    return sendSuccess(res, 'Logged out successfully');
  } catch (err) {
    // Always clear session cookies even if supabase.auth.signOut fails
    clearSessionCookies(res);
    return sendGenericError(res, err);
  }
}
