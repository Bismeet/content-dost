import React, { useRef } from 'react';
import type { Lead } from '../types/lead';
import { StatusBadge } from './StatusBadge';
import { Eye, RotateCcw, Trash2 } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  isTrashed: boolean;
  selectedLeadId: string | null;
  onLeadSelect: (lead: Lead) => void;
  onTrashClick?: (lead: Lead) => void;
  onRestoreClick?: (lead: Lead) => void;
  onDeleteClick?: (lead: Lead) => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  isTrashed,
  selectedLeadId,
  onLeadSelect,
  onTrashClick,
  onRestoreClick,
  onDeleteClick,
}) => {
  const rowRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>, lead: Lead) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onLeadSelect(lead);
    }
  };

  const getFormattedDate = (lead: Lead) => {
    const dateStr = isTrashed && lead.deletedAt ? lead.deletedAt : lead.created_at;
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderServices = (needs: string[]) => {
    if (!needs || needs.length === 0) return '-';
    const firstService = needs[0];
    if (needs.length === 1) return firstService;
    return (
      <span title={needs.join(', ')}>
        {firstService} <span style={{ color: '#686d61', fontSize: '9px', fontWeight: 600 }}>+{needs.length - 1}</span>
      </span>
    );
  };

  return (
    <div
      style={{
        backgroundColor: '#0d0f0c',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '6px',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                position: 'sticky',
                top: 0,
                zIndex: 10,
              }}
            >
              <th style={{ padding: '10px 16px', fontWeight: 600, color: '#92988d' }}>
                {isTrashed ? 'Deleted At' : 'Date Received'}
              </th>
              <th style={{ padding: '10px 16px', fontWeight: 600, color: '#92988d' }}>Name</th>
              <th style={{ padding: '10px 16px', fontWeight: 600, color: '#92988d' }}>Email</th>
              <th style={{ padding: '10px 16px', fontWeight: 600, color: '#92988d' }}>Company</th>
              <th style={{ padding: '10px 16px', fontWeight: 600, color: '#92988d' }}>Services</th>
              <th style={{ padding: '10px 16px', fontWeight: 600, color: '#92988d' }}>Status</th>
              <th style={{ padding: '10px 16px', fontWeight: 600, color: '#92988d', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const isSelected = selectedLeadId === lead.id;
              return (
                <tr
                  key={lead.id}
                  ref={(el) => { rowRefs.current[lead.id] = el; }}
                  tabIndex={0}
                  onClick={() => onLeadSelect(lead)}
                  onKeyDown={(e) => handleKeyDown(e, lead)}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    backgroundColor: isSelected ? 'rgba(215, 255, 50, 0.04)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 120ms',
                    outline: 'none',
                  }}
                  className="lead-table-row"
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.01)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={{ padding: '10px 16px', color: '#92988d', whiteSpace: 'nowrap' }}>
                    {getFormattedDate(lead)}
                  </td>
                  <td style={{ padding: '10px 16px', fontWeight: 500, color: '#f2f4ef', whiteSpace: 'nowrap' }}>
                    {lead.name}
                  </td>
                  <td
                    style={{
                      padding: '10px 16px',
                      color: '#92988d',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '180px',
                    }}
                  >
                    {lead.email}
                  </td>
                  <td style={{ padding: '10px 16px', color: '#92988d', whiteSpace: 'nowrap' }}>
                    {lead.company || '-'}
                  </td>
                  <td style={{ padding: '10px 16px', color: '#92988d', whiteSpace: 'nowrap' }}>
                    {renderServices(lead.needs)}
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <StatusBadge status={lead.status} />
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLeadSelect(lead);
                        }}
                        title="View Details"
                        aria-label="View Details"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--admin-accent)',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '4px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(215, 255, 50, 0.08)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <Eye size={14} />
                      </button>

                      {isTrashed ? (
                        <>
                          {onRestoreClick && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRestoreClick(lead);
                              }}
                              title="Restore Lead"
                              aria-label="Restore Lead"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--admin-success)',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(98, 196, 141, 0.08)')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <RotateCcw size={14} />
                            </button>
                          )}
                          {onDeleteClick && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClick(lead);
                              }}
                              title="Permanently Delete"
                              aria-label="Permanently Delete"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--admin-danger)',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 106, 99, 0.08)')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </>
                      ) : (
                        onTrashClick && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTrashClick(lead);
                            }}
                            title="Move to Trash"
                            aria-label="Move to Trash"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#92988d',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '4px',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = 'var(--admin-danger)';
                              e.currentTarget.style.backgroundColor = 'rgba(239, 106, 99, 0.08)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#92988d';
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
