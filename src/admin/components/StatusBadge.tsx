import React from 'react';
import type { LeadStatus } from '../../../shared/lead-constants';

interface StatusBadgeProps {
  status: LeadStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = (statusVal: LeadStatus) => {
    switch (statusVal) {
      case 'new':
        return {
          bg: 'rgba(215, 255, 50, 0.1)',
          color: '#d7ff32',
          border: 'rgba(215, 255, 50, 0.15)',
        };
      case 'contacted':
        return {
          bg: 'rgba(59, 130, 246, 0.1)',
          color: '#60a5fa',
          border: 'rgba(59, 130, 246, 0.15)',
        };
      case 'qualified':
        return {
          bg: 'rgba(6, 182, 212, 0.1)',
          color: '#22d3ee',
          border: 'rgba(6, 182, 212, 0.15)',
        };
      case 'proposal':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          color: '#fbbf24',
          border: 'rgba(245, 158, 11, 0.15)',
        };
      case 'won':
        return {
          bg: 'rgba(98, 196, 141, 0.1)',
          color: '#62c48d',
          border: 'rgba(98, 196, 141, 0.15)',
        };
      case 'lost':
        return {
          bg: 'rgba(156, 163, 175, 0.1)',
          color: '#9ca3af',
          border: 'rgba(156, 163, 175, 0.15)',
        };
      case 'spam':
        return {
          bg: 'rgba(239, 106, 99, 0.1)',
          color: '#ef6a63',
          border: 'rgba(239, 106, 99, 0.15)',
        };
      case 'archived':
        return {
          bg: 'rgba(107, 114, 128, 0.1)',
          color: '#9ca3af',
          border: 'rgba(107, 114, 128, 0.15)',
        };
      default:
        return {
          bg: 'rgba(255, 255, 255, 0.05)',
          color: '#92988d',
          border: 'rgba(255, 255, 255, 0.08)',
        };
    }
  };

  const styles = getStyles(status);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '9999px',
        fontSize: '10px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        backgroundColor: styles.bg,
        color: styles.color,
        border: `1px solid ${styles.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
};
