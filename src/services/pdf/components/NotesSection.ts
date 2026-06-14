/* ================================================
   Notes Section Component
   Character notes and background information
   ================================================ */

import type { ICharacter } from '../../../entities/types';
import { nl2br } from './utils';

export interface NotesSectionData {
  character: ICharacter;
}

/**
 * Render the notes section
 */
export function renderNotesSection(data: NotesSectionData): string {
  const { character } = data;
  const { notes } = character;

  if (!notes || notes.trim().length === 0) {
    return ''; // No section if no notes
  }

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">Notes</div>
      <div class="notes-section">
        ${nl2br(notes)}
      </div>
    </div>
  `.trim();
}
