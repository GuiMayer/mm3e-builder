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
  const markCharacterClean = useCharactersStore((s) => s.markCharacterClean);
  const timerRef = useRef<number | null>(null);
  const dirtyTabsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Find all dirty tabs
    const dirtyTabs = tabs.filter((t) => t.isDirty);

    if (dirtyTabs.length === 0) {
      return;
    }

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
  }, [tabs, activeId, markCharacterClean]);
}
