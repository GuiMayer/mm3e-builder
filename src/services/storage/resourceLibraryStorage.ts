import { z } from 'zod';
import type { IResource } from '../../entities/types';

const RESOURCE_LIBRARY_KEY = 'mm3e-resource-library';
const RESOURCE_LIBRARY_VERSION = 1;

const ResourceFeatureSchema = z.object({
  id: z.string(), name: z.string(), ranks: z.number().int().min(1).optional(), notes: z.string().optional(),
});

// Resource powers are intentionally opaque here: character-file validation owns
// the complete power schema, while this storage boundary rejects malformed roots.
const ResourcePowerSchema = z.object({ id: z.string(), name: z.string() }).passthrough();
const ResourceBaseSchema = z.object({
  id: z.string().uuid(), name: z.string(), notes: z.string(), createdAt: z.string(), updatedAt: z.string(),
});

const ResourceSchema = z.discriminatedUnion('type', [
  ResourceBaseSchema.extend({ type: z.literal('gadget'), power: ResourcePowerSchema }),
  ResourceBaseSchema.extend({ type: z.literal('gear'), power: ResourcePowerSchema }),
  ResourceBaseSchema.extend({ type: z.literal('custom'), power: ResourcePowerSchema }),
  ResourceBaseSchema.extend({
    type: z.literal('vehicle'), size: z.enum(['medium', 'large', 'huge', 'gargantuan', 'colossal', 'awesome']),
    strength: z.number().int(), speed: z.number().int(), defense: z.number().int(), toughness: z.number().int(),
    features: z.array(ResourceFeatureSchema), systems: z.array(ResourcePowerSchema),
  }),
  ResourceBaseSchema.extend({
    type: z.literal('headquarters'),
    size: z.enum(['miniscule', 'fine', 'diminutive', 'tiny', 'small', 'medium', 'large', 'huge', 'gargantuan', 'colossal', 'awesome']),
    toughness: z.number().int(), features: z.array(ResourceFeatureSchema), effects: z.array(ResourcePowerSchema),
  }),
]);

export const ResourceLibrarySchema = z.object({ version: z.number().int(), items: z.array(ResourceSchema) });

export function parseResourceAppendix(raw: unknown): IResource[] {
  const result = ResourceLibrarySchema.safeParse(raw);
  return result.success ? result.data.items as unknown as IResource[] : [];
}

export function loadResourceLibrary(): IResource[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RESOURCE_LIBRARY_KEY);
    if (!stored) return [];
    const result = ResourceLibrarySchema.safeParse(JSON.parse(stored));
    return result.success ? result.data.items as unknown as IResource[] : [];
  } catch {
    return [];
  }
}

export function saveResourceLibrary(items: IResource[]): boolean {
  try {
    localStorage.setItem(RESOURCE_LIBRARY_KEY, JSON.stringify({ version: RESOURCE_LIBRARY_VERSION, items }));
    return true;
  } catch (error) {
    console.error('[resources] Failed to save resource library:', error);
    return false;
  }
}

export const resourceLibraryStorageKeys = { library: RESOURCE_LIBRARY_KEY } as const;
