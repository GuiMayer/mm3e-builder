import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ICharacter } from '../entities/types';

/* ================================================
   Characters Store — Multi-Character Management
   Manages multiple character tabs simultaneously.
   Each tab contains a character, dirty state, and metadata.
   ================================================ */

const DEFAULT_CHARACTER: ICharacter = {
  characterId: undefined,
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

export interface CharacterTab {
  id: string;
  character: ICharacter;
  isDirty: boolean;
  label: string;
  lastModified: number;
}

interface CharactersStoreState {
  tabs: CharacterTab[];
  activeCharacterId: string | null;

  // Core operations
  addCharacter: (character?: Partial<ICharacter>) => string;
  removeCharacter: (id: string) => void;
  setActiveCharacter: (id: string) => void;
  updateCharacter: (id: string, updates: Partial<ICharacter>) => void;
  duplicateCharacter: (id: string) => string;
  reorderTabs: (newOrder: string[]) => void;

  // Bulk operations
  loadCharacters: (tabs: CharacterTab[], activeId: string | null) => void;
  loadTabs: (tabs: CharacterTab[], activeId: string | null) => void;
  clearAllCharacters: () => void;

  // Dirty state management
  markCharacterDirty: (id: string) => void;
  markCharacterClean: (id: string) => void;

  // Helpers
  getCharacterById: (id: string) => CharacterTab | undefined;
  getActiveCharacter: () => CharacterTab | undefined;
}

/**
 * Recursively regenerate all UUIDs in a character's nested structures
 */
function regenerateNestedUUIDs(character: ICharacter): void {
  // Regenerate power IDs
  character.powers?.forEach((power) => {
    power.id = crypto.randomUUID();

    power.components?.forEach((component) => {
      component.id = crypto.randomUUID();
    });

    power.alternateEffects?.forEach((ae) => {
      ae.id = crypto.randomUUID();
      ae.components?.forEach((component) => {
        component.id = crypto.randomUUID();
      });
    });
  });

  // Regenerate equipment IDs
  character.equipment?.forEach((item) => {
    item.id = crypto.randomUUID();

    item.components?.forEach((component) => {
      component.id = crypto.randomUUID();
    });

    item.alternateEffects?.forEach((ae) => {
      ae.id = crypto.randomUUID();
      ae.components?.forEach((component) => {
        component.id = crypto.randomUUID();
      });
    });
  });
}

export const useCharactersStore = create<CharactersStoreState>()(
  devtools(
    (set, get) => ({
      tabs: [],
      activeCharacterId: null,

      addCharacter: (character) => {
        const newId = crypto.randomUUID();
        const baseCharacter = character
          ? { ...DEFAULT_CHARACTER, ...character }
          : { ...DEFAULT_CHARACTER };

        const newTab: CharacterTab = {
          id: newId,
          character: baseCharacter,
          isDirty: true, // New characters should be auto-saved immediately
          label: baseCharacter.header?.name || 'Unnamed Character',
          lastModified: Date.now(),
        };

        set((state) => ({
          tabs: [...state.tabs, newTab],
          activeCharacterId: newId,
        }));

        return newId;
      },

      removeCharacter: (id) => {
        set((state) => {
          const newTabs = state.tabs.filter((t) => t.id !== id);
          let newActiveId = state.activeCharacterId;

          // If removed tab was active, select first remaining tab
          if (state.activeCharacterId === id) {
            newActiveId = newTabs.length > 0 ? newTabs[0].id : null;
          }

          return {
            tabs: newTabs,
            activeCharacterId: newActiveId,
          };
        });
      },

      setActiveCharacter: (id) => {
        const tab = get().tabs.find((t) => t.id === id);
        if (tab) {
          set({ activeCharacterId: id });
        }
      },

      updateCharacter: (id, updates) => {
        set((state) => {
          const tabs = state.tabs.map((tab) => {
            if (tab.id !== id) return tab;

            const updatedCharacter = {
              ...tab.character,
              ...updates,
              // Deep merge nested objects
              header: updates.header
                ? { ...tab.character.header, ...updates.header }
                : tab.character.header,
              abilities: updates.abilities
                ? { ...tab.character.abilities, ...updates.abilities }
                : tab.character.abilities,
              defenses: updates.defenses
                ? { ...tab.character.defenses, ...updates.defenses }
                : tab.character.defenses,
            };

            return {
              ...tab,
              character: updatedCharacter,
              label: updatedCharacter.header.name || 'Unnamed Character',
              isDirty: true,
              lastModified: Date.now(),
            };
          });

          return { tabs };
        });
      },

      duplicateCharacter: (id) => {
        const source = get().tabs.find((t) => t.id === id);
        if (!source) return '';

        // Deep clone character
        const clonedCharacter = JSON.parse(
          JSON.stringify(source.character)
        ) as ICharacter;

        // Generate smart name for duplicate
        const baseName = source.label || 'Unnamed Character';
        let newName = baseName;

        // Check if already has " (Copy)" suffix
        const copyMatch = baseName.match(/^(.+?)(?: \(Copy(?: (\d+))?\))?$/);
        if (copyMatch) {
          const base = copyMatch[1];
          const allCopies = get()
            .tabs.filter((t) => t.label.startsWith(base + ' (Copy'))
            .map((t) => {
              const match = t.label.match(/\(Copy(?: (\d+))?\)$/);
              return match ? (match[1] ? parseInt(match[1]) : 1) : 0;
            });

          const maxCopy = Math.max(0, ...allCopies);
          const nextNumber = maxCopy + 1;

          if (nextNumber === 1) {
            newName = `${base} (Copy)`;
          } else {
            newName = `${base} (Copy ${nextNumber})`;
          }
        } else {
          newName = `${baseName} (Copy)`;
        }

        clonedCharacter.header.name = newName;

        // Regenerate all nested UUIDs
        regenerateNestedUUIDs(clonedCharacter);

        // Create new tab
        const newId = crypto.randomUUID();
        const newTab: CharacterTab = {
          id: newId,
          character: clonedCharacter,
          label: newName,
          isDirty: true,
          lastModified: Date.now(),
        };

        set((state) => ({
          tabs: [...state.tabs, newTab],
          activeCharacterId: newId,
        }));

        return newId;
      },

      reorderTabs: (newOrder) => {
        set((state) => {
          const orderedTabs = newOrder
            .map((id) => state.tabs.find((t) => t.id === id))
            .filter((t): t is CharacterTab => t !== undefined);

          return { tabs: orderedTabs };
        });
      },

      loadCharacters: (tabs, activeId) => {
        set({
          tabs,
          activeCharacterId: activeId,
        });
      },

      loadTabs: (tabs, activeId) => {
        set({
          tabs,
          activeCharacterId: activeId,
        });
      },

      clearAllCharacters: () => {
        set({
          tabs: [],
          activeCharacterId: null,
        });
      },

      markCharacterDirty: (id) => {
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === id ? { ...tab, isDirty: true } : tab
          ),
        }));
      },

      markCharacterClean: (id) => {
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === id ? { ...tab, isDirty: false } : tab
          ),
        }));
      },

      getCharacterById: (id) => {
        return get().tabs.find((t) => t.id === id);
      },

      getActiveCharacter: () => {
        const state = get();
        return state.activeCharacterId
          ? state.tabs.find((t) => t.id === state.activeCharacterId)
          : undefined;
      },
    }),
    { name: 'CharactersStore' }
  )
);
