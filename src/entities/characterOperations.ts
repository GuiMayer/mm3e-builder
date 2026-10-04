import type { ICharacter } from './types';
import { createId } from '../shared/lib/identity';

export function getDuplicateCharacterName(
  sourceName: string,
  existingNames: string[]
): string {
  const baseName = sourceName || 'Unnamed Character';
  const copyMatch = baseName.match(/^(.+?)(?: \(Copy(?: (\d+))?\))?$/);
  if (!copyMatch) return `${baseName} (Copy)`;

  const base = copyMatch[1];
  const copyNumbers = existingNames
    .filter((name) => name.startsWith(`${base} (Copy`))
    .map((name) => {
      const match = name.match(/\(Copy(?: (\d+))?\)$/);
      return match ? (match[1] ? Number.parseInt(match[1], 10) : 1) : 0;
    });
  const nextNumber = Math.max(0, ...copyNumbers) + 1;
  return nextNumber === 1 ? `${base} (Copy)` : `${base} (Copy ${nextNumber})`;
}

/** Deep-clones a character and regenerates every identity owned by the copy. */
export function duplicateCharacterWithNewIds(
  character: ICharacter,
  name: string
): ICharacter {
  const clone = JSON.parse(JSON.stringify(character)) as ICharacter;
  clone.header.name = name;
  clone.characterId = createId();
  const powerIds = new Map<string, string>();
  const newPowerId = (old: string) => { const id = createId(); powerIds.set(old, id); return id; };

  for (const power of clone.powers ?? []) {
    power.id = newPowerId(power.id);
    for (const component of power.components ?? []) {
      component.id = newPowerId(component.id);
    }
    for (const alternate of power.alternateEffects ?? []) {
      alternate.id = newPowerId(alternate.id);
      for (const component of alternate.components ?? []) {
        component.id = newPowerId(component.id);
      }
    }
  }

  for (const item of clone.equipment ?? []) {
    item.id = newPowerId(item.id);
    for (const component of item.components ?? []) {
      component.id = newPowerId(component.id);
    }
    for (const alternate of item.alternateEffects ?? []) {
      alternate.id = newPowerId(alternate.id);
      for (const component of alternate.components ?? []) {
        component.id = newPowerId(component.id);
      }
    }
  }

  const alternateSetIds = new Map<string, string>();
  for (const link of clone.resourceLinks ?? []) {
    link.id = createId();
    if (link.alternateSetId) {
      const replacementId = alternateSetIds.get(link.alternateSetId) ?? createId();
      alternateSetIds.set(link.alternateSetId, replacementId);
      link.alternateSetId = replacementId;
    }
  }

  for (const row of clone.manualOffenseRows ?? []) {
    row.id = createId();
  }

  const newLogIds = (clone.ppLog ?? []).map(() => createId());
  const logIds = new Map<string, string>();
  (clone.ppLog ?? []).forEach((entry, index) => { if (!logIds.has(entry.id)) logIds.set(entry.id, newLogIds[index]); });
  for (const [index, entry] of (clone.ppLog ?? []).entries()) {
    entry.id = newLogIds[index];
    if (entry.reversesEntryId) entry.reversesEntryId = logIds.get(entry.reversesEntryId) ?? entry.reversesEntryId;
  }

  if (clone.traitModifiers) clone.traitModifiers = clone.traitModifiers.map(modifier => ({ ...modifier, id: createId() }));
  if (clone.powerUsage) clone.powerUsage = Object.fromEntries(Object.entries(clone.powerUsage).map(([key, usage]) => [
    key.split(':').map(part => powerIds.get(part) ?? part).join(':'),
    { ...usage, ...(usage.branchId ? { branchId: powerIds.get(usage.branchId) ?? usage.branchId } : {}),
      ...(usage.allocations ? { allocations: Object.fromEntries(Object.entries(usage.allocations).map(([id, ranks]) => [powerIds.get(id) ?? id, ranks])) } : {}) },
  ]));

  return clone;
}
