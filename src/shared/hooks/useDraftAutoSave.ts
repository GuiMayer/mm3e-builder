import { useEffect, useRef } from 'react';
import { useCharStore } from '../../store/charStore';
import { saveDraft } from '../../services/fileService';

/**
 * Hook that auto-saves the character draft to localStorage on every change.
 * Uses try/catch internally; triggers emergency export on quota exceeded.
 */
export function useDraftAutoSave() {
  const isDirty = useCharStore((s) => s.isDirty);
  const characterRef = useRef(useCharStore.getState().character);

  useEffect(() => {
    // Subscribe to character changes
    const unsubscribe = useCharStore.subscribe((state) => {
      characterRef.current = state.character;
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(() => {
      saveDraft(characterRef.current);
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [isDirty]);
}
