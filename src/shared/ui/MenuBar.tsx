import { snapshotReviewPayload, applySnapshotReview } from '../lib/modifierSourceRecovery';
import { validateImportedReferences } from '../../services/character-file/validateImportedReferences';
import { clearPortraits } from '../../services/storage/portraitStorage';
import { lazy, Suspense, useState, useRef, useEffect, useCallback } from 'react';
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
import { ResourceImportConflictDialog } from './ResourceImportConflictDialog';
import { preserveResourceImportBackup } from '../../services/storage/resourceImportBackup';
import { ThemeSelector } from './ThemeSelector';
import { PRESET_THEMES } from '../../features/themes/themeModel';
import { LanguageSelector } from './LanguageSelector';
import { ViewTabs } from './ViewTabs';
import { Settings, Download, Upload, Eraser, Shield, ShieldOff, FileSpreadsheet, BookOpen, FileText, Loader2, Trash2, Menu, Undo2, Redo2 } from 'lucide-react';
import i18n from '../../locales';
import { clearDraftMulti, I18nError, replaceDraftMulti, saveDraftMulti } from '../../services/fileService';
import { useCharactersStore } from '../../store/charactersStore';
import { useResourcesStore } from '../../store/resourcesStore';
import { parseDraftBundle, parseResourceLibrary, serializeDraftBundle, serializeResourceLibrary } from '../../services/draftTransfer';
import { downloadBlob } from '../../services/downloadHelper';
import { exportWithPortraits } from '../../services/portraitBundleExport';
import { readPortraitBundle, prepareBundlePortraits, withImportedPortraits } from '../../services/portraitBundle';
import { captureDraftRollback } from '../../services/storage/characterDraftStorage';
import { useAppDialog } from './appDialogContext';
import { parseDraftStorageSnapshot, restoreDraftStorageSnapshot } from '../../services/storage/draftUpdateBackup';

const IMPORT_BACKUP_KEY = 'mm3e-draft-import-backup-v1';

const THEMES = [...PRESET_THEMES];
const CustomThemeEditor = lazy(() => import('../../features/themes/CustomThemeEditor').then(module => ({ default: module.CustomThemeEditor })));

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
    isImporting,
    resourceConflicts,
    resolveResourceConflict,
    updateCharacterFromPendingImport,
    openPendingImportAsCopy,
    cancelPendingImport,
  } = useFileOperations();
  const { exportExcel } = useExcelExport();

  // Local state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [themeEditorOpen, setThemeEditorOpen] = useState(false);
  const settingsTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const draftInputRef = useRef<HTMLInputElement>(null);
  const resourceInputRef = useRef<HTMLInputElement>(null);
  const dialog = useAppDialog();
  function openThemeEditor() { setSettingsOpen(false); setDrawerOpen(false); setThemeEditorOpen(true); }
  function closeThemeEditor() {
    setThemeEditorOpen(false);
    requestAnimationFrame(() => (window.innerWidth <= 768 ? mobileTriggerRef : settingsTriggerRef).current?.focus());
  }
  function handleThemeChange(value: string) {
    try { setTheme(value); } catch { void dialog.alert({ message: t('theme.selectionError') }); }
  }

  // Ensure i18n is synced with store on mount
  useEffect(() => {
    if (i18nInstance.language !== language) {
      i18nInstance.changeLanguage(language);
    }
  }, [language, i18nInstance]);

  // Pre-fetch the legacy template only when that renderer is enabled.
  const handleExportDraft = useCallback(async () => {
    saveDraftMulti(tabs, activeCharacterId);
    try {
      await exportWithPortraits(new Blob([serializeDraftBundle(tabs, activeCharacterId, resources)], { type: 'application/x-ndjson' }), `mm3e-draft-${new Date().toISOString().slice(0, 10)}.jsonl`, 'draft', tabs.map(tab => tab.character), dialog, t);
    } catch { await dialog.alert({ title: t('bundle.exportTitle'), message: t('bundle.exportError') }); }
  }, [activeCharacterId, resources, tabs, dialog, t]);

  useEffect(() => {
    if (!useLegacyPdfExporter) return;
    void import('../../services/pdf-legacy').then(({ prefetchPDFTemplate }) => {
      prefetchPDFTemplate();
    });
  }, [useLegacyPdfExporter]);

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
    const targetId = activeCharacterId;
    if (!targetId) return;
    if (campaignMode) {
      const confirmed = await dialog.confirm({ message: t('menu.campaignMode.confirmDisable', { before: totalAvailable, after: character.header.powerLevel * 15 }) });
      if (!confirmed) return;
    }
    setCampaignMode(!campaignMode, targetId);
  }

  async function handleClearDraft() {
    const confirmed = await dialog.confirm({ title: t('draft.clearTitle'), message: `${t('draft.clearMessage')}\n\n${t('portrait.clearNotice')}`, confirmLabel: t('draft.clearAction'), danger: true, requireAcknowledgement: true, acknowledgementLabel: t('draft.clearAcknowledgement') });
    if (!confirmed) return;
    try {
      await clearPortraits();
      localStorage.clear();
      clearDraftMulti();
      window.location.reload();
    } catch {
      await dialog.alert({ message: t('portrait.clearError') });
    }
  }

  async function handleDraftImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const archive = /\.zip$/i.test(file.name) ? await readPortraitBundle(file, 'draft') : undefined;
      const text = await (archive?.data ?? file).text();
      const snapshot = parseDraftStorageSnapshot(text);
      if (snapshot) {
        if (archive) throw new I18nError('bundle.invalid');
        const payload = snapshotReviewPayload(snapshot);
        const reviewed = await dialog.reviewModifierSources(payload, text);
        if (!reviewed) return;
        const restoredSnapshot = applySnapshotReview(snapshot, payload, reviewed);
        if (!await dialog.confirm({ title: t('draft.restoreTitle'), message: t('draft.restoreSnapshotMessage'), confirmLabel: t('draft.restoreAction'), danger: true })) return;
        localStorage.setItem(IMPORT_BACKUP_KEY, JSON.stringify({ exportedAt: new Date().toISOString(), draft: localStorage.getItem('mm3e-draft-characters'), resources: localStorage.getItem('mm3e-resource-library') }));
        if (!restoreDraftStorageSnapshot(restoredSnapshot)) throw new I18nError('draft.error.storageWrite');
        window.location.reload();
        return;
      }
      const bundle = await dialog.reviewModifierSources(parseDraftBundle(text), text);
      if (!bundle) return;
      validateImportedReferences(bundle.tabs.map(tab => tab.character), bundle.resources);
      const portraits = archive ? await prepareBundlePortraits(archive, bundle.tabs.map(tab => tab.character)) : [];
      const characters = t('draft.characterCount', { count: bundle.tabs.length });
      const resourceCount = t('resources.count', { count: bundle.resources.length });
      if (!await dialog.confirm({ title: t('draft.restoreTitle'), message: t('draft.restoreMessage', { characters, resources: resourceCount }), confirmLabel: t('draft.restoreAction'), danger: true })) return;
      localStorage.setItem(IMPORT_BACKUP_KEY, JSON.stringify({ exportedAt: new Date().toISOString(), draft: localStorage.getItem('mm3e-draft-characters'), resources: localStorage.getItem('mm3e-resource-library') }));
      const previous = useCharactersStore.getState(), previousResources = useResourcesStore.getState();
      const previousLibrary = localStorage.getItem('mm3e-resource-library');
      const rollbackDraft = captureDraftRollback();
      await withImportedPortraits(portraits, () => {
        try {
          if (!replaceResources(bundle.resources)) throw new I18nError('draft.error.storageWrite');
          if (!replaceDraftMulti(bundle.tabs, bundle.activeId)) throw new I18nError('draft.error.storageWrite');
          loadTabs(bundle.tabs, bundle.activeId);
          setDraftHydrated(true);
        } catch (error) {
          useCharactersStore.setState(previous);
          useResourcesStore.setState(previousResources);
          try {
            if (previousLibrary === null) localStorage.removeItem('mm3e-resource-library');
            else localStorage.setItem('mm3e-resource-library', previousLibrary);
          } finally { rollbackDraft(); }
          throw error;
        }
      });
    } catch (error) { await dialog.alert({ title: t('draft.importTitle'), message: error instanceof I18nError ? t(error.i18nKey, error.i18nParams) : t('draft.importFailed'), messageDiagnostic: error instanceof I18nError ? { message: error.message, messageKey: error.i18nKey, params: error.i18nParams, nested: error.diagnostic } : undefined }); }
  }

  async function handleExportResources() {
    await downloadBlob(new Blob([serializeResourceLibrary(resources)], { type: 'application/x-ndjson' }), `mm3e-resources-${new Date().toISOString().slice(0, 10)}.jsonl`);
  }

  async function handleResourceImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const reviewed = await dialog.reviewModifierSources({ resources: parseResourceLibrary(text) }, text);
      if (!reviewed) return;
      const imported = reviewed.resources;
      validateImportedReferences([], imported);
      const importedIds = new Set(imported.map((resource) => resource.id));
      const missingLinks = tabs.flatMap((tab) => tab.character.resourceLinks ?? []).filter((link) => !importedIds.has(link.resourceId)).length;
      const warning = missingLinks ? t('resources.missingLinksWarning', { count: missingLinks }) : '';
      if (!await dialog.confirm({ title: t('resources.restoreTitle'), message: t('resources.restoreMessage', { count: imported.length, warning }), confirmLabel: t('draft.restoreAction'), danger: true })) return;
      if (!preserveResourceImportBackup()) throw new I18nError('resources.error.storageWrite');
      if (!replaceResources(imported)) throw new I18nError('resources.error.storageWrite');
    } catch (error) { await dialog.alert({ title: t('resources.importTitle'), message: error instanceof I18nError ? t(error.i18nKey, error.i18nParams) : t('resources.importFailed'), messageDiagnostic: error instanceof I18nError ? { message: error.message, messageKey: error.i18nKey, params: error.i18nParams, nested: error.diagnostic } : undefined }); }
  }

  async function handleClearCharacter() {
    const confirmed = await dialog.confirm({ message: t('menu.clear.confirm'), danger: true });
    if (!confirmed) return;
    resetCharacter();
  }

  return (
    <>
      {themeEditorOpen && <Suspense fallback={null}><CustomThemeEditor onClose={closeThemeEditor} /></Suspense>}
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
        onThemeChange={handleThemeChange}
        onCustomizeTheme={openThemeEditor}
        themes={THEMES}
        language={language}
        onLanguageChange={handleLanguageChange}
        languages={LANGUAGES}
        campaignMode={campaignMode}
        onCampaignModeToggle={handleCampaignModeToggle}
        validationRules={validationRules}
        onValidationRulesChange={setValidationRules}
        onClearDraft={handleClearDraft}
        onExportDraft={handleExportDraft}
        onImportDraft={() => draftInputRef.current?.click()}
        actionsDisabled={activeView !== 'sheet' && activeView !== 'resources'}
        canClear={activeView === 'sheet'}
        canExportDocuments={activeView === 'sheet'}
      />

      <CharacterImportConflictDialog
        pendingImport={pendingImport}
        busy={isImporting}
        onUpdate={updateCharacterFromPendingImport}
        onOpenAsCopy={openPendingImportAsCopy}
        onCancel={cancelPendingImport}
      />
      <ResourceImportConflictDialog conflicts={resourceConflicts} onChoose={resolveResourceConflict} />

      <header className="menubar">
        <div className="menubar-left">
        {/* Compact actions menu */}
        <button
          className="menubar-hamburger"
          onClick={() => setDrawerOpen(true)}
          ref={mobileTriggerRef}
          aria-label={t('menu.open')}
          aria-expanded={drawerOpen}
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

      <nav className="menubar-actions" aria-label={t('menu.actions')}>
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
        <button className="menubar-btn" onClick={handleClearCharacter} disabled={activeView !== 'sheet'} title={t('menu.clear')} aria-label={t('menu.clear')}>
          <Eraser size={18} /> <span>{t('menu.clear')}</span>
        </button>
        <button className="menubar-btn" onClick={activeView === 'resources' ? handleExportResources : exportCharacter} disabled={activeView !== 'sheet' && activeView !== 'resources'} title={t('menu.export')} aria-label={t('menu.export')}>
          <Download size={18} /> <span>{t('menu.export')}</span>
        </button>
        <button className="menubar-btn menubar-btn--excel" onClick={exportExcel} disabled={activeView !== 'sheet'} title={t('menu.exportExcel')} aria-label={t('menu.exportExcel')}>
          <FileSpreadsheet size={18} /> <span>{t('menu.exportExcel')}</span>
        </button>
        <button
          id="btn-export-pdf"
          className={`menubar-btn menubar-btn--pdf ${isGeneratingPreview ? 'menubar-btn--loading' : ''}`}
          onClick={onExportPDF}
          disabled={isGeneratingPreview || activeView !== 'sheet'}
          title={t('menu.exportPdf')}
          aria-label={isGeneratingPreview ? t('pdf.generating') : t('menu.exportPdf')}
        >
          {isGeneratingPreview
            ? <Loader2 size={18} className="spin" />
            : <FileText size={18} />}
          <span>{isGeneratingPreview ? t('pdf.generating') : t('menu.exportPdf')}</span>
        </button>
        <button className="menubar-btn" onClick={() => activeView === 'resources' ? resourceInputRef.current?.click() : fileInputRef.current?.click()} disabled={activeView !== 'sheet' && activeView !== 'resources'} title={t('menu.import')} aria-label={t('menu.import')}>
          <Upload size={18} /> <span>{t('menu.import')}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.zip,application/zip"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <input ref={draftInputRef} type="file" accept=".jsonl,.zip,application/x-ndjson,application/zip" onChange={handleDraftImport} style={{ display: 'none' }} />
        <input ref={resourceInputRef} type="file" accept=".jsonl,application/x-ndjson" onChange={handleResourceImport} style={{ display: 'none' }} />

        {/* Settings Dropdown */}
        <div className="menubar-dropdown-wrapper" ref={dropdownRef}>
          <button
            className="menubar-btn"
            ref={settingsTriggerRef}
            onClick={() => setSettingsOpen(!settingsOpen)}
            title={t('menu.settings')}
            aria-label={t('menu.settings')}
            aria-expanded={settingsOpen}
          >
            <Settings size={18} />
          </button>

          {settingsOpen && (
            <div className="menubar-dropdown">
              <div className="dropdown-section">
                <span className="dropdown-label">{t('menu.theme')}</span>
                <ThemeSelector theme={theme} onThemeChange={handleThemeChange} themes={THEMES} onCustomize={openThemeEditor} />
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-section">
                <span className="dropdown-label">{t('menu.campaignMode')}</span>
                <button
                  className={`dropdown-item ${campaignMode ? 'active' : ''}`}
                  onClick={handleCampaignModeToggle}
                  title={t('menu.campaignMode.hint')}
                >
                  <BookOpen size={14} />
                  {t('menu.campaignMode')}: <strong>{campaignMode ? t('menu.campaignMode.active') : t('menu.campaignMode.disabled')}</strong>
                </button>
                <span className="dropdown-hint">
                  {t('menu.campaignMode.hint')}
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
                <button className="dropdown-item" title={t('menu.validationRules.trainingHint')} onClick={() => setValidationRules({ enforceTrainedOnlySkills: !(validationRules?.enforceTrainedOnlySkills ?? false) })}>
                  {(validationRules?.enforceTrainedOnlySkills ?? false) ? <Shield size={14} /> : <ShieldOff size={14} />}
                  {t('menu.validationRules.enforceTrainedOnlySkills')}: <strong>{(validationRules?.enforceTrainedOnlySkills ?? false) ? t('menu.strictMode.active') : t('menu.strictMode.disabled')}</strong>
                </button>
                <button className="dropdown-item" onClick={() => setValidationRules({ enforceAfflictionProgression: !(validationRules?.enforceAfflictionProgression ?? false) })}>
                  {(validationRules?.enforceAfflictionProgression ?? false) ? <Shield size={14} /> : <ShieldOff size={14} />}
                  {t('menu.validationRules.enforceAfflictionProgression')}: <strong>{(validationRules?.enforceAfflictionProgression ?? false) ? t('menu.strictMode.active') : t('menu.strictMode.disabled')}</strong>
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    const enabled = (validationRules?.enforceAbsentAbilityRestrictions ?? false)
                      || (validationRules?.enforceSkillAbilityRequirements ?? false);
                    setValidationRules({
                      enforceAbsentAbilityRestrictions: !enabled,
                      enforceSkillAbilityRequirements: !enabled,
                    });
                  }}
                >
                  {((validationRules?.enforceAbsentAbilityRestrictions ?? false)
                    || (validationRules?.enforceSkillAbilityRequirements ?? false))
                    ? <Shield size={14} />
                    : <ShieldOff size={14} />}
                  {t('menu.validationRules.absentAbilityWarnings')}: <strong>
                    {((validationRules?.enforceAbsentAbilityRestrictions ?? false)
                      || (validationRules?.enforceSkillAbilityRequirements ?? false))
                      ? t('menu.strictMode.active')
                      : t('menu.strictMode.disabled')}
                  </strong>
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
                  {t('menu.useLegacyPdfExporter')}: <strong>{useLegacyPdfExporter ? t('menu.legacy') : t('menu.pdfExporter.new')}</strong>
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
                <span className="dropdown-label">{t('draft.management')}</span>
                <button className="dropdown-item" onClick={handleExportDraft}><Download size={14} /> {t('draft.export')}</button>
                <button className="dropdown-item" onClick={() => draftInputRef.current?.click()}><Upload size={14} /> {t('draft.import')}</button>
                <button className="dropdown-item dropdown-item--danger" onClick={handleClearDraft}><Trash2 size={14} /> {t('draft.clearAction')}</button>
                <span className="dropdown-hint">{t('draft.managementHint')}</span>
              </div>
            </div>
          )}
        </div>
      </nav>

      <style>{`
        .menubar {
          display: grid;
          grid-template-areas: "title tabs points actions";
          grid-template-columns: max-content minmax(0, 1fr) max-content max-content;
          align-items: center;
          gap: var(--s-sm);
          padding: var(--s-sm) var(--s-md);
          background: var(--c-surface);
          border-bottom: 1px solid var(--c-border);
          position: sticky;
          top: 0;
          z-index: 200;
          backdrop-filter: blur(12px);
        }
        .menubar-left { display: contents; }
        .menubar-title {
          grid-area: title;
          min-width: 0;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: var(--f-heading);
          font-size: 1.1rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--c-primary), var(--c-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .menubar-tabs {
          grid-area: tabs;
          min-width: 0;
          max-width: 100%;
          width: max-content;
          overflow-x: auto;
          scrollbar-width: thin;
          display: flex;
          align-items: center;
          gap: 2px;
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          border-radius: var(--r-md);
          padding: 2px;
        }
        .menubar-tab {
          flex-shrink: 0;
          min-height: 36px;
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
        .menubar-tab-label--compact { display: none; }
        .menubar-tab:hover { color: var(--c-text); background: var(--c-surface-elevated); }
        .menubar-tab--active {
          background: var(--c-surface-elevated);
          color: var(--c-text);
          font-weight: 600;
        }
        .menubar-pp {
          grid-area: points;
          white-space: nowrap;
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
          grid-area: actions;
          display: flex;
          align-items: center;
          gap: var(--s-xs);
        }
        .menubar-btn {
          flex-shrink: 0;
          min-height: 40px;
          white-space: nowrap;
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
          width: max-content;
          min-width: min(220px, calc(100vw - 32px));
          max-width: calc(100vw - 32px);
          max-height: calc(100dvh - 110px);
          overflow-y: auto;
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
          grid-area: menu;
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

        /* Give navigation its own row before labels compete for space. */
        @media (max-width: 1439px) {
          .menubar {
            grid-template-areas: "title points actions" "tabs tabs tabs";
            grid-template-columns: minmax(0, 1fr) max-content max-content;
          }
          .menubar-tabs { width: 100%; }
          .menubar-tab { flex: 1 0 auto; justify-content: center; }
        }

        /* Preserve every action with a named icon in narrower desktop windows. */
        @media (max-width: 1100px) {
          .menubar-btn { min-width: 40px; justify-content: center; padding: var(--s-xs); }
          .menubar-btn > span { display: none; }
        }

        @media (max-width: 768px) {
          .menubar {
            grid-template-areas: "menu title points" "tabs tabs tabs";
            grid-template-columns: 44px minmax(0, 1fr) max-content;
            gap: var(--s-xs) var(--s-sm);
            padding: var(--s-xs) var(--s-sm);
          }
          .menubar-hamburger { display: flex; }
          .menubar-actions { display: none; }
          .menubar-title { font-size: 0.95rem; }
          .menubar-pp { font-size: 0.75rem; }
          .menubar-tab {
            min-height: var(--touch-target-min);
            padding: 4px var(--s-xs);
            font-size: 0.75rem;
          }
          .menubar-tab svg { width: 12px; height: 12px; }
          .dropdown-item {
            min-height: var(--touch-target-min);
            padding: var(--s-sm) var(--s-md);
          }
        }
              @media (max-width: 480px) {
          .menubar-tab-label--full { display: none; }
          .menubar-tab-label--compact { display: inline; }
        }
      `}</style>
      </header>
    </>
  );
}
