/* ================================================
   Equipment Section Component
   Powers marked as removable equipment
   ================================================ */

import type { ICharacter, IPowerEffect, IModifierDef, IResource } from '../../../entities/types';
import { escapeHtml } from './utils';
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
    .map(item => renderEquipmentEntry(item, powerDefs, modifierDefs))
    .join('');

  const deviceCost = equipment.reduce((sum, item) =>
    sum + calcPowerTotalCost(item, powerDefs, modifierDefs), 0
  );
  const resourceCost = legacyEquipment.reduce((sum, item) => sum + calcEquipmentEPCost(item, powerDefs, modifierDefs), 0)
    + linkedResources.reduce((sum, entry) => sum + (entry.isFree ? 0 : entry.contributionEP ?? getResourceEPCost(entry.resource)), 0);
  const costLabel = [deviceCost > 0 ? `${deviceCost} PP` : '', resourceCost > 0 ? `${resourceCost} EP` : ''].filter(Boolean).join(' · ') || '0 EP';

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">
        Devices &amp; Resources
        <span class="section-cost">${costLabel}</span>
      </div>
      <div class="equipment-list">
        ${equipmentHtml}
        ${legacyEquipment.map((item) => renderLegacyEquipmentEntry(item, powerDefs, modifierDefs)).join('')}
        ${linkedResources.map((entry) => renderResourceEntry(entry.resource, entry.isFree, entry.contributionEP, powerDefs, modifierDefs)).join('')}
        ${character.equipmentNotes?.trim() ? `<div class="power-description">${escapeHtml(character.equipmentNotes)}</div>` : ''}
      </div>
    </div>
  `.trim();
}

function renderResourceEntry(resource: IResource, isFree: boolean, contributionEP: number | undefined, powerDefs: IPowerEffect[], modifierDefs: IModifierDef[]): string {
  const cost = isFree ? 0 : contributionEP ?? getResourceEPCost(resource);
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
  const effects = buildEffectsString(power, powerDefs);
  const modifiers = power.components.flatMap((component) => component.modifiers).map((modifier) => {
    const definition = modifierDefs.find((item) => item.id === modifier.modifierId);
    return `${definition?.name ?? modifier.modifierId}${modifier.ranks !== 1 ? ` ${modifier.ranks}` : ''}${modifier.option ? ` (${modifier.option})` : ''}`;
  });
  const alternates = power.alternateEffects.map((alternate) => alternate.name || buildEffectsString({ ...power, components: alternate.components }, powerDefs));
  return [power.name, effects, modifiers.length > 0 ? `Modifiers: ${modifiers.join(', ')}` : '', alternates.length > 0 ? `Alternates: ${alternates.join(', ')}` : '', power.notes].filter(Boolean).join(' — ');
}

function renderLegacyEquipmentEntry(item: ICharacter['powers'][0], powerDefs: IPowerEffect[], modifierDefs: IModifierDef[]): string {
  return `<div class="equipment-entry"><div class="power-header"><div class="power-name">${escapeHtml(item.name || 'Unnamed Equipment')} <span class="text-muted">(Equipment)</span></div><div class="power-cost">${calcEquipmentEPCost(item, powerDefs, modifierDefs)} EP</div></div><div class="power-effects">${escapeHtml(formatPower(item, powerDefs, modifierDefs))}</div></div>`;
}

/**
 * Render a single equipment entry
 */
function renderEquipmentEntry(
  item: ICharacter['powers'][0],
  powerDefs: IPowerEffect[],
  modifierDefs: IModifierDef[]
): string {
  const totalCost = calcPowerTotalCost(item, powerDefs, modifierDefs);
  
  // Build effects string
  const effects = buildEffectsString(item, powerDefs);
  
  // Build descriptors string
  const descriptors = item.descriptors && item.descriptors.length > 0
    ? item.descriptors.join(', ')
    : '';

  return `
    <div class="equipment-entry">
      <div class="power-header">
        <div class="power-name">${escapeHtml(item.name || 'Unnamed Equipment')}</div>
        <div class="power-cost">${totalCost} PP</div>
      </div>
      ${effects ? `<div class="power-effects">${effects}</div>` : ''}
      ${descriptors ? `<div class="power-description text-small">${escapeHtml(descriptors)}</div>` : ''}
    </div>
  `;
}

/**
 * Build effects string from power components
 */
function buildEffectsString(power: ICharacter['powers'][0], powerDefs: IPowerEffect[]): string {
  if (!power.components || power.components.length === 0) {
    return '';
  }

  const effectStrings = power.components.map(comp => {
    const effectDef = powerDefs.find(d => d.id === comp.effectId);
    const effectName = effectDef?.name || comp.effectId;
    const parts: string[] = [effectName];
    
    if (comp.ranks && comp.ranks > 0) {
      parts.push(String(comp.ranks));
    }
    
    return parts.join(' ');
  });

  return escapeHtml(effectStrings.join(', '));
}
