import { useEffect, useRef } from 'react';
import { useCharactersStore } from '../../store/charactersStore';
import { getLastDraftSaveError, saveDraftMulti } from '../../services/fileService';
import { useAppDialog } from '../ui/appDialogContext';

/**
 * Hook that auto-saves all character tabs to localStorage on every change.
 * Uses hash-based change detection to avoid redundant saves.
 * Resets isDirty flag for all saved tabs after successful save.
 */
export function useDraftAutoSave() {
  const tabs = useCharactersStore((s) => s.tabs);
  const activeId = useCharactersStore((s) => s.activeCharacterId);
  const isDraftHydrated = useCharactersStore((s) => s.isDraftHydrated);
  const acknowledgePersisted = useCharactersStore((s) => s.acknowledgePersisted);
  const dialog = useAppDialog();
  const timerRef = useRef<number | null>(null);
  const shownSaveErrorRef = useRef<string | null>(null);

  useEffect(() => {
    // Never replace persisted data before the startup loader has established
    // whether it was restored, migrated, or needs user recovery.
    if (!isDraftHydrated) return;
    // Do not create an empty persisted draft before the user creates their
    // first character. Any hydrated non-empty draft is safe to reconcile.
    if (tabs.length === 0) return;

    // Capture the exact revisions included in this write. A later edit gets a
    // newer revision and cannot be marked clean by this older save.
    const pendingRevisions = tabs
      .filter((tab) => tab.isDirty)
      .map((tab) => ({ id: tab.id, revision: tab.revision ?? 1 }));

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Debounced save (500ms)
    timerRef.current = window.setTimeout(() => {
      const success = saveDraftMulti(tabs, activeId);

      if (success) {
        acknowledgePersisted(pendingRevisions);
        shownSaveErrorRef.current = null;
      } else {
        const message = getLastDraftSaveError() ?? 'The browser could not save this Draft. Your changes remain marked as unsaved.';
        if (shownSaveErrorRef.current !== message) {
          shownSaveErrorRef.current = message;
          void dialog.alert({ title: 'Draft not saved', message });
        }
      }

      timerRef.current = null;
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [tabs, activeId, acknowledgePersisted, dialog, isDraftHydrated]);
}
