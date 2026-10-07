import { describe, expect, it, vi } from 'vitest';
import type { ICharacterPower } from '../entities/types';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';
import { calculatePowerPricing } from '../shared/lib/mathEngine';
import { getPricingStrength } from '../shared/lib/pricingStrength';
import type { PricingStrength } from '../shared/lib/strengthContributions';
import { getLibraryDestinationStrength, getLibraryRecipeStrength } from '../features/power-library/libraryPricing';
import { createPersonalModel, duplicatePersonalModel, instantiatePersonalModel, parsePersonalLibrary, powerComponents, reconcileRankPolicies, updateModelComposition, prepareModelImport, searchPersonalModels, serializePersonalLibrary, PERSONAL_LIBRARY_KEY } from '../features/power-library/personalPowerModel';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { CharacterTab } from '../entities/characterTab';
import { resolveLibraryPowerDestination, resolveLibraryPowerSave } from '../features/power-library/libraryCharacterEditing';
import { canApplyPowerTemplate, applyPowerTemplate } from '../features/power-library/powerTemplateApplication';

const power = (): ICharacterPower => ({ id: 'power', name: 'Custom power', notes: 'Keep notes', descriptors: ['Magic'],
  components: [{ id: 'damage', effectId: 'damage', ranks: 6, modifiers: [{ modifierId: 'accurate', ranks: 2 }, { modifierId: 'accurate', ranks: 1 }], fieldValues: { damageBasis: 'strength-based' } },
    { id: 'immunity', effectId: 'immunity', ranks: 2, modifiers: [] }],
  alternateEffects: [{ id: 'ae', name: 'Flight', notes: 'Alternate notes', dynamic: true, components: [{ id: 'flight', effectId: 'flight', ranks: 3, modifiers: [] }] }], baseDynamic: true, activation: 'move', removable: 'removable' });
const price = (p: ICharacterPower, strength: PricingStrength = 0) => calculatePowerPricing(p, POWER_DEFS, MODIFIER_DEFS, strength).total;

describe('Personal power model composition', () => {
  it('preserves fixed purchases and costs without altering a source sheet', () => {
    const original = power(), before = structuredClone(original);
    const model = createPersonalModel(original), applied = instantiatePersonalModel(model);
    expect(original).toEqual(before);
    expect(price(applied)).toBe(price(original));
    expect(applied).toMatchObject({ name: original.name, notes: original.notes, activation: original.activation, removable: original.removable, baseDynamic: true, descriptors: ['Magic'] });
    expect(applied.alternateEffects[0]).toMatchObject({ name: 'Flight', notes: 'Alternate notes', dynamic: true });
    expect(Object.keys(applied)).not.toContain('policies');
  });

  it('starts scalable components at one, keeps fixed siblings and generates independent identities', () => {
    const model = createPersonalModel(power());
    const component = model.power.components[0];
    model.policies[component.id].mode = 'scalable';
    const first = instantiatePersonalModel(model), second = instantiatePersonalModel(model, { [component.id]: 8 });
    expect(first.components.map(c => c.ranks)).toEqual([1, 2]);
    expect(second.components.map(c => c.ranks)).toEqual([8, 2]);
    const ids = (p: ICharacterPower) => [p.id, ...powerComponents(p).map(c => c.id), ...p.alternateEffects.map(a => a.id), ...powerComponents(p).flatMap(c => c.modifiers.map(m => m.instanceId))];
    expect(ids(first).every(id => !ids(second).includes(id) && !ids(model.power).includes(id))).toBe(true);
    expect(model.power.components[0].ranks).toBe(6);
  });

  it('scales each repeated modifier and partial purchase independently', () => {
    const model = createPersonalModel(power()), component = model.power.components[0];
    component.modifiers[0].affectedRanks = 2;
    const policy = model.policies[component.id];
    policy.mode = 'scalable'; policy.multiplier = 2;
    policy.modifierRanks[component.modifiers[0].instanceId!] = 3;
    policy.affectedRanks[component.modifiers[0].instanceId!] = 1;
    const applied = instantiatePersonalModel(model, { [component.id]: 4 });
    expect(applied.components[0]).toMatchObject({ ranks: 8, modifiers: [{ ranks: 12, affectedRanks: 4 }, { ranks: 1 }] });
    const expected = power(); expected.components[0].ranks = 8;
    expected.components[0].modifiers = [{ modifierId: 'accurate', ranks: 12, affectedRanks: 4 }, { modifierId: 'accurate', ranks: 1 }];
    expect(price(applied, 5)).toBe(price(expected, 5));
  });

  it('derives structured Senses ranks from fixed and scalable purchases', () => {
    const original: ICharacterPower = { id: 'senses', name: 'Senses', notes: '', alternateEffects: [], components: [{ id: 'sense', effectId: 'senses', ranks: 3, modifiers: [], senseTraits: [{ id: 'extended', ranks: 1, senseType: 'visual' }, { id: 'darkvision', ranks: 2 }] }] };
    const model = createPersonalModel(original), component = model.power.components[0];
    model.policies[component.id].mode = 'scalable'; model.policies[component.id].senseRanks['0'] = 1;
    expect(instantiatePersonalModel(model, { [component.id]: 5 }).components[0]).toMatchObject({ ranks: 7, senseTraits: [{ ranks: 5 }, { ranks: 2 }] });
  });

  it('duplicates policies with fresh component/application identities and keeps edits isolated', () => {
    const model = createPersonalModel(power()), component = model.power.components[0];
    model.policies[component.id].mode = 'scalable'; model.policies[component.id].modifierRanks[component.modifiers[1].instanceId!] = 2;
    const before = structuredClone(model), copy = duplicatePersonalModel(model);
    const copied = copy.power.components[0];
    expect(copy.policies[copied.id].modifierRanks).toEqual({ [copied.modifiers[1].instanceId!]: 2 });
    expect(price(instantiatePersonalModel(copy, { [copied.id]: 5 }))).toBe(price(instantiatePersonalModel(model, { [component.id]: 5 })));
    copy.power.notes = 'changed';
    expect(model).toEqual(before);
  });

  it('prices Strength-based extras with the destination Strength, without storing a price', () => {
    const source: ICharacterPower = { id: 'strength', name: 'Blade', notes: '', alternateEffects: [], components: [{ id: 'c', effectId: 'damage', ranks: 2, fieldValues: { damageBasis: 'strength-based' }, modifiers: [{ modifierId: 'multiattack', ranks: 1 }] }] };
    const applied = instantiatePersonalModel(createPersonalModel(source));
    expect(price(applied, 0)).toBe(4); expect(price(applied, 5)).toBe(9);
  });

  it('includes Strength bought by the model itself in preview and saved prices', () => {
    const source: ICharacterPower = { id: 'p', name: 'Muscle strike', notes: '', alternateEffects: [], components: [
      { id: 'str', effectId: 'enhanced-trait', ranks: 4, modifiers: [], enhancedTarget: { kind: 'ability', key: 'str' } },
      { id: 'dmg', effectId: 'damage', ranks: 2, modifiers: [{ modifierId: 'multiattack', ranks: 1 }], fieldValues: { damageBasis: 'strength-based' } },
    ] };
    const character = createDefaultCharacter(); character.abilities.str = 3;
    const applied = instantiatePersonalModel(createPersonalModel(source));
    const previewContext = { ...character, powers: [...character.powers, applied] };
    const strength = getPricingStrength(previewContext);
    expect(strength).toBe(7); expect(price(applied, strength)).toBe(19);
    expect(character.powers).toEqual([]);
  });

  it('replaces draft Strength before pricing and retains Strength in surviving siblings', () => {
    const character = createDefaultCharacter(); character.abilities.str = 3;
    const parent: ICharacterPower = { id: 'p', name: 'Original', notes: '', alternateEffects: [], components: [{ id: 'str', effectId: 'enhanced-trait', ranks: 5, enhancedTarget: { kind: 'ability', key: 'str' }, modifiers: [] }] };
    character.powers = [parent];
    const recipe: ICharacterPower = { id: 'recipe', name: 'Replacement', notes: '', alternateEffects: [], components: [{ id: 'new-str', effectId: 'enhanced-trait', ranks: 4, enhancedTarget: { kind: 'ability', key: 'str' }, modifiers: [] }, { id: 'dmg', effectId: 'damage', ranks: 2, fieldValues: { damageBasis: 'strength-based' }, modifiers: [{ modifierId: 'multiattack', ranks: 1 }] }] };
    const target = { kind: 'component' as const, componentId: 'str' };
    expect(price(recipe, getLibraryRecipeStrength(character, parent, recipe, target))).toBe(19);
    parent.components.push({ id: 'sibling', effectId: 'enhanced-trait', ranks: 2, enhancedTarget: { kind: 'ability', key: 'str' }, modifiers: [] });
    const strength = getLibraryRecipeStrength(character, parent, recipe, target);
    expect(price(recipe, strength)).toBe(21);
    expect(price(applyPowerTemplate(parent, recipe, target), strength)).toBe(25);
    expect(parent.components[0].ranks).toBe(5);
  });

  it('supports modifier-only scalable purchases without inventing base ranks', () => {
    const model = createPersonalModel({ id: 'p', name: 'Extra', notes: '', alternateEffects: [], components: [{ id: 'c', effectId: 'damage', ranks: 0, modifiers: [{ modifierId: 'penetrating', ranks: 2 }] }] });
    const component = model.power.components[0]; const policy = model.policies[component.id];
    policy.mode = 'scalable'; policy.multiplier = 0; policy.modifierRanks[component.modifiers[0].instanceId!] = 1;
    const copy = instantiatePersonalModel(model, { [component.id]: 8 });
    expect(copy.components[0].ranks).toBe(0); expect(price(copy)).toBe(8);
    expect(parsePersonalLibrary(serializePersonalLibrary([model]))).toEqual([model]);
  });

  it('clears sense scaling when purchases change and policies when an effect is replaced', () => {
    const model = createPersonalModel({ id: 'p', name: 'Senses', notes: '', alternateEffects: [], components: [{ id: 'c', effectId: 'senses', ranks: 3, modifiers: [], senseTraits: [{ id: 'extended', ranks: 1, senseType: 'visual' }, { id: 'darkvision', ranks: 2 }] }] });
    const id = model.power.components[0].id; model.policies[id].mode = 'scalable'; model.policies[id].senseRanks['0'] = 2;
    const changed = structuredClone(model.power); changed.components[0].senseTraits!.reverse();
    expect(updateModelComposition(model, changed).policies[id].senseRanks).toEqual({});
    changed.components[0] = { id, effectId: 'flight', ranks: 3, modifiers: [] };
    expect(updateModelComposition(model, changed).policies[id].mode).toBe('fixed');
    expect(model.policies[id].senseRanks).toEqual({ '0': 2 });
  });

  it('scales alternate components independently and retains array pricing', () => {
    const model = createPersonalModel(power()), alternate = model.power.alternateEffects[0].components[0];
    model.policies[alternate.id].mode = 'scalable';
    const applied = instantiatePersonalModel(model, { [alternate.id]: 8 });
    const expected = power(); expected.alternateEffects[0].components[0].ranks = 8;
    expect(applied.components[0].ranks).toBe(6); expect(price(applied)).toBe(price(expected));
  });

  it('allows default non-removable models on alternate targets and protects global configurations', () => {
    const parent = power(), recipe = instantiatePersonalModel(createPersonalModel({ ...power(), activation: undefined, removable: 'none', baseDynamic: false, alternateEffects: [] }));
    const target = { kind: 'alternate' as const, alternateId: 'ae' };
    expect(canApplyPowerTemplate(parent, recipe, target)).toBe(true);
    expect(applyPowerTemplate(parent, recipe, target).alternateEffects[0].dynamic).toBe(true);
    for (const global of [{ activation: 'move' as const }, { removable: 'removable' as const }, { baseDynamic: true }]) expect(canApplyPowerTemplate(parent, { ...recipe, ...global }, target)).toBe(false);
  });

  it('keeps policies for surviving components and removes stale applications after composition edits', () => {
    const model = createPersonalModel(power()), component = model.power.components[0];
    model.policies[component.id].mode = 'scalable'; model.policies[component.id].modifierRanks[component.modifiers[0].instanceId!] = 1;
    component.modifiers.shift();
    const policies = reconcileRankPolicies(model.power, model.policies);
    expect(policies[component.id].mode).toBe('scalable'); expect(policies[component.id].modifierRanks).toEqual({});
  });

  it.each([0, -1, 1.5, Infinity, Number.MAX_SAFE_INTEGER + 1])('rejects unsafe rank choices: %s', value => {
    const model = createPersonalModel(power()), component = model.power.components[0]; model.policies[component.id].mode = 'scalable';
    expect(() => instantiatePersonalModel(model, { [component.id]: value })).toThrow('personalLibrary.invalidRank');
  });
});

describe('Personal library files and storage', () => {
  it('round-trips model-only metadata and rejects broken policies/identities and unknown versions', () => {
    const model = createPersonalModel(power());
    expect(parsePersonalLibrary(serializePersonalLibrary([model]))).toEqual([model]);
    const bad = structuredClone(model); bad.policies['missing'] = bad.policies[bad.power.components[0].id];
    expect(() => serializePersonalLibrary([bad])).toThrow();
    expect(() => serializePersonalLibrary([model, model])).toThrow();
    const raw = JSON.parse(serializePersonalLibrary([model])); raw.version = 2;
    expect(() => parsePersonalLibrary(JSON.stringify(raw))).toThrow();
  });

  it('handles import collisions as copies, replacements or preserved originals', () => {
    const model = createPersonalModel(power()), incoming = structuredClone(model); incoming.description = 'Imported';
    expect(prepareModelImport([model], [incoming], 'keep')).toEqual([]);
    expect(prepareModelImport([model], [incoming], 'replace')).toEqual([incoming]);
    const copy = prepareModelImport([model], [incoming], 'copy')[0];
    expect(copy.id).not.toBe(model.id); expect(copy.power.id).not.toBe(model.power.id);
    expect(copy.description).toBe('Imported'); expect(model.description).toBe('');
    expect(serializePersonalLibrary([model, copy])).toContain('Imported');
  });

  it('sorts names for the current language and searches without accents', () => {
    const models = ['Zulu', 'Água', 'Bola'].map(name => createPersonalModel({ ...power(), name }));
    expect(searchPersonalModels(models, '', 'pt-BR').map(model => model.name)).toEqual(['Água', 'Bola', 'Zulu']);
    expect(searchPersonalModels(models, 'agua', 'en').map(model => model.name)).toEqual(['Água']);
  });

  it('protects stored source on unreadable data, write failures and concurrent changes', async () => {
    const values = new Map<string, string>();
    let fail = false;
    vi.stubGlobal('localStorage', { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { if (fail) throw new Error('quota'); values.set(key, value); } });
    try {
      const { usePersonalLibraryStore } = await import('../features/power-library/personalLibraryStore');
      const store = () => usePersonalLibraryStore.getState(); store().reload();
      const model = createPersonalModel(power()); expect(store().put(model)).toBe(true);
      const saved = values.get(PERSONAL_LIBRARY_KEY);
      const changed = { ...model, description: 'edited' };
      expect(store().put(changed, { ...model, description: 'stale' })).toBe(false);
      expect(values.get(PERSONAL_LIBRARY_KEY)).toBe(saved);
      expect(store().put(changed, model)).toBe(true);
      expect(store().put(model, model)).toBe(false);
      expect(store().put(model, changed)).toBe(true);
      const invalid = createPersonalModel(power()); invalid.power.components[0].effectId = 'unknown-effect';
      expect(store().merge([duplicatePersonalModel(model), invalid], 'keep')).toBe(false);
      expect(values.get(PERSONAL_LIBRARY_KEY)).toBe(saved); expect(store().models).toEqual([model]);
      fail = true; expect(store().remove(model)).toBe(false); expect(values.get(PERSONAL_LIBRARY_KEY)).toBe(saved); expect(store().models).toEqual([model]);
      fail = false; values.set(PERSONAL_LIBRARY_KEY, 'unreadable');
      expect(store().remove(model)).toBe(false); expect(values.get(PERSONAL_LIBRARY_KEY)).toBe('unreadable');
      store().reload(); expect(store().error).toBe('personalLibrary.readError'); expect(store().put(model)).toBe(false);
      expect(values.get(PERSONAL_LIBRARY_KEY)).toBe('unreadable');
      values.set(PERSONAL_LIBRARY_KEY, ''); store().reload();
      expect(store().error).toBe('personalLibrary.readError'); expect(store().put(model)).toBe(false);
      expect(values.get(PERSONAL_LIBRARY_KEY)).toBe('');
    } finally { vi.unstubAllGlobals(); }
  });
});

describe('Library shortcuts preserve the source and protect stale edits', () => {
  const tab = (): CharacterTab => ({ id: 'tab', label: 'Hero', lastModified: 0, isDirty: false, character: createDefaultCharacter({ powers: [power()] }) });
  it('opens an isolated draft for the chosen tab and refuses destinations that closed', () => {
    const first = tab(), second = { ...tab(), id: 'second' }; const draft = instantiatePersonalModel(createPersonalModel(power()));
    const before = structuredClone([first, second]);
    const edit = resolveLibraryPowerDestination([first, second], second.id, draft)!;
    expect(edit.tabId).toBe(second.id); expect(edit.original).toBeUndefined();
    edit.draft.components[0].ranks = 99;
    expect(draft.components[0].ranks).toBe(6); expect([first, second]).toEqual(before);
    expect(resolveLibraryPowerDestination([first], second.id, draft)).toBeNull();
  });
  it('shows neutral costs before choosing and prices each destination without changing its data', () => {
    const recipe: ICharacterPower = { id: 'p', name: 'Strike', notes: '', alternateEffects: [], components: [{ id: 'd', effectId: 'damage', ranks: 2, fieldValues: { damageBasis: 'strength-based' }, modifiers: [{ modifierId: 'multiattack', ranks: 1 }] }] };
    const first = createDefaultCharacter(), second = createDefaultCharacter(); second.abilities.str = 5;
    const before = structuredClone([first, second]);
    expect(price(recipe, getLibraryDestinationStrength(recipe))).toBe(4);
    expect(price(recipe, getLibraryDestinationStrength(recipe, first))).toBe(4);
    expect(price(recipe, getLibraryDestinationStrength(recipe, second))).toBe(9);
    expect([first, second]).toEqual(before);
  });
  it('updates the original power while preserving unrelated character changes', () => {
    const source = tab(); const original = structuredClone(source.character.powers[0]);
    source.character.header.name = 'Updated hero';
    const result = resolveLibraryPowerSave([source], { tabId: source.id, draft: original, original }, { ...original, notes: 'Edited power' });
    expect(result?.header.name).toBe('Updated hero'); expect(result?.powers[0].notes).toBe('Edited power');
    expect(source.character.powers[0].notes).toBe('Keep notes');
  });
  it('rejects deleted, changed or wrong-identity targets rather than adding a second power', () => {
    const source = tab(); const original = structuredClone(source.character.powers[0]); const edit = { tabId: source.id, draft: original, original };
    expect(resolveLibraryPowerSave([], edit, original)).toBeNull();
    expect(resolveLibraryPowerSave([{ ...source, character: { ...source.character, powers: [] } }], edit, original)).toBeNull();
    source.character.powers[0].notes = 'Concurrent change';
    expect(resolveLibraryPowerSave([source], edit, original)).toBeNull();
    source.character.powers[0] = original;
    expect(resolveLibraryPowerSave([source], edit, { ...original, id: 'other' })).toBeNull();
  });
  it('adds an independent copy only to the selected character and does not change models', () => {
    const source = tab(); const model = createPersonalModel(power()); const before = structuredClone(model); const draft = instantiatePersonalModel(model);
    const result = resolveLibraryPowerSave([source], { tabId: source.id, draft }, draft);
    expect(result?.powers).toHaveLength(2); expect(source.character.powers).toHaveLength(1); expect(model).toEqual(before);
    expect(resolveLibraryPowerSave([source], { tabId: source.id, draft: power() }, power())).toBeNull();
  });
});
