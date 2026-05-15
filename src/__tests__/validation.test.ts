import { describe, it, expect } from 'vitest';
import {
  validateAttackEffect,
  validateDodgeToughness,
  validateParryToughness,
  validateFortitudeWill,
  validateSkillCap,
  validateLuckAdvantage,
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
    it('passes at PL + 10 (official rule for ALL skills)', () => {
      expect(validateSkillCap(5, 15, PL)).toBeNull();
    });
    it('fails over PL + 10', () => {
      expect(validateSkillCap(5, 16, PL)).not.toBeNull();
    });
    it('combat skills also follow PL + 10 (not 2×PL)', () => {
      // Close Combat and Ranged Combat follow the same PL+10 rule
      expect(validateSkillCap(8, 12, PL)).toBeNull(); // 8 + 12 = 20 = PL+10 ✓
      expect(validateSkillCap(10, 11, PL)).not.toBeNull(); // 10 + 11 = 21 > PL+10 ✗
    });
  });

  describe('validateLuckAdvantage', () => {
    it('passes when Luck equals PL ÷ 2', () => {
      expect(validateLuckAdvantage(5, PL)).toBeNull();
    });
    it('passes when Luck is below PL ÷ 2', () => {
      expect(validateLuckAdvantage(3, PL)).toBeNull();
    });
    it('fails when Luck exceeds PL ÷ 2', () => {
      const result = validateLuckAdvantage(6, PL);
      expect(result).not.toBeNull();
      expect(result!.actual).toBe(6);
      expect(result!.limit).toBe(5);
    });
    it('handles odd PL correctly (rounds down)', () => {
      expect(validateLuckAdvantage(5, 11)).toBeNull(); // 11 ÷ 2 = 5.5 → 5
      expect(validateLuckAdvantage(6, 11)).not.toBeNull();
    });
  });
});
