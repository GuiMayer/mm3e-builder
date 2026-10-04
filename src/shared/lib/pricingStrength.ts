import type { ICharacter, IResource } from '../../entities/types';
import { getCharacterStrength } from './componentRanks';
import { getPowerSources, powerBranches } from './powerUsage';

/** Price purchased Strength-based extras at full capacity; usage never changes PP. */
export function getPricingStrength(character: ICharacter, resources: readonly IResource[] = []): number {
  if (character.absentAbilities.includes('str')) return 0;
  let own = 0, gear = 0;
  for (const source of getPowerSources(character, resources)) {
    if (!source.personal) continue;
    const bonus = Math.max(0, ...powerBranches(source.power).map(branch => branch.components.reduce((sum, component) =>
      sum + (component.effectId === 'enhanced-trait' && component.enhancedTarget?.kind === 'ability' && component.enhancedTarget.key === 'str' ? component.ranks : 0), 0)));
    if (source.equipment) gear = Math.max(gear, bonus);
    else own += bonus;
  }
  return getCharacterStrength(character) + Math.max(own, gear);
}
