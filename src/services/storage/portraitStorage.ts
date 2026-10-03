/** Portrait bytes never enter the character store or its JSON serializers. */
export interface PortraitMedia {
  image: Blob;
  thumbnail: Blob;
  width: number;
  height: number;
}

const DATABASE = 'mm3e-portraits';
const STORES = ['media', 'local', 'remote'] as const;
let database: Promise<IDBDatabase> | undefined;
let revision = 0;
const listeners = new Set<() => void>();
export const portraitRevision = () => revision;
export function subscribePortraits(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function notify() { revision++; listeners.forEach(listener => listener()); }

function openDatabase(): Promise<IDBDatabase> {
  if (!database) {
    database = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DATABASE, 1);
      request.onupgradeneeded = () => STORES.forEach(name => request.result.createObjectStore(name));
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('portrait.storageBlocked'));
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => { db.close(); database = undefined; };
        resolve(db);
      };
    }).catch(error => { database = undefined; throw error; });
  }
  return database;
}

function read<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
function complete(transaction: IDBTransaction): Promise<void> {
  const result = new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error('portrait.storageError'));
    transaction.onerror = () => reject(transaction.error);
  });
  // A failed individual request can reject before its transaction is awaited.
  // Keep that abort handled while preserving rejection for callers awaiting it.
  void result.catch(() => undefined);
  return result;
}
function validMedia(value: unknown): value is PortraitMedia {
  if (!value || typeof value !== 'object') return false;
  const media = value as PortraitMedia;
  return media.image instanceof Blob && media.thumbnail instanceof Blob &&
    typeof media.width === 'number' && typeof media.height === 'number' && media.width > 0 && media.height > 0 && Number.isFinite(media.width * media.height);
}

export async function getPortrait(characterId?: string, url?: string): Promise<PortraitMedia | undefined> {
  if (!url && !characterId) return;
  const db = await openDatabase();
  const tx = db.transaction([...STORES], 'readonly');
  const done = complete(tx);
  const key: unknown = url
    ? await read(tx.objectStore('remote').get(url))
    : await read(tx.objectStore('local').get(characterId!));
  const media: unknown = typeof key === 'string' ? await read(tx.objectStore('media').get(key)) : undefined;
  await done;
  return validMedia(media) ? media : undefined;
}

export async function savePortrait(media: PortraitMedia, target: { characterId: string } | { url: string }): Promise<void> {
  if (!validMedia(media)) throw new Error('portrait.invalidImage');
  const db = await openDatabase();
  const tx = db.transaction([...STORES], 'readwrite');
  const done = complete(tx);
  const key = crypto.randomUUID();
  tx.objectStore('media').put(media, key);
  if ('url' in target) tx.objectStore('remote').put(key, target.url);
  else tx.objectStore('local').put(key, target.characterId);
  await done;
  notify();
}

/** Shared media has separate associations, so replacing a copy is independent. */
export async function copyLocalPortrait(sourceId?: string, targetId?: string): Promise<void> {
  if (!sourceId || !targetId || sourceId === targetId) return;
  const db = await openDatabase();
  const tx = db.transaction('local', 'readwrite');
  const done = complete(tx);
  const key: unknown = await read(tx.objectStore('local').get(sourceId));
  if (typeof key === 'string') tx.objectStore('local').put(key, targetId);
  await done;
  if (key) notify();
}

export async function removeLocalPortrait(characterId: string): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction('local', 'readwrite');
  const done = complete(tx);
  tx.objectStore('local').delete(characterId);
  await done;
  notify();
}

/** Collect replaced media only; retain associations for closed/reimportable sheets. */
export async function collectUnusedPortraitMedia(): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction([...STORES], 'readwrite');
  const done = complete(tx);
  const [local, remote, keys] = await Promise.all([
    read(tx.objectStore('local').getAll()), read(tx.objectStore('remote').getAll()), read(tx.objectStore('media').getAllKeys()),
  ]);
  const used = new Set([...local, ...remote]);
  keys.forEach(key => { if (!used.has(key)) tx.objectStore('media').delete(key); });
  await done;
}

export async function clearPortraits(): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction([...STORES], 'readwrite');
  const done = complete(tx);
  STORES.forEach(name => tx.objectStore(name).clear());
  await done;
  notify();
}
