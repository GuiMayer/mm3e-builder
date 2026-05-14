import { useEffect, useRef } from 'react';
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  console.log('[useDraftAutoSave] Render', { isDirty, characterName: character.header.name });

  useEffect(() => {
    console.log('[useDraftAutoSave] useEffect triggered', { isDirty });
    
    // Clear any existing timer
    if (timerRef.current) {
      console.log('[useDraftAutoSave] Clearing existing timer');
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!isDirty) {
      console.log('[useDraftAutoSave] Skipping save - not dirty');
      return;
    }

    console.log('[useDraftAutoSave] Setting up save timer (500ms)');
    timerRef.current = setTimeout(() => {
      console.log('[useDraftAutoSave] Timer fired, calling saveDraft');
      const success = saveDraft(character);
      if (success) {
        console.log('[useDraftAutoSave] Save successful, marking clean');
        markClean();
      } else {
        console.error('[useDraftAutoSave] Save failed');
      }
      timerRef.current = null;
    }, 500); // Debounce 500ms

    return () => {
      if (timerRef.current) {
        console.log('[useDraftAutoSave] Cleanup - clearing timer');
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [character, isDirty, markClean]);
}
