import { describe, it, expect } from 'vitest';
import type { ICharacter, IAdvantageDef } from '../entities/types';
import { validateCharacterSemantics } from '../shared/lib/semanticValidation';
import advantages from '../data/advantages.json';
import skills from '../data/skills.json';

describe('Advantage Subtypes', () => {
  const mockCharacter: ICharacter = {
    version: '1.9.0',
    characterName: 'Test Hero',
    playerName: '',
    powerLevel: 10,
    heroPoints: 1,
    abilities: { str: 0, sta: 0, agl: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
    defenses: { dodge: 0, parry: 0, fortitude: 0, will: 0 },
    skills: [],
    advantages: [],
    powers: [],
    equipment: [],
    complications: [],
  };

  describe('Data Integrity — advantages.json subtype fields', () => {
    it('advantages with allowMultiple should have subtypePrompt', () => {
      const multipleAdvantages = advantages.filter((adv) => adv.allowMultiple);
      
      multipleAdvantages.forEach((adv) => {
        expect(
          adv.subtypePrompt,
          `Advantage "${adv.name}" has allowMultiple but no subtypePrompt`
        ).toBeTruthy();
      });
    });

    it('skill-based advantages should have appropriate subtype configuration', () => {
      const skillAdvantages = [
        'skill_mastery',
        'fascinate',
      ];

      skillAdvantages.forEach((id) => {
        const adv = advantages.find((a) => a.id === id);
        expect(adv, `Skill advantage "${id}" not found`).toBeDefined();
        expect(adv?.allowMultiple, `"${adv?.name}" should allow multiple instances`).toBe(true);
        expect(adv?.subtypePrompt, `"${adv?.name}" should have subtypePrompt`).toBeTruthy();
      });
    });

    it('Improved Critical should be in hybrid mode', () => {
      const improvedCrit = advantages.find((a) => a.id === 'improved_critical');
      expect(improvedCrit?.allowMultiple).toBe(true);
      expect(improvedCrit?.hybridMode).toBe(true);
      expect(improvedCrit?.ranked).toBe(true);
    });
  });

  describe('Validation — subtypeRequired enforcement', () => {
    it('should error when subtypeRequired advantage has no subtype', () => {
      const testChar: ICharacter = {
        ...mockCharacter,
        advantages: [
          { advantageId: 'skill_mastery', ranks: 1, subtype: null },
        ],
      };

      const issues = validateCharacterSemantics(testChar, {
        powerDefs: [],
        modifierDefs: [],
        skillDefs: skills,
        advantageDefs: advantages as IAdvantageDef[],
      });

      const subtypeIssue = issues.find((i) => i.path.includes('advantages.0.subtype'));
      expect(subtypeIssue).toBeDefined();
      expect(subtypeIssue?.severity).toBe('error');
      expect(subtypeIssue?.message).toContain('requires a subtype');
    });

    it('should error when subtypeRequired advantage has empty subtype', () => {
      const testChar: ICharacter = {
        ...mockCharacter,
        advantages: [
          { advantageId: 'fascinate', ranks: 1, subtype: '   ' },
        ],
      };

      const issues = validateCharacterSemantics(testChar, {
        powerDefs: [],
        modifierDefs: [],
        skillDefs: skills,
        advantageDefs: advantages as IAdvantageDef[],
      });

      const subtypeIssue = issues.find((i) => i.path.includes('advantages.0.subtype'));
      expect(subtypeIssue).toBeDefined();
      expect(subtypeIssue?.severity).toBe('error');
    });

    it('should pass when subtypeRequired advantage has valid subtype', () => {
      const testChar: ICharacter = {
        ...mockCharacter,
        advantages: [
          { advantageId: 'skill_mastery', ranks: 1, subtype: 'Acrobatics' },
        ],
      };

      const issues = validateCharacterSemantics(testChar, {
        powerDefs: [],
        modifierDefs: [],
        skillDefs: skills,
        advantageDefs: advantages as IAdvantageDef[],
      });

      const subtypeIssues = issues.filter((i) => i.path.includes('advantages.0.subtype'));
      expect(subtypeIssues).toHaveLength(0);
    });
  });

  describe('Validation — skill-based subtype validation', () => {
    it('should warn when skill-based advantage has invalid skill name', () => {
      const testChar: ICharacter = {
        ...mockCharacter,
        advantages: [
          { advantageId: 'fascinate', ranks: 1, subtype: 'InvalidSkillName' },
        ],
      };

      const issues = validateCharacterSemantics(testChar, {
        powerDefs: [],
        modifierDefs: [],
        skillDefs: skills,
        advantageDefs: advantages as IAdvantageDef[],
      });

      const subtypeIssue = issues.find((i) => i.path.includes('advantages.0.subtype'));
      expect(subtypeIssue).toBeDefined();
      expect(subtypeIssue?.severity).toBe('warning');
      expect(subtypeIssue?.message).toContain('must be a valid skill name');
    });

    it('should pass when skill-based advantage has valid skill name', () => {
      const testChar: ICharacter = {
        ...mockCharacter,
        advantages: [
          { advantageId: 'fascinate', ranks: 1, subtype: 'Deception' },
        ],
      };

      const issues = validateCharacterSemantics(testChar, {
        powerDefs: [],
        modifierDefs: [],
        skillDefs: skills,
        advantageDefs: advantages as IAdvantageDef[],
      });

      const subtypeIssues = issues.filter((i) => i.path.includes('advantages.0.subtype'));
      expect(subtypeIssues).toHaveLength(0);
    });

    it('should handle case-insensitive skill name matching', () => {
      const testChar: ICharacter = {
        ...mockCharacter,
        advantages: [
          { advantageId: 'skill_mastery', ranks: 1, subtype: 'acrobatics' },
        ],
      };

      const issues = validateCharacterSemantics(testChar, {
        powerDefs: [],
        modifierDefs: [],
        skillDefs: skills,
        advantageDefs: advantages as IAdvantageDef[],
      });

      const subtypeIssues = issues.filter((i) => i.path.includes('advantages.0.subtype'));
      expect(subtypeIssues).toHaveLength(0);
    });
  });

  describe('Multiple Instances — same advantage with different subtypes', () => {
    it('should allow multiple instances of Skill Mastery with different subtypes', () => {
      const testChar: ICharacter = {
        ...mockCharacter,
        advantages: [
          { advantageId: 'skill_mastery', ranks: 1, subtype: 'Acrobatics' },
          { advantageId: 'skill_mastery', ranks: 1, subtype: 'Stealth' },
          { advantageId: 'skill_mastery', ranks: 1, subtype: 'Athletics' },
        ],
      };

      const issues = validateCharacterSemantics(testChar, {
        powerDefs: [],
        modifierDefs: [],
        skillDefs: skills,
        advantageDefs: advantages as IAdvantageDef[],
      });

      const subtypeIssues = issues.filter((i) => i.path.includes('subtype'));
      expect(subtypeIssues).toHaveLength(0);
    });

    it('should allow multiple instances of Improved Critical (hybrid mode)', () => {
      const testChar: ICharacter = {
        ...mockCharacter,
        advantages: [
          { advantageId: 'improved_critical', ranks: 2, subtype: 'Unarmed Attack' },
          { advantageId: 'improved_critical', ranks: 1, subtype: 'Sword Strike' },
        ],
      };

      const issues = validateCharacterSemantics(testChar, {
        powerDefs: [],
        modifierDefs: [],
        skillDefs: skills,
        advantageDefs: advantages as IAdvantageDef[],
      });

      const subtypeIssues = issues.filter((i) => i.path.includes('subtype'));
      expect(subtypeIssues).toHaveLength(0);
    });
  });

  describe('Advantages without subtype requirements', () => {
    it('should pass for advantages that do not require subtypes', () => {
      const testChar: ICharacter = {
        ...mockCharacter,
        advantages: [
          { advantageId: 'defensive_roll', ranks: 3, subtype: null },
          { advantageId: 'evasion', ranks: 2, subtype: null },
          { advantageId: 'luck', ranks: 1, subtype: null },
        ],
      };

      const issues = validateCharacterSemantics(testChar, {
        powerDefs: [],
        modifierDefs: [],
        skillDefs: skills,
        advantageDefs: advantages as IAdvantageDef[],
      });

      const advantageIssues = issues.filter((i) => i.path.includes('advantages'));
      expect(advantageIssues).toHaveLength(0);
    });

    it('should not validate skill names for non-skill-based advantages with subtypes', () => {
      const testChar: ICharacter = {
        ...mockCharacter,
        advantages: [
          { advantageId: 'improved_critical', ranks: 1, subtype: 'Custom Power Name' },
        ],
      };

      const issues = validateCharacterSemantics(testChar, {
        powerDefs: [],
        modifierDefs: [],
        skillDefs: skills,
        advantageDefs: advantages as IAdvantageDef[],
      });

      // Improved Critical is not skill-based, so any subtype string is valid
      const subtypeIssues = issues.filter((i) => i.path.includes('subtype'));
      expect(subtypeIssues).toHaveLength(0);
    });
  });
});
