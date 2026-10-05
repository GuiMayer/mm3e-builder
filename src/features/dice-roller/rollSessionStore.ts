import { create } from 'zustand';
import { createRoll, limitRollHistory, validRollLimit } from './rollModel';
import type { RollRequest, RollResult } from './rollModel';
import { loadRollState, saveRollState } from './rollStorage';
import type { DiceStorage } from './rollStorage';

interface RollSession {
  isOpen: boolean;
  limit: number;
  keepHistory: boolean;
  history: RollResult[];
  notice: RollResult | null;
  sequence: number;
  setOpen: (open: boolean) => void;
  setLimit: (limit: number) => void;
  setKeepHistory: (keepHistory: boolean) => void;
  roll: (request: RollRequest) => void;
  dismissNotice: (id: number) => void;
  clearHistory: () => void;
}

/** Preferences persist separately from sheets; results persist only by explicit opt-in. */
export function createRollSessionStore(storage?: DiceStorage) {
  const saved = loadRollState(storage);
  const store = create<RollSession>((set) => ({
    isOpen: false,
    ...saved,
    notice: null,
    sequence: saved.history.reduce((max, result) => Math.max(max, result.id), 0),
    setOpen: (isOpen) => set({ isOpen, notice: null }),
    setLimit: (limit) => {
      if (validRollLimit(limit)) set(state => ({ limit, history: limitRollHistory(state.history, limit) }));
    },
    setKeepHistory: (keepHistory) => set({ keepHistory }),
    roll: (request) => set(state => {
      const result = createRoll(request, state.sequence + 1);
      return {
        sequence: result.id,
        history: limitRollHistory([result, ...state.history], state.limit),
        notice: state.isOpen ? null : result,
      };
    }),
    dismissNotice: (id) => set(state => state.notice?.id === id ? { notice: null } : {}),
    clearHistory: () => set({ history: [], notice: null }),
  }));
  store.subscribe((state, previous) => {
    if (state.limit !== previous.limit || state.keepHistory !== previous.keepHistory ||
        (state.keepHistory && state.history !== previous.history)) {
      saveRollState(state, storage);
    }
  });
  return store;
}

export const useRollSession = createRollSessionStore();
