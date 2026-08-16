/* ================================================
   Defenses Section Component
   Dodge, Parry, Fortitude, Will, Toughness, Initiative
   ================================================ */

import type { ICharacter } from '../../../entities/types';
import { escapeHtml } from './utils';

export interface DefensesSectionData {
  character: ICharacter;
  defensesCost: number;
  toughnessTotal: number;
  initiativeTotal: number;
}

/**
 * Render the defenses section
 */
export function renderDefensesSection(data: DefensesSectionData): string {
  const { character, defensesCost, toughnessTotal, initiativeTotal } = data;
  const { defenses, abilities, absentAbilities } = character;

  // Calculate base values (ability bonuses)
  const aglValue = absentAbilities.includes('agl') ? 0 : abilities.agl;
  const fgtValue = absentAbilities.includes('fgt') ? 0 : abilities.fgt;
  const staValue = absentAbilities.includes('sta') ? 0 : abilities.sta;
  const aweValue = absentAbilities.includes('awe') ? 0 : abilities.awe;

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

  const defensesHtml = defenseList.map(def => renderDefenseBox(def)).join('');

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">
        Defenses
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
}): string {
  return `
    <div class="defense-box">
      <div class="defense-name">${escapeHtml(defense.name)}</div>
      <div class="defense-value">${defense.total}</div>
      <div class="defense-breakdown">
        Base: ${defense.base} + Bonus: ${defense.bonus}
      </div>
    </div>
  `;
}
