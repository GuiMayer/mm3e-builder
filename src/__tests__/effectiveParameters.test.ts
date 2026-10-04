import { describe, expect, it } from 'vitest';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';
import { resolveEffectiveAction, resolveEffectiveDuration } from '../shared/lib/effectParameters';
import { calculatePowerPricing } from '../shared/lib/mathEngine';
import type { IAppliedModifier, ICharacterPowerComponent } from '../entities/types';
function model(effectId: string, modifiers: IAppliedModifier[]) {
  const effect = POWER_DEFS.find(effect => effect.id === effectId)!;
  const component: ICharacterPowerComponent = { id: 'c', effectId, ranks: 4, modifiers };
  return { effect, component, context: { effect, modifierDefs: MODIFIER_DEFS } };
}
const mod = (modifierId: string, isPowerSpecific = false, ranks = 1): IAppliedModifier => ({ modifierId, isPowerSpecific, ranks });
describe('effective actions and duration compositions', () => {
  it('composes Concentration/Sustained Nullify in either order and leaves prices and input unchanged', () => {
    const modifiers = [mod('concentration_nullify', true), mod('sustained_nullify', true)];
    for (const ordered of [modifiers, [...modifiers].reverse()]) {
      const { effect, component, context } = model('nullify', ordered);
      const snapshot = JSON.stringify(component);
      const power = { id: 'p', name: '', notes: '', components: [component], alternateEffects: [] };
      const before = calculatePowerPricing(power, POWER_DEFS, MODIFIER_DEFS).total;
      expect(resolveEffectiveDuration(effect.duration, component, context)).toEqual({ value: 'sustained', diagnostics: [] });
      expect(resolveEffectiveAction(effect.action, component, context).maintenanceAction).toBe('free');
      expect(JSON.stringify(component)).toBe(snapshot);
      expect(calculatePowerPricing(power, POWER_DEFS, MODIFIER_DEFS).total).toBe(before);
    }
  });
  it('distinguishes a specific modifier with a shared ID from the generic definition', () => {
    const { effect, component, context } = model('create', [mod('permanent', true)]);
    expect(resolveEffectiveDuration(effect.duration, component, context).value).toBe('permanent');
    const generic = { ...component, modifiers: [mod('permanent', false)] };
    expect(resolveEffectiveDuration(effect.duration, generic, context).value).toBe('sustained');
  });
  it('composes Sustained Protection with Increased Duration and Permanent with no input-order dependence', () => {
    const modifiers = [mod('sustained_protection', true), mod('increased_duration')];
    for (const ordered of [modifiers, [...modifiers].reverse()]) {
      const { effect, component, context } = model('protection', ordered);
      expect(resolveEffectiveDuration(effect.duration, component, context).value).toBe('continuous');
      expect(resolveEffectiveAction(effect.action, component, context).value).toBe('free');
    }
    const { effect, component, context } = model('flight', [mod('permanent_flaw'), mod('increased_duration')]);
    expect(resolveEffectiveDuration(effect.duration, component, context).value).toBe('permanent');
  });
  it('labels branches, cycles and duplicates as provisional instead of taking the first modifier', () => {
    for (const modifiers of [[mod('concentration'), mod('increased_duration')], [mod('increased_duration'), mod('permanent_flaw'), mod('sustained')]]) {
      for (const ordered of [modifiers, [...modifiers].reverse()]) {
        const { effect, component, context } = model('flight', ordered);
        const resolved = resolveEffectiveDuration(effect.duration, component, context);
        expect(resolved.value).toBe('sustained');
        expect(resolved.provisional).toBe(true);
      }
    }
    const { effect, component, context } = model('damage', [mod('increased_duration'), mod('increased_duration')]);
    const result = resolveEffectiveDuration(effect.duration, component, context);
    expect(result.value).toBe('concentration');
    expect(result.provisional).toBe(true);
  });
  it('does not invent Sustained Affliction from an Instant effect', () => {
    const { effect, component, context } = model('affliction', [mod('sustained'), mod('increased_duration')]);
    const result = resolveEffectiveDuration(effect.duration, component, context);
    expect(result.value).toBe('concentration');
    expect(result.provisional).toBe(true);
  });
  it('resolves Reaction, Increased Action, and legacy/current Variable Action without Activation', () => {
    const reaction = model('damage', [mod('reaction')]);
    expect(resolveEffectiveAction(reaction.effect.action, reaction.component, reaction.context).value).toBe('reaction');
    const slower = model('flight', [mod('increased_action', false, 2)]);
    expect(resolveEffectiveAction(slower.effect.action, slower.component, slower.context).value).toBe('standard');
    const variable = model('variable', [mod('action_variable', true, 2)]);
    expect(resolveEffectiveAction(variable.effect.action, variable.component, variable.context).value).toBe('free');
    variable.component.modifiers[0].options = { subtypeId: 'move' };
    expect(resolveEffectiveAction(variable.effect.action, variable.component, variable.context).value).toBe('move');
  });
  it('keeps duplicate Reaction advisory without repeating action steps', () => {
    const reaction = model('damage', [mod('reaction'), mod('reaction')]);
    const result = resolveEffectiveAction(reaction.effect.action, reaction.component, reaction.context);
    expect(result.value).toBe('reaction');
    expect(result.provisional).toBe(true);
  });
  it('reports conscious maintenance for Sustained Immunity and keeps repeated Affliction checks distinct from duration', () => {
    const immunity = model('immunity', [mod('sustained_immunity', true)]);
    const action = resolveEffectiveAction(immunity.effect.action, immunity.component, immunity.context);
    expect(action.value).toBe('free');
    expect(action.maintenanceAction).toBe('free');
    const affliction = model('affliction', [mod('concentration_affliction', true)]);
    expect(resolveEffectiveDuration(affliction.effect.duration, affliction.component, affliction.context).value).toBe('instant');
    expect(resolveEffectiveAction(affliction.effect.action, affliction.component, affliction.context).maintenanceAction).toBe('standard');
  });
});
