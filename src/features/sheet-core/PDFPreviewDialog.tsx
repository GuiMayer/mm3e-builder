/* ================================================
   PDF Preview Dialog
   Shows HTML preview with instant modal open and loading state
   ================================================ */

import { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PDFCustomizationPanel } from './PDFCustomizationPanel';
import type { PDFCustomizationOptions } from '../../services/pdf/types';

interface PDFPreviewDialogProps {
  isOpen: boolean;
  isGenerating: boolean;
  html: string | null;
  characterName: string;
  customizationOptions: PDFCustomizationOptions;
  onCustomizationChange: (options: PDFCustomizationOptions) => void;
  onClose: () => void;
  onGeneratePdf: () => Promise<void>;
  onDownloadHtml: () => void;
}

export function PDFPreviewDialog({
  isOpen,
  isGenerating,
  html,
  characterName,
  customizationOptions,
  onCustomizationChange,
  onClose,
  onGeneratePdf,
  onDownloadHtml,
}: PDFPreviewDialogProps) {
  const { t } = useTranslation();
  const [isConverting, setIsConverting] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Determine if actions should be disabled
  const isActionsDisabled = isGenerating || isConverting;

  // Handle PDF generation with loading state
  const handleGeneratePdf = useCallback(async () => {
    setIsConverting(true);
    try {
      await onGeneratePdf();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(t('pdf.preview.error'));
    } finally {
      setIsConverting(false);
    }
  }, [onGeneratePdf, t]);

  // Handle HTML download
  const handleDownloadHtml = useCallback(() => {
    onDownloadHtml();
  }, [onDownloadHtml]);

  // Close handler (prevent closing while converting)
  const handleClose = useCallback(() => {
    if (isActionsDisabled) return;
    onClose();
  }, [isActionsDisabled, onClose]);

  // Handle ESC key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isActionsDisabled) {
        onClose();
      }
    },
    [isActionsDisabled, onClose]
  );

  // Handle backdrop click
  const handleBackdropClick = useCallback(() => {
    if (!isActionsDisabled) {
      onClose();
    }
  }, [isActionsDisabled, onClose]);

  // Setup keyboard listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Reset iframe loaded state when HTML changes
  useEffect(() => {
    if (html) {
      setIframeLoaded(false);
    }
  }, [html]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="pdf-preview-backdrop"
        onClick={handleBackdropClick}
        role="presentation"
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="pdf-preview-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdf-preview-title"
      >
        {/* Header */}
        <div className="pdf-preview-header">
          <div>
            <h2 id="pdf-preview-title" className="pdf-preview-title">
              {t('pdf.preview.title')}
            </h2>
            <p className="pdf-preview-subtitle">
              {characterName}
            </p>
          </div>
          <button
            className="pdf-preview-close-btn"
            onClick={handleClose}
            disabled={isActionsDisabled}
            aria-label={t('pdf.preview.close')}
          >
            ✕
          </button>
        </div>

        {/* Customization Panel */}
        <div className="pdf-preview-sidebar">
          <PDFCustomizationPanel
            options={customizationOptions}
            onChange={onCustomizationChange}
          />
        </div>

        {/* Main Content Area */}
        <div className="pdf-preview-content">
          {/* Control Bar */}
          <div className="pdf-preview-controls">
            <button
              className="pdf-preview-btn pdf-preview-btn--primary"
              onClick={handleGeneratePdf}
              disabled={isActionsDisabled || !html}
            >
              {isConverting ? (
                <>
                  <span className="pdf-preview-spinner" />
                  {t('pdf.preview.converting')}
                </>
              ) : (
                <>
                  <span className="pdf-preview-icon">📄</span>
                  {t('pdf.preview.generatePDF')}
                </>
              )}
            </button>
            <button
              className="pdf-preview-btn pdf-preview-btn--secondary"
              onClick={handleDownloadHtml}
              disabled={isActionsDisabled || !html}
            >
              <span className="pdf-preview-icon">🗂️</span>
              {t('pdf.preview.downloadHTML')}
            </button>
          </div>

          {/* Preview Body */}
          <div className="pdf-preview-body">
            {isGenerating ? (
              <div className="pdf-preview-loading">
                <span className="pdf-preview-spinner" />
                <p>{t('pdf.preview.generatingMessage')}</p>
              </div>
            ) : html && !iframeLoaded ? (
              <div className="pdf-preview-loading">
                <span className="pdf-preview-spinner" />
                <p>Loading preview...</p>
              </div>
            ) : null}
            
            {html && (
              <iframe
                className="pdf-preview-iframe"
                srcDoc={html}
                sandbox="allow-same-origin"
                title="PDF Preview"
                onLoad={() => setIframeLoaded(true)}
                style={{ opacity: iframeLoaded ? 1 : 0 }}
              />
            )}
          </div>
        </div>
      </div>

      <style>{`
        .pdf-preview-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 1000;
          animation: pdf-preview-fade-in 0.2s ease;
        }

        .pdf-preview-modal {
          position: fixed;
          inset: 2rem;
          z-index: 1001;
          background: var(--c-surface-elevated, #1e1e1e);
          border: 1px solid var(--c-border, #333);
          border-radius: var(--r-lg, 12px);
          box-shadow: var(--shadow-xl, 0 20px 60px rgba(0,0,0,0.5));
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: auto 1fr;
          animation: pdf-preview-slide-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: var(--f-body, system-ui, sans-serif);
        }

        @media (min-width: 1024px) {
          .pdf-preview-modal {
            grid-template-columns: 320px 1fr;
            grid-template-rows: auto 1fr;
          }
        }

        @keyframes pdf-preview-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pdf-preview-slide-in {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .pdf-preview-header {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--s-lg, 1rem) var(--s-xl, 1.5rem);
          border-bottom: 1px solid var(--c-border, #333);
          flex-shrink: 0;
        }

        .pdf-preview-sidebar {
          grid-column: 1;
          grid-row: 2;
          border-right: 1px solid var(--c-border, #333);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 1023px) {
          .pdf-preview-sidebar {
            display: none;
          }
        }

        .pdf-preview-content {
          grid-column: 1 / -1;
          grid-row: 2;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        @media (min-width: 1024px) {
          .pdf-preview-content {
            grid-column: 2;
          }
        }

        .pdf-preview-title {
          font-family: var(--f-heading, system-ui, sans-serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--c-text, #e0e0e0);
          margin: 0 0 0.25rem 0;
        }

        .pdf-preview-subtitle {
          font-size: 0.9rem;
          color: var(--c-text-secondary, #999);
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .pdf-preview-close-btn {
          background: transparent;
          border: 1px solid var(--c-border, #333);
          color: var(--c-text-secondary, #999);
          font-size: 1.5rem;
          width: 36px;
          height: 36px;
          border-radius: var(--r-md, 8px);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--t-fast, 0.15s);
          flex-shrink: 0;
        }

        .pdf-preview-close-btn:hover:not(:disabled) {
          background: var(--c-surface, #282828);
          color: var(--c-text, #e0e0e0);
          border-color: var(--c-text-secondary, #999);
        }

        .pdf-preview-close-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pdf-preview-controls {
          display: flex;
          gap: var(--s-sm, 0.5rem);
          padding: var(--s-md, 0.75rem) var(--s-xl, 1.5rem);
          border-bottom: 1px solid var(--c-border, #333);
          background: var(--c-surface, #252525);
          flex-shrink: 0;
        }

        .pdf-preview-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--s-xs, 0.375rem);
          padding: var(--s-sm, 0.5rem) var(--s-lg, 1rem);
          border-radius: var(--r-md, 8px);
          font-family: var(--f-body, system-ui, sans-serif);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--t-fast, 0.15s);
          border: 1px solid transparent;
        }

        .pdf-preview-btn--primary {
          background: var(--c-error, #dc2626);
          color: #fff;
          border-color: var(--c-error, #dc2626);
        }

        .pdf-preview-btn--primary:hover:not(:disabled) {
          filter: brightness(1.15);
        }

        .pdf-preview-btn--secondary {
          background: transparent;
          color: var(--c-text-secondary, #999);
          border-color: var(--c-border, #333);
        }

        .pdf-preview-btn--secondary:hover:not(:disabled) {
          background: var(--c-surface-elevated, #2a2a2a);
          color: var(--c-text, #e0e0e0);
        }

        .pdf-preview-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .pdf-preview-icon {
          font-size: 1.1rem;
          line-height: 1;
        }

        .pdf-preview-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: pdf-preview-spin 0.6s linear infinite;
        }

        @keyframes pdf-preview-spin {
          to { transform: rotate(360deg); }
        }

        .pdf-preview-body {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: var(--c-bg, #1a1a1a);
          padding: var(--s-md, 0.75rem);
        }

        .pdf-preview-loading {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--s-md, 0.75rem);
          color: var(--c-text-secondary, #999);
          z-index: 1;
        }

        .pdf-preview-loading .pdf-preview-spinner {
          width: 32px;
          height: 32px;
          border-width: 3px;
          border-color: var(--c-border, #333);
          border-top-color: var(--c-primary, #3b82f6);
        }

        .pdf-preview-iframe {
          width: 100%;
          height: 100%;
          border: 1px solid var(--c-border, #333);
          border-radius: var(--r-md, 8px);
          background: #fff;
          transition: opacity 0.2s ease;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .pdf-preview-modal {
            inset: 0;
            border-radius: 0;
          }

          .pdf-preview-header {
            padding: var(--s-md, 0.75rem);
          }

          .pdf-preview-title {
            font-size: 1rem;
          }

          .pdf-preview-subtitle {
            font-size: 0.8rem;
          }

          .pdf-preview-options {
            padding: var(--s-sm, 0.5rem);
          }

          .pdf-preview-controls {
            flex-direction: column;
            padding: var(--s-sm, 0.5rem);
          }

          .pdf-preview-btn {
            width: 100%;
            min-height: 44px;
            padding: var(--s-sm, 0.5rem) var(--s-md, 0.75rem);
          }

          .pdf-preview-body {
            padding: var(--s-sm, 0.5rem);
          }
        }
      `}</style>
    </>
  );
}
