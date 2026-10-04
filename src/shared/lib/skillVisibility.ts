import type { ICharacter, ICharacterSkill } from '../../entities/types';
import { circumstanceBonus } from './traitValues';

export function hasSkillContribution(skill: ICharacterSkill, character?: Pick<ICharacter, 'traitModifiers'>): boolean {
  return skill.ranks > 0 || (skill.otherBonus ?? 0) !== 0 || (!!character && circumstanceBonus(character, { kind: 'skill', skillId: skill.skillId, subtype: skill.subtype }) !== 0);
}
