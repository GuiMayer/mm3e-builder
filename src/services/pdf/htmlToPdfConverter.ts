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
        // Paged.js renderer uses jsPDF with native HTML rendering
        // This preserves text selectability better than html2canvas
        console.log('[Paged Renderer] Using jsPDF with html method for selectable text');
        
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF({
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        });
        
        // Use jsPDF's html method which preserves text better
        await pdf.html(element, {
          callback: () => {},
          x: 10,
          y: 10,
          width: 190, // A4 width minus margins
          windowWidth: 800, // Viewport width for rendering
          html2canvas: {
            scale: 1, // Lower scale for faster processing
            useCORS: true,
            letterRendering: true,
          }
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
