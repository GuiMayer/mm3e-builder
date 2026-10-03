import { describe, expect, it } from 'vitest';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../entities/gameDataLoaders';
import type { ICharacterPower, ICharacterPowerComponent } from '../entities/types';
import { CharacterPowerSchema } from '../entities/schemas';
import { calculatePowerPricing } from '../shared/lib/mathEngine';
import { migratePower } from '../shared/lib/powerMigration';
import { DEFAULT_VALIDATION_RULES } from '../shared/lib/validationRules';
import { addComponentModifier } from '../features/power-builder/modifierApplication';
import { prepareModifierInstances, modifierInstanceKey, updateComponentModifier, removeComponentModifier } from '../features/power-builder/modifierInstances';
import { getBlockingPowerSaveIssues } from '../features/power-builder/powerSavePolicy';
import { createPowerDraft } from '../features/power-builder/powerBuilderModel';

const effect = POWER_DEFS.find(item => item.id === 'damage')!;
const component = (): ICharacterPowerComponent => ({ id: 'base', effectId: 'damage', ranks: 10, modifiers: [
  { modifierId: 'increased_range', ranks: 1, isPowerSpecific: false },
  { modifierId: 'limited', ranks: 1, affectedRanks: 10, options: { note: 'Only at night' }, isPowerSpecific: false },
  { modifierId: 'limited', ranks: 1, affectedRanks: 4, options: { note: 'Only against machines' }, isPowerSpecific: false },
] });
const power = (): ICharacterPower => ({ id: 'power', name: 'Independent limits', notes: '', components: [component(), { ...component(), id: 'linked' }], alternateEffects: [{ id: 'ae', name: 'Alternate', notes: '', dynamic: false, components: [{ ...component(), id: 'ae-base' }, { ...component(), id: 'ae-linked' }] }] });
const price = (value: ICharacterPower) => calculatePowerPricing(value, POWER_DEFS, MODIFIER_DEFS).total;

describe('independent modifier applications', () => {
  it('opens legacy main/linked/alternate entries without changing their fields or prices and leaves the saved power intact', () => {
    const old = power();
    const before = JSON.stringify(old);
    const draft = createPowerDraft(old);
    const all = [...draft.components, ...draft.alternateEffects.flatMap(alternate => alternate.components)];
    expect(new Set(all.flatMap(item => item.modifiers.map(modifier => modifier.instanceId))).size).toBe(12);
    const withoutIds = JSON.parse(JSON.stringify(draft), (key, value) => key === 'instanceId' ? undefined : value);
    expect(withoutIds).toEqual(old);
    expect(price(draft)).toBe(price(old));
    expect(JSON.stringify(old)).toBe(before);
    expect(prepareModifierInstances(draft)).toEqual(draft);
  });

  it('repairs colliding imported instance IDs in the draft without merging or dropping purchases', () => {
    const old = power();
    old.components[0].modifiers.forEach(modifier => { modifier.instanceId = 'collision'; });
    const draft = prepareModifierInstances(old);
    expect(new Set(draft.components[0].modifiers.map(modifier => modifier.instanceId)).size).toBe(3);
    expect(draft.components[0].modifiers[0].instanceId).toBe('collision');
    expect(price(draft)).toBe(price(old));
  });

  it('updates different Limited purchases independently and prices affected ranks through the normal engine', () => {
    const original = prepareModifierInstances(power());
    const first = original.components[0].modifiers[1];
    const second = original.components[0].modifiers[2];
    const updated = updateComponentModifier(original.components[0], second.instanceId!, { ranks: 2, options: { note: 'Changed second condition', affectedRanks: 6 } });
    expect(updated.modifiers[1]).toEqual(first);
    expect(updated.modifiers[2]).toMatchObject({ ranks: 2, affectedRanks: 6, options: { note: 'Changed second condition', affectedRanks: 6 } });
    expect(price({ ...original, components: [updated], alternateEffects: [] })).toBe(6);
    expect(price({ ...original, components: [original.components[0]], alternateEffects: [] })).toBe(8);
    const removed = removeComponentModifier(updated, first.instanceId!);
    expect(removed.modifiers).toEqual([updated.modifiers[0], updated.modifiers[2]]);
    expect(original.components[0].modifiers[2]).toEqual(second);
  });

  it('preserves independent area options and purchases when editing/removing either application', () => {
    let value: ICharacterPowerComponent = { id: 'area', effectId: 'damage', ranks: 10, modifiers: [] };
    value = addComponentModifier(addComponentModifier(value, effect, MODIFIER_DEFS, 'area'), effect, MODIFIER_DEFS, 'area');
    value = updateComponentModifier(value, value.modifiers[0].instanceId!, { option: 'Burst', affectedRanks: 10 });
    const updated = updateComponentModifier(value, value.modifiers[1].instanceId!, { option: 'Cone', affectedRanks: 5 });
    expect(updated.modifiers[0]).toEqual(value.modifiers[0]);
    expect(updated.modifiers[1].option).toBe('Cone');
    expect(price({ ...power(), components: [updated], alternateEffects: [] })).toBe(25);
    expect(removeComponentModifier(updated, updated.modifiers[1].instanceId!).modifiers).toEqual([updated.modifiers[0]]);
  });

  it('adds non-ranked and specific duplicates, retains warnings, and only blocks foreign power-specific rules', () => {
    let value: ICharacterPowerComponent = { id: 'fixed', effectId: 'damage', ranks: 10, modifiers: [] };
    value = addComponentModifier(addComponentModifier(value, effect, MODIFIER_DEFS, 'incurable'), effect, MODIFIER_DEFS, 'incurable');
    expect(value.modifiers).toHaveLength(2);
    const result = { ...power(), components: [value], alternateEffects: [] };
    expect(price(result)).toBe(12);
    const context = { powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS, skillDefs: SKILL_DEFS, advantageDefs: ADVANTAGE_DEFS };
    expect(getBlockingPowerSaveIssues(result, DEFAULT_VALIDATION_RULES, context)).toEqual([]);
    const summon = POWER_DEFS.find(item => item.id === 'summon')!;
    const base = { ...value, effectId: 'summon', modifiers: [] };
    const repeated = addComponentModifier(addComponentModifier(base, summon, MODIFIER_DEFS, 'heroic', true), summon, MODIFIER_DEFS, 'heroic', true);
    expect(repeated.modifiers).toHaveLength(2);
    expect(addComponentModifier(value, effect, MODIFIER_DEFS, 'heroic', true)).toBe(value);
  });

  it('round-trips applications, options and identities through JSON/schema/import without merging entries', () => {
    const value = prepareModifierInstances(power());
    const restored = migratePower(CharacterPowerSchema.parse(JSON.parse(JSON.stringify(value))));
    expect(restored).toEqual(value);
    expect(price(restored)).toBe(price(value));
    expect(CharacterPowerSchema.parse(power())).toEqual(power());
  });

  it('safely targets an old entry by its local position when IDs have not yet been prepared', () => {
    const value = component();
    const key = modifierInstanceKey(value.modifiers[2], 2);
    expect(updateComponentModifier(value, key, { option: 'Machines' }).modifiers[1]).toEqual(value.modifiers[1]);
    expect(removeComponentModifier(value, key).modifiers).toEqual(value.modifiers.slice(0, 2));
    expect(updateComponentModifier(value, 'missing', { ranks: 99 })).toEqual(value);
    expect(removeComponentModifier(value, 'missing')).toEqual(value);
  });
});
