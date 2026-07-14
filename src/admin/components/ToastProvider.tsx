import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => {
      // Keep a maximum of 3 toasts active to avoid screen clutter
      const newToasts = [...prev, { id, message, type }];
      if (newToasts.length > 3) {
        return newToasts.slice(newToasts.length - 3);
      }
      return newToasts;
    });

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="admin-toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.type === 'error' ? 'alert' : 'status'}
            style={{
              backgroundColor: '#0d0f0c',
              border: `1px solid ${
                toast.type === 'success'
                  ? 'rgba(98, 196, 141, 0.2)'
                  : toast.type === 'error'
                  ? 'rgba(239, 106, 99, 0.2)'
                  : 'rgba(255, 255, 255, 0.08)'
              }`,
              borderRadius: '6px',
              padding: '12px 16px',
              color: '#f2f4ef',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'between',
              gap: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
              transition: 'opacity 150ms ease-in-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor:
                    toast.type === 'success'
                      ? '#62c48d'
                      : toast.type === 'error'
                      ? '#ef6a63'
                      : '#92988d',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontWeight: 400 }}>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss toast"
              style={{
                background: 'none',
                border: 'none',
                color: '#92988d',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '2px',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f2f4ef')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#92988d')}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
