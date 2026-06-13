import { useEffect } from 'react';
import { X, Eraser, Download, Upload, FileSpreadsheet, FileText, BookOpen, Shield, ShieldOff, Trash2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ThemeSelector } from './ThemeSelector';
import { LanguageSelector } from './LanguageSelector';
import type { IValidationRules } from '../../entities/types';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  onExport: () => void;
  onImport: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  isPdfLoading: boolean;
  theme: string;
  onThemeChange: (theme: string) => void;
  themes: Array<{ id: string; label: string }>;
  language: string;
  onLanguageChange: (lang: string) => void;
  languages: Array<{ id: string; label: string }>;
  campaignMode: boolean;
  onCampaignModeToggle: () => void;
  hasLogEntries: boolean;
  validationRules: IValidationRules | undefined;
  onValidationRulesChange: (rules: Partial<IValidationRules>) => void;
  onClearDraft: () => void;
}

export function MobileDrawer({
  isOpen,
  onClose,
  onClear,
  onExport,
  onImport,
  onExportExcel,
  onExportPDF,
  isPdfLoading,
  theme,
  onThemeChange,
  themes,
  language,
  onLanguageChange,
  languages,
  campaignMode,
  onCampaignModeToggle,
  hasLogEntries,
  validationRules,
  onValidationRulesChange,
  onClearDraft,
}: MobileDrawerProps) {
  const { t } = useTranslation();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="mobile-drawer-backdrop" onClick={onClose} />

      {/* Drawer */}
      <div className="mobile-drawer" role="dialog" aria-modal="true">
        <div className="mobile-drawer-header">
          <h2 className="mobile-drawer-title">{t('menu.settings')}</h2>
          <button className="mobile-drawer-close" onClick={onClose} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <div className="mobile-drawer-content">
          {/* Actions Section */}
          <div className="mobile-drawer-section">
            <span className="mobile-drawer-label">{t('menu.actions') || 'Actions'}</span>
            <button className="mobile-drawer-item" onClick={() => handleAction(onClear)}>
              <Eraser size={20} />
              <span>{t('menu.clear')}</span>
            </button>
            <button className="mobile-drawer-item" onClick={() => handleAction(onExport)}>
              <Download size={20} />
              <span>{t('menu.export')}</span>
            </button>
            <button className="mobile-drawer-item" onClick={() => handleAction(onImport)}>
              <Upload size={20} />
              <span>{t('menu.import')}</span>
            </button>
            <button className="mobile-drawer-item" onClick={() => handleAction(onExportExcel)}>
              <FileSpreadsheet size={20} />
              <span>{t('menu.exportExcel')}</span>
            </button>
            <button
              className="mobile-drawer-item"
              onClick={() => handleAction(onExportPDF)}
              disabled={isPdfLoading}
            >
              {isPdfLoading ? <Loader2 size={20} className="spin" /> : <FileText size={20} />}
              <span>{isPdfLoading ? t('pdf.generating') : t('menu.exportPdf')}</span>
            </button>
          </div>

          <div className="mobile-drawer-divider" />

          {/* Theme Section */}
          <div className="mobile-drawer-section">
            <span className="mobile-drawer-label">{t('menu.theme')}</span>
            <ThemeSelector theme={theme} onThemeChange={onThemeChange} themes={themes} />
          </div>

          <div className="mobile-drawer-divider" />

          {/* Language Section */}
          <div className="mobile-drawer-section">
            <span className="mobile-drawer-label">{t('menu.language')}</span>
            <LanguageSelector language={language} onLanguageChange={onLanguageChange} languages={languages} />
          </div>

          <div className="mobile-drawer-divider" />

          {/* Campaign Mode Section */}
          <div className="mobile-drawer-section">
            <span className="mobile-drawer-label">{t('menu.campaignMode')}</span>
            <button
              className={`mobile-drawer-item ${campaignMode ? 'active' : ''} ${hasLogEntries && campaignMode ? 'disabled' : ''}`}
              onClick={onCampaignModeToggle}
              disabled={hasLogEntries && campaignMode}
            >
              <BookOpen size={20} />
              <span>
                {campaignMode ? t('menu.campaignMode.active') : t('menu.campaignMode.disabled')}
              </span>
            </button>
            <span className="mobile-drawer-hint">
              {hasLogEntries && campaignMode
                ? t('menu.campaignMode.clearLogFirst')
                : t('menu.campaignMode.hint')}
            </span>
          </div>

          <div className="mobile-drawer-divider" />

          {/* Validation Rules Section */}
          <div className="mobile-drawer-section">
            <span className="mobile-drawer-label">{t('menu.validationRules')}</span>
            <button
              className="mobile-drawer-item"
              onClick={() => onValidationRulesChange({ ...validationRules, enforcePLLimits: !(validationRules?.enforcePLLimits ?? true) })}
            >
              {(validationRules?.enforcePLLimits ?? true) ? <Shield size={20} /> : <ShieldOff size={20} />}
              <span>
                {t('menu.validationRules.enforcePLLimits')}: <strong>{(validationRules?.enforcePLLimits ?? true) ? t('menu.strictMode.active') : t('menu.strictMode.disabled')}</strong>
              </span>
            </button>
            <button
              className="mobile-drawer-item"
              onClick={() => onValidationRulesChange({ ...validationRules, enforcePPBudget: !(validationRules?.enforcePPBudget ?? true) })}
            >
              {(validationRules?.enforcePPBudget ?? true) ? <Shield size={20} /> : <ShieldOff size={20} />}
              <span>
                {t('menu.validationRules.enforcePPBudget')}: <strong>{(validationRules?.enforcePPBudget ?? true) ? t('menu.strictMode.active') : t('menu.strictMode.disabled')}</strong>
              </span>
            </button>
            <button
              className="mobile-drawer-item"
              onClick={() => onValidationRulesChange({ ...validationRules, enforceMinimumAbilityScore: !(validationRules?.enforceMinimumAbilityScore ?? true) })}
            >
              {(validationRules?.enforceMinimumAbilityScore ?? true) ? <Shield size={20} /> : <ShieldOff size={20} />}
              <span>
                {t('menu.validationRules.enforceMinimumAbilityScore')}: <strong>{(validationRules?.enforceMinimumAbilityScore ?? true) ? t('menu.strictMode.active') : t('menu.strictMode.disabled')}</strong>
              </span>
            </button>
            <button
              className="mobile-drawer-item"
              onClick={() => onValidationRulesChange({ ...validationRules, enforceAlternateEffectCap: !(validationRules?.enforceAlternateEffectCap ?? true) })}
            >
              {(validationRules?.enforceAlternateEffectCap ?? true) ? <Shield size={20} /> : <ShieldOff size={20} />}
              <span>
                {t('menu.validationRules.enforceAlternateEffectCap')}: <strong>{(validationRules?.enforceAlternateEffectCap ?? true) ? t('menu.strictMode.active') : t('menu.strictMode.disabled')}</strong>
              </span>
            </button>
            <button
              className="mobile-drawer-item"
              onClick={() => onValidationRulesChange({ ...validationRules, enforceEquipmentPPLimit: !(validationRules?.enforceEquipmentPPLimit ?? true) })}
            >
              {(validationRules?.enforceEquipmentPPLimit ?? true) ? <Shield size={20} /> : <ShieldOff size={20} />}
              <span>
                {t('menu.validationRules.enforceEquipmentPPLimit')}: <strong>{(validationRules?.enforceEquipmentPPLimit ?? true) ? t('menu.strictMode.active') : t('menu.strictMode.disabled')}</strong>
              </span>
            </button>
          </div>

          <div className="mobile-drawer-divider" />

          {/* Clear Draft Section */}
          <div className="mobile-drawer-section">
            <span className="mobile-drawer-label">{t('menu.clearDraft.label')}</span>
            <button className="mobile-drawer-item mobile-drawer-item--danger" onClick={onClearDraft}>
              <Trash2 size={20} />
              <span>{t('menu.clearDraft.action')}</span>
            </button>
            <span className="mobile-drawer-hint">{t('menu.clearDraft.hint')}</span>
          </div>
        </div>
      </div>

      <style>{`
        .mobile-drawer-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 999;
          animation: fadeIn 0.2s ease;
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 300px;
          max-width: 85vw;
          background: var(--c-surface);
          border-right: 1px solid var(--c-border);
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          animation: slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .mobile-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--s-md) var(--s-lg);
          border-bottom: 1px solid var(--c-border);
          flex-shrink: 0;
        }

        .mobile-drawer-title {
          font-family: var(--f-heading);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--c-text);
        }

        .mobile-drawer-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: transparent;
          border: none;
          color: var(--c-text-secondary);
          cursor: pointer;
          border-radius: var(--r-md);
          transition: all var(--t-fast);
        }

        .mobile-drawer-close:hover {
          background: var(--c-surface-elevated);
          color: var(--c-text);
        }

        .mobile-drawer-content {
          flex: 1;
          overflow-y: auto;
          padding: var(--s-md);
        }

        .mobile-drawer-section {
          margin-bottom: var(--s-md);
        }

        .mobile-drawer-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--c-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--s-sm);
        }

        .mobile-drawer-item {
          display: flex;
          align-items: center;
          gap: var(--s-md);
          width: 100%;
          min-height: 44px;
          padding: var(--s-sm) var(--s-md);
          background: transparent;
          border: none;
          border-radius: var(--r-md);
          color: var(--c-text);
          font-family: var(--f-body);
          font-size: 0.9rem;
          text-align: left;
          cursor: pointer;
          transition: all var(--t-fast);
        }

        .mobile-drawer-item:hover:not(:disabled) {
          background: var(--c-primary-muted);
        }

        .mobile-drawer-item.active {
          background: var(--c-primary-muted);
          color: var(--c-primary);
        }

        .mobile-drawer-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mobile-drawer-item--danger {
          color: var(--c-error);
        }

        .mobile-drawer-item--danger:hover {
          background: var(--c-error-muted);
        }

        .mobile-drawer-item:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mobile-drawer-hint {
          display: block;
          font-size: 0.75rem;
          color: var(--c-text-muted);
          margin-top: var(--s-xs);
          line-height: 1.4;
          padding: 0 var(--s-md);
        }

        .mobile-drawer-divider {
          height: 1px;
          background: var(--c-border);
          margin: var(--s-md) 0;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Styles for ThemeSelector and LanguageSelector components */
        .menubar-setting {
          width: 100%;
        }

        .menubar-setting label {
          display: flex;
          align-items: center;
          gap: var(--s-sm);
          width: 100%;
          padding: var(--s-sm) var(--s-md);
          color: var(--c-text);
          font-size: 0.9rem;
          background: var(--c-surface-elevated);
          border-radius: var(--r-md);
          cursor: pointer;
          transition: all var(--t-fast);
        }

        .menubar-setting label:hover {
          background: var(--c-primary-muted);
        }

        .menubar-setting select {
          flex: 1;
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          border-radius: var(--r-sm);
          color: var(--c-text);
          font-family: var(--f-body);
          font-size: 0.9rem;
          padding: var(--s-xs) var(--s-sm);
          cursor: pointer;
          min-height: 44px;
        }

        .menubar-setting select:hover {
          border-color: var(--c-primary);
        }

        .menubar-setting select:focus {
          outline: none;
          border-color: var(--c-primary);
          box-shadow: 0 0 0 2px var(--c-primary-muted);
        }

        /* Touch feedback for mobile */
        .mobile-drawer-item:active:not(:disabled) {
          transform: scale(0.98);
          background: var(--c-primary);
          color: #fff;
        }
      `}</style>
    </>
  );
}
