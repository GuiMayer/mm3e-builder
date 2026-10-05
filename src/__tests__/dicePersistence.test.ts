import { describe, expect, it, vi } from 'vitest';
import { createRollSessionStore } from '../features/dice-roller/rollSessionStore';
import { createRoll } from '../features/dice-roller/rollModel';
import { DICE_PREFERENCES_KEY, loadRollState } from '../features/dice-roller/rollStorage';

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: vi.fn((key: string, value: string) => { values.set(key, value); }),
  };
}

describe('Local dice preferences and optional history', () => {
  it('defaults to session-only history and remembers the limit independently after reopening', () => {
    const storage = memoryStorage();
    const session = createRollSessionStore(storage);
    expect(session.getState()).toMatchObject({ limit: 15, keepHistory: false, history: [] });
    session.getState().setLimit(30);
    session.getState().roll({ bonus: -3, source: null });
    expect(session.getState().history).toHaveLength(1);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    const reopened = createRollSessionStore(storage);
    expect(reopened.getState()).toMatchObject({ limit: 30, keepHistory: false, history: [], isOpen: false, notice: null });
  });

  it('saves existing results on opt-in and restores manual and routine source snapshots without rerolling', () => {
    const storage = memoryStorage();
    const session = createRollSessionStore(storage);
    session.getState().roll({ bonus: -7, source: null });
    session.getState().setKeepHistory(true);
    const source = { characterId: 'hero-a', characterName: 'Hero A', section: 'Skills', label: 'Acrobatics', detail: 'Routine', breakdown: ['AGL 4', 'Ranks 3'] };
    session.getState().roll({ bonus: 7, source, mode: 'routine' });
    source.characterName = 'Edited';
    source.breakdown.push('New bonus');
    const original = session.getState().history;
    const reopened = createRollSessionStore(storage);
    expect(reopened.getState().history).toEqual(original);
    expect(reopened.getState()).toMatchObject({ keepHistory: true, sequence: 2, notice: null, isOpen: false });
    reopened.getState().roll({ bonus: 0, source: null });
    expect(reopened.getState().history.map(result => result.id)).toEqual([3, 2, 1]);
  });

  it('disabling retention removes saved results but leaves the current session intact', () => {
    const storage = memoryStorage();
    const session = createRollSessionStore(storage);
    session.getState().setLimit(30);
    session.getState().setKeepHistory(true);
    session.getState().roll({ bonus: 2, source: null });
    session.getState().setKeepHistory(false);
    expect(session.getState().history).toHaveLength(1);
    expect(JSON.parse(storage.getItem(DICE_PREFERENCES_KEY)!)).toMatchObject({ keepHistory: false, history: [], limit: 30 });
    expect(createRollSessionStore(storage).getState()).toMatchObject({ keepHistory: false, history: [], limit: 30 });
    session.getState().setKeepHistory(true);
    expect(createRollSessionStore(storage).getState().history).toHaveLength(1);
  });

  it('persists trimming and clearing, while rejecting invalid capacities without replacing preferences', () => {
    const storage = memoryStorage();
    const session = createRollSessionStore(storage);
    session.getState().setKeepHistory(true);
    for (let i = 0; i < 4; i++) session.getState().roll({ bonus: i, source: null });
    session.getState().setLimit(2);
    for (const limit of [0, -1, 1.5, NaN, Infinity]) session.getState().setLimit(limit);
    const reopened = createRollSessionStore(storage);
    expect(reopened.getState().limit).toBe(2);
    expect(reopened.getState().history.map(result => result.id)).toEqual([4, 3]);
    reopened.getState().clearHistory();
    expect(createRollSessionStore(storage).getState()).toMatchObject({ limit: 2, keepHistory: true, history: [] });
  });

  it('ignores corrupt preferences and filters invalid or duplicate saved results', () => {
    const storage = memoryStorage();
    for (const raw of ['{', 'null', '[]', '{"version":2}']) {
      storage.values.set(DICE_PREFERENCES_KEY, raw);
      expect(loadRollState(storage)).toEqual({ limit: 15, keepHistory: false, history: [] });
    }
    const valid = createRoll({ bonus: 5, source: null }, 2, () => 13);
    storage.values.set(DICE_PREFERENCES_KEY, JSON.stringify({ version: 1, limit: 0, keepHistory: true, history: [
      { ...valid, id: -1 }, { ...valid, source: {} }, { ...valid, mode: 'unknown' },
      { ...valid, mode: 'routine' }, { ...valid, total: 999 }, valid, valid,
    ] }));
    expect(loadRollState(storage)).toEqual({ limit: 15, keepHistory: true, history: [valid] });
    storage.values.set(DICE_PREFERENCES_KEY, JSON.stringify({ version: 1, limit: 30, keepHistory: 'true', history: [valid] }));
    expect(loadRollState(storage)).toEqual({ limit: 30, keepHistory: false, history: [] });
  });

  it('continues rolling and changing preferences when browser storage is blocked or full', () => {
    const storage = {
      getItem: () => { throw new Error('Blocked'); },
      setItem: () => { throw new Error('Quota'); },
    };
    const session = createRollSessionStore(storage);
    expect(() => {
      session.getState().setLimit(30);
      session.getState().setKeepHistory(true);
      session.getState().roll({ bonus: 1, source: null });
      session.getState().setOpen(true);
      session.getState().clearHistory();
    }).not.toThrow();
    expect(session.getState()).toMatchObject({ limit: 30, keepHistory: true, history: [], isOpen: true });
  });
});
