/* ================================================
   Offense Section Component
   Attack table with name, bonus, range, effect, notes
   ================================================ */

import type { IOffenseEntry } from '../../../shared/lib/offenseSummary';
import { escapeHtml } from './utils';

export interface OffenseSectionData {
  offenseEntries: IOffenseEntry[];
}

/**
 * Render the offense section
 */
export function renderOffenseSection(data: OffenseSectionData): string {
  const { offenseEntries } = data;

  if (offenseEntries.length === 0) {
    return `
      <div class="pdf-section">
        <div class="pdf-section-title">Targeted Effects</div>
        <p class="text-muted">No offense entries defined.</p>
      </div>
    `.trim();
  }

  const rowsHtml = offenseEntries.map(entry => renderOffenseRow(entry)).join('');

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">Targeted Effects</div>
      <table class="offense-table"><thead><tr><th>Attack</th><th>Bonus</th><th>Range</th><th>Effect</th><th>Notes</th></tr></thead><tbody>${rowsHtml}</tbody></table>
    </div>
  `.trim();
}

/**
 * Render a single offense row
 */
function renderOffenseRow(entry: IOffenseEntry): string {
  const notes = [
    entry.resistance,
    entry.relationship === 'alternate' ? 'Alternate Effect' : entry.relationship === 'dynamic-alternate' ? 'Dynamic Alternate Effect' : '',
    entry.sourceType === 'resource' ? 'Resource' : entry.sourceType === 'equipment' ? 'Equipment' : '',
    entry.tags.join(', '),
    entry.notes,
  ].filter(Boolean).join(' · ');
  return `
    <tr><td>${escapeHtml(entry.name)}</td>
      <td>${escapeHtml(entry.bonus)}</td>
      <td>${escapeHtml(entry.range)}</td>
      <td>${escapeHtml(entry.effect)}</td>
      <td>${escapeHtml(notes)}</td></tr>
  `;
}
