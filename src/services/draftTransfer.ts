import { z } from 'zod';
import type { CharacterTab } from '../entities/characterTab';
import type { IResource } from '../entities/types';
import { CharacterSchema } from '../entities/schemas';
import { ResourceLibrarySchema } from './storage/resourceLibraryStorage';
import { normalizeCharacter } from './character-file/normalizeCharacter';

const MANIFEST = 'mm3e-draft';
const RESOURCE_MANIFEST = 'mm3e-resources';
const ManifestSchema = z.object({ type: z.literal('manifest'), format: z.literal(MANIFEST), version: z.literal(1), exportedAt: z.string(), activeCharacterId: z.string().nullable() });
const TabSchema = z.object({ type: z.literal('character-tab'), tab: z.object({ id: z.string(), character: CharacterSchema, label: z.string(), lastModified: z.number() }) });
const ResourceLineSchema = z.object({ type: z.literal('resource'), resource: z.unknown() });

export interface DraftBundle { tabs: CharacterTab[]; activeId: string | null; resources: IResource[]; }

export function serializeDraftBundle(tabs: CharacterTab[], activeId: string | null, resources: IResource[]): string {
  const lines = [JSON.stringify({ type: 'manifest', format: MANIFEST, version: 1, exportedAt: new Date().toISOString(), activeCharacterId: activeId })];
  tabs.forEach(({ id, character, label, lastModified }) => lines.push(JSON.stringify({ type: 'character-tab', tab: { id, character, label, lastModified } })));
  resources.forEach((resource) => lines.push(JSON.stringify({ type: 'resource', resource })));
  return `${lines.join('\n')}\n`;
}

export function parseDraftBundle(text: string): DraftBundle {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) throw new Error('Draft file is empty.');
  const records = lines.map((line, index) => { try { return JSON.parse(line) as unknown; } catch { throw new Error(`Invalid JSON on line ${index + 1}.`); } });
  const manifest = ManifestSchema.safeParse(records[0]);
  if (!manifest.success) throw new Error('This is not a supported Draft export.');
  const tabs: CharacterTab[] = [];
  const resources: IResource[] = [];
  for (const record of records.slice(1)) {
    const tab = TabSchema.safeParse(record);
    if (tab.success) { tabs.push({ ...tab.data.tab, character: normalizeCharacter(tab.data.tab.character as unknown as CharacterTab['character']), isDirty: false }); continue; }
    const resourceLine = ResourceLineSchema.safeParse(record);
    if (!resourceLine.success) throw new Error('The Draft contains an invalid record.');
    const resource = ResourceLibrarySchema.safeParse({ version: 1, items: [resourceLine.data.resource] });
    if (!resource.success) throw new Error('The Draft contains an invalid Resource.');
    resources.push(resource.data.items[0] as unknown as IResource);
  }
  const ids = new Set<string>();
  if (tabs.some((tab) => ids.has(tab.id) || !ids.add(tab.id))) throw new Error('The Draft contains duplicate character tabs.');
  const activeId = manifest.data.activeCharacterId && ids.has(manifest.data.activeCharacterId) ? manifest.data.activeCharacterId : tabs[0]?.id ?? null;
  return { tabs, activeId, resources };
}

export function serializeResourceLibrary(resources: IResource[]): string {
  return `${[JSON.stringify({ type: 'manifest', format: RESOURCE_MANIFEST, version: 1, exportedAt: new Date().toISOString() }), ...resources.map((resource) => JSON.stringify({ type: 'resource', resource }))].join('\n')}\n`;
}

export function parseResourceLibrary(text: string): IResource[] {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) throw new Error('Resource file is empty.');
  const records = lines.map((line, index) => { try { return JSON.parse(line) as unknown; } catch { throw new Error(`Invalid JSON on line ${index + 1}.`); } });
  const manifest = z.object({ type: z.literal('manifest'), format: z.literal(RESOURCE_MANIFEST), version: z.literal(1) }).safeParse(records[0]);
  if (!manifest.success) throw new Error('This is not a supported Resource export.');
  return records.slice(1).map((record) => { const line = ResourceLineSchema.safeParse(record); if (!line.success) throw new Error('The file contains an invalid Resource record.'); const result = ResourceLibrarySchema.safeParse({ version: 1, items: [line.data.resource] }); if (!result.success) throw new Error('The file contains an invalid Resource.'); return result.data.items[0] as unknown as IResource; });
}
