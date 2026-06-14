/* ================================================
   PDF Template Loader
   Single responsibility: fetch the blank PDF template
   and cache its raw bytes for the session.
   ================================================ */

import { PDFDocument } from 'pdf-lib';
import pdfTemplateUrl from '../../assets/pdfs/MnM3_charsheet_color_fillable.pdf?url';

// Raw bytes cached for the lifetime of the browser tab.
// We cache the ArrayBuffer (not the PDFDocument) so each export
// gets a fresh, isolated PDFDocument instance.
let cachedTemplateBytes: ArrayBuffer | null = null;

/**
 * Load the blank PDF template and return a new PDFDocument instance.
 * Subsequent calls reuse the cached ArrayBuffer — no re-fetch.
 */
export async function loadPDFTemplate(): Promise<PDFDocument> {
  if (!cachedTemplateBytes) {
    const response = await fetch(pdfTemplateUrl);
    if (!response.ok) {
      throw new Error(`Failed to load PDF template (HTTP ${response.status})`);
    }
    cachedTemplateBytes = await response.arrayBuffer();
  }
  // Load from the cached buffer — gives a fresh, independent PDFDocument every time.
  return PDFDocument.load(cachedTemplateBytes);
}

/**
 * Kick off the template fetch in the background so it is already cached
 * when the user clicks "Export PDF". Call once from App.tsx on mount.
 */
export function prefetchPDFTemplate(): void {
  void loadPDFTemplate();
}
