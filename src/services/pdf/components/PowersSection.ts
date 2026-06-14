/* ================================================
   Powers Section Component
   List of powers with effects and modifiers
   ================================================ */

import type { ICharacter, IPowerEffect, IModifierDef, IAppliedModifier } from '../../../entities/types';
import { escapeHtml } from './utils';
import { calcPowerTotalCost } from '../../../shared/lib/mathEngine';

export interface PowersSectionData {
  character: ICharacter;
  powerDefs: IPowerEffect[];
  modifierDefs: IModifierDef[];
  powersCost: number;
}

/**
 * Render the powers section
 */
export function renderPowersSection(data: PowersSectionData): string {
  const { character, powerDefs, modifierDefs, powersCost } = data;
  
  // Filter out equipment (removable powers)
  const powers = character.powers.filter(p => 
    !p.removable || p.removable === 'none'
  );

  if (powers.length === 0) {
    return `
      <div class="pdf-section">
        <div class="pdf-section-title">Powers</div>
        <p class="text-muted">No powers defined.</p>
      </div>
    `.trim();
  }

  const powersHtml = powers
    .map(power => renderPowerEntry(power, powerDefs, modifierDefs))
    .join('');

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">
        Powers
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
  modifierDefs: IModifierDef[]
): string {
  const totalCost = calcPowerTotalCost(power, powerDefs, modifierDefs);
  
  // Build effects string
  const effects = buildEffectsString(power, powerDefs);
  
  // Build modifiers string
  const modifiers = buildModifiersString(power, modifierDefs);
  
  // Build descriptors string
  const descriptors = power.descriptors && power.descriptors.length > 0
    ? power.descriptors.join(', ')
    : '';

  return `
    <div class="power-entry">
      <div class="power-header">
        <div class="power-name">${escapeHtml(power.name || 'Unnamed Power')}</div>
        <div class="power-cost">${totalCost} PP</div>
      </div>
      ${effects ? `<div class="power-effects">${effects}</div>` : ''}
      ${modifiers ? `<div class="power-modifiers">${modifiers}</div>` : ''}
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
    
    // Ranks
    if (comp.ranks && comp.ranks > 0) {
      parts.push(String(comp.ranks));
    }
    
    return parts.join(' ');
  });

  return escapeHtml(effectStrings.join(', '));
}

/**
 * Build modifiers string
 */
function buildModifiersString(power: ICharacter['powers'][0], modifierDefs: IModifierDef[]): string {
  // Collect all modifiers from all components
  const allModifiers: IAppliedModifier[] = [];
  
  power.components.forEach(comp => {
    if (comp.modifiers && comp.modifiers.length > 0) {
      allModifiers.push(...comp.modifiers);
    }
  });

  if (allModifiers.length === 0) {
    return '';
  }

  const modifierStrings = allModifiers.map(mod => {
    const modDef = modifierDefs.find(d => d.id === mod.modifierId);
    const modName = modDef?.name || mod.modifierId;
    const parts: string[] = [modName];
    
    if (mod.ranks && mod.ranks !== 1) {
      parts.push(String(mod.ranks));
    }
    
    return escapeHtml(parts.join(' '));
  });

  return `Modifiers: ${modifierStrings.join(', ')}`;
}
