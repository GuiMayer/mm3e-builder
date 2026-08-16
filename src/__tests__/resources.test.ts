import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { IResource } from '../entities/types';
import { getCharacterResourceEPUsed, getResourceEPCost, getVehicleBaseTraits } from '../shared/lib/resourceCalculations';
import { migrateLegacyEquipmentToResources } from '../shared/lib/resourceMigration';

const now = '2026-08-16T00:00:00.000Z';
const gear: IResource = { id: 'gear-1', type: 'gear', name: 'Scanner', notes: '', createdAt: now, updatedAt: now, power: { id: 'power-1', name: 'Scanner', components: [], notes: '', alternateEffects: [] } };

describe('Resources domain', () => {
  it('counts only paid linked resources', () => {
    const character = createDefaultCharacter({ resourceLinks: [{ id: 'link-1', resourceId: 'gear-1', isFree: false, contributionEP: 4 }, { id: 'link-2', resourceId: 'gear-1', isFree: true, contributionEP: 99 }] });
    expect(getCharacterResourceEPUsed(character, [gear])).toBe(4);
  });

  it('uses the vehicle base traits and never produces a negative EP cost', () => {
    const base = getVehicleBaseTraits('large');
    const vehicle: IResource = { id: 'vehicle-1', type: 'vehicle', name: 'Van', notes: '', createdAt: now, updatedAt: now, size: 'large', strength: base.strength, speed: 0, defense: base.defense, toughness: base.toughness, features: [], systems: [] };
    expect(getResourceEPCost(vehicle)).toBeGreaterThanOrEqual(0);
  });

  it('migrates legacy equipment to paid Gear links exactly once', () => {
    const character = createDefaultCharacter({ equipment: [{ id: 'old-item', name: 'Legacy belt', components: [], notes: '', alternateEffects: [] }] });
    const result = migrateLegacyEquipmentToResources(character);
    expect(result.character.equipment).toEqual([]);
    expect(result.character.resourceLinks).toHaveLength(1);
    expect(result.resources[0].type).toBe('gear');
    expect(migrateLegacyEquipmentToResources(result.character).resources).toEqual([]);
  });
});
