import { describe, expect, it, vi } from 'vitest';
import type { ICharacterPower } from '../entities/types';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';
import { calculatePowerPricing } from '../shared/lib/mathEngine';
import { createPersonalModel, duplicatePersonalModel, instantiatePersonalModel, parsePersonalLibrary, powerComponents, reconcileRankPolicies, serializePersonalLibrary, PERSONAL_LIBRARY_KEY } from '../features/power-library/personalPowerModel';

const power = (): ICharacterPower => ({ id: 'power', name: 'Custom power', notes: 'Keep notes', descriptors: ['Magic'],
  components: [{ id: 'damage', effectId: 'damage', ranks: 6, modifiers: [{ modifierId: 'accurate', ranks: 2 }, { modifierId: 'accurate', ranks: 1 }], fieldValues: { damage_basis: 'strength' } },
    { id: 'immunity', effectId: 'immunity', ranks: 2, modifiers: [] }],
  alternateEffects: [{ id: 'ae', name: 'Flight', notes: 'Alternate notes', dynamic: true, components: [{ id: 'flight', effectId: 'flight', ranks: 3, modifiers: [] }] }], baseDynamic: true, activation: 'move', removable: 'removable' });
const price = (p: ICharacterPower, strength = 0) => calculatePowerPricing(p, POWER_DEFS, MODIFIER_DEFS, strength).total;

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
    expect(price(applied, 5)).toBe(calculatePowerPricing(applied, POWER_DEFS, MODIFIER_DEFS, 5).total);
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

  it('protects stored source on unreadable data, write failures and concurrent changes', async () => {
    const values = new Map<string, string>();
    let fail = false;
    vi.stubGlobal('localStorage', { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { if (fail) throw new Error('quota'); values.set(key, value); } });
    try {
      const { usePersonalLibraryStore } = await import('../features/power-library/personalLibraryStore');
      const store = () => usePersonalLibraryStore.getState(); store().reload();
      const model = createPersonalModel(power()); expect(store().put(model)).toBe(true);
      const saved = values.get(PERSONAL_LIBRARY_KEY);
      fail = true; expect(store().remove(model)).toBe(false); expect(values.get(PERSONAL_LIBRARY_KEY)).toBe(saved); expect(store().models).toEqual([model]);
      fail = false; values.set(PERSONAL_LIBRARY_KEY, 'unreadable');
      expect(store().remove(model)).toBe(false); expect(values.get(PERSONAL_LIBRARY_KEY)).toBe('unreadable');
      store().reload(); expect(store().error).toBe('personalLibrary.readError'); expect(store().put(model)).toBe(false);
      expect(values.get(PERSONAL_LIBRARY_KEY)).toBe('unreadable');
    } finally { vi.unstubAllGlobals(); }
  });
});
