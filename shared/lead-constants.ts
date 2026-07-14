export const BUDGET_TIERS = [
  { label: 'Less than $1,500 / mo', value: '<1500' },
  { label: '$1,500 - $3,000 / mo', value: '1500-3000' },
  { label: '$3,000 - $5,000 / mo', value: '3000-5000' },
  { label: 'More than $5,000 / mo', value: '>5000' },
] as const;

export type BudgetTierValue = typeof BUDGET_TIERS[number]['value'];

export const SERVICE_NAMES = [
  { label: 'Content Strategy', id: 'need-strategy' },
  { label: 'Scriptwriting', id: 'need-scripts' },
  { label: 'Long-Form Editing', id: 'need-long' },
  { label: 'Shorts & Reels', id: 'need-shorts' },
  { label: 'Podcast Production', id: 'need-podcast' },
  { label: 'Visual Packaging (Thumbnails)', id: 'need-thumb' },
] as const;

export type ServiceNameLabel = typeof SERVICE_NAMES[number]['label'];

export const LEAD_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'won',
  'lost',
  'spam',
  'archived',
] as const;

export type LeadStatus = typeof LEAD_STATUSES[number];

export const MAX_LENGTHS = {
  name: 120,
  email: 254,
  company: 160,
  profileUrl: 2048,
  details: 5000,
  internalNotes: 5000,
  userAgent: 512,
  searchQuery: 100,
} as const;
