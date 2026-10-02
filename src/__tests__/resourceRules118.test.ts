import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { ICharacterPower, IResource, IVehicleResource } from '../entities/types';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS } from '../entities/gameDataLoaders';
import { changeVehicleSize, getResourceCost, getLinkedResourceCharges } from '../shared/lib/resourceCalculations';
import { calculateCharacterPointSummary } from '../shared/lib/pointSummary';
import { buildTargetedEffectProfiles } from '../shared/lib/offenseSummary';
import { deriveCharacterDefenses } from '../shared/lib/derivedDefenses';
import { getResourcePowerWarnings } from '../shared/lib/resourceWarnings';

const base = { id: '00000000-0000-4000-8000-000000000001', name: 'Resource', notes: '', createdAt: '', updatedAt: '' };
const power: ICharacterPower = { id: 'power', name: 'Cannon', notes: '', alternateEffects: [], components: [{ id: 'component', effectId: 'damage', ranks: 5, modifiers: [{ modifierId: 'increased_range', ranks: 1 }], fieldValues: { damageBasis: 'strength-based' } }] };
const vehicle: IVehicleResource = { ...base, type: 'vehicle', size: 'huge', strength: 8, toughness: 9, defense: -2, speed: 0, features: [], systems: [] };
const character = createDefaultCharacter({ resourceLinks: [{ id: 'link', resourceId: base.id, isFree: false }] });

describe('Resources official rules and compatible models', () => {
  it('counts a Removable device as 8 PP, never as EP, without duplicating its power in the character', () => {
    const device: IResource = { ...base, type: 'gadget', costMode: 'device', power: { ...power, removable: 'removable', components: [{ ...power.components[0], fieldValues: {} }] } };
    expect(getResourceCost(device)).toEqual({ total: 8, unit: 'PP' });
    const summary = calculateCharacterPointSummary(character, [device], POWER_DEFS, MODIFIER_DEFS);
    expect(summary.resourcePPUsed).toBe(8); expect(summary.totalSpent).toBe(8); expect(summary.totalEPUsed).toBe(0);
    expect(character.powers).toEqual([]);
    expect(calculateCharacterPointSummary({ ...character, resourceLinks: [{ ...character.resourceLinks![0], isFree: true }] }, [device], POWER_DEFS, MODIFIER_DEFS).resourcePPUsed).toBe(0);
  });
  it('retains legacy equipment cost until ambiguous acquisition is reviewed', () => {
    expect(getResourceCost({ ...base, type: 'gadget', power })).toEqual({ total: 10, unit: 'EP' });
  });
  it('prices Flight 7 at 14 EP, replacing rather than adding legacy speed', () => {
    const movement = { ...power, components: [{ ...power.components[0], effectId: 'flight', ranks: 7, modifiers: [], fieldValues: {} }] };
    expect(getResourceCost({ ...vehicle, speed: 7, movement }).total).toBe(16);
    expect(getResourceCost({ ...vehicle, speed: 7 }).total).toBe(9);
  });
  it('prices and derives vehicle Strength with stable names for each system', () => {
    const resource = { ...vehicle, systems: [power] };
    expect(getResourceCost(resource).total).toBe(20);
    const profile = buildTargetedEffectProfiles(character, POWER_DEFS, SKILL_DEFS, [], MODIFIER_DEFS, undefined, [resource]).find((entry) => entry.sourceType === 'resource')!;
    expect(profile.effectRank).toBe(13); expect(profile.name).toBe('Resource — Cannon'); expect(profile.resistance).toBe('Toughness DC 28');
  });
  it('charges the most expensive alternate vehicle plus one EP per additional vehicle, independent of order', () => {
    const second = { ...vehicle, id: '00000000-0000-4000-8000-000000000002', speed: 6 };
    const first = { ...vehicle, speed: 4 };
    const owner = { ...character, resourceLinks: [first, second].map((item) => ({ id: item.id, resourceId: item.id, isFree: false, alternateSetId: 'garage' })) };
    for (const links of [owner.resourceLinks, [...owner.resourceLinks].reverse()]) {
      expect(getLinkedResourceCharges({ ...owner, resourceLinks: links }, [first, second]).reduce((sum, charge) => sum + charge.charged, 0)).toBe(9);
    }
  });
  it('keeps a shared HQ separate from alternate personal HQs', () => {
    const shared: IResource = { ...base, type: 'headquarters', size: 'awesome', toughness: 6, features: [], effects: [] };
    const personal: IResource = { ...shared, id: '00000000-0000-4000-8000-000000000002', size: 'medium' };
    const owner = { ...character, resourceLinks: [{ id: 'shared', resourceId: shared.id, isFree: false, contributionEP: 3, alternateSetId: 'bases' }, { id: 'personal', resourceId: personal.id, isFree: false, alternateSetId: 'bases' }] };
    expect(getLinkedResourceCharges(owner, [shared, personal]).map((charge) => charge.charged)).toEqual([3, 1]);
  });
  it('warns about HQ effect budgets and derives Defense System attacks from HQ PL', () => {
    const effect = { ...power, components: [{ ...power.components[0], effectId: 'healing', ranks: 30, modifiers: [], fieldValues: {} }] };
    const hq: IResource = { ...base, type: 'headquarters', size: 'small', toughness: 6, features: [], effects: [power], powerLevel: 10, effectSettings: { power: { kind: 'defense-system', target: 'resource' } } };
    expect(getResourcePowerWarnings(hq, effect, character)).toContainEqual({ key: 'resources.hq.costWarning', values: { cost: 60, limit: 20, level: 10 } });
    const profile = buildTargetedEffectProfiles(character, POWER_DEFS, SKILL_DEFS, [], MODIFIER_DEFS, undefined, [hq]).find((entry) => entry.sourceType === 'resource')!;
    expect(profile.bonusValue).toBe(10); expect(getResourceCost(hq).total).toBe(1);
  });
  it('preserves trait improvements, notes, systems and movement when changing size', () => {
    const upgraded = { ...vehicle, strength: 10, toughness: 12, defense: -1, systems: [power] };
    const changed = changeVehicleSize(upgraded, 'large');
    expect(changed).toMatchObject({ strength: 6, toughness: 10, defense: 0, systems: [power] });
    expect(changeVehicleSize(changed, 'huge')).toEqual(upgraded);
  });
  it('treats device protection as a personal power, while ordinary equipment does not stack', () => {
    const protection = (ranks: number) => ({ ...power, components: [{ ...power.components[0], effectId: 'protection', ranks, modifiers: [], fieldValues: {} }] });
    const owner = { ...character, powers: [protection(3)] };
    const resource: IResource = { ...base, type: 'gadget', costMode: 'device', power: protection(5) };
    expect(deriveCharacterDefenses(owner, POWER_DEFS, [resource]).toughnessBonus).toBe(8);
    expect(deriveCharacterDefenses(owner, POWER_DEFS, [{ ...resource, costMode: 'equipment' }]).toughnessBonus).toBe(5);
  });
});
