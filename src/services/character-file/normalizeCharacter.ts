import { ADVANTAGE_DEFS } from '../../entities/gameDataLoaders';
import type { ICharacter } from '../../entities/types';
import { migrateCampaignCharacter } from '../../shared/lib/campaign';
import {
  migrateAdvantages,
  migrateEquipment,
  migratePowers,
} from '../../shared/lib/powerMigration';

/** Converts every supported persisted character shape to the current model. */
export function normalizeCharacter(character: ICharacter): ICharacter {
  return migrateCampaignCharacter({
    ...character,
    powers: migratePowers(character.powers as unknown[]),
    equipment: migrateEquipment((character.equipment as unknown[]) ?? []),
    resourceLinks: Array.isArray(character.resourceLinks) ? character.resourceLinks : [],
    advantages: migrateAdvantages(
      (character.advantages as unknown[]) ?? [],
      ADVANTAGE_DEFS
    ),
  });
}
