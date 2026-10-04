import { useTraitValues } from '../../shared/hooks/useTraitValues';
import { circumstanceBonus } from '../../shared/lib/traitValues';
import { getSkillTrainingWarning } from '../../shared/lib/skillEligibility';
import { formatDiagnostic } from '../../shared/lib/formatDiagnostic';
import { useAppStore } from '../../store/appStore';
import { useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { ICharacter, ICharacterAdvantage, ISkillDef } from '../../entities/types';
import { useDerivedDefenses } from '../../shared/hooks/useDerivedDefenses';
import { useOffenseSummary } from '../../shared/hooks/useOffenseSummary';
import { calculateSkillCheck } from '../../shared/lib/skillCheck';
import { advantageSkillChecks, skillDisplayName } from './advantageChecks';
import { RollButton } from './RollButton';
import { D20Icon } from './D20Icon';

export function AdvantageRollActions({ advantage, name, character, skillDefs }: {
  advantage: ICharacterAdvantage; name: string;
  character: Pick<ICharacter, 'skills' | 'abilities' | 'absentAbilities' | 'advantages'>;
  skillDefs: ISkillDef[];
}) {
  const { t, i18n } = useTranslation();
  const trainingWarnings = useAppStore(state => state.validationRules?.enforceTrainedOnlySkills ?? false);
  const checks = advantageSkillChecks(advantage, character.skills, skillDefs);
  const choices = checks.map(({ skill, definition, routine }) => {
    const check = calculateSkillCheck(character, skill, definition);
    const issue = getSkillTrainingWarning(skill, definition, character.advantages, trainingWarnings);
    return { warning: issue ? formatDiagnostic(issue, t, i18n.language) : undefined, bonus: check.total, label: `${name} · ${skillDisplayName(skill, definition)}`, section: t('advantages.title'), routine, breakdown: [`${t(`abilities.${definition.baseAbility}`)} ${check.ability}`, `${t('common.ranks')} ${check.ranks}`, ...(check.other ? [`${t('skills.otherBonus')} ${check.other}`] : []), ...(check.circumstance ? [`${t('traits.circumstance')} ${check.circumstance}`] : [])] };
  });
  if (advantage.advantageId === 'improved_initiative' || advantage.advantageId === 'defensive_roll') return <DefensiveAdvantageRoll id={advantage.advantageId} name={name} />;
  if (advantage.advantageId === 'close_attack' || advantage.advantageId === 'ranged_attack') return <AttackAdvantageRoll id={advantage.advantageId} name={name} />;
  return <RollChoices choices={choices} name={name} />;
}

function RollChoices({ choices, name }: { choices: React.ComponentProps<typeof RollButton>[]; name: string }) {
  const { t } = useTranslation();
  const id = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  if (!choices.length) return null;
  if (choices.length === 1) return <RollButton {...choices[0]} />;
  return <><button ref={triggerRef} type="button" className="roll-button" popoverTarget={id} aria-label={t('dice.choose', { name })} title={t('dice.choose', { name })}><D20Icon /></button><div ref={listRef} id={id} popover="auto" className="roll-choices-list" aria-label={t('dice.choose', { name })}><strong>{t('dice.choose', { name })}</strong>{choices.map((choice, index) => <RollButton key={index} {...choice} showLabel onRoll={() => { listRef.current?.hidePopover(); triggerRef.current?.focus(); }} />)}</div></>;
}

function DefensiveAdvantageRoll({ id, name }: { id: string; name: string }) {
  const { t } = useTranslation();
  const defenses = useDerivedDefenses();
  const { original } = useTraitValues();
  const circumstance = circumstanceBonus(original, { kind: 'defense', key: 'toughness' });
  const initiative = id === 'improved_initiative';
  return <RollButton bonus={initiative ? defenses.initiativeTotal : defenses.toughnessTotal + circumstance} label={`${name} · ${t(initiative ? 'defenses.initiative' : 'defenses.toughness')}`} section={t('advantages.title')} breakdown={initiative ? defenses.initiativeBreakdown : [...defenses.toughnessBreakdown, ...(circumstance ? [`${t('traits.circumstance')} ${circumstance}`] : [])]} />;
}

function AttackAdvantageRoll({ id, name }: { id: string; name: string }) {
  const { t } = useTranslation();
  const profiles = useOffenseSummary();
  const choices = profiles.filter(profile => profile.requiresAttackCheck && profile.bonusValue !== null && profile.range === (id === 'close_attack' ? 'close' : 'ranged'))
    .map(profile => ({ bonus: profile.bonusValue!, label: `${name} · ${profile.name}`, section: t('advantages.title'), detail: [t(`targeted.source.${profile.sourceType}`), profile.componentName].filter(Boolean).join(' · '), breakdown: [profile.bonusBreakdown] }));
  return <RollChoices choices={choices} name={name} />;
}
