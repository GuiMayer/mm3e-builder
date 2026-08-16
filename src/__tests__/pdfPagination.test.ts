import { describe, expect, it } from 'vitest';
import { getRequiredPageSpacerHeight } from '../services/pdf/htmlToPdfConverter';

describe('PDF pagination', () => {
  const pageHeight = 1_000;

  it('does not add a break when a block fits in the remaining page space', () => {
    expect(getRequiredPageSpacerHeight(650, 300, pageHeight)).toBeNull();
  });

  it('moves a fitting block to the next page when it would cross the boundary', () => {
    expect(getRequiredPageSpacerHeight(850, 300, pageHeight)).toBe(150);
  });

  it('allows a block taller than a page to flow instead of creating an empty page', () => {
    expect(getRequiredPageSpacerHeight(100, 1_001, pageHeight)).toBeNull();
  });
});
