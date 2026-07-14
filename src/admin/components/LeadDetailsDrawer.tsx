import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Lead } from '../types/lead';
import { X, Calendar, Globe, Check, AlertCircle } from 'lucide-react';
import { LEAD_STATUSES } from '../../../shared/lead-constants';
import type { LeadStatus } from '../../../shared/lead-constants';
import { ConfirmationModal } from './ConfirmationModal';

interface LeadDetailsDrawerProps {
  isOpen: boolean;
  lead: Lead | null;
  isSaving: boolean;
  isTrashed: boolean;
  onClose: () => void;
  onSave: (id: string, updates: { status: LeadStatus; internalNotes: string }) => Promise<boolean>;
  onTrash?: () => void;
  onRestore?: () => void;
  onDelete?: () => void;
}

export const LeadDetailsDrawer: React.FC<LeadDetailsDrawerProps> = ({
  isOpen,
  lead,
  isSaving,
  isTrashed,
  onClose,
  onSave,
  onTrash,
  onRestore,
  onDelete,
}) => {
  const [localStatus, setLocalStatus] = useState<LeadStatus>('new');
  const [localNotes, setLocalNotes] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Sync state with lead prop when it changes
  useEffect(() => {
    if (lead) {
      setLocalStatus(lead.status);
      setLocalNotes(lead.internal_notes || '');
      setSaveError(null);
      setSaveSuccess(false);
    }
  }, [lead]);

  const isDirty = lead ? localStatus !== lead.status || localNotes !== lead.internal_notes : false;

  // Unsaved changes beforeunload handler
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    if (isDirty) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const handleCloseRequest = useCallback(() => {
    if (isDirty) {
      setShowUnsavedModal(true);
    } else {
      onClose();
    }
  }, [isDirty, onClose]);

  // Focus trap, Escape close, and active element recovery
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isSaving) {
          handleCloseRequest();
        }

        // Focus trap
        if (e.key === 'Tab' && drawerRef.current) {
          const focusable = drawerRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length > 0) {
            const first = focusable[0] as HTMLElement;
            const last = focusable[focusable.length - 1] as HTMLElement;
            if (e.shiftKey) {
              if (document.activeElement === first) {
                last.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
              }
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      document.body.classList.add('admin-drawer-open');

      // Autofocus first interactive element (close button)
      setTimeout(() => {
        if (drawerRef.current) {
          const closeBtn = drawerRef.current.querySelector('button');
          if (closeBtn) closeBtn.focus();
        }
      }, 50);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.classList.remove('admin-drawer-open');
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, isSaving, handleCloseRequest]);

  if (!isOpen || !lead) return null;

  const handleDiscardChanges = () => {
    setShowUnsavedModal(false);
    // Reset local states to lead values
    setLocalStatus(lead.status);
    setLocalNotes(lead.internal_notes || '');
    onClose();
  };

  const handleSaveChanges = async () => {
    if (!isDirty || isSaving) return;
    setSaveError(null);
    setSaveSuccess(false);
    
    const success = await onSave(lead.id, {
      status: localStatus,
      internalNotes: localNotes,
    });

    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError('Failed to save changes. Please try again.');
    }
  };

  const isValidUrl = (urlStr: string | null): boolean => {
    if (!urlStr) return false;
    try {
      const parsed = new URL(urlStr);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        {/* Backdrop overlay */}
        <div
          onClick={handleCloseRequest}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
        />

        {/* Drawer container */}
        <div
          ref={drawerRef}
          style={{
            position: 'relative',
            height: '100%',
            backgroundColor: '#0d0f0c',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.6)',
            boxSizing: 'border-box',
          }}
          className="lead-drawer"
        >
          <style>{`
            .lead-drawer {
              width: 100%;
              max-width: 480px;
              animation: drawerSlideLeft 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }

            @keyframes drawerSlideLeft {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }

            @media (max-width: 640px) {
              .lead-drawer {
                max-width: none !important;
              }
            }
          `}</style>

          {/* Sticky Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255, 255, 255, 0.01)',
            }}
          >
            <div>
              <h2
                id="drawer-title"
                style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#f2f4ef',
                }}
              >
                Lead Details
              </h2>
              <span style={{ fontSize: '10px', color: '#686d61', fontFamily: 'monospace' }}>
                ID: {lead.id}
              </span>
            </div>

            <button
              onClick={handleCloseRequest}
              aria-label="Close details"
              style={{
                background: 'none',
                border: 'none',
                color: '#92988d',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f2f4ef')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#92988d')}
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* 1. Contact Section */}
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: 600, color: 'var(--admin-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Contact Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: '#686d61', display: 'block', fontSize: '10px', marginBottom: '2px' }}>Full Name</span>
                  <span style={{ color: '#f2f4ef', fontWeight: 500 }}>{lead.name}</span>
                </div>
                <div>
                  <span style={{ color: '#686d61', display: 'block', fontSize: '10px', marginBottom: '2px' }}>Email Address</span>
                  <a href={`mailto:${lead.email}`} style={{ color: '#fbbf24', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
                    {lead.email}
                  </a>
                </div>
                <div>
                  <span style={{ color: '#686d61', display: 'block', fontSize: '10px', marginBottom: '2px' }}>Company / Brand</span>
                  <span style={{ color: '#f2f4ef' }}>{lead.company || <em style={{ color: '#686d61' }}>Not provided</em>}</span>
                </div>
                <div>
                  <span style={{ color: '#686d61', display: 'block', fontSize: '10px', marginBottom: '2px' }}>Website / Profile URL</span>
                  {lead.profile_url ? (
                    isValidUrl(lead.profile_url) ? (
                      <a
                        href={lead.profile_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#fbbf24', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                      >
                        <Globe size={12} /> {lead.profile_url}
                      </a>
                    ) : (
                      <span style={{ color: '#92988d' }}>{lead.profile_url}</span>
                    )
                  ) : (
                    <em style={{ color: '#686d61' }}>Not provided</em>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Requested Services */}
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: 600, color: 'var(--admin-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Requested Services
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {lead.needs && lead.needs.length > 0 ? (
                  lead.needs.map((need) => (
                    <span
                      key={need}
                      style={{
                        fontSize: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        color: '#f2f4ef',
                      }}
                    >
                      {need}
                    </span>
                  ))
                ) : (
                  <em style={{ color: '#686d61', fontSize: '12px' }}>Not provided</em>
                )}
              </div>
            </div>

            {/* 3. Project Description */}
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: 600, color: 'var(--admin-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Project Description
              </h3>
              <div
                style={{
                  backgroundColor: '#080908',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '12px',
                  color: '#92988d',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {lead.project_details || <em style={{ color: '#686d61' }}>Not provided</em>}
              </div>
            </div>

            {/* 4. Edit Lead Status & Internal Notes */}
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: 600, color: 'var(--admin-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Management
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Status Selector */}
                <div>
                  <label
                    htmlFor="drawer-status-select"
                    style={{ display: 'block', fontSize: '10px', color: '#686d61', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}
                  >
                    Lead Status
                  </label>
                  <select
                    id="drawer-status-select"
                    value={localStatus}
                    onChange={(e) => setLocalStatus(e.target.value as LeadStatus)}
                    style={{
                      width: '100%',
                      backgroundColor: '#080908',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '6px',
                      padding: '8px',
                      color: '#f2f4ef',
                      fontSize: '12px',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Internal Notes */}
                <div>
                  <label
                    htmlFor="drawer-notes-textarea"
                    style={{ display: 'block', fontSize: '10px', color: '#686d61', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}
                  >
                    Internal Notes
                  </label>
                  <textarea
                    id="drawer-notes-textarea"
                    rows={4}
                    value={localNotes}
                    onChange={(e) => setLocalNotes(e.target.value)}
                    placeholder="Write internal notes about this client inquiry..."
                    style={{
                      width: '100%',
                      backgroundColor: '#080908',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: '#f2f4ef',
                      fontSize: '12px',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Inline feedback indicators */}
                {saveError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-danger)', fontSize: '11px' }}>
                    <AlertCircle size={14} />
                    <span>{saveError}</span>
                  </div>
                )}
                {saveSuccess && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-success)', fontSize: '11px' }}>
                    <Check size={14} />
                    <span>Changes saved successfully</span>
                  </div>
                )}
              </div>
            </div>

            {/* 5. Metadata Section */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: '#686d61' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={12} />
                <span>Received: {new Date(lead.created_at).toLocaleString()}</span>
              </div>
              {lead.deletedAt && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-danger)' }}>
                  <Calendar size={12} />
                  <span>Deleted: {new Date(lead.deletedAt).toLocaleString()}</span>
                </div>
              )}
              {lead.source && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={12} />
                  <span>Submission Source: {lead.source}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Actions Footer */}
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255, 255, 255, 0.01)',
              boxSizing: 'border-box',
            }}
          >
            {/* Destructive Actions */}
            <div>
              {isTrashed ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {onRestore && (
                    <button
                      onClick={onRestore}
                      disabled={isSaving}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(98, 196, 141, 0.3)',
                        color: 'var(--admin-success)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: isSaving ? 'default' : 'pointer',
                        transition: 'background-color 120ms',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSaving) e.currentTarget.style.backgroundColor = 'rgba(98, 196, 141, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSaving) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Restore Lead
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={onDelete}
                      disabled={isSaving}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(239, 106, 99, 0.3)',
                        color: 'var(--admin-danger)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: isSaving ? 'default' : 'pointer',
                        transition: 'background-color 120ms',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSaving) e.currentTarget.style.backgroundColor = 'rgba(239, 106, 99, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSaving) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Delete Permanently
                    </button>
                  )}
                </div>
              ) : (
                onTrash && (
                  <button
                    onClick={onTrash}
                    disabled={isSaving}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(239, 106, 99, 0.3)',
                      color: 'var(--admin-danger)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: isSaving ? 'default' : 'pointer',
                      transition: 'background-color 120ms',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSaving) e.currentTarget.style.backgroundColor = 'rgba(239, 106, 99, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSaving) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Move to Trash
                  </button>
                )
              )}
            </div>

            {/* Save Action */}
            <button
              onClick={handleSaveChanges}
              disabled={!isDirty || isSaving}
              style={{
                backgroundColor: 'var(--admin-accent)',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                color: '#080908',
                fontSize: '11px',
                fontWeight: 600,
                cursor: !isDirty || isSaving ? 'default' : 'pointer',
                opacity: !isDirty || isSaving ? 0.5 : 1,
                transition: 'background-color 120ms, opacity 120ms',
              }}
              onMouseEnter={(e) => {
                if (isDirty && !isSaving) e.currentTarget.style.backgroundColor = 'var(--admin-accent-hover)';
              }}
              onMouseLeave={(e) => {
                if (isDirty && !isSaving) e.currentTarget.style.backgroundColor = 'var(--admin-accent)';
              }}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Unsaved changes confirmation modal */}
      <ConfirmationModal
        isOpen={showUnsavedModal}
        title="Unsaved changes"
        message="You have unsaved changes in this lead. Are you sure you want to discard your edits and close?"
        confirmLabel="Discard changes"
        cancelLabel="Continue editing"
        isDestructive={true}
        onConfirm={handleDiscardChanges}
        onCancel={() => setShowUnsavedModal(false)}
      />
    </>
  );
};
