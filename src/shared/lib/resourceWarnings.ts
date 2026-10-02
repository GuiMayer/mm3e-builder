import type { ICharacter, ICharacterPower, IResource, IPowerEffect, IModifierDef } from '../../entities/types';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS } from '../../entities/gameDataLoaders';
import { calculatePowerPricing } from './mathEngine';
import { buildTargetedEffectProfiles } from './offenseSummary';
import { getResourceCharacter, getResourceAttackBonus } from './resourceContext';

export interface ResourceWarning { key: string; values?: Record<string, string | number>; }

/** Advisory only: none of these rules blocks generic modifier selection or saving. */
export function getResourcePowerWarnings(resource: IResource, power: ICharacterPower, owner: ICharacter, powerDefs: IPowerEffect[] = POWER_DEFS, modifierDefs: IModifierDef[] = MODIFIER_DEFS): ResourceWarning[] {
  if (resource.type !== 'headquarters') return [];
  const warnings: ResourceWarning[] = [];
  const level = resource.powerLevel ?? 10;
  const cost = calculatePowerPricing(power, powerDefs, modifierDefs, 0).equipmentTotal;
  if (cost > level * 2) warnings.push({ key: 'resources.hq.costWarning', values: { cost, limit: level * 2, level } });
  if (resource.powerLevel === undefined) warnings.push({ key: 'resources.hq.levelWarning' });
  const setting = resource.effectSettings?.[power.id];
  const context = { ...getResourceCharacter(owner, resource), powers: [power], equipment: [], resourceLinks: [], manualOffenseRows: [] };
  const profiles = buildTargetedEffectProfiles(context, powerDefs, SKILL_DEFS, [], modifierDefs);
  const attackBonus = getResourceAttackBonus(resource, power);
  if (profiles.some((profile) => profile.sourceType === 'power' && profile.causesResistance && profile.effectRank !== null
    && (profile.requiresAttackCheck ? (attackBonus ?? profile.bonusValue ?? 0) + profile.effectRank > level * 2 : profile.effectRank > level))) {
    warnings.push({ key: 'resources.hq.plWarning', values: { level } });
  }
  if (setting?.target === 'both' && power.components.some((component) => !component.modifiers.some((modifier) => modifier.modifierId === 'affects_others'))) warnings.push({ key: 'resources.hq.targetWarning' });
  return warnings;
}
