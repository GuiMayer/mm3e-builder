import { useMemo } from 'react';
import { useCharStore } from '../../store/charStore';
import { useAppStore } from '../../store/appStore';
import {
  validateDodgeToughness,
  validateParryToughness,
  validateFortitudeWill,
  type PLViolation,
} from '../lib/validation';

/**
 * Hook that returns current PL violations in real time.
 * Empty array when Strict Mode is OFF.
 */
export function usePLValidation(): PLViolation[] {
  const character = useCharStore((s) => s.character);
  const strictMode = useAppStore((s) => s.strictMode);

  return useMemo(() => {
    if (!strictMode) return [];

    const pl = character.header.powerLevel;
    const abilities = character.abilities;
    const defenses = character.defenses;

    // Calculate total defenses (base ability + bought ranks)
    const dodgeTotal = abilities.agl + defenses.dodge;
    const parryTotal = abilities.fgt + defenses.parry;
    const fortitudeTotal = abilities.sta + defenses.fortitude;
    const willTotal = abilities.awe + defenses.will;
    // Toughness = sta + protection effects (simplified for now)
    const toughnessTotal = abilities.sta;

    const violations: PLViolation[] = [];

    const v1 = validateDodgeToughness(dodgeTotal, toughnessTotal, pl);
    if (v1) violations.push(v1);

    const v2 = validateParryToughness(parryTotal, toughnessTotal, pl);
    if (v2) violations.push(v2);

    const v3 = validateFortitudeWill(fortitudeTotal, willTotal, pl);
    if (v3) violations.push(v3);

    return violations;
  }, [character, strictMode]);
}
