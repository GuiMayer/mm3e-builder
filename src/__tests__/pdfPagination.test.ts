import { describe, expect, it } from 'vitest';
import { fitsOnPdfPage } from '../services/pdf/pdfPagination';
import { PDF_GEOMETRY, PDF_CONTENT_WIDTH_PX, PDF_CONTENT_HEIGHT_PX } from '../services/pdf/pdfGeometry';
import { resolvePDFFont } from '../services/pdf/pdfFonts';

describe('PDF pagination decisions', () => {
  const pageHeight = 1_000;

  it('keeps a block on the current page when it fits', () => {
    expect(fitsOnPdfPage(950, pageHeight)).toBe(true);
  });

  it('moves a whole block when it would cross the page boundary', () => {
    expect(fitsOnPdfPage(1150, pageHeight)).toBe(false);
  });

  it('rejects an oversized block so the paginator can split it', () => {
    expect(fitsOnPdfPage(1001, pageHeight)).toBe(false);
    expect(fitsOnPdfPage(1000.4, pageHeight)).toBe(true);
  });

  it('keeps DOM dimensions in the same physical A4 coordinate system', () => {
    expect(PDF_CONTENT_WIDTH_PX * PDF_GEOMETRY.mmPerPx).toBeCloseTo(190);
    expect(PDF_CONTENT_HEIGHT_PX * PDF_GEOMETRY.mmPerPx).toBeCloseTo(271);
  });

  it('maps previously saved system font choices to portable embedded fonts', () => {
    expect(resolvePDFFont('Segoe UI')).toBe('Noto Sans');
    expect(resolvePDFFont('Georgia')).toBe('Noto Serif');
  });
});
