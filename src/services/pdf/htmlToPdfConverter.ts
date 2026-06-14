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
        // Paged.js renderer: chunks content into pages using CSS Paged Media specs,
        // then converts to PDF using jsPDF.html() to preserve text selectability
        console.log('[Paged Renderer] Using Paged.js for CSS Paged Media rendering');
        
        // Import Paged.js Previewer
        const { Previewer } = await import('pagedjs');
        
        // Create a temporary container for Paged.js rendering
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '210mm'; // A4 width
        document.body.appendChild(tempContainer);
        
        try {
          // Create a previewer instance
          const previewer = new Previewer();
          
          // Render the HTML with Paged.js
          const flow = await previewer.preview(
            element.innerHTML,
            [], // CSS stylesheets array
            tempContainer
          );
          
          console.log('[Paged Renderer] Content rendered into', flow.total, 'pages');
          
          // Get all rendered pages from Paged.js
          const pages = tempContainer.querySelectorAll('.pagedjs_page');
          
          if (!pages.length) {
            throw new Error('Paged.js did not generate any pages');
          }
          
          // Create PDF using jsPDF
          const { jsPDF } = await import('jspdf');
          const pdf = new jsPDF({
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
          });
          
          // Process each page: use jsPDF.html() to preserve text selectability
          for (let i = 0; i < pages.length; i++) {
            const page = pages[i] as HTMLElement;
            
            // Add new page to PDF (except for the first one)
            if (i > 0) {
              pdf.addPage();
            }
            
            // Get the page area (without margins)
            const pageArea = page.querySelector('.pagedjs_page_content') as HTMLElement || page;
            
            // Use jsPDF.html() to render HTML as vectors (text stays selectable)
            await pdf.html(pageArea, {
              callback: () => {},
              x: 5, // Small margin
              y: 5,
              width: 200, // A4 width minus margins
              windowWidth: 800, // Viewport width for rendering
            });
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
