import { describe, it, expect } from 'vitest';
import {
  validateAfflictionCondition,
  validateAfflictionProgression,
  validateAfflictionResistance,
  validateAffliction,
  AFFLICTION_CONDITIONS,
  describeAfflictionConditions,
  type AfflictionConfig,
} from '../shared/lib/afflictionValidation';
import { DEFAULT_VALIDATION_RULES } from '../shared/lib/validationRules';

/* ================================================
   Affliction Validation Tests
   Tests validate Affliction condition progression rules.
   Reference: Hero's Handbook p.149 (Powers chapter)
   ================================================ */

// ══════════════════════════════════════════════════════
//  Affliction Condition Validation by Degree
//  Reference: Hero's Handbook p.149
// ══════════════════════════════════════════════════════

describe('Affliction Condition Validation (M&M 3e p.149)', () => {
  describe('Degree 1 Conditions', () => {
    it('accepts valid degree 1 conditions', () => {
      const validConditions = ['dazed', 'entranced', 'fatigued', 'hindered', 'impaired', 'vulnerable'];
      
      validConditions.forEach((condition) => {
        const violation = validateAfflictionCondition(condition, 1);
        expect(violation).toBeNull();
      });
    });

    it('rejects degree 2 condition in degree 1 slot', () => {
      const violation = validateAfflictionCondition('stunned', 1);
      
      expect(violation).not.toBeNull();
      expect(violation?.type).toBe('invalid_condition');
      expect(violation?.degree).toBe(1);
      expect(violation?.message).toContain('stunned');
      expect(violation?.message).toContain('degree 1');
    });

    it('rejects degree 3 condition in degree 1 slot', () => {
      const violation = validateAfflictionCondition('controlled', 1);
      
      expect(violation).not.toBeNull();
      expect(violation?.type).toBe('invalid_condition');
      expect(violation?.degree).toBe(1);
    });

    it('rejects invalid condition name', () => {
      const violation = validateAfflictionCondition('confused', 1);
      
      expect(violation).not.toBeNull();
      expect(violation?.message).toContain('not a valid');
    });
  });

  describe('Degree 2 Conditions', () => {
    it('accepts valid degree 2 conditions', () => {
      const validConditions = ['compelled', 'defenseless', 'disabled', 'exhausted', 'immobile', 'prone', 'stunned'];
      
      validConditions.forEach((condition) => {
        const violation = validateAfflictionCondition(condition, 2);
        expect(violation).toBeNull();
      });
    });

    it('rejects degree 1 condition in degree 2 slot', () => {
      const violation = validateAfflictionCondition('dazed', 2);
      
      expect(violation).not.toBeNull();
      expect(violation?.type).toBe('invalid_condition');
      expect(violation?.degree).toBe(2);
    });

    it('rejects degree 3 condition in degree 2 slot', () => {
      const violation = validateAfflictionCondition('paralyzed', 2);
      
      expect(violation).not.toBeNull();
      expect(violation?.degree).toBe(2);
    });
  });

  describe('Degree 3 Conditions', () => {
    it('accepts valid degree 3 conditions', () => {
      const validConditions = ['asleep', 'controlled', 'incapacitated', 'paralyzed', 'transformed', 'unaware'];
      
      validConditions.forEach((condition) => {
        const violation = validateAfflictionCondition(condition, 3);
        expect(violation).toBeNull();
      });
    });

    it('rejects degree 1 condition in degree 3 slot', () => {
      const violation = validateAfflictionCondition('fatigued', 3);
      
      expect(violation).not.toBeNull();
      expect(violation?.degree).toBe(3);
    });

    it('rejects degree 2 condition in degree 3 slot', () => {
      const violation = validateAfflictionCondition('stunned', 3);
      
      expect(violation).not.toBeNull();
      expect(violation?.degree).toBe(3);
    });
  });
});

// ══════════════════════════════════════════════════════
//  Affliction Progression Validation
// ══════════════════════════════════════════════════════

describe('Affliction Progression Validation', () => {
  describe('validateAfflictionProgression', () => {
    it('accepts valid progression: fatigued -> exhausted -> incapacitated', () => {
      const config: AfflictionConfig = {
        resistance: 'fortitude',
        degree1Condition: 'fatigued',
        degree2Condition: 'exhausted',
        degree3Condition: 'incapacitated',
      };

      const violations = validateAfflictionProgression(config);
      expect(violations.length).toBe(0);
    });

    it('accepts valid progression: dazed -> stunned -> incapacitated', () => {
      const config: AfflictionConfig = {
        resistance: 'will',
        degree1Condition: 'dazed',
        degree2Condition: 'stunned',
        degree3Condition: 'incapacitated',
      };

      const violations = validateAfflictionProgression(config);
      expect(violations.length).toBe(0);
    });

    it('accepts valid progression: hindered -> immobile -> paralyzed', () => {
      const config: AfflictionConfig = {
        resistance: 'fortitude',
        degree1Condition: 'hindered',
        degree2Condition: 'immobile',
        degree3Condition: 'paralyzed',
      };

      const violations = validateAfflictionProgression(config);
      expect(violations.length).toBe(0);
    });

    it('rejects invalid condition in degree 1', () => {
      const config: AfflictionConfig = {
        resistance: 'fortitude',
        degree1Condition: 'stunned', // Wrong degree
        degree2Condition: 'exhausted',
        degree3Condition: 'incapacitated',
      };

      const violations = validateAfflictionProgression(config);
      expect(violations.length).toBeGreaterThan(0);
      expect(violations.some((v) => v.degree === 1 && v.type === 'invalid_condition')).toBe(true);
    });

    it('rejects invalid condition in degree 2', () => {
      const config: AfflictionConfig = {
        resistance: 'fortitude',
        degree1Condition: 'fatigued',
        degree2Condition: 'paralyzed', // Wrong degree
        degree3Condition: 'incapacitated',
      };

      const violations = validateAfflictionProgression(config);
      expect(violations.some((v) => v.degree === 2 && v.type === 'invalid_condition')).toBe(true);
    });

    it('warns about duplicate conditions across degrees', () => {
      const config: AfflictionConfig = {
        resistance: 'fortitude',
        degree1Condition: 'fatigued',
        degree2Condition: 'fatigued', // Duplicate
        degree3Condition: 'incapacitated',
      };

      const violations = validateAfflictionProgression(config);
      expect(violations.some((v) => v.type === 'invalid_progression')).toBe(true);
      expect(violations.some((v) => v.message.includes('unique'))).toBe(true);
    });
  });
});

// ══════════════════════════════════════════════════════
//  Affliction Resistance Validation
// ══════════════════════════════════════════════════════

describe('Affliction Resistance Validation', () => {
  describe('validateAfflictionResistance', () => {
    it('accepts Fortitude resistance', () => {
      const config: AfflictionConfig = {
        resistance: 'fortitude',
        degree1Condition: 'fatigued',
        degree2Condition: 'exhausted',
        degree3Condition: 'incapacitated',
      };

      const violation = validateAfflictionResistance(config);
      expect(violation).toBeNull();
    });

    it('accepts Will resistance', () => {
      const config: AfflictionConfig = {
        resistance: 'will',
        degree1Condition: 'dazed',
        degree2Condition: 'stunned',
        degree3Condition: 'incapacitated',
      };

      const violation = validateAfflictionResistance(config);
      expect(violation).toBeNull();
    });

    it('accepts Dodge with Alternate Resistance extra', () => {
      const config: AfflictionConfig = {
        resistance: 'dodge',
        degree1Condition: 'vulnerable',
        degree2Condition: 'defenseless',
        degree3Condition: 'incapacitated',
        alternateResistance: true,
      };

      const violation = validateAfflictionResistance(config);
      expect(violation).toBeNull();
    });

    it('rejects Dodge without Alternate Resistance extra', () => {
      const config: AfflictionConfig = {
        resistance: 'dodge',
        degree1Condition: 'vulnerable',
        degree2Condition: 'defenseless',
        degree3Condition: 'incapacitated',
        alternateResistance: false,
      };

      const violation = validateAfflictionResistance(config);
      expect(violation).not.toBeNull();
      expect(violation?.type).toBe('invalid_resistance');
      expect(violation?.message).toContain('Alternate Resistance');
    });

    it('rejects Dodge when alternateResistance is undefined', () => {
      const config: AfflictionConfig = {
        resistance: 'dodge',
        degree1Condition: 'vulnerable',
        degree2Condition: 'defenseless',
        degree3Condition: 'incapacitated',
      };

      const violation = validateAfflictionResistance(config);
      expect(violation).not.toBeNull();
    });
  });
});

// ══════════════════════════════════════════════════════
//  Integrated Affliction Validation
// ══════════════════════════════════════════════════════

describe('Integrated Affliction Validation', () => {
  describe('validateAffliction', () => {
    it('validates complete valid Affliction', () => {
      const config: AfflictionConfig = {
        resistance: 'fortitude',
        degree1Condition: 'fatigued',
        degree2Condition: 'exhausted',
        degree3Condition: 'incapacitated',
      };

      const violations = validateAffliction(config, DEFAULT_VALIDATION_RULES);
      expect(violations.length).toBe(0);
    });

    it('detects multiple violations in one Affliction', () => {
      const config: AfflictionConfig = {
        resistance: 'dodge', // Missing alternateResistance
        degree1Condition: 'stunned', // Wrong degree
        degree2Condition: 'exhausted',
        degree3Condition: 'incapacitated',
      };

      // Enable Affliction validation to detect all violations
      const strictRules = {
        ...DEFAULT_VALIDATION_RULES,
        enforceAfflictionProgression: true,
      };

      const violations = validateAffliction(config, strictRules);
      expect(violations.length).toBeGreaterThan(1);
      expect(violations.some((v) => v.type === 'invalid_resistance')).toBe(true);
      expect(violations.some((v) => v.type === 'invalid_condition')).toBe(true);
    });

    it('respects validation rules configuration', () => {
      const config: AfflictionConfig = {
        resistance: 'fortitude',
        degree1Condition: 'stunned', // Invalid
        degree2Condition: 'exhausted',
        degree3Condition: 'incapacitated',
      };

      // Disable Affliction validation
      const permissiveRules = {
        ...DEFAULT_VALIDATION_RULES,
        enforceAfflictionProgression: false,
      };

      const violations = validateAffliction(config, permissiveRules);
      expect(violations.length).toBe(0); // No violations when rule disabled
    });
  });
});

// ══════════════════════════════════════════════════════
//  Helper Functions
// ══════════════════════════════════════════════════════

describe('Affliction Helper Functions', () => {
  describe('describeAfflictionConditions', () => {
    it('describes degree 1 conditions', () => {
      const description = describeAfflictionConditions(1);
      expect(description).toContain('dazed');
      expect(description).toContain('fatigued');
      expect(description).toContain('vulnerable');
    });

    it('describes degree 2 conditions', () => {
      const description = describeAfflictionConditions(2);
      expect(description).toContain('stunned');
      expect(description).toContain('exhausted');
      expect(description).toContain('defenseless');
    });

    it('describes degree 3 conditions', () => {
      const description = describeAfflictionConditions(3);
      expect(description).toContain('incapacitated');
      expect(description).toContain('paralyzed');
      expect(description).toContain('controlled');
    });
  });

  describe('AFFLICTION_CONDITIONS constant', () => {
    it('has 6 degree 1 conditions', () => {
      expect(AFFLICTION_CONDITIONS.degree1.length).toBe(6);
    });

    it('has 7 degree 2 conditions', () => {
      expect(AFFLICTION_CONDITIONS.degree2.length).toBe(7);
    });

    it('has 6 degree 3 conditions', () => {
      expect(AFFLICTION_CONDITIONS.degree3.length).toBe(6);
    });

    it('has no duplicate conditions across degrees', () => {
      const allConditions = [
        ...AFFLICTION_CONDITIONS.degree1,
        ...AFFLICTION_CONDITIONS.degree2,
        ...AFFLICTION_CONDITIONS.degree3,
      ];
      const uniqueConditions = new Set(allConditions);
      expect(uniqueConditions.size).toBe(allConditions.length);
    });
  });
});

// ══════════════════════════════════════════════════════
//  Real-World Affliction Examples
// ══════════════════════════════════════════════════════

describe('Real-World Affliction Examples', () => {
  it('Poison: fatigued -> exhausted -> incapacitated (Fortitude)', () => {
    const config: AfflictionConfig = {
      resistance: 'fortitude',
      degree1Condition: 'fatigued',
      degree2Condition: 'exhausted',
      degree3Condition: 'incapacitated',
    };

    const violations = validateAffliction(config, DEFAULT_VALIDATION_RULES);
    expect(violations.length).toBe(0);
  });

  it('Mind Control: dazed -> compelled -> controlled (Will)', () => {
    const config: AfflictionConfig = {
      resistance: 'will',
      degree1Condition: 'dazed',
      degree2Condition: 'compelled',
      degree3Condition: 'controlled',
    };

    const violations = validateAffliction(config, DEFAULT_VALIDATION_RULES);
    expect(violations.length).toBe(0);
  });

  it('Paralysis: hindered -> immobile -> paralyzed (Fortitude)', () => {
    const config: AfflictionConfig = {
      resistance: 'fortitude',
      degree1Condition: 'hindered',
      degree2Condition: 'immobile',
      degree3Condition: 'paralyzed',
    };

    const violations = validateAffliction(config, DEFAULT_VALIDATION_RULES);
    expect(violations.length).toBe(0);
  });

  it('Sleep Gas: fatigued -> stunned -> asleep (Fortitude)', () => {
    const config: AfflictionConfig = {
      resistance: 'fortitude',
      degree1Condition: 'fatigued',
      degree2Condition: 'stunned',
      degree3Condition: 'asleep',
    };

    const violations = validateAffliction(config, DEFAULT_VALIDATION_RULES);
    expect(violations.length).toBe(0);
  });

  it('Blinding Light: impaired -> disabled -> unaware (Dodge -> Fortitude)', () => {
    const config: AfflictionConfig = {
      resistance: 'dodge',
      degree1Condition: 'impaired',
      degree2Condition: 'disabled',
      degree3Condition: 'unaware',
      alternateResistance: true,
    };

    const violations = validateAffliction(config, DEFAULT_VALIDATION_RULES);
    expect(violations.length).toBe(0);
  });
});
