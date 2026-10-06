import type { Abilities, IAppliedModifier, ICharacter, ICharacterAdvantage, ICharacterPower, ICharacterPowerComponent, ICharacterSkill, IResource, ITraitTarget } from '../../entities/types';
import { createDefaultCharacter } from '../../entities/characterDefaults';
import { createId } from '../../shared/lib/identity';
import { POWER_DEFS, MODIFIER_DEFS, ADVANTAGE_DEFS, SKILL_DEFS } from '../../entities/gameDataLoaders';
import { calculatePowerPricing } from '../../shared/lib/mathEngine';
import { calculateCharacterPointSummary } from '../../shared/lib/pointSummary';
import { validateRequiredPowerFields } from '../../shared/lib/validation';
import { validateCharacterSemantics } from '../../shared/lib/semanticValidation';
import { getPowerSources } from '../../shared/lib/powerUsage';
import { effectiveTraitCharacter } from '../../shared/lib/traitValues';

export type Text = { en: string; pt: string };
export const text = (en: string, pt: string): Text => ({ en, pt });
export const local = (value: Text, language: string) => language.startsWith('pt') ? value.pt : value.en;
export type Answers = Record<string, string | string[] | ICharacterPower[]>;
export type Option = { value: string; label: Text };
export type Choice = { id: string; label: Text; kind: 'select' | 'text' | 'multi' | 'powers'; options?: Option[]; count?: number; budget?: number; equipment?: boolean; optional?: boolean };
export interface Archetype {
  id: string; name: Text; summary: Text; page: number;
  /** Printed costs are audit evidence, never passed to the pricing engine. */
  printed: readonly [number, number, number, number, number];
  note?: Text;
  build: (draft: Recipe) => void;
}
export type Package = { character: ICharacter; resources: IResource[] };

export function modifier(id: string, ranks = 1, options?: IAppliedModifier['options']): IAppliedModifier {
  return { instanceId: createId(), modifierId: id, ranks, isPowerSpecific: false, ...(options ? { options } : {}) };
}
export function specific(id: string, ranks = 1, options?: IAppliedModifier['options']): IAppliedModifier {
  return { ...modifier(id, ranks, options), isPowerSpecific: true };
}
export function component(effectId: string, ranks: number, modifiers: IAppliedModifier[] = [], extra: Partial<ICharacterPowerComponent> = {}): ICharacterPowerComponent {
  return { id: createId(), effectId, ranks, modifiers, ...extra };
}
export function enhanced(target: ITraitTarget, ranks: number, lifting = false) {
  return component('enhanced-trait', ranks, lifting ? [modifier('limited')] : [], { enhancedTarget: target,
    ...(lifting ? { fieldValues: { enhancedScope: 'lifting' } } : {}) });
}
export function enhancedAdv(id: string, ranks = 1, subtype?: string) {
  return component('enhanced-trait', ranks, [], { variableCostOption: 'Enhanced Advantage', fieldValues: { enhancedAdvantageId: id, ...(subtype ? { enhancedAdvantageSubtype: subtype } : {}) } });
}
export function damage(ranks: number, modifiers: IAppliedModifier[] = [], strength = false) {
  return component('damage', ranks, modifiers, { fieldValues: { damageBasis: strength ? 'strength-based' : 'effect-only' } });
}
export function affliction(ranks: number, conditions: string[], modifiers: IAppliedModifier[] = [], resistance = 'fortitude') {
  return component('affliction', ranks, modifiers, { fieldValues: { resistance, afflictionDegrees: conditions.map((_, index) => String(index + 1)), ...Object.fromEntries(conditions.map((condition, index) => [`afflictionDegree${index + 1}`, condition.split('/')])) } });
}
export function power(name: string, components: ICharacterPowerComponent[], alternates: ICharacterPower[] = [], notes = ''): ICharacterPower {
  return { id: createId(), name, components, notes, alternateEffects: alternates.map(item => ({ id: createId(), name: item.name, components: item.components, notes: item.notes, dynamic: false })) };
}
export function freshPower(input: ICharacterPower): ICharacterPower {
  const draft = structuredClone(input);
  draft.id = createId();
  for (const alternate of draft.alternateEffects) alternate.id = createId();
  for (const item of [...draft.components, ...draft.alternateEffects.flatMap(alternate => alternate.components)]) {
    item.id = createId(); item.modifiers.forEach(mod => { mod.instanceId = createId(); });
  }
  return draft;
}
export const skill = (skillId: string, ranks: number, subtype: string | null = null): ICharacterSkill => ({ skillId, ranks, subtype });
export const advantage = (advantageId: string, ranks = 1, subtype?: string): ICharacterAdvantage => ({ advantageId, ranks, ...(subtype ? { subtype } : {}) });
export const options = (...values: [string, string, string][]): Option[] => values.map(([value, en, pt]) => ({ value, label: text(en, pt) }));

export class Recipe {
  character = createDefaultCharacter({ characterId: createId() });
  resources: IResource[] = [];
  choices: Choice[] = [];
  missing: string[] = [];
  readonly answers: Answers;
  readonly language: string;
  constructor(answers: Answers, language: string) { this.answers = answers; this.language = language; }
  label(en: string, pt: string) { return local(text(en, pt), this.language); }
  abilities(values: number[]) {
    this.character.abilities = Object.fromEntries(['str','agl','fgt','awe','sta','dex','int','pre'].map((key, index) => [key, values[index]])) as Abilities;
  }
  defenses(dodge: number, parry: number, fortitude: number, will: number) { this.character.defenses = { dodge, parry, fortitude, will }; }
  skills(...entries: ICharacterSkill[]) { this.character.skills.push(...entries); }
  advantages(...entries: (string | ICharacterAdvantage)[]) { this.character.advantages.push(...entries.map(item => typeof item === 'string' ? advantage(item) : item)); }
  select(id: string, label: Text, opts: Option[], optional = false, fallback = '') {
    this.choices.push({ id, label, kind: 'select', options: opts, optional });
    const answer = this.answers[id];
    const value = typeof answer === 'string' && opts.some(option => option.value === answer) ? answer : optional ? fallback : '';
    if (!value && !optional) this.missing.push(id);
    return value;
  }
  input(id: string, label: Text) {
    this.choices.push({ id, label, kind: 'text' });
    const answer = this.answers[id]; const value = typeof answer === 'string' ? answer.trim() : '';
    if (!value) this.missing.push(id);
    return value;
  }
  many(id: string, label: Text, opts: Option[], count: number) {
    this.choices.push({ id, label, kind: 'multi', options: opts, count });
    const raw = this.answers[id];
    const values = Array.isArray(raw) ? [...new Set(raw.filter((value): value is string => typeof value === 'string' && opts.some(option => option.value === value)))] : [];
    if (values.length !== count) this.missing.push(id);
    return values.slice(0, count);
  }
  chosenAdvantages(id: string, count: number, opts: Option[]) {
    for (const value of this.many(id, text('Choose advantages', 'Escolha as vantagens'), opts, count)) {
      const [advantageId, originalSubtype] = value.split(':');
      const definition = ADVANTAGE_DEFS.find(def => def.id === advantageId);
      const subtype = originalSubtype === 'Choose' || (!originalSubtype && definition?.subtypeRequired)
        ? this.input(`specialization-${advantageId}`, text(`Specialization: ${definition?.name ?? advantageId}`, `Especialização: ${definition?.i18n?.['pt-BR']?.name ?? advantageId}`)) : originalSubtype;
      this.advantages(advantage(advantageId, 1, subtype));
    }
  }
  powers(id: string, count: number, budget: number, strength = 0, equipment = false) {
    this.choices.push({ id, label: text('Configure effects', 'Configure os efeitos'), kind: 'powers', count, budget, equipment });
    const raw = this.answers[id];
    const values = Array.isArray(raw) ? raw.filter((entry): entry is ICharacterPower => typeof entry === 'object').map(freshPower) : [];
    if (values.length !== count || values.some(entry => {
      const price = calculatePowerPricing(entry, POWER_DEFS, MODIFIER_DEFS, strength);
      return !entry.components.length || entry.alternateEffects.length > 0 || !!entry.removable && entry.removable !== 'none'
        || validateCharacterSemantics(createDefaultCharacter({powers:[entry]}), {powerDefs:POWER_DEFS,modifierDefs:MODIFIER_DEFS}).some(issue=>issue.severity==='error')
        || price.diagnostics.length > 0 || (equipment ? price.equipmentTotal : price.total) > budget
        || entry.components.some(item => !POWER_DEFS.some(def => def.id === item.effectId) || !!validateRequiredPowerFields(item, POWER_DEFS.find(def => def.id === item.effectId)));
    })) this.missing.push(id);
    return values.slice(0, count);
  }
  addPower(en: string, pt: string, components: ICharacterPowerComponent[], alternates: ICharacterPower[] = [], notes = '') {
    const item = power(this.label(en, pt), components, alternates, notes); this.character.powers.push(item); return item;
  }
  resource(item: ICharacterPower, mode: 'equipment' | 'device' = 'equipment') {
    const resource: IResource = { id: createId(), type: mode === 'device' ? 'gadget' : 'gear', name: item.name, notes: item.notes, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), power: item, costMode: mode };
    this.link(resource); return resource;
  }
  link(resource: IResource) { this.resources.push(resource); this.character.resourceLinks ??= []; this.character.resourceLinks.push({ id: createId(), resourceId: resource.id, isFree: false }); }
  expertise(id = 'expertise', ranks = 6) { this.skills(skill('expertise', ranks, this.input(id, text('Expertise specialization', 'Especialização de Conhecimento')))); }
}

export function instantiateArchetype(archetype: Archetype, answers: Answers, language: string) {
  const recipe = new Recipe(answers, language);
  archetype.build(recipe);
  const attackSkill = ({ 'energy-controller':'Energy', speedster:'Unarmed', 'weapon-master':'Weapon', 'crime-fighter':'Thrown' } as Record<string,string>)[archetype.id];
  if (attackSkill) for (const source of getPowerSources(recipe.character, recipe.resources)) for (const item of [...source.power.components, ...source.power.alternateEffects.flatMap(alternate => alternate.components)]) {
    if (['damage','affliction'].includes(item.effectId)) item.fieldValues = { ...item.fieldValues, attackSkill };
  }
  const effective = effectiveTraitCharacter(recipe.character, recipe.resources);
  const throwing = effective.skills.find(item => item.skillId === 'ranged_combat' && ['throwing','thrown'].includes(item.subtype?.toLowerCase() ?? ''));
  if (throwing && archetype.id !== 'crime-fighter') {
    recipe.character.manualOffenseRows ??= [];
    recipe.character.manualOffenseRows.push({ id:createId(), name:recipe.label('Throw','Arremesso'), range:'ranged', bonus:effective.abilities.dex + throwing.ranks + (effective.advantages.find(item => item.advantageId==='ranged_attack')?.ranks ?? 0), effect:recipe.label(`Damage ${effective.abilities.str}`,`Dano ${effective.abilities.str}`), notes:recipe.label('Manual throwing attack. Review this row after changing Strength or attack bonuses.','Ataque manual de arremesso. Revise esta linha após mudar a Força ou os bônus de ataque.') });
  }
  recipe.character.header.name = local(archetype.name, language);
  const summary = calculateCharacterPointSummary(recipe.character, recipe.resources, POWER_DEFS, MODIFIER_DEFS);
  const unknown = recipe.character.advantages.some(item => !ADVANTAGE_DEFS.some(def => def.id === item.advantageId))
    || recipe.character.skills.some(item => !SKILL_DEFS.some(def => def.id === item.skillId));
  return { character: recipe.character, resources: recipe.resources, choices: recipe.choices, missing: recipe.missing,
    summary, valid: !recipe.missing.length && !unknown && !summary.diagnostics.length && summary.totalEPUsed <= summary.equipmentEPLimit };
}
