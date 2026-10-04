import { useMemo } from 'react';
import { useActiveCharacter } from './useActiveCharacter';
import { useResourcesStore } from '../../store/resourcesStore';
import { resolveTraitState } from '../lib/traitValues';

export function useTraitValues() {
  const { character, characterId } = useActiveCharacter();
  const resources = useResourcesStore(state => state.resources);
  const state = useMemo(() => resolveTraitState(character, resources), [character, resources]);
  return { ...state, original: character, characterId };
}
