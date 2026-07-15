import { IncomingMessage, ServerResponse } from 'http';
import { verifyAdminSession } from '../../server/auth/session.js';
import { validateOrigin } from '../../server/security/origin.js';
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

    // 3. Verify session (verifyAdminSession handles cookie checking, token validation, and refresh)
    const adminSession = await verifyAdminSession(req, res);

    if (!adminSession) {
      return sendError(res, 401, 'Unauthorized');
    }

    return sendSuccess(res, 'Session refreshed');
  } catch (err) {
    return sendGenericError(res, err);
  }
}
