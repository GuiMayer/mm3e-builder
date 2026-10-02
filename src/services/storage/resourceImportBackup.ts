export const RESOURCE_IMPORT_BACKUP_KEY = 'mm3e-resource-library-import-backup-v1';

/** Refuse destructive import if its exact previous library cannot be recovered. */
export function preserveResourceImportBackup(): boolean {
  try {
    const snapshot = JSON.stringify({ exportedAt: new Date().toISOString(), resources: localStorage.getItem('mm3e-resource-library') });
    localStorage.setItem(RESOURCE_IMPORT_BACKUP_KEY, snapshot);
    return localStorage.getItem(RESOURCE_IMPORT_BACKUP_KEY) === snapshot;
  } catch { return false; }
}
