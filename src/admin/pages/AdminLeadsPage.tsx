import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useLeads } from '../hooks/useLeads.js';
import type { Lead } from '../types/lead.js';
import type { LeadStatus } from '../../../shared/lead-constants.js';

// Components
import { AdminSidebar } from '../components/AdminSidebar.js';
import { AdminHeader } from '../components/AdminHeader.js';
import { StatsGrid } from '../components/StatsGrid.js';
import { LeadsToolbar } from '../components/LeadsToolbar.js';
import { LeadsTable } from '../components/LeadsTable.js';
import { LeadCard } from '../components/LeadCard.js';
import { LeadDetailsDrawer } from '../components/LeadDetailsDrawer.js';
import { Pagination } from '../components/Pagination.js';
import { ConfirmationModal } from '../components/ConfirmationModal.js';
import { ToastProvider, useToast } from '../components/ToastProvider.js';
import { EmptyState } from '../components/EmptyState.js';
import { StatsSkeleton, TableSkeleton } from '../components/LoadingSkeleton.js';

// CSS
import '../admin.css';

export default function AdminLeadsPage() {
  return (
    <ToastProvider>
      <AdminLeadsDashboard />
    </ToastProvider>
  );
}

function AdminLeadsDashboard() {
  const { isAuthenticated, logout, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Modal states for Trash confirmations
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalType, setConfirmModalType] = useState<'trash' | 'restore' | 'delete' | null>(null);
  const [targetLead, setTargetLead] = useState<Lead | null>(null);

  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Leads list controls
  const {
    leads,
    stats,
    pagination,
    filters,
    setFilters,
    isLoading,
    isStatsLoading,
    isMutating,
    error,
    updateLead,
    moveLeadToTrash,
    restoreLead,
    permanentlyDeleteLead,
    exportCsv,
    refetch,
    refetchStats,
  } = useLeads({
    page: 1,
    limit: 20,
    status: '',
    search: '',
    sort: 'created_at',
    order: 'desc',
    trash: 'active',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Handle lead select
  const handleLeadSelect = (lead: Lead) => {
    setActiveLead(lead);
  };

  // Handle filters update
  const handleFilterChange = (updates: Partial<typeof filters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates };
      // Reset page to 1 when changing search or status
      if (updates.search !== undefined || updates.status !== undefined) {
        next.page = 1;
      }
      return next;
    });
  };

  // Handle Save Lead Status / Notes
  const handleSaveDetails = async (
    id: string,
    updates: { status: LeadStatus; internalNotes: string }
  ): Promise<boolean> => {
    setIsSaving(true);
    const success = await updateLead(id, updates);
    setIsSaving(false);
    if (success) {
      addToast('Lead updated successfully', 'success');
      // Refresh active lead details in drawer
      const updated = leads.find((l) => l.id === id);
      if (updated) {
        setActiveLead({ ...updated, ...updates, internal_notes: updates.internalNotes });
      }
      refetchStats();
    } else {
      addToast('Failed to update lead', 'error');
    }
    return success;
  };

  // Trigger Action Confirmations
  const triggerConfirm = (type: 'trash' | 'restore' | 'delete', lead: Lead) => {
    previousActiveElement.current = document.activeElement as HTMLElement;
    setTargetLead(lead);
    setConfirmModalType(type);
    setConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!targetLead || !confirmModalType) return;
    let success = false;
    
    if (confirmModalType === 'trash') {
      success = await moveLeadToTrash(targetLead.id);
      if (success) {
        addToast('Lead moved to Trash', 'success');
        if (activeLead?.id === targetLead.id) setActiveLead(null);
      } else {
        addToast('Failed to move lead to Trash', 'error');
      }
    } else if (confirmModalType === 'restore') {
      success = await restoreLead(targetLead.id);
      if (success) {
        addToast('Lead restored successfully', 'success');
        if (activeLead?.id === targetLead.id) setActiveLead(null);
      } else {
        addToast('Failed to restore lead', 'error');
      }
    } else if (confirmModalType === 'delete') {
      success = await permanentlyDeleteLead(targetLead.id);
      if (success) {
        addToast('Lead deleted permanently', 'success');
        if (activeLead?.id === targetLead.id) setActiveLead(null);
      } else {
        addToast('Failed to delete lead', 'error');
      }
    }

    if (success) {
      setConfirmModalOpen(false);
      setTargetLead(null);
      setConfirmModalType(null);
      refetchStats();
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  };

  // CSV Export Trigger
  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      addToast('CSV export started', 'info');
      await exportCsv();
      addToast('CSV exported successfully', 'success');
    } catch (err: any) {
      addToast(err?.message || 'Failed to export CSV', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Refresh Trigger
  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchStats()]);
    addToast('Data refreshed', 'success');
  };

  // Card filter shortcut
  const handleStatsFilterClick = (status: string) => {
    handleFilterChange({ status, page: 1 });
  };

  if (authLoading || isAuthenticated === null) {
    return (
      <div
        style={{
          backgroundColor: '#080908',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f2f4ef',
          fontFamily: 'monospace',
          fontSize: '12px',
        }}
      >
        Verifying session...
      </div>
    );
  }

  const isTrashedView = filters.trash === 'trashed';

  return (
    <div className="admin-root">
      <AdminSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={isTrashedView ? 'trash' : 'leads'}
        onTabChange={(tab) => {
          handleFilterChange({
            trash: tab === 'trash' ? 'trashed' : 'active',
            status: '', // Clear status filters when changing tabs
            sort: tab === 'trash' ? 'deleted_at' : 'created_at',
            page: 1,
          });
          setActiveLead(null); // Close active drawer when changing tabs
        }}
        trashCount={stats?.trashed || 0}
        adminEmail={user?.email || null}
        onLogout={logout}
        menuButtonRef={menuButtonRef}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader
          title={isTrashedView ? 'Trash' : 'Leads'}
          subtitle={
            isTrashedView
              ? 'Trashed leads are excluded from active statistics and can be restored or permanently deleted.'
              : 'Monitor, update, and manage your incoming website lead inquiries.'
          }
          isRefreshing={isLoading}
          isExporting={isExporting}
          showMenuButton={true}
          onRefresh={handleRefresh}
          onExport={handleExportCsv}
          onMenuToggle={() => setIsMobileMenuOpen(true)}
        />

        <main style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          {error ? (
            <div
              style={{
                backgroundColor: 'rgba(239, 106, 99, 0.1)',
                border: '1px solid rgba(239, 106, 99, 0.2)',
                borderRadius: '6px',
                padding: '16px',
                color: '#ef6a63',
                fontSize: '12px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <strong style={{ display: 'block', marginBottom: '2px' }}>Database Error</strong>
                <span>{error}</span>
              </div>
              <button
                onClick={handleRefresh}
                style={{
                  backgroundColor: 'var(--admin-danger)',
                  border: 'none',
                  color: '#f2f4ef',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Retry Request
              </button>
            </div>
          ) : null}

          {isStatsLoading ? (
            <StatsSkeleton />
          ) : (
            <StatsGrid
              stats={stats}
              activeStatusFilter={filters.status}
              onFilterClick={handleStatsFilterClick}
            />
          )}

          <LeadsToolbar
            search={filters.search}
            status={filters.status}
            sort={filters.sort}
            order={filters.order}
            isTrashed={isTrashedView}
            totalCount={pagination.total}
            onFilterChange={handleFilterChange}
          />

          {isLoading ? (
            <TableSkeleton />
          ) : leads.length === 0 ? (
            <EmptyState
              type={
                isTrashedView
                  ? 'empty-trash'
                  : filters.search || filters.status
                  ? 'no-results'
                  : 'no-leads'
              }
              onClearFilters={handleResetFilters}
            />
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="leads-table-desktop">
                <style>{`
                  .leads-table-desktop {
                    display: block;
                  }
                  .leads-cards-mobile {
                    display: none;
                  }
                  @media (max-width: 768px) {
                    .leads-table-desktop {
                      display: none !important;
                    }
                    .leads-cards-mobile {
                      display: flex !important;
                      flex-direction: column;
                      gap: 10px;
                    }
                  }
                `}</style>
                <LeadsTable
                  leads={leads}
                  isTrashed={isTrashedView}
                  selectedLeadId={activeLead?.id || null}
                  onLeadSelect={handleLeadSelect}
                  onTrashClick={(lead) => triggerConfirm('trash', lead)}
                  onRestoreClick={(lead) => triggerConfirm('restore', lead)}
                  onDeleteClick={(lead) => triggerConfirm('delete', lead)}
                />
              </div>

              {/* Mobile Cards View */}
              <div className="leads-cards-mobile">
                {leads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    isTrashed={isTrashedView}
                    onView={() => handleLeadSelect(lead)}
                  />
                ))}
              </div>

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalResults={pagination.total}
                limit={filters.limit}
                onPageChange={(page) => handleFilterChange({ page })}
              />
            </>
          )}
        </main>
      </div>

      {/* Details Drawer */}
      <LeadDetailsDrawer
        isOpen={activeLead !== null}
        lead={activeLead}
        isSaving={isSaving}
        isTrashed={isTrashedView}
        onClose={() => setActiveLead(null)}
        onSave={handleSaveDetails}
        onTrash={() => activeLead && triggerConfirm('trash', activeLead)}
        onRestore={() => activeLead && triggerConfirm('restore', activeLead)}
        onDelete={() => activeLead && triggerConfirm('delete', activeLead)}
      />

      {/* Trash action modals */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        title={
          confirmModalType === 'trash'
            ? 'Move lead to Trash'
            : confirmModalType === 'restore'
            ? 'Restore lead'
            : 'Permanently delete lead'
        }
        message={
          confirmModalType === 'trash'
            ? 'Are you sure you want to move this lead to Trash? It can be restored later.'
            : confirmModalType === 'restore'
            ? 'This lead will be returned to your active Leads dashboard with all original status and internal notes preserved.'
            : 'WARNING: This action is permanent and cannot be undone. All client information, notes, and details will be purged.'
        }
        confirmLabel={
          confirmModalType === 'trash'
            ? 'Move to Trash'
            : confirmModalType === 'restore'
            ? 'Restore'
            : 'Delete Permanently'
        }
        isDestructive={confirmModalType === 'trash' || confirmModalType === 'delete'}
        requiresTextConfirm={confirmModalType === 'delete'}
        isLoading={isMutating}
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setConfirmModalOpen(false);
          setTargetLead(null);
          setConfirmModalType(null);
        }}
      />
    </div>
  );

  function handleResetFilters() {
    handleFilterChange({
      search: '',
      status: '',
      sort: isTrashedView ? 'deleted_at' : 'created_at',
      order: 'desc',
      page: 1,
    });
  }
}
