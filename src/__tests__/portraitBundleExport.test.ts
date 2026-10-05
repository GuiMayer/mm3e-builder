import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TFunction } from 'i18next';
import type { DialogApi } from '../shared/ui/appDialogContext';
import { exportWithPortraits } from '../services/portraitBundleExport';
import { downloadBlob } from '../services/downloadHelper';
import { clearPortraits, savePortrait } from '../services/storage/portraitStorage';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { readPortraitBundle } from '../services/portraitBundle';

vi.mock('../services/downloadHelper', () => ({ downloadBlob: vi.fn(async () => true) }));
const t = ((key: string) => key) as TFunction;
function dialogs(answer: string | null) { return { choose: vi.fn(async () => answer), alert: vi.fn(), confirm: vi.fn(), reviewModifierSources: vi.fn() } as unknown as DialogApi; }
beforeEach(async () => { vi.clearAllMocks(); await clearPortraits(); });
const payload = new Blob(['{"unchanged":true}'], { type: 'application/json' });
const hero = () => createDefaultCharacter({ characterId: crypto.randomUUID() });
async function local() {
  const character = hero();
  const image = new Blob(['image'], { type: 'image/png' });
  await savePortrait({ image, thumbnail: image, width: 1, height: 1 }, { characterId: character.characterId! });
  return character;
}
describe('portrait export decisions', () => {
  it('downloads the original JSON without prompting when there is no manual portrait', async () => {
    const dialog = dialogs('zip');
    const character = hero(); character.header.portraitUrl = 'https://example.com/hero.png';
    await exportWithPortraits(payload, 'hero.json', 'character', [character], dialog, t);
    expect(dialog.choose).not.toHaveBeenCalled();
    expect(downloadBlob).toHaveBeenCalledWith(payload, 'hero.json');
  });
  it.each([['plain', 1], [null, 0]])('preserves the original format or cancels for %s', async (answer, downloads) => {
    const dialog = dialogs(answer as string | null);
    await exportWithPortraits(payload, 'hero.json', 'character', [await local()], dialog, t);
    expect(dialog.choose).toHaveBeenCalledTimes(1);
    expect(downloadBlob).toHaveBeenCalledTimes(downloads as number);
    if (downloads) expect(downloadBlob).toHaveBeenCalledWith(payload, 'hero.json');
  });
  it('asks once for the complete draft and exports all included manual portraits', async () => {
    const characters = [await local(), await local(), hero()];
    const dialog = dialogs('zip');
    await exportWithPortraits(payload, 'draft.jsonl', 'draft', characters, dialog, t);
    expect(dialog.choose).toHaveBeenCalledTimes(1);
    const [blob, name] = vi.mocked(downloadBlob).mock.calls[0];
    expect(name).toBe('draft.zip');
    const bundle = await readPortraitBundle(new File([blob], name), 'draft');
    expect(await bundle.data.text()).toBe(await payload.text());
    expect(bundle.manifest.portraits.map(item => item.characterId)).toEqual(characters.slice(0, 2).map(character => character.characterId));
  });
});
