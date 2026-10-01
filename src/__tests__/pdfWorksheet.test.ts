import { describe, expect, it, afterEach, vi } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../entities/gameDataLoaders';
import { generateCharacterPDF } from '../services/pdf/pdfGenerator';
import { DEFAULT_CUSTOMIZATION } from '../services/pdf/types';
import { loadPDFCustomizationOptions, savePDFCustomizationOptions } from '../shared/hooks/usePDFCustomizationStorage';

const definitions = {
  powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS,
  skillDefs: Object.fromEntries(SKILL_DEFS.map(def => [def.id, def])),
  advantageDefs: Object.fromEntries(ADVANTAGE_DEFS.map(def => [def.id, def])),
};
const worksheet = { ...DEFAULT_CUSTOMIZATION, contentMode: 'worksheet' as const,
  includeNotes: false, includeEquipment: false, includeComplications: false };

describe('Printable worksheet', () => {
  it('includes empty identity fields, every skill and writing slots even when optional sections were disabled', async () => {
    const character = createDefaultCharacter();
    const before = JSON.stringify({ character, definitions, worksheet });
    const result = await generateCharacterPDF({ ...definitions, character, customization: worksheet });
    expect(result.success).toBe(true);
    for (const label of ['Player', 'Identity Type', 'Gender', 'Age', 'Height', 'Weight', 'Eyes', 'Hair', 'Group Affiliation', 'Series', 'Game Master', 'Devices & Resources', 'Complications', 'Notes']) {
      expect(result.html).toContain(label);
    }
    for (const skill of SKILL_DEFS) expect(result.html).toContain(skill.name);
    expect(result.html.match(/class="skill-entry worksheet-skill"/g)).toHaveLength(SKILL_DEFS.length);
    expect(result.html.match(/class="power-entry"/g)).toHaveLength(2);
    expect(result.html.match(/class="pdf-writing-row"/g)).toHaveLength(3);
    expect(result.html).not.toMatch(/No (powers|skills|advantages|complications)/);
    expect(result.html).not.toContain('Unnamed Hero');
    expect(JSON.stringify({ character, definitions, worksheet })).toBe(before);
  });

  it('preserves existing specializations, zero ranks, user text and costs without duplicating skill records', async () => {
    const character = createDefaultCharacter({
      header: { name: '<Hero>', player: '', identity: '', base: '', powerLevel: 0, heroPoints: 0 },
      skills: [{ skillId: 'expertise', ranks: 4, subtype: '<Physics>' }, { skillId: 'expertise', ranks: 0, subtype: 'History' }],
      notes: 'Existing notes', equipmentNotes: 'Existing gear', complications: [{ title: '<Enemy>', description: 'Existing description' }],
    });
    const before = JSON.stringify(character);
    const result = await generateCharacterPDF({ ...definitions, character, customization: worksheet });
    expect(result.success).toBe(true);
    expect(result.html).toContain('&lt;Hero&gt;');
    expect(result.html).toContain('PL 0');
    expect(result.html).toContain('Hero Points 0');
    expect(result.html).toContain('&lt;Physics&gt;');
    expect(result.html).toContain('History');
    expect(result.html.match(/class="skill-entry worksheet-skill"/g)).toHaveLength(SKILL_DEFS.length + 1);
    expect(result.html).toContain('2 PP (4 ranks)');
    for (const text of ['Existing notes', 'Existing gear', '&lt;Enemy&gt;', 'Existing description']) expect(result.html).toContain(text);
    expect(JSON.stringify(character)).toBe(before);
  });

  it('switches back to filled content and honors the three optional section choices', async () => {
    const character = createDefaultCharacter({ notes: 'Private background', equipmentNotes: 'Gear detail', complications: [{ title: 'Enemy', description: 'Complication detail' }] });
    const result = await generateCharacterPDF({ ...definitions, character, customization: { ...worksheet, contentMode: 'filled', hideEmptySections: false } });
    expect(result.success).toBe(true);
    expect(result.html).not.toContain('pdf-writing-line');
    for (const text of ['Private background', 'Gear detail', 'Complication detail', 'No powers defined.', 'No skills trained.']) expect(result.html).not.toContain(text);
  });
});

describe('PDF preferences compatibility', () => {
  afterEach(() => vi.unstubAllGlobals());
  it.each([true, false])('loads the previous empty-section preference (%s) without touching character storage', hideEmptySections => {
    const data = new Map([['mm3e-pdf-customization-options', JSON.stringify({ ...DEFAULT_CUSTOMIZATION, contentMode: undefined, hideEmptySections })], ['character-sentinel', 'unchanged']]);
    const setItem = vi.fn((key: string, value: string) => data.set(key, value));
    vi.stubGlobal('localStorage', { getItem: (key: string) => data.get(key), setItem });
    const options = loadPDFCustomizationOptions();
    expect(options.contentMode).toBe(hideEmptySections ? 'filled' : 'worksheet');
    savePDFCustomizationOptions({ ...options, includeNotes: false });
    expect(loadPDFCustomizationOptions().includeNotes).toBe(false);
    expect(setItem).toHaveBeenCalledOnce();
    expect(setItem.mock.calls[0][0]).toBe('mm3e-pdf-customization-options');
    expect(data.get('character-sentinel')).toBe('unchanged');
  });
  it('keeps the new mode and section choices when reopening the preview', () => {
    vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(worksheet) });
    expect(loadPDFCustomizationOptions()).toEqual(worksheet);
  });
});
