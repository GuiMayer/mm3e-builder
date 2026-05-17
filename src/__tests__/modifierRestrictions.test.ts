import { describe, it, expect } from 'vitest';
import {
  validateIncompatibleModifiers,
  validateDuplicateModifiers,
  validateModifierMaxRanks,
  validateAccuratePLCap,
  validateComponentModifiers,
} from '../shared/lib/modifierValidation';
import { DEFAULT_VALIDATION_RULES } from '../shared/lib/validationRules';
import type {
  IAppliedModifier,
  IModifierDef,
  ICharacterPowerComponent,
  IPowerEffect,
} from '../entities/types';

// ── Mock modifier definitions ──
const MOCK_MODIFIERS: IModifierDef[] = [
  {
    id: 'ranged',
    name: 'Ranged',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Changes range from close to ranged',
    incompatibleWith: ['close_only'],
  },
  {
    id: 'close_only',
    name: 'Close Only',
    category: 'flaw',
    costType: 'per_rank',
    costValue: -1,
    description: 'Restricts to close range',
    incompatibleWith: ['ranged', 'increased_range'],
  },
  {
    id: 'increased_range',
    name: 'Increased Range',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Increases range by one step',
    incompatibleWith: ['close_only', 'diminished_range'],
  },
  {
    id: 'diminished_range',
    name: 'Diminished Range',
    category: 'flaw',
    costType: 'per_rank',
    costValue: -1,
    description: 'Decreases range by one step',
    incompatibleWith: ['increased_range'],
  },
  {
    id: 'accurate',
    name: 'Accurate',
    category: 'extra',
    costType: 'flat_ranked',
    costValue: 1,
    maxRanks: 5,
    description: '+2 attack bonus per rank',
    incompatibleWith: [],
  },
  {
    id: 'area',
    name: 'Area',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Affects an area',
    incompatibleWith: [],
  },
  {
    id: 'selective',
    name: 'Selective',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Choose targets in area',
    incompatibleWith: [],
  },
];

const MOCK_DAMAGE_EFFECT: IPowerEffect = {
  id: 'damage',
  name: 'Damage',
  type: 'attack',
  baseCost: 1,
  action: 'standard',
  range: 'close',
  duration: 'instant',
  description: 'Inflicts damage',
  variableCost: null,
  extras: [],
  flaws: [],
};

// ══════════════════════════════════════════════════════
//  Modifier Incompatibility Rules (M&M 3e Modifiers p.187)
// ══════════════════════════════════════════════════════

describe('Modifier Incompatibility Rules', () => {
  describe('validateIncompatibleModifiers', () => {
    it('prevents Ranged + Close Only on same component', () => {
      const mods: IAppliedModifier[] = [
        { modifierId: 'ranged', ranks: 1 },
        { modifierId: 'close_only', ranks: 1 },
      ];

      const violations = validateIncompatibleModifiers(mods, MOCK_MODIFIERS);

      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0].type).toBe('incompatible');
      expect(violations[0].severity).toBe('error');
    });

    it('prevents Increased Range + Diminished Range', () => {
      const mods: IAppliedModifier[] = [
        { modifierId: 'increased_range', ranks: 1 },
        { modifierId: 'diminished_range', ranks: 1 },
      ];

      const violations = validateIncompatibleModifiers(mods, MOCK_MODIFIERS);

      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0].type).toBe('incompatible');
    });

    it('allows compatible modifier combinations', () => {
      const mods: IAppliedModifier[] = [
        { modifierId: 'ranged', ranks: 1 },
        { modifierId: 'area', ranks: 1 },
        { modifierId: 'selective', ranks: 1 },
      ];

      const violations = validateIncompatibleModifiers(mods, MOCK_MODIFIERS);

      expect(violations.length).toBe(0);
    });

    it('allows single modifier (no conflicts possible)', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'ranged', ranks: 1 }];

      const violations = validateIncompatibleModifiers(mods, MOCK_MODIFIERS);

      expect(violations.length).toBe(0);
    });

    it('handles unknown modifier IDs gracefully', () => {
      const mods: IAppliedModifier[] = [
        { modifierId: 'unknown_mod', ranks: 1 },
        { modifierId: 'ranged', ranks: 1 },
      ];

      const violations = validateIncompatibleModifiers(mods, MOCK_MODIFIERS);

      expect(violations.length).toBe(0); // Unknown mod is skipped
    });
  });
});

// ══════════════════════════════════════════════════════
//  Duplicate Modifier Entries
// ══════════════════════════════════════════════════════

describe('Duplicate Modifier Entries', () => {
  it('detects the same modifier twice on one component', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'accurate', ranks: 2 },
      { modifierId: 'accurate', ranks: 1 },
    ];

    const violations = validateDuplicateModifiers(mods, MOCK_MODIFIERS);

    expect(violations).toHaveLength(1);
    expect(violations[0].type).toBe('duplicate_modifier');
    expect(violations[0].modifierId).toBe('accurate');
    expect(violations[0].message).toContain('appears 2 times');
  });

  it('allows one ranked modifier entry', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'accurate', ranks: 3 }];

    const violations = validateDuplicateModifiers(mods, MOCK_MODIFIERS);

    expect(violations).toHaveLength(0);
  });
});

// ══════════════════════════════════════════════════════
//  Modifier Rank Limits (M&M 3e Hero's Handbook p.137)
// ══════════════════════════════════════════════════════

describe('Modifier Rank Limits', () => {
  describe('validateModifierMaxRanks', () => {
    it('Accurate capped at 5 ranks (official rule)', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'accurate', ranks: 6 }];

      const violations = validateModifierMaxRanks(mods, MOCK_MODIFIERS);

      expect(violations.length).toBe(1);
      expect(violations[0].type).toBe('max_ranks');
      expect(violations[0].modifierId).toBe('accurate');
      expect(violations[0].message).toContain('6 > 5');
      expect(violations[0].reference).toContain('Hero\'s Handbook');
    });

    it('Accurate at 5 ranks is valid', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'accurate', ranks: 5 }];

      const violations = validateModifierMaxRanks(mods, MOCK_MODIFIERS);

      expect(violations.length).toBe(0);
    });

    it('Accurate at 3 ranks is valid', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'accurate', ranks: 3 }];

      const violations = validateModifierMaxRanks(mods, MOCK_MODIFIERS);

      expect(violations.length).toBe(0);
    });

    it('allows modifiers without maxRanks limit', () => {
      const mods: IAppliedModifier[] = [
        { modifierId: 'ranged', ranks: 1 },
        { modifierId: 'area', ranks: 1 },
      ];

      const violations = validateModifierMaxRanks(mods, MOCK_MODIFIERS);

      expect(violations.length).toBe(0);
    });
  });
});

// ══════════════════════════════════════════════════════
//  Accurate PL Cap (M&M 3e Hero's Handbook p.24, p.137)
//  Rule: Attack bonus + Effect rank ≤ PL × 2
//  Accurate adds +2 per rank to attack bonus
// ══════════════════════════════════════════════════════

describe('Accurate PL Cap', () => {
  describe('validateAccuratePLCap', () => {
    it('PL 10: Accurate 5 (+10 attack) + Damage 10 = 20 (valid)', () => {
      const component: ICharacterPowerComponent = {
        id: 'c1',
        effectId: 'damage',
        ranks: 10,
        modifiers: [{ modifierId: 'accurate', ranks: 5 }],
      };

      const violations = validateAccuratePLCap(
        component,
        MOCK_DAMAGE_EFFECT,
        0, // base attack bonus
        10 // PL
      );

      expect(violations.length).toBe(0);
    });

    it('PL 10: Accurate 6 (+12 attack) + Damage 10 = 22 (violates PL)', () => {
      const component: ICharacterPowerComponent = {
        id: 'c1',
        effectId: 'damage',
        ranks: 10,
        modifiers: [{ modifierId: 'accurate', ranks: 6 }],
      };

      const violations = validateAccuratePLCap(
        component,
        MOCK_DAMAGE_EFFECT,
        0,
        10
      );

      expect(violations.length).toBe(1);
      expect(violations[0].type).toBe('accurate_pl_cap');
      expect(violations[0].message).toContain('22 > 20');
    });

    it('PL 10: base attack 5 + Accurate 3 (+6) + Damage 10 = 21 (violates)', () => {
      const component: ICharacterPowerComponent = {
        id: 'c1',
        effectId: 'damage',
        ranks: 10,
        modifiers: [{ modifierId: 'accurate', ranks: 3 }],
      };

      const violations = validateAccuratePLCap(
        component,
        MOCK_DAMAGE_EFFECT,
        5, // base attack bonus (from DEX/FGT + advantages)
        10
      );

      expect(violations.length).toBe(1);
      expect(violations[0].message).toContain('attack 11'); // 5 + 6
    });

    it('PL 10: base attack 5 + Accurate 2 (+4) + Damage 10 = 19 (valid)', () => {
      const component: ICharacterPowerComponent = {
        id: 'c1',
        effectId: 'damage',
        ranks: 10,
        modifiers: [{ modifierId: 'accurate', ranks: 2 }],
      };

      const violations = validateAccuratePLCap(
        component,
        MOCK_DAMAGE_EFFECT,
        5,
        10
      );

      expect(violations.length).toBe(0);
    });

    it('does not apply to non-attack effects', () => {
      const protectionEffect: IPowerEffect = {
        ...MOCK_DAMAGE_EFFECT,
        id: 'protection',
        name: 'Protection',
        type: 'defense',
      };

      const component: ICharacterPowerComponent = {
        id: 'c1',
        effectId: 'protection',
        ranks: 10,
        modifiers: [{ modifierId: 'accurate', ranks: 10 }], // Nonsensical but shouldn't error
      };

      const violations = validateAccuratePLCap(
        component,
        protectionEffect,
        0,
        10
      );

      expect(violations.length).toBe(0); // Not an attack, so no PL cap check
    });

    it('no violation when Accurate not present', () => {
      const component: ICharacterPowerComponent = {
        id: 'c1',
        effectId: 'damage',
        ranks: 10,
        modifiers: [{ modifierId: 'ranged', ranks: 1 }],
      };

      const violations = validateAccuratePLCap(
        component,
        MOCK_DAMAGE_EFFECT,
        0,
        10
      );

      expect(violations.length).toBe(0);
    });
  });
});

// ══════════════════════════════════════════════════════
//  Integrated Component Validation
// ══════════════════════════════════════════════════════

describe('validateComponentModifiers (integrated)', () => {
  it('detects multiple violations on same component', () => {
    const component: ICharacterPowerComponent = {
      id: 'c1',
      effectId: 'damage',
      ranks: 10,
      modifiers: [
        { modifierId: 'ranged', ranks: 1 },
        { modifierId: 'close_only', ranks: 1 }, // Incompatible with ranged
        { modifierId: 'accurate', ranks: 6 }, // Exceeds maxRanks
        { modifierId: 'accurate', ranks: 1 }, // Duplicate entry
      ],
    };

    const violations = validateComponentModifiers(
      component,
      MOCK_DAMAGE_EFFECT,
      MOCK_MODIFIERS,
      DEFAULT_VALIDATION_RULES,
      0,
      10
    );

    expect(violations.length).toBeGreaterThanOrEqual(2);
    expect(violations.some((v) => v.type === 'incompatible')).toBe(true);
    expect(violations.some((v) => v.type === 'duplicate_modifier')).toBe(true);
    expect(violations.some((v) => v.type === 'max_ranks')).toBe(true);
  });

  it('respects validation rules configuration', () => {
    const component: ICharacterPowerComponent = {
      id: 'c1',
      effectId: 'damage',
      ranks: 10,
      modifiers: [
        { modifierId: 'ranged', ranks: 1 },
        { modifierId: 'close_only', ranks: 1 },
      ],
    };

    // Disable incompatibility checks
    const permissiveRules = {
      ...DEFAULT_VALIDATION_RULES,
      enforceIncompatibleModifiers: false,
    };

    const violations = validateComponentModifiers(
      component,
      MOCK_DAMAGE_EFFECT,
      MOCK_MODIFIERS,
      permissiveRules,
      0,
      10
    );

    expect(violations.length).toBe(0); // No violations when rule disabled
  });

  it('respects duplicate modifier validation rule', () => {
    const component: ICharacterPowerComponent = {
      id: 'c1',
      effectId: 'damage',
      ranks: 10,
      modifiers: [
        { modifierId: 'accurate', ranks: 1 },
        { modifierId: 'accurate', ranks: 1 },
      ],
    };

    const violations = validateComponentModifiers(
      component,
      MOCK_DAMAGE_EFFECT,
      MOCK_MODIFIERS,
      { ...DEFAULT_VALIDATION_RULES, enforceDuplicateModifiers: false },
      0,
      10
    );

    expect(violations.some((v) => v.type === 'duplicate_modifier')).toBe(false);
  });

  it('clean component passes all validations', () => {
    const component: ICharacterPowerComponent = {
      id: 'c1',
      effectId: 'damage',
      ranks: 10,
      modifiers: [
        { modifierId: 'ranged', ranks: 1 },
        { modifierId: 'area', ranks: 1 },
        { modifierId: 'accurate', ranks: 3 },
      ],
    };

    const violations = validateComponentModifiers(
      component,
      MOCK_DAMAGE_EFFECT,
      MOCK_MODIFIERS,
      DEFAULT_VALIDATION_RULES,
      0,
      10
    );

    expect(violations.length).toBe(0);
  });
});
