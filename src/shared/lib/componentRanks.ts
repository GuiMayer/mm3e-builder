import type { IAppliedModifier, ICharacter, ICharacterPowerComponent } from '../../entities/types';
import { getEffectiveAbilityRank, isStrengthBasedDamage } from './abilityRanks';

export function getAffectedRanks(modifier: IAppliedModifier): number | undefined {
  return modifier.affectedRanks
    ?? (typeof modifier.options?.affectedRanks === 'number' ? modifier.options.affectedRanks : undefined);
}

export function getCharacterStrength(character: Pick<ICharacter, 'abilities' | 'absentAbilities'>): number {
  return getEffectiveAbilityRank(character.abilities, character.absentAbilities, 'str');
}

export function getComponentEffectRanks(component: ICharacterPowerComponent, strength = 0): number {
  return component.ranks + (isStrengthBasedDamage(component) ? strength : 0);
}

/** Boundaries of prefix modifiers, shared by prices and mechanical profiles. */
export function getRankBoundaries(modifiers: readonly IAppliedModifier[], ranks: number): number[] {
  return [...new Set([
    ...modifiers.map(getAffectedRanks).filter((value): value is number =>
      value !== undefined && value > 0 && value < ranks),
    ranks,
  ])].sort((a, b) => a - b);
}
