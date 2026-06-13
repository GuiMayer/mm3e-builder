import { useCharactersStore } from '../../store/charactersStore';
import type { ICharacter } from '../../entities/types';

/* ================================================
   useActiveCharacter Hook
   Bridge between charactersStore and existing component patterns.
   Provides drop-in replacement for useCharStore selectors.
   ================================================ */

const DEFAULT_CHARACTER: ICharacter = {
  header: {
    name: '',
    player: '',
    identity: '',
    base: '',
    powerLevel: 10,
    heroPoints: 1,
  },
  abilities: { str: 0, sta: 0, agl: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
  absentAbilities: [],
  defenses: { dodge: 0, parry: 0, fortitude: 0, will: 0 },
  skills: [],
  advantages: [],
  powers: [],
  complications: [],
  equipmentNotes: '',
  manualOffenseRows: [],
  campaignMode: false,
  ppLog: [],
};

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
  const character: ICharacter = activeTab?.character ?? DEFAULT_CHARACTER;
  const isDirty = activeTab?.isDirty ?? false;
  const characterId = activeTab?.id ?? null;

  return {
    character,
    isDirty,
    characterId,
    exists: activeTab !== undefined,
  };
}
