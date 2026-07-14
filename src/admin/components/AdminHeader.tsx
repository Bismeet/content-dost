import React from 'react';
import { RotateCw, Download, Menu } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle: string;
  isRefreshing: boolean;
  isExporting: boolean;
  showMenuButton: boolean;
  onRefresh: () => void;
  onExport: () => void;
  onMenuToggle: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  isRefreshing,
  isExporting,
  showMenuButton,
  onRefresh,
  onExport,
  onMenuToggle,
}) => {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: '#0d0f0c',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {showMenuButton && (
          <button
            onClick={onMenuToggle}
            aria-label="Toggle navigation menu"
            style={{
              background: 'none',
              border: 'none',
              color: '#f2f4ef',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <Menu size={16} />
          </button>
        )}
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 600,
              color: '#f2f4ef',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: '2px 0 0 0',
              fontSize: '11px',
              color: '#92988d',
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Leads"
          aria-label="Refresh Leads"
          style={{
            background: 'none',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#f2f4ef',
            cursor: isRefreshing ? 'default' : 'pointer',
            padding: '8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 120ms',
            opacity: isRefreshing ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isRefreshing) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
          }}
          onMouseLeave={(e) => {
            if (!isRefreshing) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <RotateCw
            size={14}
            className={isRefreshing ? 'admin-spin' : ''}
            style={{
              animation: isRefreshing ? 'adminSpin 1s linear infinite' : 'none',
              transition: 'transform 150ms',
            }}
          />
          <style>{`
            @keyframes adminSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .admin-spin {
              animation: adminSpin 1s linear infinite;
            }
          `}</style>
        </button>

        <button
          onClick={onExport}
          disabled={isExporting}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#f2f4ef',
            cursor: isExporting ? 'default' : 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 500,
            transition: 'background-color 120ms',
            opacity: isExporting ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isExporting) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
          }}
          onMouseLeave={(e) => {
            if (!isExporting) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Download size={12} />
          <span className="export-label-desktop">Export CSV</span>
          <style>{`
            @media (max-width: 640px) {
              .export-label-desktop {
                display: none;
              }
            }
          `}</style>
        </button>
      </div>
    </header>
  );
};
