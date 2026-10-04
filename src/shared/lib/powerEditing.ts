import type { ICharacter, ICharacterPower, IResource } from '../../entities/types';
import type { ResourcePowerTarget } from './resourcePowers';

export type CharacterPowerTarget = { kind: 'power' | 'equipment'; powerId?: string };

/** A missing existing target is a stale edit, not an instruction to add a power. */
export function replaceCharacterPower(character: ICharacter, target: CharacterPowerTarget, power: ICharacterPower): ICharacter | null {
  const key = target.kind === 'power' ? 'powers' : 'equipment';
  const powers = character[key] ?? [];
  if (target.powerId && !powers.some(item => item.id === target.powerId)) return null;
  const value = target.kind === 'equipment' ? { ...power, removable: 'none' as const } : power;
  return { ...character, [key]: target.powerId ? powers.map(item => item.id === target.powerId ? value : item) : [...powers, value] };
}

/** Shared by Resource save and budget preview; never touches a store or timestamps. */
export function replaceResourcePower(resource: IResource, target: ResourcePowerTarget, power: ICharacterPower): IResource | null {
  if (target.resourceId !== resource.id) return null;
  if (resource.type === 'vehicle') {
    if (target.kind === 'movement') {
      if (target.powerId && resource.movement?.id !== target.powerId) return null;
      return { ...resource, movement: power, movementReviewRequired: false };
    }
    if (target.kind !== 'system' || (target.powerId && !resource.systems.some(item => item.id === target.powerId))) return null;
    return { ...resource, systems: target.powerId ? resource.systems.map(item => item.id === target.powerId ? power : item) : [...resource.systems, power] };
  }
  if (resource.type === 'headquarters') {
    if (target.kind !== 'headquarters-effect' || (target.powerId && !resource.effects.some(item => item.id === target.powerId))) return null;
    return { ...resource, effects: target.powerId ? resource.effects.map(item => item.id === target.powerId ? power : item) : [...resource.effects, power] };
  }
  if (target.kind !== 'power' || (target.powerId && resource.power.id !== target.powerId)) return null;
  return { ...resource, power };
}
