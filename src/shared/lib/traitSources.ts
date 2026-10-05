import type { ICharacter, ICharacterPowerComponent, IResource, ITraitTarget } from '../../entities/types';
import { POWER_DEFS, SKILL_DEFS } from '../../entities/gameDataLoaders';
import { getPowerSources, powerBranches, resolvePowerUsage, type PowerSource } from './powerUsage';
import { resolveTraitState } from './traitValues';
import { traitTargetKey } from './traitTargets';

export interface TraitSourceEntry {
  source: PowerSource;
  component: ICharacterPowerComponent;
  branchId: string;
  branchName: string;
  ranks: number;
  status: 'active' | 'disabled' | 'alternate' | 'unallocated' | 'recipient' | 'absent' | 'invalid' | 'superseded' | 'unbound';
}

export function hasTraitEffects(source: PowerSource): boolean {
  return powerBranches(source.power).some(branch => branch.components.some(component =>
    component.effectId === 'enhanced-trait' || POWER_DEFS.find(effect => effect.id === component.effectId)?.enhancesDefense === 'toughness'));
}

/** Inventory for the UI, including sources that are currently not contributing. Never modifies a sheet. */
export function getTraitSourceEntries(character: ICharacter, resources: readonly IResource[] = [], target?: ITraitTarget): TraitSourceEntry[] {
  const state = resolveTraitState(character, resources);
  const entries: TraitSourceEntry[] = [];
  for (const source of getPowerSources(character, resources)) {
    const selection = character.powerUsage?.[source.key] ?? {};
    const usage = resolvePowerUsage(source, selection);
    for (const branch of powerBranches(source.power)) for (const component of branch.components) {
      const toughness = POWER_DEFS.find(effect => effect.id === component.effectId)?.enhancesDefense === 'toughness';
      if (component.effectId !== 'enhanced-trait' && !toughness) continue;
      const destination = component.enhancedTarget ?? (toughness ? { kind: 'defense' as const, key: 'toughness' as const } : undefined);
      if (target && (!destination || traitTargetKey(destination) !== traitTargetKey(target))) continue;
      const active = usage.components.find(item => item.id === component.id);
      let status: TraitSourceEntry['status'] = 'active';
      if (!destination) status = 'unbound';
      else if (!usage.personal) status = 'recipient';
      else if (destination.kind === 'ability' && character.absentAbilities.includes(destination.key)) status = 'absent';
      else if (destination.kind === 'skill' && (!SKILL_DEFS.some(def => def.id === destination.skillId) || (SKILL_DEFS.find(def => def.id === destination.skillId)?.subtyped && !destination.subtype?.trim()))) status = 'invalid';
      else if (!active) {
        const selected = powerBranches(source.power).find(item => item.id === selection.branchId || (!selection.branchId && item.id === 'base'));
        if (!selected) status = 'invalid';
        else if (branch.id !== selected.id && !(selected.dynamic && branch.dynamic && selection.allocations)) status = 'alternate';
        else if (selection.enabled === false) status = 'disabled';
        else status = 'unallocated';
      } else if (component.effectId === 'enhanced-trait') {
        const contributions = state.contributions.filter(item => item.key === traitTargetKey(destination!));
        const own = contributions.filter(item => !item.equipment).reduce((sum, item) => sum + item.ranks, 0);
        const gear = new Map<string, number>();
        contributions.filter(item => item.equipment).forEach(item => gear.set(item.sourceKey, (gear.get(item.sourceKey) ?? 0) + item.ranks));
        const strongest = Math.max(own, 0, ...gear.values());
        if ((source.equipment ? gear.get(source.key) ?? 0 : own) < strongest) status = 'superseded';
      }
      entries.push({ source, component, branchId: branch.id, branchName: branch.name, ranks: active?.ranks ?? 0, status });
    }
  }
  return entries;
}
