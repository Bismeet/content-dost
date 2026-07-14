import { IncomingMessage, ServerResponse } from 'http';
import { verifyAdminSession } from '../../../server/auth/session.js';
import { getSupabaseAdminClient } from '../../../server/database/supabase.js';
import { sendSuccess, sendError, sendGenericError } from '../../../server/helpers/api-response.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // 1. Accept only GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendError(res, 405, 'Method Not Allowed');
  }

  try {
    // 2. Verify Session
    const adminSession = await verifyAdminSession(req, res);
    if (!adminSession) {
      return sendError(res, 401, 'Unauthorized');
    }

    // 3. Query all counts in parallel using database count queries (head: true to avoid fetching rows)
    const supabaseAdmin = getSupabaseAdminClient();

    const [
      totalRes,
      newRes,
      contactedRes,
      qualifiedRes,
      proposalRes,
      wonRes,
      lostRes,
      spamRes,
      archivedRes,
      trashedRes
    ] = await Promise.all([
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).is('deleted_at', null),
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'new'),
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'contacted'),
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'qualified'),
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'proposal'),
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'won'),
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'lost'),
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'spam'),
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'archived'),
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).not('deleted_at', 'is', null)
    ]);

    const errors = [
      totalRes.error, newRes.error, contactedRes.error, qualifiedRes.error,
      proposalRes.error, wonRes.error, lostRes.error, spamRes.error,
      archivedRes.error, trashedRes.error
    ].filter(Boolean);

    if (errors.length > 0) {
      return sendGenericError(res, errors[0]);
    }

    const totalCount = totalRes.count || 0;
    const spamCount = spamRes.count || 0;
    const archivedCount = archivedRes.count || 0;
    const activeTotal = totalCount - spamCount - archivedCount;

    const stats = {
      total: totalCount,
      activeTotal,
      new: newRes.count || 0,
      contacted: contactedRes.count || 0,
      qualified: qualifiedRes.count || 0,
      proposal: proposalRes.count || 0,
      won: wonRes.count || 0,
      lost: lostRes.count || 0,
      spam: spamCount,
      archived: archivedCount,
      trashed: trashedRes.count || 0,
    };

    return sendSuccess(res, 'Lead statistics fetched successfully', { stats });

  } catch (err) {
    return sendGenericError(res, err);
  }
}
