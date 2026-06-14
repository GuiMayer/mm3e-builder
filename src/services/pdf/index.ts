/* ================================================
   PDF Service — HTML-to-PDF System
   Modern PDF generation using HTML templates + Paged.js + Puppeteer
   ================================================ */

import type { ICharacter } from '../../entities/types';
import type { PDFGenerationOptions, PDFGenerationResult } from './types';
import { PDFTemplateRenderer } from './templateRenderer';
import { PDFConverter } from './pdfConverter';

// Export types
export type { PDFGenerationOptions, PDFGenerationResult } from './types';

// Initialize renderer and converter
const renderer = new PDFTemplateRenderer();
const converter = new PDFConverter();

/**
 * Generate PDF from character data using HTML template system
 * @param character - Character data to render
 * @param options - PDF generation options
 * @returns Generation result with blob and metadata
 */
export async function generatePDF(
  character: ICharacter,
  options?: PDFGenerationOptions
): Promise<PDFGenerationResult> {
  try {
    // Step 1: Render character data to HTML
    const html = await renderer.renderToHTML(character);
    
    // Step 2: Convert HTML to PDF
    const blob = await converter.convertHTMLToPDF(html, options);
    
    // Step 3: Return result with metadata
    return {
      blob,
      metadata: {
        pageCount: 1, // TODO: Calculate actual page count
        generatedAt: new Date(),
        characterName: character.header.name || 'Unnamed Hero',
        characterPL: character.header.powerLevel || 10,
      },
    };
  } catch (error) {
    // If new system fails, provide helpful error message
    throw new Error(
      'New PDF system not yet fully implemented. ' +
      'Please use Legacy PDF system in settings menu. ' +
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Export character as PDF
 * Downloads the PDF file to the user's system
 */
export async function exportCharacterPDF(
  character: ICharacter,
  options?: PDFGenerationOptions
): Promise<void> {
  const result = await generatePDF(character, options);
  
  // Create download link
  const url = URL.createObjectURL(result.blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${character.header.name || 'Character'}_MM3e.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
