/* ================================================
   Session Store — F-16 Active Conditions Tracker
   Session state: persists in sessionStorage, never in save files.
   ================================================ */
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface SessionStoreState {
  activeConditions: Set<string>;
  toggleCondition: (id: string) => void;
  clearConditions: () => void;
}

export const useSessionStore = create<SessionStoreState>()(
  devtools(
    persist(
      (set) => ({
        activeConditions: new Set<string>(),

        toggleCondition: (id) =>
          set((state) => {
            const next = new Set(state.activeConditions);
            if (next.has(id)) {
              next.delete(id);
            } else {
              next.add(id);
            }
            return { activeConditions: next };
          }),

        clearConditions: () =>
          set({ activeConditions: new Set() }),
      }),
      {
        name: 'mm3e-active-conditions',
        storage: {
          getItem: (name) => {
            const str = sessionStorage.getItem(name);
            if (!str) return null;
            const parsed = JSON.parse(str);
            // Reconstruct Set from array
            if (parsed.state?.activeConditions) {
              parsed.state.activeConditions = new Set(parsed.state.activeConditions);
            }
            return parsed;
          },
          setItem: (name, value) => {
            // Convert Set to array for serialization
            const toStore = {
              ...value,
              state: {
                ...value.state,
                activeConditions: [...value.state.activeConditions],
              },
            };
            sessionStorage.setItem(name, JSON.stringify(toStore));
          },
          removeItem: (name) => sessionStorage.removeItem(name),
        },
      }
    ),
    { name: 'SessionStore' }
  )
);
