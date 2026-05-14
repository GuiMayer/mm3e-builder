import { useEffect } from 'react';
import { useCharStore } from '../../store/charStore';
import { saveDraft } from '../../services/fileService';

/**
 * Hook that auto-saves the character draft to localStorage on every change.
 * Uses try/catch internally; triggers emergency export on quota exceeded.
 */
export function useDraftAutoSave() {
  const character = useCharStore((s) => s.character);
  const isDirty = useCharStore((s) => s.isDirty);

  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(() => {
      saveDraft(character);
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [character, isDirty]);
}
