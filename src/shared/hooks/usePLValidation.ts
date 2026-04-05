import { useMemo } from 'react';
import { useCharStore } from '../../store/charStore';
import { useAppStore } from '../../store/appStore';
import { POWER_DEFS, SKILL_DEFS } from '../../entities/gameDataLoaders';
import { calcToughnessBonus } from '../lib/mathEngine';
import {
  validateDodgeToughness,
  validateParryToughness,
  validateFortitudeWill,
  validateAttackEffect,
  validateSkillCap,
  type PLViolation,
} from '../lib/validation';

/**
 * Hook that returns current PL violations in real time.
 * Empty array when Strict Mode is OFF.
 *
 * Validates:
 * - Dodge + Toughness <= PL×2   (real Toughness: STA + Protection + Defensive Roll)
 * - Parry + Toughness <= PL×2
 * - Fortitude + Will  <= PL×2
 * - Attack-type power components: attackBonus + rank <= PL×2
 * - Close Combat / Ranged Combat skill totals <= PL×2
 */
export function usePLValidation(): PLViolation[] {
  const character  = useCharStore((s) => s.character);
  const strictMode = useAppStore((s) => s.strictMode);

  return useMemo(() => {
    if (!strictMode) return [];

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

    // ── Attack-type power components ──────────────────────────────
    // attackBonus = 0 is conservative — builder doesn't track per-power attack bonuses here
    for (const power of character.powers) {
      const attackComponents = power.components.filter((comp) => {
        const def = POWER_DEFS.find((d) => d.id === comp.effectId);
        return def?.type === 'attack';
      });

      if (attackComponents.length === 0) continue;

      const highestRank = attackComponents.reduce((max, c) => Math.max(max, c.ranks), 0);
      const v = validateAttackEffect(0, highestRank, pl);
      if (v) {
        violations.push({
          ...v,
          formula: `${power.name || 'Power'}: 0 + ${highestRank} = ${highestRank} > ${pl * 2}`,
        });
      }
    }

    // ── Combat skill caps ─────────────────────────────────────────
    // Close Combat and Ranged Combat: total (abilityBase + ranks) <= PL×2
    // Other skills: total <= PL + 10
    for (const skillEntry of character.skills) {
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
  }, [character, strictMode]);
}
