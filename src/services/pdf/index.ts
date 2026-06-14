/* ================================================
   PDF Service Entry Point
   Export main PDF generation functionality
   ================================================ */

export { generateCharacterPDF } from './pdfGenerator';
export type { PDFGeneratorOptions, PDFGenerationResult } from './pdfGenerator';

// Export HTML to PDF converters
// TODO: Re-enable when paged.js is properly configured
// export { convertHtmlToPdfWithPaged } from './htmlToPdfConverter-paged';
// export type { PagedPdfOptions } from './htmlToPdfConverter-paged';

// Export components for advanced usage
export * from './components';
