import { useMemo } from 'react';
import { useCharStore } from '../../store/charStore';
import { useAppStore } from '../../store/appStore';
import { POWER_DEFS } from '../../entities/gameDataLoaders';
import {
  validateDodgeToughness,
  validateParryToughness,
  validateFortitudeWill,
  validateAttackEffect,
  type PLViolation,
} from '../lib/validation';

/**
 * Hook that returns current PL violations in real time.
 * Empty array when Strict Mode is OFF.
 *
 * Validates:
 * - Dodge + Toughness <= PL×2
 * - Parry + Toughness <= PL×2
 * - Fortitude + Will <= PL×2
 * - For each power with an "attack" type component: rank <= PL×2
 *   (attackBonus defaults to 0 — the builder doesn't track per-power attack bonuses)
 */
export function usePLValidation(): PLViolation[] {
  const character = useCharStore((s) => s.character);
  const strictMode = useAppStore((s) => s.strictMode);

  return useMemo(() => {
    if (!strictMode) return [];

    const pl = character.header.powerLevel;
    const abilities = character.abilities;
    const defenses = character.defenses;

    const dodgeTotal      = abilities.agl + defenses.dodge;
    const parryTotal      = abilities.fgt + defenses.parry;
    const fortitudeTotal  = abilities.sta + defenses.fortitude;
    const willTotal       = abilities.awe + defenses.will;
    const toughnessTotal  = abilities.sta;

    const violations: PLViolation[] = [];

    const v1 = validateDodgeToughness(dodgeTotal, toughnessTotal, pl);
    if (v1) violations.push(v1);

    const v2 = validateParryToughness(parryTotal, toughnessTotal, pl);
    if (v2) violations.push(v2);

    const v3 = validateFortitudeWill(fortitudeTotal, willTotal, pl);
    if (v3) violations.push(v3);

    // Check attack-type power components against PL cap (attack + rank <= PL*2)
    // attackBonus = 0 is the conservative assumption — the builder doesn't track bonuses per power.
    for (const power of character.powers) {
      const attackComponents = power.components.filter((comp) => {
        const def = POWER_DEFS.find((d) => d.id === comp.effectId);
        return def?.type === 'attack';
      });

      if (attackComponents.length === 0) continue;

      const highestRank = attackComponents.reduce((max, c) => Math.max(max, c.ranks), 0);
      const v = validateAttackEffect(0, highestRank, pl);
      if (v) {
        // Annotate formula with the power name for clarity
        violations.push({
          ...v,
          formula: `${power.name || 'Power'}: 0 + ${highestRank} = ${highestRank} > ${pl * 2}`,
        });
      }
    }

    return violations;
  }, [character, strictMode]);
}

