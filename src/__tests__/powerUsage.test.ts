import { describe, expect, it } from 'vitest';
import { resolvePowerUsage } from '../shared/lib/powerUsage';
import { calculatePowerPricing } from '../shared/lib/mathEngine';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';
import type { PowerSource } from '../shared/lib/powerUsage';

const source: PowerSource = { key: 'power:p', name: 'Array', equipment: false, personal: true, power: { id: 'p', name: 'Array', notes: '', components: [
  { id: 'str', effectId: 'enhanced-trait', ranks: 5, modifiers: [], enhancedTarget: { kind: 'ability', key: 'str' } },
  { id: 'linked', effectId: 'enhanced-trait', ranks: 2, modifiers: [], enhancedTarget: { kind: 'defense', key: 'dodge' } },
], alternateEffects: [{ id: 'ae', name: 'Speed', dynamic: false, notes: '', components: [{ id: 'agl', effectId: 'enhanced-trait', ranks: 5, modifiers: [], enhancedTarget: { kind: 'ability', key: 'agl' } }] }] } };
describe('power usage', () => {
  it('defaults to base, keeps Linked effects together, and switches to one alternate', () => {
    expect(resolvePowerUsage(source).components.map(item => item.id)).toEqual(['str', 'linked']);
    expect(resolvePowerUsage(source, { branchId: 'ae' }).components.map(item => item.id)).toEqual(['agl']);
    expect(resolvePowerUsage(source, { branchId: 'unknown' }).components).toEqual([]);
  });
  it('requires dynamic allocation and diagnoses the canonical pool without changing purchase costs', () => {
    const dynamic = { ...source, power: { ...source.power, baseDynamic: true, alternateEffects: source.power.alternateEffects.map(ae => ({ ...ae, dynamic: true })) } };
    const price = calculatePowerPricing(dynamic.power, POWER_DEFS, MODIFIER_DEFS).total;
    const usage = resolvePowerUsage(dynamic, { allocations: { str: 2, agl: 2 } });
    expect(usage.components.map(item => item.ranks)).toEqual([2, 2]);
    expect(usage.warnings).toEqual([]);
    expect(resolvePowerUsage(dynamic, { allocations: { str: 5, linked: 2, agl: 5 } }).warnings[0].key).toBe('traits.arrayBudget');
    expect(calculatePowerPricing(dynamic.power, POWER_DEFS, MODIFIER_DEFS).total).toBe(price);
  });
  it('keeps permanent enhancements active and resource recipient choices explicit', () => {
    const permanent = { ...source, power: { ...source.power, alternateEffects: [], components: [{ ...source.power.components[0], modifiers: [{ modifierId: 'permanent_enhanced_trait', ranks: 1, isPowerSpecific: true }] }] } };
    expect(resolvePowerUsage(permanent, { enabled: false }).components).toHaveLength(1);
    expect(resolvePowerUsage({ ...source, personal: false }).personal).toBe(false);
    expect(resolvePowerUsage({ ...source, personal: false }, { recipient: 'character' }).personal).toBe(true);
  });
});
