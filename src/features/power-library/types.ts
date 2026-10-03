import type { ICharacterPower, ICharacterPowerComponent } from '../../entities/types';

export type LibraryText = { en: string; pt: string };
export interface PowerTemplateComponent extends Omit<ICharacterPowerComponent, 'id'> {
  /** Only the effect's scalable ranks change; modifier purchases remain independent. */
  scalable?: boolean;
  chooseSenses?: boolean;
  choices?: Array<{ id: string; label: LibraryText; options: Array<{ value: string; label: LibraryText }> }>;
}
export interface PowerTemplate {
  id: string;
  profileId: string;
  section: LibraryText;
  name: LibraryText;
  summary: LibraryText;
  page: number;
  components: PowerTemplateComponent[];
  descriptors?: string[];
  alternateEffects?: Array<{ name: LibraryText; components: PowerTemplateComponent[]; dynamic?: boolean }>;
  activation?: ICharacterPower['activation'];
  removable?: ICharacterPower['removable'];
  baseDynamic?: boolean;
  /** Editorial evidence only. Never read by the pricing/application code. */
  audit: {
    formula: string; fixed: number; perRank: number;
    discrepancy?: { reason: LibraryText; fixed: number; perRank: number };
    samples?: Array<{ ranks: number; total: number }>;
  };
}
export interface PowerProfile {
  id: string;
  name: LibraryText;
  page: number;
}
export type PowerLibraryTarget =
  | { kind: 'component'; componentId: string; alternateId?: string }
  | { kind: 'alternate'; alternateId: string };

export function libraryText(text: LibraryText, language: string): string {
  return language.startsWith('pt') ? text.pt : text.en;
}
