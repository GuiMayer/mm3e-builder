/* ================================================
   HTML to PDF Converter
   Uses html2pdf.js to convert HTML strings to PDF
   ================================================ */

import html2pdf from 'html2pdf.js';
import type { PDFRenderer } from './types';

export interface HtmlToPdfOptions {
  filename: string;
  margin?: number | [number, number, number, number];
  pagebreak?: { mode: string[] };
  renderer?: PDFRenderer;
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
  const renderer = options.renderer || 'html2canvas';
  
  // Create temporary DOM element
  const element = document.createElement('div');
  element.innerHTML = html;
  
  try {
    let pdfBlob: Blob;
    
    switch (renderer) {
      case 'html2canvas': {
        // Default renderer: html2canvas via html2pdf.js
        const html2canvasOptions = {
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
        
        pdfBlob = await html2pdf()
          .set(html2canvasOptions)
          .from(element)
          .output('blob') as Blob;
        break;
      }
      
      case 'paged': {
        // Simplified Paged renderer: Use jsPDF.html() directly with auto-paging
        // This avoids pagination conflicts and preserves text selectability
        console.log('[Paged Renderer] Using jsPDF.html() with autoPaging');
        
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF({
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        });
        
        // Single call to jsPDF.html() with auto-paging enabled
        await new Promise<void>((resolve, reject) => {
          pdf.html(element, {
            callback: () => {
              console.log('[Paged Renderer] PDF generated successfully');
              resolve();
            },
            margin: 10, // Consistent with html2canvas renderer
            autoPaging: 'text', // Smart pagination that avoids cutting text
            x: 10,
            y: 10,
            html2canvas: {
              scale: 0.264,
              useCORS: true,
              letterRendering: true,
              logging: false,
            },
          }).catch(reject);
        });
        
        pdfBlob = pdf.output('blob');
        break;
      }
      
      default:
        throw new Error(`Unknown renderer: ${renderer}`);
    }
    
    return pdfBlob;
  } catch (error) {
    console.error('Error converting HTML to PDF:', error);
    throw new Error(`Failed to convert HTML to PDF with ${renderer}: ${String(error)}`);
  } finally {
    // Cleanup temporary element
    element.remove();
  }
}
