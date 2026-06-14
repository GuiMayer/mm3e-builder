/* ================================================
   PDF Service Entry Point
   Export main PDF generation functionality
   ================================================ */

export { generateCharacterPDF } from './pdfGenerator';
export type { PDFGeneratorOptions, PDFGenerationResult } from './pdfGenerator';

// Export HTML to PDF converters
export { convertHtmlToPdfWithPaged } from './htmlToPdfConverter-paged';
export type { PagedPdfOptions } from './htmlToPdfConverter-paged';

// Export components for advanced usage
export * from './components';
