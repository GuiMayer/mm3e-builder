import { describe, expect, it } from 'vitest';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';
import { modifierDefinitionVersion } from '../shared/lib/modifierPresentation';
import { calculatePowerPricing } from '../shared/lib/mathEngine';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { importCharacterJSON } from '../services/character-file/importCharacter';
import { parseDraftBundle, serializeDraftBundle } from '../services/draftTransfer';
import { buildPowerReferences } from '../features/sheet-core/powerReference';
import type { ICharacterPower } from '../entities/types';

const power = (effectId: string, modifierId: string, ranks = 1): ICharacterPower => ({ id: 'p', name: 'Existing purchase', notes: 'Original notes', components: [{ id: 'c', effectId, ranks: 5, modifiers: [{ modifierId, ranks, isPowerSpecific: true, instanceId: 'instance' }] }], alternateEffects: [] });
const price = (p: ICharacterPower) => calculatePowerPricing(p, POWER_DEFS, MODIFIER_DEFS).total;
describe('legacy modifier presentation', () => {
  it('scopes Persistent to Healing and preserves all four price definitions', () => {
    expect(modifierDefinitionVersion('regeneration', 'persistent')).toBeUndefined();
    expect(modifierDefinitionVersion('healing', 'persistent')).toBe('legacyHealing');
    expect(modifierDefinitionVersion('healing', 'persistent_flat')).toBe('currentHealing');
    expect(modifierDefinitionVersion('summon', 'multiple_minions')).toBe('legacyMinions');
    expect(modifierDefinitionVersion('summon', 'multiple_minions_ranked')).toBe('currentMinions');
    expect(price(power('summon', 'multiple_minions', 3))).toBe(16);
    expect(price(power('summon', 'multiple_minions_ranked', 3))).toBe(40);
    expect(price(power('healing', 'persistent'))).toBe(15);
    expect(price(power('healing', 'persistent_flat'))).toBe(11);
  });
  it.each([['summon','multiple_minions'],['healing','persistent']])('imports and round-trips the %s legacy definition without converting identity or cost', async (effectId, modifierId) => {
    const original = power(effectId, modifierId);
    const character = createDefaultCharacter({ powers: [original] });
    const imported = await importCharacterJSON(new File([JSON.stringify({ schemaVersion: '2.2.0', exportedAt: '', character })], 'old.json'));
    expect(imported.powers[0]).toEqual(original);
    expect(price(imported.powers[0])).toBe(price(original));
    const tab = { id: 'tab', character: imported, label: 'Hero', isDirty: false, lastModified: 1 };
    const reloaded = parseDraftBundle(serializeDraftBundle([tab], tab.id, []));
    expect(reloaded.tabs[0].character.powers[0]).toEqual(original);
    for (const language of ['en','pt-BR']) {
      const reference = buildPowerReferences(original.components, POWER_DEFS, MODIFIER_DEFS, language)[0];
      expect(reference.modifiers[0].effectId).toBe(effectId);
      expect(reference.modifiers[0].definition?.description).toMatch(/Legacy|legado/i);
      expect(reference.modifiers[0].applied.modifierId).toBe(modifierId);
    }
  });
});
