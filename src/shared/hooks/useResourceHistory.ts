import { useCallback, useEffect } from 'react';
import { useResourcesStore } from '../../store/resourcesStore';
import { getHistoryShortcut } from './useCharacterHistory';

export function useResourceHistory(enabled: boolean) {
  const past = useResourcesStore((state) => state.past);
  const future = useResourcesStore((state) => state.future);
  const undoStore = useResourcesStore((state) => state.undo);
  const redoStore = useResourcesStore((state) => state.redo);
  const undo = useCallback(() => { if (enabled) undoStore(); }, [enabled, undoStore]);
  const redo = useCallback(() => { if (enabled) redoStore(); }, [enabled, redoStore]);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { const key = getHistoryShortcut(event); if (key === 'undo' && past.length) { event.preventDefault(); undo(); } if (key === 'redo' && future.length) { event.preventDefault(); redo(); } }; document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey); }, [future.length, past.length, redo, undo]);
  return { canUndo: enabled && past.length > 0, canRedo: enabled && future.length > 0, undo, redo };
}
