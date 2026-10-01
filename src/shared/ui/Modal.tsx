import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  compact?: boolean;
  children: ReactNode;
}

let scrollLocks = 0;
let originalOverflow = '';

export function Modal({ isOpen, onClose, title, compact, children }: ModalProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!isOpen) return;
    const mountedContent = contentRef.current;
    if (!mountedContent) return;
    const content: HTMLDivElement = mountedContent;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (scrollLocks++ === 0) originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => Array.from(content.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]',
    )).filter((element) => element.getClientRects().length > 0);
    const isTopmost = () => Array.from(document.querySelectorAll('[role="dialog"][aria-modal="true"]')).at(-1) === content;
    (focusable()[0] ?? content).focus();
    function handleKey(e: KeyboardEvent) {
      if (!isTopmost() || e.defaultPrevented) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
      } else if (e.key === 'Tab') {
        const targets = focusable();
        const first = targets[0] ?? content;
        const last = targets.at(-1) ?? content;
        if (!content.contains(document.activeElement) || (e.shiftKey ? document.activeElement === first : document.activeElement === last)) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        }
      }
    }
    function containFocus(e: FocusEvent) {
      if (isTopmost() && !content.contains(e.target as Node)) (focusable()[0] ?? content).focus();
    }
    document.addEventListener('keydown', handleKey);
    document.addEventListener('focusin', containFocus);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('focusin', containFocus);
      if (--scrollLocks === 0) document.body.style.overflow = originalOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div ref={contentRef} data-mm-modal role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : t('builder.title')} tabIndex={-1} className={`modal-content ${compact ? 'modal-content--compact' : ''}`} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="modal-header">
            <h2 id={titleId} className="modal-title">{title}</h2>
            <button className="modal-close" onClick={onClose} aria-label={t('builder.close')}>
              <X size={20} />
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        .modal-content {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--r-lg);
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--s-md) var(--s-lg);
          border-bottom: 1px solid var(--c-border);
        }
        .modal-title {
          font-size: 1.1rem;
          font-weight: 700;
        }
        .modal-close {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--c-text-secondary);
          cursor: pointer;
          padding: var(--s-xs);
          border-radius: var(--r-sm);
          transition: all var(--t-fast);
        }
        .modal-close:hover {
          background: var(--c-primary-muted);
          color: var(--c-text);
        }
        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: var(--s-lg);
        }
        .modal-content--compact {
          width: auto;
          height: auto;
          max-width: 480px;
          max-height: 80vh;
          border-radius: var(--r-lg);
          animation: slideUp 0.25s ease;
        }
      `}</style>
    </div>
  );
}
