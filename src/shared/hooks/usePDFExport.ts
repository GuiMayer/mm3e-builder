import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveCharacter } from './useActiveCharacter';
import { useAppStore } from '../../store/appStore';
import { checkPDFOverflow } from '../../services/pdf-legacy';
import type { PDFOverflowReport } from '../../services/pdf-legacy';
import { buildOffenseSummary } from '../lib/offenseSummary';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../../entities/gameDataLoaders';
import type { ISkillDef, IAdvantageDef } from '../../entities/types';

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
        
        // TODO: Implement HTML to PDF conversion and download
        // For now, create a temporary HTML file to preview
        const blob = new Blob([result.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${character.header.name || 'character'}_sheet.html`;
        link.click();
        URL.revokeObjectURL(url);
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

  return {
    exportPDF,
    confirmAndExportPDF,
    clearOverflow,
    pdfOverflow,
    isPdfLoading,
  };
}
