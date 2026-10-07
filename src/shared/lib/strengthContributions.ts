import type { ICharacterPower, ICharacterPowerComponent } from '../../entities/types';
import { liftingOnly } from './enhancedTraits';

/** A numeric value is an explicit Strength; a resolver supplies branch context. */
export type PricingStrength = number | ((power: ICharacterPower, components: ICharacterPowerComponent[]) => number);

export interface StrengthSource {
  power: ICharacterPower;
  personal: boolean;
  equipment: boolean;
}

export function affectsOnlyOthers(component: ICharacterPowerComponent): boolean {
  return component.modifiers.some(modifier => modifier.modifierId === 'affects_others' && modifier.options?.affectsOnlyOthers === true);
}

export function enhancedStrength(components: readonly ICharacterPowerComponent[]): number {
  return components.reduce((sum, component) => sum + (
    !affectsOnlyOthers(component) && !liftingOnly(component) && component.effectId === 'enhanced-trait'
      && component.enhancedTarget?.kind === 'ability' && component.enhancedTarget.key === 'str'
      ? component.ranks : 0
  ), 0);
}

/** Purchase prices are independent of usage, but mutually exclusive branches never stack. */
export function pricingStrengthForSources(
  natural: number,
  sources: readonly StrengthSource[],
  power?: ICharacterPower,
  components?: ICharacterPowerComponent[],
): number {
  let own = 0;
  let gear = 0;
  for (const source of sources) {
    if (!source.personal) continue;
    const bonus = power && components && source.power.id === power.id
      ? enhancedStrength(components)
      : Math.max(0, enhancedStrength(source.power.components), ...source.power.alternateEffects.map(branch => enhancedStrength(branch.components)));
    if (source.equipment) gear = Math.max(gear, bonus);
    else own += bonus;
  }
  if (power && components && !sources.some(source => source.power.id === power.id)) own += enhancedStrength(components);
  return natural + Math.max(own, gear);
}
