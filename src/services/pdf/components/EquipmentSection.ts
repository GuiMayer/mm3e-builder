import { englishPDFLabels, type PDFLabels } from '../pdfMessages';
/* ================================================
   Equipment Section Component
   Powers marked as removable equipment
   ================================================ */

import type { ICharacter, IPowerEffect, IModifierDef, IResource } from '../../../entities/types';
import { getCharacterStrength } from '../../../shared/lib/componentRanks';
import { escapeHtml } from './utils';
import { formatComponentDetails, renderPowerDetails } from './powerDetails';
import { calcEquipmentEPCost, calcPowerTotalCost } from '../../../shared/lib/mathEngine';
import { getResourceEPCost } from '../../../shared/lib/resourceCalculations';
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

  const linkedResources = (character.resourceLinks ?? []).flatMap((link) => {
    const resource = resources.find((item) => item.id === link.resourceId);
    return resource ? [{ resource, isFree: link.isFree, contributionEP: link.contributionEP }] : [];
  });
  const legacyEquipment = character.equipment ?? [];

  if (!data.worksheet && equipment.length === 0 && legacyEquipment.length === 0 && linkedResources.length === 0 && !character.equipmentNotes?.trim()) {
    return ''; // No section if no equipment
  }

  const equipmentHtml = equipment
    .map(item => renderEquipmentEntry(item, powerDefs, modifierDefs, strength, labels))
    .join('');

  const deviceCost = equipment.reduce((sum, item) =>
    sum + calcPowerTotalCost(item, powerDefs, modifierDefs, strength), 0
  );
  const resourceCost = legacyEquipment.reduce((sum, item) => sum + calcEquipmentEPCost(item, powerDefs, modifierDefs, strength), 0)
    + linkedResources.reduce((sum, entry) => sum + (entry.isFree ? 0 : entry.contributionEP ?? getResourceEPCost(entry.resource, powerDefs, modifierDefs, strength)), 0);
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
        ${linkedResources.map((entry) => renderResourceEntry(entry.resource, entry.isFree, entry.contributionEP, powerDefs, modifierDefs, strength, labels)).join('')}
        ${character.equipmentNotes?.trim() ? `<div class="power-description">${escapeHtml(character.equipmentNotes)}</div>` : ''}
        ${data.worksheet ? blankPower(labels, 'equipment-entry') : ''}
      </div>
    </div>
  `.trim();
}

function renderResourceEntry(resource: IResource, isFree: boolean, contributionEP: number | undefined, powerDefs: IPowerEffect[], modifierDefs: IModifierDef[], strength: number, labels: PDFLabels): string {
  const cost = isFree ? 0 : contributionEP ?? getResourceEPCost(resource, powerDefs, modifierDefs, strength);
  const type = resource.type.charAt(0).toUpperCase() + resource.type.slice(1);
  const traits = resource.type === 'vehicle'
    ? [labels(resource.size.charAt(0).toUpperCase() + resource.size.slice(1)), `${labels('Strength')} ${resource.strength}`, `${labels('Speed')} ${resource.speed}`, `${labels('Defense')} ${resource.defense}`, `${labels('Toughness')} ${resource.toughness}`, formatFeatures(resource.features, labels), formatPowerList(labels('Systems'), resource.systems, powerDefs, modifierDefs, labels)]
    : resource.type === 'headquarters'
      ? [labels(resource.size.charAt(0).toUpperCase() + resource.size.slice(1)), `${labels('Toughness')} ${resource.toughness}`, formatFeatures(resource.features, labels), formatPowerList(labels('Effects'), resource.effects, powerDefs, modifierDefs, labels)]
      : [formatPower(resource.power, powerDefs, modifierDefs, labels)];
  return `<div class="equipment-entry"><div class="power-header"><div class="power-name">${escapeHtml(resource.name || labels('Unnamed Resource'))} <span class="text-muted">(${escapeHtml(labels(type))})</span></div><div class="power-cost">${cost} EP${isFree ? ` (${labels('Free')})` : contributionEP !== undefined ? ` (${labels('Shared')})` : ''}</div></div><div class="power-effects">${escapeHtml(traits.filter(Boolean).join(' · '))}</div>${resource.notes ? `<div class="power-description text-small">${escapeHtml(resource.notes)}</div>` : ''}</div>`;
}

function formatFeatures(features: { name: string; ranks?: number; notes?: string }[], labels: PDFLabels): string {
  if (features.length === 0) return '';
  return `${labels('Features')}: ${features.map((feature) => `${feature.name}${feature.ranks && feature.ranks > 1 ? ` ${feature.ranks}` : ''}${feature.notes ? ` (${feature.notes})` : ''}`).join(', ')}`;
}

function formatPowerList(label: string, powers: ICharacter['powers'], powerDefs: IPowerEffect[], modifierDefs: IModifierDef[], labels: PDFLabels): string {
  if (powers.length === 0) return '';
  return `${label}: ${powers.map((power) => formatPower(power, powerDefs, modifierDefs, labels)).join(' | ')}`;
}

function formatPower(power: ICharacter['powers'][0], powerDefs: IPowerEffect[], modifierDefs: IModifierDef[], labels: PDFLabels): string {
  const effects = power.components.map(component => formatComponentDetails(component, powerDefs, modifierDefs, labels)).join(' + ');
  const alternates = power.alternateEffects.map(alternate => [alternate.dynamic ? labels('Dynamic Alternate Effect') : labels('Alternate Effect'), alternate.name, ...alternate.components.map(component => formatComponentDetails(component, powerDefs, modifierDefs, labels)), alternate.notes].filter(Boolean).join(': '));
  return [power.name, effects, power.baseDynamic ? labels('Dynamic base effect') : '', power.activation ? `${labels('Activation')}: ${labels(power.activation!)}` : '', power.descriptors?.join(', '), ...alternates, power.notes].filter(Boolean).join(' — ');
}

function renderLegacyEquipmentEntry(item: ICharacter['powers'][0], powerDefs: IPowerEffect[], modifierDefs: IModifierDef[], strength: number, labels: PDFLabels): string {
  return `<div class="equipment-entry"><div class="power-header"><div class="power-name">${escapeHtml(item.name || labels('Unnamed Equipment'))} <span class="text-muted">(${labels('Equipment')})</span></div><div class="power-cost">${calcEquipmentEPCost(item, powerDefs, modifierDefs, strength)} EP</div></div><div class="power-effects">${escapeHtml(formatPower(item, powerDefs, modifierDefs, labels))}</div></div>`;
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
