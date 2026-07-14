import React, { useState, useEffect, useRef } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  requiresTextConfirm?: boolean;
  expectedText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  isDestructive = false,
  requiresTextConfirm = false,
  expectedText = 'DELETE',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  const [inputText, setInputText] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap and escape close
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      setInputText('');
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isLoading) {
          onCancel();
        }
        
        // Focus trap
        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      
      // Auto focus the input or the first button
      setTimeout(() => {
        if (modalRef.current) {
          const focusTarget = modalRef.current.querySelector('input') || modalRef.current.querySelector('button');
          if (focusTarget) (focusTarget as HTMLElement).focus();
        }
      }, 50);

      // Disable background scrolling
      document.body.classList.add('admin-drawer-open');
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.classList.remove('admin-drawer-open');
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  const isConfirmDisabled = requiresTextConfirm ? inputText !== expectedText || isLoading : isLoading;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 11000,
        transition: 'opacity 150ms ease-in-out',
      }}
    >
      <div
        ref={modalRef}
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#0d0f0c',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        }}
      >
        <h3
          id="confirmation-modal-title"
          style={{
            margin: '0 0 8px 0',
            fontSize: '14px',
            fontWeight: 600,
            color: '#f2f4ef',
          }}
        >
          {title}
        </h3>
        
        <p
          style={{
            margin: '0 0 16px 0',
            fontSize: '12px',
            color: '#92988d',
            lineHeight: '1.6',
          }}
        >
          {message}
        </p>

        {requiresTextConfirm && (
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="modal-confirm-input"
              style={{
                display: 'block',
                fontSize: '10px',
                color: '#686d61',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              Type <span style={{ color: '#ef6a63' }}>{expectedText}</span> to confirm:
            </label>
            <input
              id="modal-confirm-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={expectedText}
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: '#080908',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: '#f2f4ef',
                fontSize: '12px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              padding: '8px 14px',
              color: '#f2f4ef',
              fontSize: '11px',
              fontWeight: 500,
              cursor: isLoading ? 'default' : 'pointer',
              transition: 'background-color 120ms',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {cancelLabel}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            style={{
              backgroundColor: isDestructive ? 'var(--admin-danger)' : 'var(--admin-accent)',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 14px',
              color: isDestructive ? '#f2f4ef' : '#080908',
              fontSize: '11px',
              fontWeight: 600,
              cursor: isConfirmDisabled ? 'default' : 'pointer',
              opacity: isConfirmDisabled ? 0.5 : 1,
              transition: 'background-color 120ms, opacity 120ms',
            }}
            onMouseEnter={(e) => {
              if (!isConfirmDisabled) {
                e.currentTarget.style.backgroundColor = isDestructive
                  ? 'var(--admin-danger-hover)'
                  : 'var(--admin-accent-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isConfirmDisabled) {
                e.currentTarget.style.backgroundColor = isDestructive
                  ? 'var(--admin-danger)'
                  : 'var(--admin-accent)';
              }
            }}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
