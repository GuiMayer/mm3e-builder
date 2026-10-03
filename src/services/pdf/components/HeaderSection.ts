import { englishPDFLabels, type PDFLabels } from '../pdfMessages';
/* ================================================
   Header Section Component
   Character identity, basic info, and key stats
   ================================================ */

import type { ICharacter } from '../../../entities/types';
import { escapeHtml, isPresent } from './utils';
import { writingLine } from './worksheet';

export interface HeaderSectionData {
  portraitDataUrl?: string;
  labels?: PDFLabels;
  worksheet?: boolean;
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
  const labels = data.labels ?? englishPDFLabels;
  const { character, powerPointsData } = data;
  const { header } = character;
  const fit = header.portraitFit === 'fill' || header.portraitFit === 'cover' ? header.portraitFit : 'contain';
  const portrait = data.portraitDataUrl && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(data.portraitDataUrl)
    ? `<img class="pdf-portrait" src="${escapeHtml(data.portraitDataUrl)}" alt="${escapeHtml(header.name)}" style="object-fit:${fit};object-position:center" />` : '';

  const identity = header.identity ? `${header.identity}${header.identityType ? ` (${labels(header.identityType)})` : ''}` : '';
  const details = [['Gender', header.gender], ['Age', header.age], ['Height', header.height], ['Weight', header.weight], ['Eyes', header.eyes], ['Hair', header.hair], ['Group Affiliation', header.groupAffiliation], ['Series', header.series], ['Game Master', header.gameMaster]];
  if (data.worksheet) {
    const fields = [['Player', header.player], ['Identity', header.identity], ['Identity Type', header.identityType ? labels(header.identityType) : ''], ['Base of Operations', header.base], ...details, ['Campaign Adjustment', String(powerPointsData.ppEarned)]];
    return wrapHeader(`<div class="header-main"><div class="character-name">${isPresent(header.name) ? escapeHtml(header.name) : writingLine(labels('Name'))}</div><div class="header-stats">${labels('PL')} ${header.powerLevel} · ${labels('Hero Points')} ${header.heroPoints}</div></div><div class="pdf-writing-header">${fields.map(([label, value]) => writingLine(labels(label!), value)).join('')}</div>${renderPowerPointsSummaryCompact(powerPointsData, labels)}`, portrait);
  }
  return wrapHeader(`<div class="header-main"><div class="character-name">${escapeHtml(header.name || labels('Unnamed Hero'))}</div><div class="header-stats">${labels('PL')} ${header.powerLevel} · ${labels('Hero Points')} ${header.heroPoints}</div></div><div class="header-fields">${renderHeaderField(labels('Player'), header.player)}${renderHeaderField(labels('Identity'), identity)}${renderHeaderField(labels('Base of Operations'), header.base)}</div><div class="header-details">${details.map(([label, value]) => renderHeaderField(labels(label!), value)).join('')}</div>${renderPowerPointsSummaryCompact(powerPointsData, labels)}`, portrait);
}

/** Keep the optional portrait beside the entire identity and points block. */
function wrapHeader(content: string, portrait: string): string {
  return portrait
    ? `<div class="pdf-header pdf-header--portrait"><div class="pdf-portrait-frame">${portrait}</div><div class="pdf-header-content">${content}</div></div>`
    : `<div class="pdf-header">${content}</div>`;
}

/**
 * Render compact power points summary
 */
function renderPowerPointsSummaryCompact(ppData: HeaderSectionData['powerPointsData'], labels: PDFLabels): string {
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

  return `<div class="pp-summary-compact"><strong>${totalSpent} / ${totalAvailable} PP · ${labels('Points Remaining')} ${remaining}${remaining < 0 ? ` · ${labels('Over Budget!')}` : ''}</strong><span>${labels('Abilities')} ${abilitiesCost} · ${labels('Defenses')} ${defensesCost} · ${labels('Skills')} ${skillsCost} · ${labels('Advantages')} ${advantagesCost} · ${labels('Powers')} ${powersCost}${ppEarned !== 0 ? ` · ${labels('Campaign Adjustment')} ${ppEarned}` : ''}</span></div>`;
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

