import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { ICharacterPower } from '../entities/types';
import { getTraitSourceEntries } from '../shared/lib/traitSources';
import { effectiveTraitCharacter } from '../shared/lib/traitValues';

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
});
