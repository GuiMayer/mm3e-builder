import { describe, expect, it } from 'vitest';
import { getRequiredPageSpacerHeight } from '../services/pdf/pdfPagination';

describe('PDF pagination decisions', () => {
  const pageHeight = 1_000;

  it('keeps a block on the current page when it fits', () => {
    expect(getRequiredPageSpacerHeight(650, 300, pageHeight)).toBeNull();
  });

  it('moves a whole block when it would cross the page boundary', () => {
    expect(getRequiredPageSpacerHeight(850, 300, pageHeight)).toBe(150);
  });

  it('allows an oversized block to flow across pages', () => {
    expect(getRequiredPageSpacerHeight(100, 1_001, pageHeight)).toBeNull();
  });
});
