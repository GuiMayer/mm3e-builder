/* ================================================
   Equipment Section Component
   Powers marked as removable equipment
   ================================================ */

import type { ICharacter, IPowerEffect, IModifierDef, IResource } from '../../../entities/types';
import { escapeHtml } from './utils';
import { calcPowerTotalCost } from '../../../shared/lib/mathEngine';
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
    return resource ? [{ resource, isFree: link.isFree }] : [];
  });

  if (equipment.length === 0 && linkedResources.length === 0) {
    return ''; // No section if no equipment
  }

  const equipmentHtml = equipment
    .map(item => renderEquipmentEntry(item, powerDefs, modifierDefs))
    .join('');

  const totalCost = equipment.reduce((sum, item) => 
    sum + calcPowerTotalCost(item, powerDefs, modifierDefs), 0
  ) + linkedResources.reduce((sum, entry) => sum + (entry.isFree ? 0 : getResourceEPCost(entry.resource)), 0);

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">
        Equipment
        <span class="section-cost">${totalCost} PP</span>
      </div>
      <div class="equipment-list">
        ${equipmentHtml}
        ${linkedResources.map((entry) => renderResourceEntry(entry.resource, entry.isFree)).join('')}
      </div>
    </div>
  `.trim();
}

function renderResourceEntry(resource: IResource, isFree: boolean): string {
  const cost = isFree ? 0 : getResourceEPCost(resource);
  const traits = resource.type === 'vehicle'
    ? `${resource.size}; STR ${resource.strength}; Speed ${resource.speed}; Defense ${resource.defense}; Toughness ${resource.toughness}`
    : resource.type === 'headquarters'
      ? `${resource.size}; Toughness ${resource.toughness}`
      : resource.power.components.map((component) => component.effectId).filter(Boolean).join(', ');
  return `<div class="equipment-entry"><div class="power-header"><div class="power-name">${escapeHtml(resource.name || 'Unnamed Resource')}</div><div class="power-cost">${cost} EP${isFree ? ' (Free)' : ''}</div></div><div class="power-effects">${escapeHtml(traits)}</div>${resource.notes ? `<div class="power-description text-small">${escapeHtml(resource.notes)}</div>` : ''}</div>`;
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
