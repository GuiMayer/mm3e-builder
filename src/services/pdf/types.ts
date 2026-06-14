/* ================================================
   PDF Types — Type definitions for the new PDF system
   ================================================ */

import type { ICharacter } from '../../entities/types';

/**
 * Configuration options for PDF generation
 */
export interface PDFGenerationOptions {
  /** Page format (default: 'letter') */
  format?: 'letter' | 'a4';
  
  /** Include background graphics */
  includeBackground?: boolean;
  
  /** Print quality scale (default: 2) */
  scale?: number;
  
  /** Margin settings */
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}

/**
 * Result of PDF generation
 */
export interface PDFGenerationResult {
  /** Generated PDF blob */
  blob: Blob;
  
  /** Generation metadata */
  metadata: {
    pageCount: number;
    generatedAt: Date;
    characterName: string;
    characterPL: number;
  };
}

/**
 * Template renderer interface
 */
export interface IPDFTemplateRenderer {
  /**
   * Render character data to HTML string
   */
  renderToHTML(character: ICharacter): Promise<string>;
  
  /**
   * Get CSS styles for print layout
   */
  getStyles(): string;
}

/**
 * PDF converter interface
 */
export interface IPDFConverter {
  /**
   * Convert HTML to PDF
   */
  convertHTMLToPDF(html: string, options?: PDFGenerationOptions): Promise<Blob>;
}
