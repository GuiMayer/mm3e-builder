import type { ICharacterAdvantage, ICharacterSkill, ISkillDef } from '../../entities/types';

const SKILL_ACTIONS: Record<string, string[]> = {
  assessment: ['insight'], agile_feint: ['acrobatics'], startle: ['intimidation'],
  taunt: ['deception'], tracking: ['perception'], inventor: ['technology'],
  ritualist: ['expertise'], well_informed: ['investigation', 'persuasion'],
};

export function skillDisplayName(skill: ICharacterSkill, definition: ISkillDef): string {
  return skill.subtype ? `${definition.name}: ${skill.subtype}` : definition.name;
}

function normalize(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

function matchesReference(reference: string, skill: ICharacterSkill, definition: ISkillDef): boolean {
  // Subtypes were historically saved as displayed strings in either language.
  const translated = definition as ISkillDef & { i18n?: Record<string, { name?: string }> };
  const names = [definition.id, definition.name, ...Object.values(translated.i18n ?? {}).map(value => value.name).filter((name): name is string => !!name)];
  return names.some(name => normalize(skillDisplayName(skill, { ...definition, name })) === normalize(reference));
}

/** Explicit check mappings; advantage ranks themselves are never treated as a check bonus. */
export function advantageSkillChecks(advantage: ICharacterAdvantage, skills: ICharacterSkill[], definitions: ISkillDef[]) {
  const scoped = ['skill_mastery', 'fascinate', 'daze'].includes(advantage.advantageId);
  const allowedIds = advantage.advantageId === 'daze' ? ['deception', 'intimidation'] : SKILL_ACTIONS[advantage.advantageId];
  if (!scoped && !allowedIds) return [];
  return definitions.flatMap(definition => {
    if (allowedIds && !allowedIds.includes(definition.id)) return [];
    const entries = skills.filter(skill => skill.skillId === definition.id);
    const candidates = entries.length ? entries : definition.subtyped ? [] : [{ skillId: definition.id, ranks: 0, subtype: null }];
    return candidates.filter(skill => !scoped || (!!advantage.subtype && matchesReference(advantage.subtype, skill, definition)))
      .map(skill => ({ skill, definition, routine: advantage.advantageId === 'skill_mastery' }));
  });
}
