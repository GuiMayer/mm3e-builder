import { englishPDFLabels, type PDFLabels } from '../pdfMessages';
/* ================================================
   Powers Section Component
   List of powers with effects and modifiers
   ================================================ */

import type { ICharacter, IPowerEffect, IModifierDef } from '../../../entities/types';
import { getCharacterStrength } from '../../../shared/lib/componentRanks';
import { escapeHtml } from './utils';
import { calcPowerTotalCost } from '../../../shared/lib/mathEngine';
import { renderPowerDetails } from './powerDetails';
import { blankPower } from './worksheet';

export interface PowersSectionData {
  labels?: PDFLabels;
  worksheet?: boolean;
  character: ICharacter;
  powerDefs: IPowerEffect[];
  modifierDefs: IModifierDef[];
  powersCost: number;
}

/**
 * Render the powers section
 */
export function renderPowersSection(data: PowersSectionData): string {
  const labels = data.labels ?? englishPDFLabels;
  const { character, powerDefs, modifierDefs, powersCost } = data;
  
  // Filter out equipment (removable powers)
  const powers = character.powers.filter(p => 
    !p.removable || p.removable === 'none'
  );

  if (powers.length === 0 && !data.worksheet) {
    return `
      <div class="pdf-section">
        <div class="pdf-section-title">${labels('Powers')}</div>
        <p class="text-muted">${labels('No powers defined.')}</p>
      </div>
    `.trim();
  }

  const powersHtml = powers
    .map(power => renderPowerEntry(power, powerDefs, modifierDefs, getCharacterStrength(character), labels))
    .join('') + (data.worksheet ? Array.from({ length: powers.length ? 1 : 2 }, () => blankPower(labels)).join('') : '');

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">
        ${labels('Powers')}
        <span class="section-cost">${powersCost} PP</span>
      </div>
      <div class="powers-list">
        ${powersHtml}
      </div>
    </div>
  `.trim();
}

/**
 * Render a single power entry
 */
function renderPowerEntry(
  power: ICharacter['powers'][0],
  powerDefs: IPowerEffect[],
  modifierDefs: IModifierDef[],
  strength: number,
  labels: PDFLabels
): string {
  const totalCost = calcPowerTotalCost(power, powerDefs, modifierDefs, strength);
  
  return `<div class="power-entry"><div class="power-header"><div class="power-name">${escapeHtml(power.name || labels('Unnamed Power'))}</div><div class="power-cost">${totalCost} PP</div></div>${renderPowerDetails(power, powerDefs, modifierDefs, labels)}</div>`;
}
