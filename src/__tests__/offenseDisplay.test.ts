import { createInstance } from 'i18next';
import { describe, expect, it } from 'vitest';
import en from '../locales/en/translation.json';
import pt from '../locales/pt-BR/translation.json';
import { formatResistanceLabel } from '../shared/lib/offenseDisplay';
import { buildTargetedEffectProfiles } from '../shared/lib/offenseSummary';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { POWER_DEFS } from '../entities/gameDataLoaders';

async function translator(language: string) {
  const i18n = createInstance();
  await i18n.init({ lng: language, fallbackLng: 'en', resources: { en: { translation: en }, 'pt-BR': { translation: pt } } });
  return i18n.t.bind(i18n);
}

describe('Targeted Effects resistance display', () => {
  it('localizes opposed Nullify checks without inventing a DC', async () => {
    const english = await translator('en');
    const portuguese = await translator('pt-BR');
    const label = 'Nullify 5 vs max(effect rank, Will); subject: effect rank';
    expect(formatResistanceLabel(label, english)).toBe('Nullify 5 · Opposed check: max(effect rank, Will) · On the subject: effect rank only');
    expect(formatResistanceLabel(label, portuguese)).toBe('Nulificar 5 · Teste oposto: max(graduação do efeito, Vontade) · No alvo do efeito: apenas graduação do efeito');
    expect(formatResistanceLabel('Nullify 5 vs max(effect rank, Fortitude); subject: effect rank', portuguese)).toContain('Fortitude');
  });
  it('translates all standard resistances and DC while retaining the exact number and English labels', async () => {
    const portuguese = await translator('pt-BR');
    const english = await translator('en');
    for (const [source, translated] of [
      ['Toughness', 'Resistência'], ['Fortitude', 'Fortitude'], ['Will', 'Vontade'],
      ['Dodge', 'Esquiva'], ['Parry', 'Aparar'], ['Resistance', 'Resistência'],
    ]) {
      expect(formatResistanceLabel(`${source} DC 16`, portuguese)).toBe(`${translated} CD 16`);
      expect(formatResistanceLabel(`${source} DC 16`, english)).toBe(`${source} DC 16`);
    }
    expect(formatResistanceLabel('Will DC -2', portuguese)).toBe('Vontade CD -2');
  });

  it('keeps custom resistance names, free text and absent resistance safe', async () => {
    const t = await translator('pt-BR');
    expect(formatResistanceLabel('Custom defense DC 21', t)).toBe('Custom defense CD 21');
    expect(formatResistanceLabel('Custom instruction', t)).toBe('Custom instruction');
    expect(formatResistanceLabel(undefined, t)).toBe('—');
  });

  it('formats derived Damage and configured Affliction without changing profiles or character data', async () => {
    const character = createDefaultCharacter({ powers: [{
      id: 'power', name: 'Test', notes: '', alternateEffects: [], components: [
        { id: 'damage', effectId: 'damage', ranks: 1, modifiers: [] },
        { id: 'affliction', effectId: 'affliction', ranks: 6, modifiers: [], fieldValues: { resistance: 'will' } },
      ],
    }] });
    const profiles = buildTargetedEffectProfiles(character, POWER_DEFS, [], []);
    const before = JSON.stringify({ character, profiles });
    const t = await translator('pt-BR');
    expect(formatResistanceLabel(profiles.find(profile => profile.componentId === 'damage')?.resistance, t)).toBe('Resistência CD 16');
    expect(formatResistanceLabel(profiles.find(profile => profile.componentId === 'affliction')?.resistance, t)).toBe('Vontade CD 16');
    expect(JSON.stringify({ character, profiles })).toBe(before);
  });
});
