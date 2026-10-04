import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { CharacterSchema } from '../entities/schemas';
import { sanitizeCharacterForExport } from '../services/character-file/sanitizeCharacter';
import { normalizeCharacter } from '../services/character-file/normalizeCharacter';
import { duplicateCharacterWithNewIds } from '../entities/characterOperations';
import { calculateComponentPricing } from '../shared/lib/mathEngine';
import { MODIFIER_DEFS, POWER_DEFS } from '../entities/gameDataLoaders';
import type { ICharacter, ICharacterPowerComponent } from '../entities/types';

describe('optional trait contracts', () => {
  it('does not materialize optional fields on existing characters', () => {
    const legacy = createDefaultCharacter();
    const result = sanitizeCharacterForExport(normalizeCharacter(CharacterSchema.parse(legacy) as unknown as ICharacter));
    expect(result).not.toHaveProperty('traitModifiers');
    expect(result).not.toHaveProperty('powerUsage');
    expect(result.powers).toEqual(legacy.powers);
  });
  it('preserves targets and remaps owned usage identities in copies', () => {
    const component: ICharacterPowerComponent = { id: 'c', effectId: 'enhanced-trait', ranks: 5, modifiers: [], enhancedTarget: { kind: 'ability', key: 'str' } };
    const character = createDefaultCharacter({ powers: [{ id: 'p', name: 'Enhancement', notes: '', components: [component], alternateEffects: [] }],
      traitModifiers: [{ id: 'm', target: { kind: 'ability', key: 'str' }, scope: 'check', value: -2, active: true, source: 'Condition' }],
      powerUsage: { 'power:p': { enabled: true, allocations: { c: 3 } } } });
    const exported = sanitizeCharacterForExport(CharacterSchema.parse(character) as unknown as ICharacter);
    expect(exported.traitModifiers).toEqual(character.traitModifiers);
    expect(exported.powers[0].components[0].enhancedTarget).toEqual(component.enhancedTarget);
    const copy = duplicateCharacterWithNewIds(character, 'Copy');
    expect(copy.powerUsage?.[`power:${copy.powers[0].id}`]?.allocations).toEqual({ [copy.powers[0].components[0].id]: 3 });
    expect(copy.traitModifiers?.[0].id).not.toBe('m');
  });
  it.each([['ability', 10], ['defense', 5], ['skill', 3]] as const)('prices %s targets through the existing catalog', (kind, cost) => {
    const component: ICharacterPowerComponent = { id: 'c', effectId: 'enhanced-trait', ranks: 5, modifiers: [], enhancedTarget: kind === 'ability' ? { kind, key: 'str' } : kind === 'defense' ? { kind, key: 'dodge' } : { kind, skillId: 'acrobatics' } };
    expect(calculateComponentPricing(component, POWER_DEFS.find(def => def.id === component.effectId)!, MODIFIER_DEFS).total).toBe(cost);
  });
});
