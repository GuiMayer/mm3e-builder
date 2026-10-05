import { memo, useId } from 'react';
import { useTraitValues } from '../../shared/hooks/useTraitValues';
import { circumstanceBonus } from '../../shared/lib/traitValues';
import { TraitModifiersControl } from '../trait-modifiers/TraitModifiersControl';
import { useCharacterActions } from '../../shared/hooks/useCharacterActions';
import { useAppStore } from '../../store/appStore';
import type { AbilityKey } from '../../entities/types';
import { useTranslation } from 'react-i18next';
import { getActiveValidationRules } from '../../shared/lib/validationRules';
import { NumberInput } from '../../shared/ui/NumberInput';
import { RollButton } from '../dice-roller/RollButton';
import './abilities.css';

const ABILITY_KEYS: AbilityKey[] = ['str', 'sta', 'agl', 'dex', 'fgt', 'int', 'awe', 'pre'];

function AbilitiesPanelComponent({ cost }: { cost: number }) {
  const abilityInputId = useId();
  const { t } = useTranslation();
  const { original: character, character: effective, characterId } = useTraitValues();
  const { setAbility, toggleAbsentAbility } = useCharacterActions();
  const abilities = character.abilities;
  const absentAbilities = character.absentAbilities;
  const validationRules = useAppStore((s) => s.validationRules);
  
  const activeRules = getActiveValidationRules(validationRules);
  const minAbilityScore = activeRules.enforceMinimumAbilityScore ? -5 : -Infinity;
  
  const handleAbilityChange = (key: AbilityKey, value: number) => {
    const clampedValue = Math.max(minAbilityScore, value);
    setAbility(key, clampedValue);
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t('abilities.title')}</h2>
        <span className="panel-cost">{cost} {t('common.pp')}</span>
      </div>
      <div className="abilities-grid">
        {ABILITY_KEYS.map((key) => {
          const isAbsent = absentAbilities.includes(key);
          const enhancementBonus = effective.abilities[key] - abilities[key];
          const circumstances = circumstanceBonus(character, { kind: 'ability', key });
          const checkBonus = effective.abilities[key] + circumstances;
          const signed = (value: number) => `${value >= 0 ? '+' : '−'}${Math.abs(value)}`;
          const adjustments = [enhancementBonus, circumstances].filter(value => value !== 0);
          const breakdown = [
            `${t('traits.natural')}: ${abilities[key]}`,
            `${t('traits.enhancements')}: ${signed(enhancementBonus)}`,
            `${t('traits.circumstances')}: ${signed(circumstances)}`,
          ];
          return (
            <div key={key} className={`ability-card ${isAbsent ? 'absent' : ''}`}>
              <div className="ability-heading">
                <span className="ability-abbr">{key.toUpperCase()}</span>
                <span className="ability-name">{t(`abilities.${key}`)}</span>
              </div>
              <div className="ability-score-row">
                <div className="ability-score-field">
                  {isAbsent
                    ? <span className="ability-field-label">{t('traits.natural')}</span>
                    : <label className="ability-field-label" htmlFor={`${abilityInputId}-${key}`}>{t('traits.natural')}</label>}
                  {isAbsent ? <span className="ability-value">—</span> : <NumberInput
                    variant="large"
                    className="ability-input"
                    id={`${abilityInputId}-${key}`}
                    aria-label={`${t(`abilities.${key}`)} · ${t('traits.natural')}`}
                    value={abilities[key]}
                    onChange={(value) => handleAbilityChange(key, value)}
                    min={minAbilityScore !== -Infinity ? minAbilityScore : undefined}
                  />}
                </div>
                {!isAbsent && <div className="ability-check-field">
                  <span className="ability-field-label">{t('traits.check')}</span>
                  <div className="ability-check-actions">
                    <div className="ability-check-expression" title={breakdown.join(' · ')} aria-label={`${breakdown.join(' · ')} = ${signed(checkBonus)}`}>
                      {adjustments.length > 0 && <span className="ability-check-adjustments" aria-hidden="true">{adjustments.map(signed).join(' ')} =</span>}
                      <strong className="ability-check-value" aria-hidden="true">{signed(checkBonus)}</strong>
                    </div>
                    <RollButton bonus={checkBonus} label={t(`abilities.${key}`)} section={t('abilities.title')} breakdown={breakdown} />
                  </div>
                </div>}
              </div>
              <div className="ability-adjustments-row">
                <TraitModifiersControl key={`${characterId}:${key}`} target={{ kind: 'ability', key }} />
              </div>
              <button
                className="ability-toggle"
                onClick={() => toggleAbsentAbility(key)}
                type="button"
                aria-label={`${isAbsent ? t('abilities.restore') : t('abilities.absent')} · ${t(`abilities.${key}`)}`}
                title={isAbsent ? t('abilities.restore') : t('abilities.absent')}
              >
                {isAbsent ? '✚' : '✕'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export const AbilitiesPanel = memo(AbilitiesPanelComponent);
