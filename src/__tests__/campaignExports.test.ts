import { createInstance } from 'i18next';
import ExcelJS from 'exceljs';
import { describe, expect, it } from 'vitest';
import en from '../locales/en/translation.json';
import pt from '../locales/pt-BR/translation.json';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { createCampaign } from '../shared/lib/campaign';
import { calculateCharacterPointSummary } from '../shared/lib/pointSummary';
import { buildCampaignSheet } from '../services/excelGenerator';
import { buildExcelLabels } from '../services/excelExportConfig';
import { generateCharacterPDF } from '../services/pdf/pdfGenerator';
import { DEFAULT_CUSTOMIZATION } from '../services/pdf/types';
import { parseDraftBundle, serializeDraftBundle } from '../services/draftTransfer';

const character = createDefaultCharacter({
  header: { ...createDefaultCharacter().header, powerLevel: 16 }, campaignMode: true, campaign: createCampaign(10),
  ppLog: [{ id: 'legacy', date: '', amount: 1.5, note: '  <script>preserved</script>\nsecond line  ', session: '<Session>' },
    { id: 'second', date: '2026-10-02', amount: -2, note: 'Adjustment', kind: 'adjustment' }],
});
const definitions = { powerDefs: [], modifierDefs: [], skillDefs: {}, advantageDefs: {} };
describe('Campaign exports', () => {
  it('roundtrips inactive campaign configuration, optional metadata and legacy fractions through JSONL', () => {
    const source = { ...character, campaignMode: false };
    const text = serializeDraftBundle([{ id: 'tab', character: source, label: 'Test', lastModified: 0, isDirty: false }], 'tab', []);
    const restored = parseDraftBundle(text).tabs[0].character;
    expect(restored.campaign).toEqual(source.campaign);
    expect(restored.ppLog).toEqual(source.ppLog);
    expect(restored.campaignMode).toBe(false);
    expect(restored.header.powerLevel).toBe(16);
  });
  it('exports localized Excel metadata and fractional ledger values from the fixed base, including inactive campaigns', async () => {
    const i18n = createInstance();
    await i18n.init({ lng: 'pt-BR', resources: { en: { translation: en }, 'pt-BR': { translation: pt } } });
    const labels = buildExcelLabels(i18n.t.bind(i18n));
    for (const active of [true, false]) {
      const sheetCharacter = { ...character, campaignMode: active };
      const wb = new ExcelJS.Workbook();
      buildCampaignSheet(wb, sheetCharacter, labels, calculateCharacterPointSummary(sheetCharacter, [], [], []));
      const reloaded = new ExcelJS.Workbook();
      await reloaded.xlsx.load(await wb.xlsx.writeBuffer());
      const sheet = reloaded.getWorksheet('Campanha')!;
      expect(sheet.getCell('B1').value).toBe(active ? labels.yes : labels.no);
      expect(sheet.getCell('B4').value).toBe(150);
      expect(sheet.getCell('B5').value).toBe(active ? 149.5 : 240);
      expect(sheet.getCell('D10').value).toBe(character.ppLog![0].note);
      expect(sheet.getCell('E10').value).toBe(1.5);
      expect(sheet.getCell('F10').value).toBe(151.5);
      expect(sheet.getCell('F11').value).toBe(149.5);
      expect(sheet.getCell('E9').value).toBe('Quantidade');
    }
  });
  it('includes history in HTML only when opted in, escapes user text and preserves all stored fields', async () => {
    const before = JSON.stringify(character);
    const hidden = await generateCharacterPDF({ ...definitions, character, language: 'pt-BR' });
    expect(hidden.success).toBe(true);
    expect(hidden.html).not.toContain('class="pdf-section pdf-campaign-section"');
    const shown = await generateCharacterPDF({ ...definitions, character, language: 'pt-BR', customization: { ...DEFAULT_CUSTOMIZATION, includeCampaignHistory: true } });
    expect(shown.success).toBe(true);
    expect(shown.html).toContain('Histórico de campanha');
    expect(shown.html).toContain('PP iniciais: 150');
    expect(shown.html).toContain('PP disponíveis: 149.5');
    expect(shown.html).toContain('&lt;script&gt;preserved&lt;/script&gt;<br>second line');
    expect(shown.html).toContain('&lt;Session&gt;');
    expect(shown.html).not.toContain('<script>');
    expect(JSON.stringify(character)).toBe(before);
    const paused = await generateCharacterPDF({ ...definitions, character: { ...character, campaignMode: false }, language: 'pt-BR', customization: { ...DEFAULT_CUSTOMIZATION, includeCampaignHistory: true } });
    expect(paused.html).toContain('Campanha desativada');
    expect(paused.html).toContain('PP disponíveis: 240');
    const standard = await generateCharacterPDF({ ...definitions, character: createDefaultCharacter(), customization: { ...DEFAULT_CUSTOMIZATION, includeCampaignHistory: true } });
    expect(standard.html).not.toContain('class="pdf-section pdf-campaign-section"');
  });
});
