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
        <div class="pdf-section-title">Offense</div>
        <p class="text-muted">No offense entries defined.</p>
      </div>
    `.trim();
  }

  const rowsHtml = offenseEntries.map(entry => renderOffenseRow(entry)).join('');

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">Offense</div>
      <div class="offense-container">
        <div class="offense-header">
          <div class="offense-col offense-col-attack">Attack</div>
          <div class="offense-col offense-col-bonus">Bonus</div>
          <div class="offense-col offense-col-range">Range</div>
          <div class="offense-col offense-col-effect">Effect</div>
          <div class="offense-col offense-col-notes">Notes</div>
        </div>
        <div class="offense-body">
          ${rowsHtml}
        </div>
      </div>
    </div>
  `.trim();
}

/**
 * Render a single offense row
 */
function renderOffenseRow(entry: IOffenseEntry): string {
  return `
    <div class="offense-row">
      <div class="offense-col offense-col-attack">${escapeHtml(entry.name)}</div>
      <div class="offense-col offense-col-bonus">${escapeHtml(entry.bonus)}</div>
      <div class="offense-col offense-col-range">${escapeHtml(entry.range)}</div>
      <div class="offense-col offense-col-effect">${escapeHtml(entry.effect)}</div>
      <div class="offense-col offense-col-notes">${escapeHtml(entry.notes || '')}</div>
    </div>
  `;
}
