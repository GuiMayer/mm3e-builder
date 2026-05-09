import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCharStore } from '../../store/charStore';
import { fillAndDownloadPDF, checkPDFOverflow } from '../../services/pdf/pdfFillService';
import type { PDFOverflowReport } from '../../services/pdf/pdfFillService';
import { buildOffenseSummary } from '../lib/offenseSummary';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../../entities/gameDataLoaders';

/**
 * Hook for managing PDF export with overflow detection.
 * Encapsulates PDF generation logic, overflow checking, and modal state.
 */
export function usePDFExport() {
  const { t } = useTranslation();
  const character = useCharStore((s) => s.character);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfOverflow, setPdfOverflow] = useState<PDFOverflowReport[]>([]);

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
      await fillAndDownloadPDF(character);
    } catch (e) {
      alert(t('errors.importError') + '\n' + String(e));
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

  return {
    exportPDF,
    confirmAndExportPDF,
    clearOverflow,
    pdfOverflow,
    isPdfLoading,
  };
}
