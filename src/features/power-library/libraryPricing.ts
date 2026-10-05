import type { ICharacter, ICharacterPower, IResource } from '../../entities/types';
import { getPricingStrength } from '../../shared/lib/pricingStrength';
import { applyPowerTemplate, canApplyPowerTemplate } from './powerTemplateApplication';
import type { PowerLibraryTarget } from './types';

/** Price against the same candidate composition that the Builder will save. */
export function getLibraryRecipeStrength(character: ICharacter, power: ICharacterPower, recipe: ICharacterPower, target: PowerLibraryTarget, resources: readonly IResource[] = []): number {
  const candidate = canApplyPowerTemplate(power, recipe, target) ? applyPowerTemplate(power, recipe, target) : power;
  return getPricingStrength({ ...character, powers: [...character.powers.filter(item => item.id !== power.id), candidate] }, resources);
}
