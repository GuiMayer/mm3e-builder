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
      <table class="offense-table">
        <thead>
          <tr>
            <th style="width: 25%;">Attack</th>
            <th style="width: 10%;">Bonus</th>
            <th style="width: 15%;">Range</th>
            <th style="width: 25%;">Effect</th>
            <th style="width: 25%;">Notes</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `.trim();
}

/**
 * Render a single offense row
 */
function renderOffenseRow(entry: IOffenseEntry): string {
  return `
    <tr class="offense-row">
      <td class="offense-name">${escapeHtml(entry.name)}</td>
      <td class="offense-bonus">${escapeHtml(entry.bonus)}</td>
      <td class="offense-range">${escapeHtml(entry.range)}</td>
      <td>${escapeHtml(entry.effect)}</td>
      <td class="text-small">${escapeHtml(entry.notes || '')}</td>
    </tr>
  `;
}
