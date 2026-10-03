import { describe, expect, it } from 'vitest';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';
import type { ICharacterPower } from '../entities/types';
import { validatePowerForSave } from '../shared/lib/semanticValidation';
import { DEFAULT_VALIDATION_RULES } from '../shared/lib/validationRules';
import { calculatePowerPricing } from '../shared/lib/mathEngine';
import { getBlockingPowerSaveIssues } from '../features/power-builder/powerSavePolicy';

const context = { powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS, language: 'pt-BR' };
const duplicateKey = 'builder.duplicateModifierWarning';
const makePower = (): ICharacterPower => ({
  id: 'power', name: 'Duplicates', notes: '', alternateEffects: [],
  components: [{ id: 'base', effectId: 'damage', ranks: 10, modifiers: [
    { modifierId: 'limited', ranks: 1 },
    { modifierId: 'limited', ranks: 2 },
    { modifierId: 'incurable', ranks: 1 },
    { modifierId: 'incurable', ranks: 1 },
    { modifierId: 'incurable', ranks: 1 },
  ] }],
});

describe('duplicate modifier notices', () => {
  it('lists every repeated modifier with its localized name and application count', () => {
    const warnings = validatePowerForSave(makePower(), DEFAULT_VALIDATION_RULES, context)
      .filter(issue => issue.messageKey === duplicateKey);
    expect(warnings).toEqual([
      expect.objectContaining({ severity: 'warning', params: { modifier: 'Limitado', count: 2, effect: 'Dano' } }),
      expect.objectContaining({ severity: 'warning', params: { modifier: 'Incurável', count: 3, effect: 'Dano' } }),
    ]);
  });

  it('checks base, linked, alternate and alternate-linked components independently', () => {
    const power = makePower();
    power.components.push({ id: 'linked', effectId: 'damage', ranks: 1, modifiers: [{ modifierId: 'limited', ranks: 1 }] });
    power.alternateEffects.push({ id: 'ae', name: 'Alternate', notes: '', dynamic: false, components: [
      { ...makePower().components[0], id: 'ae-base' },
      { ...makePower().components[0], id: 'ae-linked' },
    ] });
    const warnings = validatePowerForSave(power, DEFAULT_VALIDATION_RULES, context)
      .filter(issue => issue.messageKey === duplicateKey);
    expect(warnings.map(issue => issue.path)).toEqual([
      'components.0.modifiers.limited', 'components.0.modifiers.incurable',
      'alternateEffects.0.components.0.modifiers.limited', 'alternateEffects.0.components.0.modifiers.incurable',
      'alternateEffects.0.components.1.modifiers.limited', 'alternateEffects.0.components.1.modifiers.incurable',
    ]);
  });

  it('also localizes repeated effect-specific modifiers', () => {
    const power = makePower();
    const summon = POWER_DEFS.find(effect => effect.id === 'summon')!;
    const heroic = summon.extras.find(modifier => modifier.id === 'heroic')!;
    power.components[0] = { id: 'base', effectId: 'summon', ranks: 1, modifiers: [
      { modifierId: 'heroic', ranks: 1, isPowerSpecific: true },
      { modifierId: 'heroic', ranks: 1, isPowerSpecific: true },
    ] };
    expect(validatePowerForSave(power, DEFAULT_VALIDATION_RULES, context)).toContainEqual(expect.objectContaining({
      messageKey: duplicateKey,
      params: { modifier: heroic.i18n?.['pt-BR']?.name ?? heroic.name, count: 2, effect: summon.i18n?.['pt-BR']?.name ?? summon.name },
    }));
  });

  it('hides only duplicate notices and leaves all other diagnostics, costs, data and saving unchanged', () => {
    const power = makePower();
    power.components[0].modifiers.push({ modifierId: 'reduced_range', ranks: 1 });
    const before = JSON.stringify(power);
    const cost = calculatePowerPricing(power, POWER_DEFS, MODIFIER_DEFS).total;
    const hiddenRules = { ...DEFAULT_VALIDATION_RULES, enforceDuplicateModifiers: false };
    const visible = validatePowerForSave(power, DEFAULT_VALIDATION_RULES, context);
    const hidden = validatePowerForSave(power, hiddenRules, context);
    expect(visible.some(issue => issue.messageKey !== duplicateKey && issue.severity === 'warning')).toBe(true);
    expect(hidden).toEqual(visible.filter(issue => issue.messageKey !== duplicateKey));
    expect(getBlockingPowerSaveIssues(power, DEFAULT_VALIDATION_RULES, context)).toEqual([]);
    expect(getBlockingPowerSaveIssues(power, hiddenRules, context)).toEqual([]);
    expect(calculatePowerPricing(power, POWER_DEFS, MODIFIER_DEFS).total).toBe(cost);
    expect(JSON.stringify(power)).toBe(before);
  });
});
