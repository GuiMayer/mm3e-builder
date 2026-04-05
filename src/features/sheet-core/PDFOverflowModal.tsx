/* ================================================
   PDFOverflowModal — Overflow Warning Modal
   Shows when PDF field limits are exceeded.
   Lets the user cancel or export anyway.
   ================================================ */

import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { PDFOverflowReport } from '../../services/pdf/pdfFillService';

interface PDFOverflowModalProps {
  report: PDFOverflowReport[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function PDFOverflowModal({ report, onConfirm, onCancel }: PDFOverflowModalProps) {
  const { t } = useTranslation();

  // Close on Escape
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    },
    [onCancel]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="pdf-overflow-backdrop"
        onClick={onCancel}
        role="presentation"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="pdf-overflow-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdf-overflow-title"
      >
        {/* Header */}
        <div className="pdf-overflow-header">
          <span className="pdf-overflow-icon" aria-hidden="true">⚠️</span>
          <h2 id="pdf-overflow-title" className="pdf-overflow-title">
            {t('pdf.overflowTitle')}
          </h2>
        </div>

        {/* Body */}
        <p className="pdf-overflow-body">{t('pdf.overflowBody')}</p>

        <ul className="pdf-overflow-list">
          {report.map((item) => (
            <li key={item.section} className="pdf-overflow-item">
              <div className="pdf-overflow-item-header">
                <strong className="pdf-overflow-section-name">{item.section}</strong>
                <span className="pdf-overflow-count">
                  {item.count} / {item.limit}
                </span>
              </div>
              <div className="pdf-overflow-destination">
                {t('pdf.overflowDestination', { dest: item.destination })}
              </div>
              {item.overflowItems.length > 0 && (
                <ul className="pdf-overflow-items">
                  {item.overflowItems.map((name) => (
                    <li key={name} className="pdf-overflow-item-name">
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="pdf-overflow-actions">
          <button
            id="pdf-overflow-cancel"
            className="pdf-overflow-btn pdf-overflow-btn--cancel"
            onClick={onCancel}
          >
            {t('pdf.overflowCancel')}
          </button>
          <button
            id="pdf-overflow-confirm"
            className="pdf-overflow-btn pdf-overflow-btn--confirm"
            onClick={onConfirm}
            autoFocus
          >
            {t('pdf.overflowConfirm')}
          </button>
        </div>
      </div>

      <style>{`
        .pdf-overflow-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 900;
          animation: pdf-fade-in 0.15s ease;
        }
        .pdf-overflow-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 901;
          width: min(480px, calc(100vw - 2rem));
          background: var(--c-surface-elevated);
          border: 1px solid var(--c-border);
          border-radius: var(--r-lg);
          box-shadow: var(--shadow-lg);
          padding: var(--s-xl);
          animation: pdf-slide-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: var(--f-body);
        }
        @keyframes pdf-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pdf-slide-in {
          from { opacity: 0; transform: translate(-50%, calc(-50% - 12px)); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
        .pdf-overflow-header {
          display: flex;
          align-items: center;
          gap: var(--s-sm);
          margin-bottom: var(--s-md);
        }
        .pdf-overflow-icon {
          font-size: 1.4rem;
          line-height: 1;
        }
        .pdf-overflow-title {
          font-family: var(--f-heading);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--c-text);
          margin: 0;
        }
        .pdf-overflow-body {
          font-size: 0.85rem;
          color: var(--c-text-secondary);
          margin: 0 0 var(--s-md);
          line-height: 1.5;
        }
        .pdf-overflow-list {
          list-style: none;
          margin: 0 0 var(--s-lg);
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--s-sm);
          max-height: 280px;
          overflow-y: auto;
        }
        .pdf-overflow-item {
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          border-radius: var(--r-md);
          padding: var(--s-sm) var(--s-md);
        }
        .pdf-overflow-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        .pdf-overflow-section-name {
          font-size: 0.87rem;
          font-weight: 700;
          color: var(--c-text);
        }
        .pdf-overflow-count {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--c-error, #ef4444);
          background: rgba(239, 68, 68, 0.12);
          padding: 1px 6px;
          border-radius: 999px;
        }
        .pdf-overflow-destination {
          font-size: 0.78rem;
          color: var(--c-text-muted);
          margin-bottom: var(--s-xs);
        }
        .pdf-overflow-items {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .pdf-overflow-item-name {
          font-size: 0.75rem;
          background: var(--c-primary-muted);
          color: var(--c-primary);
          padding: 2px 8px;
          border-radius: 999px;
          font-weight: 500;
        }
        .pdf-overflow-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--s-sm);
        }
        .pdf-overflow-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: var(--s-xs) var(--s-lg);
          border-radius: var(--r-md);
          font-family: var(--f-body);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--t-fast);
          border: 1px solid transparent;
        }
        .pdf-overflow-btn--cancel {
          background: transparent;
          color: var(--c-text-secondary);
          border-color: var(--c-border);
        }
        .pdf-overflow-btn--cancel:hover {
          background: var(--c-surface);
          color: var(--c-text);
        }
        .pdf-overflow-btn--confirm {
          background: var(--c-primary);
          color: #fff;
          border-color: var(--c-primary);
        }
        .pdf-overflow-btn--confirm:hover {
          filter: brightness(1.1);
        }
        .pdf-overflow-btn--confirm:focus-visible {
          outline: 2px solid var(--c-primary);
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}
