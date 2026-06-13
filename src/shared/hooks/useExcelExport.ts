import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveCharacter } from './useActiveCharacter';
import type { ExportLabels, GameDataRefs } from '../../services/excelGenerator';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../../entities/gameDataLoaders';

/**
 * Hook for managing Excel export with localized labels.
 * Encapsulates Excel generation logic and translation handling.
 */
export function useExcelExport() {
  const { t, i18n } = useTranslation();
  const { character } = useActiveCharacter();
  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const [excelError, setExcelError] = useState<string | null>(null);

  /**
   * Build localized labels for Excel export
   */
  function buildExcelLabels(): ExportLabels {
    return {
      sheetSummary: t('excel.sheetSummary'),
      sheetAbilities: t('excel.sheetAbilities'),
      sheetDefenses: t('excel.sheetDefenses'),
      sheetSkills: t('excel.sheetSkills'),
      sheetAdvantages: t('excel.sheetAdvantages'),
      sheetPowers: t('excel.sheetPowers'),
      sheetComplications: t('excel.sheetComplications'),
      sheetEquipment: t('excel.sheetEquipment'),
      heroName: t('header.heroName'),
      player: t('header.player'),
      identity: t('header.identity'),
      identityTypeLabel: t('header.identityType.secret').split(' ')[0],
      base: t('header.base'),
      powerLevel: t('header.powerLevel'),
      heroPoints: t('header.heroPoints'),
      powerPoints: t('header.powerPoints'),
      gender: t('header.gender'),
      age: t('header.age'),
      height: t('header.height'),
      weight: t('header.weight'),
      eyes: t('header.eyes'),
      hair: t('header.hair'),
      groupAffiliation: t('header.groupAffiliation'),
      series: t('header.series'),
      gameMaster: t('header.gameMaster'),
      abilityNames: {
        str: t('abilities.str'),
        sta: t('abilities.sta'),
        agl: t('abilities.agl'),
        dex: t('abilities.dex'),
        fgt: t('abilities.fgt'),
        int: t('abilities.int'),
        awe: t('abilities.awe'),
        pre: t('abilities.pre'),
      },
      defenseNames: {
        dodge: t('defenses.dodge'),
        parry: t('defenses.parry'),
        fortitude: t('defenses.fortitude'),
        will: t('defenses.will'),
      },
      colName: t('excel.colName'),
      colRanks: t('excel.colRanks'),
      colAbility: t('excel.colAbility'),
      colTotal: t('excel.colTotal'),
      colCost: t('excel.colCost'),
      colDescription: t('excel.colDescription'),
      colEffect: t('excel.colEffect'),
      colModifiers: t('excel.colModifiers'),
      colNotes: t('excel.colNotes'),
      colTitle: t('excel.colTitle'),
      colType: t('excel.colType'),
      colAlternateEffects: t('excel.colAlternateEffects'),
      section: t('excel.section'),
      spent: t('excel.spent'),
      remaining: t('excel.remaining'),
      totalSpent: t('excel.totalSpent'),
      absent: t('excel.absent'),
      dynamic: t('excel.dynamic'),
      yes: t('excel.yes'),
      no: t('excel.no'),
    };
  }

  /**
   * Build game data references for Excel export
   */
  function buildGameDataRefs(): GameDataRefs {
    return {
      powerDefs: POWER_DEFS,
      modifierDefs: MODIFIER_DEFS,
      advantageDefs: ADVANTAGE_DEFS,
      skillDefs: SKILL_DEFS,
    };
  }

  /**
   * Export character as Excel file
   */
  async function exportExcel() {
    setIsExcelLoading(true);
    setExcelError(null);

    try {
      const labels = buildExcelLabels();
      const gameData = buildGameDataRefs();
      const lang = i18n.language;

      const { generateExcel } = await import('../../services/excelGenerator');
      await generateExcel(character, labels, gameData, lang);
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
