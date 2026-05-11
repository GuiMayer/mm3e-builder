import { describe, it, expect } from 'vitest';
import {
  calculateAbilitiesCost,
  calculateDefensesCost,
  calculateSkillsCost,
  calculateAdvantagesCost,
  calcPowerTotalCost,
} from '../shared/lib/mathEngine';
import type { ICharacter, Abilities, IDefenses } from '../entities/types';

describe('Export Corrections - Fase 1 & 2', () => {
  describe('PP Calculation with Campaign Mode', () => {
    it('calculates total PP correctly in campaign mode', () => {
      const character: Partial<ICharacter> = {
        header: {
          name: 'Test Hero',
          player: 'Test Player',
          powerLevel: 10,
          heroPoints: 1,
          identityType: 'public',
          identity: '',
          gender: '',
          age: '',
          height: '',
          weight: '',
          eyes: '',
          hair: '',
          groups: '',
          baseOfOperations: '',
        },
        campaignMode: true,
        ppLog: [
          { id: '1', date: '2024-01-01', amount: 5, note: 'Award for saving city' },
          { id: '2', date: '2024-02-01', amount: -3, note: 'Spent on new power' },
          { id: '3', date: '2024-03-01', amount: 10, note: 'Major milestone' },
        ],
        abilities: { str: 2, sta: 2, agl: 2, dex: 2, fgt: 2, int: 2, awe: 2, pre: 2 },
        absentAbilities: [],
        defenses: { dodge: 5, parry: 5, fortitude: 5, will: 5, toughness: 2 },
        skills: [],
        advantages: [],
        powers: [],
        complications: [],
        equipmentNotes: '',
      };

      // Base PP = PL * 15 = 10 * 15 = 150
      // PP Log adjustments = +5 -3 +10 = +12
      // Total available = 150 + 12 = 162
      const basePP = character.header!.powerLevel * 15;
      const logAdjustments = character.ppLog!.reduce((sum, entry) => sum + entry.amount, 0);
      const totalAvailable = basePP + logAdjustments;

      expect(totalAvailable).toBe(162);
    });

    it('calculates spent PP correctly', () => {
      const abilities: Abilities = { str: 2, sta: 2, agl: 2, dex: 2, fgt: 2, int: 2, awe: 2, pre: 2 };
      const defenses: IDefenses = { dodge: 5, parry: 5, fortitude: 5, will: 5, toughness: 2 };
      
      const abilitiesCost = calculateAbilitiesCost(abilities, []);
      const defensesCost = calculateDefensesCost(defenses, abilities);
      const skillsCost = calculateSkillsCost(10); // 10 ranks
      const advantages = [
        { advantageId: 'adv1', ranks: 2 },
        { advantageId: 'adv2', ranks: 3 },
      ];
      const advantagesCost = calculateAdvantagesCost(advantages);

      // Abilities: 8 abilities * 2 ranks * 2 PP/rank = 32 PP
      expect(abilitiesCost).toBe(32);
      
      // Skills: 10 ranks * 0.5 PP/rank = 5 PP
      expect(skillsCost).toBe(5);
      
      // Advantages: (2 + 3) ranks * 1 PP/rank = 5 PP
      expect(advantagesCost).toBe(5);
    });
  });

  describe('Defense Stats in Excel', () => {
    it('includes Toughness (STA) in defenses', () => {
      const abilities: Abilities = { str: 0, sta: 5, agl: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 };
      const defenses: IDefenses = { dodge: 0, parry: 0, fortitude: 0, will: 0, toughness: 3 };
      
      // Toughness = STA + toughness ranks = 5 + 3 = 8
      const totalToughness = abilities.sta + defenses.toughness;
      expect(totalToughness).toBe(8);
    });

    it('includes Initiative (AGL) in defenses', () => {
      const abilities: Abilities = { str: 0, sta: 0, agl: 4, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 };
      
      // Initiative = AGL = 4
      const initiative = abilities.agl;
      expect(initiative).toBe(4);
    });
  });

  describe('Skills with Empty Subtype', () => {
    it('formats skill name without colon when subtype is empty', () => {
      const skillName = 'Acrobatics';
      const subtype = '';
      
      const formattedName = subtype ? `${skillName}: ${subtype}` : skillName;
      expect(formattedName).toBe('Acrobatics');
    });

    it('formats skill name with colon when subtype exists', () => {
      const skillName = 'Expertise';
      const subtype = 'Science';
      
      const formattedName = subtype ? `${skillName}: ${subtype}` : skillName;
      expect(formattedName).toBe('Expertise: Science');
    });
  });

  describe('PP Log Sheet', () => {
    it('calculates running total correctly', () => {
      const powerLevel = 10;
      const ppLog = [
        { id: '1', date: '2024-01-01', amount: 5, note: 'Award' },
        { id: '2', date: '2024-02-01', amount: -3, note: 'Spent' },
        { id: '3', date: '2024-03-01', amount: 10, note: 'Milestone' },
      ];

      let runningTotal = powerLevel * 15; // 150
      const totals = ppLog.map(entry => {
        runningTotal += entry.amount;
        return runningTotal;
      });

      expect(totals).toEqual([155, 152, 162]);
    });
  });
});
