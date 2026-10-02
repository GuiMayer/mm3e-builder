import { useState } from 'react';
import { useCharactersStore } from '../../store/charactersStore';
import { useResourcesStore } from '../../store/resourcesStore';
import { useActiveCharacter } from '../../shared/hooks/useActiveCharacter';
import { needsResourceReview } from '../../shared/lib/resourceReview';
import { ResourceReviewDialog } from './ResourceReviewDialog';

export function ResourceReviewController() {
  const hydrated = useCharactersStore((state) => state.isDraftHydrated);
  const resources = useResourcesStore((state) => state.resources);
  const { character } = useActiveCharacter();
  const [dismissed, setDismissed] = useState(false);
  return hydrated && !dismissed && resources.some(needsResourceReview)
    ? <ResourceReviewDialog resources={resources} character={character} onClose={() => setDismissed(true)} /> : null;
}
