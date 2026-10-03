import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearPortraits, collectUnusedPortraitMedia, copyLocalPortrait, getPortrait, removeLocalPortrait, savePortrait, type PortraitMedia } from '../services/storage/portraitStorage';
import { MAX_PORTRAIT_BYTES, validatePortraitFile, validatePortraitUrl, downloadPortrait } from '../services/portraits/portraitImages';

const media = (text: string): PortraitMedia => ({ image: new Blob([text], { type: 'image/png' }), thumbnail: new Blob([text]), width: 20, height: 30 });
beforeEach(async () => { await clearPortraits(); });

describe('separate portrait persistence', () => {
  it('stores binary images by stable identity without using localStorage', async () => {
    await savePortrait(media('hero'), { characterId: 'hero' });
    const loaded = await getPortrait('hero');
    expect(await loaded?.image.text()).toBe('hero');
    expect(await getPortrait('other')).toBeUndefined();
  });
  it('copies associations without allowing replacement/removal to change the original', async () => {
    await savePortrait(media('original'), { characterId: 'one' });
    await copyLocalPortrait('one', 'two');
    await savePortrait(media('new'), { characterId: 'two' });
    await collectUnusedPortraitMedia();
    expect(await (await getPortrait('one'))?.image.text()).toBe('original');
    expect(await (await getPortrait('two'))?.image.text()).toBe('new');
    await removeLocalPortrait('two');
    await collectUnusedPortraitMedia();
    expect(await getPortrait('two')).toBeUndefined();
    expect(await (await getPortrait('one'))?.image.text()).toBe('original');
  });
  it('shares URL cache and never substitutes an unrelated local image for a new URL', async () => {
    await savePortrait(media('local'), { characterId: 'hero' });
    await savePortrait(media('remote'), { url: 'https://example.com/hero.png' });
    expect(await (await getPortrait('hero', 'https://example.com/hero.png'))?.image.text()).toBe('remote');
    expect(await getPortrait('hero', 'https://example.com/new.png')).toBeUndefined();
    expect(await (await getPortrait('other', 'https://example.com/hero.png'))?.image.text()).toBe('remote');
  });
  it('invalid replacement leaves the last valid image intact and clearing removes all associations', async () => {
    await savePortrait(media('valid'), { characterId: 'hero' });
    await expect(savePortrait({ ...media('bad'), width: 0 }, { characterId: 'hero' })).rejects.toThrow();
    expect(await (await getPortrait('hero'))?.image.text()).toBe('valid');
    await clearPortraits();
    expect(await getPortrait('hero')).toBeUndefined();
  });
});

describe('portrait inputs', () => {
  it.each(['http://example.com/a.png', 'data:image/png;base64,a', 'file:///a.png', 'https://user:pass@example.com/a.png'])('rejects nonportable or credentialed URL %s', value => {
    expect(() => validatePortraitUrl(value)).toThrow();
  });
  it('accepts HTTPS and checks upload type/size', () => {
    expect(validatePortraitUrl(' https://example.com/a.png ')).toBe('https://example.com/a.png');
    expect(() => validatePortraitFile(new Blob(['svg'], { type: 'image/svg+xml' }))).toThrow('portrait.invalidType');
    expect(() => validatePortraitFile(new Blob([new Uint8Array(MAX_PORTRAIT_BYTES + 1)], { type: 'image/png' }))).toThrow('portrait.tooLarge');
  });
  it('rejects a blocked/invalid download without overwriting the existing cache', async () => {
    const url = 'https://example.com/a.png';
    await savePortrait(media('old'), { url });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('error', { status: 404 })));
    try { await expect(downloadPortrait(url)).rejects.toThrow('portrait.downloadError'); }
    finally { vi.unstubAllGlobals(); }
    expect(await (await getPortrait(undefined, url))?.image.text()).toBe('old');
  });
});
