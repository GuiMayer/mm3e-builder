import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  title?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  title,
}: ButtonProps) {
  return (
    <>
      <button
        className={`btn btn--${variant} btn--${size} ${className}`}
        onClick={onClick}
        disabled={disabled}
        title={title}
      >
        {children}
      </button>

      <style>{`
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--s-xs);
          font-family: var(--f-body);
          font-weight: 600;
          border: 1px solid transparent;
          border-radius: var(--r-md);
          cursor: pointer;
          transition: all var(--t-fast);
          white-space: nowrap;
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn--sm { padding: var(--s-xs) var(--s-sm); font-size: 0.75rem; }
        .btn--md { padding: var(--s-sm) var(--s-md); font-size: 0.85rem; }
        .btn--lg { padding: var(--s-md) var(--s-lg); font-size: 1rem; }

        .btn--primary {
          background: var(--c-primary);
          color: var(--c-text-inverse);
        }
        .btn--primary:hover:not(:disabled) {
          background: var(--c-primary-hover);
          box-shadow: var(--shadow-glow);
        }
        .btn--secondary {
          background: var(--c-surface-elevated);
          color: var(--c-text);
          border-color: var(--c-border);
        }
        .btn--secondary:hover:not(:disabled) {
          border-color: var(--c-primary);
        }
        .btn--ghost {
          background: transparent;
          color: var(--c-text-secondary);
        }
        .btn--ghost:hover:not(:disabled) {
          background: var(--c-primary-muted);
          color: var(--c-text);
        }
        .btn--danger {
          background: var(--c-error);
          color: white;
        }
        .btn--danger:hover:not(:disabled) {
          opacity: 0.9;
        }
      `}</style>
    </>
  );
}
