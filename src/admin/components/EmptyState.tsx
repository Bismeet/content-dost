import React from 'react';
import { Inbox, Search, Trash2 } from 'lucide-react';

type EmptyStateType = 'no-leads' | 'no-results' | 'empty-trash';

interface EmptyStateProps {
  type: EmptyStateType;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onClearFilters }) => {
  const getContent = () => {
    switch (type) {
      case 'no-leads':
        return {
          icon: <Inbox size={32} strokeWidth={1.5} style={{ color: '#92988d' }} />,
          title: 'No leads yet',
          description: 'New enquiries submitted through your website will appear here.',
          action: null,
        };
      case 'no-results':
        return {
          icon: <Search size={32} strokeWidth={1.5} style={{ color: '#92988d' }} />,
          title: 'No matching leads',
          description: 'Try changing the search text or status filters.',
          action: onClearFilters ? (
            <button
              onClick={onClearFilters}
              style={{
                marginTop: '12px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#f2f4ef',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background-color 150ms',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Clear Filters
            </button>
          ) : null,
        };
      case 'empty-trash':
        return {
          icon: <Trash2 size={32} strokeWidth={1.5} style={{ color: '#92988d' }} />,
          title: 'Trash is empty',
          description: 'Leads moved to Trash will appear here.',
          action: null,
        };
    }
  };

  const content = getContent();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        backgroundColor: '#0d0f0c',
        border: '1px dashed rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        margin: '16px 0',
      }}
    >
      <div style={{ marginBottom: '16px' }}>{content.icon}</div>
      <h3
        style={{
          margin: '0 0 6px 0',
          color: '#f2f4ef',
          fontSize: '14px',
          fontWeight: 600,
        }}
      >
        {content.title}
      </h3>
      <p
        style={{
          margin: 0,
          color: '#92988d',
          fontSize: '12px',
          maxWidth: '320px',
          lineHeight: '1.6',
        }}
      >
        {content.description}
      </p>
      {content.action}
    </div>
  );
};
