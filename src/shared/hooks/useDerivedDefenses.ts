import { useMemo } from 'react';
import { useActiveCharacter } from './useActiveCharacter';
import { POWER_DEFS } from '../../entities/gameDataLoaders';
import { deriveCharacterDefenses } from '../lib/derivedDefenses';
import { useResourcesStore } from '../../store/resourcesStore';

/** Shared derivation used by the sheet, validation and exports. */
export function useDerivedDefenses() {
  const { character } = useActiveCharacter();
  const resources = useResourcesStore((state) => state.resources);
  return useMemo(() => deriveCharacterDefenses(character, POWER_DEFS, resources), [character, resources]);
}
