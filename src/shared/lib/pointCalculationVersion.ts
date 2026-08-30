import type { CharacterTab } from '../../entities/characterTab';
import type { IResource } from '../../entities/types';

/**
 * Independent from the app version: bump only when persisted builds may be
 * priced differently. Ordinary releases must not repeat the notice.
 */
export const POINT_CALCULATION_REVISION = '3';
export const POINT_CALCULATION_NOTICE_KEY = 'mm3e:point-calculation-revision';

export interface PointCalculationNoticeState {
  storedRevision: string | null;
  isDraftHydrated: boolean;
  draftLoadError: string | null;
  tabs: readonly Pick<CharacterTab, 'character'>[];
  resources: readonly IResource[];
}

export function hasPricedDraftData(
  tabs: readonly Pick<CharacterTab, 'character'>[],
  resources: readonly IResource[]
): boolean {
  if (resources.length > 0) return true;
  return tabs.some(({ character }) =>
    character.powers.length > 0
    || (character.equipment?.length ?? 0) > 0
    || (character.resourceLinks?.length ?? 0) > 0
  );
}

export function shouldShowPointCalculationNotice(
  state: PointCalculationNoticeState
): boolean {
  return state.isDraftHydrated
    && state.draftLoadError === null
    && state.storedRevision !== POINT_CALCULATION_REVISION
    && hasPricedDraftData(state.tabs, state.resources);
}
