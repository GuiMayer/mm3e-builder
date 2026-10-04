import type { ICharacterPowerComponent, ITraitTarget } from '../../entities/types';

export function traitTargetKey(target: ITraitTarget): string {
  return target.kind === 'skill' ? JSON.stringify(['skill', target.skillId, target.subtype ?? null]) : `${target.kind}:${target.key}`;
}
export function enhancedCostOption(target: ITraitTarget): string {
  return target.kind === 'ability' ? 'Enhanced Ability' : target.kind === 'defense' ? 'Enhanced Defense' : 'Enhanced Skill';
}
export function setEnhancedTarget(component: ICharacterPowerComponent, target?: ITraitTarget): ICharacterPowerComponent {
  const result = { ...component };
  if (!target) delete result.enhancedTarget;
  else { result.enhancedTarget = target; result.variableCostOption = enhancedCostOption(target); }
  return result;
}
