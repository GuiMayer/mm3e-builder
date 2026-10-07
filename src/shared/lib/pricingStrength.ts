import type { ICharacter, IResource } from '../../entities/types';
import { getCharacterStrength } from './componentRanks';
import { getPowerSources } from './powerUsage';
import { pricingStrengthForSources, type PricingStrength } from './strengthContributions';

/** Price purchased Strength-based extras at full capacity; usage never changes PP. */
export function getPricingStrength(character: ICharacter, resources: readonly IResource[] = []): number {
  if (character.absentAbilities.includes('str')) return 0;
  return pricingStrengthForSources(getCharacterStrength(character), getPowerSources(character, resources));
}

/** Use for complete powers so each branch receives only compatible Strength. */
export function getPricingStrengthContext(character: ICharacter, resources: readonly IResource[] = []): PricingStrength {
  const sources = getPowerSources(character, resources);
  return (power, components) => character.absentAbilities.includes('str') ? 0
    : pricingStrengthForSources(getCharacterStrength(character), sources, power, components);
}

/** A library preview uses the candidate resource without modifying actual links. */
export function getResourcePricingStrength(character: ICharacter, resource: IResource, resources: readonly IResource[] = []): PricingStrength {
  return getPricingStrengthContext({ ...character, resourceLinks: [
    ...(character.resourceLinks ?? []).filter(link => link.resourceId !== resource.id),
    { id: 'pricing-preview', resourceId: resource.id, isFree: true },
  ] }, [...resources.filter(item => item.id !== resource.id), resource]);
}
