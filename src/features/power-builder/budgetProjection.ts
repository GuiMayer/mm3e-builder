import type { ICharacter, ICharacterPower, IModifierDef, IPowerEffect, IResource } from '../../entities/types';
import { MODIFIER_DEFS, POWER_DEFS } from '../../entities/gameDataLoaders';
import { calculateCharacterPointSummary } from '../../shared/lib/pointSummary';
import { replaceCharacterPower, replaceResourcePower, type CharacterPowerTarget } from '../../shared/lib/powerEditing';
import type { ResourcePowerTarget } from '../../shared/lib/resourcePowers';
import { calculatePowerPricing } from '../../shared/lib/mathEngine';
import { getCharacterStrength } from '../../shared/lib/componentRanks';
import { getResourceCost } from '../../shared/lib/resourceCalculations';

export type BudgetEditTarget = CharacterPowerTarget | { kind: 'resource'; target: ResourcePowerTarget };

export function projectPowerBudget(character: ICharacter, resources: IResource[], target: BudgetEditTarget, draft: ICharacterPower,
  powerDefs: IPowerEffect[] = POWER_DEFS, modifierDefs: IModifierDef[] = MODIFIER_DEFS) {
  let projectedCharacter = character;
  let projectedResources = resources;
  let oldCost = 0;
  let newCost = 0;
  let unit: 'PP' | 'EP' = target.kind === 'equipment' ? 'EP' : 'PP';
  if (target.kind === 'resource') {
    const original = resources.find(resource => resource.id === target.target.resourceId);
    const replacement = original && replaceResourcePower(original, target.target, draft);
    if (!original || !replacement) return null;
    projectedResources = resources.map(resource => resource.id === original.id ? replacement : resource);
    const before = getResourceCost(original, powerDefs, modifierDefs, getCharacterStrength(character));
    const after = getResourceCost(replacement, powerDefs, modifierDefs, getCharacterStrength(character));
    oldCost = before.total; newCost = after.total; unit = after.unit;
  } else {
    const replacement = replaceCharacterPower(character, target, draft);
    if (!replacement) return null;
    projectedCharacter = replacement;
    const original = (target.kind === 'power' ? character.powers : character.equipment ?? []).find(power => power.id === target.powerId);
    const pricing = calculatePowerPricing(draft, powerDefs, modifierDefs, getCharacterStrength(character));
    const previous = original && calculatePowerPricing(original, powerDefs, modifierDefs, getCharacterStrength(character));
    oldCost = previous ? (unit === 'PP' ? previous.total : previous.equipmentTotal) : 0;
    newCost = unit === 'PP' ? pricing.total : pricing.equipmentTotal;
  }
  const before = calculateCharacterPointSummary(character, resources, powerDefs, modifierDefs);
  const after = calculateCharacterPointSummary(projectedCharacter, projectedResources, powerDefs, modifierDefs);
  return { before, after, oldCost, newCost, unit, difference: newCost - oldCost,
    linked: target.kind !== 'resource' || !!character.resourceLinks?.some(link => link.resourceId === target.target.resourceId) };
}

/** Exclude presentation text and editing identities from expensive projection inputs. */
export function powerBudgetSignature(power: ICharacterPower): string {
  const component = (value: ICharacterPower['components'][number]) => ({ ...value, modifiers: value.modifiers.map(modifier => ({ ...modifier, instanceId: undefined, options: { ...modifier.options, note: undefined } })) });
  return JSON.stringify({ ...power, name: '', notes: '', descriptors: [], components: power.components.map(component), alternateEffects: power.alternateEffects.map(alternate => ({ ...alternate, name: '', notes: '', components: alternate.components.map(component) })) });
}
