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

export interface EquipmentSectionData {
  character: ICharacter;
  powerDefs: IPowerEffect[];
  modifierDefs: IModifierDef[];
  resources?: IResource[];
}

/**
 * Render the equipment section
 */
export function renderEquipmentSection(data: EquipmentSectionData): string {
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

  if (equipment.length === 0 && legacyEquipment.length === 0 && linkedResources.length === 0 && !character.equipmentNotes?.trim()) {
    return ''; // No section if no equipment
  }

  const equipmentHtml = equipment
    .map(item => renderEquipmentEntry(item, powerDefs, modifierDefs, strength))
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
        Devices &amp; Resources
        <span class="section-cost">${costLabel}</span>
      </div>
      <div class="equipment-list">
        ${equipmentHtml}
        ${legacyEquipment.map((item) => renderLegacyEquipmentEntry(item, powerDefs, modifierDefs, strength)).join('')}
        ${linkedResources.map((entry) => renderResourceEntry(entry.resource, entry.isFree, entry.contributionEP, powerDefs, modifierDefs, strength)).join('')}
        ${character.equipmentNotes?.trim() ? `<div class="power-description">${escapeHtml(character.equipmentNotes)}</div>` : ''}
      </div>
    </div>
  `.trim();
}

function renderResourceEntry(resource: IResource, isFree: boolean, contributionEP: number | undefined, powerDefs: IPowerEffect[], modifierDefs: IModifierDef[], strength: number): string {
  const cost = isFree ? 0 : contributionEP ?? getResourceEPCost(resource, powerDefs, modifierDefs, strength);
  const type = resource.type.charAt(0).toUpperCase() + resource.type.slice(1);
  const traits = resource.type === 'vehicle'
    ? [`${resource.size}`, `STR ${resource.strength}`, `Speed ${resource.speed}`, `Defense ${resource.defense}`, `Toughness ${resource.toughness}`, formatFeatures(resource.features), formatPowerList('Systems', resource.systems, powerDefs, modifierDefs)]
    : resource.type === 'headquarters'
      ? [`${resource.size}`, `Toughness ${resource.toughness}`, formatFeatures(resource.features), formatPowerList('Effects', resource.effects, powerDefs, modifierDefs)]
      : [formatPower(resource.power, powerDefs, modifierDefs)];
  return `<div class="equipment-entry"><div class="power-header"><div class="power-name">${escapeHtml(resource.name || 'Unnamed Resource')} <span class="text-muted">(${escapeHtml(type)})</span></div><div class="power-cost">${cost} EP${isFree ? ' (Free)' : contributionEP !== undefined ? ' (Shared)' : ''}</div></div><div class="power-effects">${escapeHtml(traits.filter(Boolean).join(' · '))}</div>${resource.notes ? `<div class="power-description text-small">${escapeHtml(resource.notes)}</div>` : ''}</div>`;
}

function formatFeatures(features: { name: string; ranks?: number; notes?: string }[]): string {
  if (features.length === 0) return '';
  return `Features: ${features.map((feature) => `${feature.name}${feature.ranks && feature.ranks > 1 ? ` ${feature.ranks}` : ''}${feature.notes ? ` (${feature.notes})` : ''}`).join(', ')}`;
}

function formatPowerList(label: string, powers: ICharacter['powers'], powerDefs: IPowerEffect[], modifierDefs: IModifierDef[]): string {
  if (powers.length === 0) return '';
  return `${label}: ${powers.map((power) => formatPower(power, powerDefs, modifierDefs)).join(' | ')}`;
}

function formatPower(power: ICharacter['powers'][0], powerDefs: IPowerEffect[], modifierDefs: IModifierDef[]): string {
  const effects = power.components.map(component => formatComponentDetails(component, powerDefs, modifierDefs)).join(' + ');
  const alternates = power.alternateEffects.map(alternate => [alternate.dynamic ? 'Dynamic Alternate Effect' : 'Alternate Effect', alternate.name, ...alternate.components.map(component => formatComponentDetails(component, powerDefs, modifierDefs)), alternate.notes].filter(Boolean).join(': '));
  return [power.name, effects, power.baseDynamic ? 'Dynamic base effect' : '', power.activation ? `Activation: ${power.activation}` : '', power.descriptors?.join(', '), ...alternates, power.notes].filter(Boolean).join(' — ');
}

function renderLegacyEquipmentEntry(item: ICharacter['powers'][0], powerDefs: IPowerEffect[], modifierDefs: IModifierDef[], strength: number): string {
  return `<div class="equipment-entry"><div class="power-header"><div class="power-name">${escapeHtml(item.name || 'Unnamed Equipment')} <span class="text-muted">(Equipment)</span></div><div class="power-cost">${calcEquipmentEPCost(item, powerDefs, modifierDefs, strength)} EP</div></div><div class="power-effects">${escapeHtml(formatPower(item, powerDefs, modifierDefs))}</div></div>`;
}

/**
 * Render a single equipment entry
 */
function renderEquipmentEntry(
  item: ICharacter['powers'][0],
  powerDefs: IPowerEffect[],
  modifierDefs: IModifierDef[],
  strength: number
): string {
  const totalCost = calcPowerTotalCost(item, powerDefs, modifierDefs, strength);
  
  return `<div class="equipment-entry"><div class="power-header"><div class="power-name">${escapeHtml(item.name || 'Unnamed Equipment')}</div><div class="power-cost">${totalCost} PP</div></div>${renderPowerDetails(item, powerDefs, modifierDefs)}</div>`;
}
