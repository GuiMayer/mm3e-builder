import { useEffect } from 'react';
import { useCharStore } from '../../store/charStore';
import { saveDraft } from '../../services/fileService';

/**
 * Hook that auto-saves the character draft to localStorage on every change.
 * Uses try/catch internally; triggers emergency export on quota exceeded.
 * 
 * Fixed: Removed manual Zustand subscription to prevent infinite re-render loops.
 * Now uses getState() directly to get the latest character state when saving.
 */
export function useDraftAutoSave() {
  const isDirty = useCharStore((s) => s.isDirty);

  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(() => {
      // Get the latest character state directly from the store
      // This avoids subscription issues that can cause infinite loops
      const character = useCharStore.getState().character;
      saveDraft(character);
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [isDirty]);
}
