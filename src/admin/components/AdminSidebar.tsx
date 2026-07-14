import React, { useEffect, useRef } from 'react';
import { Inbox, Trash2, LogOut, X } from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'leads' | 'trash';
  onTabChange: (tab: 'leads' | 'trash') => void;
  trashCount: number;
  adminEmail: string | null;
  onLogout: () => void;
  menuButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  trashCount,
  adminEmail,
  onLogout,
  menuButtonRef,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close on Escape when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }

        // Focus trap when mobile drawer is open
        if (e.key === 'Tab' && sidebarRef.current) {
          const focusable = sidebarRef.current.querySelectorAll(
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
      
      // Prevent background scrolling
      document.body.classList.add('admin-drawer-open');

      // Set focus to the first interactive element in sidebar (close button or first menu item)
      setTimeout(() => {
        if (sidebarRef.current) {
          const closeBtn = sidebarRef.current.querySelector('button');
          if (closeBtn) closeBtn.focus();
        }
      }, 50);

      const currentMenuBtn = menuButtonRef?.current;

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.classList.remove('admin-drawer-open');
        
        // Restore focus to menu button when closed
        if (currentMenuBtn) {
          currentMenuBtn.focus();
        }
      };
    }
  }, [isOpen, onClose, menuButtonRef]);

  const navItems = [
    {
      id: 'leads' as const,
      label: 'Leads',
      icon: <Inbox size={14} />,
      badge: null,
    },
    {
      id: 'trash' as const,
      label: 'Trash',
      icon: <Trash2 size={14} />,
      badge: trashCount > 0 ? (
        <span
          style={{
            backgroundColor: 'var(--admin-danger)',
            color: '#f2f4ef',
            fontSize: '9px',
            fontWeight: 700,
            padding: '1px 5px',
            borderRadius: '10px',
            marginLeft: 'auto',
          }}
        >
          {trashCount}
        </span>
      ) : null,
    },
  ];

  const sidebarContent = (
    <div
      ref={sidebarRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#0d0f0c',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      {/* Header section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.05em', color: '#f2f4ef' }}>
          CD <span style={{ color: 'var(--admin-accent)', fontWeight: 500 }}>ADMIN</span>
        </span>

        {/* Mobile close button */}
        <button
          className="sidebar-close-btn-mobile"
          onClick={onClose}
          aria-label="Close menu"
          style={{
            background: 'none',
            border: 'none',
            color: '#92988d',
            cursor: 'pointer',
            padding: '4px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Navigation list */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isActive ? 'rgba(215, 255, 50, 0.08)' : 'transparent',
                color: isActive ? 'var(--admin-accent)' : '#92988d',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 120ms ease-in-out',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#f2f4ef';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#92988d';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge}
            </button>
          );
        })}
      </nav>

      {/* Footer section (Administrator profile & Logout) */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(255, 255, 255, 0.01)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {adminEmail && (
          <div style={{ overflow: 'hidden' }}>
            <span
              style={{
                display: 'block',
                fontSize: '9px',
                color: '#686d61',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginBottom: '2px',
              }}
            >
              Logged In As
            </span>
            <span
              title={adminEmail}
              style={{
                display: 'block',
                fontSize: '11px',
                color: '#92988d',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {adminEmail}
            </span>
          </div>
        )}

        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            width: '100%',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'transparent',
            color: '#ef6a63',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 120ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 106, 99, 0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <LogOut size={12} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .sidebar-desktop-container {
          width: 220px;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          display: block;
          height: 100vh;
          position: sticky;
          top: 0;
          flex-shrink: 0;
        }

        .sidebar-mobile-drawer {
          display: none;
        }

        @media (max-width: 1024px) {
          .sidebar-desktop-container {
            display: none !important;
          }

          .sidebar-mobile-drawer {
            display: block !important;
          }

          .sidebar-close-btn-mobile {
            display: flex !important;
          }
        }
      `}</style>

      {/* Desktop sidebar */}
      <div className="sidebar-desktop-container">{sidebarContent}</div>

      {/* Mobile sidebar overlay drawer */}
      {isOpen && (
        <div
          className="sidebar-mobile-drawer"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 10500,
            display: 'flex',
          }}
        >
          {/* Backdrop overlay */}
          <div
            onClick={onClose}
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
            style={{
              position: 'relative',
              width: '240px',
              height: '100%',
              backgroundColor: '#0d0f0c',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 24px rgba(0, 0, 0, 0.6)',
              animation: 'drawerSlideIn 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <style>{`
              @keyframes drawerSlideIn {
                from { transform: translateX(-100%); }
                to { transform: translateX(0); }
              }
            `}</style>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
