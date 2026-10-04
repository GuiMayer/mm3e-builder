import { describe, expect, it } from 'vitest';
import { MODIFIER_DEFS, POWER_DEFS } from '../entities/gameDataLoaders';
import { calculateComponentPricing } from '../shared/lib/mathEngine';
import { addComponentModifier } from '../features/power-builder/modifierApplication';
import type { ICharacterPowerComponent } from '../entities/types';

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
