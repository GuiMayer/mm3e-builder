import { englishPDFLabels, type PDFLabels } from '../pdfMessages';
import { SENSE_TRAITS } from '../../../data/senseTraits';
import type { ICharacterPower, ICharacterPowerComponent, IPowerEffect, IModifierDef } from '../../../entities/types';
import { resolveModifierDefinition } from '../../../shared/lib/rulesCatalog';
import { escapeHtml, nl2br } from './utils';

/** Display-only formatter. Each modifier stays attached to its own Linked component. */
export function formatComponentDetails(component: ICharacterPowerComponent, powerDefs: IPowerEffect[], modifierDefs: IModifierDef[], labels: PDFLabels = englishPDFLabels): string {
  const effect = powerDefs.find(definition => definition.id === component.effectId);
  const fields = Object.entries(component.fieldValues ?? {}).map(([key, value]) => {
    const field = effect?.configurableFields?.find(item => item.id === key);
    const values = (Array.isArray(value) ? value : [value]).map(item => field?.options?.find(option => option.value === item)?.label ?? item);
    return `${field?.label ?? key}: ${values.join(', ')}`;
  });
  const senses = component.senseTraits?.map(trait => [labels(SENSE_TRAITS.find(def => def.id === trait.id)?.label ?? trait.id), trait.ranks > 1 ? trait.ranks : '', trait.senseType ? labels(trait.senseType) : '', trait.scope ? labels(trait.scope) : '', trait.detail].filter(Boolean).join(' ')) ?? [];
  const modifiers = component.modifiers.map(modifier => {
    const definition = effect ? resolveModifierDefinition(modifier, effect, modifierDefs).definition : undefined;
    const options = Object.entries(modifier.options ?? {}).filter(([, value]) => value !== false && value !== '' && value !== 0).map(([key, value]) => {
      const subtype = definition?.subtypes?.find(item => item.id === value);
      return `${labels(key)}: ${subtype?.label ?? labels(String(value))}`;
    });
    return [definition?.name ?? modifier.modifierId, modifier.ranks !== 1 ? modifier.ranks : '', modifier.option ? `(${labels(modifier.option)})` : '', options.length ? `(${options.join(', ')})` : '', modifier.affectedRanks !== undefined ? `[${modifier.affectedRanks} ${labels('ranks')}]` : ''].filter(value => value !== '').join(' ');
  });
  return [`${effect?.name ?? component.effectId} ${component.ranks}`, component.variableCostOption, fields.length ? `(${fields.join('; ')})` : '', senses.length ? `[${senses.join('; ')}]` : '', modifiers.length ? `— ${modifiers.join(', ')}` : ''].filter(Boolean).join(' ');
}

export function renderPowerDetails(power: ICharacterPower, powerDefs: IPowerEffect[], modifierDefs: IModifierDef[], labels: PDFLabels = englishPDFLabels): string {
  const components = power.components.map(component => `<div class="power-effects pdf-flow-line">${escapeHtml(formatComponentDetails(component, powerDefs, modifierDefs, labels))}</div>`).join('');
  const alternates = power.alternateEffects.map(alternate => `<div class="power-alternate"><div class="pdf-flow-line"><strong>${escapeHtml(labels(alternate.dynamic ? 'Dynamic Alternate Effect' : 'Alternate Effect'))}: ${escapeHtml(alternate.name || labels('Unnamed'))}</strong></div>${alternate.components.map(component => `<div class="power-effects pdf-flow-line">${escapeHtml(formatComponentDetails(component, powerDefs, modifierDefs, labels))}</div>`).join('')}${alternate.notes ? `<div class="power-description pdf-flow-line">${nl2br(alternate.notes)}</div>` : ''}</div>`).join('');
  return `${components}${power.baseDynamic ? `<div class="pdf-flow-line">${labels('Dynamic base effect')}</div>` : ''}${power.descriptors?.length ? `<div class="power-description pdf-flow-line">${escapeHtml(power.descriptors.join(', '))}</div>` : ''}${power.activation ? `<div class="power-description pdf-flow-line">${labels('Activation')}: ${escapeHtml(labels(power.activation))}</div>` : ''}${alternates}${power.notes ? `<div class="power-description pdf-flow-line">${nl2br(power.notes)}</div>` : ''}`;
}
