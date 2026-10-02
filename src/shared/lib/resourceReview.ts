import type { ICharacterPower, IResource } from '../../entities/types';
import { createDerivedId } from './identity';

export interface ResourceReviewChoice {
  costMode?: 'equipment' | 'device';
  removable?: 'none' | 'removable' | 'easily_removable';
  movementEffect?: 'speed' | 'flight' | 'swimming' | 'burrowing' | 'systems';
  powerLevel?: number;
}

export function needsResourceReview(resource: IResource): boolean {
  if (resource.type === 'vehicle') return !!resource.movementReviewRequired && resource.movement === undefined;
  if (resource.type === 'headquarters') return resource.powerLevel === undefined;
  return !!resource.costReviewRequired;
}

/** Review only changes Resource metadata. Character links and power IDs stay intact. */
export function applyResourceReview(resources: IResource[], choices: Record<string, ResourceReviewChoice>): IResource[] {
  return resources.map((resource) => {
    const choice = choices[resource.id];
    if (!choice || !needsResourceReview(resource)) return resource;
    if (resource.type === 'vehicle') {
      if (!choice.movementEffect) return resource;
      const movement: ICharacterPower = {
        id: createDerivedId('power', `movement:${resource.id}`), name: '', notes: '', alternateEffects: [],
        components: choice.movementEffect === 'systems' ? [] : [{
          id: createDerivedId('power', `movement-component:${resource.id}`), effectId: choice.movementEffect,
          ranks: resource.speed, modifiers: [], fieldValues: {},
        }],
      };
      return { ...resource, movement, movementReviewRequired: false };
    }
    if (resource.type === 'headquarters') return choice.powerLevel && Number.isInteger(choice.powerLevel) && choice.powerLevel > 0 ? { ...resource, powerLevel: choice.powerLevel } : resource;
    if (!choice.costMode) return resource;
    return { ...resource, costMode: choice.costMode, costReviewRequired: false,
      power: choice.costMode === 'device' ? { ...resource.power, removable: choice.removable ?? resource.power.removable ?? 'removable' } : resource.power };
  });
}
