import type { ICharacter, ICharacterPower, ICharacterPowerComponent, IResource, IPowerUsage } from '../../entities/types';
import { MODIFIER_DEFS, POWER_DEFS } from '../../entities/gameDataLoaders';
import { calculateComponentPricing, calculatePowerPricing } from './mathEngine';
import { getResourcePowers } from './resourcePowers';
import { isDeviceResource } from './resourceCalculations';
import { resolveEffectiveDuration } from './effectParameters';

export type UsageCharacter = Pick<ICharacter, 'powers' | 'equipment' | 'resourceLinks' | 'powerUsage' | 'abilities' | 'absentAbilities'>;
export interface PowerSource {
  key: string; power: ICharacterPower; name: string; equipment: boolean;
  personal: boolean; resource?: IResource;
}
export function getPowerSources(character: UsageCharacter, resources: readonly IResource[] = []): PowerSource[] {
  const linkedIds = new Set(character.resourceLinks?.map(link => link.resourceId));
  return [
    ...character.powers.map(power => ({ key: `power:${power.id}`, power, name: power.name, equipment: false, personal: true })),
    ...(character.equipment ?? []).map(power => ({ key: `equipment:${power.id}`, power, name: power.name, equipment: true, personal: true })),
    ...resources.filter(resource => linkedIds.has(resource.id)).flatMap(resource => getResourcePowers(resource).map(({ power }) => ({
      key: `resource:${resource.id}:${power.id}`, power, resource, name: `${resource.name} · ${power.name}`,
      equipment: !isDeviceResource(resource), personal: resource.type !== 'vehicle' && resource.type !== 'headquarters',
    }))),
  ];
}
export function isPermanentComponent(component: ICharacterPowerComponent): boolean {
  const effect = POWER_DEFS.find(def => def.id === component.effectId);
  return !!effect && resolveEffectiveDuration(effect.duration, component, { effect, modifierDefs: MODIFIER_DEFS }).value === 'permanent';
}
export function powerBranches(power: ICharacterPower) {
  return [{ id: 'base', name: power.name, dynamic: !!power.baseDynamic, components: power.components },
    ...power.alternateEffects.map(alternate => ({ ...alternate }))];
}
export function resolvePowerUsage(source: PowerSource, usage: IPowerUsage = {}) {
  const branches = powerBranches(source.power);
  const branch = branches.find(item => item.id === (usage.branchId ?? 'base'));
  const warnings: { key: string; params?: Record<string, string | number> }[] = [];
  if (!branch) warnings.push({ key: 'traits.invalidBranch', params: { name: source.name } });
  const personal = usage.recipient ? usage.recipient === 'character' : source.personal;
  let components: ICharacterPowerComponent[] = [];
  if (branch) {
    if (branch.dynamic && usage.allocations) {
      components = branches.filter(item => item.dynamic).flatMap(item => item.components.flatMap(component => {
        const requested = usage.allocations?.[component.id] ?? 0;
        if (requested > component.ranks) warnings.push({ key: 'traits.rankAllocation', params: { name: source.name } });
        const ranks = Math.min(component.ranks, Math.max(0, requested));
        return ranks > 0 ? [{ ...component, ranks }] : [];
      }));
      const cost = components.reduce((sum, component) => {
        const effect = POWER_DEFS.find(def => def.id === component.effectId);
        return sum + (effect ? calculateComponentPricing(component, effect, MODIFIER_DEFS).total : 0);
      }, 0);
      const budget = calculatePowerPricing(source.power, POWER_DEFS, MODIFIER_DEFS).mainCost;
      if (cost > budget) warnings.push({ key: 'traits.arrayBudget', params: { name: source.name, cost, budget } });
    } else components = branch.components;
  }
  if (usage.enabled === false) components = components.filter(isPermanentComponent);
  return { components, personal, warnings, branchId: branch?.id ?? 'base' };
}
