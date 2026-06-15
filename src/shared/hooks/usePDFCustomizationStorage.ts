/* ================================================
   PDF Customization Storage Hook
   Manages saving/loading PDF customization options in localStorage
   ================================================ */

import { useEffect, useCallback } from 'react';
import type { PDFCustomizationOptions } from '../../services/pdf/types';
import { DEFAULT_CUSTOMIZATION } from '../../services/pdf/types';

const STORAGE_KEY = 'mm3e-pdf-customization-options';

/**
 * Load PDF customization options from localStorage
 */
export function loadPDFCustomizationOptions(): PDFCustomizationOptions {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_CUSTOMIZATION;
    }

    const parsed = JSON.parse(stored);
    
    // Validate that all required fields exist
    if (
      typeof parsed.renderer === 'string' &&
      typeof parsed.colorScheme === 'string' &&
      typeof parsed.layoutMode === 'string' &&
      typeof parsed.fontFamily === 'string' &&
      typeof parsed.fontSize === 'string' &&
      typeof parsed.includeNotes === 'boolean' &&
      typeof parsed.includeComplications === 'boolean' &&
      typeof parsed.includeEquipment === 'boolean'
    ) {
      return parsed;
    }

    // If validation fails, return defaults
    return DEFAULT_CUSTOMIZATION;
  } catch (error) {
    console.error('Error loading PDF customization options from localStorage:', error);
    return DEFAULT_CUSTOMIZATION;
  }
}

/**
 * Save PDF customization options to localStorage
 */
export function savePDFCustomizationOptions(options: PDFCustomizationOptions): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
  } catch (error) {
    console.error('Error saving PDF customization options to localStorage:', error);
  }
}

/**
 * Hook to manage PDF customization options with localStorage persistence
 */
export function usePDFCustomizationStorage(
  options: PDFCustomizationOptions,
  onChange: (options: PDFCustomizationOptions) => void
) {
  // Save to localStorage whenever options change
  useEffect(() => {
    savePDFCustomizationOptions(options);
  }, [options]);

  // Wrapped onChange that also saves to localStorage
  const handleChange = useCallback(
    (newOptions: PDFCustomizationOptions) => {
      onChange(newOptions);
      savePDFCustomizationOptions(newOptions);
    },
    [onChange]
  );

  return handleChange;
}
