import { useMemo } from 'react';
import { useCharStore } from '../../store/charStore';
import { POWER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../../entities/gameDataLoaders';
import { buildOffenseSummary } from '../lib/offenseSummary';
import type { IOffenseEntry } from '../lib/offenseSummary';

export type { IOffenseEntry };

/**
 * Derives the offense summary table from the current character state.
 * Thin React wrapper around the pure buildOffenseSummary function.
 * The PDF generator calls buildOffenseSummary directly.
 */
export function useOffenseSummary(): IOffenseEntry[] {
  const character = useCharStore((s) => s.character);

  return useMemo(
    () => buildOffenseSummary(character, POWER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS),
    [character]
  );
}
