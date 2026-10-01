import { englishPDFLabels, type PDFLabels } from '../pdfMessages';
/* ================================================
   Notes Section Component
   Character notes and background information
   ================================================ */

import type { ICharacter } from '../../../entities/types';
import { nl2br } from './utils';
import { writingLines } from './worksheet';

export interface NotesSectionData {
  labels?: PDFLabels;
  worksheet?: boolean;
  character: ICharacter;
}

/**
 * Render the notes section
 */
export function renderNotesSection(data: NotesSectionData): string {
  const labels = data.labels ?? englishPDFLabels;
  const { character } = data;
  const { notes } = character;

  if ((!notes || notes.trim().length === 0) && !data.worksheet) {
    return ''; // No section if no notes
  }

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">${labels('Notes')}</div>
      <div class="notes-section">
        ${(notes || '').trim() ? (notes || '').split(/\n\s*\n/).map(paragraph => `<p class="pdf-flow-line">${nl2br(paragraph)}</p>`).join('') : ''}
        ${data.worksheet ? writingLines(4) : ''}
      </div>
    </div>
  `.trim();
}
