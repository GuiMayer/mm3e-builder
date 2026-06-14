/* ================================================
   Abilities Section Component
   8 core abilities: STR, STA, AGL, DEX, FGT, INT, AWE, PRE
   ================================================ */

import type { ICharacter } from '../../../entities/types';
import { escapeHtml, formatBonus, classNames } from './utils';

export interface AbilitiesSectionData {
  character: ICharacter;
  abilitiesCost: number;
}

/**
 * Render the abilities section
 */
export function renderAbilitiesSection(data: AbilitiesSectionData): string {
  const { character, abilitiesCost } = data;
  const { abilities, absentAbilities } = character;

  const abilityList = [
    { key: 'str', name: 'Strength', value: abilities.str },
    { key: 'sta', name: 'Stamina', value: abilities.sta },
    { key: 'agl', name: 'Agility', value: abilities.agl },
    { key: 'dex', name: 'Dexterity', value: abilities.dex },
    { key: 'fgt', name: 'Fighting', value: abilities.fgt },
    { key: 'int', name: 'Intellect', value: abilities.int },
    { key: 'awe', name: 'Awareness', value: abilities.awe },
    { key: 'pre', name: 'Presence', value: abilities.pre },
  ];

  const abilitiesHtml = abilityList
    .map(ability => renderAbilityBox(
      ability.name,
      ability.value,
      absentAbilities.includes(ability.key as keyof typeof abilities)
    ))
    .join('');

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">Abilities</div>
      <div class="abilities-grid">
        ${abilitiesHtml}
      </div>
      <div class="text-right text-bold">
        Total Cost: ${abilitiesCost} PP
      </div>
    </div>
  `.trim();
}

/**
 * Render a single ability box
 */
function renderAbilityBox(name: string, value: number, isAbsent: boolean): string {
  const className = classNames('ability-box', isAbsent && 'absent');
  const displayValue = isAbsent ? '—' : value;
  const bonus = isAbsent ? '' : formatBonus(value);

  return `
    <div class="${className}">
      <div class="ability-name">${escapeHtml(name)}</div>
      <div class="ability-value">${displayValue}</div>
      ${!isAbsent ? `<div class="ability-bonus">${bonus}</div>` : ''}
    </div>
  `;
}
