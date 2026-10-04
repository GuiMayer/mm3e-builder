import { describe, expect, it } from 'vitest';
import { MODIFIER_DEFS, POWER_DEFS } from '../entities/gameDataLoaders';
import { calculateComponentPricing } from '../shared/lib/mathEngine';
import { addComponentModifier } from '../features/power-builder/modifierApplication';
import type { ICharacterPowerComponent } from '../entities/types';
import { inspectModifierSources, recoverModifierSources, recoveryCostSummary } from '../shared/lib/modifierSourceRecovery';
import { preserveModifierRecoveryBackup } from '../services/storage/modifierRecoveryBackup';

describe('modifier source diagnostics', () => {
  it.each([['incurable', 11], ['limited', 5], ['area', 20]] as const)('preserves explicit %s origins until reviewed', (id, total) => {
    const effect = POWER_DEFS.find(def => def.id === 'affliction')!;
    const component: ICharacterPowerComponent = { id: 'component', effectId: effect.id, ranks: 10, modifiers: [{ modifierId: id, ranks: 1, isPowerSpecific: true }] };
    const broken = calculateComponentPricing(component, effect, MODIFIER_DEFS);
    expect(broken.total).toBe(10);
    expect(broken.diagnostics[0].code).toBe('invalid-modifier-source');
    for (const slot of ['base', 'linked', 'alternate']) {
      const created = addComponentModifier({ ...component, id: slot, modifiers: [] }, effect, MODIFIER_DEFS, id, false);
      expect(calculateComponentPricing(created, effect, MODIFIER_DEFS)).toMatchObject({ total, diagnostics: [] });
    }
    expect(component.modifiers[0].isPowerSpecific).toBe(true);
  });
  it('keeps ambiguous generic pricing and unknown identities distinct', () => {
    const effect = POWER_DEFS.find(def => def.id === 'weaken')!;
    const component: ICharacterPowerComponent = { id: 'c', effectId: effect.id, ranks: 10, modifiers: [{ modifierId: 'incurable', ranks: 1 }] };
    expect(calculateComponentPricing(component, effect, MODIFIER_DEFS)).toMatchObject({ total: 11, diagnostics: [{ code: 'ambiguous-modifier' }] });
    expect(calculateComponentPricing({ ...component, modifiers: [{ modifierId: 'missing', ranks: 1 }] }, effect, MODIFIER_DEFS).diagnostics[0].code).toBe('unknown-modifier');
  });
});

describe('confirmed source recovery', () => {
  const broken = { id: 'p', name: 'Legacy', notes: 'preserve', components: [{ id: 'c', effectId: 'affliction', ranks: 10, fieldValues: { resistance: 'will' }, modifiers: [
    { instanceId: 'a', modifierId: 'limited', ranks: 1, isPowerSpecific: true, affectedRanks: 4, options: { note: 'First nature' } },
    { instanceId: 'b', modifierId: 'limited', ranks: 1, isPowerSpecific: true, options: { note: 'Second nature' } },
  ] }], alternateEffects: [] };
  it('reviews repeated occurrences independently and preserves all other fields', () => {
    const candidates = inspectModifierSources({ powers: [broken] });
    expect(candidates).toHaveLength(2);
    const source = { powers: [broken] };
    const result = recoverModifierSources(source, [candidates[0].key]);
    expect(result.powers[0].components[0].modifiers[0]).toEqual({ ...broken.components[0].modifiers[0], isPowerSpecific: false });
    expect(result.powers[0].components[0].modifiers[1]).toEqual(broken.components[0].modifiers[1]);
    expect(broken.components[0].modifiers[0].isPowerSpecific).toBe(true);
    expect(recoverModifierSources(source, [])).toEqual(source);
    expect(inspectModifierSources(result)).toHaveLength(1);
    expect(recoveryCostSummary(result)[0].pp).toBe(8);
  });
  it('includes Linked and alternate components but excludes valid specific, unknown and foreign-only modifiers', () => {
    const payload = { powers: [{ ...broken, components: [...broken.components, { id: 'linked', effectId: 'weaken', ranks: 2, modifiers: [{ modifierId: 'incurable', ranks: 1, isPowerSpecific: true }] }], alternateEffects: [{ id: 'ae', name: 'Alternate', notes: '', dynamic: false, components: broken.components }] }] };
    expect(inspectModifierSources(payload)).toHaveLength(4);
    expect(inspectModifierSources({ ...broken, components: [{ ...broken.components[0], modifiers: [{ modifierId: 'missing', ranks: 1, isPowerSpecific: true }, { modifierId: 'continuous_flight', ranks: 1, isPowerSpecific: true }] }] })).toEqual([]);
  });
  it('requires a verified original backup and reports storage failures', () => {
    const entries = new Map<string, string>();
    const storage = { setItem: (key: string, value: string) => { entries.set(key, value); }, getItem: (key: string) => entries.get(key) ?? null };
    expect(preserveModifierRecoveryBackup('original bytes', storage)).toBe(true);
    expect([...entries.values()]).toEqual(['original bytes']);
    expect(preserveModifierRecoveryBackup('new', { ...storage, setItem: () => { throw new Error('quota'); } })).toBe(false);
    expect(preserveModifierRecoveryBackup('new', { ...storage, getItem: () => null })).toBe(false);
  });
});
