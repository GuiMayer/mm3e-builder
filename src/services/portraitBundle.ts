import { z } from 'zod';
import type { ICharacter } from '../entities/types';
import { I18nError } from './character-file/errors';
import { getPortrait, applyLocalPortraitBatch, type PortraitMedia } from './storage/portraitStorage';
import { preparePortrait, MAX_PORTRAIT_BYTES } from './portraits/portraitImages';

export const BUNDLE_LIMITS = { archive: 100 * 1024 * 1024, expanded: 200 * 1024 * 1024, data: 20 * 1024 * 1024, entries: 1000 };
const mimeExtensions: Record<string, string> = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg' };
const PortraitSchema = z.object({ characterId: z.string().min(1).max(256), path: z.string(), mime: z.enum(['image/webp', 'image/png', 'image/jpeg']) }).strict();
const ManifestSchema = z.object({
  format: z.literal('mm3e-portrait-bundle'), version: z.literal(1), kind: z.enum(['character', 'draft']),
  dataFile: z.enum(['character.json', 'draft.jsonl']), portraits: z.array(PortraitSchema).min(1).max(BUNDLE_LIMITS.entries - 2),
}).strict();
export type BundleKind = 'character' | 'draft';
export interface LocalPortrait { characterId: string; media: PortraitMedia }
export interface PortraitBundle { data: File; manifest: z.infer<typeof ManifestSchema>; files: Map<string, Uint8Array<ArrayBuffer>> }
const invalid = () => new I18nError('bundle.invalid');
const tooLarge = () => new I18nError('bundle.tooLarge');

/** Read only manual portraits belonging to the exported snapshot, never URL caches. */
export async function collectLocalPortraits(characters: readonly ICharacter[]): Promise<LocalPortrait[]> {
  const result: LocalPortrait[] = [];
  const seen = new Set<string>();
  for (const character of characters) {
    if (character.header.portraitUrl || !character.characterId || seen.has(character.characterId)) continue;
    seen.add(character.characterId);
    const media = await getPortrait(character.characterId);
    if (media) result.push({ characterId: character.characterId, media });
  }
  return result;
}

export async function createPortraitBundle(data: Blob, kind: BundleKind, portraits: readonly LocalPortrait[]): Promise<Blob> {
  const { zip, strToU8 } = await import('fflate');
  if (!portraits.length || portraits.length + 2 > BUNDLE_LIMITS.entries || data.size > BUNDLE_LIMITS.data) throw tooLarge();
  const dataFile = kind === 'character' ? 'character.json' : 'draft.jsonl';
  const entries: Record<string, [Uint8Array, { level: 0 | 6 }]> = { [dataFile]: [new Uint8Array(await data.arrayBuffer()), { level: 6 }] };
  let size = data.size;
  const metadata = [];
  const seen = new Set<string>();
  for (const [index, portrait] of portraits.entries()) {
    const image = portrait.media.image;
    const extension = mimeExtensions[image.type];
    if (!extension || !image.size || image.size > MAX_PORTRAIT_BYTES || seen.has(portrait.characterId)) throw invalid();
    seen.add(portrait.characterId);
    size += image.size;
    if (size > BUNDLE_LIMITS.expanded) throw tooLarge();
    const path = `portraits/portrait-${index + 1}.${extension}`;
    entries[path] = [new Uint8Array(await image.arrayBuffer()), { level: 0 }];
    metadata.push({ characterId: portrait.characterId, path, mime: image.type });
  }
  entries['manifest.json'] = [strToU8(JSON.stringify({ format: 'mm3e-portrait-bundle', version: 1, kind, dataFile, portraits: metadata }, null, 2)), { level: 6 }];
  const bytes = await new Promise<Uint8Array<ArrayBuffer>>((resolve, reject) => zip(entries, (error, value) => error ? reject(error) : resolve(new Uint8Array(value))));
  if (bytes.length > BUNDLE_LIMITS.archive) throw tooLarge();
  return new Blob([bytes], { type: 'application/zip' });
}

/** Stream decompression with limits before retaining bytes, including unknown header sizes. */
export async function readPortraitBundle(file: File, expected: BundleKind): Promise<PortraitBundle> {
  if (file.size > BUNDLE_LIMITS.archive) throw tooLarge();
  const tail = new Uint8Array(await file.slice(-65557).arrayBuffer());
  const view = new DataView(tail.buffer);
  let end = -1;
  for (let i = tail.length - 22; i >= 0; i--) {
    if (view.getUint32(i, true) === 0x06054b50 && i + 22 + view.getUint16(i + 20, true) === tail.length) { end = i; break; }
  }
  if (end < 0 || view.getUint16(end + 4, true) !== 0 || view.getUint16(end + 6, true) !== 0) throw invalid();
  const entryCount = view.getUint16(end + 10, true);
  if (entryCount > BUNDLE_LIMITS.entries) throw tooLarge();
  const { Unzip, UnzipInflate, strFromU8 } = await import('fflate');
  const files = new Map<string, Uint8Array<ArrayBuffer>>();
  const names = new Set<string>();
  let expanded = 0;
  const unzip = new Unzip(entry => {
    if (names.has(entry.name) || !/^(manifest\.json|character\.json|draft\.jsonl|portraits\/portrait-[1-9]\d*\.(png|jpg|webp))$/.test(entry.name)) throw invalid();
    names.add(entry.name);
    if (names.size > BUNDLE_LIMITS.entries) throw tooLarge();
    const limit = entry.name === 'manifest.json' ? 1024 * 1024 : entry.name.startsWith('portraits/') ? MAX_PORTRAIT_BYTES : BUNDLE_LIMITS.data;
    if (entry.originalSize !== undefined && entry.originalSize > limit) throw tooLarge();
    if (entry.compression !== 0 && entry.compression !== 8) throw invalid();
    const chunks: Uint8Array[] = [];
    let size = 0;
    entry.ondata = (error, bytes, final) => {
      if (error) throw invalid();
      size += bytes.length;
      expanded += bytes.length;
      if (size > limit || expanded > BUNDLE_LIMITS.expanded) throw tooLarge();
      chunks.push(bytes);
      if (final) {
        const combined = new Uint8Array(size);
        let offset = 0;
        for (const chunk of chunks) { combined.set(chunk, offset); offset += chunk.length; }
        files.set(entry.name, combined);
      }
    };
    entry.start();
  });
  unzip.register(UnzipInflate);
  const reader = file.stream().getReader();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) { unzip.push(new Uint8Array(), true); break; }
      for (let offset = 0; offset < value.length; offset += 16384) unzip.push(value.subarray(offset, offset + 16384));
    }
    if (files.size !== names.size || names.size !== entryCount) throw invalid();
    const manifestBytes = files.get('manifest.json');
    if (!manifestBytes) throw invalid();
    const manifest = ManifestSchema.parse(JSON.parse(strFromU8(manifestBytes)));
    if (manifest.kind !== expected) throw new I18nError('bundle.wrongKind');
    if (manifest.dataFile !== (expected === 'character' ? 'character.json' : 'draft.jsonl')) throw invalid();
    const ids = new Set<string>(), paths = new Set<string>();
    for (const portrait of manifest.portraits) {
      if (!/^portraits\/portrait-[1-9]\d*\.(png|jpg|webp)$/.test(portrait.path) || ids.has(portrait.characterId) || paths.has(portrait.path) || !files.get(portrait.path)?.length || !portrait.path.endsWith(`.${mimeExtensions[portrait.mime]}`)) throw invalid();
      ids.add(portrait.characterId); paths.add(portrait.path);
    }
    const payload = files.get(manifest.dataFile);
    if (!payload || files.size !== paths.size + 2) throw invalid();
    return { manifest, files, data: new File([payload], manifest.dataFile, { type: expected === 'character' ? 'application/json' : 'application/x-ndjson' }) };
  } catch (error) { throw error instanceof I18nError ? error : invalid(); }
  finally { await reader.cancel(); }
}

/** Decode all images and validate identity associations before any persistence. */
export async function prepareBundlePortraits(bundle: PortraitBundle, characters: readonly ICharacter[]): Promise<LocalPortrait[]> {
  const portraits: LocalPortrait[] = [];
  for (const entry of bundle.manifest.portraits) {
    const matches = characters.filter(character => character.characterId === entry.characterId);
    if (!matches.length || matches.some(character => character.header.portraitUrl)) throw invalid();
    const bytes = bundle.files.get(entry.path)!;
    // Verify signatures before decoding; file extension and declared MIME are insufficient.
    const signature = entry.mime === 'image/png' ? [137, 80, 78, 71, 13, 10, 26, 10].every((byte, i) => bytes[i] === byte)
      : entry.mime === 'image/jpeg' ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
      : String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
    if (!signature) throw invalid();
    const media = await preparePortrait(new Blob([bytes], { type: entry.mime }));
    portraits.push({ characterId: entry.characterId, media });
  }
  return portraits;
}

/** Compensate IDB writes if the existing character/resource persistence rejects the import. */
export async function withImportedPortraits<T>(portraits: readonly LocalPortrait[], commit: () => T | Promise<T>): Promise<T> {
  const rollback = await applyLocalPortraitBatch(portraits);
  try { return await commit(); }
  catch (error) { await rollback(); throw error; }
}
