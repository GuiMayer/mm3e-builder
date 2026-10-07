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
  options: { includeCircumstances?: boolean } = {},
) {
  const effective = character.powers ? effectiveTraitCharacter(character as ICharacter, resources) : character;
  const ability = getEffectiveAbilityRank(effective.abilities, effective.absentAbilities, definition.baseAbility);
  const ranks = effective.skills?.find(entry => entry.skillId === skill.skillId && entry.subtype === skill.subtype)?.ranks ?? skill.ranks;
  const other = skill.otherBonus ?? 0;
  const advantageId = definition.id === 'close_combat' ? 'close_attack' : definition.id === 'ranged_combat' ? 'ranged_attack' : undefined;
  const advantage = advantageId ? effective.advantages?.filter(entry => entry.advantageId === advantageId).reduce((sum, entry) => sum + entry.ranks, 0) ?? 0 : 0;
  const circumstance = options.includeCircumstances === false ? 0 : circumstanceBonus(character, { kind: 'skill', skillId: skill.skillId, subtype: skill.subtype });
  return { ability, ranks, other, ...(advantage ? { advantage } : {}), ...(circumstance ? { circumstance } : {}), total: ability + ranks + other + advantage + circumstance };
}
