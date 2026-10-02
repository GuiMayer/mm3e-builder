import { z } from 'zod';
import type { ICharacterPower, IResource } from '../../entities/types';
import { CharacterPowerSchema } from '../../entities/schemas';
import { createDerivedId } from '../../shared/lib/identity';
import { I18nError } from '../character-file/errors';

const RESOURCE_LIBRARY_KEY = 'mm3e-resource-library';
const BACKUP_KEY = 'mm3e-resources-before-1.18-v1';
const RECOVERY_KEY = 'mm3e-resource-recovery-v1';
export const RESOURCE_LIBRARY_VERSION = 2;

/** Validate known fields completely while preserving extension fields verbatim. */
const ResourcePowerSchema = z.unknown().transform((raw, context): ICharacterPower => {
  const source = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
  const candidate = { ...source, notes: source.notes ?? '', alternateEffects: source.alternateEffects ?? [] };
  const result = CharacterPowerSchema.safeParse(candidate);
  if (!result.success) {
    context.addIssue({ code: 'custom', message: 'Invalid resource power structure' });
    return z.NEVER;
  }
  const components = Array.isArray(source.components) ? source.components : [{
    id: createDerivedId('power', `component:${source.id}`), effectId: source.effectId,
    ranks: source.ranks, modifiers: source.modifiers,
    ...(source.fieldValues ? { fieldValues: source.fieldValues } : {}),
  }];
  const alternateEffects = (candidate.alternateEffects as Record<string, unknown>[]).map((ae) => ({
    ...ae, components: Array.isArray(ae.components) ? ae.components : [{
      id: createDerivedId('power', `alternate-component:${source.id}:${ae.id}`),
      effectId: ae.effectId, ranks: ae.ranks, modifiers: ae.modifiers,
    }],
  }));
  return { ...candidate, components, alternateEffects } as unknown as ICharacterPower;
});
const ResourceFeatureSchema = z.object({
  id: z.string(), name: z.string(), ranks: z.number().int().min(1).optional(), notes: z.string().optional(),
}).passthrough();
const ResourceBaseSchema = z.object({
  id: z.string().uuid(), name: z.string(), notes: z.string(), createdAt: z.string(), updatedAt: z.string(),
}).passthrough();
const powerFields = { power: ResourcePowerSchema, costMode: z.enum(['equipment', 'device']).optional(), costReviewRequired: z.boolean().optional() };
export const ResourceSchema = z.discriminatedUnion('type', [
  ResourceBaseSchema.extend({ type: z.literal('gadget'), ...powerFields }),
  ResourceBaseSchema.extend({ type: z.literal('gear'), ...powerFields }),
  ResourceBaseSchema.extend({ type: z.literal('custom'), ...powerFields }),
  ResourceBaseSchema.extend({
    type: z.literal('vehicle'), size: z.enum(['medium', 'large', 'huge', 'gargantuan', 'colossal', 'awesome']),
    strength: z.number().int(), speed: z.number().int().min(0), defense: z.number().int(), toughness: z.number().int(),
    features: z.array(ResourceFeatureSchema), systems: z.array(ResourcePowerSchema),
    movement: ResourcePowerSchema.optional(), movementReviewRequired: z.boolean().optional(),
  }),
  ResourceBaseSchema.extend({
    type: z.literal('headquarters'),
    size: z.enum(['miniscule', 'fine', 'diminutive', 'tiny', 'small', 'medium', 'large', 'huge', 'gargantuan', 'colossal', 'awesome']),
    toughness: z.number().int(), features: z.array(ResourceFeatureSchema), effects: z.array(ResourcePowerSchema),
    powerLevel: z.number().int().min(1).optional(),
    effectSettings: z.record(z.string(), z.object({ kind: z.enum(['effect', 'defense-system']), target: z.enum(['resource', 'occupants', 'both']) }).passthrough()).optional(),
  }),
]);
export const ResourceLibrarySchema = z.object({ version: z.union([z.literal(1), z.literal(2)]), items: z.array(ResourceSchema) }).passthrough();

export function migrateResourceMetadata(resource: IResource): IResource {
  if (resource.type === 'gadget' || resource.type === 'gear' || resource.type === 'custom') {
    if (resource.costMode) return resource;
    return { ...resource, costMode: 'equipment', ...(resource.type === 'gadget' ? { costReviewRequired: true } : {}) };
  }
  if (resource.type === 'vehicle' && !resource.movement && resource.speed > 0 && resource.movementReviewRequired === undefined) return { ...resource, movementReviewRequired: true };
  return resource;
}
export function parseResourceAppendix(raw: unknown): IResource[] {
  if (raw === undefined) return [];
  const result = ResourceLibrarySchema.safeParse(raw);
  if (!result.success) throw new I18nError('resources.error.invalidResource');
  return result.data.items.map((item) => migrateResourceMetadata(item as IResource));
}
export interface ResourceLoadResult {
  resources: IResource[]; quarantined: unknown[]; error: string | null;
  source: string | null; envelope: Record<string, unknown>;
}
/** One bad record never hides good ones, and all original bytes remain preserved. */
export function readResourceLibrary(): ResourceLoadResult {
  const empty: ResourceLoadResult = { resources: [], quarantined: [], error: null, source: null, envelope: {} };
  if (typeof localStorage === 'undefined') return empty;
  let source: string | null = null;
  try {
    source = localStorage.getItem(RESOURCE_LIBRARY_KEY);
    if (!source) return empty;
    const raw = JSON.parse(source) as Record<string, unknown>;
    if (!raw || ![1, 2].includes(raw.version as number) || !Array.isArray(raw.items)) return { ...empty, source, error: 'resources.storage.unreadable' };
    const resources: IResource[] = [], quarantined: unknown[] = Array.isArray(raw.quarantined) ? [...raw.quarantined] : [];
    const ids = new Set<string>();
    for (const item of raw.items) {
      const parsed = ResourceSchema.safeParse(item);
      if (parsed.success && !ids.has(parsed.data.id)) { ids.add(parsed.data.id); resources.push(migrateResourceMetadata(parsed.data as IResource)); }
      else quarantined.push(item);
    }
    return { resources, quarantined, error: quarantined.length ? 'resources.storage.recovered' : null, source, envelope: raw };
  } catch { return { ...empty, source, error: 'resources.storage.unreadable' }; }
}
export function loadResourceLibrary(): IResource[] { return readResourceLibrary().resources; }
export function preserveResourceSource(source: string): boolean {
  try {
    const existing = localStorage.getItem(BACKUP_KEY);
    if (existing === null) localStorage.setItem(BACKUP_KEY, source);
    return localStorage.getItem(BACKUP_KEY) === (existing ?? source);
  } catch { return false; }
}
export function saveResourceLibrary(items: IResource[], quarantined: unknown[] = [], envelope: Record<string, unknown> = {}, replaceUnreadable = false): boolean {
  if (!ResourceLibrarySchema.safeParse({ version: RESOURCE_LIBRARY_VERSION, items }).success) return false;
  let previous: string | null = null, read = false;
  try {
    previous = localStorage.getItem(RESOURCE_LIBRARY_KEY); read = true;
    if (previous) {
      const prior = readResourceLibrary();
      if (prior.error === 'resources.storage.unreadable') {
        if (!replaceUnreadable) return false;
        const recovery = localStorage.getItem(RECOVERY_KEY);
        if (recovery !== null && recovery !== previous) return false;
        localStorage.setItem(RECOVERY_KEY, previous);
        if (localStorage.getItem(RECOVERY_KEY) !== previous) return false;
      }
      if ((prior.envelope.version !== RESOURCE_LIBRARY_VERSION || prior.quarantined.length > 0) && !preserveResourceSource(previous)) return false;
      if (!quarantined.length && prior.quarantined.length) quarantined = prior.quarantined;
      envelope = { ...prior.envelope, ...envelope };
    }
    const serialized = JSON.stringify({ ...envelope, version: RESOURCE_LIBRARY_VERSION, items, quarantined });
    localStorage.setItem(RESOURCE_LIBRARY_KEY, serialized);
    if (localStorage.getItem(RESOURCE_LIBRARY_KEY) !== serialized) throw new Error('Resource write verification failed');
    return true;
  } catch (error) {
    if (read) { try { if (previous === null) localStorage.removeItem(RESOURCE_LIBRARY_KEY); else localStorage.setItem(RESOURCE_LIBRARY_KEY, previous); } catch { /* Preserve recovery source. */ } }
    console.error('[resources] Failed to save resource library:', error);
    return false;
  }
}
export const resourceLibraryStorageKeys = { library: RESOURCE_LIBRARY_KEY, backup: BACKUP_KEY, recovery: RECOVERY_KEY } as const;
