import { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ICharacter } from '../../entities/types';

interface DraftNotificationProps {
  character: ICharacter;
  onDismiss: () => void;
  onStartNew: () => void;
}

/**
 * Banner notification that appears when a draft is auto-loaded.
 * Shows character name and provides options to continue or start fresh.
 * Auto-dismisses after 10 seconds if user doesn't interact.
 */
export function DraftNotification({ character, onDismiss, onStartNew }: DraftNotificationProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // Wait for fade-out animation
    }, 10000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  const handleStartNew = () => {
    setVisible(false);
    setTimeout(onStartNew, 300);
  };

  const characterName = character.header.name || t('draftNotification.unnamedCharacter');

  return (
    <div className={`draft-notification ${visible ? 'draft-notification--visible' : ''}`}>
      <div className="draft-notification-content">
        <FileText size={20} className="draft-notification-icon" />
        <div className="draft-notification-text">
          <strong>{t('draftNotification.title')}</strong>
          <span className="draft-notification-character">{characterName}</span>
        </div>
      </div>
      <div className="draft-notification-actions">
        <button
          className="draft-notification-btn draft-notification-btn--primary"
          onClick={handleDismiss}
          title={t('draftNotification.continue')}
        >
          {t('draftNotification.continue')}
        </button>
        <button
          className="draft-notification-btn draft-notification-btn--secondary"
          onClick={handleStartNew}
          title={t('draftNotification.startNew')}
        >
          {t('draftNotification.startNew')}
        </button>
        <button
          className="draft-notification-close"
          onClick={handleDismiss}
          aria-label={t('common.close')}
        >
          <X size={18} />
        </button>
      </div>

      <style>{`
        .draft-notification {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background: linear-gradient(135deg, var(--c-primary), var(--c-accent));
          color: white;
          padding: var(--s-md) var(--s-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--s-md);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transform: translateY(-100%);
          opacity: 0;
          transition: all 0.3s ease-out;
        }

        .draft-notification--visible {
          transform: translateY(0);
          opacity: 1;
        }

        .draft-notification-content {
          display: flex;
          align-items: center;
          gap: var(--s-md);
          flex: 1;
        }

        .draft-notification-icon {
          flex-shrink: 0;
          opacity: 0.9;
        }

        .draft-notification-text {
          display: flex;
          flex-direction: column;
          gap: var(--s-xs);
        }

        .draft-notification-text strong {
          font-size: 0.95rem;
          font-weight: 600;
        }

        .draft-notification-character {
          font-size: 0.85rem;
          opacity: 0.9;
        }

        .draft-notification-actions {
          display: flex;
          align-items: center;
          gap: var(--s-sm);
        }

        .draft-notification-btn {
          padding: var(--s-xs) var(--s-md);
          border-radius: var(--r-sm);
          border: none;
          font-family: var(--f-body);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--t-fast);
          white-space: nowrap;
        }

        .draft-notification-btn--primary {
          background: rgba(255, 255, 255, 0.25);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .draft-notification-btn--primary:hover {
          background: rgba(255, 255, 255, 0.35);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .draft-notification-btn--secondary {
          background: rgba(0, 0, 0, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .draft-notification-btn--secondary:hover {
          background: rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .draft-notification-close {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: var(--s-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--r-sm);
          transition: background var(--t-fast);
          opacity: 0.8;
        }

        .draft-notification-close:hover {
          background: rgba(255, 255, 255, 0.15);
          opacity: 1;
        }

        @media (max-width: 768px) {
          .draft-notification {
            flex-direction: column;
            align-items: stretch;
            gap: var(--s-sm);
          }

          .draft-notification-actions {
            justify-content: flex-end;
          }

          .draft-notification-close {
            position: absolute;
            top: var(--s-sm);
            right: var(--s-sm);
          }
        }
      `}</style>
    </div>
  );
}
