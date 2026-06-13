import { describe, it, expect } from 'vitest';
import { migrateAdvantage, migrateAdvantages } from '../shared/lib/powerMigration';
import type { IAdvantageDef } from '../entities/types';

describe('Advantage Migration with Subtype', () => {
  const mockAdvantageDefs: IAdvantageDef[] = [
    {
      id: 'second_chance',
      name: 'Second Chance',
      cost: 1,
      ranked: true,
      subtypeRequired: true,
      subtypePrompt: 'Choose a hazard:',
      allowMultiple: true,
    },
    {
      id: 'skill_mastery',
      name: 'Skill Mastery',
      cost: 1,
      ranked: false,
      subtypeRequired: false,
      allowMultiple: false,
    },
  ];

  it('should migrate advantage without subtype when definition does not require it', () => {
    const raw = { advantageId: 'skill_mastery', ranks: 1 };
    const result = migrateAdvantage(raw, mockAdvantageDefs);

    expect(result).toEqual({
      advantageId: 'skill_mastery',
      ranks: 1,
      subtype: null,
    });
  });

  it('should migrate advantage with existing subtype', () => {
    const raw = { advantageId: 'second_chance', ranks: 1, subtype: 'Falling' };
    const result = migrateAdvantage(raw, mockAdvantageDefs);

    expect(result).toEqual({
      advantageId: 'second_chance',
      ranks: 1,
      subtype: 'Falling',
    });
  });

  it('should apply default subtype when legacy advantage lacks subtype but definition requires it', () => {
    const raw = { advantageId: 'second_chance', ranks: 1 };
    const result = migrateAdvantage(raw, mockAdvantageDefs);

    expect(result).toEqual({
      advantageId: 'second_chance',
      ranks: 1,
      subtype: 'Unspecified',
    });
  });

  it('should apply default subtype when advantage has empty subtype but definition requires it', () => {
    const raw = { advantageId: 'second_chance', ranks: 1, subtype: '' };
    const result = migrateAdvantage(raw, mockAdvantageDefs);

    expect(result).toEqual({
      advantageId: 'second_chance',
      ranks: 1,
      subtype: 'Unspecified',
    });
  });

  it('should preserve null subtype when advantageDefs is not provided', () => {
    const raw = { advantageId: 'second_chance', ranks: 1 };
    const result = migrateAdvantage(raw);

    expect(result).toEqual({
      advantageId: 'second_chance',
      ranks: 1,
      subtype: null,
    });
  });

  it('should migrate multiple advantages correctly', () => {
    const rawAdvantages = [
      { advantageId: 'second_chance', ranks: 1 },
      { advantageId: 'skill_mastery', ranks: 1 },
      { advantageId: 'second_chance', ranks: 1, subtype: 'Fire' },
    ];

    const result = migrateAdvantages(rawAdvantages, mockAdvantageDefs);

    expect(result).toEqual([
      { advantageId: 'second_chance', ranks: 1, subtype: 'Unspecified' },
      { advantageId: 'skill_mastery', ranks: 1, subtype: null },
      { advantageId: 'second_chance', ranks: 1, subtype: 'Fire' },
    ]);
  });

  it('should handle unknown advantage IDs gracefully', () => {
    const raw = { advantageId: 'unknown_advantage', ranks: 1 };
    const result = migrateAdvantage(raw, mockAdvantageDefs);

    expect(result).toEqual({
      advantageId: 'unknown_advantage',
      ranks: 1,
      subtype: null,
    });
  });
});
