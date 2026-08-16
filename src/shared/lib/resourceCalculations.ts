import type {
  ICharacterPower,
  IHeadquartersResource,
  IResource,
  IVehicleResource,
} from '../../entities/types';
import { calcEquipmentEPCost } from './mathEngine';
import { MODIFIER_DEFS, POWER_DEFS } from '../../entities/gameDataLoaders';

const VEHICLE_BASES: Record<IVehicleResource['size'], { size: number; strength: number; toughness: number; defense: number }> = {
  medium: { size: 0, strength: 0, toughness: 5, defense: 0 },
  large: { size: 1, strength: 4, toughness: 7, defense: -1 },
  huge: { size: 2, strength: 8, toughness: 9, defense: -2 },
  gargantuan: { size: 3, strength: 12, toughness: 11, defense: -4 },
  colossal: { size: 4, strength: 16, toughness: 13, defense: -8 },
  awesome: { size: 5, strength: 20, toughness: 15, defense: -12 },
};

const HEADQUARTERS_SIZE_COST: Record<IHeadquartersResource['size'], number> = {
  miniscule: -4, fine: -3, diminutive: -2, tiny: -1, small: 0,
  medium: 1, large: 2, huge: 3, gargantuan: 4, colossal: 5, awesome: 6,
};

function powerCost(power: ICharacterPower): number {
  return calcEquipmentEPCost(power, POWER_DEFS, MODIFIER_DEFS);
}

export function getVehicleBaseTraits(size: IVehicleResource['size']) {
  return VEHICLE_BASES[size];
}

export function getVehicleResourceCost(resource: IVehicleResource): number {
  const base = VEHICLE_BASES[resource.size];
  const traits = base.size
    + Math.max(0, resource.strength - base.strength)
    + Math.max(0, resource.speed)
    + Math.max(0, resource.defense - base.defense)
    + Math.max(0, resource.toughness - base.toughness)
    + resource.features.reduce((total, feature) => total + (feature.ranks ?? 1), 0);
  return Math.max(0, traits + resource.systems.reduce((total, system) => total + powerCost(system), 0));
}

export function getHeadquartersResourceCost(resource: IHeadquartersResource): number {
  const traits = HEADQUARTERS_SIZE_COST[resource.size]
    + Math.max(0, Math.ceil((resource.toughness - 6) / 2))
    + resource.features.reduce((total, feature) => total + (feature.ranks ?? 1), 0)
    // Each HQ effect is a one-EP Feature; its PP value is validated separately.
    + resource.effects.length;
  return Math.max(0, traits);
}

export function getResourceEPCost(resource: IResource): number {
  if (resource.type === 'vehicle') return getVehicleResourceCost(resource);
  if (resource.type === 'headquarters') return getHeadquartersResourceCost(resource);
  return powerCost(resource.power);
}
