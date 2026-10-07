import { copyCharacterPortrait } from '../../services/portraits/portraitLifecycle';
import { serializeCharacterJSON } from '../../services/character-file/exportCharacter';
import { sanitizeFileName } from '../../services/downloadHelper';
import { exportWithPortraits } from '../../services/portraitBundleExport';
import { readPortraitBundle, prepareBundlePortraits, withImportedPortraits } from '../../services/portraitBundle';
import type { PortraitMedia } from '../../services/storage/portraitStorage';
import { commitCharacterImport } from '../../services/character-file/commitCharacterImport';
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

export interface PendingCharacterImport {
  character: ICharacter;
  matchingTabs: CharacterTab[];
  resources: IResource[];
  replaceExisting: boolean;
  portrait?: PortraitMedia;
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
  const committingImport = useRef(false);
  const [pendingImport, setPendingImport] = useState<PendingCharacterImport | null>(null);
  const [resourceConflicts, setResourceConflicts] = useState<IResource[] | null>(null);
  const conflictResolver = useRef<((choice: ResourceImportChoice | null) => void) | null>(null);

  function resolveResourceConflict(choice: ResourceImportChoice | null) {
    conflictResolver.current?.(choice);
    conflictResolver.current = null;
    setResourceConflicts(null);
  }

  async function completeCharacterImport(pending: PendingCharacterImport, tabId?: string, asCopy = false) {
    if (committingImport.current) return;
    committingImport.current = true;
    setIsImporting(true);
    try {
      const previous = useCharactersStore.getState();
      const imported = ensureImportedCharacterIdentity(asCopy
        ? duplicateImportedCharacter(pending.character, previous.tabs.map(tab => tab.label))
        : pending.character);
      await withImportedPortraits(pending.portrait ? [{ characterId: imported.characterId!, media: pending.portrait }] : [], () => {
        commitCharacterImport(imported, pending.resources, pending.replaceExisting, tabId);
      });
      if (asCopy && !pending.portrait) await copyCharacterPortrait(pending.character, imported).catch(() => showToast(t('portrait.copyError'), 'error'));
      setPendingImport(null);
    } catch (error) {
      await dialog.alert({ title: t('errors.importError'), message: error instanceof I18nError ? t(error.i18nKey, error.i18nParams) : t('bundle.importError') });
    } finally { committingImport.current = false; setIsImporting(false); }
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
      const archive = /\.zip$/i.test(file.name) ? await readPortraitBundle(file, 'character') : undefined;
      if (archive) file = archive.data;
      const original = await file.text();
      const char = await importCharacterJSON(file, { prepareSourceReview: true });
      const portrait = archive ? (await prepareBundlePortraits(archive, [char]))[0]?.media : undefined;
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
        await completeCharacterImport({ ...prepared, matchingTabs, portrait });
      } else {
        setPendingImport({ ...prepared, matchingTabs, portrait });
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

  async function updateCharacterFromPendingImport(tabId: string) {
    const pending = pendingImport;
    if (!pending) return;
    await completeCharacterImport(pending, tabId);
  }

  async function openPendingImportAsCopy() {
    const pending = pendingImport;
    if (!pending) return;
    await completeCharacterImport(pending, undefined, true);
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
    cancelPendingImport: () => { if (!committingImport.current) setPendingImport(null); },
  };
}
