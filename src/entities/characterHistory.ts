import type { ICharacter } from './types';

export const CHARACTER_HISTORY_LIMIT = 50;
export const CHARACTER_HISTORY_GROUP_WINDOW_MS = 700;

export interface CharacterHistory {
  past: ICharacter[];
  future: ICharacter[];
  lastGroup?: string;
  lastChangedAt?: number;
}

export interface CharacterHistoryOptions {
  group?: string;
  now?: number;
}

export interface CharacterHistoryResult {
  character: ICharacter;
  history: CharacterHistory;
}

export function createCharacterHistory(): CharacterHistory {
  return { past: [], future: [] };
}

/**
 * Character data is plain, browser-owned data. Keeping history snapshots deeply
 * cloned prevents later form updates from mutating an earlier undo step.
 */
export function cloneCharacterSnapshot(character: ICharacter): ICharacter {
  return structuredClone(character);
}

export function areCharactersEqual(left: ICharacter, right: ICharacter): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function limitSnapshots(snapshots: ICharacter[]): ICharacter[] {
  return snapshots.length > CHARACTER_HISTORY_LIMIT
    ? snapshots.slice(-CHARACTER_HISTORY_LIMIT)
    : snapshots;
}

/**
 * Records the state before a committed character change. Consecutive updates to
 * the same field group are collapsed into one step so ordinary typing remains
 * useful to undo.
 */
export function recordCharacterHistory(
  history: CharacterHistory,
  before: ICharacter,
  after: ICharacter,
  options: CharacterHistoryOptions = {}
): CharacterHistory {
  if (areCharactersEqual(before, after)) return history;

  const now = options.now ?? Date.now();
  const canGroup =
    options.group !== undefined &&
    history.lastGroup === options.group &&
    history.lastChangedAt !== undefined &&
    now - history.lastChangedAt <= CHARACTER_HISTORY_GROUP_WINDOW_MS;

  return {
    past: canGroup
      ? history.past
      : limitSnapshots([...history.past, cloneCharacterSnapshot(before)]),
    future: [],
    lastGroup: options.group,
    lastChangedAt: now,
  };
}

export function undoCharacterHistory(
  history: CharacterHistory,
  current: ICharacter
): CharacterHistoryResult | null {
  const previous = history.past.at(-1);
  if (!previous) return null;

  return {
    character: cloneCharacterSnapshot(previous),
    history: {
      past: history.past.slice(0, -1),
      future: limitSnapshots([...history.future, cloneCharacterSnapshot(current)]),
    },
  };
}

export function redoCharacterHistory(
  history: CharacterHistory,
  current: ICharacter
): CharacterHistoryResult | null {
  const next = history.future.at(-1);
  if (!next) return null;

  return {
    character: cloneCharacterSnapshot(next),
    history: {
      past: limitSnapshots([...history.past, cloneCharacterSnapshot(current)]),
      future: history.future.slice(0, -1),
    },
  };
}
