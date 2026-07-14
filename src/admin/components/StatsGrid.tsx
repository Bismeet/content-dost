import React from 'react';
import type { LeadStats } from '../types/lead';
import { Users, FileText, CheckCircle, Trash2, ArrowUpRight, MessageSquare } from 'lucide-react';

interface StatsGridProps {
  stats: LeadStats | null;
  activeStatusFilter: string;
  onFilterClick?: (status: string) => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, activeStatusFilter, onFilterClick }) => {
  if (!stats) return null;

  const cards = [
    {
      label: 'Total Leads',
      value: stats.total,
      description: 'Active inquiries',
      icon: <Users size={16} style={{ color: '#92988d' }} />,
      statusKey: '',
    },
    {
      label: 'New',
      value: stats.new,
      description: 'Awaiting response',
      icon: <ArrowUpRight size={16} style={{ color: '#fbbf24' }} />,
      statusKey: 'new',
    },
    {
      label: 'Contacted',
      value: stats.contacted,
      description: 'In conversation',
      icon: <MessageSquare size={16} style={{ color: '#60a5fa' }} />,
      statusKey: 'contacted',
    },
    {
      label: 'Qualified',
      value: stats.qualified,
      description: 'Match criteria',
      icon: <FileText size={16} style={{ color: '#22d3ee' }} />,
      statusKey: 'qualified',
    },
    {
      label: 'Won',
      value: stats.won,
      description: 'Converted deals',
      icon: <CheckCircle size={16} style={{ color: '#62c48d' }} />,
      statusKey: 'won',
    },
    {
      label: 'Trash',
      value: stats.trashed,
      description: 'Soft-deleted records',
      icon: <Trash2 size={16} style={{ color: '#ef6a63' }} />,
      statusKey: 'trashed', // Wait, trash view is handled via filters.trash === 'trashed', not status filter
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '20px',
      }}
      className="stats-grid-desktop"
    >
      <style>{`
        @media (min-width: 640px) {
          .stats-grid-desktop {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (min-width: 1024px) {
          .stats-grid-desktop {
            grid-template-columns: repeat(6, 1fr) !important;
          }
        }
      `}</style>
      {cards.map((card) => {
        const isClickable = onFilterClick && card.statusKey !== 'trashed';
        const isActive = isClickable && activeStatusFilter === card.statusKey;

        return (
          <div
            key={card.label}
            onClick={() => {
              if (isClickable && onFilterClick) {
                onFilterClick(card.statusKey);
              }
            }}
            style={{
              backgroundColor: '#0d0f0c',
              border: isActive ? '1px solid var(--admin-accent)' : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'between',
              cursor: isClickable ? 'pointer' : 'default',
              transition: 'all 120ms ease-in-out',
              userSelect: 'none',
            }}
            onMouseEnter={(e) => {
              if (isClickable) {
                e.currentTarget.style.borderColor = isActive ? 'var(--admin-accent)' : 'rgba(255, 255, 255, 0.16)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (isClickable) {
                e.currentTarget.style.borderColor = isActive ? 'var(--admin-accent)' : 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'none';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#92988d', fontWeight: 500 }}>{card.label}</span>
              {card.icon}
            </div>
            <div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#f2f4ef', display: 'block', lineHeight: 1.2 }}>
                {card.value}
              </span>
              <span style={{ fontSize: '10px', color: '#686d61', marginTop: '2px', display: 'block' }}>
                {card.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
