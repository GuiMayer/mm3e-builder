import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { ICharacterPower, IResource } from '../entities/types';
import { getTraitSourceEntries } from '../shared/lib/traitSources';
import { effectiveTraitCharacter } from '../shared/lib/traitValues';
import { powerAllocationSummary } from '../shared/lib/powerUsage';
import { calculateCharacterPointSummary } from '../shared/lib/pointSummary';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';
import { deriveCharacterDefenses } from '../shared/lib/derivedDefenses';

const power: ICharacterPower = { id: 'p', name: 'Strength', notes: '', components: [
  { id: 'str', effectId: 'enhanced-trait', ranks: 5, modifiers: [], enhancedTarget: { kind: 'ability', key: 'str' } },
], alternateEffects: [{ id: 'ae', name: 'Agility', notes: '', dynamic: false, components: [
  { id: 'agl', effectId: 'enhanced-trait', ranks: 3, modifiers: [], enhancedTarget: { kind: 'ability', key: 'agl' } },
] }] };

describe('trait source inventory', () => {
  it('keeps disabled and inactive alternate sources visible without changing values or sheet data', () => {
    const character = createDefaultCharacter({ powers: [power], powerUsage: { 'power:p': { enabled: false } } });
    const before = JSON.stringify(character);
    expect(getTraitSourceEntries(character).map(item => item.status)).toEqual(['disabled', 'alternate']);
    expect(getTraitSourceEntries(character, [], { kind: 'ability', key: 'str' })).toHaveLength(1);
    expect(effectiveTraitCharacter(character).abilities.str).toBe(0);
    expect(JSON.stringify(character)).toBe(before);
  });
  it('switches an array without inventing independent controls for linked components', () => {
    const character = createDefaultCharacter({ powers: [power], powerUsage: { 'power:p': { branchId: 'ae' } } });
    expect(getTraitSourceEntries(character).map(item => [item.status, item.ranks])).toEqual([['alternate', 0], ['active', 3]]);
  });
  it('reports partial and zero dynamic allocations', () => {
    const character = createDefaultCharacter({ powers: [{ ...power, baseDynamic: true, alternateEffects: power.alternateEffects.map(item => ({ ...item, dynamic: true })) }], powerUsage: { 'power:p': { allocations: { str: 2, agl: 0 } } } });
    expect(getTraitSourceEntries(character).map(item => [item.status, item.ranks])).toEqual([['active', 2], ['unallocated', 0]]);
  });
  it('recognizes permanent components in a disabled mixed source', () => {
    const permanent = { ...power, components: [{ ...power.components[0], modifiers: [{ modifierId: 'permanent_enhanced_trait', ranks: 1, isPowerSpecific: true }] }] };
    expect(getTraitSourceEntries(createDefaultCharacter({ powers: [permanent], powerUsage: { 'power:p': { enabled: false } } }))[0].status).toBe('active');
  });
  it('preserves unbound legacy powers and inventories Protection for Toughness', () => {
    const legacy = { ...power, components: [{ ...power.components[0], enhancedTarget: undefined }] };
    const protection: ICharacterPower = { id: 'armor', name: 'Armor', notes: '', alternateEffects: [], components: [{ id: 'armor-c', effectId: 'protection', ranks: 4, modifiers: [] }] };
    const character = createDefaultCharacter({ powers: [legacy, protection] });
    expect(getTraitSourceEntries(character)[0].status).toBe('unbound');
    expect(getTraitSourceEntries(character, [], { kind: 'defense', key: 'toughness' })[0].source.power.id).toBe('armor');
    expect(character.powers[0].components[0].enhancedTarget).toBeUndefined();
  });
  it('explains absent targets and stronger equipment without accumulating it', () => {
    expect(getTraitSourceEntries(createDefaultCharacter({ powers: [power], absentAbilities: ['str'] }))[0].status).toBe('absent');
    const gear = { ...power, id: 'gear', components: [{ ...power.components[0], id: 'gear-c', ranks: 7 }], alternateEffects: [] };
    const character = createDefaultCharacter({ powers: [power], equipment: [gear] });
    expect(getTraitSourceEntries(character, [], { kind: 'ability', key: 'str' }).map(item => item.status)).toEqual(['superseded', 'active']);
    expect(effectiveTraitCharacter(character).abilities.str).toBe(7);
  });
  it('requires an explicit recipient for base resources and preserves shared source data', () => {
    const resource: IResource = { id: 'base', type: 'headquarters', name: 'Base', notes: '', createdAt: '', updatedAt: '', size: 'medium', toughness: 0, features: [], effects: [power] };
    const character = createDefaultCharacter({ resourceLinks: [{ id: 'link', resourceId: 'base', isFree: true }] });
    const before = JSON.stringify(resource);
    expect(getTraitSourceEntries(character, [resource])[0].status).toBe('recipient');
    const applied = { ...character, powerUsage: { 'resource:base:p': { recipient: 'character' as const } } };
    expect(getTraitSourceEntries(applied, [resource])[0].status).toBe('active');
    expect(effectiveTraitCharacter(applied, [resource]).abilities.str).toBe(5);
    expect(JSON.stringify(resource)).toBe(before);
  });
  it('keeps invalid selections visible and recovers the inventory when the saved state changes', () => {
    const character = createDefaultCharacter({ powers: [power], powerUsage: { 'power:p': { branchId: 'deleted' } } });
    expect(getTraitSourceEntries(character).map(item => item.status)).toEqual(['invalid', 'invalid']);
    character.powerUsage!['power:p'] = { enabled: false };
    expect(getTraitSourceEntries(character)[0].status).toBe('disabled');
    character.powerUsage!['power:p'] = { enabled: true };
    expect(getTraitSourceEntries(character)[0].status).toBe('active');
  });
  it('distinguishes manual categories without rewriting their price or optional fields', () => {
    const manual = { ...power, alternateEffects: [], components: [{ ...power.components[0], enhancedTarget: undefined, variableCostOption: 'Enhanced Advantage' }] };
    const character = createDefaultCharacter({ powers: [manual] });
    const before = JSON.stringify(character);
    expect(getTraitSourceEntries(character)[0].status).toBe('manual');
    expect(calculateCharacterPointSummary(character, [], POWER_DEFS, MODIFIER_DEFS).totalSpent).toBe(5);
    expect(effectiveTraitCharacter(character).abilities.str).toBe(0);
    expect(JSON.stringify(character)).toBe(before);
    expect(character.powerUsage).toBeUndefined();
  });
  it('explains stronger armor using the same Toughness policy as the sheet', () => {
    const protection: ICharacterPower = { id: 'armor', name: 'Armor', notes: '', alternateEffects: [], components: [{ id: 'armor-c', effectId: 'protection', ranks: 4, modifiers: [] }] };
    const gear = { ...protection, id: 'gear', components: [{ ...protection.components[0], id: 'gear-c', ranks: 6 }] };
    const character = createDefaultCharacter({ powers: [protection], equipment: [gear] });
    expect(getTraitSourceEntries(character, [], { kind: 'defense', key: 'toughness' }).map(item => item.status)).toEqual(['superseded', 'active']);
    expect(deriveCharacterDefenses(character, POWER_DEFS).toughnessTotal).toBe(6);
  });
  it('previews dynamic allocations with canonical rounding while disabled and keeps purchase costs fixed', () => {
    const dynamic = { ...power, baseDynamic: true, alternateEffects: power.alternateEffects.map(item => ({ ...item, dynamic: true })) };
    const character = createDefaultCharacter({ powers: [dynamic] });
    const price = calculateCharacterPointSummary(character, [], POWER_DEFS, MODIFIER_DEFS).totalSpent;
    const usage = { enabled: false, allocations: { str: 2, agl: 3 } };
    const source = getTraitSourceEntries(character)[0].source;
    expect(powerAllocationSummary(source, usage)).toEqual({ cost: 10, budget: 10 });
    expect(calculateCharacterPointSummary({ ...character, powerUsage: { 'power:p': usage } }, [], POWER_DEFS, MODIFIER_DEFS).totalSpent).toBe(price);
    expect(getTraitSourceEntries({ ...character, powerUsage: { 'power:p': usage } }).map(item => item.status)).toEqual(['disabled', 'disabled']);
  });
});
