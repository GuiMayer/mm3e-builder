import type { ICharacter, ICharacterPowerComponent, IResource, ITraitTarget } from '../../entities/types';
import { POWER_DEFS, SKILL_DEFS } from '../../entities/gameDataLoaders';
import { getPowerSources, powerBranches, resolvePowerUsage, type PowerSource } from './powerUsage';
import { resolveTraitState } from './traitValues';
import { traitTargetKey } from './traitTargets';
import { calcToughnessBonus } from './mathEngine';
import { affectsOnlyOthers } from './strengthContributions';

export interface TraitSourceEntry {
  source: PowerSource;
  component: ICharacterPowerComponent;
  branchId: string;
  branchName: string;
  ranks: number;
  status: 'active' | 'disabled' | 'alternate' | 'unallocated' | 'recipient' | 'absent' | 'invalid' | 'superseded' | 'unbound' | 'manual';
}

const inventoryCache = new WeakMap<ICharacter, { state: ReturnType<typeof resolveTraitState>; entries: TraitSourceEntry[] }>();

/** Inventory for the UI, including sources that are currently not contributing. Never modifies a sheet. */
export function getTraitSourceEntries(character: ICharacter, resources: readonly IResource[] = [], target?: ITraitTarget): TraitSourceEntry[] {
  const state = resolveTraitState(character, resources);
  let inventory = inventoryCache.get(character);
  if (!inventory || inventory.state !== state) {
    inventory = { state, entries: calculateEntries(character, resources, state) };
    inventoryCache.set(character, inventory);
  }
  return target ? inventory.entries.filter(entry => {
    const destination = entry.component.enhancedTarget ?? (POWER_DEFS.find(effect => effect.id === entry.component.effectId)?.enhancesDefense === 'toughness' ? { kind: 'defense' as const, key: 'toughness' as const } : undefined);
    return destination && traitTargetKey(destination) === traitTargetKey(target);
  }) : inventory.entries;
}

function calculateEntries(character: ICharacter, resources: readonly IResource[], state: ReturnType<typeof resolveTraitState>) {
  const entries: TraitSourceEntry[] = [];
  const sources = getPowerSources(character, resources);
  const resolved = new Map(sources.map(source => [source.key, resolvePowerUsage(source, character.powerUsage?.[source.key])]));
  const ownToughness = calcToughnessBonus(sources.filter(source => !source.equipment && resolved.get(source.key)!.personal).map(source => ({ ...source.power, components: resolved.get(source.key)!.components })), character.advantages, POWER_DEFS).bonus;
  const gearToughness = new Map(sources.filter(source => source.equipment && resolved.get(source.key)!.personal).map(source => [source.key, calcToughnessBonus([{ ...source.power, components: resolved.get(source.key)!.components }], [], POWER_DEFS).bonus]));
  for (const source of sources) {
    const selection = character.powerUsage?.[source.key] ?? {};
    const usage = resolved.get(source.key)!;
    for (const branch of powerBranches(source.power)) for (const component of branch.components) {
      const toughness = POWER_DEFS.find(effect => effect.id === component.effectId)?.enhancesDefense === 'toughness';
      if (component.effectId !== 'enhanced-trait' && !toughness) continue;
      const destination = component.enhancedTarget ?? (toughness ? { kind: 'defense' as const, key: 'toughness' as const } : undefined);
      const active = usage.components.find(item => item.id === component.id);
      let status: TraitSourceEntry['status'] = 'active';
      if (!destination) status = component.variableCostOption && POWER_DEFS.find(effect => effect.id === 'enhanced-trait')?.variableCost?.options.some(option => option.name === component.variableCostOption) && !['Enhanced Ability', 'Enhanced Defense', 'Enhanced Skill'].includes(component.variableCostOption) ? 'manual' : 'unbound';
      else if (!usage.personal || affectsOnlyOthers(component)) status = 'recipient';
      else if (destination.kind === 'ability' && character.absentAbilities.includes(destination.key)) status = 'absent';
      else if (destination.kind === 'skill' && (!SKILL_DEFS.some(def => def.id === destination.skillId) || (SKILL_DEFS.find(def => def.id === destination.skillId)?.subtyped && !destination.subtype?.trim()))) status = 'invalid';
      else if (!active) {
        const selected = powerBranches(source.power).find(item => item.id === selection.branchId || (!selection.branchId && item.id === 'base'));
        if (!selected) status = 'invalid';
        else if (branch.id !== selected.id && !(selected.dynamic && branch.dynamic && selection.allocations)) status = 'alternate';
        else if (selection.enabled === false) status = 'disabled';
        else status = 'unallocated';
      } else if (destination.kind === 'defense' && destination.key === 'toughness') {
        if ((source.equipment ? gearToughness.get(source.key) ?? 0 : ownToughness) < Math.max(ownToughness, 0, ...gearToughness.values())) status = 'superseded';
      } else if (component.effectId === 'enhanced-trait') {
        const contributions = state.contributions.filter(item => item.key === traitTargetKey(destination));
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
