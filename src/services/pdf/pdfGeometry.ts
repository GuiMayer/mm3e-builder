/** One physical coordinate system for DOM measurement, HTML and PDF drawing. */
export const PDF_GEOMETRY = {
  widthMm: 210,
  heightMm: 297,
  marginMm: 10,
  footerMm: 6,
  mmPerPx: 25.4 / 96,
} as const;
export const PDF_CONTENT_WIDTH_PX = (PDF_GEOMETRY.widthMm - 2 * PDF_GEOMETRY.marginMm) / PDF_GEOMETRY.mmPerPx;
export const PDF_CONTENT_HEIGHT_PX = (PDF_GEOMETRY.heightMm - 2 * PDF_GEOMETRY.marginMm - PDF_GEOMETRY.footerMm) / PDF_GEOMETRY.mmPerPx;
