import 'fake-indexeddb/auto';
import { renderHeaderSection } from '../services/pdf/components/HeaderSection';
import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { clearPortraits, savePortrait } from '../services/storage/portraitStorage';
import { generateCharacterPDF } from '../services/pdf/pdfGenerator';
import { DEFAULT_CUSTOMIZATION } from '../services/pdf/types';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';
import { duplicateImportedCharacter } from '../entities/characterImport';
import { copyCharacterPortrait, hasLocalPortrait } from '../services/portraits/portraitLifecycle';

const definitions = { powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS, skillDefs: {}, advantageDefs: {} };
describe('portrait exports and copies', () => {
  it('keeps PDF opt-in and embeds a local portrait only in the generated document', async () => {
    await clearPortraits();
    const character = createDefaultCharacter({ characterId: crypto.randomUUID() });
    const before = JSON.stringify(character);
    const image = new Blob(['portrait'], { type: 'image/png' });
    await savePortrait({ image, thumbnail: image, width: 10, height: 20 }, { characterId: character.characterId! });
    const normal = await generateCharacterPDF({ ...definitions, character });
    expect(normal.html).not.toContain('<img class="pdf-portrait"');
    const shown = await generateCharacterPDF({ ...definitions, character, customization: { ...DEFAULT_CUSTOMIZATION, includePortrait: true } });
    expect(shown.success).toBe(true);
    expect(shown.html).toContain('<img class="pdf-portrait" src="data:image/png;base64,');
    expect(shown.portraitUnavailable).toBe(false);
    expect(JSON.stringify(character)).toBe(before);
    const copy = duplicateImportedCharacter(character, []);
    await copyCharacterPortrait(character, copy);
    expect(await hasLocalPortrait(copy)).toBe(true);
  });
  it.each([undefined, 'contain', 'cover', 'fill'] as const)('renders PDF with portrait fit %s', portraitFit => {
    const character = createDefaultCharacter();
    character.header.portraitFit = portraitFit;
    const html = renderHeaderSection({
      character, portraitDataUrl: 'data:image/png;base64,YQ==',
      powerPointsData: { abilitiesCost: 0, defensesCost: 0, skillsCost: 0, advantagesCost: 0, powersCost: 0, totalAvailable: 150, totalSpent: 0, remaining: 150, ppEarned: 0 },
    });
    expect(html).toContain(`object-fit:${portraitFit ?? 'contain'};object-position:center`);
  });
  it('omits malformed portrait sources', () => {
    const html = renderHeaderSection({
      character: createDefaultCharacter(), portraitDataUrl: "data:image/png;base64,YQ==');background:red",
      powerPointsData: { abilitiesCost: 0, defensesCost: 0, skillsCost: 0, advantagesCost: 0, powersCost: 0, totalAvailable: 150, totalSpent: 0, remaining: 150, ppEarned: 0 },
    });
    expect(html).not.toContain('<img');
    expect(html).not.toContain('pdf-header--portrait');
  });
  it('reports a missing portrait without breaking export', async () => {
    const character = createDefaultCharacter({ characterId: crypto.randomUUID() });
    const result = await generateCharacterPDF({ ...definitions, character, customization: { ...DEFAULT_CUSTOMIZATION, includePortrait: true } });
    expect(result.success).toBe(true);
    expect(result.portraitUnavailable).toBe(true);
    expect(result.html).not.toContain('<img class="pdf-portrait"');
  });
});
