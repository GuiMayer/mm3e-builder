import { englishPDFLabels, type PDFLabels } from '../pdfMessages';
/* ================================================
   Defenses Section Component
   Dodge, Parry, Fortitude, Will, Toughness, Initiative
   ================================================ */

import type { ICharacter } from '../../../entities/types';
import { escapeHtml } from './utils';
import { getEffectiveAbilityRank } from '../../../shared/lib/abilityRanks';

export interface DefensesSectionData {
  labels?: PDFLabels;
  character: ICharacter;
  defensesCost: number;
  toughnessTotal: number;
  initiativeTotal: number;
}

/**
 * Render the defenses section
 */
export function renderDefensesSection(data: DefensesSectionData): string {
  const labels = data.labels ?? englishPDFLabels;
  const { character, defensesCost, toughnessTotal, initiativeTotal } = data;
  const { defenses, abilities, absentAbilities } = character;

  // Calculate base values (ability bonuses)
  const aglValue = getEffectiveAbilityRank(abilities, absentAbilities, 'agl');
  const fgtValue = getEffectiveAbilityRank(abilities, absentAbilities, 'fgt');
  const staValue = getEffectiveAbilityRank(abilities, absentAbilities, 'sta');
  const aweValue = getEffectiveAbilityRank(abilities, absentAbilities, 'awe');

  const defenseList = [
    {
      name: 'Dodge',
      total: aglValue + defenses.dodge,
      base: aglValue,
      bonus: defenses.dodge,
    },
    {
      name: 'Parry',
      total: fgtValue + defenses.parry,
      base: fgtValue,
      bonus: defenses.parry,
    },
    {
      name: 'Fortitude',
      total: staValue + defenses.fortitude,
      base: staValue,
      bonus: defenses.fortitude,
    },
    {
      name: 'Will',
      total: aweValue + defenses.will,
      base: aweValue,
      bonus: defenses.will,
    },
    {
      name: 'Toughness',
      total: toughnessTotal,
      base: staValue,
      bonus: toughnessTotal - staValue,
    },
    {
      name: 'Initiative',
      total: initiativeTotal,
      base: aglValue,
      bonus: initiativeTotal - aglValue,
    },
  ];

  const defensesHtml = defenseList.map(def => renderDefenseBox(def, labels)).join('');

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">
        ${labels('Defenses')}
        <span class="section-cost">${defensesCost} PP</span>
      </div>
      <div class="defenses-grid">
        ${defensesHtml}
      </div>
    </div>
  `.trim();
}

/**
 * Render a single defense box
 */
function renderDefenseBox(defense: {
  name: string;
  total: number;
  base: number;
  bonus: number;
}, labels: PDFLabels): string {
  return `
    <div class="defense-box">
      <div class="defense-name">${escapeHtml(labels(defense.name))}</div>
      <div class="defense-value">${defense.total}</div>
      <div class="defense-breakdown">
        ${labels('Base')}: ${defense.base} + ${labels('Bonus')}: ${defense.bonus}
      </div>
    </div>
  `;
}
