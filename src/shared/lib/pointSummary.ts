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
import { getCharacterResourceEPUsed } from './resourceCalculations';

export interface CharacterPointSummary {
  abilitiesCost: number;
  defensesCost: number;
  skillsCost: number;
  advantagesCost: number;
  powersCost: number;
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
    calculatePowerPricing(power, powerDefs, modifierDefs)
  );
  const powersCost = powerPricing.reduce((sum, pricing) => sum + pricing.total, 0);
  const totalSpent = abilitiesCost
    + defensesCost
    + skillsCost
    + advantagesCost
    + powersCost;
  const ppEarned = character.campaignMode
    ? (character.ppLog ?? []).reduce((sum, entry) => sum + entry.amount, 0)
    : 0;
  const totalAvailable = character.header.powerLevel * 15 + ppEarned;

  const equipmentPricing = (character.equipment ?? []).map((item) =>
    calculatePowerPricing(item, powerDefs, modifierDefs)
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
    ],
  };
}
