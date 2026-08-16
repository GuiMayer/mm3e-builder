import { useCallback, useEffect } from 'react';
import { useCharactersStore } from '../../store/charactersStore';

type HistoryShortcut = 'undo' | 'redo' | null;

function isTextEditingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;

  return Boolean(
    target.closest(
      'input, textarea, select, [contenteditable="true"], [data-history-shortcuts-disabled]'
    )
  );
}

export function getHistoryShortcut(event: KeyboardEvent): HistoryShortcut {
  if (
    event.defaultPrevented ||
    event.altKey ||
    (!event.ctrlKey && !event.metaKey) ||
    isTextEditingTarget(event.target)
  ) {
    return null;
  }

  const key = event.key.toLowerCase();
  if (key === 'z') return event.shiftKey ? 'redo' : 'undo';
  if (key === 'y') return 'redo';
  return null;
}

/**
 * Exposes temporary, per-tab character history. Keyboard shortcuts deliberately
 * ignore editable fields and unsaved modal editors so browser text undo and the
 * Power Builder's local draft keep their expected behavior.
 */
export function useCharacterHistory() {
  const activeCharacterId = useCharactersStore((state) => state.activeCharacterId);
  const history = useCharactersStore((state) =>
    activeCharacterId ? state.historyByTabId[activeCharacterId] : undefined
  );
  const undoCharacter = useCharactersStore((state) => state.undoCharacter);
  const redoCharacter = useCharactersStore((state) => state.redoCharacter);

  const canUndo = (history?.past.length ?? 0) > 0;
  const canRedo = (history?.future.length ?? 0) > 0;

  const undo = useCallback(() => {
    if (activeCharacterId) undoCharacter(activeCharacterId);
  }, [activeCharacterId, undoCharacter]);

  const redo = useCallback(() => {
    if (activeCharacterId) redoCharacter(activeCharacterId);
  }, [activeCharacterId, redoCharacter]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = getHistoryShortcut(event);
      if (shortcut === 'undo' && canUndo) {
        event.preventDefault();
        undo();
      }
      if (shortcut === 'redo' && canRedo) {
        event.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [canRedo, canUndo, redo, undo]);

  return { canUndo, canRedo, undo, redo };
}
