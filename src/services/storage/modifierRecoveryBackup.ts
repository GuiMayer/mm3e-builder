import { createId } from '../../shared/lib/identity';

/** Preserve exact bytes in a separate immutable entry before committing a repair. */
export function preserveModifierRecoveryBackup(original: string, storage: Pick<Storage, 'getItem' | 'setItem'> = localStorage): boolean {
  try {
    const key = `mm3e-modifier-source-backup:${createId()}`;
    storage.setItem(key, original);
    return storage.getItem(key) === original;
  } catch { return false; }
}
