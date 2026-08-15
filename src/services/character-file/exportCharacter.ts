import { SCHEMA_VERSION } from '../../entities/constants';
import type { ICharacter, ICharacterFile } from '../../entities/types';
import { downloadBlob, sanitizeFileName } from '../downloadHelper';
import { sanitizeCharacterForExport } from './sanitizeCharacter';

export async function exportCharacterJSON(
  character: ICharacter,
  language = 'en',
  filename?: string
): Promise<void> {
  if (!character.characterId) {
    console.warn(
      '[fileService] Exporting character without characterId. This should not happen after migration.'
    );
  }

  const file: ICharacterFile = {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    language,
    character: sanitizeCharacterForExport(character),
  };
  const blob = new Blob([JSON.stringify(file, null, 2)], {
    type: 'application/json',
  });
  const name = filename || `${sanitizeFileName(character.header.name)}.json`;
  await downloadBlob(blob, name);
}
