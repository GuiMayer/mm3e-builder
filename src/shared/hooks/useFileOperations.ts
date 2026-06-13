import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveCharacter } from './useActiveCharacter';
import { useCharacterActions } from './useCharacterActions';
import { exportCharacterJSON, importCharacterJSON, I18nError, saveDraftMulti } from '../../services/fileService';
import { useCharactersStore } from '../../store/charactersStore';

/**
 * Hook for managing character file operations (import/export JSON).
 * Encapsulates file I/O logic and error handling.
 */
export function useFileOperations() {
  const { t, i18n } = useTranslation();
  const { character } = useActiveCharacter();
  const { loadCharacter } = useCharacterActions();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

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
    
    exportCharacterJSON(character, i18n.language);
  }

  /**
   * Import character from a JSON file
   */
  async function importCharacter(file: File) {
    setIsImporting(true);
    try {
      const char = await importCharacterJSON(file);
      loadCharacter(char);
    } catch (err) {
      if (err instanceof I18nError) {
        alert(t(err.i18nKey, err.i18nParams));
      } else {
        alert(t('errors.importError'));
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

  return {
    exportCharacter,
    importCharacter,
    handleFileInput,
    triggerFileInput,
    fileInputRef,
    isImporting,
  };
}
