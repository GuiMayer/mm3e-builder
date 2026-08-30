import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { ICharacterPower } from '../entities/types';
import { MODIFIER_DEFS, POWER_DEFS } from '../entities/gameDataLoaders';
import { calculateCharacterPointSummary } from '../shared/lib/pointSummary';

function flightPower(): ICharacterPower {
  return {
    id: 'flight-power',
    name: 'Flight',
    notes: '',
    components: [{
      id: 'flight-component',
      effectId: 'flight',
      ranks: 5,
      modifiers: [{
        modifierId: 'continuous_flight',
        ranks: 1,
        isPowerSpecific: true,
      }],
    }],
    alternateEffects: [],
  };
}

describe('calculateCharacterPointSummary', () => {
  it('uses the same contextual pricing result for power totals', () => {
    const character = createDefaultCharacter({ powers: [flightPower()] });

    const summary = calculateCharacterPointSummary(
      character,
      [],
      POWER_DEFS,
      MODIFIER_DEFS
    );

    expect(summary.powerPricing[0]?.total).toBe(15);
    expect(summary.powersCost).toBe(15);
    expect(summary.totalSpent).toBe(
      summary.abilitiesCost
      + summary.defensesCost
      + summary.skillsCost
      + summary.advantagesCost
      + summary.powersCost
    );
    expect(summary.remaining).toBe(summary.totalAvailable - summary.totalSpent);
  });

  it('uses canonical equipment pricing in the EP summary', () => {
    const equipment: ICharacterPower = {
      id: 'equipment',
      name: 'Dynamic equipment',
      notes: '',
      components: [{
        id: 'main',
        effectId: 'damage',
        ranks: 10,
        modifiers: [],
      }],
      alternateEffects: [{
        id: 'alternate',
        name: 'Alternate',
        notes: '',
        dynamic: true,
        components: [{
          id: 'alternate-component',
          effectId: 'damage',
          ranks: 10,
          modifiers: [],
        }],
      }],
      baseDynamic: true,
      activation: 'standard',
    };
    const character = createDefaultCharacter({ equipment: [equipment] });

    const summary = calculateCharacterPointSummary(
      character,
      [],
      POWER_DEFS,
      MODIFIER_DEFS
    );

    expect(summary.equipmentPricing[0]?.equipmentTotal).toBe(11);
    expect(summary.legacyEPUsed).toBe(11);
    expect(summary.totalEPUsed).toBe(11);
  });
});
