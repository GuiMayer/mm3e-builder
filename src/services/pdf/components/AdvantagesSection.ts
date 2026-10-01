import { englishPDFLabels, type PDFLabels } from '../pdfMessages';
/* ================================================
   Advantages Section Component
   List of advantages with optional ranks
   ================================================ */

import type { ICharacter } from '../../../entities/types';
import type { IAdvantageDef } from '../../../entities/types';
import { escapeHtml } from './utils';

export interface AdvantagesSectionData {
  labels?: PDFLabels;
  worksheet?: boolean;
  character: ICharacter;
  advantageDefs: Record<string, IAdvantageDef>;
  advantagesCost: number;
}

/**
 * Render the advantages section
 */
export function renderAdvantagesSection(data: AdvantagesSectionData): string {
  const labels = data.labels ?? englishPDFLabels;
  const { character, advantageDefs, advantagesCost } = data;
  const { advantages } = character;

  if (advantages.length === 0 && !data.worksheet) {
    return `
      <div class="pdf-section">
        <div class="pdf-section-title">${labels('Advantages')}</div>
        <p class="text-muted">${labels('No advantages selected.')}</p>
      </div>
    `.trim();
  }

  // Sort advantages alphabetically by advantage definition name
  const sortedAdvantages = [...advantages].sort((a, b) => {
    const nameA = advantageDefs[a.advantageId]?.name || a.advantageId;
    const nameB = advantageDefs[b.advantageId]?.name || b.advantageId;
    return nameA.localeCompare(nameB);
  });

  const advantagesHtml = sortedAdvantages
    .map(adv => renderAdvantageEntry(adv, advantageDefs, !!data.worksheet))
    .join('') + (data.worksheet ? Array.from({ length: Math.max(2, 8 - advantages.length) }, () => '<div class="advantage-entry"><span class="advantage-name"></span><span class="advantage-rank"><span class="pdf-inline-blank short"></span></span></div>').join('') : '');

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">
        ${labels('Advantages')}
        <span class="section-cost">${advantagesCost} PP</span>
      </div>
      <div class="advantages-list">
        ${data.worksheet ? `<div class="pdf-list-heading"><span class="advantage-name">${labels('Name')}</span><span class="advantage-rank">${labels('ranks')}</span></div>` : ''}
        ${advantagesHtml}
      </div>
    </div>
  `.trim();
}

/**
 * Render a single advantage entry
 */
function renderAdvantageEntry(
  advantage: ICharacter['advantages'][0],
  advantageDefs: Record<string, IAdvantageDef>,
  worksheet = false
): string {
  const advantageDef = advantageDefs[advantage.advantageId];
  const advantageName = advantageDef?.name || advantage.advantageId;
  const isRanked = advantageDef?.ranked || false;
  const ranks = advantage.ranks || 1;
  
  // Add subtype if present
  const displayName = advantage.subtype ? `${advantageName} (${advantage.subtype})` : advantageName;

  return `
    <div class="advantage-entry">
      <span class="advantage-name">${escapeHtml(displayName)}</span>
      ${worksheet || (isRanked && ranks > 1) ? `<span class="advantage-rank">${ranks}</span>` : ''}
    </div>
  `;
}
