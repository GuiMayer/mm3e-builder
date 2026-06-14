/**
 * Download Helper — Robust file download with native Save dialog.
 *
 * Uses the File System Access API (showSaveFilePicker) when available,
 * which opens the native "Save As" dialog with proper file name and extension.
 * Falls back to the classic blob-anchor approach for unsupported browsers.
 */

// ── File System Access API type declarations (not in default lib.dom) ──

interface FileSystemWritableFileStream extends WritableStream {
  write(data: Blob | BufferSource | string | { type: string; data?: Blob | BufferSource | string; position?: number; size?: number }): Promise<void>;
  close(): Promise<void>;
}

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FilePickerAcceptType {
  description?: string;
  accept: Record<string, string[]>;
}

interface ShowSaveFilePickerOptions {
  suggestedName?: string;
  types?: FilePickerAcceptType[];
}

interface FilePickerWindow {
  showSaveFilePicker(options?: ShowSaveFilePickerOptions): Promise<FileSystemFileHandle>;
}

// ── File type configs ──

interface FileTypeConfig {
  description: string;
  accept: Record<string, string[]>;
}

const FILE_TYPES: Record<string, FileTypeConfig> = {
  json: {
    description: 'JSON File',
    accept: { 'application/json': ['.json'] },
  },
  xlsx: {
    description: 'Excel Spreadsheet',
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
  },
  pdf: {
    description: 'PDF Document',
    accept: { 'application/pdf': ['.pdf'] },
  },
  html: {
    description: 'HTML Document',
    accept: { 'text/html': ['.html'] },
  },
};

/**
 * Sanitize a file name by removing characters invalid in most file systems.
 * Replaces invalid characters with underscores and ensures a non-empty result.
 * 
 * @param name - The raw file name (without extension)
 * @returns A sanitized file name safe for all major file systems
 */
export function sanitizeFileName(name: string): string {
  if (!name || !name.trim()) {
    return 'character';
  }
  // Remove characters invalid in Windows, macOS, and Linux file systems
  return name.replace(/[/\\:*?"<>|]/g, '_').trim() || 'character';
}

/**
 * Download a Blob as a file, showing a native Save dialog when possible.
 *
 * @param blob      - The file content as a Blob
 * @param fileName  - Suggested file name with extension (e.g. "hero.xlsx")
 */
export async function downloadBlob(blob: Blob, fileName: string): Promise<void> {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  const fileType = FILE_TYPES[ext];

  // ── Try File System Access API (shows native Save As dialog) ──
  if ('showSaveFilePicker' in window) {
    try {
      const pickerOpts: ShowSaveFilePickerOptions = {
        suggestedName: fileName,
      };
      if (fileType) {
        pickerOpts.types = [fileType];
      }

      const handle = await (window as unknown as FilePickerWindow).showSaveFilePicker(pickerOpts);
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (err: unknown) {
      // User pressed Cancel → abort silently
      if (err instanceof DOMException && err.name === 'AbortError') return;
      // Other errors → fall through to legacy method
      console.warn('showSaveFilePicker failed, falling back to legacy download:', err);
    }
  }

  // ── Fallback: classic anchor download ──
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();

  // Delay cleanup so the browser has time to start the download
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 150);
}

