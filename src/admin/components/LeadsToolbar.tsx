import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ListFilter } from 'lucide-react';
import { LEAD_STATUSES } from '../../../shared/lead-constants';

interface LeadsToolbarProps {
  search: string;
  status: string;
  sort: string;
  order: 'asc' | 'desc';
  isTrashed: boolean;
  totalCount: number;
  onFilterChange: (updates: {
    search?: string;
    status?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    page?: number;
  }) => void;
}

export const LeadsToolbar: React.FC<LeadsToolbarProps> = ({
  search,
  status,
  sort,
  order,
  isTrashed,
  totalCount,
  onFilterChange,
}) => {
  const [localSearch, setLocalSearch] = useState(search);
  const debounceTimerRef = useRef<number | null>(null);

  // Sync local search state with parent prop (e.g. when filters are reset)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Handle local search input change with 300ms debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      onFilterChange({ search: val, page: 1 });
    }, 300);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    onFilterChange({ search: '', page: 1 });
  };

  const isFiltered =
    search !== '' ||
    status !== '' ||
    sort !== (isTrashed ? 'deleted_at' : 'created_at') ||
    order !== 'desc';

  const handleResetFilters = () => {
    setLocalSearch('');
    onFilterChange({
      search: '',
      status: '',
      sort: isTrashed ? 'deleted_at' : 'created_at',
      order: 'desc',
      page: 1,
    });
  };

  const sortOptions = [
    { label: isTrashed ? 'Date Trashed' : 'Date Received', value: isTrashed ? 'deleted_at' : 'created_at' },
    { label: 'Client Name', value: 'name' },
    { label: 'Email Address', value: 'email' },
    { label: 'Company / Brand', value: 'company' },
    { label: 'Lead Status', value: 'status' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '16px',
        padding: '12px 16px',
        backgroundColor: '#0d0f0c',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '6px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
        className="toolbar-inner"
      >
        <style>{`
          .toolbar-inner {
            display: flex;
            flex-direction: column;
          }
          @media (min-width: 768px) {
            .toolbar-inner {
              flex-direction: row !important;
              align-items: center !important;
              justify-content: space-between !important;
            }
          }
        `}</style>

        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#686d61',
            }}
          />
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Search leads by name, email, or company..."
            style={{
              width: '100%',
              backgroundColor: '#080908',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              padding: '8px 12px 8px 34px',
              color: '#f2f4ef',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 150ms',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--admin-accent)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
          />
          {localSearch && (
            <button
              onClick={handleClearSearch}
              aria-label="Clear search"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#92988d',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f2f4ef')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#92988d')}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Dropdowns & Selects wrapper */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#686d61', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ListFilter size={12} /> Status:
            </span>
            <select
              value={status}
              onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
              style={{
                backgroundColor: '#080908',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '6px 24px 6px 8px',
                color: '#f2f4ef',
                fontSize: '11px',
                outline: 'none',
                cursor: 'pointer',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%2392988d\' height=\'10\' viewBox=\'0 0 24 24\' width=\'10\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
              }}
            >
              <option value="">All Statuses</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Field */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#686d61' }}>Sort:</span>
            <select
              value={sort}
              onChange={(e) => onFilterChange({ sort: e.target.value, page: 1 })}
              style={{
                backgroundColor: '#080908',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '6px 24px 6px 8px',
                color: '#f2f4ef',
                fontSize: '11px',
                outline: 'none',
                cursor: 'pointer',
                WebkitAppearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%2392988d\' height=\'10\' viewBox=\'0 0 24 24\' width=\'10\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
              }}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <select
            value={order}
            onChange={(e) => onFilterChange({ order: e.target.value as 'asc' | 'desc', page: 1 })}
            style={{
              backgroundColor: '#080908',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              padding: '6px 24px 6px 8px',
              color: '#f2f4ef',
              fontSize: '11px',
              outline: 'none',
              cursor: 'pointer',
              WebkitAppearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%2392988d\' height=\'10\' viewBox=\'0 0 24 24\' width=\'10\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
            }}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>

          {/* Reset filters button */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--admin-danger)',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '6px 8px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '10px', color: '#686d61' }}>
        Found {totalCount} lead{totalCount !== 1 ? 's' : ''}
      </div>
    </div>
  );
};
