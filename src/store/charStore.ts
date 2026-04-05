import { create } from 'zustand';
import type { ICharacter, AbilityKey, IPPLogEntry } from '../entities/types';
import { migratePowers } from '../shared/lib/powerMigration';

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
  equipmentNotes: '',
  campaignMode: false,
  ppLog: [],
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

  // Collections
  setSkills: (skills: ICharacter['skills']) => void;
  setAdvantages: (advantages: ICharacter['advantages']) => void;
  setPowers: (powers: ICharacter['powers']) => void;
  setComplications: (complications: ICharacter['complications']) => void;
  setEquipmentNotes: (notes: string) => void;

  // F-17 Campaign Mode
  setCampaignMode: (enabled: boolean) => void;
  addPPLogEntry: (entry: Omit<IPPLogEntry, 'id'>) => void;
  removePPLogEntry: (id: string) => void;

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
    set({
      character: {
        ...character,
        powers: migratePowers(character.powers as unknown[]),
      },
      isDirty: false,
    }),

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
        equipmentNotes: '',
      },
      isDirty: false,
    }),

  setSkills: (skills) =>
    set((state) => ({
      character: { ...state.character, skills },
      isDirty: true,
    })),

  setAdvantages: (advantages) =>
    set((state) => ({
      character: { ...state.character, advantages },
      isDirty: true,
    })),

  setPowers: (powers) =>
    set((state) => ({
      character: { ...state.character, powers },
      isDirty: true,
    })),

  setComplications: (complications) =>
    set((state) => ({
      character: { ...state.character, complications },
      isDirty: true,
    })),

  setEquipmentNotes: (equipmentNotes) =>
    set((state) => ({
      character: { ...state.character, equipmentNotes },
      isDirty: true,
    })),

  // F-17: Campaign Mode
  setCampaignMode: (enabled) =>
    set((state) => ({
      character: {
        ...state.character,
        campaignMode: enabled,
        ppLog: enabled ? (state.character.ppLog ?? []) : [],
      },
      isDirty: true,
    })),

  addPPLogEntry: (entry) =>
    set((state) => ({
      character: {
        ...state.character,
        ppLog: [
          ...(state.character.ppLog ?? []),
          { ...entry, id: crypto.randomUUID() },
        ],
      },
      isDirty: true,
    })),

  removePPLogEntry: (id) =>
    set((state) => ({
      character: {
        ...state.character,
        ppLog: (state.character.ppLog ?? []).filter((e) => e.id !== id),
      },
      isDirty: true,
    })),

  markClean: () => set({ isDirty: false }),
}));
