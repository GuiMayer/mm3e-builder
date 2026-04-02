import { create } from 'zustand';
import type { ICharacter, AbilityKey } from '../entities/types';

/* ================================================
   Character Store — Single Source of Truth
   Only manages character state. I/O is in fileService.
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
};

interface CharStoreState {
  character: ICharacter;
  isDirty: boolean;

  // Header
  updateHeader: (partial: Partial<ICharacter['header']>) => void;

  // Abilities
  setAbility: (key: AbilityKey, value: number) => void;
  toggleAbsentAbility: (key: AbilityKey) => void;

  // Defenses
  setDefense: (key: keyof ICharacter['defenses'], value: number) => void;

  // Full character operations
  loadCharacter: (character: ICharacter) => void;
  resetCharacter: () => void;

  // Dirty flag
  markClean: () => void;
}

export const useCharStore = create<CharStoreState>((set) => ({
  character: { ...DEFAULT_CHARACTER },
  isDirty: false,

  updateHeader: (partial) =>
    set((state) => ({
      character: {
        ...state.character,
        header: { ...state.character.header, ...partial },
      },
      isDirty: true,
    })),

  setAbility: (key, value) =>
    set((state) => ({
      character: {
        ...state.character,
        abilities: { ...state.character.abilities, [key]: value },
      },
      isDirty: true,
    })),

  toggleAbsentAbility: (key) =>
    set((state) => {
      const absent = state.character.absentAbilities;
      const newAbsent = absent.includes(key)
        ? absent.filter((k) => k !== key)
        : [...absent, key];
      return {
        character: {
          ...state.character,
          absentAbilities: newAbsent,
          abilities: {
            ...state.character.abilities,
            ...(newAbsent.includes(key) ? { [key]: 0 } : {}),
          },
        },
        isDirty: true,
      };
    }),

  setDefense: (key, value) =>
    set((state) => ({
      character: {
        ...state.character,
        defenses: { ...state.character.defenses, [key]: value },
      },
      isDirty: true,
    })),

  loadCharacter: (character) =>
    set({ character, isDirty: false }),

  resetCharacter: () =>
    set({
      character: {
        ...DEFAULT_CHARACTER,
        abilities: { ...DEFAULT_CHARACTER.abilities },
        defenses: { ...DEFAULT_CHARACTER.defenses },
        absentAbilities: [],
        skills: [],
        advantages: [],
        powers: [],
        complications: [],
      },
      isDirty: false,
    }),

  markClean: () => set({ isDirty: false }),
}));
