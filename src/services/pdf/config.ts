/* ================================================
   PDF Configuration — Constants and settings
   ================================================ */

/**
 * Default PDF generation options
 */
export const DEFAULT_PDF_OPTIONS = {
  format: 'letter' as const,
  includeBackground: true,
  scale: 2,
  margin: {
    top: '0.5in',
    right: '0.5in',
    bottom: '0.5in',
    left: '0.5in',
  },
};

/**
 * CSS class names used in PDF templates
 */
export const PDF_CSS_CLASSES = {
  page: 'pdf-page',
  section: 'pdf-section',
  header: 'pdf-header',
  footer: 'pdf-footer',
  field: 'pdf-field',
  label: 'pdf-label',
  value: 'pdf-value',
  grid: 'pdf-grid',
  row: 'pdf-row',
  column: 'pdf-column',
} as const;

/**
 * Page break settings
 */
export const PAGE_BREAK_CONFIG = {
  /** Avoid page breaks inside these elements */
  avoidInside: [
    '.power-block',
    '.equipment-item',
    '.advantage-item',
    '.skill-group',
  ],
  
  /** Force page breaks before these elements */
  forceBefore: [
    '.section-powers',
    '.section-equipment',
    '.section-advantages',
  ],
  
  /** Force page breaks after these elements */
  forceAfter: [],
} as const;
