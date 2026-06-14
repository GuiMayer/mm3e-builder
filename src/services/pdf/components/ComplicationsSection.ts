/* ================================================
   Complications Section Component
   List of character complications
   ================================================ */

import type { ICharacter, IComplication } from '../../../entities/types';
import { escapeHtml } from './utils';

export interface ComplicationsSectionData {
  character: ICharacter;
}

/**
 * Render the complications section
 */
export function renderComplicationsSection(data: ComplicationsSectionData): string {
  const { character } = data;
  const { complications } = character;

  if (complications.length === 0) {
    return `
      <div class="pdf-section">
        <div class="pdf-section-title">Complications</div>
        <p class="text-muted">No complications defined.</p>
      </div>
    `.trim();
  }

  const complicationsHtml = complications
    .map(comp => renderComplicationItem(comp))
    .join('');

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">Complications</div>
      <div class="complications-list">
        ${complicationsHtml}
      </div>
    </div>
  `.trim();
}

/**
 * Render a single complication item
 */
function renderComplicationItem(complication: IComplication): string {
  const displayText = complication.description 
    ? `${complication.title}: ${complication.description}` 
    : complication.title;
    
  return `
    <div class="complication-item">
      <span class="complication-name">${escapeHtml(displayText)}</span>
    </div>
  `;
}
