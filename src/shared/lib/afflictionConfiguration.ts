import type { ICharacterPowerComponent, IModifierDef, IPowerEffect } from '../../entities/types';
import type { RuleDiagnostic } from './diagnostics';
import { AFFLICTION_CONDITIONS, validateAfflictionCondition } from './afflictionValidation';
import { resolveModifierDefinition } from './rulesCatalog';

export const AFFLICTION_FIELD_PREFIX = 'affliction';
export const isAfflictionField = (id: string) => id.startsWith(AFFLICTION_FIELD_PREFIX);
const array = (value: string | string[] | undefined) => Array.isArray(value) ? value : typeof value === 'string' && value ? [value] : [];
export function readAfflictionConfiguration(component: ICharacterPowerComponent, effect: IPowerEffect, modifierDefs: readonly IModifierDef[]) {
  const modifiers = component.modifiers.filter(modifier => resolveModifierDefinition(modifier, effect, modifierDefs).source === 'power-specific');
  const ranks = (id: string) => modifiers.filter(modifier => modifier.modifierId === id).reduce((total, modifier) => total + Math.max(1, modifier.ranks), 0);
  const limited = ranks('limited_degree');
  const fields = component.fieldValues ?? {};
  const degrees = Object.hasOwn(fields, 'afflictionDegrees') ? array(fields.afflictionDegrees) : ['1', '2', '3'].slice(0, Math.max(1, 3 - limited));
  const allVariable = ranks('variable_conditions') > 0;
  const variablePurchases = ranks('variable_condition_degree');
  const variableDegrees = allVariable ? degrees : variablePurchases ? array(fields.afflictionVariableDegrees) : [];
  return { configured: Object.keys(fields).some(isAfflictionField), degrees, variableDegrees, allVariable, variablePurchases, limited, conditionsPerDegree: 1 + ranks('extra_condition'), conditions: [1, 2, 3].map(degree => array(fields[`afflictionDegree${degree}`])), recovery: typeof fields.afflictionRecovery === 'string' ? fields.afflictionRecovery : '' };
}
export function validateAfflictionComponent(component: ICharacterPowerComponent, effect: IPowerEffect, modifiers: readonly IModifierDef[]): RuleDiagnostic[] {
  if (component.effectId !== 'affliction') return [];
  const config = readAfflictionConfiguration(component, effect, modifiers);
  if (!config.configured) return []; // Legacy notes are never parsed or required.
  const issues: RuleDiagnostic[] = [];
  const add = (key: string, params?: RuleDiagnostic['params']) => issues.push({ message: 'Review the optional Affliction configuration.', messageKey: `builder.affliction.warning.${key}`, params });
  const expectedDegrees = Math.max(1, 3 - config.limited);
  if (config.degrees.length !== expectedDegrees || new Set(config.degrees).size !== config.degrees.length || config.degrees.some(degree => !['1', '2', '3'].includes(degree))) add('degrees', { expected: expectedDegrees });
  if (config.limited > 2) add('limited');
  for (const degree of config.degrees) {
    const number = Number(degree) as 1 | 2 | 3;
    if (![1, 2, 3].includes(number)) continue;
    const conditions = config.conditions[number - 1];
    if (!config.variableDegrees.includes(degree) && conditions.length !== config.conditionsPerDegree) add('count', { degree, expected: config.conditionsPerDegree });
    if (new Set(conditions).size !== conditions.length) add('duplicate', { degree });
    for (const condition of conditions) {
      if (validateAfflictionCondition(condition, number)) add('condition', { degree, condition });
    }
  }
  if (!config.allVariable && config.variablePurchases && config.variableDegrees.length !== Math.min(config.variablePurchases, config.degrees.length)) add('variable');
  if (config.variableDegrees.some(degree => !config.degrees.includes(degree))) add('variable');
  if (!config.allVariable && !config.variablePurchases && array(component.fieldValues?.afflictionVariableDegrees).length) add('variableModifier');
  const alternate = component.modifiers.find(modifier => modifier.modifierId === 'alternate_resistance');
  const initial = alternate?.options?.subtypeId || component.fieldValues?.resistance;
  if (initial && !['fortitude', 'will'].includes(String(initial)) && !alternate) add('resistance');
  if (alternate && !config.recovery) add('recovery');
  return issues;
}

/** Display only stored optional data; never fabricate conditions for a legacy sheet. */
export function afflictionSummary(component: ICharacterPowerComponent, label: (key: string) => string, effect?: IPowerEffect, modifiers: readonly IModifierDef[] = []): string[] {
  if (component.effectId !== 'affliction' || !Object.keys(component.fieldValues ?? {}).some(isAfflictionField)) return [];
  const fields = component.fieldValues ?? {};
  const config = effect ? readAfflictionConfiguration(component, effect, modifiers) : undefined;
  const active = config?.degrees ?? (Object.hasOwn(fields, 'afflictionDegrees') ? array(fields.afflictionDegrees) : ['1', '2', '3']);
  const lines = active.flatMap(degree => {
    const conditions = array(fields[`afflictionDegree${degree}`]);
    return conditions.length ? [`${label(`builder.affliction.degree${degree}`)}: ${conditions.map(condition => label(`conditions.${condition}`)).join(', ')}`] : [];
  });
  const variable = config?.variableDegrees ?? array(fields.afflictionVariableDegrees);
  if (variable.length) lines.push(`${label('builder.affliction.variable')}: ${variable.join(', ')}`);
  if (fields.afflictionRecovery) lines.push(`${label('builder.affliction.recovery')}: ${label(`defenses.${fields.afflictionRecovery}`)}`);
  return lines;
}
export { AFFLICTION_CONDITIONS };

export function afflictionFallbackLabel(key: string): string {
  const labels: Record<string, string> = { 'builder.affliction.degree1': 'Degree 1', 'builder.affliction.degree2': 'Degree 2', 'builder.affliction.degree3': 'Degree 3', 'builder.affliction.variable': 'Variable degrees', 'builder.affliction.recovery': 'Recovery resistance' };
  return labels[key] ?? key.split('.').pop()!.replace(/_/g, ' ').replace(/^./, letter => letter.toUpperCase());
}
