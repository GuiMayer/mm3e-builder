import { describe, expect, it } from 'vitest';
import { MODIFIER_DEFS, POWER_DEFS } from '../entities/gameDataLoaders';
import type { ICharacterPower, IModifierDef } from '../entities/types';
import {
  collectModifierDefinitions,
  createPowerDraft,
  findModifierIncompatibilities,
  getPaletteContext,
} from '../features/power-builder/powerBuilderModel';

function createPower(): ICharacterPower {
  return {
    id: 'power',
    name: 'Test',
    notes: '',
    components: [
      { id: 'main-component', effectId: 'damage', ranks: 10, modifiers: [] },
    ],
    alternateEffects: [
      {
        id: 'alternate',
        name: 'Alternate',
        notes: '',
        dynamic: false,
        components: [
          { id: 'alternate-component', effectId: 'flight', ranks: 5, modifiers: [] },
        ],
      },
    ],
  };
}

describe('powerBuilderModel', () => {
  it('creates the same empty draft shape expected by the editor', () => {
    const draft = createPowerDraft();

    expect(draft.name).toBe('');
    expect(draft.components).toHaveLength(1);
    expect(draft.components[0]).toMatchObject({ effectId: '', ranks: 1 });
  });

  it('collects general and effect-specific modifiers without duplicates', () => {
    const modifiers = collectModifierDefinitions(
      createPower(),
      POWER_DEFS,
      MODIFIER_DEFS
    );

    expect(new Set(modifiers.map((modifier) => modifier.id)).size).toBe(
      modifiers.length
    );
  });

  it('reports incompatibilities using the established component key', () => {
    const power = createPower();
    power.components[0].modifiers = [
      { modifierId: 'first', ranks: 1 },
      { modifierId: 'second', ranks: 1 },
    ];
    const definitions: IModifierDef[] = [
      {
        id: 'first',
        name: 'First',
        category: 'extra',
        costType: 'flat',
        costValue: 1,
        description: '',
        incompatibleWith: ['second'],
      },
      {
        id: 'second',
        name: 'Second',
        category: 'flaw',
        costType: 'flat',
        costValue: -1,
        description: '',
        incompatibleWith: [],
      },
    ];

    expect(findModifierIncompatibilities(power, definitions)).toEqual({
      'main-component:first': ['second'],
    });
  });

  it('selects palette context from an expanded alternate effect', () => {
    const context = getPaletteContext(
      createPower(),
      POWER_DEFS,
      'main-component',
      'alternate',
      { alternate: 'alternate-component' }
    );

    expect(context.selectedEffect?.id).toBe('flight');
    expect(context.contextName).toBe('Alternate · Comp. 1');
    expect(context.fabLabel).toBe('Alternate');
  });
});
