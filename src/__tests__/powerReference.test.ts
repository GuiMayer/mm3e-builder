import { describe, expect, it } from 'vitest';
import type { ICharacterPowerComponent, IModifierDef, IPowerEffect } from '../entities/types';
import { buildPowerReferences } from '../features/sheet-core/powerReference';

const generic: IModifierDef = { id: 'shared', name: 'Generic', category: 'extra', costType: 'per_rank', costValue: 1, description: 'Generic rule', incompatibleWith: [], i18n: { 'pt-BR': { name: 'Genérico', description: 'Regra genérica' } } };
const specific: IModifierDef = { ...generic, name: 'Specific', description: 'Specific rule', i18n: { 'pt-BR': { name: 'Específico', description: 'Regra específica', longDescription: 'Descrição completa específica' } } };
const effect: IPowerEffect = { id: 'test', name: 'Effect', type: 'general', baseCost: 1, action: 'standard', range: 'close', duration: 'instant', description: 'Effect rule', variableCost: null, extras: [specific], flaws: [], i18n: { 'pt-BR': { name: 'Efeito', description: 'Regra do efeito' } } };
const component: ICharacterPowerComponent = { id: 'component', effectId: 'test', ranks: 4, modifiers: [{ modifierId: 'shared', ranks: 2, isPowerSpecific: true, affectedRanks: 3, option: 'Chosen option' }] };

describe('Read-only power references', () => {
  it('resolves and translates effect-specific descriptions despite a colliding generic ID', () => {
    const result = buildPowerReferences([component], [effect], [generic], 'pt-BR')[0];
    expect(result.definition?.name).toBe('Efeito');
    expect(result.definition?.longDescription).toBe('Regra do efeito');
    expect(result.modifiers[0].source).toBe('power-specific');
    expect(result.modifiers[0].definition?.longDescription).toBe('Descrição completa específica');
    expect(result.modifiers[0].applied).toMatchObject({ affectedRanks: 3, ranks: 2, option: 'Chosen option' });
  });
  it('preserves generic-first resolution for legacy source markers and uses the base language as fallback', () => {
    const legacy = { ...component, modifiers: [{ modifierId: 'shared', ranks: 1 }] };
    const result = buildPowerReferences([legacy], [effect], [generic], 'unknown')[0];
    expect(result.modifiers[0].definition?.description).toBe('Generic rule');
    expect(result.modifiers[0].source).toBe('generic');
  });
  it('keeps missing references visible without substituting an unrelated definition', () => {
    const unknown = { ...component, effectId: 'unknown' };
    expect(buildPowerReferences([unknown], [effect], [generic], 'en')[0]).toMatchObject({ component: unknown, definition: undefined, modifiers: [{ definition: undefined, source: 'missing' }] });
    const missingSpecific = { ...component, modifiers: [{ modifierId: 'missing', ranks: 1, isPowerSpecific: true }] };
    expect(buildPowerReferences([missingSpecific], [effect], [generic], 'en')[0].modifiers[0].definition).toBeUndefined();
  });
  it('resolves multiple and alternate components independently without changing character or catalog data', () => {
    const alternate = { ...component, id: 'alternate', modifiers: [{ modifierId: 'shared', ranks: 1, isPowerSpecific: false }] };
    const input = { components: [component, alternate], effects: [effect], modifiers: [generic] };
    const before = JSON.stringify(input);
    const result = buildPowerReferences(input.components, input.effects, input.modifiers, 'pt-BR');
    expect(result.map(item => item.modifiers[0].definition?.name)).toEqual(['Específico', 'Genérico']);
    expect(JSON.stringify(input)).toBe(before);
  });
});
