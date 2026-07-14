import React from 'react';
import type { Lead } from '../types/lead';
import { StatusBadge } from './StatusBadge';
import { ChevronRight } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  isTrashed: boolean;
  onView: () => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, isTrashed, onView }) => {
  const dateToUse = isTrashed && lead.deletedAt ? lead.deletedAt : lead.created_at;
  const formattedDate = new Date(dateToUse).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      onClick={onView}
      style={{
        backgroundColor: '#0d0f0c',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '6px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        cursor: 'pointer',
        transition: 'border-color 120ms ease-in-out',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', color: '#92988d' }}>{formattedDate}</span>
        <StatusBadge status={lead.status} />
      </div>

      <div>
        <h4 style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: 600, color: '#f2f4ef' }}>{lead.name}</h4>
        <p style={{ margin: 0, fontSize: '11px', color: '#92988d', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {lead.email}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {lead.needs.slice(0, 2).map((need) => (
            <span
              key={need}
              style={{
                fontSize: '9px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                color: '#92988d',
                padding: '1px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              {need}
            </span>
          ))}
          {lead.needs.length > 2 && (
            <span
              style={{
                fontSize: '9px',
                color: '#686d61',
                padding: '1px 2px',
              }}
            >
              +{lead.needs.length - 2}
            </span>
          )}
        </div>

        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--admin-accent)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            fontSize: '11px',
            fontWeight: 500,
            padding: 0,
          }}
        >
          View <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};
