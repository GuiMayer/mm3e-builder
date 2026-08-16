import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveCharacter } from './useActiveCharacter';
import {
  buildExcelGameDataRefs,
  buildExcelLabels,
} from '../../services/excelExportConfig';
import { useResourcesStore } from '../../store/resourcesStore';

/**
 * Hook for managing Excel export with localized labels.
 * Encapsulates Excel generation logic and translation handling.
 */
export function useExcelExport() {
  const { t, i18n } = useTranslation();
  const { character } = useActiveCharacter();
  const resources = useResourcesStore((state) => state.resources);
  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const [excelError, setExcelError] = useState<string | null>(null);

  /**
   * Export character as Excel file
   */
  async function exportExcel() {
    setIsExcelLoading(true);
    setExcelError(null);

    try {
      const labels = buildExcelLabels(t);
      const gameData = buildExcelGameDataRefs();
      const lang = i18n.language;

      const { generateExcel } = await import('../../services/excelGenerator');
      await generateExcel(character, labels, gameData, lang, resources);
    } catch (err) {
      console.error('Excel export failed:', err);
      const errorMsg = t('errors.exportError');
      setExcelError(errorMsg);
      alert(errorMsg);
    } finally {
      setIsExcelLoading(false);
    }
  }

  return {
    exportExcel,
    isExcelLoading,
    excelError,
  };
}
