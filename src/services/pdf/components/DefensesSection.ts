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
  const dexValue = absentAbilities.includes('dex') ? 0 : abilities.dex;
  const staValue = absentAbilities.includes('sta') ? 0 : abilities.sta;
  const aweValue = absentAbilities.includes('awe') ? 0 : abilities.awe;

  const defenseList = [
    {
      name: 'Dodge',
      total: defenses.dodge,
      base: aglValue,
      bonus: defenses.dodge - aglValue,
    },
    {
      name: 'Parry',
      total: defenses.parry,
      base: dexValue,
      bonus: defenses.parry - dexValue,
    },
    {
      name: 'Fortitude',
      total: defenses.fortitude,
      base: staValue,
      bonus: defenses.fortitude - staValue,
    },
    {
      name: 'Will',
      total: defenses.will,
      base: aweValue,
      bonus: defenses.will - aweValue,
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
      <div class="pdf-section-title">Defenses</div>
      <div class="defenses-grid">
        ${defensesHtml}
      </div>
      <div class="text-right text-bold">
        Total Cost: ${defensesCost} PP
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
