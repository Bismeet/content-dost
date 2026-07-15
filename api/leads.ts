import { IncomingMessage, ServerResponse } from 'http';
import { getSupabaseAdminClient } from '../server/database/supabase.js';
import { readAndValidateJson } from '../server/security/request-size.js';
import { leadSubmitSchema } from '../server/validation/lead-schema.js';
import { getClientIp, hashIp } from '../server/security/ip.js';
import { checkRateLimit } from '../server/security/rate-limiter.js';
import { sendLeadNotificationEmail } from '../server/email/notification.js';
import { sendSuccess, sendError, sendGenericError } from '../server/helpers/api-response.js';
import { handleCors } from '../server/security/cors.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Handle CORS preflight and headers
  if (handleCors(req, res)) {
    return;
  }

  // 1. Accept only POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendError(res, 405, 'Method Not Allowed');
  }

  try {
    // 2. Validate request body size (max 50KB) and JSON format
    const body = await readAndValidateJson(req, 50 * 1024);

    // 3. Validate with Zod schema
    const parseResult = leadSubmitSchema.safeParse(body);
    if (!parseResult.success) {
      return sendError(res, 400, 'Invalid request payload', parseResult.error.flatten());
    }

    const payload = parseResult.data;

    // 4. Honeypot check - reject silently if filled
    if (payload.website && payload.website.trim() !== '') {
      // Return a fake success response
      return sendSuccess(res, 'Your enquiry has been received.', {}, 201);
    }

    // 5. Client IP extraction and hashing
    const rawIp = getClientIp(req);
    const ipHash = hashIp(rawIp);

    // 6. Rate Limiting Check
    try {
      const rateLimitResult = await checkRateLimit(ipHash, 'lead-submit');
      if (!rateLimitResult.success) {
        res.setHeader('Retry-After', '600');
        return sendError(res, 429, 'Too many requests. Please try again later.');
      }
    } catch (rlError: any) {
      console.error('[Rate Limit Error in public API]:', rlError?.message || rlError);
      // In production, we fail closed if Upstash fails (rate limiting security dependency unavailable)
      return sendError(res, 503, 'Service temporarily unavailable. Please try again later.');
    }

    // 7. Insert lead into Supabase leads table via database administrator client
    const supabaseAdmin = getSupabaseAdminClient();
    const userAgent = req.headers['user-agent'] 
      ? req.headers['user-agent'].substring(0, 512) 
      : null;

    // Normalize needs array and map to correct database columns
    const { data: insertedLead, error: dbError } = await supabaseAdmin
      .from('leads')
      .insert({
        name: payload.name,
        email: payload.email,
        company: payload.company || null,
        profile_url: payload.profileUrl || null,
        needs: payload.needs,
        project_details: payload.details,
        ip_hash: ipHash,
        user_agent: userAgent,
        status: 'new',
        source: 'website',
      })
      .select('id, name, email, company, profile_url, needs, project_details, created_at')
      .single();

    if (dbError || !insertedLead) {
      return sendGenericError(res, dbError || new Error('Failed to insert lead'));
    }

    // 8. Send notification email via Resend (awaited, but failure does not fail the API response)
    const notificationResult = await sendLeadNotificationEmail({
      id: insertedLead.id,
      name: insertedLead.name,
      email: insertedLead.email,
      company: insertedLead.company,
      profileUrl: insertedLead.profile_url,
      needs: insertedLead.needs,
      projectDetails: insertedLead.project_details,
      createdAt: insertedLead.created_at,
    });

    if (!notificationResult.success) {
      console.error('[Resend notification failed]', {
        leadId: insertedLead.id,
        errorType: notificationResult.errorType,
        statusCode: notificationResult.statusCode,
        message: notificationResult.message,
      });
    } else {
      console.log('[Resend notification sent successfully]', {
        leadId: insertedLead.id,
        emailId: (notificationResult as any).emailId,
      });
    }

    // 9. Return generic success message (201 Created)
    return sendSuccess(res, 'Your enquiry has been received.', {}, 201);

  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred.';

    if (statusCode === 413 || statusCode === 415 || statusCode === 400) {
      return sendError(res, statusCode, message);
    }

    return sendGenericError(res, err);
  }
}
