import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ================================================
   ErrorFallback Component
   Default fallback UI for error boundaries
   ================================================ */

interface ErrorFallbackProps {
  error: Error;
  resetError?: () => void;
  showDetails?: boolean;
}

export function ErrorFallback({ error, resetError, showDetails = true }: ErrorFallbackProps) {
  const { t } = useTranslation();

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="error-fallback">
      <div className="error-fallback-content">
        <div className="error-fallback-icon">
          <AlertTriangle size={48} />
        </div>

        <h1 className="error-fallback-title">
          {t('error.boundary.title', 'Something went wrong')}
        </h1>

        <p className="error-fallback-message">
          {t('error.boundary.message', 'An unexpected error occurred. Please try again.')}
        </p>

        {showDetails && (
          <details className="error-fallback-details">
            <summary className="error-fallback-details-summary">
              {t('error.boundary.details', 'Error details')}
            </summary>
            <div className="error-fallback-details-content">
              <p className="error-fallback-error-name">{error.name}</p>
              <p className="error-fallback-error-message">{error.message}</p>
              {error.stack && (
                <pre className="error-fallback-stack">{error.stack}</pre>
              )}
            </div>
          </details>
        )}

        <div className="error-fallback-actions">
          {resetError && (
            <button
              onClick={resetError}
              className="error-fallback-button error-fallback-button--primary"
            >
              <RefreshCw size={16} />
              {t('error.boundary.tryAgain', 'Try again')}
            </button>
          )}

          <button
            onClick={handleReload}
            className="error-fallback-button error-fallback-button--secondary"
          >
            <RefreshCw size={16} />
            {t('error.boundary.reload', 'Reload page')}
          </button>

          <button
            onClick={handleGoHome}
            className="error-fallback-button error-fallback-button--secondary"
          >
            <Home size={16} />
            {t('error.boundary.goHome', 'Go home')}
          </button>
        </div>
      </div>

      <style>{`
        .error-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          padding: var(--s-lg);
          background: var(--c-bg);
        }

        .error-fallback-content {
          max-width: 600px;
          width: 100%;
          text-align: center;
        }

        .error-fallback-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--s-lg);
          color: var(--c-error, #ef4444);
        }

        .error-fallback-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--c-text);
          margin-bottom: var(--s-md);
        }

        .error-fallback-message {
          font-size: 1rem;
          color: var(--c-text-secondary);
          margin-bottom: var(--s-lg);
          line-height: 1.6;
        }

        .error-fallback-details {
          text-align: left;
          margin-bottom: var(--s-lg);
          padding: var(--s-md);
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--r-md);
        }

        .error-fallback-details-summary {
          cursor: pointer;
          font-weight: 600;
          color: var(--c-text-secondary);
          user-select: none;
          padding: var(--s-xs);
        }

        .error-fallback-details-summary:hover {
          color: var(--c-text);
        }

        .error-fallback-details-content {
          margin-top: var(--s-md);
          padding-top: var(--s-md);
          border-top: 1px solid var(--c-border);
        }

        .error-fallback-error-name {
          font-weight: 700;
          color: var(--c-error, #ef4444);
          margin-bottom: var(--s-xs);
        }

        .error-fallback-error-message {
          color: var(--c-text);
          margin-bottom: var(--s-md);
          font-family: var(--f-mono, monospace);
          font-size: 0.9rem;
        }

        .error-fallback-stack {
          background: var(--c-surface-elevated);
          border: 1px solid var(--c-border);
          border-radius: var(--r-sm);
          padding: var(--s-sm);
          overflow-x: auto;
          font-size: 0.75rem;
          line-height: 1.4;
          color: var(--c-text-muted);
          white-space: pre-wrap;
          word-break: break-all;
        }

        .error-fallback-actions {
          display: flex;
          gap: var(--s-sm);
          justify-content: center;
          flex-wrap: wrap;
        }

        .error-fallback-button {
          display: flex;
          align-items: center;
          gap: var(--s-xs);
          padding: var(--s-sm) var(--s-lg);
          border-radius: var(--r-md);
          font-family: var(--f-body);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--t-fast);
          border: 1px solid var(--c-border);
        }

        .error-fallback-button--primary {
          background: var(--c-primary);
          color: var(--c-text-inverse);
          border-color: var(--c-primary);
        }

        .error-fallback-button--primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .error-fallback-button--secondary {
          background: var(--c-surface);
          color: var(--c-text);
        }

        .error-fallback-button--secondary:hover {
          background: var(--c-surface-elevated);
          border-color: var(--c-primary);
        }
      `}</style>
    </div>
  );
}
