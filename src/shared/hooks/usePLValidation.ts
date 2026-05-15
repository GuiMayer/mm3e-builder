import { useMemo } from 'react';
import { useCharStore } from '../../store/charStore';
import { useAppStore } from '../../store/appStore';
import { POWER_DEFS, SKILL_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { calcToughnessBonus } from '../lib/mathEngine';
import { calcAttackBonus } from '../lib/offenseSummary';
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
  const character  = useCharStore((s) => s.character);
  const validationRules = useAppStore((s) => s.validationRules);

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

    // ── Attack-type power components (main powers + AEs) ──────────
    for (const power of character.powers) {
      // Validate main power components
      const attackComponents = power.components.filter((comp) => {
        const def = POWER_DEFS.find((d) => d.id === comp.effectId);
        return def?.type === 'attack';
      });

      if (attackComponents.length > 0) {
        const primaryComp = attackComponents.reduce((a, b) => (a.ranks >= b.ranks ? a : b));
        const primaryDef  = POWER_DEFS.find((d) => d.id === primaryComp.effectId)!;
        const highestRank = primaryComp.ranks;

        // F-12: use real derived attack bonus
        const { value: attackBonus, isNoRoll } = calcAttackBonus(
          primaryDef.range,
          power.name,
          primaryComp,
          character,
          SKILL_DEFS,
          MODIFIER_DEFS
        );

        // No-roll attacks (perception/area) cap at PL (not 2×PL)
        if (isNoRoll) {
          if (highestRank > pl) {
            violations.push({
              rule: 'pl.attack',
              formula: `${power.name || 'Power'} [no-roll]: rank ${highestRank} > PL ${pl}`,
              actual: highestRank,
              limit: pl,
            });
          }
        } else {
          const atkVal = attackBonus ?? 0;
          const v = validateAttackEffect(atkVal, highestRank, pl);
          if (v) {
            violations.push({
              ...v,
              formula: `${power.name || 'Power'}: ${atkVal} + ${highestRank} = ${atkVal + highestRank} > ${pl * 2}`,
            });
          }
        }
      }

      // Validate Alternate Effects
      if (power.alternateEffects) {
        for (const ae of power.alternateEffects) {
          const aeAttackComponents = ae.components.filter((comp) => {
            const def = POWER_DEFS.find((d) => d.id === comp.effectId);
            return def?.type === 'attack';
          });

          if (aeAttackComponents.length === 0) continue;

          const primaryComp = aeAttackComponents.reduce((a, b) => (a.ranks >= b.ranks ? a : b));
          const primaryDef  = POWER_DEFS.find((d) => d.id === primaryComp.effectId)!;
          const highestRank = primaryComp.ranks;

          const { value: attackBonus, isNoRoll } = calcAttackBonus(
            primaryDef.range,
            ae.name,
            primaryComp,
            character,
            SKILL_DEFS,
            MODIFIER_DEFS
          );

          // No-roll attacks (perception/area) cap at PL (not 2×PL)
          if (isNoRoll) {
            if (highestRank > pl) {
              violations.push({
                rule: 'pl.attack',
                formula: `${power.name} (AE: ${ae.name}) [no-roll]: rank ${highestRank} > PL ${pl}`,
                actual: highestRank,
                limit: pl,
              });
            }
          } else {
            const atkVal = attackBonus ?? 0;
            const v = validateAttackEffect(atkVal, highestRank, pl);
            if (v) {
              violations.push({
                ...v,
                formula: `${power.name} (AE: ${ae.name}): ${atkVal} + ${highestRank} = ${atkVal + highestRank} > ${pl * 2}`,
              });
            }
          }
        }
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
      const v = validateSkillCap(abilityBase, skillEntry.ranks, pl);

      if (v) {
        const label = skillEntry.subtype
          ? `${def.name}: ${skillEntry.subtype}`
          : def.name;
        violations.push({
          ...v,
          formula: `${label}: ${abilityBase} + ${skillEntry.ranks} = ${abilityBase + skillEntry.ranks} > ${pl + 10}`,
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
  }, [character, validationRules]);
}
