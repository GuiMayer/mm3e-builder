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
export type ColorScheme = 'default' | 'crimson' | 'emerald' | 'slate';

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
export type FontFamily = 'Segoe UI' | 'Arial' | 'Times New Roman' | 'Georgia';

/**
 * PDF customization options
 */
export interface PDFCustomizationOptions {
  colorScheme: ColorScheme;
  layoutMode: LayoutMode;
  fontFamily: FontFamily;
  fontSize: FontSize;
  includeNotes: boolean;
  includeComplications: boolean;
  includeEquipment: boolean;
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
  colorScheme: 'default',
  layoutMode: 'normal',
  fontFamily: 'Segoe UI',
  fontSize: 'medium',
  includeNotes: true,
  includeComplications: true,
  includeEquipment: true,
};

/**
 * Font size scales (in pt)
 */
export const FONT_SIZE_SCALES = {
  small: {
    xs: 6,
    sm: 7,
    base: 9,
    md: 10,
    lg: 11,
    xl: 13,
    '2xl': 15,
    '3xl': 18,
  },
  medium: {
    xs: 7,
    sm: 8,
    base: 10,
    md: 11,
    lg: 12,
    xl: 14,
    '2xl': 16,
    '3xl': 20,
  },
  large: {
    xs: 8,
    sm: 9,
    base: 11,
    md: 12,
    lg: 13,
    xl: 15,
    '2xl': 17,
    '3xl': 22,
  },
};

/**
 * Spacing scales for layout modes (in inches)
 */
export const SPACING_SCALES = {
  normal: {
    xs: 0.03,
    sm: 0.05,
    md: 0.08,
    lg: 0.1,
    xl: 0.15,
    '2xl': 0.2,
    '3xl': 0.3,
    pagePadding: 0.5,
  },
  compact: {
    xs: 0.018,
    sm: 0.03,
    md: 0.048,
    lg: 0.06,
    xl: 0.09,
    '2xl': 0.12,
    '3xl': 0.18,
    pagePadding: 0.35,
  },
};
