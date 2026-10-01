import type { ICharacterPower } from '../../entities/types';
import { validatePowerForSave } from '../../shared/lib/semanticValidation';
import { resolveModifierDefinition } from '../../shared/lib/rulesCatalog';

/** Keep the existing diagnostics intact; only source/structural failures block saving.
 * Applicability, conflicts and modifier caps are decisions for the player/GM.
 */
export function getBlockingPowerSaveIssues(
  power: ICharacterPower,
  rules: Parameters<typeof validatePowerForSave>[1],
  context: Parameters<typeof validatePowerForSave>[2],
) {
  const validModifierPaths = new Set<string>();
  const invalidModifierPaths = new Set<string>();
  const inspect = (component: ICharacterPower['components'][number], path: string) => {
    const effect = context.powerDefs.find(definition => definition.id === component.effectId);
    for (const modifier of component.modifiers) {
      const target = effect && resolveModifierDefinition(modifier, effect, context.modifierDefs).definition
        ? validModifierPaths : invalidModifierPaths;
      target.add(`${path}.modifiers.${modifier.modifierId}`);
    }
  };
  power.components.filter(component => component.effectId !== '').forEach((component, index) => inspect(component, `components.${index}`));
  power.alternateEffects.forEach((alternate, index) => alternate.components
    .filter(component => component.effectId !== '').forEach((component, componentIndex) => inspect(component, `alternateEffects.${index}.components.${componentIndex}`)));
  // Accurate's PL diagnostic also appears in the unmodified warning display.
  return validatePowerForSave(power, { ...rules, enforceAccuratePLCap: false }, context)
    .filter(issue => issue.severity === 'error'
      && (!validModifierPaths.has(issue.path) || invalidModifierPaths.has(issue.path)));
}
