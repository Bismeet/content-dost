import { z } from 'zod';
import { LEAD_STATUSES, MAX_LENGTHS } from '../../shared/lead-constants.js';

// Admin login schema
export const adminLoginSchema = z
  .object({
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  })
  .strict();

// Lead status update schema (PATCH)
export const leadUpdateSchema = z
  .object({
    status: z.enum(LEAD_STATUSES).optional(),
    internalNotes: z
      .string()
      .max(MAX_LENGTHS.internalNotes, `Internal notes cannot exceed ${MAX_LENGTHS.internalNotes} characters`)
      .optional()
      .nullable(),
  })
  .strict()
  .refine(
    (data) => data.status !== undefined || data.internalNotes !== undefined,
    { message: 'At least one field (status or internalNotes) must be provided for update' }
  );

// Query parameter validation schema for leads list
export const leadsQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .default('1')
      .transform((val) => {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) || parsed < 1 ? 1 : parsed;
      }),
    limit: z
      .string()
      .optional()
      .default('20')
      .transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed) || parsed < 1) return 20;
        return parsed > 100 ? 100 : parsed; // clamp limit to max 100
      }),
    status: z
      .enum(LEAD_STATUSES)
      .optional()
      .or(z.literal(''))
      .transform((val) => (val === '' ? undefined : val)),
    search: z
      .string()
      .optional()
      .default('')
      .transform((val) => val.trim())
      .refine((val) => val.length <= MAX_LENGTHS.searchQuery, {
        message: `Search query cannot exceed ${MAX_LENGTHS.searchQuery} characters`,
      }),
    sort: z
      .enum(['created_at', 'status', 'name', 'email', 'budget', 'company', 'deleted_at'])
      .optional()
      .default('created_at'),
    order: z
      .enum(['asc', 'desc'])
      .optional()
      .default('desc'),
    trash: z
      .enum(['active', 'trashed'])
      .optional()
      .default('active'),
  })
  .strict();

export type AdminLoginPayload = z.infer<typeof adminLoginSchema>;
export type LeadUpdatePayload = z.infer<typeof leadUpdateSchema>;
export type LeadsQueryPayload = z.infer<typeof leadsQuerySchema>;
