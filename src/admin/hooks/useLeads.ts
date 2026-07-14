import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '../../lib/api-client.js';
import type { Lead, LeadsResponse, LeadStats, LeadStatsResponse } from '../types/lead.js';

export function useLeads(initialFilters: {
  page: number;
  limit: number;
  status: string;
  search: string;
  sort: string;
  order: 'asc' | 'desc';
  trash?: 'active' | 'trashed';
}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchLeads = useCallback(async () => {
    // Abort the previous request if it's still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // Create new abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsLoading(true);
      setError(null);

      // Build query string
      const params = new URLSearchParams();
      params.append('page', String(filters.page));
      params.append('limit', String(filters.limit));
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      params.append('sort', filters.sort);
      params.append('order', filters.order);
      if (filters.trash) params.append('trash', filters.trash);

      const res = await apiFetch<LeadsResponse>(`/api/admin/leads?${params.toString()}`, {
        signal: controller.signal,
      });
      if (res.success) {
        setLeads(res.data);
        setPagination(res.pagination);
      }
    } catch (err: any) {
      // Don't set error state if it was aborted intentionally
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch leads');
      }
    } finally {
      // Only set loading to false if this was the latest controller
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
      }
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      setIsStatsLoading(true);
      const res = await apiFetch<LeadStatsResponse>('/api/admin/leads/stats');
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  const updateLead = async (
    id: string,
    updates: { status?: string; internalNotes?: string }
  ): Promise<boolean> => {
    if (isMutating) return false;
    try {
      setIsMutating(true);
      const res = await apiFetch<{ success: boolean }>(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      if (res.success) {
        // Refresh leads list and stats
        await fetchLeads();
        await fetchStats();
        return true;
      }
      return false;
    } catch (err: any) {
      alert(err.message || 'Failed to update lead');
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const moveLeadToTrash = async (id: string): Promise<boolean> => {
    if (isMutating) return false;
    try {
      setIsMutating(true);
      const res = await apiFetch<{ success: boolean }>(`/api/admin/leads/${id}/trash`, {
        method: 'POST',
      });
      if (res.success) {
        await fetchLeads();
        await fetchStats();
        return true;
      }
      return false;
    } catch (err: any) {
      alert(err.message || 'Failed to move lead to Trash');
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const restoreLead = async (id: string): Promise<boolean> => {
    if (isMutating) return false;
    try {
      setIsMutating(true);
      const res = await apiFetch<{ success: boolean }>(`/api/admin/leads/${id}/restore`, {
        method: 'POST',
      });
      if (res.success) {
        await fetchLeads();
        await fetchStats();
        return true;
      }
      return false;
    } catch (err: any) {
      alert(err.message || 'Failed to restore lead');
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const permanentlyDeleteLead = async (id: string): Promise<boolean> => {
    if (isMutating) return false;
    try {
      setIsMutating(true);
      const res = await apiFetch<{ success: boolean }>(`/api/admin/leads/${id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        await fetchLeads();
        await fetchStats();
        return true;
      }
      return false;
    } catch (err: any) {
      alert(err.message || 'Failed to permanently delete lead');
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const softArchive = async (id: string): Promise<boolean> => {
    return updateLead(id, { status: 'archived' });
  };

  const exportCsv = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      params.append('sort', filters.sort);
      params.append('order', filters.order);
      if (filters.trash) params.append('trash', filters.trash);

      const csvData = await apiFetch<string>(`/api/admin/leads/export?${params.toString()}`);

      // Create browser download link
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      
      link.setAttribute('href', url);
      link.setAttribute('download', `leads-export-${dateStr}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert(err.message || 'Failed to export CSV');
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    leads,
    stats,
    pagination,
    filters,
    setFilters,
    isLoading,
    isStatsLoading,
    isMutating,
    error,
    refetch: fetchLeads,
    refetchStats: fetchStats,
    updateLead,
    moveLeadToTrash,
    restoreLead,
    permanentlyDeleteLead,
    softArchive,
    exportCsv,
  };
}
