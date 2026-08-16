import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import {
  CHARACTER_HISTORY_LIMIT,
  createCharacterHistory,
  recordCharacterHistory,
  redoCharacterHistory,
  undoCharacterHistory,
} from '../entities/characterHistory';

function withName(name: string) {
  const character = createDefaultCharacter();
  return { ...character, header: { ...character.header, name } };
}

describe('character history', () => {
  it('records an earlier snapshot without sharing nested references', () => {
    const before = withName('Before');
    const after = withName('After');
    const history = recordCharacterHistory(createCharacterHistory(), before, after);

    before.header.name = 'Mutated';

    expect(history.past).toHaveLength(1);
    expect(history.past[0].header.name).toBe('Before');
  });

  it('does not record no-op updates', () => {
    const character = withName('Same');
    const history = createCharacterHistory();

    expect(recordCharacterHistory(history, character, structuredClone(character))).toBe(history);
  });

  it('groups consecutive changes to the same field', () => {
    const first = withName('A');
    const second = withName('Al');
    const third = withName('Ali');

    const firstHistory = recordCharacterHistory(createCharacterHistory(), first, second, {
      group: 'header:name',
      now: 100,
    });
    const groupedHistory = recordCharacterHistory(firstHistory, second, third, {
      group: 'header:name',
      now: 300,
    });

    expect(groupedHistory.past).toHaveLength(1);
    expect(undoCharacterHistory(groupedHistory, third)?.character.header.name).toBe('A');
  });

  it('clears redo history after a new committed change', () => {
    const first = withName('First');
    const second = withName('Second');
    const third = withName('Third');
    const history = recordCharacterHistory(createCharacterHistory(), first, second);
    const undone = undoCharacterHistory(history, second)!;
    const changedAgain = recordCharacterHistory(undone.history, undone.character, third);

    expect(changedAgain.future).toEqual([]);
  });

  it('moves snapshots in both directions', () => {
    const first = withName('First');
    const second = withName('Second');
    const history = recordCharacterHistory(createCharacterHistory(), first, second);
    const undone = undoCharacterHistory(history, second)!;
    const redone = redoCharacterHistory(undone.history, undone.character)!;

    expect(undone.character.header.name).toBe('First');
    expect(redone.character.header.name).toBe('Second');
  });

  it('keeps only the configured number of snapshots', () => {
    let history = createCharacterHistory();
    let previous = withName('0');

    for (let index = 1; index <= CHARACTER_HISTORY_LIMIT + 1; index += 1) {
      const next = withName(String(index));
      history = recordCharacterHistory(history, previous, next, { now: index * 1000 });
      previous = next;
    }

    expect(history.past).toHaveLength(CHARACTER_HISTORY_LIMIT);
    expect(history.past[0].header.name).toBe('1');
  });
});
