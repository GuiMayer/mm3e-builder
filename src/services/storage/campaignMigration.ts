import { captureDraftStorageSnapshot, serializeDraftStorageSnapshot, type DraftStorageSnapshot } from './draftUpdateBackup';
import { createCampaign } from '../../shared/lib/campaign';

export const CAMPAIGN_MIGRATION_BACKUP_KEY = 'mm3e-campaign-migration-backup-v1';
type StorageAccess = Pick<Storage, 'getItem' | 'setItem'>;
type RawObject = Record<string, unknown>;
const object = (value: unknown): value is RawObject => !!value && typeof value === 'object' && !Array.isArray(value);

export interface PendingCampaignCharacter {
  key: string;
  name: string;
  powerLevel: number;
  adjustments: number;
  active: boolean;
  previousAvailable: number;
}
export interface PendingCampaignMigration {
  snapshot: DraftStorageSnapshot;
  sources: Array<{ key: string; value: string; data: RawObject }>;
  characters: PendingCampaignCharacter[];
}
export interface CampaignMigrationBase { initialPowerLevel: number; initialPP: number }

function rawCharacters(data: RawObject): Array<{ character: RawObject; key: string }> {
  if (Array.isArray(data.characters)) return data.characters.flatMap((tab, index) =>
    object(tab) && object(tab.character) ? [{ character: tab.character, key: String(index) }] : []);
  return object(data.character) ? [{ character: data.character, key: 'single' }] : [];
}

/** Inspect the original bytes before normalizers can add campaign metadata. No writes. */
export function prepareCampaignMigration(storage: Pick<Storage, 'getItem'> = localStorage): PendingCampaignMigration | null {
  const snapshot = captureDraftStorageSnapshot('campaign-v1', storage);
  if (!snapshot) return null;
  const sources: PendingCampaignMigration['sources'] = [];
  const characters: PendingCampaignCharacter[] = [];
  for (const entry of snapshot.entries) {
    if (entry.key !== 'mm3e-draft-characters' && entry.key !== 'mm3e-draft-character') continue;
    let data: unknown;
    try { data = JSON.parse(entry.value); } catch { continue; }
    if (!object(data)) continue;
    let used = false;
    for (const row of rawCharacters(data)) {
      const character = row.character;
      if (character.campaign !== undefined || (!character.campaignMode && !(Array.isArray(character.ppLog) && character.ppLog.length))) continue;
      const header = character.header;
      if (!object(header) || !Number.isSafeInteger(header.powerLevel) || (header.powerLevel as number) < 1) continue;
      const log = character.ppLog ?? [];
      // Unreadable entries belong to recovery, never to a lossy arithmetic migration.
      if (!Array.isArray(log) || log.some(item => !object(item) || typeof item.amount !== 'number' || !Number.isFinite(item.amount))) continue;
      const adjustments = log.reduce((sum, item) => sum + ((item as RawObject).amount as number), 0);
      if (!Number.isFinite(adjustments)) continue;
      const powerLevel = header.powerLevel as number;
      const active = character.campaignMode === true;
      characters.push({ key: `${entry.key}:${row.key}`, name: typeof header.name === 'string' ? header.name : '', powerLevel, adjustments, active, previousAvailable: powerLevel * 15 + (active ? adjustments : 0) });
      used = true;
    }
    if (used) sources.push({ key: entry.key, value: entry.value, data });
  }
  return characters.length ? { snapshot, sources, characters } : null;
}

/** Preserve complete raw sources, then atomically-per-key write reviewed additive metadata with rollback. */
export function applyCampaignMigration(pending: PendingCampaignMigration, bases: Record<string, CampaignMigrationBase>, storage: StorageAccess = localStorage): { success: true } | { success: false; error: string } {
  try {
    for (const source of pending.sources) if (storage.getItem(source.key) !== source.value) return { success: false, error: 'campaign.migrationChanged' };
    for (const row of pending.characters) {
      const base = bases[row.key];
      if (!base || !Number.isSafeInteger(base.initialPowerLevel) || base.initialPowerLevel < 1 || !Number.isFinite(base.initialPP) || base.initialPP < 0 || base.initialPP > 1_000_000) return { success: false, error: 'campaign.invalidBase' };
    }
    const changes = pending.sources.map(source => {
      const data = JSON.parse(source.value) as RawObject;
      for (const row of rawCharacters(data)) {
        const base = bases[`${source.key}:${row.key}`];
        if (base) row.character.campaign = createCampaign(base.initialPowerLevel, base.initialPP);
      }
      return { ...source, updated: JSON.stringify(data) };
    });
    const backup = serializeDraftStorageSnapshot(pending.snapshot);
    storage.setItem(CAMPAIGN_MIGRATION_BACKUP_KEY, backup);
    if (storage.getItem(CAMPAIGN_MIGRATION_BACKUP_KEY) !== backup) return { success: false, error: 'campaign.migrationWriteFailed' };
    try {
      for (const change of changes) {
        storage.setItem(change.key, change.updated);
        if (storage.getItem(change.key) !== change.updated) throw new Error('Campaign write verification failed');
      }
    } catch {
      for (const source of pending.sources) storage.setItem(source.key, source.value);
      return { success: false, error: 'campaign.migrationWriteFailed' };
    }
    return { success: true };
  } catch { return { success: false, error: 'campaign.migrationWriteFailed' }; }
}
