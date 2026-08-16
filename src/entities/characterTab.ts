import type { ICharacter } from './types';

export interface CharacterTab {
  id: string;
  character: ICharacter;
  isDirty: boolean;
  label: string;
  lastModified: number;
  /** Runtime-only revision incremented for each character-content change. */
  revision?: number;
  /** Runtime-only revision that was last confirmed persisted. */
  persistedRevision?: number;
}
