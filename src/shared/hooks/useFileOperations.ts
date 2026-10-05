import { copyCharacterPortrait } from '../../services/portraits/portraitLifecycle';
import { serializeCharacterJSON } from '../../services/character-file/exportCharacter';
import { sanitizeFileName } from '../../services/downloadHelper';
import { exportWithPortraits } from '../../services/portraitBundleExport';
import { useToast } from './useToast';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveCharacter } from './useActiveCharacter';
import { importCharacterJSON, importResourceAppendix, I18nError, saveDraftMulti } from '../../services/fileService';
import { useCharactersStore } from '../../store/charactersStore';
import { useResourcesStore } from '../../store/resourcesStore';
import { validateImportedReferences } from '../../services/character-file/validateImportedReferences';
import { SCHEMA_VERSION } from '../../entities/constants';
import type { ICharacter, IResource } from '../../entities/types';
import type { CharacterTab } from '../../entities/characterTab';
import {
  duplicateImportedCharacter,
  ensureImportedCharacterIdentity,
  findCharacterIdentityMatches,
} from '../../entities/characterImport';
import { migrateLegacyEquipmentToResources } from '../lib/resourceMigration';
import { useAppDialog } from '../ui/appDialogContext';
import { findResourceImportConflicts, prepareResourceImport, type ResourceImportChoice } from '../lib/resourceImport';
import { preserveResourceImportBackup } from '../../services/storage/resourceImportBackup';

export interface PendingCharacterImport {
  character: ICharacter;
  matchingTabs: CharacterTab[];
  resources: IResource[];
  replaceExisting: boolean;
}

/**
 * Hook for managing character file operations (import/export JSON).
 * Encapsulates file I/O logic and error handling.
 */
export function useFileOperations() {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const dialog = useAppDialog();
  const { character } = useActiveCharacter();
  const resources = useResourcesStore((state) => state.resources);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [pendingImport, setPendingImport] = useState<PendingCharacterImport | null>(null);
  const [resourceConflicts, setResourceConflicts] = useState<IResource[] | null>(null);
  const conflictResolver = useRef<((choice: ResourceImportChoice | null) => void) | null>(null);

  function resolveResourceConflict(choice: ResourceImportChoice | null) {
    conflictResolver.current?.(choice);
    conflictResolver.current = null;
    setResourceConflicts(null);
  }

  function persistImportedResources(incoming: IResource[], replaceExisting: boolean): boolean {
    if (!incoming.length) return true;
    if ((replaceExisting && !preserveResourceImportBackup()) || !useResourcesStore.getState().upsertResources(incoming, replaceExisting)) {
      void dialog.alert({ title: t('errors.importError'), message: t('resources.error.storageWrite') });
      return false;
    }
    return true;
  }

  function openImportedCharacter(importedCharacter: ICharacter) {
    useCharactersStore.getState().addCharacter(
      ensureImportedCharacterIdentity(importedCharacter)
    );
  }

  /**
   * Export current character as JSON file
   * Flushes draft to localStorage before exporting to ensure latest changes are saved
   */
  async function exportCharacter() {
    // Force immediate save to draft before exporting
    // This ensures any pending changes (within debounce window) are saved
    const tabs = useCharactersStore.getState().tabs;
    const activeId = useCharactersStore.getState().activeCharacterId;
    saveDraftMulti(tabs, activeId);
    
    const linkedResources = resources.filter((resource) =>
      (character.resourceLinks ?? []).some((link) => link.resourceId === resource.id)
    );
    try {
      await exportWithPortraits(serializeCharacterJSON(character, i18n.language, linkedResources), `${sanitizeFileName(character.header.name)}.json`, 'character', [character], dialog, t);
    } catch { await dialog.alert({ title: t('bundle.exportTitle'), message: t('bundle.exportError') }); }
  }

  /**
   * Import character from a JSON file
   */
  async function importCharacter(file: File) {
    setIsImporting(true);
    try {
      const original = await file.text();
      const char = await importCharacterJSON(file, { prepareSourceReview: true });
      const appendixResources = await importResourceAppendix(file);
      const reviewed = await dialog.reviewModifierSources({ character: char, resources: appendixResources }, original);
      if (!reviewed) return;
      // Re-run all semantic checks after selection, before importing any data.
      const validated = await importCharacterJSON(new File([JSON.stringify({ schemaVersion: SCHEMA_VERSION, exportedAt: '', character: reviewed.character })], file.name));
      validateImportedReferences([validated], reviewed.resources);
      const migrated = migrateLegacyEquipmentToResources(validated);
      const resourcesToPersist = [...reviewed.resources, ...migrated.resources];
      const conflicts = findResourceImportConflicts(resourcesToPersist, useResourcesStore.getState().resources);
      let choice: ResourceImportChoice | null = 'keep';
      if (conflicts.length) {
        choice = await new Promise<ResourceImportChoice | null>(resolve => {
          conflictResolver.current = resolve;
          setResourceConflicts(conflicts);
        });
      }
      if (!choice) return;
      const prepared = prepareResourceImport(migrated.character, resourcesToPersist, useResourcesStore.getState().resources, choice);
      const matchingTabs = findCharacterIdentityMatches(
        useCharactersStore.getState().tabs,
        prepared.character.characterId
      );

      if (matchingTabs.length === 0) {
        if (persistImportedResources(prepared.resources, prepared.replaceExisting)) openImportedCharacter(prepared.character);
      } else {
        setPendingImport({ ...prepared, matchingTabs });
      }
    } catch (err) {
      if (err instanceof I18nError) {
        await dialog.alert({ title: t('errors.importError'), message: t(err.i18nKey, err.i18nParams), messageDiagnostic: { message: err.message, messageKey: err.i18nKey, params: err.i18nParams, nested: err.diagnostic } });
      } else {
        await dialog.alert({ title: t('errors.importError'), message: t('errors.importError') });
      }
    } finally {
      setIsImporting(false);
    }
  }

  /**
   * Handle file input change event
   */
  async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      await importCharacter(file);
    } finally {
      // Reset input so same file can be imported again
      e.target.value = '';
    }
  }

  /**
   * Trigger file input click programmatically
   */
  function triggerFileInput() {
    fileInputRef.current?.click();
  }

  function updateCharacterFromPendingImport(tabId: string) {
    const pending = pendingImport;
    if (!pending) return;
    if (!persistImportedResources(pending.resources, pending.replaceExisting)) return;

    const store = useCharactersStore.getState();
    if (store.getCharacterById(tabId)) {
      store.updateCharacter(tabId, pending.character);
      store.setActiveCharacter(tabId);
    } else {
      openImportedCharacter(pending.character);
    }
    setPendingImport(null);
  }

  function openPendingImportAsCopy() {
    const pending = pendingImport;
    if (!pending) return;
    if (!persistImportedResources(pending.resources, pending.replaceExisting)) return;

    const existingNames = useCharactersStore.getState().tabs.map((tab) => tab.label);
    const copy = duplicateImportedCharacter(pending.character, existingNames);
    openImportedCharacter(copy);
    void copyCharacterPortrait(pending.character, copy).catch(() => showToast(t('portrait.copyError'), 'error'));
    setPendingImport(null);
  }

  return {
    exportCharacter,
    importCharacter,
    handleFileInput,
    triggerFileInput,
    fileInputRef,
    isImporting,
    pendingImport,
    resourceConflicts,
    resolveResourceConflict,
    updateCharacterFromPendingImport,
    openPendingImportAsCopy,
    cancelPendingImport: () => setPendingImport(null),
  };
}
