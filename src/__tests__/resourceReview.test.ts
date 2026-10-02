import { describe, expect, it } from 'vitest';
import type { IResource, IVehicleResource, IPowerResource } from '../entities/types';
import { applyResourceReview, needsResourceReview } from '../shared/lib/resourceReview';
import { migrateResourceMetadata, parseResourceAppendix } from '../services/storage/resourceLibraryStorage';
import { createDefaultCharacter } from '../entities/characterDefaults';

const base = { id: '00000000-0000-4000-8000-000000000001', name: 'Old', notes: 'Keep', createdAt: '', updatedAt: '' };
const power = { id: 'power', name: 'Keep', notes: 'Keep', components: [{ id: 'component', effectId: 'damage', ranks: 5, modifiers: [] }], alternateEffects: [] };
describe('Reviewed Resource migration', () => {
  it('preserves character data and all resource identities while reviewing PP acquisition', () => {
    const original: IResource = { ...base, type: 'gadget', power };
    const character = createDefaultCharacter({ resourceLinks: [{ id: 'link', resourceId: base.id, isFree: false }] });
    const savedCharacter = JSON.stringify(character);
    const migrated = migrateResourceMetadata(original);
    expect(needsResourceReview(migrated)).toBe(true);
    const result = applyResourceReview([migrated], { [base.id]: { costMode: 'device', removable: 'removable' } });
    expect(result[0]).toMatchObject({ id: base.id, name: 'Old', notes: 'Keep', costMode: 'device', costReviewRequired: false, power: { id: 'power', components: power.components, notes: 'Keep', removable: 'removable' } });
    expect(JSON.stringify(character)).toBe(savedCharacter);
    expect(applyResourceReview(result, { [base.id]: { costMode: 'equipment' } })).toEqual(result);
    expect(original).toEqual({ ...base, type: 'gadget', power });
  });
  it('preserves legacy Speed and existing systems while adding reviewed Flight with stable IDs', () => {
    const original: IVehicleResource = { ...base, type: 'vehicle', size: 'huge', strength: 8, speed: 7, defense: -2, toughness: 9, features: [{ id: 'f', name: 'Alarm', notes: 'Keep' }], systems: [power] };
    const migrated = migrateResourceMetadata(original);
    const choice = { [base.id]: { movementEffect: 'flight' as const } };
    const result = applyResourceReview([migrated], choice)[0] as IVehicleResource;
    expect(result.speed).toBe(7); expect(result.systems).toEqual(original.systems); expect(result.features).toEqual(original.features);
    expect(result.movement!.components[0]).toMatchObject({ effectId: 'flight', ranks: 7 });
    expect(applyResourceReview([migrated], choice)[0]).toEqual(result);
    expect(needsResourceReview(result)).toBe(false);
  });
  it('allows movement already present in systems to avoid double charging, without deleting those systems', () => {
    const vehicle = { ...base, type: 'vehicle', size: 'medium', strength: 0, speed: 7, defense: 0, toughness: 5, features: [], systems: [power], movementReviewRequired: true } as IVehicleResource;
    const reviewed = applyResourceReview([vehicle], { [base.id]: { movementEffect: 'systems' } })[0] as IVehicleResource;
    expect(reviewed.systems).toEqual([power]); expect(reviewed.movement!.components).toEqual([]);
  });
  it('keeps modern resources and unknown extension fields stable on a version 2 appendix round trip', () => {
    const modern = { ...base, type: 'gadget', costMode: 'device', power, extension: { keep: true } } as IPowerResource;
    expect(parseResourceAppendix({ version: 2, items: [modern] })).toEqual([modern]);
    expect(needsResourceReview(modern)).toBe(false);
  });
  it('never replaces explicit movement or its notes because an imported review flag is stale', () => {
    const movement = { ...power, notes: 'Configured movement notes', components: [{ ...power.components[0], effectId: 'flight', ranks: 7 }] };
    const vehicle: IVehicleResource = { ...base, type: 'vehicle', size: 'medium', strength: 0, speed: 7, defense: 0, toughness: 5, features: [], systems: [power], movement, movementReviewRequired: true };
    expect(needsResourceReview(vehicle)).toBe(false);
    expect(applyResourceReview([vehicle], { [base.id]: { movementEffect: 'speed' } })).toEqual([vehicle]);
  });
});
