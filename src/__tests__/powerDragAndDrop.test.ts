import { describe, expect, it } from 'vitest';
import { MODIFIER_DEFS, POWER_DEFS } from '../entities/gameDataLoaders';
import type { ICharacterPower, IPowerEffect } from '../entities/types';
import { nextDropTargetIndex, resolveModifierDrop, type ModifierDragData, type ModifierDropData } from '../features/power-builder/powerDragAndDropModel';
import { createPowerPricingSelector } from '../features/power-builder/powerBuilderModel';

const accurate = MODIFIER_DEFS.find((definition) => definition.id === 'accurate')!;
const drag: ModifierDragData = { kind: 'modifier', modifier: accurate, isPowerSpecific: false, sourceEffectId: 'damage' };
const target: ModifierDropData = { kind: 'modifier-target', componentId: 'component-with-hyphens', effectId: 'damage', label: 'Damage' };
const drop = (source = drag, destination = target, effects: IPowerEffect[] = POWER_DEFS) => resolveModifierDrop(source, destination, effects, MODIFIER_DEFS);

describe('PowerBuilder drag and drop', () => {
  it('keeps the generic source on a drop even when a specific definition has the same ID', () => {
    const damage = POWER_DEFS.find((definition) => definition.id === 'damage')!;
    const effects = [{ ...damage, extras: [...damage.extras, { ...accurate, costValue: 3 }] }];
    expect(drop(drag, target, effects)).toMatchObject({ modifierId: 'accurate', isPowerSpecific: false, componentId: target.componentId });
    expect(drop({ ...drag, isPowerSpecific: true }, target, effects)).toMatchObject({ isPowerSpecific: true });
  });
  it('routes alternates by metadata without splitting IDs', () => {
    expect(drop(drag, { ...target, aeId: 'alternate-with-hyphens' })).toMatchObject({ aeId: 'alternate-with-hyphens', componentId: target.componentId });
  });
  it('rejects a specific modifier on a different effect', () => {
    expect(drop({ ...drag, isPowerSpecific: true }, { ...target, effectId: 'affliction' })).toBeNull();
  });
  it('rejects an unresolved declared source', () => {
    expect(drop({ ...drag, isPowerSpecific: true })).toBeNull();
  });
  it('rejects missing effects, unknown effects and empty component IDs', () => {
    for (const destination of [{ ...target, effectId: '' }, { ...target, effectId: 'unknown' }, { ...target, componentId: '' }]) {
      expect(drop(drag, destination)).toBeNull();
    }
  });
  it('does nothing when dropped outside a target or without a modifier payload', () => {
    expect(resolveModifierDrop(drag, undefined, POWER_DEFS, MODIFIER_DEFS)).toBeNull();
    expect(resolveModifierDrop(undefined, target, POWER_DEFS, MODIFIER_DEFS)).toBeNull();
  });
  it.each(['ArrowRight', 'ArrowDown'])('cycles forward with %s', (key) => {
    expect(nextDropTargetIndex(key, -1, 3)).toBe(0);
    expect(nextDropTargetIndex(key, 0, 3)).toBe(1);
    expect(nextDropTargetIndex(key, 2, 3)).toBe(0);
  });
  it.each(['ArrowLeft', 'ArrowUp'])('cycles backward with %s', (key) => {
    expect(nextDropTargetIndex(key, -1, 3)).toBe(0);
    expect(nextDropTargetIndex(key, 0, 3)).toBe(2);
  });
  it('ignores other keys and empty target lists', () => {
    expect(nextDropTargetIndex('Escape', 0, 3)).toBeNull();
    expect(nextDropTargetIndex('ArrowRight', -1, 0)).toBeNull();
  });
  it('reuses pricing for text changes and recalculates rule inputs', () => {
    const power: ICharacterPower = { id: 'p', name: '', notes: '', components: [{ id: 'c', effectId: 'damage', ranks: 5, modifiers: [] }], alternateEffects: [] };
    const select = createPowerPricingSelector(POWER_DEFS, MODIFIER_DEFS, 0);
    const pricing = select(power);
    expect(select({ ...power, name: 'New name', notes: 'Long notes', descriptors: ['Fire'] })).toBe(pricing);
    expect(select({ ...power, components: [{ ...power.components[0], ranks: 8 }] }).total).toBe(8);
    expect(select({ ...power, activation: 'move' }).total).toBe(4);
    expect(select({ ...power, removable: 'removable' }).total).toBe(4);
  });
});
