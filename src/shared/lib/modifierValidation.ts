/* ================================================
   Modifier Validation — M&M 3e Rules Enforcement
   Validates modifier combinations, ranks, and PL limits.
   Reference: Hero's Handbook p.137-140, Modifiers p.187+
   ================================================ */

import type {
  IAppliedModifier,
  IModifierDef,
  ICharacterPowerComponent,
  IPowerEffect,
} from '../../entities/types';
import type { IValidationRules } from '../../entities/types';
import { resolveModifierDefinition } from './rulesCatalog';

export interface ModifierViolation {
  type: 'incompatible' | 'duplicate_modifier' | 'max_ranks' | 'accurate_pl_cap' | 'power_specific';
  modifierId: string;
  message: string;
  severity: 'error' | 'warning';
  reference?: string;  // Page reference from official book
}

/**
 * Validate that applied modifiers don't violate incompatibility rules.
 * Reference: Each modifier's incompatibleWith field
 */
export function validateIncompatibleModifiers(
  appliedModifiers: IAppliedModifier[],
  modifierDefs: IModifierDef[]
): ModifierViolation[] {
  const violations: ModifierViolation[] = [];
  const appliedIds = new Set(appliedModifiers.map((m) => m.modifierId));

  for (const applied of appliedModifiers) {
    const def = modifierDefs.find((d) => d.id === applied.modifierId);
    if (!def || !def.incompatibleWith || def.incompatibleWith.length === 0) continue;

    for (const incompatibleId of def.incompatibleWith) {
      if (appliedIds.has(incompatibleId)) {
        const incompatibleDef = modifierDefs.find((d) => d.id === incompatibleId);
        violations.push({
          type: 'incompatible',
          modifierId: applied.modifierId,
          message: `${def.name} is incompatible with ${incompatibleDef?.name || incompatibleId}`,
          severity: 'error',
          reference: 'Modifiers p.187',
        });
      }
    }
  }

  return violations;
}

/**
 * Validate that modifiers respect their maxRanks limits.
 * Reference: Each modifier's maxRanks field
 */
export function validateModifierMaxRanks(
  appliedModifiers: IAppliedModifier[],
  modifierDefs: IModifierDef[]
): ModifierViolation[] {
  const violations: ModifierViolation[] = [];

  for (const applied of appliedModifiers) {
    const def = modifierDefs.find((d) => d.id === applied.modifierId);
    if (!def || def.maxRanks === undefined) continue;

    if (applied.ranks > def.maxRanks) {
      violations.push({
        type: 'max_ranks',
        modifierId: applied.modifierId,
        message: `${def.name} exceeds maximum ranks (${applied.ranks} > ${def.maxRanks})`,
        severity: 'error',
        reference: def.id === 'accurate' ? 'Hero\'s Handbook p.137' : undefined,
      });
    }
  }

  return violations;
}

/**
 * Validate that a component does not contain the same modifier entry twice.
 * Ranked modifiers should be represented by one entry with ranks > 1.
 */
export function validateDuplicateModifiers(
  appliedModifiers: IAppliedModifier[],
  modifierDefs: IModifierDef[]
): ModifierViolation[] {
  const violations: ModifierViolation[] = [];
  const counts = new Map<string, number>();

  for (const applied of appliedModifiers) {
    counts.set(applied.modifierId, (counts.get(applied.modifierId) ?? 0) + 1);
  }

  for (const [modifierId, count] of counts.entries()) {
    if (count <= 1) continue;
    const def = modifierDefs.find((d) => d.id === modifierId);
    violations.push({
      type: 'duplicate_modifier',
      modifierId,
      message: `${def?.name || modifierId} appears ${count} times. Use ranks instead of duplicate entries.`,
      severity: 'error',
      reference: 'Hero\'s Handbook p.137',
    });
  }

  return violations;
}

/**
 * Validate that Accurate modifier respects PL limits.
 * Rule: Attack bonus + Effect rank ≤ PL × 2
 * Accurate adds +2 per rank to attack bonus.
 * 
 * Reference: Hero's Handbook p.24 (PL limits), p.137 (Accurate)
 */
export function validateAccuratePLCap(
  component: ICharacterPowerComponent,
  effectDef: IPowerEffect,
  baseAttackBonus: number,
  powerLevel: number
): ModifierViolation[] {
  const violations: ModifierViolation[] = [];

  // Only applies to attack-type effects
  if (effectDef.type !== 'attack') return violations;

  // Find Accurate modifier
  const accurateMod = component.modifiers.find((m) => m.modifierId === 'accurate');
  if (!accurateMod) return violations;

  // Calculate total attack bonus with Accurate
  const accurateBonus = accurateMod.ranks * 2;
  const totalAttackBonus = baseAttackBonus + accurateBonus;
  const effectRank = component.ranks;

  // Check PL limit
  const total = totalAttackBonus + effectRank;
  const limit = powerLevel * 2;

  if (total > limit) {
    violations.push({
      type: 'accurate_pl_cap',
      modifierId: 'accurate',
      message: `Accurate causes PL violation: attack ${totalAttackBonus} + effect ${effectRank} = ${total} > ${limit} (PL ${powerLevel})`,
      severity: 'error',
      reference: 'Hero\'s Handbook p.24, p.137',
    });
  }

  return violations;
}

/**
 * Validate that applied modifiers are valid for the specific power effect.
 * Checks if modifiers are either universal OR power-specific for this effect.
 * 
 * Reference: Each power's extras/flaws arrays in powers.json
 */
export function validatePowerSpecificModifiers(
  component: ICharacterPowerComponent,
  effectDef: IPowerEffect,
  universalModifierDefs: IModifierDef[]
): ModifierViolation[] {
  const violations: ModifierViolation[] = [];

  // Build set of valid modifier IDs for this power
  const validModifierIds = new Set<string>();

  // Add all universal modifiers
  universalModifierDefs.forEach((mod) => validModifierIds.add(mod.id));

  // Add power-specific modifiers
  if (effectDef.extras) {
    effectDef.extras.forEach((extra) => validModifierIds.add(extra.id));
  }
  if (effectDef.flaws) {
    effectDef.flaws.forEach((flaw) => validModifierIds.add(flaw.id));
  }

  // Check each applied modifier
  for (const applied of component.modifiers) {
    if (!validModifierIds.has(applied.modifierId)) {
      // Find the modifier definition to get its name
      const modDef = universalModifierDefs.find((m) => m.id === applied.modifierId);
      const modName = modDef?.name || applied.modifierId;

      violations.push({
        type: 'power_specific',
        modifierId: applied.modifierId,
        message: `${modName} is not valid for ${effectDef.name}. This modifier is not in the power's extras/flaws list.`,
        severity: 'warning',
        reference: 'Hero\'s Handbook Powers chapter',
      });
    }
  }

  return violations;
}

/**
 * Validate all modifier rules for a component.
 * Returns violations based on active validation rules.
 */
export function validateComponentModifiers(
  component: ICharacterPowerComponent,
  effectDef: IPowerEffect,
  modifierDefs: IModifierDef[],
  validationRules: IValidationRules,
  baseAttackBonus: number = 0,
  powerLevel: number = 10
): ModifierViolation[] {
  const violations: ModifierViolation[] = [];
  const resolvedModifierDefs = component.modifiers
    .map((applied) => resolveModifierDefinition(
      applied,
      effectDef,
      modifierDefs
    ).definition)
    .filter((definition): definition is IModifierDef => definition !== undefined);

  // Check incompatible modifiers
  if (validationRules.enforceIncompatibleModifiers) {
    violations.push(...validateIncompatibleModifiers(component.modifiers, resolvedModifierDefs));
  }

  // Check duplicate modifier entries
  if (validationRules.enforceDuplicateModifiers) {
    violations.push(...validateDuplicateModifiers(component.modifiers, resolvedModifierDefs));
  }

  // Check max ranks
  if (validationRules.enforceModifierMaxRanks) {
    violations.push(...validateModifierMaxRanks(component.modifiers, resolvedModifierDefs));
  }

  // Check Accurate PL cap
  if (validationRules.enforceAccuratePLCap) {
    violations.push(
      ...validateAccuratePLCap(component, effectDef, baseAttackBonus, powerLevel)
    );
  }

  // Check power-specific modifiers
  if (validationRules.enforcePowerSpecificModifiers) {
    violations.push(...validatePowerSpecificModifiers(component, effectDef, modifierDefs));
  }

  return violations;
}

/**
 * Get a human-readable summary of modifier violations.
 */
export function formatModifierViolations(violations: ModifierViolation[]): string {
  if (violations.length === 0) return '';

  const errors = violations.filter((v) => v.severity === 'error');
  const warnings = violations.filter((v) => v.severity === 'warning');

  let summary = '';
  if (errors.length > 0) {
    summary += `${errors.length} modifier error(s):\n`;
    errors.forEach((v) => {
      summary += `  • ${v.message}`;
      if (v.reference) summary += ` (${v.reference})`;
      summary += '\n';
    });
  }
  if (warnings.length > 0) {
    summary += `${warnings.length} modifier warning(s):\n`;
    warnings.forEach((v) => {
      summary += `  • ${v.message}`;
      if (v.reference) summary += ` (${v.reference})`;
      summary += '\n';
    });
  }

  return summary.trim();
}
