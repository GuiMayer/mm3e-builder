import type {
  AbilityKey,
  ICharacter,
  ISkillDef,
  IValidationRules,
} from '../../entities/types';
import type { CharacterValidationNotice } from './validation';

const DEFENSE_BASES: Array<{
  defense: keyof ICharacter['defenses'];
  ability: AbilityKey;
}> = [
  { defense: 'dodge', ability: 'agl' },
  { defense: 'parry', ability: 'fgt' },
  { defense: 'fortitude', ability: 'sta' },
  { defense: 'will', ability: 'awe' },
];

/** Collect optional, non-blocking warnings caused by absent abilities. */
export function collectAbsentAbilityWarnings(
  character: ICharacter,
  skillDefs: ISkillDef[],
  rules: IValidationRules
): CharacterValidationNotice[] {
  const absent = new Set(character.absentAbilities);
  const warnings: CharacterValidationNotice[] = [];

  if (rules.enforceSkillAbilityRequirements) {
    for (const skill of character.skills) {
      if (skill.ranks <= 0) continue;
      const definition = skillDefs.find((candidate) => candidate.id === skill.skillId);
      if (!definition || !absent.has(definition.baseAbility)) continue;

      warnings.push({
        rule: 'validation.absentAbility',
        formula: 'validation.skillUsesAbsentAbility',
        params: {
          skill: skill.subtype
            ? `${definition.name}: ${skill.subtype}`
            : definition.name,
          ability: definition.baseAbility.toUpperCase(),
        },
        severity: 'warning',
      });
    }
  }

  if (rules.enforceAbsentAbilityRestrictions) {
    for (const { defense, ability } of DEFENSE_BASES) {
      if (character.defenses[defense] <= 0 || !absent.has(ability)) continue;
      warnings.push({
        rule: 'validation.absentAbility',
        formula: `validation.absentDefense.${defense}`,
        params: { ability: ability.toUpperCase() },
        severity: 'warning',
      });
    }
  }

  return warnings;
}
