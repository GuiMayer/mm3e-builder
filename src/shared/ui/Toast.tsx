/* ================================================
   Toast Notification Component
   Displays toast messages in bottom-right corner
   ================================================ */

import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, Loader2, X } from 'lucide-react';

export type ToastType = 'info' | 'success' | 'error' | 'loading';

export interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // Auto-dismiss duration in ms (0 = no auto-dismiss)
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const ICONS: Record<ToastType, React.ReactNode> = {
  info: <Info size={20} />,
  success: <CheckCircle size={20} />,
  error: <XCircle size={20} />,
  loading: <Loader2 size={20} className="toast-spinner" />,
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const { id, type, message, duration = 3000 } = toast;

  // Auto-dismiss after duration (if not loading and duration > 0)
  useEffect(() => {
    if (type === 'loading' || duration === 0) return;

    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, type, duration, onDismiss]);

  return (
    <div className={`toast toast--${type}`} role="status" aria-live="polite">
      <div className="toast-icon">{ICONS[type]}</div>
      <div className="toast-message">{message}</div>
      {type !== 'loading' && (
        <button
          className="toast-close"
          onClick={() => onDismiss(id)}
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      )}

      <style>{`
        .toast {
          display: flex;
          align-items: center;
          gap: var(--s-sm, 0.5rem);
          min-width: 280px;
          max-width: 400px;
          padding: var(--s-md, 0.75rem) var(--s-lg, 1rem);
          background: var(--c-surface-elevated, #2a2a2a);
          border: 1px solid var(--c-border, #333);
          border-radius: var(--r-lg, 12px);
          box-shadow: var(--shadow-xl, 0 8px 24px rgba(0, 0, 0, 0.4));
          font-family: var(--f-body, system-ui, sans-serif);
          font-size: 0.9rem;
          color: var(--c-text, #e0e0e0);
          animation: toast-slide-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          margin-bottom: var(--s-sm, 0.5rem);
        }

        @keyframes toast-slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .toast-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toast--info .toast-icon {
          color: var(--c-primary, #3b82f6);
        }

        .toast--success .toast-icon {
          color: var(--c-success, #10b981);
        }

        .toast--error .toast-icon {
          color: var(--c-error, #dc2626);
        }

        .toast--loading .toast-icon {
          color: var(--c-primary, #3b82f6);
        }

        .toast-message {
          flex: 1;
          line-height: 1.4;
        }

        .toast-close {
          flex-shrink: 0;
          background: transparent;
          border: none;
          color: var(--c-text-muted, #999);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: var(--r-sm, 6px);
          transition: all var(--t-fast, 0.15s);
        }

        .toast-close:hover {
          background: var(--c-surface, #1e1e1e);
          color: var(--c-text, #e0e0e0);
        }

        .toast-spinner {
          animation: toast-spin 0.6s linear infinite;
        }

        @keyframes toast-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .toast {
            min-width: unset;
            max-width: calc(100vw - 2rem);
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}

      <style>{`
        .toast-container {
          position: fixed;
          bottom: var(--s-xl, 1.5rem);
          right: var(--s-xl, 1.5rem);
          z-index: 9998;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          pointer-events: none;
        }

        .toast-container > * {
          pointer-events: auto;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .toast-container {
            bottom: var(--s-md, 0.75rem);
            right: var(--s-md, 0.75rem);
            left: var(--s-md, 0.75rem);
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}
