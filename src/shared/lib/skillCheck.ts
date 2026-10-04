import type { ICharacter, ICharacterSkill, ISkillDef } from '../../entities/types';
import { getEffectiveAbilityRank } from './abilityRanks';
import { circumstanceBonus, effectiveTraitCharacter } from './traitValues';
import type { IResource } from '../../entities/types';

/** Shared by the skill total and all skill-based roll shortcuts. */
export function calculateSkillCheck(
  character: Pick<ICharacter, 'abilities' | 'absentAbilities'> & Partial<ICharacter>,
  skill: ICharacterSkill,
  definition: ISkillDef,
  resources?: IResource[],
) {
  const effective = character.powers ? effectiveTraitCharacter(character as ICharacter, resources) : character;
  const ability = getEffectiveAbilityRank(effective.abilities, effective.absentAbilities, definition.baseAbility);
  const ranks = effective.skills?.find(entry => entry.skillId === skill.skillId && entry.subtype === skill.subtype)?.ranks ?? skill.ranks;
  const other = skill.otherBonus ?? 0;
  const circumstance = circumstanceBonus(character, { kind: 'skill', skillId: skill.skillId, subtype: skill.subtype });
  return { ability, ranks, other, circumstance, total: ability + ranks + other + circumstance };
}
