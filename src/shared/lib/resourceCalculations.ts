import type {
  ICharacter,
  ICharacterPower,
  IHeadquartersResource,
  IResource,
  IVehicleResource,
  IModifierDef,
  IPowerEffect,
  ICharacterResourceLink,
} from '../../entities/types';
import { getPricingStrength } from './pricingStrength';
import { calcEquipmentEPCost, calculatePowerPricing } from './mathEngine';
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

function powerCost(
  power: ICharacterPower,
  powerDefs: IPowerEffect[] = POWER_DEFS,
  modifierDefs: IModifierDef[] = MODIFIER_DEFS,
  strength = 0
): number {
  return calcEquipmentEPCost(power, powerDefs, modifierDefs, strength);
}

export function getVehicleBaseTraits(size: IVehicleResource['size']) {
  return VEHICLE_BASES[size];
}

export function getVehicleResourceCost(
  resource: IVehicleResource,
  powerDefs: IPowerEffect[] = POWER_DEFS,
  modifierDefs: IModifierDef[] = MODIFIER_DEFS
): number {
  const base = VEHICLE_BASES[resource.size];
  const traits = base.size
    + Math.max(0, resource.strength - base.strength)
    + (resource.movement ? powerCost(resource.movement, powerDefs, modifierDefs, resource.strength) : Math.max(0, resource.speed))
    + Math.max(0, resource.defense - base.defense)
    + Math.max(0, resource.toughness - base.toughness)
    + resource.features.reduce((total, feature) => total + (feature.ranks ?? 1), 0);
  return Math.max(0, traits + resource.systems.reduce(
    (total, system) => total + powerCost(system, powerDefs, modifierDefs, resource.strength),
    0
  ));
}

export function getHeadquartersResourceCost(resource: IHeadquartersResource): number {
  const traits = HEADQUARTERS_SIZE_COST[resource.size]
    + Math.max(0, Math.ceil((resource.toughness - 6) / 2))
    + resource.features.reduce((total, feature) => total + (feature.ranks ?? 1), 0)
    // Effects are one-EP Features; their 2xPL budget is an advisory diagnostic.
    + resource.effects.length;
  return Math.max(0, traits);
}

export function getResourceEPCost(
  resource: IResource,
  powerDefs: IPowerEffect[] = POWER_DEFS,
  modifierDefs: IModifierDef[] = MODIFIER_DEFS,
  strength = 0
): number {
  if (isDeviceResource(resource)) return 0;
  if (resource.type === 'vehicle') return getVehicleResourceCost(resource, powerDefs, modifierDefs);
  if (resource.type === 'headquarters') return getHeadquartersResourceCost(resource);
  return powerCost(resource.power, powerDefs, modifierDefs, strength);
}

export function getCharacterResourceEPUsed(
  character: ICharacter,
  resources: IResource[],
  powerDefs: IPowerEffect[] = POWER_DEFS,
  modifierDefs: IModifierDef[] = MODIFIER_DEFS
): number {
  return getLinkedResourceCharges(character, resources, powerDefs, modifierDefs)
    .reduce((total, charge) => total + (charge.unit === 'EP' ? charge.charged : 0), 0);
}

export function isDeviceResource(resource: IResource): resource is Extract<IResource, { power: ICharacterPower }> & { costMode: 'device' } {
  return resource.type !== 'vehicle' && resource.type !== 'headquarters' && resource.costMode === 'device';
}

export function getResourceCost(resource: IResource, powerDefs: IPowerEffect[] = POWER_DEFS, modifierDefs: IModifierDef[] = MODIFIER_DEFS, strength = 0): { total: number; unit: 'PP' | 'EP' } {
  if (isDeviceResource(resource)) return { total: calculatePowerPricing(resource.power, powerDefs, modifierDefs, strength).total, unit: 'PP' };
  return { total: getResourceEPCost(resource, powerDefs, modifierDefs, strength), unit: 'EP' };
}

export interface LinkedResourceCharge {
  link: ICharacterResourceLink;
  resource: IResource;
  total: number;
  unit: 'PP' | 'EP';
  charged: number;
  alternate: boolean;
}

/** One authoritative allocation for UI, budgets, PDF and Excel. Shared HQs stay separate. */
export function getLinkedResourceCharges(character: ICharacter, resources: IResource[], powerDefs: IPowerEffect[] = POWER_DEFS, modifierDefs: IModifierDef[] = MODIFIER_DEFS): LinkedResourceCharge[] {
  const library = new Map(resources.map((resource) => [resource.id, resource]));
  const charges = (character.resourceLinks ?? []).flatMap((link): LinkedResourceCharge[] => {
    const resource = library.get(link.resourceId);
    if (!resource) return [];
    const cost = getResourceCost(resource, powerDefs, modifierDefs, getPricingStrength(character, resources));
    return [{ link, resource, ...cost, charged: link.isFree ? 0 : cost.unit === 'EP' ? link.contributionEP ?? cost.total : cost.total, alternate: false }];
  });
  const groups = new Map<string, LinkedResourceCharge[]>();
  for (const charge of charges) {
    if (!charge.link.alternateSetId || charge.link.isFree || charge.unit !== 'EP'
      || (charge.resource.type === 'headquarters' && charge.link.contributionEP !== undefined)) continue;
    const group = groups.get(charge.link.alternateSetId) ?? [];
    group.push(charge); groups.set(charge.link.alternateSetId, group);
  }
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const primary = group.reduce((highest, item) => item.charged > highest.charged ? item : highest);
    for (const charge of group) if (charge !== primary) { charge.charged = 1; charge.alternate = true; }
  }
  return charges;
}

export function getCharacterResourcePPUsed(character: ICharacter, resources: IResource[], powerDefs: IPowerEffect[] = POWER_DEFS, modifierDefs: IModifierDef[] = MODIFIER_DEFS): number {
  return getLinkedResourceCharges(character, resources, powerDefs, modifierDefs).reduce((total, charge) => total + (charge.unit === 'PP' ? charge.charged : 0), 0);
}

export function changeVehicleSize(resource: IVehicleResource, size: IVehicleResource['size']): IVehicleResource {
  const before = getVehicleBaseTraits(resource.size), after = getVehicleBaseTraits(size);
  return { ...resource, size,
    strength: after.strength + resource.strength - before.strength,
    toughness: after.toughness + resource.toughness - before.toughness,
    defense: after.defense + resource.defense - before.defense };
}

export function getResourceCostDetails(resource: IResource, strength = 0): Array<{ key?: string; name?: string; cost: number }> {
  if (resource.type === 'vehicle') {
    const base = getVehicleBaseTraits(resource.size);
    return [{ key: 'resources.size', cost: base.size },
      { key: 'resources.strengthShort', cost: Math.max(0, resource.strength - base.strength) },
      { key: 'resources.defense', cost: Math.max(0, resource.defense - base.defense) },
      { key: 'resources.toughness', cost: Math.max(0, resource.toughness - base.toughness) },
      { key: 'resources.movement', cost: resource.movement ? powerCost(resource.movement, undefined, undefined, resource.strength) : resource.speed },
      ...resource.features.map((feature) => ({ name: feature.name, cost: feature.ranks ?? 1 })),
      ...resource.systems.map((power) => ({ name: power.name, cost: powerCost(power, undefined, undefined, resource.strength) }))];
  }
  if (resource.type === 'headquarters') return [
    { key: 'resources.size', cost: HEADQUARTERS_SIZE_COST[resource.size] },
    { key: 'resources.toughness', cost: Math.max(0, Math.ceil((resource.toughness - 6) / 2)) },
    ...resource.features.map((feature) => ({ name: feature.name, cost: feature.ranks ?? 1 })),
    ...resource.effects.map((power) => ({ name: power.name, cost: 1 })),
  ];
  const price = calculatePowerPricing(resource.power, POWER_DEFS, MODIFIER_DEFS, strength);
  return [{ key: 'resources.effects', cost: price.mainCost },
    { key: 'resources.alternateGroup', cost: price.arrayCost - price.mainCost },
    { key: 'builder.activation', cost: -price.activationDiscount },
    ...(isDeviceResource(resource) ? [{ key: 'resources.removable', cost: -price.removableDiscount }] : [])];
}
