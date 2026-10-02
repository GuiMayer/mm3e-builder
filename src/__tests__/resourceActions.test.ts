import { describe, expect, it } from 'vitest';
import type { ICharacterPower, IHeadquartersResource, IResource, IVehicleResource } from '../entities/types';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { getResourcePowers, resolveResourceEditTarget } from '../shared/lib/resourcePowers';
import { getLinkedResourceCharges } from '../shared/lib/resourceCalculations';
import { buildPowerReferences } from '../features/sheet-core/powerReference';
import { MODIFIER_DEFS, POWER_DEFS } from '../entities/gameDataLoaders';

const power: ICharacterPower = { id: 'power', name: 'Blaster', components: [{ id: 'component', effectId: 'damage', ranks: 5, modifiers: [{ modifierId: 'increased_range', ranks: 1 }] }], notes: 'Power notes', removable: 'removable', alternateEffects: [{ id: 'alternate', name: 'Scanner', components: [{ id: 'alternate-component', effectId: 'senses', ranks: 2, modifiers: [], senseTraits: [{ id: 'darkvision', ranks: 1 }] }], dynamic: true, notes: 'Alternate notes' }] };
const base = { id: '00000000-0000-4000-8000-000000000001', name: 'Resource', notes: 'Resource notes', createdAt: 'old', updatedAt: 'old' };
const device: IResource = { ...base, type: 'gadget', costMode: 'device', power };
const vehicle: IVehicleResource = { ...base, type: 'vehicle', size: 'large', strength: 4, defense: -2, toughness: 8, speed: 7, movement: { ...power, id: 'movement' }, features: [{ id: 'feature', name: 'Seats', ranks: 2, notes: 'Seats notes' }], systems: [power] };
const hq: IHeadquartersResource = { ...base, type: 'headquarters', size: 'small', toughness: 6, powerLevel: 10, features: vehicle.features, effects: [power], effectSettings: { power: { kind: 'defense-system', target: 'occupants' }, orphan: { kind: 'effect', target: 'both' } } };

describe('Resource quick references and edit destinations', () => {
  it('addresses each resource power by kind and identity, including movement', () => {
    for (const resource of [device, vehicle, hq]) {
      const entries = getResourcePowers(resource);
      expect(entries.map(entry => entry.target.kind)).toEqual(resource.type === 'vehicle' ? ['movement', 'system'] : resource.type === 'headquarters' ? ['headquarters-effect'] : ['power']);
      entries.forEach(entry => expect(resolveResourceEditTarget([resource], entry.target)).toEqual({ resource, target: entry.target }));
      expect(resolveResourceEditTarget([resource], { resourceId: resource.id, kind: 'traits' })?.resource).toBe(resource);
    }
  });
  it('never falls back to adding a power for a deleted or incompatible destination', () => {
    const target = getResourcePowers(vehicle)[1].target;
    expect(resolveResourceEditTarget([], target)).toBeNull();
    expect(resolveResourceEditTarget([{ ...vehicle, systems: [] }], target)).toBeNull();
    expect(resolveResourceEditTarget([hq], target)).toBeNull();
    expect(resolveResourceEditTarget([vehicle], { ...target, powerId: undefined })).toBeNull();
  });
  it('resolves localized references without changing the sheet or resource', () => {
    const original = structuredClone(vehicle);
    const character = createDefaultCharacter({ resourceLinks: [{ id: 'link', resourceId: vehicle.id, isFree: false }] });
    const sheet = structuredClone(character);
    const charges = getLinkedResourceCharges(character, [vehicle]);
    for (const entry of getResourcePowers(vehicle)) {
      const refs = buildPowerReferences(entry.power.components, POWER_DEFS, MODIFIER_DEFS, 'pt-BR');
      expect(refs[0].definition?.name).toBe('Dano');
      expect(refs[0].modifiers[0].definition?.description).toBeTruthy();
      resolveResourceEditTarget([vehicle], entry.target);
    }
    expect(vehicle).toEqual(original);
    expect(character).toEqual(sheet);
    expect(getLinkedResourceCharges(character, [vehicle])).toEqual(charges);
  });
});
