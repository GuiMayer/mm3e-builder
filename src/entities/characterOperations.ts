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

  for (const power of clone.powers ?? []) {
    power.id = createId();
    for (const component of power.components ?? []) {
      component.id = createId();
    }
    for (const alternate of power.alternateEffects ?? []) {
      alternate.id = createId();
      for (const component of alternate.components ?? []) {
        component.id = createId();
      }
    }
  }

  for (const item of clone.equipment ?? []) {
    item.id = createId();
    for (const component of item.components ?? []) {
      component.id = createId();
    }
    for (const alternate of item.alternateEffects ?? []) {
      alternate.id = createId();
      for (const component of alternate.components ?? []) {
        component.id = createId();
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

  for (const entry of clone.ppLog ?? []) {
    entry.id = createId();
  }

  return clone;
}
