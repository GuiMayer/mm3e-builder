import type { CharacterTab } from '../../entities/characterTab';
import type { ICharacterPower } from '../../entities/types';
import { replaceCharacterPower } from '../../shared/lib/powerEditing';

export interface LibraryPowerEdit {
  tabId: string;
  draft: ICharacterPower;
  original?: ICharacterPower;
}

/** Snapshot guard prevents a stale library shortcut from overwriting a newer power. */
export function resolveLibraryPowerSave(tabs: readonly CharacterTab[], edit: LibraryPowerEdit, power: ICharacterPower) {
  const tab = tabs.find(item => item.id === edit.tabId);
  if (!tab) return null;
  if (edit.original) {
    const current = tab.character.powers.find(item => item.id === edit.original!.id);
    if (JSON.stringify(current) !== JSON.stringify(edit.original) || power.id !== edit.original.id) return null;
  } else if (tab.character.powers.some(item => item.id === power.id)) return null;
  return replaceCharacterPower(tab.character, { kind: 'power', powerId: edit.original?.id }, power);
}
