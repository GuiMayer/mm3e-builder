import type { ICharacterSkill } from '../../entities/types';

export function hasSkillContribution(skill: ICharacterSkill): boolean {
  return skill.ranks > 0 || (skill.otherBonus ?? 0) !== 0;
}
