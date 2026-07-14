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

    // 3. Query all counts in a single aggregation or parallel select statements
    const supabaseAdmin = getSupabaseAdminClient();
    
    // We fetch counts for each status. In Supabase, doing a group by or count query is simple
    const { data: statusCounts, error: dbError } = await supabaseAdmin
      .from('leads')
      .select('status');

    if (dbError) {
      return sendGenericError(res, dbError);
    }

    // Initial counts object
    const stats = {
      total: 0,         // Global total including archived/spam
      activeTotal: 0,   // Total excluding archived and spam
      new: 0,
      contacted: 0,
      qualified: 0,
      proposal: 0,
      won: 0,
      lost: 0,
      spam: 0,
      archived: 0,
    };

    if (statusCounts) {
      statusCounts.forEach((row: { status: string }) => {
        const s = row.status;
        stats.total++;
        if (s !== 'spam' && s !== 'archived') {
          stats.activeTotal++;
        }
        
        if (s in stats) {
          (stats as any)[s]++;
        }
      });
    }

    return sendSuccess(res, 'Lead statistics fetched successfully', { stats });

  } catch (err) {
    return sendGenericError(res, err);
  }
}
