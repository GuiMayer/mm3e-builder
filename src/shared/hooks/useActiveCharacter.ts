import { useCharactersStore } from '../../store/charactersStore';
import type { ICharacter } from '../../entities/types';
import { createDefaultCharacter } from '../../entities/characterDefaults';

/* ================================================
   useActiveCharacter Hook
   Bridge between charactersStore and existing component patterns.
   Provides drop-in replacement for useCharStore selectors.
   ================================================ */

const EMPTY_CHARACTER = createDefaultCharacter();

/**
 * Hook to access the currently active character.
 * Returns safe defaults when no active character exists.
 */
export function useActiveCharacter() {
  const activeTab = useCharactersStore((s) => {
    const activeId = s.activeCharacterId;
    return activeId ? s.tabs.find((t) => t.id === activeId) : undefined;
  });

  // Return character or default empty character
  const character: ICharacter = activeTab?.character ?? EMPTY_CHARACTER;
  const isDirty = activeTab?.isDirty ?? false;
  const characterId = activeTab?.id ?? null;

  return {
    character,
    isDirty,
    characterId,
    exists: activeTab !== undefined,
  };
}
