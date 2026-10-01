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

/* ================================================
   PDF Customization Types
   Types and constants for PDF customization options
   ================================================ */

/**
 * Available color schemes for PDF
 */
export type ColorScheme = 'default' | 'crimson' | 'emerald' | 'slate' | 'mono';

/**
 * Layout mode for PDF
 */
export type LayoutMode = 'normal' | 'compact';

/**
 * Font size options
 */
export type FontSize = 'small' | 'medium' | 'large';

/**
 * Available font families
 */
export type FontFamily = 'Noto Sans' | 'Noto Serif' | 'Segoe UI' | 'Arial' | 'Times New Roman' | 'Georgia';

/**
 * PDF customization options
 */
export interface PDFCustomizationOptions {
  /** Worksheet includes empty fields and writing space; never changes character data. */
  contentMode?: 'filled' | 'worksheet';
  colorScheme: ColorScheme;
  layoutMode: LayoutMode;
  fontFamily: FontFamily;
  fontSize: FontSize;
  includeNotes: boolean;
  includeComplications: boolean;
  includeEquipment: boolean;
  /** Legacy preference, replaced in the panel by contentMode. */
  hideEmptySections?: boolean;
}

/**
 * Color theme definition
 */
export interface ColorTheme {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
}

/**
 * Color themes
 */
export const COLOR_THEMES: Record<ColorScheme, ColorTheme> = {
  mono: {primary:'#222222',primaryLight:'#777777',primaryDark:'#111111',secondary:'#444444',accent:'#555555'},
  default: {
    primary: '#2c5aa0',
    primaryLight: '#4a7bc8',
    primaryDark: '#1e3a70',
    secondary: '#5a6c7d',
    accent: '#6b7a8c',
  },
  crimson: {
    primary: '#8B1538',
    primaryLight: '#C85A5A',
    primaryDark: '#5A0A1F',
    secondary: '#6B4C4C',
    accent: '#8C6B6B',
  },
  emerald: {
    primary: '#047857',
    primaryLight: '#5AAA8C',
    primaryDark: '#025A44',
    secondary: '#4C6B63',
    accent: '#6B8C7D',
  },
  slate: {
    primary: '#475569',
    primaryLight: '#94A3B8',
    primaryDark: '#1e293b',
    secondary: '#64748B',
    accent: '#94A3B8',
  },
};

/**
 * Default customization options
 */
export const DEFAULT_CUSTOMIZATION: PDFCustomizationOptions = {
  contentMode: 'filled',
  colorScheme: 'default',
  layoutMode: 'normal',
  fontFamily: 'Noto Sans',
  fontSize: 'medium',
  includeNotes: true,
  includeComplications: true,
  includeEquipment: true,
  hideEmptySections: true,
};

