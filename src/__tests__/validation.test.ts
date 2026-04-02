import { describe, it, expect } from 'vitest';
import {
  validateAttackEffect,
  validateDodgeToughness,
  validateParryToughness,
  validateFortitudeWill,
  validateSkillCap,
} from '../shared/lib/validation';

describe('PL Validation', () => {
  const PL = 10;

  describe('validateAttackEffect', () => {
    it('passes when sum equals 2×PL', () => {
      expect(validateAttackEffect(10, 10, PL)).toBeNull();
    });
    it('fails when sum exceeds 2×PL', () => {
      const result = validateAttackEffect(12, 10, PL);
      expect(result).not.toBeNull();
      expect(result!.actual).toBe(22);
      expect(result!.limit).toBe(20);
    });
  });

  describe('validateDodgeToughness', () => {
    it('passes: 8 + 12 = 20', () => {
      expect(validateDodgeToughness(8, 12, PL)).toBeNull();
    });
    it('fails: 12 + 12 = 24', () => {
      expect(validateDodgeToughness(12, 12, PL)).not.toBeNull();
    });
  });

  describe('validateParryToughness', () => {
    it('fails: 13 + 8 = 21', () => {
      const result = validateParryToughness(13, 8, PL);
      expect(result).not.toBeNull();
    });
  });

  describe('validateFortitudeWill', () => {
    it('passes: 10 + 10 = 20', () => {
      expect(validateFortitudeWill(10, 10, PL)).toBeNull();
    });
  });

  describe('validateSkillCap', () => {
    it('non-combat: passes at PL + 10', () => {
      expect(validateSkillCap(5, 15, PL, false)).toBeNull();
    });
    it('non-combat: fails over PL + 10', () => {
      expect(validateSkillCap(5, 16, PL, false)).not.toBeNull();
    });
    it('combat: passes at 2×PL', () => {
      expect(validateSkillCap(8, 12, PL, true)).toBeNull();
    });
    it('combat: fails over 2×PL', () => {
      expect(validateSkillCap(10, 11, PL, true)).not.toBeNull();
    });
  });
});
