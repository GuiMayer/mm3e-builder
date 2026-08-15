import type { ICharacter } from './types';

export interface CharacterTab {
  id: string;
  character: ICharacter;
  isDirty: boolean;
  label: string;
  lastModified: number;
}
