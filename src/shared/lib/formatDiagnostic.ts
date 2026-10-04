import type { TFunction } from 'i18next';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../../entities/gameDataLoaders';
import type { RuleDiagnostic } from './diagnostics';

/** Resolve application text at presentation time; never translate user notes/names. */
export function formatDiagnostic(diagnostic: RuleDiagnostic, t: TFunction, language: string): string {
  if (!diagnostic.messageKey) return diagnostic.message;
  const params = { ...diagnostic.params };
  for (const [parameter, name] of Object.entries(diagnostic.names ?? {})) {
    const effect = POWER_DEFS.find(def => def.id === name.effectId);
    if (name.kind === 'field') {
      const field = effect?.configurableFields?.find(def => def.id === name.id);
      params[parameter] = field?.i18n?.[language]?.label ?? field?.label ?? name.id;
    } else {
      const definitions = name.kind === 'effect' ? POWER_DEFS : name.kind === 'skill' ? SKILL_DEFS : name.kind === 'advantage' ? ADVANTAGE_DEFS : [...(effect?.extras ?? []), ...(effect?.flaws ?? []), ...MODIFIER_DEFS];
      const def = definitions.find(def => def.id === name.id);
      const localized = def as { name?: string; i18n?: Record<string, { name?: string }> } | undefined;
      params[parameter] = localized?.i18n?.[language]?.name ?? localized?.name ?? name.id;
    }
  }
  return t(diagnostic.messageKey, { ...params, defaultValue: diagnostic.message });
}
