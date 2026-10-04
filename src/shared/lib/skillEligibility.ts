import type { ICharacterAdvantage, ICharacterSkill, ISkillDef } from '../../entities/types';
import type { RuleDiagnostic } from './diagnostics';

/** Advisory eligibility; purchased ranks and Jack-of-all-trades grant training. */
export function getSkillTrainingWarning(skill: ICharacterSkill, definition: ISkillDef, advantages: ICharacterAdvantage[], enabled: boolean): RuleDiagnostic | null {
  if (!enabled || !definition.trainedOnly || skill.ranks > 0 || advantages.some(advantage => advantage.advantageId === 'jack_of_all_trades' && advantage.ranks > 0)) return null;
  return { message: `${definition.name} requires training; this check is untrained. Ask the GM to review it.`, messageKey: 'skills.trainingWarning', names: { skill: { kind: 'skill', id: definition.id } } };
}
