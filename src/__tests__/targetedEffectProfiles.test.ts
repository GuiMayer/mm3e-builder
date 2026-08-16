import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { buildTargetedEffectProfiles, parseEffectRank } from '../shared/lib/offenseSummary';
import type { ICharacterPower, IModifierDef, IPowerEffect } from '../entities/types';

const effects = [
  { id: 'damage', name: 'Damage', type: 'attack', baseCost: 1, action: 'standard', range: 'close', duration: 'instant', description: '', variableCost: null, extras: [], flaws: [] },
  { id: 'protection', name: 'Protection', type: 'defense', baseCost: 1, action: 'none', range: 'personal', duration: 'permanent', description: '', variableCost: null, extras: [], flaws: [] },
] as IPowerEffect[];

const modifiers = [
  { id: 'attack', name: 'Attack', category: 'extra', costType: 'per_rank', costValue: 0, description: '', incompatibleWith: [] },
  { id: 'affects_others', name: 'Affects Others', category: 'extra', costType: 'per_rank', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'area', name: 'Area', category: 'extra', costType: 'per_rank', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'accurate', name: 'Accurate', category: 'extra', costType: 'flat_ranked', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'inaccurate', name: 'Inaccurate', category: 'flaw', costType: 'flat_ranked', costValue: -1, description: '', incompatibleWith: [] },
] as IModifierDef[];

const power = (overrides: Partial<ICharacterPower> = {}): ICharacterPower => ({
  id: 'power-1',
  name: 'Energy Control',
  components: [{ id: 'component-1', effectId: 'damage', ranks: 8, modifiers: [] }],
  notes: '',
  alternateEffects: [],
  ...overrides,
});

describe('targeted effect profiles', () => {
  it('includes equipment, ordinary alternate effects and dynamic alternate effects', () => {
    const character = createDefaultCharacter({
      powers: [power({
        alternateEffects: [
          { id: 'ae-1', name: 'Burst', dynamic: false, notes: '', components: [{ id: 'ae-component-1', effectId: 'damage', ranks: 8, modifiers: [{ modifierId: 'area', ranks: 1 }] }] },
          { id: 'ae-2', name: 'Beam', dynamic: true, notes: '', components: [{ id: 'ae-component-2', effectId: 'damage', ranks: 8, modifiers: [] }] },
        ],
      })],
      equipment: [power({ id: 'equipment-1', name: 'Blaster' })],
    });

    const profiles = buildTargetedEffectProfiles(character, effects, [], [], modifiers);

    expect(profiles.some((profile) => profile.sourceType === 'equipment' && profile.sourceName === 'Blaster')).toBe(true);
    expect(profiles.find((profile) => profile.name === 'Burst')).toMatchObject({ interaction: 'resistance', relationship: 'alternate', requiresAttackCheck: false, tags: ['resistance', 'area'] });
    expect(profiles.find((profile) => profile.name === 'Beam')).toMatchObject({ interaction: 'attack', relationship: 'dynamic-alternate' });
    expect(profiles.find((profile) => profile.name === 'Beam')?.tags).toContain('dynamic');
  });

  it('keeps Affects Others as a targeted effect rather than inferring an attack', () => {
    const character = createDefaultCharacter({
      powers: [power({
        components: [{ id: 'component-1', effectId: 'protection', ranks: 5, modifiers: [{ modifierId: 'affects_others', ranks: 1 }] }],
      })],
    });

    const profile = buildTargetedEffectProfiles(character, effects, [], [], modifiers).find((entry) => entry.componentName === 'Protection');

    expect(profile).toMatchObject({ interaction: 'targeted', range: 'close', requiresAttackCheck: false, causesResistance: false });
    expect(profile?.tags).toContain('affects-others');
  });

  it('recognizes the Attack extra and applies Accurate and Inaccurate together', () => {
    const character = createDefaultCharacter({
      abilities: { ...createDefaultCharacter().abilities, fgt: 4 },
      powers: [power({
        components: [{
          id: 'component-1', effectId: 'protection', ranks: 5,
          modifiers: [
            { modifierId: 'attack', ranks: 1 },
            { modifierId: 'accurate', ranks: 2 },
            { modifierId: 'inaccurate', ranks: 1 },
          ],
        }],
      })],
    });

    const profile = buildTargetedEffectProfiles(character, effects, [], [], modifiers).find((entry) => entry.componentName === 'Protection');

    expect(profile).toMatchObject({ interaction: 'attack', requiresAttackCheck: true, bonus: '+6' });
    expect(profile?.bonusBreakdown).toContain('Inaccurate -2');
  });

  it('uses the effect rank rather than a later number in a legacy manual row', () => {
    expect(parseEffectRank('Damage 10, Penetrating 5')).toBe(10);
  });
});
