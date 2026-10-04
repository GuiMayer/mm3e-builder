import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { ICharacterPower, IResource, IVehicleResource } from '../entities/types';
import { projectPowerBudget, powerBudgetSignature } from '../features/power-builder/budgetProjection';
import { replaceCharacterPower, replaceResourcePower } from '../shared/lib/powerEditing';
import { calculateCharacterPointSummary } from '../shared/lib/pointSummary';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';

const damage = (ranks: number): ICharacterPower => ({ id: 'power', name: 'Beam', notes: '', alternateEffects: [], components: [{ id: 'component', effectId: 'damage', ranks, modifiers: [] }] });
const base = { id: 'resource', name: 'Item', notes: '', createdAt: '', updatedAt: '' };
const gadget: IResource = { ...base, type: 'gadget', costMode: 'device', power: { ...damage(10), removable: 'removable' } };
const link = { id: 'link', resourceId: base.id, isFree: false };

describe('Projected budgets use the save transformation without mutations', () => {
  it('replaces a 10 PP purchase by 15 PP once and preserves the input', () => {
    const character = createDefaultCharacter({ abilities: { str: 65, sta: 0, agl: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 }, powers: [damage(10)] });
    const original = JSON.stringify(character);
    const projection = projectPowerBudget(character, [], { kind: 'power', powerId: 'power' }, damage(15))!;
    expect(projection).toMatchObject({ oldCost: 10, newCost: 15, difference: 5, after: { totalSpent: 145, remaining: 5 } });
    expect(JSON.stringify(character)).toBe(original);
    const saved = replaceCharacterPower(character, { kind: 'power', powerId: 'power' }, damage(15))!;
    expect(projection.after).toEqual(calculateCharacterPointSummary(saved, [], POWER_DEFS, MODIFIER_DEFS));
  });
  it('adds new purchases and uses the fixed campaign budget rather than current PL', () => {
    const character = createDefaultCharacter({ campaignMode: true, campaign: { version: 1, initialPP: 100, initialPowerLevel: 8 }, ppLog: [{ id: 'award', date: '2026-10-04', amount: 5, note: '' }] });
    expect(projectPowerBudget(character, [], { kind: 'power' }, damage(10))).toMatchObject({ oldCost: 0, after: { totalAvailable: 105, remaining: 95 } });
  });
  it('uses EP and strips Removable on legacy equipment save', () => {
    const character = createDefaultCharacter({ equipment: [damage(5)], advantages: [{ advantageId: 'equipment', ranks: 2 }] });
    const draft = { ...damage(10), removable: 'easily_removable' as const };
    expect(projectPowerBudget(character, [], { kind: 'equipment', powerId: 'power' }, draft)).toMatchObject({ unit: 'EP', oldCost: 5, newCost: 10, after: { totalEPUsed: 10, equipmentEPLimit: 10, powersCost: 0 } });
    expect(replaceCharacterPower(character, { kind: 'equipment', powerId: 'power' }, draft)?.equipment?.[0].removable).toBe('none');
  });
  it('charges linked devices in PP once and keeps free items free', () => {
    const character = createDefaultCharacter({ resourceLinks: [link] });
    const target = { kind: 'resource' as const, target: { resourceId: base.id, kind: 'power' as const, powerId: 'power' } };
    const draft = { ...damage(15), removable: 'removable' as const };
    expect(projectPowerBudget(character, [gadget], target, draft)).toMatchObject({ oldCost: 8, newCost: 12, after: { powersCost: 12, totalEPUsed: 0 }, linked: true });
    expect(projectPowerBudget({ ...character, resourceLinks: [{ ...link, isFree: true }] }, [gadget], target, draft)?.after.totalSpent).toBe(0);
    expect(character.powers).toEqual([]);
  });
  it('does not assign unlinked Resources or change fixed contributions', () => {
    const gear: IResource = { ...base, type: 'gear', power: damage(10) };
    const target = { kind: 'resource' as const, target: { resourceId: base.id, kind: 'power' as const, powerId: 'power' } };
    expect(projectPowerBudget(createDefaultCharacter(), [gear], target, damage(20))).toMatchObject({ linked: false, newCost: 20, after: { totalEPUsed: 0 } });
    expect(projectPowerBudget(createDefaultCharacter({ resourceLinks: [{ ...link, contributionEP: 3 }] }), [gear], target, damage(20))?.after.totalEPUsed).toBe(3);
  });
  it('recalculates an alternate group when the edited item stops being its maximum', () => {
    const gear: IResource = { ...base, type: 'gear', power: damage(10) };
    const other: IResource = { ...gear, id: 'other', power: damage(8) };
    const character = createDefaultCharacter({ resourceLinks: [link, { ...link, id: 'other-link', resourceId: 'other' }].map(value => ({ ...value, alternateSetId: 'array' })) });
    const projection = projectPowerBudget(character, [gear, other], { kind: 'resource', target: { resourceId: base.id, kind: 'power', powerId: 'power' } }, damage(5))!;
    expect(projection.before.totalEPUsed).toBe(11); expect(projection.after.totalEPUsed).toBe(9);
    expect(projection.difference).toBe(-5); // Purchase delta differs from charged group delta.
  });
  it('replaces legacy movement and preserves other systems/traits', () => {
    const vehicle: IVehicleResource = { ...base, type: 'vehicle', size: 'huge', strength: 8, defense: -2, toughness: 9, speed: 7, features: [], systems: [damage(3)] };
    const draft = { ...damage(7), components: [{ ...damage(7).components[0], effectId: 'flight' }] };
    const target = { resourceId: base.id, kind: 'movement' as const };
    const next = replaceResourcePower(vehicle, target, draft)! as IVehicleResource;
    expect(next.systems).toBe(vehicle.systems); expect(next.speed).toBe(7); expect(next.movement).toBe(draft);
    const projection = projectPowerBudget(createDefaultCharacter({ resourceLinks: [link] }), [vehicle], { kind: 'resource', target }, draft)!;
    expect(projection.before.totalEPUsed).toBe(12); expect(projection.after.totalEPUsed).toBe(19);
    expect(vehicle.movement).toBeUndefined();
  });
  it('keeps headquarters feature charge separate from underlying effect PP', () => {
    const headquarters: IResource = { ...base, type: 'headquarters', size: 'small', toughness: 6, powerLevel: 10, features: [], effects: [damage(5)] };
    const projection = projectPowerBudget(createDefaultCharacter({ resourceLinks: [link] }), [headquarters], { kind: 'resource', target: { resourceId: base.id, kind: 'headquarters-effect', powerId: 'power' } }, damage(20))!;
    expect(projection).toMatchObject({ oldCost: 1, newCost: 1, difference: 0, after: { totalEPUsed: 1 } });
  });
  it('rejects stale or mismatched destinations instead of duplicating purchases', () => {
    expect(replaceCharacterPower(createDefaultCharacter(), { kind: 'power', powerId: 'missing' }, damage(1))).toBeNull();
    expect(replaceResourcePower(gadget, { resourceId: base.id, kind: 'system' }, damage(1))).toBeNull();
    expect(projectPowerBudget(createDefaultCharacter(), [gadget], { kind: 'resource', target: { resourceId: 'missing', kind: 'power' } }, damage(1))).toBeNull();
  });
  it('ignores name/note/instance edits for projection memoization', () => {
    const power = damage(10);
    power.components[0].modifiers = [{ modifierId: 'limited', ranks: 1, instanceId: 'first', options: { note: 'Old', trigger: 'hit' } }];
    const signature = powerBudgetSignature(power);
    const copy = structuredClone(power); copy.name = 'Renamed'; copy.notes = 'Long note'; copy.components[0].modifiers[0].instanceId = 'second'; copy.components[0].modifiers[0].options!.note = 'New';
    expect(powerBudgetSignature(copy)).toBe(signature);
    copy.components[0].ranks++; expect(powerBudgetSignature(copy)).not.toBe(signature);
  });
});
