import type {
  AbilityKey,
  ICharacter,
  ISkillDef,
  IValidationRules,
} from '../../entities/types';
import type { CharacterValidationNotice } from './validation';
import { isStrengthBasedDamage } from './abilityRanks';

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

    if (absent.has('str')) {
      for (const power of [...character.powers, ...(character.equipment ?? [])]) {
        const groups = [
          { name: power.name, components: power.components },
          ...(power.alternateEffects ?? []).map((alternate) => ({
            name: alternate.name || power.name,
            components: alternate.components,
          })),
        ];

        for (const group of groups) {
          for (const component of group.components) {
            if (!isStrengthBasedDamage(component)) continue;
            warnings.push({
              rule: 'validation.absentAbility',
              formula: 'validation.strengthBasedDamageUsesAbsentStrength',
              params: { power: group.name || 'Damage' },
              severity: 'warning',
            });
          }
        }
      }
    }
  }

  return warnings;
}
