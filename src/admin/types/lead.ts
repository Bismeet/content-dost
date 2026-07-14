import type { LeadStatus } from '../../../shared/lead-constants';

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  profile_url: string | null;
  needs: string[];
  project_details: string;
  status: LeadStatus;
  internal_notes: string;
  source: string;
  created_at: string;
  updated_at: string;
  deletedAt?: string | null;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LeadsResponse {
  success: boolean;
  data: Lead[];
  pagination: PaginationMetadata;
}

export interface LeadStats {
  total: number;
  activeTotal: number;
  new: number;
  contacted: number;
  qualified: number;
  proposal: number;
  won: number;
  lost: number;
  spam: number;
  archived: number;
  trashed: number;
}

export interface LeadStatsResponse {
  success: boolean;
  stats: LeadStats;
}
