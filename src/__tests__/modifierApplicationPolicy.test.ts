import { describe, expect, it } from 'vitest';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../entities/gameDataLoaders';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { ICharacterPower, ICharacterPowerComponent } from '../entities/types';
import { addComponentModifier } from '../features/power-builder/modifierApplication';
import { getBlockingPowerSaveIssues } from '../features/power-builder/powerSavePolicy';
import { resolveModifierDrop } from '../features/power-builder/powerDragAndDropModel';
import { validatePowerForSave } from '../shared/lib/semanticValidation';
import { DEFAULT_VALIDATION_RULES } from '../shared/lib/validationRules';
import { calculatePowerPricing } from '../shared/lib/mathEngine';

const context = { powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS, skillDefs: SKILL_DEFS, advantageDefs: ADVANTAGE_DEFS };
const component = (effectId: string): ICharacterPowerComponent => ({ id: 'component', effectId, ranks: 6, modifiers: [] });
const power = (value: ICharacterPowerComponent): ICharacterPower => ({ id: 'power', name: 'Test', components: [value], alternateEffects: [], notes: '' });
const effect = (id: string) => POWER_DEFS.find(definition => definition.id === id)!;

describe('Player-controlled modifier application', () => {
  it.each(['movement', 'senses'])('adds and repeats generic Limited to %s without marking it as specific to another effect', id => {
    const original = component(id);
    const before = JSON.stringify(original);
    const first = addComponentModifier(original, effect(id), MODIFIER_DEFS, 'limited');
    expect(first.modifiers).toEqual([expect.objectContaining({ modifierId: 'limited', ranks: 1, isPowerSpecific: false })]);
    const second = addComponentModifier(first, effect(id), MODIFIER_DEFS, 'limited');
    expect(second.modifiers).toHaveLength(2);
    expect(second.modifiers.every(modifier => modifier.ranks === 1 && !modifier.isPowerSpecific)).toBe(true);
    expect(second.modifiers[0].instanceId).not.toBe(second.modifiers[1].instanceId);
    expect(getBlockingPowerSaveIssues(power(first), DEFAULT_VALIDATION_RULES, context)).toEqual([]);
    expect(calculatePowerPricing(power(first), POWER_DEFS, MODIFIER_DEFS).total).toBeLessThan(calculatePowerPricing(power(original), POWER_DEFS, MODIFIER_DEFS).total);
    expect(JSON.stringify(original)).toBe(before);
  });

  it('allows every generic extra/flaw on every catalog effect through addition and drop routing', () => {
    for (const definition of POWER_DEFS) {
      for (const modifier of MODIFIER_DEFS) {
        const target = component(definition.id);
        const first = addComponentModifier(target, definition, MODIFIER_DEFS, modifier.id, false);
        const repeated = addComponentModifier(first, definition, MODIFIER_DEFS, modifier.id, false);
        expect(repeated.modifiers, `${definition.id}: ${modifier.id}`).toHaveLength(2);
        expect(repeated.modifiers).toEqual([expect.objectContaining({ modifierId: modifier.id, ranks: 1, isPowerSpecific: false }), expect.objectContaining({ modifierId: modifier.id, ranks: 1, isPowerSpecific: false })]);
        expect(resolveModifierDrop({ kind: 'modifier', modifier, isPowerSpecific: false, sourceEffectId: 'different-effect' },
          { kind: 'modifier-target', componentId: target.id, effectId: definition.id, label: definition.name }, POWER_DEFS, MODIFIER_DEFS)).not.toBeNull();
      }
    }
  });

  it('limits specific choices to the target effect even when a generic modifier shares the ID', () => {
    expect(addComponentModifier(component('movement'), effect('movement'), MODIFIER_DEFS, 'limited', true).modifiers).toEqual([]);
    expect(addComponentModifier(component('movement'), effect('movement'), MODIFIER_DEFS, 'limited_senses', true).modifiers).toEqual([]);
    expect(addComponentModifier(component('senses'), effect('senses'), MODIFIER_DEFS, 'limited_senses', true).modifiers[0]).toMatchObject({ isPowerSpecific: true });
    const invalid = power({ ...component('movement'), modifiers: [{ modifierId: 'limited_senses', ranks: 1, isPowerSpecific: true }] });
    expect(getBlockingPowerSaveIssues(invalid, DEFAULT_VALIDATION_RULES, context)).toContainEqual(expect.objectContaining({ severity: 'error', path: 'components.0.modifiers.limited_senses' }));
  });

  it('preserves existing modifier purchases and options when adding another legacy generic entry', () => {
    const original = { ...component('senses'), modifiers: [{ modifierId: 'limited', ranks: 2, affectedRanks: 3, option: 'vision', options: { note: 'Only at night' } }] };
    const updated = addComponentModifier(original, effect('senses'), MODIFIER_DEFS, 'limited');
    expect(updated.modifiers[0]).toEqual(original.modifiers[0]);
    expect(updated.modifiers[1]).toMatchObject({ modifierId: 'limited', ranks: 1, isPowerSpecific: false });
    expect(original.modifiers[0].ranks).toBe(2);
  });

  it('does not let a valid generic entry hide an invalid specific source with the same ID', () => {
    const value = power({ ...component('movement'), modifiers: [
      { modifierId: 'limited', ranks: 1, isPowerSpecific: false },
      { modifierId: 'limited', ranks: 1, isPowerSpecific: true },
      { modifierId: 'unknown-modifier', ranks: 1 },
    ] });
    const issues = getBlockingPowerSaveIssues(value, DEFAULT_VALIDATION_RULES, context);
    expect(issues).toContainEqual(expect.objectContaining({ path: 'components.0.modifiers.limited', message: 'Unknown modifier source for "limited".' }));
    expect(issues).toContainEqual(expect.objectContaining({ path: 'components.0.modifiers.unknown-modifier' }));
  });

  it('keeps applicability, incompatibility, max-rank and trigger diagnostics but allows saving the chosen combination', () => {
    const value = power({ ...component('damage'), modifiers: [
      { modifierId: 'affects_others', ranks: 1, isPowerSpecific: false },
      { modifierId: 'increased_range', ranks: 1, isPowerSpecific: false },
      { modifierId: 'reduced_range', ranks: 1, isPowerSpecific: false },
      { modifierId: 'triggered', ranks: 1, isPowerSpecific: false },
      { modifierId: 'accurate', ranks: 100, isPowerSpecific: false },
      { modifierId: 'inaccurate', ranks: 1, isPowerSpecific: false },
    ] });
    const character = createDefaultCharacter({ powers: [value] });
    const options = { ...context, character };
    const diagnostics = validatePowerForSave(value, DEFAULT_VALIDATION_RULES, options);
    expect(diagnostics.some(issue => issue.message.includes('Personal effect'))).toBe(true);
    expect(diagnostics.some(issue => issue.message.includes('triggering circumstance'))).toBe(true);
    expect(diagnostics.some(issue => issue.message.includes('incompatible'))).toBe(true);
    expect(diagnostics.some(issue => issue.message.includes('maximum ranks'))).toBe(true);
    expect(diagnostics.some(issue => issue.path === 'components' && issue.severity === 'error')).toBe(true);
    expect(getBlockingPowerSaveIssues(value, DEFAULT_VALIDATION_RULES, options)).toEqual([]);
    expect(validatePowerForSave(value, DEFAULT_VALIDATION_RULES, options)).toEqual(diagnostics);
  });

  it('applies the same policy to alternate effects and retains structural failures', () => {
    const value = power(component('movement'));
    value.alternateEffects = [{ id: 'alternate', name: 'Alternate', notes: '', dynamic: false, components: [{ ...component('damage'), id: 'alternate-component', modifiers: [{ modifierId: 'affects_others', ranks: 1, isPowerSpecific: false }] }] }];
    expect(getBlockingPowerSaveIssues(value, DEFAULT_VALIDATION_RULES, context)).toEqual([]);
    value.alternateEffects[0].components[0].modifiers.push({ modifierId: 'limited_senses', ranks: 1, isPowerSpecific: true });
    expect(getBlockingPowerSaveIssues(value, DEFAULT_VALIDATION_RULES, context)).toContainEqual(expect.objectContaining({ path: 'alternateEffects.0.components.0.modifiers.limited_senses' }));
    expect(getBlockingPowerSaveIssues(power(component('unknown-effect')), DEFAULT_VALIDATION_RULES, context)).toContainEqual(expect.objectContaining({ path: 'components.0.effectId' }));
    const missingField = power(component('affliction'));
    expect(getBlockingPowerSaveIssues(missingField, DEFAULT_VALIDATION_RULES, context).length).toBeGreaterThan(0);
  });
});
