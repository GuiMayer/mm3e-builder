import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../entities/gameDataLoaders';
import { generateCharacterPDF } from '../services/pdf/pdfGenerator';
import { renderPowerDetails } from '../services/pdf/components/powerDetails';
import type { ICharacterPower } from '../entities/types';
import { DEFAULT_CUSTOMIZATION } from '../services/pdf/types';

const power: ICharacterPower = {
  id: 'array', name: 'Solar array', descriptors: ['Light'], baseDynamic: true, activation: 'move', notes: 'Base notes',
  components: [{ id: 'base', effectId: 'damage', ranks: 8, modifiers: [{ modifierId: 'accurate', ranks: 2, affectedRanks: 4 }] }],
  alternateEffects: [{ id: 'alternate', name: '<Pulse>', dynamic: true, notes: 'Alternate notes', components: [
    { id: 'area', effectId: 'damage', ranks: 6, modifiers: [{ modifierId: 'area', ranks: 1, option: 'Burst' }] },
    { id: 'linked', effectId: 'affliction', ranks: 6, fieldValues: { resistance: 'will' }, modifiers: [{ modifierId: 'limited', ranks: 1 }] },
  ] }],
};

describe('PDF content preservation', () => {
  it('exports the full alternate effect, keeping modifiers attached to Linked components', () => {
    const html = renderPowerDetails(power, POWER_DEFS, MODIFIER_DEFS);
    expect(html).toContain('Damage 6 — Area (Burst)');
    expect(html).toContain('Affliction 6 (Resistance Type: Will) — Limited');
    expect(html).toContain('Accurate 2 [4 ranks]');
    expect(html).toContain('Dynamic base effect');
    expect(html).toContain('Activation: move');
    expect(html).toContain('Alternate notes');
    expect(html).toContain('&lt;Pulse&gt;');
    expect(html).not.toContain('<Pulse>');
  });

  it('exports without changing character data, including devices and legacy equipment', async () => {
    const character = createDefaultCharacter({ powers: [power, { ...power, id: 'device', removable: 'removable' }], equipment: [{ ...power, id: 'gear' }] });
    const before = JSON.stringify(character);
    const result = await generateCharacterPDF({ character, powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS,
      skillDefs: Object.fromEntries(SKILL_DEFS.map(def => [def.id, def])), advantageDefs: Object.fromEntries(ADVANTAGE_DEFS.map(def => [def.id, def])) });
    expect(result.success).toBe(true);
    expect(result.html.match(/Area \(Burst\)/g)).toHaveLength(3);
    expect(JSON.stringify(character)).toBe(before);
  });

  it('localizes labels and catalog names without translating user text or changing mechanics', async () => {
    const character = createDefaultCharacter({ header: { name: 'Strength', player: '<Player>', identity: 'Will', base: 'Area', powerLevel: 0, heroPoints: 0 }, powers: [power] });
    const options = { character, powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS, skillDefs: {}, advantageDefs: {} };
    const before = JSON.stringify(options);
    const portuguese = await generateCharacterPDF({ ...options, language: 'pt-BR' });
    const english = await generateCharacterPDF({ ...options, language: 'en' });
    expect(portuguese.html).toContain('lang="pt-BR"');
    expect(portuguese.html).toContain('>Strength</div>');
    expect(portuguese.html).toContain('&lt;Player&gt;');
    expect(portuguese.html).toContain('NP 0');
    expect(portuguese.html).toContain('Dano 6');
    expect(portuguese.html).toContain('Área (Explosão)');
    expect(english.html).toContain('Damage 6');
    expect(english.html).toContain('Area (Burst)');
    expect(JSON.stringify(options)).toBe(before);
  });

  it('omits empty lists by default but honors the explicit preference to show them', async () => {
    const options = { character: createDefaultCharacter(), powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS, skillDefs: {}, advantageDefs: {} };
    const hidden = await generateCharacterPDF(options);
    const shown = await generateCharacterPDF({ ...options, customization: { ...DEFAULT_CUSTOMIZATION, contentMode: undefined, hideEmptySections: false } });
    expect(hidden.html).not.toContain('No powers defined.');
    expect(shown.html).toContain('No powers defined.');
    expect(shown.html).toContain('No skills trained.');
  });
});
