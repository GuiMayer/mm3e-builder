import type {
  ICharacter,
  IModifierDef,
  IPowerEffect,
  IResource,
} from '../../entities/types';
import {
  calculateAbilitiesCost,
  calculateAdvantagesCost,
  calculateDefensesCost,
  calculatePowerPricing,
  calculateSkillsCost,
  type PowerPricing,
  type PricingDiagnostic,
} from './mathEngine';
import { getPricingStrength } from './pricingStrength';
import { getCharacterResourceEPUsed, getCharacterResourcePPUsed, isDeviceResource } from './resourceCalculations';
import { campaignInitialPP } from './campaign';

export interface CharacterPointSummary {
  abilitiesCost: number;
  defensesCost: number;
  skillsCost: number;
  advantagesCost: number;
  powersCost: number;
  resourcePPUsed: number;
  totalSpent: number;
  ppEarned: number;
  totalAvailable: number;
  remaining: number;
  equipmentRanks: number;
  equipmentEPLimit: number;
  legacyEPUsed: number;
  resourceEPUsed: number;
  totalEPUsed: number;
  powerPricing: PowerPricing[];
  equipmentPricing: PowerPricing[];
  diagnostics: PricingDiagnostic[];
}

/** A bounded cache shared by UI consumers; unrelated text edits preserve identity. */
export function createCharacterPointSummarySelector(powerDefs: IPowerEffect[], modifierDefs: IModifierDef[]) {
  let previous: unknown[] = [];
  let summary: CharacterPointSummary | undefined;
  return (character: ICharacter, resources: IResource[]): CharacterPointSummary => {
    const inputs = [character.abilities, character.absentAbilities, character.defenses,
      character.skills, character.advantages, character.powers, character.equipment,
      character.resourceLinks, character.header.powerLevel, character.campaignMode,
      character.ppLog, character.campaign, resources];
    if (!summary || inputs.some((value, index) => value !== previous[index])) {
      summary = calculateCharacterPointSummary(character, resources, powerDefs, modifierDefs);
      previous = inputs;
    }
    return summary;
  };
}

/** Canonical point summary for the sheet, Resources and every export surface. */
export function calculateCharacterPointSummary(
  character: ICharacter,
  resources: IResource[],
  powerDefs: IPowerEffect[],
  modifierDefs: IModifierDef[]
): CharacterPointSummary {
  const abilitiesCost = calculateAbilitiesCost(
    character.abilities,
    character.absentAbilities
  );
  const defensesCost = calculateDefensesCost(character.defenses);
  const totalSkillRanks = character.skills.reduce(
    (sum, skill) => sum + skill.ranks,
    0
  );
  const skillsCost = calculateSkillsCost(totalSkillRanks);
  const advantagesCost = calculateAdvantagesCost(character.advantages);
  const powerPricing = character.powers.map((power) =>
    calculatePowerPricing(power, powerDefs, modifierDefs, getPricingStrength(character, resources))
  );
  const resourcePPUsed = getCharacterResourcePPUsed(character, resources, powerDefs, modifierDefs);
  const powersCost = powerPricing.reduce((sum, pricing) => sum + pricing.total, 0) + resourcePPUsed;
  const totalSpent = abilitiesCost
    + defensesCost
    + skillsCost
    + advantagesCost
    + powersCost;
  const ppEarned = character.campaignMode
    ? (character.ppLog ?? []).reduce((sum, entry) => sum + entry.amount, 0)
    : 0;
  const totalAvailable = (character.campaignMode ? campaignInitialPP(character) : character.header.powerLevel * 15) + ppEarned;

  const equipmentPricing = (character.equipment ?? []).map((item) =>
    calculatePowerPricing(item, powerDefs, modifierDefs, getPricingStrength(character, resources))
  );
  const legacyEPUsed = equipmentPricing.reduce(
    (sum, pricing) => sum + pricing.equipmentTotal,
    0
  );
  const resourceEPUsed = getCharacterResourceEPUsed(
    character,
    resources,
    powerDefs,
    modifierDefs
  );
  const equipmentRanks = character.advantages.find(
    (advantage) => advantage.advantageId === 'equipment'
  )?.ranks ?? 0;

  return {
    abilitiesCost,
    defensesCost,
    skillsCost,
    advantagesCost,
    powersCost,
    resourcePPUsed,
    totalSpent,
    ppEarned,
    totalAvailable,
    remaining: totalAvailable - totalSpent,
    equipmentRanks,
    equipmentEPLimit: equipmentRanks * 5,
    legacyEPUsed,
    resourceEPUsed,
    totalEPUsed: legacyEPUsed + resourceEPUsed,
    powerPricing,
    equipmentPricing,
    diagnostics: [
      ...powerPricing.flatMap((pricing) => pricing.diagnostics),
      ...equipmentPricing.flatMap((pricing) => pricing.diagnostics),
      ...resources.filter((resource) => isDeviceResource(resource) && (character.resourceLinks ?? []).some((link) => !link.isFree && link.resourceId === resource.id)).flatMap((resource) =>
        isDeviceResource(resource) ? calculatePowerPricing(resource.power, powerDefs, modifierDefs, getPricingStrength(character, resources)).diagnostics : []),
    ],
  };
}
