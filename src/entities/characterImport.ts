import type { CharacterTab } from './characterTab';
import type { ICharacter } from './types';
import {
  duplicateCharacterWithNewIds,
  getDuplicateCharacterName,
} from './characterOperations';

/** Finds every open tab representing a persisted character identity. */
export function findCharacterIdentityMatches(
  tabs: CharacterTab[],
  characterId: string | undefined
): CharacterTab[] {
  if (!characterId) return [];
  return tabs.filter((tab) => tab.character.characterId === characterId);
}

/** Gives legacy imports an identity before they are opened in a new tab. */
export function ensureImportedCharacterIdentity(
  character: ICharacter
): ICharacter {
  return character.characterId
    ? character
    : { ...character, characterId: crypto.randomUUID() };
}

/**
 * Opens an imported file as a true independent copy: its persisted identity
 * and nested object IDs are regenerated, so later imports remain unambiguous.
 */
export function duplicateImportedCharacter(
  character: ICharacter,
  existingNames: string[]
): ICharacter {
  const name = getDuplicateCharacterName(character.header.name, existingNames);
  return duplicateCharacterWithNewIds(character, name);
}
