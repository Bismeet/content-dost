import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalResults,
  limit,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    if (totalResults === 0) return null;
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          fontSize: '11px',
          color: '#92988d',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <span>Showing all {totalResults} result{totalResults !== 1 ? 's' : ''}</span>
      </div>
    );
  }

  const startIdx = (currentPage - 1) * limit + 1;
  const endIdx = Math.min(currentPage * limit, totalResults);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        fontSize: '11px',
        color: '#92988d',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
      }}
    >
      <div>
        Showing <span style={{ color: '#f2f4ef', fontWeight: 500 }}>{startIdx}</span> to{' '}
        <span style={{ color: '#f2f4ef', fontWeight: 500 }}>{endIdx}</span> of{' '}
        <span style={{ color: '#f2f4ef', fontWeight: 500 }}>{totalResults}</span> result{totalResults !== 1 ? 's' : ''}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'transparent',
            color: currentPage === 1 ? '#4b5563' : '#f2f4ef',
            cursor: currentPage === 1 ? 'default' : 'pointer',
            transition: 'background-color 120ms',
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <ChevronLeft size={14} />
        </button>

        <span style={{ fontSize: '11px', color: '#92988d' }}>
          Page <span style={{ color: '#f2f4ef', fontWeight: 500 }}>{currentPage}</span> of{' '}
          <span style={{ color: '#f2f4ef', fontWeight: 500 }}>{totalPages}</span>
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'transparent',
            color: currentPage === totalPages ? '#4b5563' : '#f2f4ef',
            cursor: currentPage === totalPages ? 'default' : 'pointer',
            transition: 'background-color 120ms',
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
