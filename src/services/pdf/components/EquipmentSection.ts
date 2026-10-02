import { englishPDFLabels, type PDFLabels } from '../pdfMessages';
/* ================================================
   Equipment Section Component
   Powers marked as removable equipment
   ================================================ */

import type { ICharacter, IPowerEffect, IModifierDef, IResource } from '../../../entities/types';
import { getCharacterStrength } from '../../../shared/lib/componentRanks';
import { escapeHtml } from './utils';
import { renderPowerDetails } from './powerDetails';
import { calcEquipmentEPCost, calcPowerTotalCost } from '../../../shared/lib/mathEngine';
import { getLinkedResourceCharges, type LinkedResourceCharge } from '../../../shared/lib/resourceCalculations';
import { describeResource, describeResourcePower } from '../../resourceDescription';
import { blankPower } from './worksheet';

export interface EquipmentSectionData {
  labels?: PDFLabels;
  worksheet?: boolean;
  character: ICharacter;
  powerDefs: IPowerEffect[];
  modifierDefs: IModifierDef[];
  resources?: IResource[];
}

/**
 * Render the equipment section
 */
export function renderEquipmentSection(data: EquipmentSectionData): string {
  const labels = data.labels ?? englishPDFLabels;
  const { character, powerDefs, modifierDefs, resources = [] } = data;
  const strength = getCharacterStrength(character);
  
  // Filter equipment (powers with removable flag)
  const equipment = character.powers.filter(p => 
    p.removable === 'removable' || p.removable === 'easily_removable'
  );

  const linkedResources = getLinkedResourceCharges(character, resources, powerDefs, modifierDefs);
  const legacyEquipment = character.equipment ?? [];

  if (!data.worksheet && equipment.length === 0 && legacyEquipment.length === 0 && linkedResources.length === 0 && !character.equipmentNotes?.trim()) {
    return ''; // No section if no equipment
  }

  const equipmentHtml = equipment
    .map(item => renderEquipmentEntry(item, powerDefs, modifierDefs, strength, labels))
    .join('');

  const deviceCost = linkedResources.reduce((sum, charge) => sum + (charge.unit === 'PP' ? charge.charged : 0), 0) + equipment.reduce((sum, item) =>
    sum + calcPowerTotalCost(item, powerDefs, modifierDefs, strength), 0
  );
  const resourceCost = legacyEquipment.reduce((sum, item) => sum + calcEquipmentEPCost(item, powerDefs, modifierDefs, strength), 0)
    + linkedResources.reduce((sum, charge) => sum + (charge.unit === 'EP' ? charge.charged : 0), 0);
  const costLabel = [deviceCost > 0 ? `${deviceCost} PP` : '', resourceCost > 0 ? `${resourceCost} EP` : ''].filter(Boolean).join(' · ') || '0 EP';

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">
        ${labels('Devices & Resources')}
        <span class="section-cost">${costLabel}</span>
      </div>
      <div class="equipment-list">
        ${equipmentHtml}
        ${legacyEquipment.map((item) => renderLegacyEquipmentEntry(item, powerDefs, modifierDefs, strength, labels)).join('')}
        ${linkedResources.map((entry) => renderResourceEntry(entry, powerDefs, modifierDefs, labels)).join('')}
        ${character.equipmentNotes?.trim() ? `<div class="power-description">${escapeHtml(character.equipmentNotes)}</div>` : ''}
        ${data.worksheet ? blankPower(labels, 'equipment-entry') : ''}
      </div>
    </div>
  `.trim();
}

function renderResourceEntry(charge: LinkedResourceCharge, powerDefs: IPowerEffect[], modifierDefs: IModifierDef[], labels: PDFLabels): string {
  const { resource, link, charged, unit, alternate } = charge;
  const type = resource.type.charAt(0).toUpperCase() + resource.type.slice(1);
  const traits = describeResource(resource, powerDefs, modifierDefs, labels);
  const ownership = link.isFree ? labels('Free') : alternate ? labels('Alternate') : unit === 'EP' && link.contributionEP !== undefined ? labels('Shared') : '';
  return `<div class="equipment-entry"><div class="power-header"><div class="power-name">${escapeHtml(resource.name || labels('Unnamed Resource'))} <span class="text-muted">(${escapeHtml(labels(type))})</span></div><div class="power-cost">${charged} ${unit}${ownership ? ` (${ownership})` : ''}</div></div><div class="power-effects">${escapeHtml(traits.join(' · '))}</div>${resource.notes ? `<div class="power-description text-small">${escapeHtml(resource.notes)}</div>` : ''}</div>`;
}

function renderLegacyEquipmentEntry(item: ICharacter['powers'][0], powerDefs: IPowerEffect[], modifierDefs: IModifierDef[], strength: number, labels: PDFLabels): string {
  return `<div class="equipment-entry"><div class="power-header"><div class="power-name">${escapeHtml(item.name || labels('Unnamed Equipment'))} <span class="text-muted">(${labels('Equipment')})</span></div><div class="power-cost">${calcEquipmentEPCost(item, powerDefs, modifierDefs, strength)} EP</div></div><div class="power-effects">${escapeHtml(describeResourcePower(item, powerDefs, modifierDefs, labels))}</div></div>`;
}

/**
 * Render a single equipment entry
 */
function renderEquipmentEntry(
  item: ICharacter['powers'][0],
  powerDefs: IPowerEffect[],
  modifierDefs: IModifierDef[],
  strength: number,
  labels: PDFLabels
): string {
  const totalCost = calcPowerTotalCost(item, powerDefs, modifierDefs, strength);
  
  return `<div class="equipment-entry"><div class="power-header"><div class="power-name">${escapeHtml(item.name || labels('Unnamed Equipment'))}</div><div class="power-cost">${totalCost} PP</div></div>${renderPowerDetails(item, powerDefs, modifierDefs, labels)}</div>`;
}
