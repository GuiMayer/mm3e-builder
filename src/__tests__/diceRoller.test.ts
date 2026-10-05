import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoll, randomD20, rollFormula } from '../features/dice-roller/rollModel';
import { useRollSession } from '../features/dice-roller/rollSessionStore';

beforeEach(() => useRollSession.setState({ isOpen: false, history: [], limit: 15, keepHistory: false, sequence: 0, notice: null }));
afterEach(() => vi.unstubAllGlobals());

describe('Session dice roller', () => {
  it('keeps manual results source-free and supports negative bonuses', () => {
    const result = createRoll({ bonus: -7, source: null }, 1, () => 2);
    expect(result).toMatchObject({ die: 2, total: -5, source: null });
    expect(rollFormula(result)).toBe('d20 (2) − 7 = -5');
  });

  it('snapshots the original character, action and breakdown instead of referencing live sheet data', () => {
    const source = { characterId: 'hero-a', characterName: 'Hero A', section: 'Skills', label: 'Acrobatics', breakdown: ['AGL 4', 'Ranks 3'] };
    const result = createRoll({ bonus: 7, source }, 1, () => 14);
    source.characterName = 'Hero B';
    source.breakdown.push('New bonus 5');
    expect(result.source).toMatchObject({ characterId: 'hero-a', characterName: 'Hero A', breakdown: ['AGL 4', 'Ranks 3'] });
    expect(result.total).toBe(21);
  });

  it('keeps the latest 15 by default and trims only when a new limit is committed', () => {
    const roll = useRollSession.getState().roll;
    for (let i = 0; i < 20; i++) roll({ bonus: i, source: null });
    expect(useRollSession.getState().history.map(entry => entry.id)).toEqual(Array.from({ length: 15 }, (_, index) => 20 - index));
    useRollSession.getState().setLimit(30);
    for (let i = 0; i < 20; i++) roll({ bonus: i, source: null });
    expect(useRollSession.getState().history).toHaveLength(30);
    useRollSession.getState().setLimit(3);
    expect(useRollSession.getState().history.map(entry => entry.id)).toEqual([40, 39, 38]);
    useRollSession.getState().setLimit(15);
    expect(useRollSession.getState().history).toHaveLength(3);
  });

  it('ignores empty, fractional and nonfinite history limits', () => {
    for (const invalid of [0, -1, 1.5, NaN, Infinity]) useRollSession.getState().setLimit(invalid);
    expect(useRollSession.getState().limit).toBe(15);
  });

  it('keeps the panel closed during contextual rolls, retains history when toggled and handles stale notices', () => {
    const store = useRollSession.getState;
    store().roll({ bonus: 2, source: null });
    const firstId = store().notice!.id;
    store().roll({ bonus: 3, source: null });
    store().dismissNotice(firstId);
    expect(store().isOpen).toBe(false);
    expect(store().notice?.id).toBe(2);
    store().setOpen(true);
    expect(store().notice).toBeNull();
    expect(store().history).toHaveLength(2);
    store().roll({ bonus: 4, source: null });
    expect(store().notice).toBeNull();
    store().setOpen(false);
    expect(store().history).toHaveLength(3);
  });

  it('records routine checks without drawing a random die', () => {
    const draw = vi.fn(() => 17);
    const result = createRoll({ bonus: 8, source: null, mode: 'routine' }, 1, draw);
    expect(draw).not.toHaveBeenCalled();
    expect(rollFormula(result)).toBe('10 + 8 = 18');
  });

  it('rejects the incomplete random range instead of biasing d20 outcomes', () => {
    const values = [4_294_967_280, 4_294_967_295, 19];
    const fill = vi.fn((buffer: Uint32Array) => { buffer[0] = values.shift()!; return buffer; });
    vi.stubGlobal('crypto', { getRandomValues: fill });
    expect(randomD20()).toBe(20);
    expect(fill).toHaveBeenCalledTimes(3);
  });
});
