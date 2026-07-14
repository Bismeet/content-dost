import { z } from 'zod';
import { SERVICE_NAMES, MAX_LENGTHS } from '../../shared/lead-constants.js';

const allowedServices = SERVICE_NAMES.map((s) => s.label) as [string, ...string[]];

export const leadSubmitSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .max(MAX_LENGTHS.name, `Name cannot exceed ${MAX_LENGTHS.name} characters`),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .max(MAX_LENGTHS.email, `Email cannot exceed ${MAX_LENGTHS.email} characters`)
      .email('Please enter a valid email address')
      .toLowerCase(),
    company: z
      .string()
      .trim()
      .max(MAX_LENGTHS.company, `Company name cannot exceed ${MAX_LENGTHS.company} characters`)
      .optional()
      .nullable()
      .or(z.literal('')),
    profileUrl: z
      .string()
      .trim()
      .max(MAX_LENGTHS.profileUrl, `Profile URL cannot exceed ${MAX_LENGTHS.profileUrl} characters`)
      .refine(
        (val) => {
          if (!val) return true;
          try {
            const parsed = new URL(val);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
          } catch {
            return false;
          }
        },
        { message: 'Profile URL must be a valid HTTP or HTTPS link' }
      )
      .optional()
      .nullable()
      .or(z.literal('')),
    needs: z
      .array(z.enum(allowedServices))
      .min(1, 'Please select at least one service')
      .max(allowedServices.length, `You can select at most ${allowedServices.length} services`),
    details: z
      .string()
      .trim()
      .min(1, 'Project details are required')
      .max(MAX_LENGTHS.details, `Project details cannot exceed ${MAX_LENGTHS.details} characters`),
    website: z.string().optional(), // Honeypot field
  })
  .strict(); // Reject unknown properties

export type LeadSubmitPayload = z.infer<typeof leadSubmitSchema>;
