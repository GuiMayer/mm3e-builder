import type { IAppliedModifier, ICharacter, ICharacterPowerComponent, IResource } from '../../entities/types';
import { MODIFIER_DEFS, POWER_DEFS } from '../../entities/gameDataLoaders';
import { calculateComponentPricing, calculatePowerPricing } from './mathEngine';
import { calculateCharacterPointSummary } from './pointSummary';
import { getResourceCost } from './resourceCalculations';
import { migratePower } from './powerMigration';

type Path = (string | number)[];
export interface ModifierRecoveryCandidate {
  key: string; path: Path; effectId: string; modifierId: string;
  instanceId?: string; label: string; before: number; after: number;
}
function object(value: unknown): value is Record<string, unknown> { return !!value && typeof value === 'object' && !Array.isArray(value); }
function walk(value: unknown, visit: (value: Record<string, unknown>, path: Path) => void, path: Path = []) {
  if (object(value)) { visit(value, path); for (const [key, child] of Object.entries(value)) walk(child, visit, [...path, key]); }
  else if (Array.isArray(value)) value.forEach((child, index) => walk(child, visit, [...path, index]));
}
export function inspectModifierSources(value: unknown): ModifierRecoveryCandidate[] {
  const candidates: ModifierRecoveryCandidate[] = [];
  walk(value, (record, path) => {
    const effect = POWER_DEFS.find(def => def.id === record.effectId);
    if (!effect || !Array.isArray(record.modifiers) || typeof record.ranks !== 'number') return;
    record.modifiers.forEach((raw: IAppliedModifier, index: number) => {
      if (!raw || raw.isPowerSpecific !== true || !MODIFIER_DEFS.some(def => def.id === raw.modifierId)
        || [...effect.extras, ...effect.flaws].some(def => def.id === raw.modifierId)) return;
      const modifierPath = [...path, 'modifiers', index];
      const component = record as unknown as ICharacterPowerComponent;
      const replacement = { ...component, modifiers: component.modifiers.map((mod, pos) => pos === index ? { ...mod, isPowerSpecific: false } : mod) };
      candidates.push({ key: JSON.stringify(modifierPath), path: modifierPath, effectId: effect.id, modifierId: raw.modifierId,
        instanceId: raw.instanceId, label: path.join(' / ') || String(record.name ?? record.id ?? effect.id),
        before: calculateComponentPricing(component, effect, MODIFIER_DEFS).total,
        after: calculateComponentPricing(replacement, effect, MODIFIER_DEFS).total });
    });
  });
  return candidates;
}
/** Only confirmed occurrences change; identities, notes and partial ranks stay intact. */
export function recoverModifierSources<T>(value: T, selected: readonly string[]): T {
  const paths = new Set(inspectModifierSources(value).filter(item => selected.includes(item.key)).map(item => item.key));
  function copy(node: unknown, path: Path): unknown {
    if (Array.isArray(node)) return node.map((child, index) => copy(child, [...path, index]));
    if (!object(node)) return node;
    const result = Object.fromEntries(Object.entries(node).map(([key, child]) => [key, copy(child, [...path, key])]));
    return paths.has(JSON.stringify(path)) ? { ...result, isPowerSpecific: false } : result;
  }
  return copy(value, []) as T;
}
/** Project full prices as well as the individual component prices in the dialog. */
export function recoveryCostSummary(value: unknown): { key: string; name: string; pp: number; ep?: number }[] {
  const resources: IResource[] = [], characters: { key: string; character: ICharacter }[] = [];
  const powers: { key: string; record: Record<string, unknown> }[] = [];
  walk(value, (record, path) => {
    if (object(record.abilities) && object(record.header) && Array.isArray(record.powers)) characters.push({ key: JSON.stringify(path), character: record as unknown as ICharacter });
    else if (['gadget', 'gear', 'custom', 'vehicle', 'headquarters'].includes(String(record.type)) && typeof record.createdAt === 'string') resources.push(record as unknown as IResource);
    else if (Array.isArray(record.alternateEffects) && (Array.isArray(record.components) || typeof record.effectId === 'string')) powers.push({ key: JSON.stringify(path), record });
  });
  return [
    ...characters.map(({ key, character }) => { const summary = calculateCharacterPointSummary(character, resources, POWER_DEFS, MODIFIER_DEFS); return { key, name: character.header.name || key, pp: summary.totalSpent, ep: summary.totalEPUsed }; }),
    ...resources.map(resource => { const cost = getResourceCost(resource, POWER_DEFS, MODIFIER_DEFS); return { key: `resource:${resource.id}`, name: resource.name, pp: cost.unit === 'PP' ? cost.total : 0, ep: cost.unit === 'EP' ? cost.total : undefined }; }),
    ...powers.map(({ key, record }) => ({ key, name: String(record.name || record.id), pp: calculatePowerPricing(migratePower(record), POWER_DEFS, MODIFIER_DEFS).total })),
  ];
}
