import { useState } from 'react';
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

/**
 * Hook for managing PDF export with overflow detection.
 * Encapsulates PDF generation logic, overflow checking, and modal state.
 */
export function usePDFExport() {
  const { t } = useTranslation();
  const { character } = useActiveCharacter();
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfOverflow, setPdfOverflow] = useState<PDFOverflowReport[]>([]);
  const [pdfPreviewHtml, setPdfPreviewHtml] = useState<string | null>(null);
  const [pdfCharacterName, setPdfCharacterName] = useState<string>('');

  /**
   * Check for PDF overflow and show modal if needed, otherwise export directly
   */
  async function exportPDF() {
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
    
    await executePDFExport();
  }

  /**
   * Execute PDF export (called after overflow confirmation or when no overflow)
   */
  async function executePDFExport() {
    setIsPdfLoading(true);
    setPdfOverflow([]);
    
    try {
      const useLegacy = useAppStore.getState().useLegacyPdfExporter;
      
      if (useLegacy) {
        // Use legacy PDF system (pdf-lib)
        const { fillAndDownloadPDF } = await import('../../services/pdf-legacy');
        await fillAndDownloadPDF(character);
      } else {
        // Use new HTML-based PDF system
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
        
        const result = await generateCharacterPDF({
          character,
          powerDefs: POWER_DEFS,
          modifierDefs: MODIFIER_DEFS,
          skillDefs: skillDefsRecord,
          advantageDefs: advantageDefsRecord,
        });
        
        if (!result.success) {
          throw new Error(result.error || 'PDF generation failed');
        }
        
        // Store HTML for preview
        setPdfPreviewHtml(result.html);
        setPdfCharacterName(character.header.name || 'character');
      }
    } catch (e) {
      alert(t('errors.exportError') + '\n' + String(e));
    } finally {
      setIsPdfLoading(false);
    }
  }

  /**
   * Confirm and export PDF despite overflow warnings
   */
  async function confirmAndExportPDF() {
    await executePDFExport();
  }

  /**
   * Clear overflow modal
   */
  function clearOverflow() {
    setPdfOverflow([]);
  }

  /**
   * Download PDF from preview HTML
   */
  async function downloadPdfFromPreview() {
    if (!pdfPreviewHtml) return;
    
    const sanitizedName = sanitizeFileName(pdfCharacterName);
    const filename = `${sanitizedName}_sheet.pdf`;
    
    try {
      const pdfBlob = await convertHtmlToPdf(pdfPreviewHtml, { filename });
      await downloadBlob(pdfBlob, filename);
    } catch (error) {
      console.error('Error downloading PDF:', error);
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
    setPdfPreviewHtml(null);
    setPdfCharacterName('');
  }

  return {
    exportPDF,
    confirmAndExportPDF,
    clearOverflow,
    pdfOverflow,
    isPdfLoading,
    pdfPreviewHtml,
    pdfCharacterName,
    downloadPdfFromPreview,
    downloadHtmlFromPreview,
    closePreview,
  };
}
