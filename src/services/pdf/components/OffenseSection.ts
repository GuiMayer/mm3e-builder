import { englishPDFLabels, type PDFLabels } from '../pdfMessages';
/* ================================================
   Offense Section Component
   Attack table with name, bonus, range, effect, notes
   ================================================ */

import type { IOffenseEntry } from '../../../shared/lib/offenseSummary';
import { escapeHtml } from './utils';

export interface OffenseSectionData {
  labels?: PDFLabels;
  worksheet?: boolean;
  offenseEntries: IOffenseEntry[];
}

/**
 * Render the offense section
 */
export function renderOffenseSection(data: OffenseSectionData): string {
  const labels = data.labels ?? englishPDFLabels;
  const { offenseEntries } = data;

  if (offenseEntries.length === 0 && !data.worksheet) {
    return `
      <div class="pdf-section">
        <div class="pdf-section-title">${labels('Targeted Effects')}</div>
        <p class="text-muted">${labels('No offense entries defined.')}</p>
      </div>
    `.trim();
  }

  const rowsHtml = offenseEntries.map(entry => renderOffenseRow(entry, labels)).join('') + (data.worksheet ? '<tr class="pdf-writing-row"><td></td><td></td><td></td><td></td><td></td></tr>'.repeat(Math.max(1, 4 - offenseEntries.length)) : '');

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">${labels('Targeted Effects')}</div>
      <table class="offense-table"><thead><tr><th>${labels('Attack')}</th><th>${labels('Bonus')}</th><th>${labels('Range')}</th><th>${labels('Effect')}</th><th>${labels('Notes')}</th></tr></thead><tbody>${rowsHtml}</tbody></table>
    </div>
  `.trim();
}

/**
 * Render a single offense row
 */
function renderOffenseRow(entry: IOffenseEntry, labels: PDFLabels): string {
  const notes = [
    entry.resistance?.replace(/\b(Toughness|Fortitude|Will|Dodge|Parry|DC)\b/g, labels),
    entry.relationship === 'alternate' ? labels('Alternate Effect') : entry.relationship === 'dynamic-alternate' ? labels('Dynamic Alternate Effect') : '',
    entry.sourceType === 'resource' ? labels('Resource') : entry.sourceType === 'equipment' ? labels('Equipment') : '',
    entry.tags.map(labels).join(', '),
    entry.notes,
  ].filter(Boolean).join(' · ');
  return `
    <tr><td>${escapeHtml(entry.name)}</td>
      <td>${escapeHtml(entry.bonus)}</td>
      <td>${escapeHtml(labels(entry.range))}</td>
      <td>${escapeHtml(entry.effect)}</td>
      <td>${escapeHtml(notes)}</td></tr>
  `;
}
