/* ================================================
   HTML to PDF Converter
   Uses jsPDF.html() to convert HTML strings to PDF
   ================================================ */

import { jsPDF } from 'jspdf';
import { paginateHtmlForPdf } from './pdfPagination';

const PDF_MARGIN_MM = 10;
const RENDER_WIDTH_PX = 816;
const HTML2CANVAS_SCALE = 0.23;

export interface HtmlToPdfOptions {
  filename: string;
}

/**
 * Convert HTML string to PDF blob
 *
 * @param html - HTML content to convert
 * @param options - Conversion options
 * @returns Promise<Blob> - PDF blob ready for download
 */
export async function convertHtmlToPdf(
  html: string,
  options: HtmlToPdfOptions
): Promise<Blob> {
  let element: HTMLElement | null = null;

  try {
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    });
    pdf.setProperties({ title: options.filename.replace(/\.pdf$/i, '') });

    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentHeightPx = (pageHeight - PDF_MARGIN_MM * 2) / HTML2CANVAS_SCALE;
    const renderElement = await paginateHtmlForPdf(html, RENDER_WIDTH_PX, contentHeightPx);
    element = renderElement;

    await new Promise<void>((resolve, reject) => {
      pdf.html(renderElement, {
        callback: () => resolve(),
        margin: PDF_MARGIN_MM,
        x: 0,
        y: 0,
        width: 190,
        windowWidth: RENDER_WIDTH_PX,
        autoPaging: 'text',
        html2canvas: {
          scale: HTML2CANVAS_SCALE,
          useCORS: true,
          letterRendering: true,
          logging: false,
        },
      }).catch(reject);
    });

    return pdf.output('blob');
  } catch (error) {
    console.error('Error converting HTML to PDF:', error);
    throw new Error(`Failed to convert HTML to PDF: ${String(error)}`);
  } finally {
    element?.remove();
  }
}
