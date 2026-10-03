import type { ICharacter } from '../../entities/types';
import { resolvePortrait } from './portraitImages';

/** HTML/PDF may embed bytes for a portable document; character JSON never does. */
export async function getPortraitDataUrl(character: ICharacter): Promise<string | undefined> {
  const media = await resolvePortrait(character.characterId, character.header.portraitUrl);
  if (!media) return;
  const bytes = new Uint8Array(await media.image.arrayBuffer());
  const parts: string[] = [];
  for (let offset = 0; offset < bytes.length; offset += 8192) parts.push(String.fromCharCode(...bytes.subarray(offset, offset + 8192)));
  return `data:${media.image.type};base64,${btoa(parts.join(''))}`;
}
