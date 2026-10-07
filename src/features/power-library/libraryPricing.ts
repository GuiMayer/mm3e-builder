import type { ICharacter, ICharacterPower, IResource } from '../../entities/types';
import { createDefaultCharacter } from '../../entities/characterDefaults';
import { getPricingStrengthContext } from '../../shared/lib/pricingStrength';
import type { PricingStrength } from '../../shared/lib/strengthContributions';
import { applyPowerTemplate, canApplyPowerTemplate } from './powerTemplateApplication';
import type { PowerLibraryTarget } from './types';

/** Standalone recipes are neutral until a destination is chosen. */
export function getLibraryDestinationStrength(power: ICharacterPower, character: ICharacter = createDefaultCharacter(), resources: readonly IResource[] = []): PricingStrength {
  return getPricingStrengthContext({ ...character, powers: [...character.powers.filter(item => item.id !== power.id), power] }, resources);
}

/** Price against the same candidate composition that the Builder will save. */
export function getLibraryRecipeStrength(character: ICharacter, power: ICharacterPower, recipe: ICharacterPower, target: PowerLibraryTarget, resources: readonly IResource[] = []): PricingStrength {
  const candidate = canApplyPowerTemplate(power, recipe, target) ? applyPowerTemplate(power, recipe, target) : power;
  const strength = getPricingStrengthContext({ ...character, powers: [...character.powers.filter(item => item.id !== power.id), candidate] }, resources);
  return (pricedPower, components) => {
    if (typeof strength === 'number') return strength;
    if (pricedPower.id !== recipe.id) return strength(pricedPower, components);
    const alternate = pricedPower.alternateEffects.find(branch => branch.components === components);
    const branchId = alternate?.id ?? target.alternateId;
    const branchComponents = branchId ? candidate.alternateEffects.find(branch => branch.id === branchId)?.components : candidate.components;
    return strength(candidate, branchComponents ?? components);
  };
}
