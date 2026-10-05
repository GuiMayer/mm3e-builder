import { z } from 'zod';
import type { ICharacterPower, ICharacterPowerComponent } from '../../entities/types';
import { CharacterPowerSchema } from '../../entities/schemas';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { createId } from '../../shared/lib/identity';
import { resolveModifierDefinition } from '../../shared/lib/rulesCatalog';

export interface ComponentRankPolicy {
  mode: 'fixed' | 'scalable';
  multiplier: number;
  /** Coefficients keyed by the independent modifier application, never modifierId. */
  modifierRanks: Record<string, number>;
  affectedRanks: Record<string, number>;
  /** Purchase positions are stable within the model's stored component. */
  senseRanks: Record<string, number>;
}
export interface PersonalPowerModel {
  id: string; name: string; description: string; createdAt: string; updatedAt: string;
  power: ICharacterPower;
  policies: Record<string, ComponentRankPolicy>;
}
export const PERSONAL_LIBRARY_KEY = 'mm3e-personal-power-library';
export const PERSONAL_LIBRARY_FORMAT = 'mm3e-personal-power-library';
export const PERSONAL_LIBRARY_MAX_BYTES = 10 * 1024 * 1024;
export const powerComponents = (power: ICharacterPower): ICharacterPowerComponent[] =>
  [...power.components, ...power.alternateEffects.flatMap(alternate => alternate.components)];

export function searchPersonalModels(models: PersonalPowerModel[], query: string, language: string): PersonalPowerModel[] {
  const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase();
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  return models.filter(model => words.every(word => normalize([model.name, model.description, model.power.notes, ...(model.power.descriptors ?? [])].join(' ')).includes(word)))
    .sort((a, b) => a.name.localeCompare(b.name, language));
}

const coefficient = z.number().int().min(1).max(Number.MAX_SAFE_INTEGER);
const policySchema = z.object({ mode: z.enum(['fixed', 'scalable']), multiplier: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
  modifierRanks: z.record(z.string(), coefficient), affectedRanks: z.record(z.string(), coefficient), senseRanks: z.record(z.string(), coefficient) });
const modelSchema = z.object({ id: z.string().min(1), name: z.string().trim().min(1).max(200), description: z.string().max(50000),
  createdAt: z.iso.datetime(), updatedAt: z.iso.datetime(), power: CharacterPowerSchema, policies: z.record(z.string(), policySchema) });
const librarySchema = z.object({ format: z.literal(PERSONAL_LIBRARY_FORMAT), version: z.literal(1), items: z.array(modelSchema).max(1000) });

function validateModel(model: PersonalPowerModel): void {
  if (!Array.isArray(model.power.components) || !model.power.components.length || model.power.alternateEffects.some(a => !Array.isArray(a.components) || !a.components.length)) throw new Error('personalLibrary.invalidFile');
  const components = powerComponents(model.power);
  const ids = [model.power.id, ...components.map(c => c.id), ...model.power.alternateEffects.map(a => a.id), ...components.flatMap(c => c.modifiers.map(m => m.instanceId))];
  if (ids.some(id => !id) || new Set(ids).size !== ids.length || Object.keys(model.policies).length !== components.length) throw new Error('personalLibrary.invalidFile');
  for (const component of components) {
    const effect = POWER_DEFS.find(def => def.id === component.effectId);
    const policy = model.policies[component.id];
    if (!effect || !policy || component.modifiers.some(m => !resolveModifierDefinition(m, effect, MODIFIER_DEFS).definition)) throw new Error('personalLibrary.invalidFile');
    const modifierIds = new Set(component.modifiers.map(m => m.instanceId!));
    if ([...Object.keys(policy.modifierRanks), ...Object.keys(policy.affectedRanks)].some(id => !modifierIds.has(id)) ||
      Object.keys(policy.senseRanks).some(index => !/^(0|[1-9]\d*)$/.test(index) || !component.senseTraits?.[Number(index)])) throw new Error('personalLibrary.invalidFile');
  }
}

export function parsePersonalLibrary(text: string): PersonalPowerModel[] {
  if (new TextEncoder().encode(text).byteLength > PERSONAL_LIBRARY_MAX_BYTES) throw new Error('personalLibrary.tooLarge');
  const parsed = librarySchema.safeParse(JSON.parse(text));
  if (!parsed.success) throw new Error('personalLibrary.invalidFile');
  const models = parsed.data.items as PersonalPowerModel[];
  if (new Set(models.map(model => model.id)).size !== models.length) throw new Error('personalLibrary.invalidFile');
  models.forEach(validateModel);
  return models;
}
export function serializePersonalLibrary(items: PersonalPowerModel[]): string {
  const text = JSON.stringify({ format: PERSONAL_LIBRARY_FORMAT, version: 1, items }, null, 2);
  parsePersonalLibrary(text);
  return text;
}

/** Copies composition only. No live relationship to a sheet, resource or model. */
export function cloneLibraryPower(power: ICharacterPower): ICharacterPower {
  const copy = structuredClone(power);
  copy.id = createId();
  for (const alternate of copy.alternateEffects) alternate.id = createId();
  for (const component of powerComponents(copy)) {
    component.id = createId();
    component.modifiers = component.modifiers.map(modifier => ({ ...modifier, instanceId: createId() }));
  }
  return copy;
}

export function reconcileRankPolicies(power: ICharacterPower, previous: Record<string, ComponentRankPolicy> = {}): Record<string, ComponentRankPolicy> {
  return Object.fromEntries(powerComponents(power).map(component => {
    const old = previous[component.id];
    const modifierIds = new Set(component.modifiers.map(m => m.instanceId!));
    const keep = (values: Record<string, number> = {}) => Object.fromEntries(Object.entries(values).filter(([id]) => modifierIds.has(id)));
    return [component.id, { mode: old?.mode ?? 'fixed', multiplier: old?.multiplier ?? 1,
      modifierRanks: keep(old?.modifierRanks), affectedRanks: keep(old?.affectedRanks),
      senseRanks: Object.fromEntries(Object.entries(old?.senseRanks ?? {}).filter(([index]) => !!component.senseTraits?.[Number(index)])) }];
  }));
}
export function createPersonalModel(power: ICharacterPower): PersonalPowerModel {
  const copy = cloneLibraryPower(power);
  const now = new Date().toISOString();
  return { id: createId(), name: power.name, description: '', power: copy, policies: reconcileRankPolicies(copy), createdAt: now, updatedAt: now };
}

/** Composition edits invalidate policies whose purchase/effect identity has changed. */
export function updateModelComposition(model: PersonalPowerModel, power: ICharacterPower): PersonalPowerModel {
  const policies = reconcileRankPolicies(power, model.policies);
  for (const component of powerComponents(power)) {
    const old = powerComponents(model.power).find(item => item.id === component.id);
    if (old && old.effectId !== component.effectId) policies[component.id] = reconcileRankPolicies({ ...power, components: [component], alternateEffects: [] })[component.id];
    else if (JSON.stringify(old?.senseTraits) !== JSON.stringify(component.senseTraits)) policies[component.id].senseRanks = {};
    const partialIds = new Set(component.modifiers.filter(item => item.affectedRanks !== undefined || typeof item.options?.affectedRanks === 'number').map(item => item.instanceId!));
    policies[component.id].affectedRanks = Object.fromEntries(Object.entries(policies[component.id].affectedRanks).filter(([id]) => partialIds.has(id)));
  }
  return { ...model, power, policies };
}
export function duplicatePersonalModel(model: PersonalPowerModel): PersonalPowerModel {
  const copy = createPersonalModel(model.power);
  const originals = powerComponents(model.power);
  copy.description = model.description; copy.name = model.name;
  powerComponents(copy.power).forEach((component, index) => {
    const source = originals[index]; const policy = model.policies[source.id];
    const remap = (values: Record<string, number>) => Object.fromEntries(source.modifiers.flatMap((modifier, position) =>
      values[modifier.instanceId!] ? [[component.modifiers[position].instanceId!, values[modifier.instanceId!]]] : []));
    copy.policies[component.id] = { ...structuredClone(policy), modifierRanks: remap(policy.modifierRanks), affectedRanks: remap(policy.affectedRanks) };
  });
  return copy;
}

export function prepareModelImport(existing: readonly PersonalPowerModel[], incoming: readonly PersonalPowerModel[], conflicts: 'copy' | 'keep' | 'replace', copyName: (name: string) => string = name => name): PersonalPowerModel[] {
  return incoming.flatMap(model => {
    const collision = existing.some(item => item.id === model.id);
    if (collision && conflicts === 'keep') return [];
    if (collision && conflicts === 'copy') {
      const copy = duplicatePersonalModel(model); copy.name = copyName(model.name); copy.power.name = copy.name; return [copy];
    }
    return [structuredClone(model)];
  });
}

/** Rank choices and authoring policies never enter the instantiated character power. */
export function instantiatePersonalModel(model: PersonalPowerModel, ranks: Readonly<Record<string, number>> = {}): ICharacterPower {
  const copy = structuredClone(model.power);
  for (const component of powerComponents(copy)) {
    const policy = model.policies[component.id];
    if (!policy || policy.mode === 'fixed') continue;
    const chosen = ranks[component.id] ?? 1;
    if (!Number.isSafeInteger(chosen) || chosen < 1) throw new Error('personalLibrary.invalidRank');
    const multiply = (value: number) => { const result = chosen * value; if (!Number.isSafeInteger(result)) throw new Error('personalLibrary.invalidRank'); return result; };
    component.ranks = multiply(policy.multiplier);
    for (const modifier of component.modifiers) {
      const id = modifier.instanceId!;
      if (policy.modifierRanks[id]) modifier.ranks = multiply(policy.modifierRanks[id]);
      if (policy.affectedRanks[id]) {
        modifier.affectedRanks = multiply(policy.affectedRanks[id]);
        if (typeof modifier.options?.affectedRanks === 'number') modifier.options.affectedRanks = modifier.affectedRanks;
      }
    }
    if (component.senseTraits?.length) {
      component.senseTraits = component.senseTraits.map((trait, index) => ({ ...trait, ranks: policy.senseRanks[String(index)] ? multiply(policy.senseRanks[String(index)]) : trait.ranks }));
      component.ranks = component.senseTraits.reduce((sum, trait) => sum + trait.ranks, 0);
      if (!Number.isSafeInteger(component.ranks)) throw new Error('personalLibrary.invalidRank');
    }
  }
  copy.name = model.name;
  return cloneLibraryPower(copy);
}
