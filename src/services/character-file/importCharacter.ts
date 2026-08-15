import { SUPPORTED_SCHEMA_VERSIONS } from '../../entities/constants';
import {
  ADVANTAGE_DEFS,
  MODIFIER_DEFS,
  POWER_DEFS,
  SKILL_DEFS,
} from '../../entities/gameDataLoaders';
import { CharacterFileSchema } from '../../entities/schemas';
import type { ICharacter } from '../../entities/types';
import { validateCharacterSemantics } from '../../shared/lib/semanticValidation';
import { I18nError } from './errors';
import { normalizeCharacter } from './normalizeCharacter';

export async function importCharacterJSON(file: File): Promise<ICharacter> {
  const text = await file.text();
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new I18nError('errors.invalidJson');
  }

  const result = CharacterFileSchema.safeParse(parsed);
  if (!result.success) {
    const firstError = result.error.issues[0];
    throw new I18nError('errors.validationError', {
      field: firstError.path.join('.'),
      message: firstError.message,
    });
  }

  const fileVersion = result.data.schemaVersion;
  if (!SUPPORTED_SCHEMA_VERSIONS.includes(fileVersion)) {
    // Keep the established tolerant behavior for structurally compatible files.
    console.warn(
      `[fileService] Importing file with unknown schema version "${fileVersion}". ` +
        `Supported: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')}`
    );
  }

  const character = normalizeCharacter(result.data.character as ICharacter);
  const semanticErrors = validateCharacterSemantics(character, {
    powerDefs: POWER_DEFS,
    modifierDefs: MODIFIER_DEFS,
    skillDefs: SKILL_DEFS,
    advantageDefs: ADVANTAGE_DEFS,
  }).filter((issue) => issue.severity === 'error');

  if (semanticErrors.length > 0) {
    const firstError = semanticErrors[0];
    throw new I18nError('errors.validationError', {
      field: firstError.path,
      message: firstError.message,
    });
  }

  return character;
}
