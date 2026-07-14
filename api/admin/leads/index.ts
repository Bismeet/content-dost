import { IncomingMessage, ServerResponse } from 'http';
import { verifyAdminSession } from '../../../server/auth/session.js';
import { getSupabaseAdminClient } from '../../../server/database/supabase.js';
import { leadsQuerySchema } from '../../../server/validation/admin-schemas.js';
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

    // 3. Parse and Validate Query Parameters
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    
    const parsedQuery = leadsQuerySchema.safeParse(queryParams);
    if (!parseResultCheck(parsedQuery)) {
      return sendError(res, 400, 'Invalid query parameters', parsedQuery.error.flatten());
    }

    const { page, limit, status, search, sort, order, trash } = parsedQuery.data;

    // 4. Query database via database administrator client
    const supabaseAdmin = getSupabaseAdminClient();
    let dbQuery = supabaseAdmin
      .from('leads')
      .select('id, name, email, company, profile_url, budget, needs, project_details, status, internal_notes, source, created_at, updated_at, deleted_at', { count: 'exact' });

    // Apply trash filter
    if (trash === 'trashed') {
      dbQuery = dbQuery.not('deleted_at', 'is', null);
    } else {
      dbQuery = dbQuery.is('deleted_at', null);
    }

    // Apply filters
    if (status) {
      dbQuery = dbQuery.eq('status', status);
    }

    if (search && search.trim() !== '') {
      // Escape characters meaningful to ilike (% and _)
      const escapedSearch = search.replace(/[%_\\]/g, '\\$&');
      dbQuery = dbQuery.or(
        `name.ilike.%${escapedSearch}%,email.ilike.%${escapedSearch}%,company.ilike.%${escapedSearch}%`
      );
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    dbQuery = dbQuery.range(from, to);

    // Apply sorting (validated against fixed allowlist in schema)
    let sortField = sort;
    if (trash === 'trashed' && sort === 'created_at') {
      sortField = 'deleted_at';
    }
    dbQuery = dbQuery.order(sortField, { ascending: order === 'asc' });

    // Secondary/tertiary deterministic sort
    if (sortField !== 'created_at') {
      dbQuery = dbQuery.order('created_at', { ascending: false });
    }
    dbQuery = dbQuery.order('id', { ascending: true });

    const { data: leads, error: dbError, count } = await dbQuery;

    if (dbError) {
      return sendGenericError(res, dbError);
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Map deleted_at to camelCase deletedAt for the client Lead type
    const mappedLeads = (leads || []).map((lead) => ({
      ...lead,
      deletedAt: lead.deleted_at || null,
    }));

    return sendSuccess(res, 'Leads fetched successfully', {
      data: mappedLeads,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    });

  } catch (err) {
    return sendGenericError(res, err);
  }
}

// Helper to make TS happy with SafeParseReturnType
function parseResultCheck(result: any): result is { success: true; data: any } {
  return result.success;
}
