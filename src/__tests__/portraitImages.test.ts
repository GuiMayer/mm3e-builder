import { afterEach, describe, expect, it, vi } from 'vitest';
import { preparePortrait } from '../services/portraits/portraitImages';

afterEach(() => vi.unstubAllGlobals());

function installImageDecoder(width: number, height: number) {
  const bitmap = { width, height, close: vi.fn() };
  const encoded = new Blob(['encoded'], { type: 'image/webp' });
  const canvases: { width: number; height: number }[] = [];
  vi.stubGlobal('createImageBitmap', vi.fn(async () => bitmap));
  vi.stubGlobal('document', {
    createElement: () => {
      const canvas = {
        width: 0, height: 0,
        getContext: () => ({ drawImage: vi.fn() }),
        toBlob: (callback: (value: Blob) => void) => callback(encoded),
      };
      canvases.push(canvas);
      return canvas;
    },
  });
  return { bitmap, encoded, canvases };
}

describe('portrait image portability', () => {
  it('preserves already-sized ZIP image bytes while regenerating the thumbnail', async () => {
    const { bitmap, canvases } = installImageDecoder(1024, 768);
    const source = new Blob(['source bytes'], { type: 'image/webp' });
    const media = await preparePortrait(source, true);
    expect(media.image).toBe(source);
    expect(media.thumbnail).not.toBe(source);
    expect(canvases).toEqual([expect.objectContaining({ width: 256, height: 192 })]);
    expect(bitmap.close).toHaveBeenCalledOnce();
  });

  it('keeps normal uploads resized and reduces oversized ZIP images', async () => {
    const source = new Blob(['source'], { type: 'image/jpeg' });
    const regular = installImageDecoder(800, 600);
    expect((await preparePortrait(source)).image).toBe(regular.encoded);
    const large = installImageDecoder(2048, 1024);
    expect((await preparePortrait(source, true)).image).toBe(large.encoded);
    expect(large.canvases).toEqual([
      expect.objectContaining({ width: 1024, height: 512 }),
      expect.objectContaining({ width: 256, height: 128 }),
    ]);
  });

  it('rejects excessive decoded dimensions even when preserving source bytes', async () => {
    const { bitmap, canvases } = installImageDecoder(10000, 10000);
    await expect(preparePortrait(new Blob(['source'], { type: 'image/png' }), true)).rejects.toThrow('portrait.tooManyPixels');
    expect(canvases).toHaveLength(0);
    expect(bitmap.close).toHaveBeenCalledOnce();
  });
});
