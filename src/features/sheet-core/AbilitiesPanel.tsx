import { memo } from 'react';
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
          const checkBonus = effective.abilities[key] + circumstanceBonus(character, { kind: 'ability', key });
          return (
            <div key={key} className={`ability-card ${isAbsent ? 'absent' : ''}`}>
              <div className="ability-heading">
                <span className="ability-abbr">{key.toUpperCase()}</span>
                <span className="ability-name">{t(`abilities.${key}`)}</span>
              </div>
              <div className="ability-score-row">
                <label className="ability-score-field">
                  <span className="ability-field-label">{t('traits.natural')}</span>
                  {isAbsent ? <span className="ability-value">—</span> : <NumberInput
                    variant="large"
                    className="ability-input"
                    aria-label={`${t(`abilities.${key}`)} · ${t('traits.natural')}`}
                    value={abilities[key]}
                    onChange={(value) => handleAbilityChange(key, value)}
                    min={minAbilityScore !== -Infinity ? minAbilityScore : undefined}
                  />}
                </label>
                {!isAbsent && <div className="ability-check-field">
                  <span className="ability-field-label">{t('traits.check')}</span>
                  <div className="ability-check-actions">
                    <strong className="ability-check-value">{checkBonus >= 0 ? '+' : ''}{checkBonus}</strong>
                    <RollButton bonus={checkBonus} label={t(`abilities.${key}`)} section={t('abilities.title')} />
                  </div>
                </div>}
              </div>
              {!isAbsent && effective.abilities[key] !== abilities[key] && <div className="ability-effective"><span>{t('traits.effective')}</span><strong>{effective.abilities[key]}</strong></div>}
              {!isAbsent && <TraitModifiersControl key={`${characterId}:${key}`} target={{ kind: 'ability', key }} />}
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
