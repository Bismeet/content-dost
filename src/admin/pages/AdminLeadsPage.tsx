import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useLeads } from '../hooks/useLeads.js';
import type { Lead } from '../types/lead.js';
import { LEAD_STATUSES } from '../../../shared/lead-constants.js';
import { 
  Search, 
  Download, 
  LogOut, 
  RefreshCw, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminLeadsPage() {
  const { isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [leadStatus, setLeadStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Modal states for Trash confirmations
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'trash' | 'restore' | 'delete' | null>(null);
  const [targetLead, setTargetLead] = useState<Lead | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

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
    updateLead,
    moveLeadToTrash,
    restoreLead,
    permanentlyDeleteLead,
    exportCsv,
    refetch,
    refetchStats
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

  // Sync state when active lead changes
  useEffect(() => {
    if (activeLead) {
      setInternalNotes(activeLead.internal_notes || '');
      setLeadStatus(activeLead.status);
    }
  }, [activeLead]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value.substring(0, 100), page: 1 }));
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }));
  };

  const handleSortChange = (column: string) => {
    setFilters((prev) => ({
      ...prev,
      sort: column,
      order: prev.sort === column && prev.order === 'desc' ? 'asc' : 'desc',
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleSaveDetails = async () => {
    if (!activeLead) return;
    setIsSaving(true);
    const success = await updateLead(activeLead.id, {
      status: leadStatus,
      internalNotes: internalNotes.substring(0, 5000),
    });
    if (success) {
      // Find updated lead and refresh active lead state
      const updated = leads.find((l) => l.id === activeLead.id);
      if (updated) {
        setActiveLead({ ...updated, status: leadStatus as any, internal_notes: internalNotes });
      } else {
        // Fallback refresh
        setActiveLead(null);
      }
      alert('Changes saved successfully');
    }
    setIsSaving(false);
  };

  const handleSoftArchive = async (leadId: string) => {
    const confirmArchive = window.confirm('Are you sure you want to archive this lead?');
    if (!confirmArchive) return;

    setIsSaving(true);
    const success = await updateLead(leadId, { status: 'archived' });
    if (success) {
      if (activeLead && activeLead.id === leadId) {
        setActiveLead(null);
      }
      alert('Lead moved to archived');
    }
    setIsSaving(false);
  };

  const openConfirmModal = (type: 'trash' | 'restore' | 'delete', lead: Lead, btnEl: HTMLButtonElement | null) => {
    setTargetLead(lead);
    setModalType(type);
    triggerRef.current = btnEl;
    setModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!targetLead || !modalType) return;
    let success = false;
    if (modalType === 'trash') {
      success = await moveLeadToTrash(targetLead.id);
    } else if (modalType === 'restore') {
      success = await restoreLead(targetLead.id);
    } else if (modalType === 'delete') {
      success = await permanentlyDeleteLead(targetLead.id);
    }

    if (success) {
      setModalOpen(false);
      setActiveLead(null); // Close detail panel
      setTargetLead(null);
      setModalType(null);
    }
  };

  const renderProfileUrl = (urlStr: string | null | undefined): React.ReactNode => {
    if (!urlStr) return <span style={{ color: '#686d61' }}>N/A</span>;
    try {
      const parsed = new URL(urlStr);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return (
          <a
            href={urlStr}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#d7ff00',
              textDecoration: 'underline',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>{urlStr}</span>
            <ExternalLink size={12} />
          </a>
        );
      }
    } catch {
      // Return as plain text on parse fail
    }
    return <span>{urlStr}</span>;
  };

  if (authLoading || isAuthenticated === null) {
    return (
      <div style={{ backgroundColor: '#050604', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5f5ef', fontFamily: 'monospace' }}>
        Verifying session...
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#050604',
        color: '#f5f5ef',
        fontFamily: 'Manrope, sans-serif',
        minHeight: '100vh',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          paddingBottom: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Lead Dashboard
          </h1>
          <p style={{ fontSize: '11px', color: '#686d61', margin: '4px 0 0', fontFamily: 'monospace' }}>
            Internal Content Dost Lead Capture Engine
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              refetch();
              refetchStats();
            }}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#f5f5ef',
              padding: '8px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Refresh Leads"
          >
            <RefreshCw size={14} />
            <span>Sync</span>
          </button>
          <button
            onClick={exportCsv}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#f5f5ef',
              padding: '8px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={logout}
            style={{
              backgroundColor: 'rgba(255, 59, 48, 0.1)',
              border: '1px solid rgba(255, 59, 48, 0.2)',
              borderRadius: '6px',
              color: '#ff3b30',
              padding: '8px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '24px', paddingBottom: '8px' }}>
        <button
          onClick={() => setFilters(prev => ({ ...prev, trash: 'active', page: 1 }))}
          style={{
            background: 'none',
            border: 'none',
            color: filters.trash !== 'trashed' ? '#d7ff00' : '#686d61',
            fontWeight: filters.trash !== 'trashed' ? 'bold' : 'normal',
            borderBottom: filters.trash !== 'trashed' ? '2px solid #d7ff00' : 'none',
            paddingBottom: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}
        >
          Leads
        </button>
        <button
          onClick={() => setFilters(prev => ({ ...prev, trash: 'trashed', page: 1 }))}
          style={{
            background: 'none',
            border: 'none',
            color: filters.trash === 'trashed' ? '#d7ff00' : '#686d61',
            fontWeight: filters.trash === 'trashed' ? 'bold' : 'normal',
            borderBottom: filters.trash === 'trashed' ? '2px solid #d7ff00' : 'none',
            paddingBottom: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>Trash</span>
          {stats && stats.trashed > 0 && (
            <span
              style={{
                backgroundColor: 'rgba(255, 59, 48, 0.15)',
                color: '#ff3b30',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: 'bold',
                border: '1px solid rgba(255, 59, 48, 0.25)',
              }}
            >
              {stats.trashed}
            </span>
          )}
        </button>
      </div>

      {/* Stats Breakdown cards */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {[
          { label: 'Total (Incl. Arch.)', val: stats?.total ?? 0, desc: 'All submissions' },
          { label: 'Active Leads', val: stats?.activeTotal ?? 0, desc: 'Excl. Spam/Arch' },
          { label: 'New', val: stats?.new ?? 0, desc: 'Awaiting triage' },
          { label: 'Contacted', val: stats?.contacted ?? 0, desc: 'First email sent' },
          { label: 'Qualified', val: stats?.qualified ?? 0, desc: 'Verified client' },
          { label: 'Won', val: stats?.won ?? 0, desc: 'Deal closed' },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              backgroundColor: '#0b0e07',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: '8px',
              padding: '16px',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#686d61', fontFamily: 'monospace', display: 'block', marginBottom: '6px' }}>
              {c.label}
            </span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#f5f5ef', display: 'block' }}>
              {isStatsLoading ? '...' : c.val}
            </span>
            <span style={{ fontSize: '9px', color: '#686d61', marginTop: '2px', display: 'block' }}>
              {c.desc}
            </span>
          </div>
        ))}
      </section>

      {/* Filters Area */}
      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          backgroundColor: '#0b0e07',
          padding: '16px',
          borderRadius: '8px',
          alignItems: 'center',
        }}
      >
        {/* Search */}
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#686d61', display: 'flex' }}>
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search name, email, company..."
            value={filters.search}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              padding: '8px 12px 8px 34px',
              color: '#f5f5ef',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Status dropdown */}
        {filters.trash !== 'trashed' && (
          <div style={{ minWidth: '150px' }}>
            <select
              value={filters.status}
              onChange={handleStatusFilterChange}
              style={{
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: '#f5f5ef',
                fontSize: '12px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">All Statuses</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}
      </section>

      {/* Main Grid: Table and details panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: activeLead ? '1.5fr 1fr' : '1fr',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {/* Table Container */}
        <div
          style={{
            backgroundColor: '#0b0e07',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
                  {[
                    { label: filters.trash === 'trashed' ? 'Date Trashed' : 'Date Received', key: filters.trash === 'trashed' ? 'deleted_at' : 'created_at' },
                    { label: 'Name', key: 'name' },
                    { label: 'Email', key: 'email' },
                    { label: 'Company', key: 'company' },
                    { label: 'Budget', key: 'budget' },
                    { label: 'Status', key: 'status' },
                  ].map((col) => {
                    // Check if this column is the active sorting field
                    const isActiveSort = filters.sort === col.key || (filters.trash === 'trashed' && col.key === 'deleted_at' && filters.sort === 'created_at');
                    return (
                      <th
                        key={col.key}
                        onClick={() => handleSortChange(col.key)}
                        style={{
                          padding: '12px 16px',
                          fontWeight: 600,
                          color: '#aaad9f',
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>{col.label}</span>
                          {isActiveSort && (
                            <span style={{ fontSize: '9px', color: '#d7ff00' }}>
                              {filters.order === 'asc' ? '▲' : '▼'}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: '#aaad9f', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#686d61', fontFamily: 'monospace' }}>
                      Loading leads from table...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#686d61' }}>
                      No leads match the specified query filters.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const isSelected = activeLead?.id === lead.id;
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setActiveLead(lead)}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'rgba(215, 255, 0, 0.04)' : 'transparent',
                        }}
                      >
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                          {new Date(filters.trash === 'trashed' && lead.deletedAt ? lead.deletedAt : lead.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 500, color: '#f5f5ef' }}>{lead.name}</td>
                        <td style={{ padding: '12px 16px' }}>{lead.email}</td>
                        <td style={{ padding: '12px 16px', color: '#aaad9f' }}>{lead.company || '-'}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{lead.budget}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                              backgroundColor: 
                                lead.status === 'new' ? 'rgba(215, 255, 0, 0.15)' :
                                lead.status === 'won' ? 'rgba(52, 199, 89, 0.15)' :
                                lead.status === 'lost' ? 'rgba(255, 59, 48, 0.15)' :
                                lead.status === 'spam' ? 'rgba(142, 142, 147, 0.15)' : 'rgba(255, 214, 10, 0.15)',
                              color: 
                                lead.status === 'new' ? '#d7ff00' :
                                lead.status === 'won' ? '#34c759' :
                                lead.status === 'lost' ? '#ff3b30' :
                                lead.status === 'spam' ? '#8e8e93' : '#ffd60a',
                            }}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveLead(lead)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: '#d7ff00',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {pagination.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '11px',
                color: '#aaad9f',
              }}
            >
              <span>
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total leads)
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '4px',
                    color: pagination.page <= 1 ? '#686d61' : '#f5f5ef',
                    padding: '4px 8px',
                    cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '4px',
                    color: pagination.page >= pagination.totalPages ? '#686d61' : '#f5f5ef',
                    padding: '4px 8px',
                    cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lead Detail Panel */}
        {activeLead && (
          <div
            style={{
              backgroundColor: '#0b0e07',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '20px',
              boxSizing: 'border-box',
              position: 'relative',
            }}
          >
            {/* Close action */}
            <button
              onClick={() => setActiveLead(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#686d61',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 16px', paddingRight: '24px' }}>
              Lead details
            </h3>

            {/* Fields list (Plain text rendering) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '12px', marginBottom: '24px' }}>
              <div>
                <span style={{ color: '#686d61', textTransform: 'uppercase', fontSize: '9px', fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>
                  Name
                </span>
                <span style={{ color: '#f5f5ef', fontWeight: 600 }}>{activeLead.name}</span>
              </div>

              <div>
                <span style={{ color: '#686d61', textTransform: 'uppercase', fontSize: '9px', fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>
                  Email Address
                </span>
                <a href={`mailto:${activeLead.email}`} style={{ color: '#d7ff00', textDecoration: 'underline' }}>
                  {activeLead.email}
                </a>
              </div>

              <div>
                <span style={{ color: '#686d61', textTransform: 'uppercase', fontSize: '9px', fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>
                  Company / Brand
                </span>
                <span>{activeLead.company || '-'}</span>
              </div>

              <div>
                <span style={{ color: '#686d61', textTransform: 'uppercase', fontSize: '9px', fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>
                  Website / Profile URL
                </span>
                <div>{renderProfileUrl(activeLead.profile_url)}</div>
              </div>

              <div>
                <span style={{ color: '#686d61', textTransform: 'uppercase', fontSize: '9px', fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>
                  Budget Tier
                </span>
                <span style={{ fontFamily: 'monospace' }}>{activeLead.budget}</span>
              </div>

              <div>
                <span style={{ color: '#686d61', textTransform: 'uppercase', fontSize: '9px', fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>
                  Requested Services
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                  {activeLead.needs.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: '9px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ color: '#686d61', textTransform: 'uppercase', fontSize: '9px', fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>
                  Project Description
                </span>
                <p style={{ margin: 0, padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '6px', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {activeLead.project_details}
                </p>
              </div>

              <div>
                <span style={{ color: '#686d61', textTransform: 'uppercase', fontSize: '9px', fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>
                  Enquiry Source
                </span>
                <span style={{ fontFamily: 'monospace' }}>{activeLead.source}</span>
              </div>

              <div>
                <span style={{ color: '#686d61', textTransform: 'uppercase', fontSize: '9px', fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>
                  Date Received
                </span>
                <span>{new Date(activeLead.created_at).toLocaleString()}</span>
              </div>
            </div>

            {/* Admin Modification Form */}
            {activeLead.deletedAt ? (
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '16px', fontSize: '12px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 12px', color: '#ff3b30' }}>Trashed Lead Actions</h4>
                <p style={{ color: '#aaad9f', fontSize: '11px', marginBottom: '16px', lineHeight: 1.4 }}>
                  This lead is currently in the Trash. You can restore it to the active dashboard or permanently delete it.
                </p>

                {activeLead.internal_notes && (
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ color: '#686d61', textTransform: 'uppercase', fontSize: '9px', fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>
                      Stored Internal Notes
                    </span>
                    <p style={{ margin: 0, padding: '8px', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '6px', whiteSpace: 'pre-wrap' }}>
                      {activeLead.internal_notes}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                  <button
                    disabled={isMutating}
                    onClick={(e) => openConfirmModal('restore', activeLead, e.currentTarget)}
                    style={{
                      backgroundColor: '#d7ff00',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#050604',
                      fontWeight: 700,
                      padding: '10px',
                      cursor: isMutating ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      textAlign: 'center',
                    }}
                  >
                    Restore Lead
                  </button>
                  <button
                    disabled={isMutating}
                    onClick={(e) => openConfirmModal('delete', activeLead, e.currentTarget)}
                    style={{
                      backgroundColor: 'rgba(255, 59, 48, 0.1)',
                      border: '1px solid rgba(255, 59, 48, 0.2)',
                      borderRadius: '6px',
                      color: '#ff3b30',
                      padding: '10px',
                      cursor: isMutating ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      textAlign: 'center',
                    }}
                  >
                    Permanently Delete
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '16px', fontSize: '12px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 12px' }}>Triage Settings</h4>

                {/* Status Select */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  <label htmlFor="lead-status-select" style={{ fontSize: '10px', color: '#aaad9f', fontWeight: 'bold' }}>Status</label>
                  <select
                    id="lead-status-select"
                    value={leadStatus}
                    onChange={(e) => setLeadStatus(e.target.value)}
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '6px',
                      padding: '8px',
                      color: '#f5f5ef',
                      cursor: 'pointer',
                    }}
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Internal Notes Textarea */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  <label htmlFor="lead-notes-area" style={{ fontSize: '10px', color: '#aaad9f', fontWeight: 'bold' }}>Internal Notes (Max 5,000 chars)</label>
                  <textarea
                    id="lead-notes-area"
                    rows={4}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value.substring(0, 5000))}
                    placeholder="Write administrative triage notes here..."
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '6px',
                      padding: '8px',
                      color: '#f5f5ef',
                      fontSize: '12px',
                      resize: 'vertical',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    disabled={isSaving || isMutating}
                    onClick={handleSaveDetails}
                    style={{
                      flex: 1,
                      backgroundColor: '#d7ff00',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#050604',
                      fontWeight: 700,
                      padding: '10px',
                      cursor: isSaving || isMutating ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    Save Changes
                  </button>
                  <button
                    disabled={isSaving || isMutating || leadStatus === 'archived'}
                    onClick={() => handleSoftArchive(activeLead.id)}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      color: '#aaad9f',
                      padding: '10px 14px',
                      cursor: isSaving || isMutating || leadStatus === 'archived' ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    Archive
                  </button>
                </div>

                {/* Move to Trash Button */}
                <button
                  disabled={isSaving || isMutating}
                  onClick={(e) => openConfirmModal('trash', activeLead, e.currentTarget)}
                  style={{
                    backgroundColor: 'rgba(255, 59, 48, 0.1)',
                    border: '1px solid rgba(255, 59, 48, 0.2)',
                    borderRadius: '6px',
                    color: '#ff3b30',
                    padding: '10px 14px',
                    cursor: isSaving || isMutating ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    width: '100%',
                    marginTop: '8px',
                  }}
                >
                  Move to Trash
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accessible Confirmation Dialog */}
      <ConfirmationModal
        isOpen={modalOpen}
        title={
          modalType === 'trash' ? 'Move this lead to Trash?' :
          modalType === 'restore' ? 'Restore this lead?' :
          'Permanently delete this lead?'
        }
        description={
          modalType === 'trash' ? 'The lead will be removed from the active dashboard and can be restored later.' :
          modalType === 'restore' ? 'The lead will return to the active leads dashboard with its previous status and notes.' :
          'This action cannot be undone. All submitted information and internal notes will be permanently removed.'
        }
        confirmText={
          modalType === 'trash' ? 'Move to Trash' :
          modalType === 'restore' ? 'Restore' :
          'DELETE PERMANENTLY'
        }
        isDestructive={modalType === 'trash' || modalType === 'delete'}
        requireTextConfirm={modalType === 'delete'}
        confirmWord="DELETE"
        isLoading={isMutating}
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setModalOpen(false);
          setTargetLead(null);
          setModalType(null);
        }}
        triggerRef={triggerRef}
      />
    </div>
  );
}

// ConfirmationModal Component definition
interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  requireTextConfirm?: boolean;
  confirmWord?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

function ConfirmationModal({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  requireTextConfirm = false,
  confirmWord = 'DELETE',
  isLoading = false,
  onConfirm,
  onCancel,
  triggerRef,
}: ConfirmationModalProps) {
  const [inputText, setInputText] = useState('');
  const modalRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      setInputText('');
      // Trap focus: initial focus
      if (requireTextConfirm) {
        setTimeout(() => inputRef.current?.focus(), 50);
      } else {
        setTimeout(() => cancelBtnRef.current?.focus(), 50);
      }

      // Keyboard listener for escape
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isLoading) {
          onCancel();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    } else {
      // Restore focus to triggering element
      setTimeout(() => triggerRef.current?.focus(), 50);
    }
  }, [isOpen, requireTextConfirm, triggerRef, isLoading, onCancel]);

  if (!isOpen) return null;

  const isConfirmDisabled = isLoading || (requireTextConfirm && inputText !== confirmWord);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: '#0b0e07',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '400px',
          width: '100%',
          boxSizing: 'border-box',
          fontFamily: 'Manrope, sans-serif',
          color: '#f5f5ef',
        }}
      >
        <h3 id="modal-title" style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 800 }}>
          {title}
        </h3>
        <p id="modal-desc" style={{ margin: '0 0 20px', fontSize: '13px', color: '#aaad9f', lineHeight: 1.5 }}>
          {description}
        </p>

        {requireTextConfirm && (
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="confirm-input" style={{ display: 'block', fontSize: '11px', color: '#aaad9f', marginBottom: '6px', fontWeight: 'bold' }}>
              Type <span style={{ color: '#ff3b30', fontFamily: 'monospace' }}>{confirmWord}</span> to confirm:
            </label>
            <input
              id="confirm-input"
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: '#f5f5ef',
                fontSize: '12px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            ref={cancelBtnRef}
            onClick={onCancel}
            disabled={isLoading}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#f5f5ef',
              padding: '8px 16px',
              fontSize: '12px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            style={{
              backgroundColor: isDestructive ? '#ff3b30' : '#d7ff00',
              border: 'none',
              borderRadius: '6px',
              color: isDestructive ? '#ffffff' : '#050604',
              fontWeight: 700,
              padding: '8px 16px',
              fontSize: '12px',
              cursor: isConfirmDisabled ? 'not-allowed' : 'pointer',
              opacity: isConfirmDisabled ? 0.5 : 1,
            }}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
