import { IncomingMessage, ServerResponse } from 'http';
import { verifyAdminSession } from '../../server/auth/session.js';
import { sendSuccess, sendError, sendGenericError } from '../../server/helpers/api-response.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // 1. Accept only GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendError(res, 405, 'Method Not Allowed');
  }

  try {
    // 2. Verify admin session (handles token verification and automatic refresh/cookie rotation)
    const adminSession = await verifyAdminSession(req, res);

    if (!adminSession) {
      return sendError(res, 401, 'Unauthorized');
    }

    // 3. Return session details
    return sendSuccess(res, 'Session active', {
      user: {
        id: adminSession.id,
        email: adminSession.email,
      },
    });
  } catch (err) {
    return sendGenericError(res, err);
  }
}
