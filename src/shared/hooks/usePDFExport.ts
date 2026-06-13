import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveCharacter } from './useActiveCharacter';
import { checkPDFOverflow } from '../../services/pdf/overflowCollector';
import type { PDFOverflowReport } from '../../services/pdf/overflowCollector';
import { buildOffenseSummary } from '../lib/offenseSummary';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../../entities/gameDataLoaders';

/**
 * Hook for managing PDF export with overflow detection.
 * Encapsulates PDF generation logic, overflow checking, and modal state.
 */
export function usePDFExport() {
  const { t } = useTranslation();
  const { character } = useActiveCharacter();
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
      const { fillAndDownloadPDF } = await import('../../services/pdf/pdfFillService');
      await fillAndDownloadPDF(character);
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

  return {
    exportPDF,
    confirmAndExportPDF,
    clearOverflow,
    pdfOverflow,
    isPdfLoading,
  };
}
