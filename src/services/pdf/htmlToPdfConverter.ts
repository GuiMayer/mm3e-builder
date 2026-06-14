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
        // Paged.js renderer uses the Paged.js library to chunk content into pages
        // following CSS Paged Media specifications
        console.log('[Paged Renderer] Using Paged.js for CSS Paged Media rendering');
        
        // Import Paged.js Previewer
        const { Previewer } = await import('pagedjs');
        
        // Create a temporary container for Paged.js rendering
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        document.body.appendChild(tempContainer);
        
        try {
          // Create a previewer instance
          const previewer = new Previewer();
          
          // Render the HTML with Paged.js
          // preview(content, stylesheets, renderTo)
          const flow = await previewer.preview(
            element.innerHTML,
            [], // Can add CSS stylesheets here if needed
            tempContainer
          );
          
          console.log('[Paged Renderer] Content rendered into', flow.total, 'pages');
          
          // Now convert each page to PDF using html2canvas + jsPDF
          const html2canvas = (await import('html2canvas')).default;
          const { jsPDF } = await import('jspdf');
          
          const pdf = new jsPDF({
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
          });
          
          // Get all rendered pages from Paged.js
          const pages = tempContainer.querySelectorAll('.pagedjs_page');
          
          if (!pages.length) {
            throw new Error('Paged.js did not generate any pages');
          }
          
          // Convert each page to PDF
          for (let i = 0; i < pages.length; i++) {
            const page = pages[i] as HTMLElement;
            
            // Capture the page as canvas
            const canvas = await html2canvas(page, {
              scale: 2, // High quality
              useCORS: true,
              letterRendering: true,
              logging: false,
              backgroundColor: '#ffffff',
            });
            
            // Add new page to PDF (except for the first one)
            if (i > 0) {
              pdf.addPage();
            }
            
            // Convert canvas to image and add to PDF
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const imgWidth = 210; // A4 width in mm
            const imgHeight = 297; // A4 height in mm
            
            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
          }
          
          pdfBlob = pdf.output('blob');
          
        } finally {
          // Clean up: remove temporary container
          document.body.removeChild(tempContainer);
        }
        
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
