import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS } from '../entities/gameDataLoaders';
import type { IAppliedModifier, ICharacterPower, ICharacterPowerComponent, IResource } from '../entities/types';
import { calculateComponentPricing, calculatePowerPricing } from '../shared/lib/mathEngine';
import { buildTargetedEffectProfiles } from '../shared/lib/offenseSummary';
import { effectiveTraitCharacter } from '../shared/lib/traitValues';
import { resolveEffectiveRange } from '../shared/lib/effectParameters';
import { getPowerSources, powerAllocationSummary, resolvePowerUsage } from '../shared/lib/powerUsage';
import { getPricingStrengthContext, getResourcePricingStrength } from '../shared/lib/pricingStrength';
import { getResourceCost } from '../shared/lib/resourceCalculations';
import { getLibraryDestinationStrength, getLibraryRecipeStrength } from '../features/power-library/libraryPricing';
import { applyPowerTemplate } from '../features/power-library/powerTemplateApplication';
import { renderSkillsSection } from '../services/pdf/components/SkillsSection';
import { calculateSkillCheck } from '../shared/lib/skillCheck';
import { calculateCharacterPointSummary } from '../shared/lib/pointSummary';
import { deriveCharacterDefenses } from '../shared/lib/derivedDefenses';
import { getTraitSourceEntries } from '../shared/lib/traitSources';

const modifier = (modifierId: string, ranks = 1, specific = false): IAppliedModifier => ({ modifierId, ranks, isPowerSpecific: specific });
const component = (overrides: Partial<ICharacterPowerComponent> = {}): ICharacterPowerComponent => ({ id: 'c', effectId: 'damage', ranks: 10, modifiers: [], ...overrides });
const power = (value: ICharacterPowerComponent, id = 'p'): ICharacterPower => ({ id, name: 'Power', notes: '', components: [value], alternateEffects: [] });
const profiles = (value: ReturnType<typeof createDefaultCharacter>) => buildTargetedEffectProfiles(value, POWER_DEFS, SKILL_DEFS, [], MODIFIER_DEFS);
const strength = (ranks: number) => component({ effectId: 'enhanced-trait', ranks, enhancedTarget: { kind: 'ability', key: 'str' }, variableCostOption: 'Enhanced Ability' });

describe('Handbook rules regressions', () => {
  it('Accurate repeated applications provide the same total as a combined purchase (Modifiers p.187)', () => {
    const split = component({ modifiers: [modifier('accurate', 1), modifier('accurate', 2)] });
    const combined = component({ modifiers: [modifier('accurate', 3)] });
    const definition = POWER_DEFS.find(def => def.id === 'damage')!;
    expect(calculateComponentPricing(split, definition, MODIFIER_DEFS).total).toBe(calculateComponentPricing(combined, definition, MODIFIER_DEFS).total);
    const attack = profiles(createDefaultCharacter({ powers: [power(split)] })).find(item => item.sourceType === 'power')!;
    expect(attack.bonusValue).toBe(6);
  });

  it('Affects Only Others does not enhance the caster (Modifiers p.188)', () => {
    const value = strength(5);
    value.modifiers = [{ ...modifier('affects_others'), options: { affectsOnlyOthers: true } }];
    const character = createDefaultCharacter({ powers: [power(value)] });
    character.abilities.str = 2;
    expect(effectiveTraitCharacter(character).abilities.str).toBe(2);
  });

  it('power-specific Area Nullify produces no attack roll (Nullify p.173; PL p.24)', () => {
    const value = component({ effectId: 'nullify', ranks: 12, modifiers: [modifier('area_nullify', 1, true)] });
    const character = createDefaultCharacter({ powers: [power(value)] });
    const attack = profiles(character).find(item => item.sourceType === 'power')!;
    expect(attack.requiresAttackCheck).toBe(false);
  });

  it('Ranged Healing changes its printed close range (Healing p.162)', () => {
    const value = component({ effectId: 'healing', modifiers: [modifier('ranged_healing', 1, true)] });
    expect(resolveEffectiveRange(POWER_DEFS.find(def => def.id === 'healing')!.range, value).value).toBe('ranged');
  });

  it('an exclusive Strength alternate cannot enhance the Damage branch price (Alternate Effect p.189)', () => {
    const value = power(strength(10));
    value.alternateEffects = [{ id: 'ae', name: 'Strike', notes: '', dynamic: false, components: [component({ id: 'damage', fieldValues: { damageBasis: 'strength-based' }, modifiers: [modifier('multiattack')] })] }];
    const character = createDefaultCharacter({ powers: [value] });
    const price = calculatePowerPricing(value, POWER_DEFS, MODIFIER_DEFS, getPricingStrengthContext(character));
    expect(price.mainCost).toBe(20);
    expect(price.alternateEffects[0].total).toBe(20);
  });

  it('dynamic pool costs include Multiattack on the wearer Strength (Damage p.156; Dynamic AE p.189)', () => {
    const value = power(component({ ranks: 20, modifiers: [modifier('increased_range')] }));
    value.baseDynamic = true;
    value.alternateEffects = [{ id: 'ae', name: 'Strike', notes: '', dynamic: true, components: [component({ id: 'damage', fieldValues: { damageBasis: 'strength-based' }, modifiers: [modifier('multiattack')] })] }];
    const character = createDefaultCharacter({ powers: [value] });
    character.abilities.str = 10;
    const source = getPowerSources(character)[0];
    const selection = { branchId: 'ae', allocations: { c: 12, damage: 5 } };
    const allocation = powerAllocationSummary(source, selection);
    expect(calculatePowerPricing(value, POWER_DEFS, MODIFIER_DEFS, character.abilities.str).alternateEffects[0].total).toBeLessThanOrEqual(allocation.budget);
    expect(allocation.budget).toBe(40);
    expect(allocation.cost).toBe(44);
    expect(resolvePowerUsage(source, selection).warnings.some(warning => warning.key === 'traits.arrayBudget')).toBe(true);
  });

  it('a manually defined Damage 8 uses DC 23 (Damage p.156)', () => {
    const character = createDefaultCharacter({ manualOffenseRows: [{ id: 'manual', name: 'Sword', bonus: 2, range: 'close', effect: 'Damage 8', notes: '' }] });
    expect(profiles(character).find(item => item.sourceType === 'manual')?.resistance).toBe('Resistance DC 23');
  });

  it('Nullify uses an opposed check rather than a fixed resistance DC (Nullify p.173)', () => {
    const character = createDefaultCharacter({ powers: [power(component({ effectId: 'nullify', ranks: 5 }))] });
    const profile = profiles(character).find(item => item.sourceType === 'power')!;
    expect(profile.resistance).not.toMatch(/\bDC\s+\d+/);
    expect(profile.resistance).toContain('max(effect rank, Will)');
    character.powers[0].components[0].modifiers.push({ ...modifier('alternate_resistance', 1, true), options: { subtypeId: 'fortitude' } });
    expect(profiles(character).find(item => item.sourceType === 'power')?.resistance).toContain('max(effect rank, Fortitude)');
  });

  it('a Ranged Combat check includes Ranged Attack as well as Dexterity and purchased ranks (Skills p.125)', () => {
    const skill = { skillId: 'ranged_combat', subtype: 'Bow', ranks: 4 };
    const character = createDefaultCharacter({ skills: [skill], advantages: [{ advantageId: 'ranged_attack', ranks: 3 }] });
    character.abilities.dex = 2;
    expect(calculateSkillCheck(character, skill, SKILL_DEFS.find(def => def.id === 'ranged_combat')!).total).toBe(9);
    const html = renderSkillsSection({ character, skillDefs: Object.fromEntries(SKILL_DEFS.map(def => [def.id, def])), skillsCost: 2 });
    expect(html).toContain('class="skill-total">+9');
  });

  it('sums repeated Inaccurate and Accurate independently of modifier order', () => {
    const value = component({ modifiers: [modifier('inaccurate', 1), modifier('accurate', 1), modifier('inaccurate', 2), modifier('accurate', 1)] });
    const character = createDefaultCharacter({ powers: [power(value)] });
    character.abilities.fgt = 8;
    expect(profiles(character).find(profile => profile.sourceType === 'power')?.bonusValue).toBe(6);
    value.modifiers.reverse();
    expect(profiles(character).find(profile => profile.sourceType === 'power')?.bonusValue).toBe(6);
  });

  it('keeps partial Accurate applications on their affected ranks only', () => {
    const value = component({ modifiers: [{ ...modifier('accurate', 1), affectedRanks: 3 }, modifier('accurate', 2)] });
    expect(profiles(createDefaultCharacter({ powers: [power(value)] })).filter(profile => profile.sourceType === 'power').map(profile => [profile.effectRank, profile.bonusValue])).toEqual([[3, 6], [10, 4]]);
  });

  it('keeps ordinary Affects Others available to the caster and excludes Only Others defenses', () => {
    const value = strength(5);
    value.modifiers = [modifier('affects_others')];
    const character = createDefaultCharacter({ powers: [power(value)] });
    expect(effectiveTraitCharacter(character).abilities.str).toBe(5);
    value.modifiers[0].options = { affectsOnlyOthers: true };
    character.powers.push(power(component({ id: 'protect', effectId: 'protection', ranks: 7, modifiers: value.modifiers }), 'protection'));
    expect(effectiveTraitCharacter(character).abilities.str).toBe(0);
    expect(deriveCharacterDefenses(character, POWER_DEFS).toughnessTotal).toBe(0);
    expect(getTraitSourceEntries(character).map(entry => entry.status)).toEqual(['recipient', 'recipient']);
    expect(calculatePowerPricing(power(component({ fieldValues: { damageBasis: 'strength-based' }, modifiers: [modifier('multiattack')] }), 'attack'), POWER_DEFS, MODIFIER_DEFS, getPricingStrengthContext(character)).mainCost).toBe(20);
  });

  it('keeps linked Strength, external Strength and purchase prices independent of usage', () => {
    const attack = component({ fieldValues: { damageBasis: 'strength-based' }, modifiers: [modifier('multiattack')] });
    const array = power(strength(10));
    array.components.push(attack);
    array.alternateEffects = [{ id: 'alternate', name: 'Alternate', notes: '', dynamic: false, components: [strength(4), { ...attack, id: 'alternate-attack' }] }];
    const character = createDefaultCharacter({ powers: [array, power(strength(3), 'external')] });
    character.abilities.str = 2;
    const before = calculateCharacterPointSummary(character, [], POWER_DEFS, MODIFIER_DEFS);
    expect(before.powerPricing[0].mainCost).toBe(55);
    expect(before.powerPricing[0].alternateEffects[0].total).toBe(37);
    character.powerUsage = { 'power:p': { branchId: 'alternate', enabled: false }, 'power:external': { enabled: false } };
    expect(calculateCharacterPointSummary(character, [], POWER_DEFS, MODIFIER_DEFS).powerPricing).toEqual(before.powerPricing);
  });

  it('charges extras on only the Strength allocated to a dynamic enhancement', () => {
    const array = power(component({ id: 'base-damage', ranks: 20, modifiers: [modifier('increased_range')] }));
    array.baseDynamic = true;
    array.alternateEffects = [{ id: 'alternate', name: 'Strike', notes: '', dynamic: true, components: [
      { ...strength(10), id: 'strength' }, component({ id: 'strike', ranks: 5, fieldValues: { damageBasis: 'strength-based' }, modifiers: [modifier('multiattack')] }),
    ] }];
    const source = getPowerSources(createDefaultCharacter({ powers: [array] }))[0];
    const usage = { allocations: { 'base-damage': 12, strength: 2, strike: 5 } };
    expect(powerAllocationSummary(source, usage)).toEqual({ cost: 40, budget: 40 });
    expect(resolvePowerUsage(source, usage).warnings).toEqual([]);
    usage.allocations.strength = 3;
    expect(powerAllocationSummary(source, usage)).toEqual({ cost: 43, budget: 40 });
    expect(resolvePowerUsage(source, usage).warnings.some(notice => notice.key === 'traits.arrayBudget')).toBe(true);
  });

  it('prices exclusive Strength branches equally in the library, sheet and resource previews', () => {
    const array = power(strength(10));
    array.alternateEffects = [{ id: 'alternate', name: 'Strike', notes: '', dynamic: false, components: [component({ fieldValues: { damageBasis: 'strength-based' }, modifiers: [modifier('multiattack')] })] }];
    const character = createDefaultCharacter({ powers: [array] });
    expect(calculateCharacterPointSummary(character, [], POWER_DEFS, MODIFIER_DEFS).powerPricing[0].alternateEffects[0].total).toBe(20);
    expect(calculatePowerPricing(array, POWER_DEFS, MODIFIER_DEFS, getLibraryDestinationStrength(array)).alternateEffects[0].total).toBe(20);
    const resource: IResource = { id: 'device', type: 'gear', name: 'Device', notes: '', createdAt: '2026-10-07', updatedAt: '2026-10-07', costMode: 'device', power: array };
    const wearer = createDefaultCharacter({ resourceLinks: [{ id: 'link', resourceId: resource.id, isFree: false }] });
    expect(getResourceCost(resource, POWER_DEFS, MODIFIER_DEFS, getResourcePricingStrength(wearer, resource)).total).toBe(21);
    expect(calculateCharacterPointSummary(wearer, [resource], POWER_DEFS, MODIFIER_DEFS).resourcePPUsed).toBe(21);
  });

  it('keeps an alternate recipe separate from Strength in the parent base branch', () => {
    const array = power(strength(10));
    array.alternateEffects = [{ id: 'alternate', name: 'Strike', notes: '', dynamic: false, components: [component()] }];
    const recipe = power(component({ fieldValues: { damageBasis: 'strength-based' }, modifiers: [modifier('multiattack')] }), 'recipe');
    const character = createDefaultCharacter({ powers: [array] });
    const target = { kind: 'alternate' as const, alternateId: 'alternate' };
    const context = getLibraryRecipeStrength(character, array, recipe, target);
    expect(calculatePowerPricing(recipe, POWER_DEFS, MODIFIER_DEFS, context).total).toBe(20);
    expect(calculatePowerPricing(applyPowerTemplate(array, recipe, target), POWER_DEFS, MODIFIER_DEFS, context).alternateEffects[0].total).toBe(20);
  });

  it('recognizes legacy power-specific Area without changing its source marker', () => {
    const value = component({ effectId: 'nullify', modifiers: [{ modifierId: 'area_nullify', ranks: 1 }] });
    const character = createDefaultCharacter({ powers: [power(value)] });
    expect(profiles(character).find(profile => profile.sourceType === 'power')).toMatchObject({ requiresAttackCheck: false, tags: ['resistance', 'area'] });
    expect(value.modifiers[0].isPowerSpecific).toBeUndefined();
  });

  it('rejects other effects\' specific modifiers from mechanical derivation', () => {
    const value = component({ modifiers: [modifier('area_nullify', 1, true), modifier('ranged_healing', 1, true)] });
    expect(profiles(createDefaultCharacter({ powers: [power(value)] })).find(profile => profile.sourceType === 'power')).toMatchObject({ requiresAttackCheck: true, range: 'close' });
  });

  it.each([
    ['healing', ['ranged_healing'], 'ranged'],
    ['healing', ['perception_healing', 'ranged_healing'], 'perception'],
    ['illusion', ['ranged_illusion'], 'ranged'],
    ['mind-reading', ['close_mind_reading'], 'close'],
    ['mind-reading', ['ranged_mind_reading'], 'ranged'],
    ['move-object', ['perception_move_object'], 'perception'],
    ['move-object', ['close_move_object'], 'close'],
    ['immunity', ['affects_others', 'ranged_immunity'], 'ranged'],
    ['senses', ['affects_others', 'ranged_senses'], 'ranged'],
    ['variable', ['affects_others', 'perception_variable', 'ranged_variable'], 'perception'],
    ['luck-control', ['ranged_luck'], 'ranged'],
    ['burrowing', ['ranged'], 'ranged'],
  ])('resolves %s range using its own modifier definitions', (effectId, modifierIds, expected) => {
    const definition = POWER_DEFS.find(def => def.id === effectId)!;
    const value = component({ effectId, modifiers: (modifierIds as string[]).map(id => modifier(id, 1, id !== 'affects_others')) });
    const result = resolveEffectiveRange(definition.range, value, { effect: definition, modifierDefs: MODIFIER_DEFS });
    expect(result.value).toBe(expected);
    expect(result.diagnostics).toEqual([]);
  });

  it('requires an attack for Ranged Healing, but not Area or Perception Healing', () => {
    const value = component({ effectId: 'healing', modifiers: [modifier('ranged_healing', 1, true)] });
    const character = createDefaultCharacter({ powers: [power(value)] });
    expect(profiles(character).find(profile => profile.sourceType === 'power')).toMatchObject({ requiresAttackCheck: true, causesResistance: false });
    value.modifiers.push(modifier('perception_healing', 1, true));
    expect(profiles(character).find(profile => profile.sourceType === 'power')).toMatchObject({ range: 'perception', requiresAttackCheck: false, resistance: undefined });
    value.modifiers = [modifier('area_healing', 1, true)];
    expect(profiles(character).find(profile => profile.sourceType === 'power')).toMatchObject({ requiresAttackCheck: false, causesResistance: false });
  });

  it('keeps manual Affliction DCs and translates manual Dano ranks without editing free text', () => {
    const character = createDefaultCharacter({ manualOffenseRows: [
      { id: 'damage', name: 'Dano manual', bonus: 2, range: 'close', effect: 'Dano 8, Penetrating 2', notes: 'Preserve' },
      { id: 'affliction', name: 'Aflição manual', bonus: 2, range: 'ranged', effect: 'Aflição 8', notes: '' },
    ] });
    expect(profiles(character).filter(profile => profile.sourceType === 'manual').map(profile => profile.resistance)).toEqual(['Resistance DC 23', 'Resistance DC 18']);
    expect(character.manualOffenseRows?.[0].effect).toBe('Dano 8, Penetrating 2');
  });

  it('recalculates a frozen existing sheet and linked resources without changing serialized data', () => {
    const array = power(strength(10));
    array.alternateEffects = [{ id: 'alternate', name: 'Strike', notes: 'Saved notes', dynamic: true, components: [component({ fieldValues: { damageBasis: 'strength-based' }, modifiers: [modifier('multiattack'), modifier('accurate'), modifier('accurate', 2)] })] }];
    const resource: IResource = { id: 'gear', type: 'gear', name: 'Gear', notes: 'Saved resource', createdAt: '2026-10-07', updatedAt: '2026-10-07', power: power(strength(2), 'gear-power') };
    const character = createDefaultCharacter({ powers: [array], resourceLinks: [{ id: 'link', resourceId: 'gear', isFree: true }], powerUsage: { 'power:p': { branchId: 'alternate', allocations: { c: 5 } } }, skills: [{ skillId: 'ranged_combat', subtype: 'Strike', ranks: 4 }], advantages: [{ advantageId: 'ranged_attack', ranks: 3 }], manualOffenseRows: [{ id: 'manual', name: 'Manual', bonus: 4, range: 'ranged', effect: 'Damage 8', notes: 'Preserve' }] });
    const resources = [resource];
    const serialized = JSON.stringify({ character, resources });
    function freeze(value: unknown) {
      if (value && typeof value === 'object') { for (const child of Object.values(value)) freeze(child); Object.freeze(value); }
    }
    freeze(character); freeze(resources);
    calculateCharacterPointSummary(character, resources, POWER_DEFS, MODIFIER_DEFS);
    effectiveTraitCharacter(character, resources);
    deriveCharacterDefenses(character, POWER_DEFS, resources);
    buildTargetedEffectProfiles(character, POWER_DEFS, SKILL_DEFS, [], MODIFIER_DEFS, undefined, resources);
    getTraitSourceEntries(character, resources);
    calculateSkillCheck(character, character.skills[0], SKILL_DEFS.find(def => def.id === 'ranged_combat')!, resources);
    powerAllocationSummary(getPowerSources(character, resources)[0], character.powerUsage?.['power:p']);
    expect(JSON.stringify({ character, resources })).toBe(serialized);
  });
});
