import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { zipSync, strToU8 } from 'fflate';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { serializeCharacterJSON } from '../services/character-file/exportCharacter';
import { collectLocalPortraits, createPortraitBundle, readPortraitBundle, prepareBundlePortraits, withImportedPortraits, BUNDLE_LIMITS } from '../services/portraitBundle';
import { clearPortraits, getPortrait, savePortrait, type PortraitMedia } from '../services/storage/portraitStorage';
import { serializeDraftBundle, parseDraftBundle } from '../services/draftTransfer';

vi.mock('../services/portraits/portraitImages', async original => ({ ...await original<typeof import('../services/portraits/portraitImages')>(), preparePortrait: vi.fn(async (blob: Blob) => ({ image: blob, thumbnail: blob, width: 1, height: 1 })) }));
const image = new Blob([new Uint8Array([137,80,78,71,13,10,26,10,1])], { type: 'image/png' });
const media: PortraitMedia = { image, thumbnail: image, width: 1, height: 1 };
beforeEach(async () => { await clearPortraits(); });
const asFile = (blob: Blob) => new File([blob], 'bundle.zip', { type: 'application/zip' });

describe('portable portrait bundles', () => {
  it('round-trips character JSON unchanged, with resource appendix and portrait fit', async () => {
    const character = createDefaultCharacter({ characterId: 'hero' });
    character.header.portraitFit = 'cover';
    const before = JSON.stringify(character);
    const data = serializeCharacterJSON(character, 'pt-BR');
    const bundle = await readPortraitBundle(asFile(await createPortraitBundle(data, 'character', [{ characterId: 'hero', media }])), 'character');
    expect(await bundle.data.text()).toBe(await data.text());
    expect(JSON.stringify(character)).toBe(before);
    expect(bundle.manifest.portraits[0]).toMatchObject({ characterId: 'hero', mime: 'image/png' });
    const portraits = await prepareBundlePortraits(bundle, [character]);
    await withImportedPortraits(portraits, () => {});
    expect(await (await getPortrait('hero'))?.image.arrayBuffer()).toEqual(await image.arrayBuffer());
  });
  it('includes only manual portraits of exported characters, once per identity', async () => {
    const local = createDefaultCharacter({ characterId: 'local' });
    const remote = createDefaultCharacter({ characterId: 'remote' });
    remote.header.portraitUrl = 'https://example.com/portrait.png';
    await savePortrait(media, { characterId: 'local' });
    await savePortrait(media, { characterId: 'remote' });
    await savePortrait(media, { url: remote.header.portraitUrl });
    await savePortrait(media, { characterId: 'closed-tab' });
    expect((await collectLocalPortraits([local, remote, local, createDefaultCharacter()])).map(item => item.characterId)).toEqual(['local']);
  });
  it('keeps all draft tabs and the selected tab, with images only for matching identities', async () => {
    const tabs = ['one', 'two'].map(id => ({ id: `tab-${id}`, character: createDefaultCharacter({ characterId: crypto.randomUUID() }), label: id, isDirty: false, lastModified: 1 }));
    const text = serializeDraftBundle(tabs, 'tab-two', []);
    const bundle = await readPortraitBundle(asFile(await createPortraitBundle(new Blob([text]), 'draft', [{ characterId: tabs[1].character.characterId!, media }])), 'draft');
    const draft = parseDraftBundle(await bundle.data.text());
    expect(draft.activeId).toBe('tab-two');
    expect(draft.tabs.map(tab => tab.character.characterId)).toEqual(tabs.map(tab => tab.character.characterId));
    expect(await prepareBundlePortraits(bundle, draft.tabs.map(tab => tab.character))).toHaveLength(1);
    await expect(readPortraitBundle(asFile(await createPortraitBundle(new Blob([text]), 'draft', [{ characterId: tabs[1].character.characterId!, media }])), 'character')).rejects.toThrow('bundle.wrongKind');
  });
  it('rejects images pointing to unrelated or URL-based characters before storage writes', async () => {
    const bundle = await readPortraitBundle(asFile(await createPortraitBundle(new Blob(['{}']), 'character', [{ characterId: 'hero', media }])), 'character');
    await expect(prepareBundlePortraits(bundle, [createDefaultCharacter({ characterId: 'other' })])).rejects.toThrow('bundle.invalid');
    const remote = createDefaultCharacter({ characterId: 'hero' }); remote.header.portraitUrl = 'https://example.com/a.png';
    await expect(prepareBundlePortraits(bundle, [remote])).rejects.toThrow('bundle.invalid');
    expect(await getPortrait('hero')).toBeUndefined();
  });
  it('restores old portraits and removes new associations when data persistence fails', async () => {
    const old = { ...media, image: new Blob(['old'], { type: 'image/png' }) };
    await savePortrait(old, { characterId: 'hero' });
    await expect(withImportedPortraits([{ characterId: 'hero', media }, { characterId: 'new', media }], () => { throw new Error('quota'); })).rejects.toThrow('quota');
    expect(await (await getPortrait('hero'))?.image.text()).toBe('old');
    expect(await getPortrait('new')).toBeUndefined();
  });
  it('aborts every image write if an IDB request fails before committing data', async () => {
    const commit = vi.fn();
    const put = vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementationOnce(() => { throw new Error('quota'); });
    try { await expect(withImportedPortraits([{ characterId: 'hero', media }], commit)).rejects.toThrow('quota'); }
    finally { put.mockRestore(); }
    expect(commit).not.toHaveBeenCalled();
    expect(await getPortrait('hero')).toBeUndefined();
  });
  it('rejects traversal paths, truncated packages and oversized decompressed data', async () => {
    const bad = zipSync({ '../portrait.png': strToU8('bad') });
    await expect(readPortraitBundle(asFile(new Blob([new Uint8Array(bad)])), 'character')).rejects.toThrow('bundle.invalid');
    const valid = await createPortraitBundle(new Blob(['{}']), 'character', [{ characterId: 'hero', media }]);
    await expect(readPortraitBundle(asFile(valid.slice(0, valid.size - 10)), 'character')).rejects.toThrow('bundle.invalid');
    const huge = zipSync({ 'character.json': new Uint8Array(BUNDLE_LIMITS.data + 1) });
    await expect(readPortraitBundle(asFile(new Blob([new Uint8Array(huge)])), 'character')).rejects.toThrow('bundle.tooLarge');
  });
});
