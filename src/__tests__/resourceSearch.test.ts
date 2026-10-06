import { describe, expect, it } from 'vitest';
import type { ICharacterPower, IResource, IVehicleResource } from '../entities/types';
import { searchResources } from '../features/resources/resourceSearch';

const power: ICharacterPower = {
  id: 'power', name: 'Raio', notes: 'Energia elétrica', descriptors: ['Tecnologia'],
  components: [{ id: 'component', effectId: 'damage', ranks: 2, modifiers: [] }],
  alternateEffects: [{ id: 'alternate', name: 'Scanner', notes: 'Visão noturna', dynamic: false,
    components: [{ id: 'alternate-component', effectId: 'senses', ranks: 1, modifiers: [] }] }],
};
const base = { id: 'item', name: 'Item', notes: '', createdAt: 'old', updatedAt: 'old' };
const device: IResource = { ...base, type: 'custom', name: 'Óculos', costMode: 'device', power };
const legacy: IResource = { ...base, id: 'legacy', type: 'gadget', name: 'Gadget 10', power };
const vehicle: IVehicleResource = {
  ...base, id: 'vehicle', type: 'vehicle', name: 'Gadget 2', size: 'medium', strength: 0,
  defense: 0, toughness: 5, speed: 0, systems: [],
  movement: { ...power, name: 'Propulsão', components: [{ id: 'movement', effectId: 'flight', ranks: 1, modifiers: [] }], alternateEffects: [] },
  features: [{ id: 'feature', name: 'Compartimento', notes: 'Oculto para passageiros' }],
};
const hq: IResource = { ...base, id: 'hq', type: 'headquarters', name: 'Base', size: 'small',
  toughness: 6, features: vehicle.features, effects: [power] };
const resources = [device, legacy, vehicle, hq];

describe('Resource library search', () => {
  it('ignores accents/case and combines words across names, notes and descriptors', () => {
    expect(searchResources(resources, { query: '  OCULOS ELETRICA tecnologia  ' })).toEqual([device]);
    expect(searchResources(resources, { query: 'oculos missing' })).toEqual([]);
    expect(searchResources(resources, { query: ' \t ' })).toHaveLength(4);
  });
  it('finds bilingual effects and alternate effects inside resource powers', () => {
    expect(searchResources(resources, { query: 'dano' })).toEqual(searchResources(resources, { query: 'damage' }));
    expect(searchResources([device], { query: 'scanner visao senses' })).toEqual([device]);
    expect(searchResources([device], { query: 'sentidos' })).toEqual([device]);
  });
  it('includes vehicle movement, headquarters effects and feature notes', () => {
    expect(searchResources(resources, { query: 'voo propulsao' })).toEqual([vehicle]);
    expect(searchResources(resources, { query: 'compartimento passageiros' })).toEqual([hq, vehicle]);
    expect(searchResources([hq], { query: 'energia dano' })).toEqual([hq]);
  });
  it('combines search, type and actual acquisition without guessing from the type', () => {
    expect(searchResources(resources, { query: 'dano', type: 'custom', acquisition: 'device' })).toEqual([device]);
    expect(searchResources(resources, { type: 'gadget', acquisition: 'equipment' })).toEqual([legacy]);
    expect(searchResources(resources, { type: 'gadget', acquisition: 'device' })).toEqual([]);
    expect(searchResources(resources, { acquisition: 'equipment' })).toEqual([hq, vehicle, legacy]);
  });
  it('sorts naturally without mutating resources, powers or the saved library order', () => {
    const original = structuredClone(resources);
    const result = searchResources(resources, { language: 'pt-BR' });
    expect(result.map(resource => resource.name)).toEqual(['Base', 'Gadget 2', 'Gadget 10', 'Óculos']);
    expect(result[3]).toBe(device);
    expect(resources).toEqual(original);
  });
});
