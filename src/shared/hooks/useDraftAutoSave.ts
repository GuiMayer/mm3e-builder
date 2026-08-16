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
  const markCharacterClean = useCharactersStore((s) => s.markCharacterClean);
  const dialog = useAppDialog();
  const timerRef = useRef<number | null>(null);
  const dirtyTabsRef = useRef<Set<string>>(new Set());
  const shownSaveErrorRef = useRef<string | null>(null);

  useEffect(() => {
    // Never replace persisted data before the startup loader has established
    // whether it was restored, migrated, or needs user recovery.
    if (!isDraftHydrated) return;
    // Do not create an empty persisted draft before the user creates their
    // first character. Any hydrated non-empty draft is safe to reconcile.
    if (tabs.length === 0) return;

    // Find all dirty tabs
    const dirtyTabs = tabs.filter((t) => t.isDirty);

    // The first hydrated state can contain a safe migration or a recovered
    // active-tab selection. saveDraftMulti's signature guard keeps an
    // unchanged clean draft as a no-op, while persisting either correction.

    // Track which tabs need saving
    dirtyTabs.forEach((t) => dirtyTabsRef.current.add(t.id));

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Debounced save (500ms)
    timerRef.current = window.setTimeout(() => {
      const success = saveDraftMulti(tabs, activeId);

      if (success) {
        // Mark all dirty tabs as clean
        dirtyTabsRef.current.forEach((id) => markCharacterClean(id));
        dirtyTabsRef.current.clear();
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
  }, [tabs, activeId, dialog, isDraftHydrated, markCharacterClean]);
}
