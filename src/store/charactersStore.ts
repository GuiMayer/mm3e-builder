import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ICharacter } from '../entities/types';
import { createDefaultCharacter } from '../entities/characterDefaults';
import {
  duplicateCharacterWithNewIds,
  getDuplicateCharacterName,
} from '../entities/characterOperations';
import {
  areCharactersEqual,
  CHARACTER_HISTORY_LIMIT,
  createCharacterHistory,
  recordCharacterHistory,
  redoCharacterHistory,
  undoCharacterHistory,
} from '../entities/characterHistory';
import type { CharacterHistory, CharacterHistoryOptions } from '../entities/characterHistory';
import type { CharacterTab } from '../entities/characterTab';
export type { CharacterTab } from '../entities/characterTab';

interface ClosedTabHistoryEntry {
  tab: CharacterTab;
  index: number;
  characterHistory: CharacterHistory;
}

interface ClosedTabHistory {
  past: ClosedTabHistoryEntry[];
  future: ClosedTabHistoryEntry[];
}

function createClosedTabHistory(): ClosedTabHistory {
  return { past: [], future: [] };
}

function clearClosedTabHistory(): ClosedTabHistory {
  return createClosedTabHistory();
}

/* ================================================
   Characters Store — Multi-Character Management
   Manages multiple character tabs simultaneously.
   Each tab contains a character, dirty state, and metadata.
   ================================================ */

export interface CharactersStoreState {
  tabs: CharacterTab[];
  activeCharacterId: string | null;
  /** Runtime-only history keyed by tab ID. It is deliberately not persisted. */
  historyByTabId: Record<string, CharacterHistory>;
  /** Recently closed tabs are reversible only during the current browser session. */
  closedTabHistory: ClosedTabHistory;

  // Core operations
  addCharacter: (character?: Partial<ICharacter>) => string;
  removeCharacter: (id: string) => void;
  setActiveCharacter: (id: string) => void;
  updateCharacter: (
    id: string,
    updates: Partial<ICharacter>,
    historyOptions?: CharacterHistoryOptions
  ) => void;
  duplicateCharacter: (id: string) => string;
  reorderTabs: (newOrder: string[]) => void;

  // History operations
  undoCharacter: (id: string) => void;
  redoCharacter: (id: string) => void;
  clearCharacterHistory: (id: string) => void;
  canUndoCharacter: (id: string) => boolean;
  canRedoCharacter: (id: string) => boolean;
  undoClosedTab: () => void;
  redoClosedTab: () => void;
  canUndoClosedTab: () => boolean;
  canRedoClosedTab: () => boolean;

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
      historyByTabId: {},
      closedTabHistory: createClosedTabHistory(),

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
          historyByTabId: {
            ...state.historyByTabId,
            [newId]: createCharacterHistory(),
          },
          closedTabHistory: clearClosedTabHistory(),
        }));

        return newId;
      },

      removeCharacter: (id) => {
        set((state) => {
          const tabIndex = state.tabs.findIndex((tab) => tab.id === id);
          if (tabIndex === -1) return {};

          const closedTab = state.tabs[tabIndex];
          const newTabs = state.tabs.filter((tab) => tab.id !== id);
          const historyByTabId = { ...state.historyByTabId };
          delete historyByTabId[id];
          let newActiveId = state.activeCharacterId;

          // If removed tab was active, select first remaining tab
          if (state.activeCharacterId === id) {
            newActiveId = newTabs.length > 0 ? newTabs[0].id : null;
          }

          const closedEntry: ClosedTabHistoryEntry = {
            tab: closedTab,
            index: tabIndex,
            characterHistory: state.historyByTabId[id] ?? createCharacterHistory(),
          };
          const past = [...state.closedTabHistory.past, closedEntry]
            .slice(-CHARACTER_HISTORY_LIMIT);

          return {
            tabs: newTabs,
            activeCharacterId: newActiveId,
            historyByTabId,
            closedTabHistory: { past, future: [] },
          };
        });
      },

      setActiveCharacter: (id) => {
        const tab = get().tabs.find((t) => t.id === id);
        if (tab) {
          set({ activeCharacterId: id });
        }
      },

      updateCharacter: (id, updates, historyOptions) => {
        set((state) => {
          const tab = state.tabs.find((candidate) => candidate.id === id);
          if (!tab) return {};

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

          if (areCharactersEqual(tab.character, updatedCharacter)) return {};

          const history = recordCharacterHistory(
            state.historyByTabId[id] ?? createCharacterHistory(),
            tab.character,
            updatedCharacter,
            historyOptions
          );
          const updatedTab: CharacterTab = {
            ...tab,
            character: updatedCharacter,
            label: updatedCharacter.header.name || 'Unnamed Character',
            isDirty: true,
            lastModified: Date.now(),
          };

          return {
            tabs: state.tabs.map((candidate) =>
              candidate.id === id ? updatedTab : candidate
            ),
            historyByTabId: {
              ...state.historyByTabId,
              [id]: history,
            },
            closedTabHistory: clearClosedTabHistory(),
          };
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
          historyByTabId: {
            ...state.historyByTabId,
            [newId]: createCharacterHistory(),
          },
          closedTabHistory: clearClosedTabHistory(),
        }));

        return newId;
      },

      reorderTabs: (newOrder) => {
        set((state) => {
          const orderedTabs = newOrder
            .map((id) => state.tabs.find((t) => t.id === id))
            .filter((t): t is CharacterTab => t !== undefined);

          return { tabs: orderedTabs, closedTabHistory: clearClosedTabHistory() };
        });
      },

      undoCharacter: (id) => {
        set((state) => {
          const tab = state.tabs.find((candidate) => candidate.id === id);
          if (!tab) return {};

          const result = undoCharacterHistory(
            state.historyByTabId[id] ?? createCharacterHistory(),
            tab.character
          );
          if (!result) return {};

          const restoredTab: CharacterTab = {
            ...tab,
            character: result.character,
            label: result.character.header.name || 'Unnamed Character',
            isDirty: true,
            lastModified: Date.now(),
          };

          return {
            tabs: state.tabs.map((candidate) =>
              candidate.id === id ? restoredTab : candidate
            ),
            historyByTabId: {
              ...state.historyByTabId,
              [id]: result.history,
            },
          };
        });
      },

      redoCharacter: (id) => {
        set((state) => {
          const tab = state.tabs.find((candidate) => candidate.id === id);
          if (!tab) return {};

          const result = redoCharacterHistory(
            state.historyByTabId[id] ?? createCharacterHistory(),
            tab.character
          );
          if (!result) return {};

          const restoredTab: CharacterTab = {
            ...tab,
            character: result.character,
            label: result.character.header.name || 'Unnamed Character',
            isDirty: true,
            lastModified: Date.now(),
          };

          return {
            tabs: state.tabs.map((candidate) =>
              candidate.id === id ? restoredTab : candidate
            ),
            historyByTabId: {
              ...state.historyByTabId,
              [id]: result.history,
            },
          };
        });
      },

      clearCharacterHistory: (id) => {
        set((state) => ({
          historyByTabId: {
            ...state.historyByTabId,
            [id]: createCharacterHistory(),
          },
        }));
      },

      canUndoCharacter: (id) => (get().historyByTabId[id]?.past.length ?? 0) > 0,

      canRedoCharacter: (id) => (get().historyByTabId[id]?.future.length ?? 0) > 0,

      undoClosedTab: () => {
        set((state) => {
          const entry = state.closedTabHistory.past.at(-1);
          if (!entry || state.tabs.some((tab) => tab.id === entry.tab.id)) return {};

          const tabs = [...state.tabs];
          tabs.splice(Math.min(entry.index, tabs.length), 0, entry.tab);

          return {
            tabs,
            activeCharacterId: entry.tab.id,
            historyByTabId: {
              ...state.historyByTabId,
              [entry.tab.id]: entry.characterHistory,
            },
            closedTabHistory: {
              past: state.closedTabHistory.past.slice(0, -1),
              future: [...state.closedTabHistory.future, entry],
            },
          };
        });
      },

      redoClosedTab: () => {
        set((state) => {
          const entry = state.closedTabHistory.future.at(-1);
          if (!entry) return {};

          const tabIndex = state.tabs.findIndex((tab) => tab.id === entry.tab.id);
          if (tabIndex === -1) return {};

          const tab = state.tabs[tabIndex];
          const tabs = state.tabs.filter((candidate) => candidate.id !== entry.tab.id);
          const historyByTabId = { ...state.historyByTabId };
          delete historyByTabId[entry.tab.id];
          const redoneEntry: ClosedTabHistoryEntry = {
            ...entry,
            tab,
            index: tabIndex,
            characterHistory: state.historyByTabId[entry.tab.id] ?? entry.characterHistory,
          };

          return {
            tabs,
            activeCharacterId: state.activeCharacterId === entry.tab.id
              ? tabs[0]?.id ?? null
              : state.activeCharacterId,
            historyByTabId,
            closedTabHistory: {
              past: [...state.closedTabHistory.past, redoneEntry]
                .slice(-CHARACTER_HISTORY_LIMIT),
              future: state.closedTabHistory.future.slice(0, -1),
            },
          };
        });
      },

      canUndoClosedTab: () => get().closedTabHistory.past.length > 0,

      canRedoClosedTab: () => get().closedTabHistory.future.length > 0,

      loadCharacters: (tabs, activeId) => {
        set({
          tabs,
          activeCharacterId: activeId,
          historyByTabId: {},
          closedTabHistory: clearClosedTabHistory(),
        });
      },

      loadTabs: (tabs, activeId) => {
        set({
          tabs,
          activeCharacterId: activeId,
          historyByTabId: {},
          closedTabHistory: clearClosedTabHistory(),
        });
      },

      clearAllCharacters: () => {
        set({
          tabs: [],
          activeCharacterId: null,
          historyByTabId: {},
          closedTabHistory: clearClosedTabHistory(),
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
