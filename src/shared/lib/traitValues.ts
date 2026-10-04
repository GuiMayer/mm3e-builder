import type { ICharacter, IResource, ITraitTarget } from '../../entities/types';
import { SKILL_DEFS } from '../../entities/gameDataLoaders';
import { getPowerSources, resolvePowerUsage } from './powerUsage';
import { traitTargetKey } from './traitTargets';

export interface TraitContribution {
  target: ITraitTarget; key: string; sourceKey: string; name: string;
  componentId: string; powerId: string; ranks: number; equipment: boolean;
}
const emptyResources: IResource[] = [];
const projected = new WeakSet<ICharacter>();
const originals = new WeakMap<ICharacter, ICharacter>();
const cache = new WeakMap<ICharacter, { signature: string; result: ReturnType<typeof calculateTraitState> }>();

function calculateTraitState(character: ICharacter, resources: readonly IResource[]) {
  const contributions: TraitContribution[] = [];
  const warnings: { key: string; params?: Record<string, string | number> }[] = [];
  for (const source of getPowerSources(character, resources)) {
    const usage = resolvePowerUsage(source, character.powerUsage?.[source.key]);
    warnings.push(...usage.warnings);
    if (!usage.personal) continue;
    for (const component of usage.components) {
      if (component.effectId !== 'enhanced-trait') continue;
      const target = component.enhancedTarget;
      if (!target) { warnings.push({ key: 'traits.missingTarget', params: { name: source.name } }); continue; }
      if (target.kind === 'ability' && character.absentAbilities.includes(target.key)) { warnings.push({ key: 'traits.absentTarget', params: { name: source.name } }); continue; }
      if (target.kind === 'skill') {
        const definition = SKILL_DEFS.find(def => def.id === target.skillId);
        if (!definition || (definition.subtyped && !target.subtype?.trim())) { warnings.push({ key: 'traits.invalidTarget', params: { name: source.name } }); continue; }
      }
      contributions.push({ target, key: traitTargetKey(target), sourceKey: source.key, name: source.name, componentId: component.id, powerId: source.power.id, ranks: component.ranks, equipment: source.equipment });
    }
  }
  const values = new Map<string, number>();
  for (const key of new Set(contributions.map(item => item.key))) {
    const own = contributions.filter(item => item.key === key && !item.equipment).reduce((sum, item) => sum + item.ranks, 0);
    const gear = new Map<string, number>();
    contributions.filter(item => item.key === key && item.equipment).forEach(item => gear.set(item.sourceKey, (gear.get(item.sourceKey) ?? 0) + item.ranks));
    // Equipment contributions use the strongest source, preserving the existing stacking policy.
    values.set(key, Math.max(own, ...gear.values()));
  }
  const result: ICharacter = { ...character, abilities: { ...character.abilities }, defenses: { ...character.defenses }, skills: character.skills.map(skill => ({ ...skill })) };
  for (const target of contributions.map(item => item.target).filter((item, index, all) => all.findIndex(other => traitTargetKey(other) === traitTargetKey(item)) === index)) {
    const bonus = values.get(traitTargetKey(target)) ?? 0;
    if (target.kind === 'ability') result.abilities[target.key] += bonus;
    else if (target.kind === 'defense' && target.key !== 'toughness') result.defenses[target.key] += bonus;
    else if (target.kind === 'skill') {
      const skill = result.skills.find(entry => entry.skillId === target.skillId && (entry.subtype ?? null) === (target.subtype ?? null));
      if (skill) skill.ranks += bonus;
      else result.skills.push({ skillId: target.skillId, subtype: target.subtype ?? null, ranks: bonus });
    }
  }
  projected.add(result);
  originals.set(result, character);
  return { character: result, values, contributions, warnings };
}
/** Read-only projection. Purchased ranks and serialized character data stay unchanged. */
export function resolveTraitState(character: ICharacter, resources: readonly IResource[] = emptyResources) {
  character = originals.get(character) ?? character;
  const signature = JSON.stringify([character, resources]);
  const previous = cache.get(character);
  if (previous?.signature === signature) return previous.result;
  const result = calculateTraitState(character, resources);
  cache.set(character, { signature, result });
  return result;
}
export function effectiveTraitCharacter(character: ICharacter, resources: readonly IResource[] = emptyResources): ICharacter {
  return projected.has(character) ? character : resolveTraitState(character, resources).character;
}
export function circumstanceBonus(character: Pick<ICharacter, 'traitModifiers'>, target: ITraitTarget, scope: 'check' | 'active-defense' = 'check'): number {
  const key = traitTargetKey(target);
  return (character.traitModifiers ?? []).filter(item => item.active && item.scope === scope && traitTargetKey(item.target) === key).reduce((sum, item) => sum + item.value, 0);
}
