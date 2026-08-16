import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppView } from '../../app/App';

import { useAppStore } from '../../store/appStore';
import { useActiveCharacter } from '../hooks/useActiveCharacter';
import { useCharacterActions } from '../hooks/useCharacterActions';
import { useCalculatedPP } from '../hooks/useCalculatedPP';
import { useCharacterHistory } from '../hooks/useCharacterHistory';
import { useResourceHistory } from '../hooks/useResourceHistory';
import { useFileOperations } from '../hooks/useFileOperations';
import { useExcelExport } from '../hooks/useExcelExport';
import { MobileDrawer } from './MobileDrawer';
import { CharacterImportConflictDialog } from './CharacterImportConflictDialog';
import { ThemeSelector } from './ThemeSelector';
import { LanguageSelector } from './LanguageSelector';
import { ViewTabs } from './ViewTabs';
import { Settings, Download, Upload, Eraser, Shield, ShieldOff, FileSpreadsheet, BookOpen, FileText, Loader2, Trash2, Menu, Undo2, Redo2 } from 'lucide-react';
import i18n from '../../locales';
import { clearDraftMulti } from '../../services/fileService';
import { replaceDraftMulti, saveDraftMulti } from '../../services/fileService';
import { useCharactersStore } from '../../store/charactersStore';
import { useResourcesStore } from '../../store/resourcesStore';
import { parseDraftBundle, parseResourceLibrary, serializeDraftBundle, serializeResourceLibrary } from '../../services/draftTransfer';
import { downloadBlob } from '../../services/downloadHelper';
import { useAppDialog } from './appDialogContext';

const APP_VERSION = __APP_VERSION__;
const UPDATE_NOTICE_KEY = 'mm3e-draft-export-notice-version';
const IMPORT_BACKUP_KEY = 'mm3e-draft-import-backup-v1';

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

interface MenuBarProps {
  activeView: AppView;
  onViewChange: (v: AppView) => void;
  onExportPDF: () => void;
  isGeneratingPreview: boolean;
}

export function MenuBar({ activeView, onViewChange, onExportPDF, isGeneratingPreview }: MenuBarProps) {
  const { t, i18n: i18nInstance } = useTranslation();
  
  // Store
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const validationRules = useAppStore((s) => s.validationRules);
  const setValidationRules = useAppStore((s) => s.setValidationRules);
  const useLegacyPdfExporter = useAppStore((s) => s.useLegacyPdfExporter);
  const setUseLegacyPdfExporter = useAppStore((s) => s.setUseLegacyPdfExporter);
  const { character } = useActiveCharacter();
  const tabs = useCharactersStore((s) => s.tabs);
  const activeCharacterId = useCharactersStore((s) => s.activeCharacterId);
  const loadTabs = useCharactersStore((s) => s.loadTabs);
  const setDraftHydrated = useCharactersStore((s) => s.setDraftHydrated);
  const resources = useResourcesStore((s) => s.resources);
  const replaceResources = useResourcesStore((s) => s.replaceResources);
  const { setCampaignMode, resetCharacter } = useCharacterActions();
  const campaignMode = character.campaignMode ?? false;
  const hasLogEntries = (character.ppLog ?? []).length > 0;
  
  // Hooks
  const { totalSpent, totalAvailable, remaining, isBudgetEnforced } = useCalculatedPP();
  const characterHistory = useCharacterHistory(activeView === 'sheet');
  const resourceHistory = useResourceHistory(activeView === 'resources');
  const history = activeView === 'resources' ? resourceHistory : characterHistory;
  const {
    exportCharacter,
    handleFileInput,
    fileInputRef,
    pendingImport,
    updateCharacterFromPendingImport,
    openPendingImportAsCopy,
    cancelPendingImport,
  } = useFileOperations();
  const { exportExcel } = useExcelExport();

  // Local state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const draftInputRef = useRef<HTMLInputElement>(null);
  const resourceInputRef = useRef<HTMLInputElement>(null);
  const updateNoticeStartedRef = useRef(false);
  const dialog = useAppDialog();

  // Ensure i18n is synced with store on mount
  useEffect(() => {
    if (i18nInstance.language !== language) {
      i18nInstance.changeLanguage(language);
    }
  }, [language, i18nInstance]);

  // Pre-fetch the legacy template only when that renderer is enabled.
  const handleExportDraft = useCallback(async () => {
    saveDraftMulti(tabs, activeCharacterId);
    await downloadBlob(new Blob([serializeDraftBundle(tabs, activeCharacterId, resources)], { type: 'application/x-ndjson' }), `mm3e-draft-${new Date().toISOString().slice(0, 10)}.jsonl`);
  }, [activeCharacterId, resources, tabs]);

  useEffect(() => {
    if (!useLegacyPdfExporter) return;
    void import('../../services/pdf-legacy').then(({ prefetchPDFTemplate }) => {
      prefetchPDFTemplate();
    });
  }, [useLegacyPdfExporter]);

  useEffect(() => {
    if (updateNoticeStartedRef.current || (tabs.length === 0 && resources.length === 0) || localStorage.getItem(UPDATE_NOTICE_KEY) === APP_VERSION) return;
    updateNoticeStartedRef.current = true;
    void (async () => {
      const shouldExport = await dialog.confirm({ title: 'Update detected', message: 'A new app version was detected. Export a Draft backup before continuing, in case a future migration needs recovery.', confirmLabel: 'Export Draft', cancelLabel: 'Continue' });
      if (shouldExport) {
        try {
          await handleExportDraft();
        } catch {
          await dialog.alert({ title: 'Export Draft', message: 'Could not export the Draft backup. Please try again from Settings.' });
          return;
        }
      }
      localStorage.setItem(UPDATE_NOTICE_KEY, APP_VERSION);
    })();
  }, [dialog, handleExportDraft, resources.length, tabs.length]);

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

  async function handleCampaignModeToggle() {
    // If trying to disable Campaign Mode, ask for confirmation
    if (campaignMode && !hasLogEntries) {
      const confirmed = await dialog.confirm({ message: t('menu.campaignMode.confirmDisable') });
      if (!confirmed) return;
    }
    setCampaignMode(!campaignMode);
  }

  function handleClearDraft() {
    void dialog.confirm({ title: 'Clear all local data', message: 'This removes every saved item and preference for this app from this browser. This cannot be undone.', confirmLabel: 'Clear all data', danger: true, requireAcknowledgement: true, acknowledgementLabel: 'I understand that this cannot be undone.' }).then((confirmed) => { if (confirmed) { localStorage.clear(); clearDraftMulti(); window.location.reload(); } });
  }

  async function handleDraftImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const bundle = parseDraftBundle(await file.text());
      if (!await dialog.confirm({ title: 'Restore Draft', message: `Restore ${bundle.tabs.length} character(s) and ${bundle.resources.length} Resource(s)? This replaces the current Draft.`, confirmLabel: 'Restore', danger: true })) return;
      localStorage.setItem(IMPORT_BACKUP_KEY, JSON.stringify({ exportedAt: new Date().toISOString(), draft: localStorage.getItem('mm3e-draft-characters'), resources: localStorage.getItem('mm3e-resource-library') }));
      const previousTabs = tabs, previousActiveId = activeCharacterId, previousResources = resources;
      replaceResources(bundle.resources);
      if (!replaceDraftMulti(bundle.tabs, bundle.activeId)) { replaceResources(previousResources); replaceDraftMulti(previousTabs, previousActiveId); throw new Error('Storage write failed.'); }
      loadTabs(bundle.tabs, bundle.activeId);
      setDraftHydrated(true);
    } catch (error) { await dialog.alert({ title: 'Import Draft', message: error instanceof Error ? error.message : 'Could not import Draft.' }); }
  }

  async function handleExportResources() {
    await downloadBlob(new Blob([serializeResourceLibrary(resources)], { type: 'application/x-ndjson' }), `mm3e-resources-${new Date().toISOString().slice(0, 10)}.jsonl`);
  }

  async function handleResourceImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    try {
      const imported = parseResourceLibrary(await file.text());
      const importedIds = new Set(imported.map((resource) => resource.id));
      const missingLinks = tabs.flatMap((tab) => tab.character.resourceLinks ?? []).filter((link) => !importedIds.has(link.resourceId)).length;
      const warning = missingLinks ? ` It will leave ${missingLinks} existing character association(s) without a matching library item.` : '';
      if (!await dialog.confirm({ title: 'Restore Resources', message: `Restore ${imported.length} Resource(s)? This replaces the current library.${warning}`, confirmLabel: 'Restore', danger: true })) return;
      localStorage.setItem('mm3e-resource-library-import-backup-v1', JSON.stringify({ exportedAt: new Date().toISOString(), resources: localStorage.getItem('mm3e-resource-library') }));
      replaceResources(imported);
    } catch (error) { await dialog.alert({ title: 'Import Resources', message: error instanceof Error ? error.message : 'Could not import Resources.' }); }
  }

  async function handleClearCharacter() {
    const confirmed = await dialog.confirm({ message: t('menu.clear.confirm'), danger: true });
    if (!confirmed) return;
    resetCharacter();
  }

  return (
    <>
      {/* Mobile Drawer - rendered outside header to avoid position conflicts */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onClear={handleClearCharacter}
        onUndo={history.undo}
        onRedo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onExport={activeView === 'resources' ? handleExportResources : exportCharacter}
        onImport={() => activeView === 'resources' ? resourceInputRef.current?.click() : fileInputRef.current?.click()}
        onExportExcel={exportExcel}
        onExportPDF={onExportPDF}
        isGeneratingPreview={isGeneratingPreview}
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
        onExportDraft={handleExportDraft}
        onImportDraft={() => draftInputRef.current?.click()}
        actionsDisabled={activeView === 'references'}
        canClear={activeView === 'sheet'}
        canExportDocuments={activeView === 'sheet'}
      />

      <CharacterImportConflictDialog
        pendingImport={pendingImport}
        onUpdate={updateCharacterFromPendingImport}
        onOpenAsCopy={openPendingImportAsCopy}
        onCancel={cancelPendingImport}
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
        <span className="menubar-pp" data-over={isBudgetEnforced && remaining < 0}>
          <strong>{totalSpent}</strong> / {isBudgetEnforced ? totalAvailable : <span className="infinity-symbol">∞</span>} {t('common.pp')}
          {remaining < 0 && isBudgetEnforced && <span className="menubar-pp-warning"> ({remaining})</span>}
        </span>
      </div>

      <nav className="menubar-actions">
        <button
          className="menubar-btn"
          onClick={history.undo}
          disabled={!history.canUndo}
          title={`${t('menu.undo')} (Ctrl+Z)`}
          aria-label={`${t('menu.undo')} (Ctrl+Z)`}
        >
          <Undo2 size={18} /> <span>{t('menu.undo')}</span>
        </button>
        <button
          className="menubar-btn"
          onClick={history.redo}
          disabled={!history.canRedo}
          title={`${t('menu.redo')} (Ctrl+Shift+Z)`}
          aria-label={`${t('menu.redo')} (Ctrl+Shift+Z)`}
        >
          <Redo2 size={18} /> <span>{t('menu.redo')}</span>
        </button>
        <button className="menubar-btn" onClick={handleClearCharacter} disabled={activeView !== 'sheet'} title={t('menu.clear')}>
          <Eraser size={18} /> <span>{t('menu.clear')}</span>
        </button>
        <button className="menubar-btn" onClick={activeView === 'resources' ? handleExportResources : exportCharacter} disabled={activeView === 'references'} title={t('menu.export')}>
          <Download size={18} /> <span>{t('menu.export')}</span>
        </button>
        <button className="menubar-btn menubar-btn--excel" onClick={exportExcel} disabled={activeView !== 'sheet'} title={t('menu.exportExcel')}>
          <FileSpreadsheet size={18} /> <span>{t('menu.exportExcel')}</span>
        </button>
        <button
          id="btn-export-pdf"
          className={`menubar-btn menubar-btn--pdf ${isGeneratingPreview ? 'menubar-btn--loading' : ''}`}
          onClick={onExportPDF}
          disabled={isGeneratingPreview || activeView !== 'sheet'}
          title={t('menu.exportPdf')}
        >
          {isGeneratingPreview
            ? <Loader2 size={18} className="spin" />
            : <FileText size={18} />}
          <span>{isGeneratingPreview ? t('pdf.generating') : t('menu.exportPdf')}</span>
        </button>
        <button className="menubar-btn" onClick={() => activeView === 'resources' ? resourceInputRef.current?.click() : fileInputRef.current?.click()} disabled={activeView === 'references'} title={t('menu.import')}>
          <Upload size={18} /> <span>{t('menu.import')}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <input ref={draftInputRef} type="file" accept=".jsonl,application/x-ndjson" onChange={handleDraftImport} style={{ display: 'none' }} />
        <input ref={resourceInputRef} type="file" accept=".jsonl,application/x-ndjson" onChange={handleResourceImport} style={{ display: 'none' }} />

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
                <button className="dropdown-item" onClick={() => setValidationRules({ enforceDuplicateModifiers: !(validationRules?.enforceDuplicateModifiers ?? true) })}>
                  {(validationRules?.enforceDuplicateModifiers ?? true) ? <Shield size={14} /> : <ShieldOff size={14} />}
                  {t('menu.validationRules.enforceDuplicateModifiers')}: <strong>{(validationRules?.enforceDuplicateModifiers ?? true) ? t('menu.strictMode.active') : t('menu.strictMode.disabled')}</strong>
                </button>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-section">
                <span className="dropdown-label">{t('menu.pdfExporter')}</span>
                <button 
                  className="dropdown-item" 
                  onClick={() => setUseLegacyPdfExporter(!useLegacyPdfExporter)}
                >
                  {useLegacyPdfExporter ? <Shield size={14} /> : <ShieldOff size={14} />}
                  {t('menu.useLegacyPdfExporter')}: <strong>{useLegacyPdfExporter ? t('menu.legacy') : t('menu.new')}</strong>
                </button>
                <span className="dropdown-hint">
                  {t('menu.pdfExporter.hint')}
                </span>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-section">
                <span className="dropdown-label">{t('menu.language')}</span>
                <LanguageSelector language={language} onLanguageChange={handleLanguageChange} languages={LANGUAGES} />
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-section">
                <span className="dropdown-label">Draft Management</span>
                <button className="dropdown-item" onClick={handleExportDraft}><Download size={14} /> Export Draft</button>
                <button className="dropdown-item" onClick={() => draftInputRef.current?.click()}><Upload size={14} /> Import Draft</button>
                <button className="dropdown-item dropdown-item--danger" onClick={handleClearDraft}><Trash2 size={14} /> Clear Draft</button>
                <span className="dropdown-hint">Exports or restores every character and Resource.</span>
              </div>
            </div>
          )}
        </div>
      </nav>

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
