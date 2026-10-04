import { normalizeCharacter } from '../../services/character-file/normalizeCharacter';
import type { DraftStorageSnapshot } from '../../services/storage/draftUpdateBackup';
import type { IAppliedModifier, ICharacter, ICharacterPowerComponent, IResource } from '../../entities/types';
import { MODIFIER_DEFS, POWER_DEFS } from '../../entities/gameDataLoaders';
import { calculateComponentPricing, calculatePowerPricing } from './mathEngine';
import { calculateCharacterPointSummary } from './pointSummary';
import { getResourceCost } from './resourceCalculations';
import { migratePower } from './powerMigration';

type Path = (string | number)[];
export interface ModifierRecoveryCandidate {
  key: string; path: Path; effectId: string; modifierId: string;
  instanceId?: string; componentNumber: number; label: string; before: number; after: number;
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
        instanceId: raw.instanceId, componentNumber: typeof path.at(-1) === 'number' ? Number(path.at(-1)) + 1 : 1, label: recoveryPathLabel(value, path, index),
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
    if (object(record.abilities) && object(record.header) && Array.isArray(record.powers)) characters.push({ key: JSON.stringify(path), character: normalizeCharacter(record as unknown as ICharacter) });
    else if (['gadget', 'gear', 'custom', 'vehicle', 'headquarters'].includes(String(record.type)) && typeof record.createdAt === 'string') resources.push(record as unknown as IResource);
    else if (Array.isArray(record.alternateEffects) && (Array.isArray(record.components) || typeof record.effectId === 'string')) powers.push({ key: JSON.stringify(path), record });
  });
  return [
    ...characters.map(({ key, character }) => { const summary = calculateCharacterPointSummary(character, resources, POWER_DEFS, MODIFIER_DEFS); return { key, name: character.header.name || key, pp: summary.totalSpent, ep: summary.totalEPUsed }; }),
    ...resources.map(resource => { const cost = getResourceCost(resource, POWER_DEFS, MODIFIER_DEFS); return { key: `resource:${resource.id}`, name: resource.name, pp: cost.unit === 'PP' ? cost.total : 0, ep: cost.unit === 'EP' ? cost.total : undefined }; }),
    ...[...new Map(powers.map(item => [String(item.record.id), item])).values()].map(({ key, record }) => ({ key, name: String(record.name || record.id), pp: calculatePowerPricing(migratePower(record), POWER_DEFS, MODIFIER_DEFS).total })),
  ];
}

function recoveryPathLabel(value: unknown, path: Path, index: number): string {
  let current = value;
  const names: string[] = [];
  const collect = () => {
    if (!object(current)) return;
    const name = object(current.header) ? current.header.name : current.name;
    if (typeof name === 'string' && name && names.at(-1) !== name) names.push(name);
  };
  collect();
  for (const part of path) { current = (current as Record<string | number, unknown>)?.[part]; collect(); }
  return `${names.join(' · ')}${names.length ? ' · ' : ''}#${index + 1}`;
}

/** Read-only context for cost previews; incoming data takes precedence over open copies. */
export function recoveryPreviewContext(value: unknown, openCharacters: ICharacter[], storedResources: IResource[]) {
  const characters = new Map(openCharacters.map((character, index) => [character.characterId ?? `open:${index}`, character]));
  const resources = new Map(storedResources.map(resource => [resource.id, resource]));
  const powers = new Map<string, ReturnType<typeof migratePower>>();
  walk(value, (record, path) => {
    if (object(record.abilities) && object(record.header) && Array.isArray(record.powers)) characters.set(String(record.characterId ?? JSON.stringify(path)), normalizeCharacter(record as unknown as ICharacter));
    else if (['gadget', 'gear', 'custom', 'vehicle', 'headquarters'].includes(String(record.type)) && typeof record.createdAt === 'string') resources.set(String(record.id), record as unknown as IResource);
    else if (Array.isArray(record.alternateEffects) && (Array.isArray(record.components) || typeof record.effectId === 'string')) powers.set(String(record.id), migratePower(record));
  });
  function replacePowers(node: unknown): unknown {
    if (Array.isArray(node)) return node.map(replacePowers);
    if (!object(node)) return node;
    if ((Array.isArray(node.components) || typeof node.effectId === 'string') && Array.isArray(node.alternateEffects) && powers.has(String(node.id))) return powers.get(String(node.id));
    return Object.fromEntries(Object.entries(node).map(([key, child]) => [key, replacePowers(child)]));
  }
  return {
    powers: [...powers.values()],
    characters: [...characters.values()].map(character => ({ ...character, powers: character.powers.map(power => powers.get(power.id) ?? power), equipment: character.equipment?.map(power => powers.get(power.id) ?? power) })),
    resources: [...resources.values()].map(resource => replacePowers(resource) as IResource),
  };
}

/** Decode live snapshot entries for review; historical backups and unreadable bytes stay intact. */
export function snapshotReviewPayload(snapshot: DraftStorageSnapshot) {
  return snapshot.entries.flatMap((entry, index) => {
    if (!['mm3e-draft-characters', 'mm3e-draft-character', 'mm3e-resource-library'].includes(entry.key)) return [];
    try { return [{ index, data: JSON.parse(entry.value) as unknown }]; } catch { return []; }
  });
}
export function applySnapshotReview(snapshot: DraftStorageSnapshot, original: ReturnType<typeof snapshotReviewPayload>, reviewed: ReturnType<typeof snapshotReviewPayload>): DraftStorageSnapshot {
  return { ...snapshot, entries: snapshot.entries.map((entry, index) => {
    const before = original.find(item => item.index === index), after = reviewed.find(item => item.index === index);
    return before && after && JSON.stringify(before.data) !== JSON.stringify(after.data) ? { ...entry, value: JSON.stringify(after.data) } : entry;
  }) };
}
