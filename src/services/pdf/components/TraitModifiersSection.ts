import type { ICharacter, IResource } from '../../../entities/types';
import { resolveTraitState } from '../../../shared/lib/traitValues';
import { traitTargetKey } from '../../../shared/lib/traitTargets';
import { escapeHtml, formatBonus } from './utils';
import type { PDFLabels } from '../pdfMessages';

export function renderTraitModifiersSection(character: ICharacter, resources: IResource[], labels: PDFLabels): string {
  const state = resolveTraitState(character, resources);
  const rows = [
    ...state.contributions.map(item => `${item.key} ${formatBonus(item.ranks)} · ${item.name}`),
    ...(character.traitModifiers ?? []).map(item => `${traitTargetKey(item.target)} ${formatBonus(item.value)} · ${item.source || labels('Circumstance')} · ${labels(item.scope === 'check' ? 'Check only' : 'Active defense')} · ${labels(item.active ? 'Active' : 'Inactive')}`),
  ];
  return rows.length ? `<div class="pdf-section"><div class="pdf-section-title">${labels('Trait modifiers')}</div><p class="text-muted">${labels('Purchased ranks retain their original cost. Circumstance modifiers apply only in the stated situation.')}</p>${rows.map(row => `<div>${escapeHtml(row)}</div>`).join('')}</div>` : '';
}
