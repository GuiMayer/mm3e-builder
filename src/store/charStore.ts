import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ICharacter, AbilityKey, IPPLogEntry, IManualOffenseRow } from '../entities/types';
import { migratePowers } from '../shared/lib/powerMigration';
import { useCharactersStore } from './charactersStore';

/* ================================================
   Character Store — Facade (DEPRECATED - DO NOT USE)
   
   ⚠️ CRITICAL WARNING ⚠️
   This store is DEPRECATED and causes infinite render loops.
   
   DO NOT USE THIS STORE IN NEW CODE.
   DO NOT IMPORT useCharStore IN NEW COMPONENTS.
   
   Root cause: This store uses getters that access useCharactersStore.getState()
   and return new object references on every access, causing React infinite loops.
   
   MIGRATION COMPLETE: All components have been migrated away from this store.
   
   Use instead:
   - useActiveCharacter() hook for reading character data
   - useCharacterActions() hook for mutations
   
   This file is kept for reference only and will be removed in a future version.
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
  setEquipment: (equipment: ICharacter['equipment']) => void;
  setEquipmentNotes: (notes: string) => void;
  setNotes: (notes: string) => void;
  setManualOffenseRows: (rows: IManualOffenseRow[]) => void;

  // F-17 Campaign Mode
  setCampaignMode: (enabled: boolean) => void;
  addPPLogEntry: (entry: Omit<IPPLogEntry, 'id'>) => void;
  removePPLogEntry: (id: string) => void;

  // Dirty flag
  markClean: () => void;
}

export const useCharStore = create<CharStoreState>()(
  devtools(
    () => ({
      // Computed properties from charactersStore
      get character() {
        const active = useCharactersStore.getState().getActiveCharacter();
        return active?.character ?? { ...DEFAULT_CHARACTER };
      },

      get isDirty() {
        const active = useCharactersStore.getState().getActiveCharacter();
        return active?.isDirty ?? false;
      },

  updateHeader: (partial) => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;
    if (!activeId) return;

    const active = state.getCharacterById(activeId);
    if (!active) return;

    state.updateCharacter(activeId, {
      header: { ...active.character.header, ...partial },
    });
  },

  setAbility: (key, value) => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;
    if (!activeId) return;

    const active = state.getCharacterById(activeId);
    if (!active) return;

    state.updateCharacter(activeId, {
      abilities: { ...active.character.abilities, [key]: value },
    });
  },

  toggleAbsentAbility: (key) => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;
    if (!activeId) return;

    const active = state.getCharacterById(activeId);
    if (!active) return;

    const absent = active.character.absentAbilities;
    const newAbsent = absent.includes(key)
      ? absent.filter((k) => k !== key)
      : [...absent, key];

    state.updateCharacter(activeId, {
      absentAbilities: newAbsent,
      abilities: {
        ...active.character.abilities,
        ...(newAbsent.includes(key) ? { [key]: 0 } : {}),
      },
    });
  },

  setDefense: (key, value) => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;
    if (!activeId) return;

    const active = state.getCharacterById(activeId);
    if (!active) return;

    state.updateCharacter(activeId, {
      defenses: { ...active.character.defenses, [key]: value },
    });
  },

  loadCharacter: (character) => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;

    const migratedCharacter = {
      ...character,
      powers: migratePowers(character.powers as unknown[]),
    };

    if (activeId) {
      // Replace active character
      state.updateCharacter(activeId, migratedCharacter);
      state.markCharacterClean(activeId);
    } else {
      // Create new tab if none exists
      state.addCharacter(migratedCharacter);
    }
  },

  resetCharacter: () => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;

    if (activeId) {
      // Reset active character to defaults
      state.updateCharacter(activeId, {
        ...DEFAULT_CHARACTER,
        abilities: { ...DEFAULT_CHARACTER.abilities },
        defenses: { ...DEFAULT_CHARACTER.defenses },
        absentAbilities: [],
        skills: [],
        advantages: [],
        powers: [],
        complications: [],
        equipmentNotes: '',
      });
      state.markCharacterClean(activeId);
    }
  },

  setSkills: (skills) => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;
    if (activeId) state.updateCharacter(activeId, { skills });
  },

  setAdvantages: (advantages) => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;
    if (activeId) state.updateCharacter(activeId, { advantages });
  },

  setPowers: (powers) => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;
    if (activeId) state.updateCharacter(activeId, { powers });
  },

  setComplications: (complications) => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;
    if (activeId) state.updateCharacter(activeId, { complications });
  },

  setEquipment: (equipment) => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;
    if (activeId) state.updateCharacter(activeId, { equipment });
  },

  setEquipmentNotes: (equipmentNotes) => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;
    if (activeId) state.updateCharacter(activeId, { equipmentNotes });
  },

  setManualOffenseRows: (manualOffenseRows) => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;
    if (activeId) state.updateCharacter(activeId, { manualOffenseRows });
  },

  setNotes: (notes) => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;
    if (activeId) state.updateCharacter(activeId, { notes });
  },

  // F-17: Campaign Mode
  setCampaignMode: (enabled) => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;
    if (!activeId) return;

    const active = state.getCharacterById(activeId);
    if (!active) return;

    state.updateCharacter(activeId, {
      campaignMode: enabled,
      ppLog: enabled ? (active.character.ppLog ?? []) : [],
    });
  },

  addPPLogEntry: (entry) => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;
    if (!activeId) return;

    const active = state.getCharacterById(activeId);
    if (!active) return;

    state.updateCharacter(activeId, {
      ppLog: [
        ...(active.character.ppLog ?? []),
        { ...entry, id: crypto.randomUUID() },
      ],
    });
  },

  removePPLogEntry: (id) => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;
    if (!activeId) return;

    const active = state.getCharacterById(activeId);
    if (!active) return;

    state.updateCharacter(activeId, {
      ppLog: (active.character.ppLog ?? []).filter((e) => e.id !== id),
    });
  },

  markClean: () => {
    const state = useCharactersStore.getState();
    const activeId = state.activeCharacterId;
    if (activeId) state.markCharacterClean(activeId);
  },
    }),
    { name: 'CharStore' }
  )
);
