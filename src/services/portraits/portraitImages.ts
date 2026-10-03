import { getPortrait, savePortrait, type PortraitMedia } from '../storage/portraitStorage';

export const MAX_PORTRAIT_BYTES = 10 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export function validatePortraitUrl(value: string): string {
  let url: URL;
  try { url = new URL(value.trim()); }
  catch { throw new Error('portrait.invalidUrl'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.href.length > 2048) throw new Error('portrait.invalidUrl');
  return url.href;
}

export function validatePortraitFile(blob: Blob) {
  if (!TYPES.includes(blob.type.split(';')[0])) throw new Error('portrait.invalidType');
  if (!blob.size || blob.size > MAX_PORTRAIT_BYTES) throw new Error('portrait.tooLarge');
}

export async function preparePortrait(blob: Blob): Promise<PortraitMedia> {
  validatePortraitFile(blob);
  const bitmap = await createImageBitmap(blob).catch(() => { throw new Error('portrait.invalidImage'); });
  try {
    if (!bitmap.width || !bitmap.height || bitmap.width * bitmap.height > 20_000_000) throw new Error('portrait.tooManyPixels');
    async function resize(max: number): Promise<Blob> {
      const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('portrait.invalidImage');
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      return new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('portrait.invalidImage')), 'image/webp', .88));
    }
    return { image: await resize(1024), thumbnail: await resize(256), width: bitmap.width, height: bitmap.height };
  } finally { bitmap.close(); }
}

export async function downloadPortrait(address: string, signal?: AbortSignal): Promise<PortraitMedia> {
  const url = validatePortraitUrl(address);
  const response = await fetch(url, { signal: AbortSignal.any([AbortSignal.timeout(12_000), ...(signal ? [signal] : [])]), credentials: 'omit', cache: 'no-cache' });
  if (!response.ok) throw new Error('portrait.downloadError');
  const type = (response.headers.get('content-type') ?? '').split(';')[0];
  if (!TYPES.includes(type)) throw new Error('portrait.invalidType');
  if (Number(response.headers.get('content-length')) > MAX_PORTRAIT_BYTES) throw new Error('portrait.tooLarge');
  if (!response.body) throw new Error('portrait.downloadError');
  const reader = response.body.getReader();
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_PORTRAIT_BYTES) throw new Error('portrait.tooLarge');
      chunks.push(new Uint8Array(value));
    }
  } finally { await reader.cancel(); }
  const media = await preparePortrait(new Blob(chunks, { type }));
  signal?.throwIfAborted();
  return media;
}

export async function resolvePortrait(characterId?: string, url?: string, signal?: AbortSignal): Promise<PortraitMedia | undefined> {
  const cached = await getPortrait(characterId, url).catch(() => undefined);
  if (cached || !url) return cached;
  const media = await downloadPortrait(url, signal);
  signal?.throwIfAborted();
  // A usable remote image may still be displayed if browser storage is unavailable.
  await savePortrait(media, { url }).catch(() => undefined);
  return media;
}

export function portraitErrorKey(error: unknown): string {
  return error instanceof Error && /^portrait\.(invalidUrl|invalidType|tooLarge|tooManyPixels|invalidImage|storageBlocked)$/.test(error.message)
    ? error.message : 'portrait.downloadError';
}
