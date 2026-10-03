import { copyLocalPortrait, getPortrait } from '../storage/portraitStorage';
import type { ICharacter } from '../../entities/types';

/** UI/file coordinators call this after a pure character duplication succeeds. */
export async function copyCharacterPortrait(source: ICharacter, copy: ICharacter): Promise<void> {
  if (source.header.portraitUrl || !source.characterId || !copy.characterId) return;
  await copyLocalPortrait(source.characterId, copy.characterId);
}

export async function hasLocalPortrait(character: ICharacter): Promise<boolean> {
  if (character.header.portraitUrl || !character.characterId) return false;
  return Boolean(await getPortrait(character.characterId).catch(() => undefined));
}
