import type { PDFLabels } from '../pdfMessages';
import { escapeHtml } from './utils';

/** Presentation-only placeholders. No character records are created or saved. */
export function writingLine(label = '', value = ''): string {
  return `<div class="pdf-writing-line">${label ? `<span class="pdf-writing-label">${escapeHtml(label)}:</span>` : ''}<span class="pdf-writing-value">${escapeHtml(value)}</span></div>`;
}

export function writingLines(count: number): string {
  return Array.from({ length: count }, () => writingLine()).join('');
}

export function blankPower(labels: PDFLabels, className = 'power-entry'): string {
  return `<div class="${className}"><div class="pdf-writing-pair">${writingLine(labels('Name'))}${writingLine(labels('Cost'))}</div><div class="pdf-writing-pair">${writingLine(labels('Effect'))}${writingLine(labels('ranks'))}</div>${writingLine(`${labels('Modifiers')} / ${labels('Descriptors')}`)}${writingLine(labels('Notes'))}</div>`;
}
