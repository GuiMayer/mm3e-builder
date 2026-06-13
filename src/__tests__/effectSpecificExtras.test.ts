import { describe, it, expect } from 'vitest';
import type { ICharacter, ICharacterPower, ICharacterPowerComponent } from '../entities/types';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';
import { validateCharacterSemantics } from '../shared/lib/semanticValidation';

describe('Effect-Specific Extras Validation', () => {
  const createComponent = (
    effectId: string,
    ranks: number,
    modifiers: { modifierId: string; ranks: number }[] = []
  ): ICharacterPowerComponent => ({
    id: 'comp-1',
    effectId,
    ranks,
    modifiers: modifiers.map((m) => ({ modifierId: m.modifierId, ranks: m.ranks })),
  });

  const createPower = (
    name: string,
    components: ICharacterPowerComponent[]
  ): ICharacterPower => ({
    id: 'power-1',
    name,
    components,
    notes: '',
    alternateEffects: [],
  });

  const createCharacter = (powers: ICharacterPower[]): ICharacter => ({
    header: {
      name: 'Test Character',
      player: '',
      identity: '',
      base: '',
      powerLevel: 10,
      heroPoints: 0,
    },
    abilities: { str: 10, sta: 10, agl: 10, dex: 10, fgt: 10, int: 10, awe: 10, pre: 10 },
    absentAbilities: [],
    defenses: { dodge: 5, parry: 5, fortitude: 5, will: 5 },
    skills: [],
    advantages: [],
    powers,
    complications: [],
    equipmentNotes: '',
  });

  it('should validate universal modifier (accurate) on any effect', () => {
    // Test that universal modifiers are accepted via the extended validation
    const component = createComponent('damage', 10, [{ modifierId: 'accurate', ranks: 1 }]);
    const power = createPower('Accurate Attack', [component]);
    const character = createCharacter([power]);

    const issues = validateCharacterSemantics(character, {
      powerDefs: POWER_DEFS,
      modifierDefs: MODIFIER_DEFS,
    });

    // Check that there are NO reference errors (modifier unknown)
    const referenceErrors = issues.filter((i) => i.message.includes('Unknown modifier'));
    expect(referenceErrors).toHaveLength(0);
  });

  it('should validate effect-specific extra (portal) on teleport effect', () => {
    const component = createComponent('teleport', 5, [{ modifierId: 'portal', ranks: 1 }]);
    const power = createPower('Portal Creation', [component]);
    const character = createCharacter([power]);

    const issues = validateCharacterSemantics(character, {
      powerDefs: POWER_DEFS,
      modifierDefs: MODIFIER_DEFS,
    });

    expect(issues).toHaveLength(0);
  });

  it('should reject effect-specific extra (portal) on incompatible effect', () => {
    const component = createComponent('damage', 10, [{ modifierId: 'portal', ranks: 1 }]);
    const power = createPower('Damage', [component]);
    const character = createCharacter([power]);

    const issues = validateCharacterSemantics(character, {
      powerDefs: POWER_DEFS,
      modifierDefs: MODIFIER_DEFS,
    });

    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].message).toContain('Unknown modifier');
    expect(issues[0].message).toContain('portal');
  });

  it('should reject completely unknown modifier', () => {
    const component = createComponent('damage', 10, [{ modifierId: 'fake_modifier', ranks: 1 }]);
    const power = createPower('Damage', [component]);
    const character = createCharacter([power]);

    const issues = validateCharacterSemantics(character, {
      powerDefs: POWER_DEFS,
      modifierDefs: MODIFIER_DEFS,
    });

    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].message).toContain('Unknown modifier');
  });

  it('should validate multiple effect-specific extras on same effect', () => {
    const component = createComponent('teleport', 5, [
      { modifierId: 'portal', ranks: 1 },
      { modifierId: 'accurate_teleport', ranks: 1 },
      { modifierId: 'change_direction', ranks: 1 },
    ]);
    const power = createPower('Advanced Teleport', [component]);
    const character = createCharacter([power]);

    const issues = validateCharacterSemantics(character, {
      powerDefs: POWER_DEFS,
      modifierDefs: MODIFIER_DEFS,
    });

    expect(issues).toHaveLength(0);
  });

  it('should validate mix of universal modifiers and effect-specific extras', () => {
    const component = createComponent('teleport', 5, [
      { modifierId: 'accurate', ranks: 1 }, // universal
      { modifierId: 'accurate_teleport', ranks: 1 }, // teleport-specific
      { modifierId: 'change_direction', ranks: 1 }, // teleport-specific
    ]);
    const power = createPower('Enhanced Teleport', [component]);
    const character = createCharacter([power]);

    const issues = validateCharacterSemantics(character, {
      powerDefs: POWER_DEFS,
      modifierDefs: MODIFIER_DEFS,
    });

    // Check that there are NO reference errors (all modifiers should be recognized)
    const referenceErrors = issues.filter((i) => i.message.includes('Unknown modifier'));
    expect(referenceErrors).toHaveLength(0);
  });

  it('should validate effect-specific flaws (not just extras)', () => {
    const teleportEffect = POWER_DEFS.find((p) => p.id === 'teleport');
    const flawId = teleportEffect?.flaws[0]?.id;

    if (flawId) {
      const component = createComponent('teleport', 5, [{ modifierId: flawId, ranks: 1 }]);
      const power = createPower('Limited Teleport', [component]);
      const character = createCharacter([power]);

      const issues = validateCharacterSemantics(character, {
        powerDefs: POWER_DEFS,
        modifierDefs: MODIFIER_DEFS,
      });

      expect(issues).toHaveLength(0);
    }
  });

  it('should handle alternate effects with effect-specific extras', () => {
    const mainComponent = createComponent('damage', 10);
    const aeComponent = createComponent('teleport', 5, [{ modifierId: 'portal', ranks: 1 }]);

    const power: ICharacterPower = {
      id: 'power-1',
      name: 'Damage or Teleport',
      components: [mainComponent],
      notes: '',
      alternateEffects: [
        {
          id: 'ae-1',
          name: 'Portal',
          components: [aeComponent],
          dynamic: false,
          notes: '',
        },
      ],
    };

    const character = createCharacter([power]);

    const issues = validateCharacterSemantics(character, {
      powerDefs: POWER_DEFS,
      modifierDefs: MODIFIER_DEFS,
    });

    expect(issues).toHaveLength(0);
  });
});
