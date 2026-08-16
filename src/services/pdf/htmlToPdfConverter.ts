/* ================================================
   HTML to PDF Converter
   Uses jsPDF.html() to convert HTML strings to PDF
   ================================================ */

import { jsPDF } from 'jspdf';

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
  // Create temporary DOM element
  const element = document.createElement('div');
  element.innerHTML = html;

  try {
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    });
    pdf.setProperties({ title: options.filename.replace(/\.pdf$/i, '') });

    await new Promise<void>((resolve, reject) => {
      pdf.html(element, {
        callback: () => resolve(),
        margin: 10,
        x: 0,
        y: 0,
        width: 190,
        windowWidth: 816,
        autoPaging: 'text',
        html2canvas: {
          scale: 0.23,
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
    // Cleanup temporary element
    element.remove();
  }
}
