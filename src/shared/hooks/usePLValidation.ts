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
  type PLViolation,
} from '../lib/validation';
import { getActiveValidationRules } from '../lib/validationRules';

/**
 * Hook that returns current PL violations in real time.
 * Empty array when enforcePLLimits is disabled.
 *
 * Validates:
 * - Dodge + Toughness <= PL×2   (real Toughness: STA + Protection + Defensive Roll)
 * - Parry + Toughness <= PL×2
 * - Fortitude + Will  <= PL×2
 * - Attack-type power components: attackBonus + rank <= PL×2
 * - Close Combat / Ranged Combat skill totals <= PL×2
 */
export function usePLValidation(): PLViolation[] {
  // Use specific selectors instead of subscribing to the entire character object
  // This prevents unnecessary re-renders when unrelated parts of character change
  const powerLevel = useCharStore((s) => s.character.header.powerLevel);
  const abilities = useCharStore((s) => s.character.abilities);
  const defenses = useCharStore((s) => s.character.defenses);
  const powers = useCharStore((s) => s.character.powers);
  const skills = useCharStore((s) => s.character.skills);
  const advantages = useCharStore((s) => s.character.advantages);
  const validationRules = useAppStore((s) => s.validationRules);

  return useMemo(() => {
    // Check if PL limits are enforced
    const activeRules = getActiveValidationRules(validationRules);
    if (!activeRules.enforcePLLimits) return [];

    const pl = powerLevel;

    const dodgeTotal     = abilities.agl + defenses.dodge;
    const parryTotal     = abilities.fgt + defenses.parry;
    const fortitudeTotal = abilities.sta + defenses.fortitude;
    const willTotal      = abilities.awe + defenses.will;

    // ── Real Toughness: STA + Protection powers + Defensive Roll ──
    const { bonus: toughnessBonus } = calcToughnessBonus(
      powers,
      advantages,
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

    // ── Attack-type power components ──────────────────────────────
    for (const power of powers) {
      const attackComponents = power.components.filter((comp) => {
        const def = POWER_DEFS.find((d) => d.id === comp.effectId);
        return def?.type === 'attack';
      });

      if (attackComponents.length === 0) continue;

      const primaryComp = attackComponents.reduce((a, b) => (a.ranks >= b.ranks ? a : b));
      const primaryDef  = POWER_DEFS.find((d) => d.id === primaryComp.effectId)!;
      const highestRank = primaryComp.ranks;

      // F-12: use real derived attack bonus
      // Build a minimal character object for calcAttackBonus
      const charForCalc = { abilities, skills, powers, advantages };
      const { value: attackBonus, isNoRoll } = calcAttackBonus(
        primaryDef.range,
        power.name,
        primaryComp,
        charForCalc,
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
        continue;
      }

      const atkVal = attackBonus ?? 0;
      const v = validateAttackEffect(atkVal, highestRank, pl);
      if (v) {
        violations.push({
          ...v,
          formula: `${power.name || 'Power'}: ${atkVal} + ${highestRank} = ${atkVal + highestRank} > ${pl * 2}`,
        });
      }
    }

    // ── Combat skill caps ─────────────────────────────────────────
    // Close Combat and Ranged Combat: total (abilityBase + ranks) <= PL×2
    // Other skills: total <= PL + 10
    for (const skillEntry of skills) {
      const def = SKILL_DEFS.find((d) => d.id === skillEntry.skillId);
      if (!def) continue;

      const isCombatSkill = def.id === 'close_combat' || def.id === 'ranged_combat';
      const abilityBase = abilities[def.baseAbility] ?? 0;
      const v = validateSkillCap(abilityBase, skillEntry.ranks, pl, isCombatSkill);

      if (v) {
        const label = skillEntry.subtype
          ? `${def.name}: ${skillEntry.subtype}`
          : def.name;
        violations.push({
          ...v,
          formula: `${label}: ${abilityBase} + ${skillEntry.ranks} = ${abilityBase + skillEntry.ranks} > ${isCombatSkill ? pl * 2 : pl + 10}`,
        });
      }
    }

    return violations;
  }, [powerLevel, abilities, defenses, powers, skills, advantages, validationRules]);
}
