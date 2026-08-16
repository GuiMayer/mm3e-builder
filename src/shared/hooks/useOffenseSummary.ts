import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveCharacter } from './useActiveCharacter';
import { POWER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { buildOffenseSummary } from '../lib/offenseSummary';
import { useResourcesStore } from '../../store/resourcesStore';
import type { IOffenseEntry } from '../lib/offenseSummary';

export type { IOffenseEntry };

/**
 * Derives the offense summary table from the current character state.
 * Thin React wrapper around the pure buildOffenseSummary function.
 * The PDF generator calls buildOffenseSummary directly.
 */
export function useOffenseSummary(): IOffenseEntry[] {
  const { character } = useActiveCharacter();
  const { t } = useTranslation();
  const resources = useResourcesStore((state) => state.resources);

  return useMemo(
    () => buildOffenseSummary(
      character,
      POWER_DEFS,
      SKILL_DEFS,
      ADVANTAGE_DEFS,
      MODIFIER_DEFS,
      {
        unarmed: t('offense.unarmed'),
        damage: t('offense.damage'),
      },
      resources
    ),
    [character, resources, t]
  );
}
