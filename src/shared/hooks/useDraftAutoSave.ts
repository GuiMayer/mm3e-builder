import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useCharactersStore } from '../../store/charactersStore';
import { getLastDraftSaveError, saveDraftMulti } from '../../services/fileService';
import { useAppDialog } from '../ui/appDialogContext';

/**
 * Hook that auto-saves all character tabs to localStorage on every change.
 * Uses hash-based change detection to avoid redundant saves.
 * Resets isDirty flag for all saved tabs after successful save.
 */
export function useDraftAutoSave() {
  const { t } = useTranslation();
  const tabs = useCharactersStore((s) => s.tabs);
  const activeId = useCharactersStore((s) => s.activeCharacterId);
  const isDraftHydrated = useCharactersStore((s) => s.isDraftHydrated);
  const acknowledgePersisted = useCharactersStore((s) => s.acknowledgePersisted);
  const dialog = useAppDialog();
  const timerRef = useRef<number | null>(null);
  const shownSaveErrorRef = useRef<string | null>(null);
  const hadCharactersRef = useRef(false);

  useEffect(() => {
    // Never replace persisted data before the startup loader has established
    // whether it was restored, migrated, or needs user recovery.
    if (!isDraftHydrated) return;
    // A fresh/unrecoverable startup must not write an empty replacement.
    // After closing the last restored/created character, persist that closure.
    if (tabs.length) hadCharactersRef.current = true;
    else if (!hadCharactersRef.current) return;

    // Capture the exact revisions included in this write. A later edit gets a
    // newer revision and cannot be marked clean by this older save.
    const pendingRevisions = tabs
      .filter((tab) => tab.isDirty)
      .map((tab) => ({ id: tab.id, revision: tab.revision ?? 1 }));

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const persist = () => {
      const success = saveDraftMulti(tabs, activeId);

      if (success) {
        acknowledgePersisted(pendingRevisions);
        shownSaveErrorRef.current = null;
      } else {
        const errorKey = getLastDraftSaveError() ?? 'draft.saveError.writeFailed';
        const message = t(errorKey);
        if (shownSaveErrorRef.current !== message) {
          shownSaveErrorRef.current = message;
          void dialog.alert({ title: t('draft.saveErrorTitle'), message });
        }
      }

      timerRef.current = null;
    };
    // Closing the last tab must also survive an immediate reload.
    if (!tabs.length) persist();
    else timerRef.current = window.setTimeout(persist, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [tabs, activeId, acknowledgePersisted, dialog, isDraftHydrated, t]);
}
