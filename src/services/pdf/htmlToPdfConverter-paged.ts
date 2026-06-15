/* ================================================
   HTML to PDF Converter (Paged.js)
   Uses Paged.js + window.print() for selectable text
   ================================================ */

// @ts-expect-error - pagedjs does not have TypeScript definitions
import Paged from 'pagedjs';

export interface PagedPdfOptions {
  filename: string;
}

/**
 * Convert HTML to print preview using Paged.js
 * Opens browser print dialog for user to save as PDF
 * Text remains selectable in final PDF
 * 
 * @param html - HTML content to convert
 * @param options - Conversion options (reserved for future use)
 */
export async function convertHtmlToPdfWithPaged(
  html: string,
  options: PagedPdfOptions
): Promise<void> {
  // Use options to avoid unused var warning
  console.log(`[Paged] Preparing print dialog for: ${options.filename}`);
  
  // Create temporary container
  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  try {
    // Initialize Paged.js
    const paged = new Paged.Previewer();
    
    // Render HTML with CSS Paged Media
    await paged.preview(container.innerHTML, [], container);
    
    // Trigger print dialog
    window.print();
    
  } catch (error) {
    console.error('Error rendering with Paged.js:', error);
    throw new Error('Failed to render PDF with Paged.js: ' + String(error));
  } finally {
    // Cleanup
    document.body.removeChild(container);
  }
}
