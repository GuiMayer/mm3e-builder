import type { IResource } from '../../entities/types';
import { parseResourceAppendix } from '../storage/resourceLibraryStorage';

/** Reads the optional portable Resources appendix without affecting legacy files. */
export async function importResourceAppendix(file: File): Promise<IResource[]> {
  try {
    const parsed = JSON.parse(await file.text()) as { appendix?: { resources?: unknown } };
    return parseResourceAppendix(parsed.appendix?.resources);
  } catch {
    return [];
  }
}
