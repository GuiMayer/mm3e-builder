import type { ICharacter } from '../../../entities/types';
import { campaignInitialPP } from '../../../shared/lib/campaign';
import type { CharacterPointSummary } from '../../../shared/lib/pointSummary';
import type { PDFLabels } from '../pdfMessages';
import { escapeHtml } from './utils';

export function renderCampaignSection(character: ICharacter, summary: Pick<CharacterPointSummary, 'totalAvailable' | 'remaining'>, labels: PDFLabels): string {
  if (!character.campaignMode && !character.campaign && !character.ppLog?.length) return '';
  let running = campaignInitialPP(character);
  const rows = (character.ppLog ?? []).map(entry => {
    running += entry.amount;
    return `<tr><td>${escapeHtml(entry.date)}</td><td>${escapeHtml(entry.session ?? '')}</td><td>${escapeHtml(entry.note).replace(/\r?\n/g, '<br>')}</td><td>${entry.amount > 0 ? '+' : ''}${entry.amount}</td><td>${running}</td></tr>`;
  }).join('');
  return `<div class="pdf-section pdf-campaign-section">
    <div class="pdf-section-title">${labels('Campaign History')}</div>
    <p>${labels(character.campaignMode ? 'Campaign active' : 'Campaign disabled')} · ${labels('Starting PP')}: ${campaignInitialPP(character)} · ${labels('Available PP')}: ${summary.totalAvailable} · ${labels('Points Remaining')}: ${summary.remaining}</p>
    <table class="offense-table"><thead><tr><th>${labels('Date')}</th><th>${labels('Session')}</th><th>${labels('Notes')}</th><th>${labels('Amount')}</th><th>${labels('PP after entry')}</th></tr></thead><tbody>${rows}</tbody></table>
  </div>`;
}
