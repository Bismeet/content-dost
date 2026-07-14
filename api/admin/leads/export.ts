import { IncomingMessage, ServerResponse } from 'http';
import { verifyAdminSession } from '../../../server/auth/session.js';
import { getSupabaseAdminClient } from '../../../server/database/supabase.js';
import { leadsQuerySchema } from '../../../server/validation/admin-schemas.js';
import { generateCsv } from '../../../server/helpers/csv.js';
import { setSecurityHeaders } from '../../../server/security/headers.js';
import { sendError, sendGenericError } from '../../../server/helpers/api-response.js';

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

    // 3. Parse and Validate Query Parameters (Same validation as list query)
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    
    const parsedQuery = leadsQuerySchema.safeParse(queryParams);
    if (!parsedQuery.success) {
      return sendError(res, 400, 'Invalid query parameters', parsedQuery.error.flatten());
    }

    const { status, search, sort, order } = parsedQuery.data;

    // 4. Fetch leads from database with limit capped to 10,000 for export
    const supabaseAdmin = getSupabaseAdminClient();
    let dbQuery = supabaseAdmin
      .from('leads')
      .select('id, name, email, company, profile_url, budget, needs, project_details, status, internal_notes, source, created_at')
      .limit(10000);

    // Apply filters
    if (status) {
      dbQuery = dbQuery.eq('status', status);
    }

    if (search && search.trim() !== '') {
      const escapedSearch = search.replace(/[%_\\]/g, '\\$&');
      dbQuery = dbQuery.or(
        `name.ilike.%${escapedSearch}%,email.ilike.%${escapedSearch}%,company.ilike.%${escapedSearch}%`
      );
    }

    // Apply sorting
    dbQuery = dbQuery.order(sort, { ascending: order === 'asc' });
    dbQuery = dbQuery.order('id', { ascending: true });

    const { data: leads, error: dbError } = await dbQuery;

    if (dbError) {
      return sendGenericError(res, dbError);
    }

    // 5. Generate CSV rows
    const headers = [
      'Lead ID',
      'Name',
      'Email',
      'Company',
      'Profile URL',
      'Budget Tier',
      'Needs / Services',
      'Project Details',
      'Status',
      'Internal Notes',
      'Source',
      'Created At',
    ];

    const rows = (leads || []).map((lead) => [
      lead.id,
      lead.name,
      lead.email,
      lead.company || '',
      lead.profile_url || '',
      lead.budget,
      lead.needs,
      lead.project_details,
      lead.status,
      lead.internal_notes || '',
      lead.source,
      lead.created_at,
    ]);

    const csvContent = generateCsv(headers, rows);

    // 6. Set Content and Security Headers
    setSecurityHeaders(res);
    const dateStr = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="leads-export-${dateStr}.csv"`);
    res.end(csvContent);

  } catch (err) {
    return sendGenericError(res, err);
  }
}
