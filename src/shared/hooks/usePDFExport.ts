import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveCharacter } from './useActiveCharacter';
import { useAppStore } from '../../store/appStore';
import { checkPDFOverflow } from '../../services/pdf-legacy';
import type { PDFOverflowReport } from '../../services/pdf-legacy';
import { buildOffenseSummary } from '../lib/offenseSummary';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../../entities/gameDataLoaders';
import type { ISkillDef, IAdvantageDef } from '../../entities/types';
import { convertHtmlToPdf } from '../../services/pdf/htmlToPdfConverter';
import { downloadBlob, sanitizeFileName } from '../../services/downloadHelper';
import { useToast } from './useToast';
import type { PDFCustomizationOptions } from '../../services/pdf/types';
import { DEFAULT_CUSTOMIZATION } from '../../services/pdf/types';

/**
 * Hook for managing PDF export with preview modal and toast notifications.
 * Encapsulates PDF generation logic, overflow checking, and modal state.
 */
export function usePDFExport() {
  const { t } = useTranslation();
  const { character } = useActiveCharacter();
  const { showToast, updateToast, dismissToast } = useToast();
  
  const [pdfOverflow, setPdfOverflow] = useState<PDFOverflowReport[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [pdfPreviewHtml, setPdfPreviewHtml] = useState<string | null>(null);
  const [pdfCharacterName, setPdfCharacterName] = useState<string>('');
  const [currentToastId, setCurrentToastId] = useState<string | null>(null);
  const [customizationOptions, setCustomizationOptions] = useState<PDFCustomizationOptions>(DEFAULT_CUSTOMIZATION);

  /**
   * Open preview modal and start generating HTML
   * For legacy mode, directly exports without preview
   */
  async function exportPDF() {
    const useLegacy = useAppStore.getState().useLegacyPdfExporter;
    console.log('[usePDFExport] exportPDF called, useLegacy:', useLegacy);
    
    // Legacy mode: check overflow and export directly
    if (useLegacy) {
      const offenseEntries = buildOffenseSummary(
        character,
        POWER_DEFS,
        SKILL_DEFS,
        ADVANTAGE_DEFS,
        MODIFIER_DEFS
      );
      
      const overflowReport = checkPDFOverflow(character, offenseEntries);
      
      if (overflowReport.length > 0) {
        setPdfOverflow(overflowReport);
        return;
      }
      
      await executeLegacyPDFExport();
      return;
    }
    
    // New mode: open modal immediately and generate preview
    setIsPreviewOpen(true);
    setIsGeneratingPreview(true);
    setPdfPreviewHtml(null);
    setPdfCharacterName(character.header.name || 'character');
    
    // Show toast notification
    const toastId = showToast(t('pdf.toast.generating'), 'loading');
    setCurrentToastId(toastId);
    
    // Generate HTML in background
    await generatePreviewHtml();
  }

  /**
   * Generate HTML for preview with specific customization options
   */
  async function generatePreviewHtml(options?: PDFCustomizationOptions) {
    const customOptions = options || customizationOptions;
    
    console.log('[usePDFExport] generatePreviewHtml called with options:', customOptions);
    
    try {
      const { generateCharacterPDF } = await import('../../services/pdf');
      
      // Convert arrays to Records
      const skillDefsRecord: Record<string, ISkillDef> = {};
      SKILL_DEFS.forEach(skill => {
        skillDefsRecord[skill.id] = skill;
      });
      
      const advantageDefsRecord: Record<string, IAdvantageDef> = {};
      ADVANTAGE_DEFS.forEach(adv => {
        advantageDefsRecord[adv.id] = adv;
      });
      
      console.log('[usePDFExport] Calling generateCharacterPDF...');
      const result = await generateCharacterPDF({
        character,
        powerDefs: POWER_DEFS,
        modifierDefs: MODIFIER_DEFS,
        skillDefs: skillDefsRecord,
        advantageDefs: advantageDefsRecord,
        customization: customOptions,
      });
      
      console.log('[usePDFExport] generateCharacterPDF result:', { success: result.success, hasHtml: !!result.html, error: result.error });
      
      if (!result.success) {
        throw new Error(result.error || 'PDF generation failed');
      }
      
      // Store HTML for preview
      setPdfPreviewHtml(result.html);
      console.log('[usePDFExport] HTML preview set successfully');
      
      // Update toast to success
      if (currentToastId) {
        updateToast(currentToastId, t('pdf.toast.ready'), 'success');
        setCurrentToastId(null);
      }
    } catch (e) {
      console.error('[usePDFExport] Error generating preview:', e);
      
      // Update toast to error
      if (currentToastId) {
        updateToast(currentToastId, t('pdf.toast.error'), 'error');
        setCurrentToastId(null);
      }
      
      // Close modal on error
      console.log('[usePDFExport] Closing modal due to error');
      setIsPreviewOpen(false);
      setPdfPreviewHtml(null);
    } finally {
      setIsGeneratingPreview(false);
    }
  }

  /**
   * Execute legacy PDF export (called after overflow confirmation or when no overflow)
   */
  async function executeLegacyPDFExport() {
    const toastId = showToast(t('pdf.generating'), 'loading');
    
    try {
      const { fillAndDownloadPDF } = await import('../../services/pdf-legacy');
      await fillAndDownloadPDF(character);
      
      updateToast(toastId, t('pdf.toast.downloaded'), 'success');
    } catch (e) {
      updateToast(toastId, t('pdf.toast.error'), 'error');
      console.error('Error exporting PDF:', e);
    }
  }

  /**
   * Confirm and export PDF despite overflow warnings (legacy mode only)
   */
  async function confirmAndExportPDF() {
    await executeLegacyPDFExport();
  }

  /**
   * Clear overflow modal
   */
  function clearOverflow() {
    setPdfOverflow([]);
  }

  /**
   * Generate and open PDF in browser (new behavior for preview modal)
   */
  async function generateAndOpenPdf() {
    if (!pdfPreviewHtml) return;
    
    const sanitizedName = sanitizeFileName(pdfCharacterName);
    const filename = `${sanitizedName}_sheet.pdf`;
    
    const toastId = showToast(t('pdf.toast.converting'), 'loading');
    
    try {
      const pdfBlob = await convertHtmlToPdf(pdfPreviewHtml, { 
        filename,
        renderer: customizationOptions.renderer || 'html2canvas'
      });
      
      // Open PDF in new browser tab
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      
      // Clean up URL after a delay
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
      
      updateToast(toastId, t('pdf.toast.downloaded'), 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      updateToast(toastId, t('pdf.toast.error'), 'error');
      throw error;
    }
  }

  /**
   * Download HTML from preview
   */
  async function downloadHtmlFromPreview() {
    if (!pdfPreviewHtml) return;
    
    const sanitizedName = sanitizeFileName(pdfCharacterName);
    const filename = `${sanitizedName}_sheet.html`;
    const blob = new Blob([pdfPreviewHtml], { type: 'text/html' });
    await downloadBlob(blob, filename);
  }

  /**
   * Close preview dialog
   */
  function closePreview() {
    setIsPreviewOpen(false);
    setPdfPreviewHtml(null);
    setPdfCharacterName('');
    setIsGeneratingPreview(false);
    
    // Dismiss any active toast
    if (currentToastId) {
      dismissToast(currentToastId);
      setCurrentToastId(null);
    }
  }

  /**
   * Handle customization changes and regenerate preview
   */
  const handleCustomizationChange = useCallback(async (newOptions: PDFCustomizationOptions) => {
    setCustomizationOptions(newOptions);
    
    // Regenerate preview with new options immediately
    if (isPreviewOpen) {
      setIsGeneratingPreview(true);
      await generatePreviewHtml(newOptions);
    }
  }, [isPreviewOpen, character, currentToastId, t, updateToast]);

  return {
    exportPDF,
    confirmAndExportPDF,
    clearOverflow,
    pdfOverflow,
    isPreviewOpen,
    isGeneratingPreview,
    pdfPreviewHtml,
    pdfCharacterName,
    customizationOptions,
    handleCustomizationChange,
    generateAndOpenPdf,
    downloadHtmlFromPreview,
    closePreview,
  };
}
