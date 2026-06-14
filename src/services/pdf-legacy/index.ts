/* ================================================
   PDF Legacy System — Barrel Export
   Sistema baseado em pdf-lib com template fillable.
   Mantido para compatibilidade opcional.
   ================================================ */

export { fillAndDownloadPDF } from './pdfFillService';
export { checkPDFOverflow } from './overflowCollector';
export type { PDFOverflowReport } from './overflowCollector';
export { prefetchPDFTemplate } from './pdfTemplateLoader';
