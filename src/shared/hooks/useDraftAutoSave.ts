import { useEffect, useRef } from 'react';
import { useCharactersStore } from '../../store/charactersStore';
import { saveDraftMulti } from '../../services/fileService';

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
  const timerRef = useRef<number | null>(null);
  const dirtyTabsRef = useRef<Set<string>>(new Set());
  const hasObservedInitialStateRef = useRef(false);

  useEffect(() => {
    // Never replace persisted data before the startup loader has established
    // whether it was restored, migrated, or needs user recovery.
    if (!isDraftHydrated) return;
    // The first render happens before the multi-character draft has been
    // restored. Skipping it prevents an empty store from replacing a saved or
    // corrupted draft. Every later tab or selection change is persistable.
    if (!hasObservedInitialStateRef.current) {
      hasObservedInitialStateRef.current = true;
      return;
    }

    // Find all dirty tabs
    const dirtyTabs = tabs.filter((t) => t.isDirty);

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
      }

      timerRef.current = null;
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [tabs, activeId, isDraftHydrated, markCharacterClean]);
}
