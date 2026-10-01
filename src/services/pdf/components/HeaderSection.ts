/* ================================================
   Header Section Component
   Character identity, basic info, and key stats
   ================================================ */

import type { ICharacter } from '../../../entities/types';
import { escapeHtml, isPresent } from './utils';

export interface HeaderSectionData {
  character: ICharacter;
  powerPointsData: {
    abilitiesCost: number;
    defensesCost: number;
    skillsCost: number;
    advantagesCost: number;
    powersCost: number;
    totalAvailable: number;
    totalSpent: number;
    remaining: number;
    ppEarned: number;
  };
}

/**
 * Render the character header section
 */
export function renderHeaderSection(data: HeaderSectionData): string {
  const { character, powerPointsData } = data;
  const { header } = character;

  const identity = header.identity ? `${header.identity}${header.identityType ? ` (${header.identityType})` : ''}` : '';
  const details = [['Gender', header.gender], ['Age', header.age], ['Height', header.height], ['Weight', header.weight], ['Eyes', header.eyes], ['Hair', header.hair], ['Group Affiliation', header.groupAffiliation], ['Series', header.series], ['Game Master', header.gameMaster]];
  return `<div class="pdf-header"><div class="header-main"><div class="character-name">${escapeHtml(header.name || 'Unnamed Hero')}</div><div class="header-stats">PL ${header.powerLevel} · Hero Points ${header.heroPoints}</div></div><div class="header-fields">${renderHeaderField('Player', header.player)}${renderHeaderField('Identity', identity)}${renderHeaderField('Base of Operations', header.base)}</div><div class="header-details">${details.map(([label, value]) => renderHeaderField(label!, value)).join('')}</div>${renderPowerPointsSummaryCompact(powerPointsData)}</div>`;
}

/**
 * Render compact power points summary
 */
function renderPowerPointsSummaryCompact(ppData: HeaderSectionData['powerPointsData']): string {
  const {
    abilitiesCost,
    defensesCost,
    skillsCost,
    advantagesCost,
    powersCost,
    totalAvailable,
    totalSpent,
    remaining,
    ppEarned,
  } = ppData;

  return `<div class="pp-summary-compact"><strong>${totalSpent} / ${totalAvailable} PP · Points Remaining ${remaining}${remaining < 0 ? ' · Over Budget!' : ''}</strong><span>Abilities ${abilitiesCost} · Defenses ${defensesCost} · Skills ${skillsCost} · Advantages ${advantagesCost} · Powers ${powersCost}${ppEarned !== 0 ? ` · Campaign Adjustment ${ppEarned}` : ''}</span></div>`;
}

/**
 * Render a single header field (label + value)
 */
function renderHeaderField(label: string, value: string | undefined): string {
  if (!isPresent(value)) return '';
  
  return `
    <div class="header-field">
      <span class="header-field-label">${escapeHtml(label)}:</span>
      <span class="header-field-value">${escapeHtml(value)}</span>
    </div>
  `;
}

