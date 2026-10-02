import { v4 as uuid } from 'uuid';
import type { ICharacter, IResource } from '../../entities/types';
import { I18nError } from '../../services/character-file/errors';

export type ResourceImportChoice = 'keep' | 'update' | 'copy';

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`).join(',')}}`;
  return JSON.stringify(value) ?? 'undefined';
}

export function findResourceImportConflicts(incoming: IResource[], local: IResource[]): IResource[] {
  const existing = new Map(local.map(item => [item.id, item]));
  return incoming.filter(item => existing.has(item.id) && canonical(item) !== canonical(existing.get(item.id)));
}

/** Only the imported character's references are remapped; local sheets keep their identities. */
export function prepareResourceImport(character: ICharacter, incoming: IResource[], local: IResource[], choice: ResourceImportChoice) {
  const conflicts = new Set(findResourceImportConflicts(incoming, local).map(item => item.id));
  const remap = new Map<string, string>();
  const resources = incoming.flatMap(item => {
    if (!conflicts.has(item.id)) return [item];
    if (choice === 'keep') return [];
    if (choice === 'update') return [item];
    const id = uuid(); remap.set(item.id, id);
    return [{ ...structuredClone(item), id }];
  });
  const imported = remap.size ? { ...character, resourceLinks: character.resourceLinks?.map(link => ({ ...link, resourceId: remap.get(link.resourceId) ?? link.resourceId })) } : character;
  const available = new Set([...local, ...resources].map(item => item.id));
  const missing = (imported.resourceLinks ?? []).filter(link => !available.has(link.resourceId));
  if (missing.length) throw new I18nError('resources.import.missing', { count: String(missing.length) });
  return { character: imported, resources, replaceExisting: choice === 'update' };
}
