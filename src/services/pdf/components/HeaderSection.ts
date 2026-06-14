/* ================================================
   Header Section Component
   Character identity, basic info, and key stats
   ================================================ */

import type { ICharacter } from '../../../entities/types';
import { escapeHtml, isPresent } from './utils';

export interface HeaderSectionData {
  character: ICharacter;
  powerPointsData: {
    totalAvailable: number;
    totalSpent: number;
    remaining: number;
  };
}

/**
 * Render the character header section
 */
export function renderHeaderSection(data: HeaderSectionData): string {
  const { character, powerPointsData } = data;
  const { header } = character;

  return `
    <div class="header-section character-name-running">
      <div class="header-main">
        <div class="character-name">${escapeHtml(header.name || 'Unnamed Hero')}</div>
        
        ${renderHeaderField('Player', header.player)}
        ${renderHeaderField('Identity', header.identity)}
        ${renderHeaderField('Base of Operations', header.base)}
      </div>
      
      <div class="header-stats">
        ${renderStatBox('Power Level', header.powerLevel || 10)}
        ${renderStatBox('Hero Points', header.heroPoints || 0)}
        ${renderStatBox('PP Available', powerPointsData.totalAvailable)}
        ${renderStatBox('PP Remaining', powerPointsData.remaining, powerPointsData.remaining < 0)}
      </div>
    </div>
    
    ${renderPhysicalDescription(header)}
    
    ${renderAdditionalInfo(header)}
  `.trim();
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

/**
 * Render a stat box (for PL, Hero Points, etc.)
 */
function renderStatBox(label: string, value: number, highlight: boolean = false): string {
  const className = highlight ? 'stat-box highlight-box' : 'stat-box';
  
  return `
    <div class="${className}">
      <div class="stat-box-label">${escapeHtml(label)}</div>
      <div class="stat-box-value">${value}</div>
    </div>
  `;
}

/**
 * Render physical description grid
 */
function renderPhysicalDescription(header: ICharacter['header']): string {
  const fields = [
    { label: 'Gender', value: header.gender },
    { label: 'Age', value: header.age },
    { label: 'Height', value: header.height },
    { label: 'Weight', value: header.weight },
    { label: 'Eyes', value: header.eyes },
    { label: 'Hair', value: header.hair },
  ];
  
  const hasAnyField = fields.some(f => isPresent(f.value));
  if (!hasAnyField) return '';
  
  const fieldsHtml = fields
    .filter(f => isPresent(f.value))
    .map(f => `
      <div class="description-field">
        <span class="description-label">${escapeHtml(f.label)}:</span>
        <span class="description-value">${escapeHtml(f.value)}</span>
      </div>
    `)
    .join('');
  
  return `
    <div class="pdf-subsection">
      <div class="pdf-subsection-title">Physical Description</div>
      <div class="physical-description">
        ${fieldsHtml}
      </div>
    </div>
  `;
}

/**
 * Render additional info (affiliation, series, GM)
 */
function renderAdditionalInfo(header: ICharacter['header']): string {
  const fields = [
    { label: 'Group Affiliation', value: header.groupAffiliation },
    { label: 'Series', value: header.series },
    { label: 'Game Master', value: header.gameMaster },
  ];
  
  const hasAnyField = fields.some(f => isPresent(f.value));
  if (!hasAnyField) return '';
  
  const fieldsHtml = fields
    .filter(f => isPresent(f.value))
    .map(f => renderHeaderField(f.label, f.value))
    .join('');
  
  return `
    <div class="pdf-subsection">
      ${fieldsHtml}
    </div>
  `;
}
