import { create } from 'zustand';
import { createRoll, DEFAULT_ROLL_LIMIT, limitRollHistory, validRollLimit } from './rollModel';
import type { RollRequest, RollResult } from './rollModel';

interface RollSession {
  isOpen: boolean;
  limit: number;
  history: RollResult[];
  notice: RollResult | null;
  sequence: number;
  setOpen: (open: boolean) => void;
  setLimit: (limit: number) => void;
  roll: (request: RollRequest) => void;
  dismissNotice: (id: number) => void;
  clearHistory: () => void;
}

/** Deliberately has no persistence middleware: reload/closing the app ends the session. */
export const useRollSession = create<RollSession>((set) => ({
  isOpen: false,
  limit: DEFAULT_ROLL_LIMIT,
  history: [],
  notice: null,
  sequence: 0,
  setOpen: (isOpen) => set({ isOpen, notice: null }),
  setLimit: (limit) => {
    if (validRollLimit(limit)) set(state => ({ limit, history: limitRollHistory(state.history, limit) }));
  },
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
