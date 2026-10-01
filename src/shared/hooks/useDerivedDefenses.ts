import { useMemo } from 'react';
import { useCharacterSelector } from './useActiveCharacter';
import { useShallow } from 'zustand/react/shallow';
import { POWER_DEFS } from '../../entities/gameDataLoaders';
import { deriveCharacterDefenses } from '../lib/derivedDefenses';
import { useResourcesStore } from '../../store/resourcesStore';

/** Shared derivation used by the sheet, validation and exports. */
export function useDerivedDefenses() {
  const character = useCharacterSelector(useShallow((value) => ({
    abilities: value.abilities, absentAbilities: value.absentAbilities, powers: value.powers,
    advantages: value.advantages, equipment: value.equipment, resourceLinks: value.resourceLinks,
  })));
  const resources = useResourcesStore((state) => state.resources);
  return useMemo(() => deriveCharacterDefenses(character, POWER_DEFS, resources), [character, resources]);
}
