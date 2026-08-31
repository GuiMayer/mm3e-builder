import type {
  Abilities,
  AbilityKey,
  ICharacterPowerComponent,
} from '../../entities/types';

/**
 * Return the rank that can actually contribute to checks and derived values.
 *
 * Character files retain the last entered rank while an ability is absent so
 * it can be restored without data loss. That stored rank must not leak into
 * defenses, skills, initiative, attacks, or exports.
 */
export function getEffectiveAbilityRank(
  abilities: Abilities,
  absentAbilities: readonly AbilityKey[],
  ability: AbilityKey
): number {
  return absentAbilities.includes(ability) ? 0 : (abilities[ability] ?? 0);
}

/** Explicit opt-in used by Damage; legacy components without the field remain unchanged. */
export function isStrengthBasedDamage(component: ICharacterPowerComponent): boolean {
  return component.effectId === 'damage'
    && component.fieldValues?.damageBasis === 'strength-based';
}
