import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ICharacter } from '../entities/types';
import { createDefaultCharacter } from '../entities/characterDefaults';
import {
  duplicateCharacterWithNewIds,
  getDuplicateCharacterName,
} from '../entities/characterOperations';
import type { CharacterTab } from '../entities/characterTab';
export type { CharacterTab } from '../entities/characterTab';

/* ================================================
   Characters Store — Multi-Character Management
   Manages multiple character tabs simultaneously.
   Each tab contains a character, dirty state, and metadata.
   ================================================ */

export interface CharactersStoreState {
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

export const useCharactersStore = create<CharactersStoreState>()(
  devtools(
    (set, get) => ({
      tabs: [],
      activeCharacterId: null,

      addCharacter: (character) => {
        const newId = crypto.randomUUID();
        const baseCharacter = createDefaultCharacter(character);

        // Ensure character has characterId for cross-device sync
        // If already exists (from import), preserve it
        // If not (new tab created by user), generate new UUID
        if (!baseCharacter.characterId) {
          baseCharacter.characterId = newId;
        }

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

        const newName = getDuplicateCharacterName(
          source.label,
          get().tabs.map((tab) => tab.label)
        );
        const clonedCharacter = duplicateCharacterWithNewIds(
          source.character,
          newName
        );

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
