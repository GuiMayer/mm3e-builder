/* ================================================
   Advantages Section Component
   List of advantages with optional ranks
   ================================================ */

import type { ICharacter } from '../../../entities/types';
import type { IAdvantageDef } from '../../../entities/types';
import { escapeHtml } from './utils';

export interface AdvantagesSectionData {
  character: ICharacter;
  advantageDefs: Record<string, IAdvantageDef>;
  advantagesCost: number;
}

/**
 * Render the advantages section
 */
export function renderAdvantagesSection(data: AdvantagesSectionData): string {
  const { character, advantageDefs, advantagesCost } = data;
  const { advantages } = character;

  if (advantages.length === 0) {
    return `
      <div class="pdf-section">
        <div class="pdf-section-title">Advantages</div>
        <p class="text-muted">No advantages selected.</p>
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
    .map(adv => renderAdvantageEntry(adv, advantageDefs))
    .join('');

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">Advantages</div>
      <div class="advantages-list">
        ${advantagesHtml}
      </div>
      <div class="text-right text-bold">
        Total Cost: ${advantagesCost} PP
      </div>
    </div>
  `.trim();
}

/**
 * Render a single advantage entry
 */
function renderAdvantageEntry(
  advantage: ICharacter['advantages'][0],
  advantageDefs: Record<string, IAdvantageDef>
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
      ${isRanked && ranks > 1 ? `<span class="advantage-rank">${ranks}</span>` : ''}
    </div>
  `;
}
