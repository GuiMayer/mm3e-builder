import type { ICharacter, ICharacterSkill, ISkillDef } from '../../entities/types';
import { getEffectiveAbilityRank } from './abilityRanks';

/** Shared by the skill total and all skill-based roll shortcuts. */
export function calculateSkillCheck(
  character: Pick<ICharacter, 'abilities' | 'absentAbilities'>,
  skill: ICharacterSkill,
  definition: ISkillDef,
) {
  const ability = getEffectiveAbilityRank(character.abilities, character.absentAbilities, definition.baseAbility);
  const other = skill.otherBonus ?? 0;
  return { ability, ranks: skill.ranks, other, total: ability + skill.ranks + other };
}
