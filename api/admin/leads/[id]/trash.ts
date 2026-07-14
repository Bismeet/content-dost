import { IncomingMessage, ServerResponse } from 'http';
import { verifyAdminSession } from '../../../../server/auth/session.js';
import { getSupabaseAdminClient } from '../../../../server/database/supabase.js';
import { validateOrigin } from '../../../../server/security/origin.js';
import { sendSuccess, sendError, sendGenericError } from '../../../../server/helpers/api-response.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // 1. Accept only POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendError(res, 405, 'Method Not Allowed');
  }

  // 2. Resolve and validate UUID from pathname
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const pathParts = url.pathname.split('/');
  // Path format: /api/admin/leads/[id]/trash
  // The id is second to last part
  const id = pathParts[pathParts.length - 2];

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!id || !uuidRegex.test(id)) {
    return sendError(res, 400, 'Invalid lead ID format');
  }

  // 3. Verify Session
  const adminSession = await verifyAdminSession(req, res);
  if (!adminSession) {
    return sendError(res, 401, 'Unauthorized');
  }

  // 4. Origin Validation for mutation
  const originHeader = req.headers.origin;
  if (!validateOrigin(originHeader)) {
    return sendError(res, 403, 'Forbidden origin');
  }

  res.setHeader('Cache-Control', 'no-store');

  try {
    const supabaseAdmin = getSupabaseAdminClient();

    // 5. Fetch the lead to check existence and current soft-delete status
    const { data: lead, error: fetchError } = await supabaseAdmin
      .from('leads')
      .select('id, deleted_at')
      .eq('id', id)
      .maybeSingle();

    if (fetchError || !lead) {
      return sendError(res, 404, 'Lead not found');
    }

    // 6. Idempotent check: if already trashed, return success immediately
    if (lead.deleted_at !== null) {
      return sendSuccess(res, 'Lead is already in Trash', { success: true });
    }

    // 7. Perform the soft delete (move to trash)
    const { error: updateError } = await supabaseAdmin
      .from('leads')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: adminSession.id,
      })
      .eq('id', id);

    if (updateError) {
      return sendGenericError(res, updateError);
    }

    return sendSuccess(res, 'Lead moved to Trash successfully', { success: true });
  } catch (err) {
    return sendGenericError(res, err);
  }
}
