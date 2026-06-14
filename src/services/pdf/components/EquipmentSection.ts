/* ================================================
   Equipment Section Component
   Powers marked as removable equipment
   ================================================ */

import type { ICharacter, IPowerEffect, IModifierDef } from '../../../entities/types';
import { escapeHtml } from './utils';
import { calcPowerTotalCost } from '../../../shared/lib/mathEngine';

export interface EquipmentSectionData {
  character: ICharacter;
  powerDefs: IPowerEffect[];
  modifierDefs: IModifierDef[];
}

/**
 * Render the equipment section
 */
export function renderEquipmentSection(data: EquipmentSectionData): string {
  const { character, powerDefs, modifierDefs } = data;
  
  // Filter equipment (powers with removable flag)
  const equipment = character.powers.filter(p => 
    p.removable === 'removable' || p.removable === 'easily_removable'
  );

  if (equipment.length === 0) {
    return ''; // No section if no equipment
  }

  const equipmentHtml = equipment
    .map(item => renderEquipmentEntry(item, powerDefs, modifierDefs))
    .join('');

  const totalCost = equipment.reduce((sum, item) => 
    sum + calcPowerTotalCost(item, powerDefs, modifierDefs), 0
  );

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">
        Equipment
        <span class="section-cost">${totalCost} PP</span>
      </div>
      <div class="equipment-list">
        ${equipmentHtml}
      </div>
    </div>
  `.trim();
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
