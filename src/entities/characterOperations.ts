import type { ICharacter } from './types';

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
  clone.characterId = crypto.randomUUID();

  for (const power of clone.powers ?? []) {
    power.id = crypto.randomUUID();
    for (const component of power.components ?? []) {
      component.id = crypto.randomUUID();
    }
    for (const alternate of power.alternateEffects ?? []) {
      alternate.id = crypto.randomUUID();
      for (const component of alternate.components ?? []) {
        component.id = crypto.randomUUID();
      }
    }
  }

  for (const item of clone.equipment ?? []) {
    item.id = crypto.randomUUID();
    for (const component of item.components ?? []) {
      component.id = crypto.randomUUID();
    }
    for (const alternate of item.alternateEffects ?? []) {
      alternate.id = crypto.randomUUID();
      for (const component of alternate.components ?? []) {
        component.id = crypto.randomUUID();
      }
    }
  }

  return clone;
}
