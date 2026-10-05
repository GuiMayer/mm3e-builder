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
  it('shows natural ability ranks and active enhancements below the total, without counting circumstances as ranks', async () => {
    const character = createDefaultCharacter({
      powers: [{ id: 'strength', name: 'Enhanced Strength', notes: '', alternateEffects: [], components: [
        { id: 'strength-effect', effectId: 'enhanced-trait', ranks: 5, modifiers: [], enhancedTarget: { kind: 'ability', key: 'str' } },
      ] }],
      traitModifiers: [{ id: 'tools', target: { kind: 'ability', key: 'str' }, scope: 'check', value: 2, source: 'Tools', active: true }],
      absentAbilities: ['sta'],
    });
    character.abilities.str = 2;
    const before = JSON.stringify(character);
    for (const language of ['en', 'pt-BR']) {
      for (const enabled of [true, false]) {
        const result = await generateCharacterPDF({
          character: { ...character, powerUsage: { 'power:strength': { enabled } } },
          powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS, skillDefs: {}, advantageDefs: {}, language,
        });
        expect(result.success).toBe(true);
        const abilities = result.html.split('<div class="abilities-grid">')[1].split('<div class="defenses-grid">')[0];
        const strength = abilities.split('<div class="ability-box">')[1].split('<div class="ability-box absent">')[0];
        expect(strength).toContain(`<div class="ability-value">${enabled ? 7 : 2}</div>`);
        expect(strength).toContain('<span>Base: 2</span>');
        expect(strength).toContain(`<span>${language === 'en' ? 'Bonus' : 'Bônus'}: ${enabled ? 5 : 0}</span>`);
        const absent = abilities.split('<div class="ability-box absent">')[1].split('<div class="ability-box">')[0];
        expect(absent).toContain('<div class="ability-value">—</div>');
        expect(absent).toContain('<span>Base: —</span>');
      }
    }
    expect(JSON.stringify(character)).toBe(before);
  });
  it.each([3, -2])('includes zero-rank skills with a manual bonus of %s', async bonus => {
    const character = createDefaultCharacter({ skills: [{ skillId: 'acrobatics', ranks: 0, subtype: null, otherBonus: bonus }] });
    const before = JSON.stringify(character);
    for (const language of ['en', 'pt-BR']) {
      const result = await generateCharacterPDF({ character, powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS, language,
        skillDefs: Object.fromEntries(SKILL_DEFS.map(def => [def.id, def])), advantageDefs: {} });
      expect(result.success).toBe(true);
      expect(result.html).toContain(language === 'en' ? 'Acrobatics' : 'Acrobacia');
      expect(result.html).toContain(bonus > 0 ? '+3' : '-2');
      expect(result.html).not.toContain('No skills trained.');
    }
    expect(JSON.stringify(character)).toBe(before);
  });
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
