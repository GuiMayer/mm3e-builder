import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { createCampaign, isCampaignDate, validCampaignEntry, migrateCampaignCharacter } from '../shared/lib/campaign';
import { calculateCharacterPointSummary, createCharacterPointSummarySelector } from '../shared/lib/pointSummary';
import { CharacterSchema } from '../entities/schemas';
import { sanitizeCharacterForExport } from '../services/character-file/sanitizeCharacter';
import { normalizeCharacter } from '../services/character-file/normalizeCharacter';

const summary = (character: ReturnType<typeof createDefaultCharacter>) => calculateCharacterPointSummary(character, [], [], []);
const log = [{ id: 'old', date: '', amount: 1.5, note: '  Legacy note\nwith space  ' }];
describe('Campaign progression', () => {
  it('keeps the starting budget independent of current PL, including selector invalidation', () => {
    const character = createDefaultCharacter({ campaignMode: true, campaign: createCampaign(10), ppLog: [{ ...log[0], amount: 15 }] });
    expect(summary(character).totalAvailable).toBe(165);
    const advanced = { ...character, header: { ...character.header, powerLevel: 11 } };
    expect(summary(advanced).totalAvailable).toBe(165);
    const select = createCharacterPointSummarySelector([], []);
    expect(select(advanced, []).totalAvailable).toBe(165);
    expect(select({ ...advanced, campaign: createCampaign(10, 120) }, []).totalAvailable).toBe(135);
  });
  it('suspends adjustments when inactive and restores the same configuration and ledger', () => {
    const character = createDefaultCharacter({ campaignMode: true, ppLog: [{ ...log[0], amount: -5 }] });
    expect(summary(character).totalAvailable).toBe(145);
    expect(summary({ ...character, campaignMode: false }).totalAvailable).toBe(150);
    expect(summary({ ...character, campaignMode: true }).totalAvailable).toBe(145);
  });
  it('reads legacy fractions/dates losslessly and migrates exactly once without editing the ledger', () => {
    const character = createDefaultCharacter({ campaignMode: false, ppLog: log });
    delete character.campaign;
    const before = JSON.stringify(character);
    const migrated = migrateCampaignCharacter(character);
    expect(JSON.stringify(character)).toBe(before);
    expect(migrated.ppLog).toBe(character.ppLog);
    expect(migrateCampaignCharacter(migrated)).toBe(migrated);
    expect(CharacterSchema.parse(migrated).ppLog).toEqual(log);
    expect(normalizeCharacter(sanitizeCharacterForExport(migrated)).ppLog).toEqual(log);
  });
  it('does not introduce campaign data into unused standard characters', () => {
    const character = createDefaultCharacter();
    expect(migrateCampaignCharacter(character)).toBe(character);
    expect(character.campaign).toBeUndefined();
  });
  it('rejects new invalid awards, dates and amounts without rounding', () => {
    for (const amount of [0, 1.5, NaN, Infinity, 1_000_001]) expect(validCampaignEntry({ date: '2026-10-02', amount, note: '' })).toBe(false);
    expect(validCampaignEntry({ date: '2026-10-02', amount: -2, note: '', kind: 'adjustment' })).toBe(true);
    expect(validCampaignEntry({ date: '2026-10-02', amount: -2, note: '', kind: 'award' })).toBe(false);
    expect(isCampaignDate('2026-02-30')).toBe(false);
    expect(isCampaignDate('2024-02-29')).toBe(true);
    expect(isCampaignDate('')).toBe(false);
  });
  it('preserves PL above 15 through the export sanitizer', () => {
    const character = createDefaultCharacter({ header: { ...createDefaultCharacter().header, powerLevel: 16 }, campaignMode: true });
    expect(sanitizeCharacterForExport(character).header.powerLevel).toBe(16);
    expect(summary(normalizeCharacter(sanitizeCharacterForExport(character)))).toEqual(summary(character));
  });
});
