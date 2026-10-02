import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { POWER_DEFS } from '../entities/gameDataLoaders';
import { useActiveCharacter } from '../shared/hooks/useActiveCharacter';
import { useOffenseSummary, type IOffenseEntry } from '../shared/hooks/useOffenseSummary';

vi.mock('../shared/hooks/useActiveCharacter', () => ({ useActiveCharacter: vi.fn() }));

describe('Targeted Effects localization', () => {
  it('switches catalog effect labels with the language while retaining custom names, mechanics and stored data', async () => {
    const character = createDefaultCharacter({
      powers: [{
        id: 'power', name: 'Custom power name', notes: '',
        components: [{ id: 'base', effectId: 'affliction', ranks: 6, modifiers: [], fieldValues: { resistance: 'will' } }],
        alternateEffects: [{ id: 'alternate', name: 'Custom alternate name', notes: '', dynamic: false,
          components: [{ id: 'ae', effectId: 'damage', ranks: 4, modifiers: [] }] }],
      }],
      equipment: [{ id: 'gear', name: 'Custom gear name', notes: '', alternateEffects: [],
        components: [{ id: 'gear-effect', effectId: 'nullify', ranks: 3, modifiers: [] }] }],
      manualOffenseRows: [{ id: 'manual', name: 'Custom manual name', bonus: 2, range: 'close', effect: 'Affliction 5 — custom text', notes: '' }],
    });
    const before = JSON.stringify({ character, catalog: POWER_DEFS });
    vi.mocked(useActiveCharacter).mockReturnValue({ character, isDirty: false, characterId: character.characterId ?? null, exists: true });
    const i18n = createInstance();
    await i18n.init({ lng: 'en', fallbackLng: 'en', resources: {
      en: { translation: { 'offense.unarmed': 'Unarmed', 'offense.damage': 'Damage' } },
      'pt-BR': { translation: { 'offense.unarmed': 'Desarmado', 'offense.damage': 'Dano' } },
    } });
    let entries: IOffenseEntry[] = [];
    function Probe() { entries = useOffenseSummary(); return null; }
    const readProfiles = () => {
      renderToStaticMarkup(createElement(I18nextProvider, { i18n }, createElement(Probe)));
      return entries;
    };
    const english = readProfiles();
    expect(english.find(entry => entry.componentId === 'base')).toMatchObject({ componentName: 'Affliction', effect: 'Affliction 6' });

    await i18n.changeLanguage('pt-BR');
    const portuguese = readProfiles();
    expect(portuguese.find(entry => entry.componentId === 'base')).toMatchObject({ name: 'Custom power name', componentName: 'Aflição', effect: 'Aflição 6' });
    expect(portuguese.find(entry => entry.componentId === 'ae')).toMatchObject({ name: 'Custom alternate name', componentName: 'Dano', effect: 'Dano 4' });
    expect(portuguese.find(entry => entry.componentId === 'gear-effect')?.componentName).toBe(POWER_DEFS.find(effect => effect.id === 'nullify')!.i18n!['pt-BR'].name);
    expect(portuguese.find(entry => entry.id === 'manual')).toMatchObject({ name: 'Custom manual name', effect: 'Affliction 5 — custom text' });
    const mechanics = (profiles: IOffenseEntry[]) => profiles.map(({ id, bonusValue, range, effectRank, resistance, tags }) => ({ id, bonusValue, range, effectRank, resistance, tags }));
    expect(mechanics(portuguese)).toEqual(mechanics(english));
    expect(JSON.stringify({ character, catalog: POWER_DEFS })).toBe(before);

    await i18n.changeLanguage('en');
    expect(readProfiles()).toEqual(english);
  });
});
