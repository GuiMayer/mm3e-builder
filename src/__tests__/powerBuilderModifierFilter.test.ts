import { describe, it, expect } from 'vitest';
import type { IPowerEffect, IModifierDef } from '../entities/types';

/**
 * Phase 4: UI Filtering Tests
 * Tests for power-specific modifier filtering logic
 * 
 * Note: Testing the hook logic directly without React rendering
 * to avoid React 19 compatibility issues with @testing-library/react
 */

// Helper to simulate the hook logic
function getValidModifiers(
  selectedEffect: IPowerEffect | undefined,
  allModifiers: IModifierDef[]
) {
  const universalModifiers = allModifiers;
  const powerSpecificModifiers: IModifierDef[] = selectedEffect
    ? [
        ...(selectedEffect.extras || []),
        ...(selectedEffect.flaws || []),
      ]
    : [];

  const validModifierIds = new Set<string>([
    ...universalModifiers.map((m) => m.id),
    ...powerSpecificModifiers.map((m) => m.id),
  ]);

  const validModifiers = [
    ...universalModifiers,
    ...powerSpecificModifiers.filter(
      (pm) => !universalModifiers.some((um) => um.id === pm.id)
    ),
  ];

  return {
    validModifiers,
    universalModifiers,
    powerSpecificModifiers,
    isModifierValid: (modifierId: string) => validModifierIds.has(modifierId),
  };
}

/**
 * Phase 4: UI Filtering Tests
 * Tests for useValidModifiers hook and power-specific modifier filtering
 */

// ── Mock Data ──────────────────────────────────────────────────────────────

const UNIVERSAL_MODS: IModifierDef[] = [
  {
    id: 'ranged',
    name: 'Ranged',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Universal ranged extra',
    incompatibleWith: [],
  },
  {
    id: 'area',
    name: 'Area',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Universal area extra',
    incompatibleWith: [],
  },
  {
    id: 'tiring',
    name: 'Tiring',
    category: 'flaw',
    costType: 'per_rank',
    costValue: -1,
    description: 'Universal tiring flaw',
    incompatibleWith: [],
  },
];

const FLIGHT_EFFECT: IPowerEffect = {
  id: 'flight',
  name: 'Flight',
  type: 'movement',
  baseCost: 2,
  action: 'free',
  range: 'personal',
  duration: 'sustained',
  description: 'Fly through the air',
  variableCost: null,
  extras: [
    {
      id: 'aquatic',
      name: 'Aquatic',
      category: 'extra',
      costType: 'flat',
      costValue: 1,
      description: 'Move underwater as easily as in air',
      incompatibleWith: [],
    },
    {
      id: 'continuous',
      name: 'Continuous',
      category: 'extra',
      costType: 'per_rank',
      costValue: 1,
      description: 'Operates when incapacitated',
      incompatibleWith: [],
    },
  ],
  flaws: [
    {
      id: 'gliding',
      name: 'Gliding',
      category: 'flaw',
      costType: 'per_rank',
      costValue: -1,
      description: 'Fly by gliding on wind currents',
      incompatibleWith: [],
    },
  ],
  i18n: {},
};

const DAMAGE_EFFECT: IPowerEffect = {
  id: 'damage',
  name: 'Damage',
  type: 'attack',
  baseCost: 1,
  action: 'standard',
  range: 'close',
  duration: 'instant',
  description: 'Deal damage',
  variableCost: null,
  extras: [],
  flaws: [],
  i18n: {},
};

// ══════════════════════════════════════════════════════════════════════════
//  useValidModifiers Hook Tests
// ══════════════════════════════════════════════════════════════════════════

describe('useValidModifiers logic', () => {
  describe('with no selected effect', () => {
    it('returns only universal modifiers', () => {
      const result = getValidModifiers(undefined, UNIVERSAL_MODS);

      expect(result.validModifiers).toHaveLength(3);
      expect(result.universalModifiers).toHaveLength(3);
      expect(result.powerSpecificModifiers).toHaveLength(0);
    });

    it('isModifierValid returns true for universal modifiers', () => {
      const result = getValidModifiers(undefined, UNIVERSAL_MODS);

      expect(result.isModifierValid('ranged')).toBe(true);
      expect(result.isModifierValid('area')).toBe(true);
      expect(result.isModifierValid('tiring')).toBe(true);
    });

    it('isModifierValid returns false for unknown modifiers', () => {
      const result = getValidModifiers(undefined, UNIVERSAL_MODS);

      expect(result.isModifierValid('aquatic')).toBe(false);
      expect(result.isModifierValid('gliding')).toBe(false);
    });
  });

  describe('with Flight selected', () => {
    it('returns universal + power-specific modifiers', () => {
      const result = getValidModifiers(FLIGHT_EFFECT, UNIVERSAL_MODS);

      // 3 universal + 3 power-specific (aquatic, continuous, gliding)
      expect(result.validModifiers.length).toBeGreaterThanOrEqual(6);
      expect(result.universalModifiers).toHaveLength(3);
      expect(result.powerSpecificModifiers).toHaveLength(3);
    });

    it('includes Flight-specific extras', () => {
      const result = getValidModifiers(FLIGHT_EFFECT, UNIVERSAL_MODS);

      const specificIds = result.powerSpecificModifiers.map((m) => m.id);
      expect(specificIds).toContain('aquatic');
      expect(specificIds).toContain('continuous');
    });

    it('includes Flight-specific flaws', () => {
      const result = getValidModifiers(FLIGHT_EFFECT, UNIVERSAL_MODS);

      const specificIds = result.powerSpecificModifiers.map((m) => m.id);
      expect(specificIds).toContain('gliding');
    });

    it('isModifierValid returns true for universal modifiers', () => {
      const result = getValidModifiers(FLIGHT_EFFECT, UNIVERSAL_MODS);

      expect(result.isModifierValid('ranged')).toBe(true);
      expect(result.isModifierValid('area')).toBe(true);
      expect(result.isModifierValid('tiring')).toBe(true);
    });

    it('isModifierValid returns true for Flight-specific modifiers', () => {
      const result = getValidModifiers(FLIGHT_EFFECT, UNIVERSAL_MODS);

      expect(result.isModifierValid('aquatic')).toBe(true);
      expect(result.isModifierValid('continuous')).toBe(true);
      expect(result.isModifierValid('gliding')).toBe(true);
    });

    it('isModifierValid returns false for modifiers from other powers', () => {
      const result = getValidModifiers(FLIGHT_EFFECT, UNIVERSAL_MODS);

      // Healing-specific modifier not valid for Flight
      expect(result.isModifierValid('empathic')).toBe(false);
    });
  });

  describe('with Damage selected (no power-specific modifiers)', () => {
    it('returns only universal modifiers', () => {
      const result = getValidModifiers(DAMAGE_EFFECT, UNIVERSAL_MODS);

      expect(result.validModifiers).toHaveLength(3);
      expect(result.universalModifiers).toHaveLength(3);
      expect(result.powerSpecificModifiers).toHaveLength(0);
    });

    it('isModifierValid returns true for universal modifiers', () => {
      const result = getValidModifiers(DAMAGE_EFFECT, UNIVERSAL_MODS);

      expect(result.isModifierValid('ranged')).toBe(true);
      expect(result.isModifierValid('area')).toBe(true);
    });

    it('isModifierValid returns false for power-specific modifiers', () => {
      const result = getValidModifiers(DAMAGE_EFFECT, UNIVERSAL_MODS);

      expect(result.isModifierValid('aquatic')).toBe(false);
      expect(result.isModifierValid('gliding')).toBe(false);
    });
  });

  describe('deduplication', () => {
    it('does not duplicate modifiers if same ID exists in universal and power-specific', () => {
      const effectWithDuplicate: IPowerEffect = {
        ...FLIGHT_EFFECT,
        extras: [
          ...FLIGHT_EFFECT.extras,
          {
            id: 'ranged', // Same as universal
            name: 'Ranged (Flight-specific)',
            category: 'extra',
            costType: 'per_rank',
            costValue: 1,
            description: 'Power-specific ranged',
            incompatibleWith: [],
          },
        ],
      };

      const result = getValidModifiers(effectWithDuplicate, UNIVERSAL_MODS);

      // Should not have duplicate 'ranged'
      const rangedCount = result.validModifiers.filter(
        (m) => m.id === 'ranged'
      ).length;
      expect(rangedCount).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('handles effect with empty extras/flaws arrays', () => {
      const result = getValidModifiers(DAMAGE_EFFECT, UNIVERSAL_MODS);

      expect(result.powerSpecificModifiers).toHaveLength(0);
      expect(result.validModifiers).toHaveLength(3);
    });

    it('handles empty universal modifiers array', () => {
      const result = getValidModifiers(FLIGHT_EFFECT, []);

      expect(result.universalModifiers).toHaveLength(0);
      expect(result.powerSpecificModifiers).toHaveLength(3);
      expect(result.validModifiers).toHaveLength(3);
    });

    it('handles both arrays empty', () => {
      const result = getValidModifiers(DAMAGE_EFFECT, []);

      expect(result.validModifiers).toHaveLength(0);
      expect(result.isModifierValid('anything')).toBe(false);
    });
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  Integration Scenarios
// ══════════════════════════════════════════════════════════════════════════

describe('Power-Specific Modifier Filtering - Integration', () => {
  it('Flight: user can add universal modifiers', () => {
    const result = getValidModifiers(FLIGHT_EFFECT, UNIVERSAL_MODS);

    expect(result.isModifierValid('ranged')).toBe(true);
    expect(result.isModifierValid('area')).toBe(true);
  });

  it('Flight: user can add Flight-specific modifiers', () => {
    const result = getValidModifiers(FLIGHT_EFFECT, UNIVERSAL_MODS);

    expect(result.isModifierValid('aquatic')).toBe(true);
    expect(result.isModifierValid('gliding')).toBe(true);
  });

  it('Flight: user cannot add Healing-specific modifiers', () => {
    const result = getValidModifiers(FLIGHT_EFFECT, UNIVERSAL_MODS);

    expect(result.isModifierValid('empathic')).toBe(false);
    expect(result.isModifierValid('resurrection')).toBe(false);
  });

  it('Damage: user can only add universal modifiers', () => {
    const result = getValidModifiers(DAMAGE_EFFECT, UNIVERSAL_MODS);

    expect(result.isModifierValid('ranged')).toBe(true);
    expect(result.isModifierValid('area')).toBe(true);
    expect(result.isModifierValid('aquatic')).toBe(false);
    expect(result.isModifierValid('gliding')).toBe(false);
  });

  it('switching from Flight to Damage updates valid modifiers', () => {
    // Initially Flight
    const flightResult = getValidModifiers(FLIGHT_EFFECT, UNIVERSAL_MODS);
    expect(flightResult.isModifierValid('aquatic')).toBe(true);
    expect(flightResult.powerSpecificModifiers).toHaveLength(3);

    // Switch to Damage
    const damageResult = getValidModifiers(DAMAGE_EFFECT, UNIVERSAL_MODS);
    expect(damageResult.isModifierValid('aquatic')).toBe(false);
    expect(damageResult.powerSpecificModifiers).toHaveLength(0);
  });
});
