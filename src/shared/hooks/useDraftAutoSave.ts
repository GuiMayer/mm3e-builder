import { useEffect } from 'react';
import { useCharStore } from '../../store/charStore';
import { saveDraft } from '../../services/fileService';

/**
 * Hook that auto-saves the character draft to localStorage on every change.
 * Uses try/catch internally; triggers emergency export on quota exceeded.
 * Resets isDirty flag after successful save to allow subsequent saves.
 */
export function useDraftAutoSave() {
  const character = useCharStore((s) => s.character);
  const isDirty = useCharStore((s) => s.isDirty);
  const markClean = useCharStore((s) => s.markClean);

  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(() => {
      const success = saveDraft(character);
      if (success) {
        markClean();
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [character, isDirty, markClean]);
}
