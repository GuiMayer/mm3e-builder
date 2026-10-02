import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { prepareCampaignMigration, applyCampaignMigration, CAMPAIGN_MIGRATION_BACKUP_KEY } from '../services/storage/campaignMigration';
import { parseDraftStorageSnapshot } from '../services/storage/draftUpdateBackup';
import { calculateCharacterPointSummary } from '../shared/lib/pointSummary';
import { normalizeCharacter } from '../services/character-file/normalizeCharacter';

const draftKey = 'mm3e-draft-characters';
function fixture() {
  const active = createDefaultCharacter({ header: { ...createDefaultCharacter().header, name: 'Old hero', powerLevel: 11 }, campaignMode: true,
    ppLog: [{ id: 'award', date: '2020-01-01', amount: 20, note: ' Award\n ' }, { id: 'duplicate-id', date: '', amount: -5, note: 'Deduction' }, { id: 'duplicate-id', date: 'bad-date', amount: 1.5, note: 'Original fraction' }] });
  delete active.campaign;
  const inactive = { ...active, campaignMode: false };
  const normal = createDefaultCharacter();
  const raw = JSON.stringify({ version: 1, activeCharacterId: 'a', characters: [active, inactive, normal].map((character, i) => ({ id: String(i), character, label: 'Original label', lastModified: i })), savedAt: 'original' });
  const values = new Map<string, string>([[draftKey, raw], ['mm3e-resource-library', 'original resources']]);
  return { raw, active, values, storage: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } } };
}
describe('Reviewed campaign storage migration', () => {
  it('detects active and previously used inactive characters but ignores unused and already migrated drafts', () => {
    const data = fixture();
    const pending = prepareCampaignMigration(data.storage)!;
    expect(pending.characters).toHaveLength(2);
    const bases = Object.fromEntries(pending.characters.map(row => [row.key, { initialPowerLevel: 10, initialPP: 150 }]));
    expect(applyCampaignMigration(pending, bases, data.storage).success).toBe(true);
    expect(prepareCampaignMigration(data.storage)).toBeNull();
  });
  it('corrects duplicated PL grants with the reviewed starting PL and preserves every original field', () => {
    const data = fixture();
    const pending = prepareCampaignMigration(data.storage)!;
    const bases = Object.fromEntries(pending.characters.map(row => [row.key, { initialPowerLevel: 10, initialPP: 150 }]));
    expect(applyCampaignMigration(pending, bases, data.storage).success).toBe(true);
    const stored = JSON.parse(data.values.get(draftKey)!);
    const first = stored.characters[0].character;
    const { campaign, ...rest } = first;
    expect(rest).toEqual(data.active);
    expect(campaign).toEqual({ version: 1, initialPP: 150, initialPowerLevel: 10 });
    expect(calculateCharacterPointSummary(normalizeCharacter(first), [], [], []).totalAvailable).toBe(166.5);
    expect(stored.characters[1].character.campaignMode).toBe(false);
    const snapshot = parseDraftStorageSnapshot(data.values.get(CAMPAIGN_MIGRATION_BACKUP_KEY)!);
    expect(snapshot?.entries.find(entry => entry.key === draftKey)?.value).toBe(data.raw);
    expect(data.values.get('mm3e-resource-library')).toBe('original resources');
  });
  it('aborts before touching sources if the backup cannot be written', () => {
    const data = fixture();
    const pending = prepareCampaignMigration(data.storage)!;
    const bases = Object.fromEntries(pending.characters.map(row => [row.key, { initialPowerLevel: 10, initialPP: 150 }]));
    const storage = { ...data.storage, setItem: () => { throw new Error('quota'); } };
    expect(applyCampaignMigration(pending, bases, storage).success).toBe(false);
    expect(data.values.get(draftKey)).toBe(data.raw);
  });
  it('rolls back a failed write and keeps a verified original snapshot for recovery', () => {
    const data = fixture();
    const pending = prepareCampaignMigration(data.storage)!;
    const bases = Object.fromEntries(pending.characters.map(row => [row.key, { initialPowerLevel: 10, initialPP: 150 }]));
    let once = true;
    const storage = { ...data.storage, setItem: (key: string, value: string) => {
      if (key === draftKey && once) { once = false; data.values.set(key, value); throw new Error('write'); }
      data.storage.setItem(key, value);
    } };
    expect(applyCampaignMigration(pending, bases, storage).success).toBe(false);
    expect(data.values.get(draftKey)).toBe(data.raw);
    expect(data.values.has(CAMPAIGN_MIGRATION_BACKUP_KEY)).toBe(true);
  });
  it('does not overwrite a draft changed in another tab while the popup was open', () => {
    const data = fixture();
    const pending = prepareCampaignMigration(data.storage)!;
    data.values.set(draftKey, 'changed elsewhere');
    expect(applyCampaignMigration(pending, {}, data.storage)).toMatchObject({ success: false, error: 'campaign.migrationChanged' });
    expect(data.values.get(draftKey)).toBe('changed elsewhere');
  });
  it('supports the single-character legacy storage and allows a reviewed custom initial budget', () => {
    const data = fixture();
    data.values.delete(draftKey);
    const key = 'mm3e-draft-character';
    data.values.set(key, JSON.stringify({ schemaVersion: '1.0.0', character: data.active }));
    const pending = prepareCampaignMigration(data.storage)!;
    expect(applyCampaignMigration(pending, { [pending.characters[0].key]: { initialPowerLevel: 8, initialPP: 130 } }, data.storage).success).toBe(true);
    expect(JSON.parse(data.values.get(key)!).character.campaign.initialPP).toBe(130);
  });
});
