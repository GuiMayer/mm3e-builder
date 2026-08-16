import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveCharacter } from './useActiveCharacter';
import { exportCharacterJSON, importCharacterJSON, importResourceAppendix, I18nError, saveDraftMulti } from '../../services/fileService';
import { useCharactersStore } from '../../store/charactersStore';
import { useResourcesStore } from '../../store/resourcesStore';
import type { ICharacter } from '../../entities/types';
import type { CharacterTab } from '../../entities/characterTab';
import {
  duplicateImportedCharacter,
  ensureImportedCharacterIdentity,
  findCharacterIdentityMatches,
} from '../../entities/characterImport';
import { migrateLegacyEquipmentToResources } from '../lib/resourceMigration';
import { useAppDialog } from '../ui/appDialogContext';

export interface PendingCharacterImport {
  character: ICharacter;
  matchingTabs: CharacterTab[];
}

/**
 * Hook for managing character file operations (import/export JSON).
 * Encapsulates file I/O logic and error handling.
 */
export function useFileOperations() {
  const { t, i18n } = useTranslation();
  const dialog = useAppDialog();
  const { character } = useActiveCharacter();
  const resources = useResourcesStore((state) => state.resources);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [pendingImport, setPendingImport] = useState<PendingCharacterImport | null>(null);

  function openImportedCharacter(importedCharacter: ICharacter) {
    useCharactersStore.getState().addCharacter(
      ensureImportedCharacterIdentity(importedCharacter)
    );
  }

  /**
   * Export current character as JSON file
   * Flushes draft to localStorage before exporting to ensure latest changes are saved
   */
  function exportCharacter() {
    // Force immediate save to draft before exporting
    // This ensures any pending changes (within debounce window) are saved
    const tabs = useCharactersStore.getState().tabs;
    const activeId = useCharactersStore.getState().activeCharacterId;
    saveDraftMulti(tabs, activeId);
    
    const linkedResources = resources.filter((resource) =>
      (character.resourceLinks ?? []).some((link) => link.resourceId === resource.id)
    );
    exportCharacterJSON(character, i18n.language, undefined, linkedResources);
  }

  /**
   * Import character from a JSON file
   */
  async function importCharacter(file: File) {
    setIsImporting(true);
    try {
      const char = await importCharacterJSON(file);
      const appendixResources = await importResourceAppendix(file);
      const migrated = migrateLegacyEquipmentToResources(char);
      const resourcesToPersist = [...appendixResources, ...migrated.resources];
      if (resourcesToPersist.length > 0
        && !useResourcesStore.getState().upsertResources(resourcesToPersist)) {
        throw new I18nError('resources.error.storageWrite');
      }
      const matchingTabs = findCharacterIdentityMatches(
        useCharactersStore.getState().tabs,
        migrated.character.characterId
      );

      if (matchingTabs.length === 0) {
        openImportedCharacter(migrated.character);
      } else {
        setPendingImport({ character: migrated.character, matchingTabs });
      }
    } catch (err) {
      if (err instanceof I18nError) {
        await dialog.alert({ title: t('errors.importError'), message: t(err.i18nKey, err.i18nParams) });
      } else {
        await dialog.alert({ title: t('errors.importError'), message: t('errors.importError') });
      }
      throw err;
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

    const existingNames = useCharactersStore.getState().tabs.map((tab) => tab.label);
    openImportedCharacter(duplicateImportedCharacter(pending.character, existingNames));
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
    updateCharacterFromPendingImport,
    openPendingImportAsCopy,
    cancelPendingImport: () => setPendingImport(null),
  };
}
