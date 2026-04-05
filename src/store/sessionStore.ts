/* ================================================
   Session Store — F-16 Active Conditions Tracker
   Session state: persists in sessionStorage, never in save files.
   ================================================ */
import { create } from 'zustand';

interface SessionStoreState {
  activeConditions: Set<string>;
  toggleCondition: (id: string) => void;
  clearConditions: () => void;
}

function loadFromSession(): Set<string> {
  try {
    const stored = sessionStorage.getItem('mm3e-active-conditions');
    if (stored) {
      const arr = JSON.parse(stored) as string[];
      return new Set(arr);
    }
  } catch { /* ignore */ }
  return new Set();
}

function saveToSession(conditions: Set<string>) {
  try {
    sessionStorage.setItem('mm3e-active-conditions', JSON.stringify([...conditions]));
  } catch { /* ignore quota errors */ }
}

export const useSessionStore = create<SessionStoreState>((set) => ({
  activeConditions: loadFromSession(),

  toggleCondition: (id) =>
    set((state) => {
      const next = new Set(state.activeConditions);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveToSession(next);
      return { activeConditions: next };
    }),

  clearConditions: () => {
    saveToSession(new Set());
    return set({ activeConditions: new Set() });
  },
}));
