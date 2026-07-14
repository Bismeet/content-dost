import { IncomingMessage, ServerResponse } from 'http';
import { verifyAdminSession } from '../../../server/auth/session.js';
import { getSupabaseAdminClient } from '../../../server/database/supabase.js';
import { validateOrigin } from '../../../server/security/origin.js';
import { readAndValidateJson } from '../../../server/security/request-size.js';
import { leadUpdateSchema } from '../../../server/validation/admin-schemas.js';
import { sendSuccess, sendError, sendGenericError } from '../../../server/helpers/api-response.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // 1. Resolve and validate UUID from pathname
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!id || !uuidRegex.test(id)) {
    return sendError(res, 400, 'Invalid lead ID format');
  }

  // 2. Validate Methods
  if (req.method !== 'GET' && req.method !== 'PATCH') {
    res.setHeader('Allow', 'GET, PATCH');
    return sendError(res, 405, 'Method Not Allowed');
  }

  // 3. Verify Session
  const adminSession = await verifyAdminSession(req, res);
  if (!adminSession) {
    return sendError(res, 401, 'Unauthorized');
  }

  const supabaseAdmin = getSupabaseAdminClient();

  // 4. Handle GET (Fetch single lead)
  if (req.method === 'GET') {
    try {
      const { data: lead, error: dbError } = await supabaseAdmin
        .from('leads')
        .select('id, name, email, company, profile_url, budget, needs, project_details, status, internal_notes, source, created_at, updated_at')
        .eq('id', id)
        .single();

      if (dbError || !lead) {
        return sendError(res, 404, 'Lead not found');
      }

      return sendSuccess(res, 'Lead retrieved successfully', { lead });
    } catch (err) {
      return sendGenericError(res, err);
    }
  }

  // 5. Handle PATCH (Update status and/or internal notes)
  if (req.method === 'PATCH') {
    // 5a. Origin Validation
    const originHeader = req.headers.origin;
    if (!validateOrigin(originHeader)) {
      return sendError(res, 403, 'Forbidden origin');
    }

    try {
      // 5b. Request size check (max 10KB for PATCH update)
      const body = await readAndValidateJson(req, 10 * 1024);

      // 5c. Validate payload with strict Zod schema
      const parseResult = leadUpdateSchema.safeParse(body);
      if (!parseResult.success) {
        return sendError(res, 400, 'Invalid update data', parseResult.error.flatten());
      }

      const updateData = parseResult.data;

      // Construct update payload explicitly to prevent mass-assignment
      const finalUpdate: Record<string, any> = {};
      if (updateData.status !== undefined) {
        finalUpdate.status = updateData.status;
      }
      if (updateData.internalNotes !== undefined) {
        finalUpdate.internal_notes = updateData.internalNotes || '';
      }

      const { data: updatedLead, error: dbError } = await supabaseAdmin
        .from('leads')
        .update(finalUpdate)
        .eq('id', id)
        .select('id, name, email, company, profile_url, budget, needs, project_details, status, internal_notes, created_at, updated_at')
        .single();

      if (dbError || !updatedLead) {
        return sendError(res, 404, 'Lead not found or update failed');
      }

      return sendSuccess(res, 'Lead updated successfully', { lead: updatedLead });

    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      const message = err.message || 'An unexpected error occurred.';

      if (statusCode === 413 || statusCode === 415 || statusCode === 400) {
        return sendError(res, statusCode, message);
      }

      return sendGenericError(res, err);
    }
  }
}
