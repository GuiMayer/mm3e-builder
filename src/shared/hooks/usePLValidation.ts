import { useMemo } from 'react';
import { useActiveCharacter } from './useActiveCharacter';
import { useAppStore } from '../../store/appStore';
import { POWER_DEFS, SKILL_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { calcToughnessBonus } from '../lib/mathEngine';
import { buildTargetedEffectProfiles } from '../lib/offenseSummary';
import {
  validateDodgeToughness,
  validateParryToughness,
  validateFortitudeWill,
  validateAttackEffect,
  validateSkillCap,
  validateLuckAdvantage,
  type PLViolation,
} from '../lib/validation';
import { getActiveValidationRules } from '../lib/validationRules';
import { useResourcesStore } from '../../store/resourcesStore';

/**
 * Hook that returns current PL violations in real time.
 * Empty array when enforcePLLimits is disabled.
 *
 * Validates (per M&M 3e Hero's Handbook p.24-25):
 * - Dodge + Toughness <= PL×2   (real Toughness: STA + Protection + Defensive Roll)
 * - Parry + Toughness <= PL×2
 * - Fortitude + Will  <= PL×2
 * - Attack-type power components: attackBonus + rank <= PL×2
 * - ALL skills (including Close Combat / Ranged Combat): total <= PL+10
 * - Luck advantage: ranks <= PL÷2 (rounded down)
 */
export function usePLValidation(): PLViolation[] {
  const { character } = useActiveCharacter();
  const validationRules = useAppStore((s) => s.validationRules);
  const resources = useResourcesStore((state) => state.resources);

  return useMemo(() => {
    // Check if PL limits are enforced
    const activeRules = getActiveValidationRules(validationRules);
    if (!activeRules.enforcePLLimits) return [];

    const pl        = character.header.powerLevel;
    const abilities = character.abilities;
    const defenses  = character.defenses;

    const dodgeTotal     = abilities.agl + defenses.dodge;
    const parryTotal     = abilities.fgt + defenses.parry;
    const fortitudeTotal = abilities.sta + defenses.fortitude;
    const willTotal      = abilities.awe + defenses.will;

    // ── Real Toughness: STA + Protection powers + Defensive Roll ──
    const { bonus: toughnessBonus } = calcToughnessBonus(
      character.powers,
      character.advantages,
      POWER_DEFS
    );
    const toughnessTotal = abilities.sta + toughnessBonus;

    const violations: PLViolation[] = [];

    const v1 = validateDodgeToughness(dodgeTotal, toughnessTotal, pl);
    if (v1) violations.push(v1);

    const v2 = validateParryToughness(parryTotal, toughnessTotal, pl);
    if (v2) violations.push(v2);

    const v3 = validateFortitudeWill(fortitudeTotal, willTotal, pl);
    if (v3) violations.push(v3);

    // ── Targeted effects (powers, equipment, AEs, manual and unarmed) ───────
    // The sheet, PDF and validation consume this same mechanical derivation.
    const profiles = buildTargetedEffectProfiles(character, POWER_DEFS, SKILL_DEFS, [], MODIFIER_DEFS, undefined, resources);
    for (const profile of profiles) {
      if (!profile.causesResistance || profile.effectRank === null) continue;
      const label = profile.name || profile.componentName || 'Targeted effect';

      if (!profile.requiresAttackCheck) {
        if (profile.effectRank > pl) {
          violations.push({
            rule: 'pl.attack',
            formula: `${label} [no attack roll]: rank ${profile.effectRank} > PL ${pl}`,
            actual: profile.effectRank,
            limit: pl,
          });
        }
        continue;
      }

      const attackBonus = profile.bonusValue ?? 0;
      const violation = validateAttackEffect(attackBonus, profile.effectRank, pl);
      if (violation) {
        violations.push({
          ...violation,
          formula: `${label}: ${attackBonus} + ${profile.effectRank} = ${attackBonus + profile.effectRank} > ${pl * 2}`,
        });
      }
    }

    // ── Skill caps (ALL skills follow PL+10 per official rules) ──────
    // Official M&M 3e rule (Hero's Handbook p.24):
    // "Your hero's total modifier with any skill cannot exceed the series power level +10."
    // Note: The book does NOT distinguish between combat and non-combat skills.
    for (const skillEntry of character.skills) {
      const def = SKILL_DEFS.find((d) => d.id === skillEntry.skillId);
      if (!def) continue;

      const abilityBase = abilities[def.baseAbility] ?? 0;
      const otherBonus = skillEntry.otherBonus ?? 0;
      const totalBonusRanks = skillEntry.ranks + otherBonus;
      const v = validateSkillCap(abilityBase, totalBonusRanks, pl);

      if (v) {
        const label = skillEntry.subtype
          ? `${def.name}: ${skillEntry.subtype}`
          : def.name;
        violations.push({
          ...v,
          formula: `${label}: ${abilityBase} + ${skillEntry.ranks} + ${otherBonus} = ${abilityBase + totalBonusRanks} > ${pl + 10}`,
        });
      }
    }

    // ── Luck advantage validation ─────────────────────────────────
    const luckAdvantage = character.advantages.find((a) => a.advantageId === 'luck');
    if (luckAdvantage) {
      const v = validateLuckAdvantage(luckAdvantage.ranks, pl);
      if (v) violations.push(v);
    }

    return violations;
  }, [character, resources, validationRules]);
}
