import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppView } from '../../app/App';

import { useAppStore } from '../../store/appStore';
import { useCharStore } from '../../store/charStore';
import { useCalculatedPP } from '../hooks/useCalculatedPP';
import { useFileOperations } from '../hooks/useFileOperations';
import { usePDFExport } from '../hooks/usePDFExport';
import { useExcelExport } from '../hooks/useExcelExport';
import { prefetchPDFTemplate } from '../../services/pdf/pdfTemplateLoader';
import { PDFOverflowModal } from '../../features/sheet-core/PDFOverflowModal';
import { MobileDrawer } from './MobileDrawer';
import { ThemeSelector } from './ThemeSelector';
import { LanguageSelector } from './LanguageSelector';
import { ViewTabs } from './ViewTabs';
import { Settings, Download, Upload, FilePlus, Shield, ShieldOff, FileSpreadsheet, BookOpen, FileText, Loader2, Trash2, Menu } from 'lucide-react';
import i18n from '../../locales';
import { clearDraft, getDraftMetadata } from '../../services/fileService';

const THEMES = [
  { id: 'dark-knight', label: 'Dark Knight' },
  { id: 'arc-reactor', label: 'Arc Reactor' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'light-print', label: 'Light Print' },
];

// Display labels for each registered language.
// To add a new language: register it in src/locales/index.ts AND add a label here.
const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  'pt-BR': 'Português (BR)',
};

// Automatically derived from the languages registered in i18n —
// no manual LANGUAGES array to maintain.
const LANGUAGES = Object.keys(i18n.options.resources ?? {}).map((id) => ({
  id,
  label: LANGUAGE_LABELS[id] ?? id, // fallback to language code if no label
}));

export function MenuBar({ activeView, onViewChange }: { activeView: AppView; onViewChange: (v: AppView) => void }) {
  const { t, i18n: i18nInstance } = useTranslation();
  
  // Store
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const validationRules = useAppStore((s) => s.validationRules);
  const setValidationRules = useAppStore((s) => s.setValidationRules);
  const character = useCharStore((s) => s.character);
  const campaignMode = character.campaignMode ?? false;
  const setCampaignMode = useCharStore((s) => s.setCampaignMode);
  const hasLogEntries = (character.ppLog ?? []).length > 0;
  const resetCharacter = useCharStore((s) => s.resetCharacter);
  
  // Hooks
  const { totalSpent, totalAvailable, remaining, isBudgetEnforced } = useCalculatedPP();
  const { exportCharacter, handleFileInput, fileInputRef } = useFileOperations();
  const { exportPDF, confirmAndExportPDF, clearOverflow, pdfOverflow, isPdfLoading } = usePDFExport();
  const { exportExcel } = useExcelExport();

  // Local state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ensure i18n is synced with store on mount
  useEffect(() => {
    if (i18nInstance.language !== language) {
      i18nInstance.changeLanguage(language);
    }
  }, [language, i18nInstance]);

  // Pre-fetch PDF template in background on first render
  useEffect(() => {
    prefetchPDFTemplate();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleLanguageChange(lang: string) {
    setLanguage(lang);
    i18nInstance.changeLanguage(lang);
  }

  function handleCampaignModeToggle() {
    // If trying to disable Campaign Mode, ask for confirmation
    if (campaignMode && !hasLogEntries) {
      const confirmed = window.confirm(t('menu.campaignMode.confirmDisable'));
      if (!confirmed) return;
    }
    setCampaignMode(!campaignMode);
  }

  function handleClearDraft() {
    const metadata = getDraftMetadata();
    const characterName = metadata?.characterName || t('draftNotification.unnamedCharacter');
    const confirmed = window.confirm(t('menu.clearDraft.confirm', { name: characterName }));
    if (confirmed) {
      clearDraft();
      alert(t('menu.clearDraft.success'));
    }
  }

  return (
    <>
      {/* Mobile Drawer - rendered outside header to avoid position conflicts */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNew={resetCharacter}
        onExport={exportCharacter}
        onImport={() => fileInputRef.current?.click()}
        onExportExcel={exportExcel}
        onExportPDF={exportPDF}
        isPdfLoading={isPdfLoading}
        theme={theme}
        onThemeChange={setTheme}
        themes={THEMES}
        language={language}
        onLanguageChange={handleLanguageChange}
        languages={LANGUAGES}
        campaignMode={campaignMode}
        onCampaignModeToggle={handleCampaignModeToggle}
        hasLogEntries={hasLogEntries}
        validationRules={validationRules}
        onValidationRulesChange={setValidationRules}
        onClearDraft={handleClearDraft}
      />

      <header className="menubar">
        <div className="menubar-left">
        {/* Hamburger button - mobile only */}
        <button
          className="menubar-hamburger"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        <h1 className="menubar-title">{t('app.title')}</h1>
        <ViewTabs activeView={activeView} onViewChange={onViewChange} />
        <span className="menubar-pp" data-over={remaining < 0}>
          <strong>{totalSpent}</strong> / {isBudgetEnforced ? totalAvailable : <span className="infinity-symbol">∞</span>} {t('common.pp')}
          {remaining < 0 && isBudgetEnforced && <span className="menubar-pp-warning"> ({remaining})</span>}
        </span>
      </div>

      <nav className="menubar-actions">
        <button className="menubar-btn" onClick={resetCharacter} title={t('menu.new')}>
          <FilePlus size={18} /> <span>{t('menu.new')}</span>
        </button>
        <button className="menubar-btn" onClick={exportCharacter} title={t('menu.export')}>
          <Download size={18} /> <span>{t('menu.export')}</span>
        </button>
        <button className="menubar-btn menubar-btn--excel" onClick={exportExcel} title={t('menu.exportExcel')}>
          <FileSpreadsheet size={18} /> <span>{t('menu.exportExcel')}</span>
        </button>
        <button
          id="btn-export-pdf"
          className={`menubar-btn menubar-btn--pdf ${isPdfLoading ? 'menubar-btn--loading' : ''}`}
          onClick={exportPDF}
          disabled={isPdfLoading}
          title={t('menu.exportPdf')}
        >
          {isPdfLoading
            ? <Loader2 size={18} className="spin" />
            : <FileText size={18} />}
          <span>{isPdfLoading ? t('pdf.generating') : t('menu.exportPdf')}</span>
        </button>
        <button className="menubar-btn" onClick={() => fileInputRef.current?.click()} title={t('menu.import')}>
          <Upload size={18} /> <span>{t('menu.import')}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        {/* Settings Dropdown */}
        <div className="menubar-dropdown-wrapper" ref={dropdownRef}>
          <button
            className="menubar-btn"
            onClick={() => setSettingsOpen(!settingsOpen)}
            title={t('menu.settings')}
          >
            <Settings size={18} />
          </button>

          {settingsOpen && (
            <div className="menubar-dropdown">
              <div className="dropdown-section">
                <span className="dropdown-label">{t('menu.theme')}</span>
                <ThemeSelector theme={theme} onThemeChange={setTheme} themes={THEMES} />
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-section">
                <span className="dropdown-label">{t('menu.campaignMode')}</span>
                <button
                  className={`dropdown-item ${campaignMode ? 'active' : ''} ${hasLogEntries && campaignMode ? 'disabled' : ''}`}
                  onClick={handleCampaignModeToggle}
                  title={hasLogEntries && campaignMode ? t('menu.campaignMode.clearLogFirst') : t('menu.campaignMode.hint')}
                  disabled={hasLogEntries && campaignMode}
                >
                  <BookOpen size={14} />
                  {t('menu.campaignMode')}: <strong>{campaignMode ? t('menu.campaignMode.active') : t('menu.campaignMode.disabled')}</strong>
                </button>
                <span className="dropdown-hint">
                  {hasLogEntries && campaignMode 
                    ? t('menu.campaignMode.clearLogFirst')
                    : t('menu.campaignMode.hint')}
                </span>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-section">
                <span className="dropdown-label">{t('menu.clearDraft.label')}</span>
                <button
                  className="dropdown-item dropdown-item--danger"
                  onClick={handleClearDraft}
                  title={t('menu.clearDraft.hint')}
                >
                  <Trash2 size={14} />
                  {t('menu.clearDraft.action')}
                </button>
                <span className="dropdown-hint">
                  {t('menu.clearDraft.hint')}
                </span>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-section">
                <span className="dropdown-label">{t('menu.validationRules')}</span>
                <button className="dropdown-item" onClick={() => setValidationRules({ enforcePLLimits: !(validationRules?.enforcePLLimits ?? true) })}>
                  {(validationRules?.enforcePLLimits ?? true) ? <Shield size={14} /> : <ShieldOff size={14} />}
                  {t('menu.validationRules.enforcePLLimits')}: <strong>{(validationRules?.enforcePLLimits ?? true) ? t('menu.strictMode.active') : t('menu.strictMode.disabled')}</strong>
                </button>
                <button className="dropdown-item" onClick={() => setValidationRules({ enforcePPBudget: !(validationRules?.enforcePPBudget ?? true) })}>
                  {(validationRules?.enforcePPBudget ?? true) ? <Shield size={14} /> : <ShieldOff size={14} />}
                  {t('menu.validationRules.enforcePPBudget')}: <strong>{(validationRules?.enforcePPBudget ?? true) ? t('menu.strictMode.active') : t('menu.strictMode.disabled')}</strong>
                </button>
                <button className="dropdown-item" onClick={() => setValidationRules({ enforceMinimumAbilityScore: !(validationRules?.enforceMinimumAbilityScore ?? true) })}>
                  {(validationRules?.enforceMinimumAbilityScore ?? true) ? <Shield size={14} /> : <ShieldOff size={14} />}
                  {t('menu.validationRules.enforceMinimumAbilityScore')}: <strong>{(validationRules?.enforceMinimumAbilityScore ?? true) ? t('menu.strictMode.active') : t('menu.strictMode.disabled')}</strong>
                </button>
                <button className="dropdown-item" onClick={() => setValidationRules({ enforceAlternateEffectCap: !(validationRules?.enforceAlternateEffectCap ?? true) })}>
                  {(validationRules?.enforceAlternateEffectCap ?? true) ? <Shield size={14} /> : <ShieldOff size={14} />}
                  {t('menu.validationRules.enforceAlternateEffectCap')}: <strong>{(validationRules?.enforceAlternateEffectCap ?? true) ? t('menu.strictMode.active') : t('menu.strictMode.disabled')}</strong>
                </button>
                <button className="dropdown-item" onClick={() => setValidationRules({ enforceEquipmentPPLimit: !(validationRules?.enforceEquipmentPPLimit ?? true) })}>
                  {(validationRules?.enforceEquipmentPPLimit ?? true) ? <Shield size={14} /> : <ShieldOff size={14} />}
                  {t('menu.validationRules.enforceEquipmentPPLimit')}: <strong>{(validationRules?.enforceEquipmentPPLimit ?? true) ? t('menu.strictMode.active') : t('menu.strictMode.disabled')}</strong>
                </button>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-section">
                <span className="dropdown-label">{t('menu.language')}</span>
                <LanguageSelector language={language} onLanguageChange={handleLanguageChange} languages={LANGUAGES} />
              </div>
            </div>
          )}
        </div>
      </nav>

      {pdfOverflow.length > 0 && (
        <PDFOverflowModal
          report={pdfOverflow}
          onConfirm={confirmAndExportPDF}
          onCancel={clearOverflow}
        />
      )}

      <style>{`
        .menubar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--s-sm) var(--s-lg);
          background: var(--c-surface);
          border-bottom: 1px solid var(--c-border);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(12px);
        }
        .menubar-left {
          display: flex;
          align-items: center;
          gap: var(--s-lg);
        }
        .menubar-title {
          font-family: var(--f-heading);
          font-size: 1.1rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--c-primary), var(--c-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .menubar-tabs {
          display: flex;
          align-items: center;
          gap: 2px;
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          border-radius: var(--r-md);
          padding: 2px;
        }
        .menubar-tab {
          display: flex;
          align-items: center;
          gap: var(--s-xs);
          padding: 4px var(--s-sm);
          background: transparent;
          border: none;
          border-radius: var(--r-sm);
          color: var(--c-text-muted);
          font-family: var(--f-body);
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--t-fast);
          white-space: nowrap;
        }
        .menubar-tab:hover { color: var(--c-text); background: var(--c-surface-elevated); }
        .menubar-tab--active {
          background: var(--c-surface-elevated);
          color: var(--c-text);
          font-weight: 600;
        }
        .menubar-pp {
          font-size: 0.85rem;
          color: var(--c-text-secondary);
          font-variant-numeric: tabular-nums;
        }
        .menubar-pp[data-over="true"] {
          color: var(--c-error);
        }
        .menubar-pp-warning {
          color: var(--c-error);
          font-weight: 600;
        }
        .menubar-actions {
          display: flex;
          align-items: center;
          gap: var(--s-xs);
        }
        .menubar-btn {
          display: flex;
          align-items: center;
          gap: var(--s-xs);
          padding: var(--s-xs) var(--s-sm);
          background: transparent;
          border: 1px solid transparent;
          border-radius: var(--r-md);
          color: var(--c-text-secondary);
          font-family: var(--f-body);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all var(--t-fast);
        }
        .menubar-btn:hover {
          background: var(--c-primary-muted);
          color: var(--c-text);
          border-color: var(--c-primary);
        }
        .menubar-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .menubar-btn--excel:hover {
          background: var(--c-success-muted);
          border-color: var(--c-success);
        }
        .menubar-btn--pdf:hover {
          background: var(--c-error-muted);
          border-color: var(--c-error);
        }
        .menubar-btn--loading {
          pointer-events: none;
        }
        .menubar-dropdown-wrapper {
          position: relative;
        }
        .menubar-dropdown {
          position: absolute;
          top: calc(100% + var(--s-xs));
          right: 0;
          min-width: 220px;
          background: var(--c-surface-elevated);
          border: 1px solid var(--c-border);
          border-radius: var(--r-md);
          box-shadow: var(--shadow-lg);
          padding: var(--s-xs);
          z-index: 1000;
        }
        .dropdown-section {
          padding: var(--s-xs);
        }
        .dropdown-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--c-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--s-xs);
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: var(--s-xs);
          width: 100%;
          padding: var(--s-xs) var(--s-sm);
          background: transparent;
          border: none;
          border-radius: var(--r-sm);
          color: var(--c-text);
          font-family: var(--f-body);
          font-size: 0.8rem;
          text-align: left;
          cursor: pointer;
          transition: all var(--t-fast);
        }
        .dropdown-item:hover {
          background: var(--c-primary-muted);
        }
        .dropdown-item.active {
          background: var(--c-primary-muted);
          color: var(--c-primary);
        }
        .dropdown-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .dropdown-item.disabled:hover {
          background: transparent;
        }
        .dropdown-item--danger {
          color: var(--c-error);
        }
        .dropdown-item--danger:hover {
          background: var(--c-error-muted);
        }
        .dropdown-hint {
          display: block;
          font-size: 0.7rem;
          color: var(--c-text-muted);
          margin-top: var(--s-xs);
          line-height: 1.3;
        }
        .dropdown-divider {
          height: 1px;
          background: var(--c-border);
          margin: var(--s-xs) 0;
        }
        .menubar-setting {
          width: 100%;
        }
        .menubar-setting label {
          display: flex;
          align-items: center;
          gap: var(--s-xs);
          width: 100%;
          padding: var(--s-xs) var(--s-sm);
          color: var(--c-text);
          font-size: 0.8rem;
        }
        .menubar-setting select {
          flex: 1;
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          border-radius: var(--r-sm);
          color: var(--c-text);
          font-family: var(--f-body);
          font-size: 0.8rem;
          padding: 2px var(--s-xs);
          cursor: pointer;
        }
        .menubar-setting select:hover {
          border-color: var(--c-primary);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.8; text-shadow: 0 0 8px rgba(var(--c-primary-rgb), 0.4); }
          50% { opacity: 1; text-shadow: 0 0 16px rgba(var(--c-primary-rgb), 0.8); }
        }
        .infinity-symbol {
          display: inline-block;
          animation: pulse-glow 2s ease-in-out infinite;
          color: var(--c-primary);
          font-weight: bold;
        }

        /* Hamburger button - hidden on desktop */
        .menubar-hamburger {
          display: none;
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
          flex-shrink: 0;
        }

        .menubar-hamburger:hover {
          background: var(--c-primary-muted);
          color: var(--c-text);
        }

        /* Mobile responsive layout */
        @media (max-width: 768px) {
          .menubar {
            padding: var(--s-xs) var(--s-md);
          }

          .menubar-left {
            gap: var(--s-sm);
          }

          /* Show hamburger button */
          .menubar-hamburger {
            display: flex;
          }

          /* Hide action buttons - they're in the drawer now */
          .menubar-actions {
            display: none;
          }

          /* Adjust title size */
          .menubar-title {
            font-size: 0.95rem;
          }

          /* Adjust PP counter */
          .menubar-pp {
            font-size: 0.75rem;
          }

          .menubar-btn {
            min-height: var(--touch-target-min);
            padding: var(--s-sm) var(--s-md);
          }
          .dropdown-item {
            min-height: var(--touch-target-min);
            padding: var(--s-sm) var(--s-md);
          }
        }
      `}</style>
      </header>
    </>
  );
}
