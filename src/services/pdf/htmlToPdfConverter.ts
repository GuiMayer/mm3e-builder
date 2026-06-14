/* ================================================
   HTML to PDF Converter
   Uses html2pdf.js to convert HTML strings to PDF
   ================================================ */

import html2pdf from 'html2pdf.js';

export interface HtmlToPdfOptions {
  filename: string;
  margin?: number | [number, number, number, number];
  pagebreak?: { mode: string[] };
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
  const defaultOptions = {
    margin: options.margin || 10,
    filename: options.filename,
    image: { 
      type: 'jpeg' as const, 
      quality: 0.98 
    },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' as const,
    },
    pagebreak: options.pagebreak || { 
      mode: ['avoid-all', 'css', 'legacy'] 
    },
  };

  // Create temporary DOM element
  const element = document.createElement('div');
  element.innerHTML = html;
  
  try {
    // Generate PDF blob
    const pdfBlob = await html2pdf()
      .set(defaultOptions)
      .from(element)
      .output('blob') as Blob;
    
    return pdfBlob;
  } catch (error) {
    console.error('Error converting HTML to PDF:', error);
    throw new Error('Failed to convert HTML to PDF: ' + String(error));
  } finally {
    // Cleanup temporary element
    element.remove();
  }
}
