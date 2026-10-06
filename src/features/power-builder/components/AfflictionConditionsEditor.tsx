import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import type { ICharacterPowerComponent } from '../../../entities/types';
import { POWER_DEFS, MODIFIER_DEFS } from '../../../entities/gameDataLoaders';
import { AFFLICTION_CONDITIONS, afflictionRecoveryLabel, readAfflictionConfiguration } from '../../../shared/lib/afflictionConfiguration';
import './afflictionConditions.css';

export function AfflictionConditionsEditor({ component, onChange }: { component: ICharacterPowerComponent; onChange: (fields: NonNullable<ICharacterPowerComponent['fieldValues']>) => void }) {
  const { t } = useTranslation();
  const id = useId();
  const config = readAfflictionConfiguration(component, POWER_DEFS.find(effect => effect.id === 'affliction')!, MODIFIER_DEFS);
  const fields = component.fieldValues ?? {};
  function set(key: string, value: string | string[]) { onChange({ ...fields, [key]: value }); }
  function toggle(list: string[], value: string) { return list.includes(value) ? list.filter(item => item !== value) : [...list, value]; }
  return <details className="affliction-conditions" onClick={event => event.stopPropagation()}>
    <summary>{t('builder.affliction.title')}</summary>
    <p>{t('builder.affliction.optional')}</p>
    <fieldset><legend>{t('builder.affliction.degrees')}</legend><div className="affliction-conditions__choices">{['1', '2', '3'].map(degree => <label key={degree}><input className="app-checkbox" type="checkbox" checked={config.degrees.includes(degree)} onChange={() => set('afflictionDegrees', toggle(config.degrees, degree))}/>{t(`builder.affliction.degree${degree}`)}</label>)}</div></fieldset>
    {[1, 2, 3].map(degree => <fieldset key={degree} className={!config.degrees.includes(String(degree)) ? 'affliction-conditions__inactive' : undefined}>
      <legend>{t(`builder.affliction.degree${degree}`)} · {t('builder.affliction.simultaneous', { count: config.conditionsPerDegree })}</legend>
      {config.allVariable ? <p>{t('builder.affliction.chosenAtUse')}</p> : config.variablePurchases > 0 && <label><input className="app-checkbox" type="checkbox" checked={config.variableDegrees.includes(String(degree))} onChange={() => set('afflictionVariableDegrees', toggle(config.variableDegrees, String(degree)))}/>{t('builder.affliction.chosenAtUse')}</label>}
      <div className="affliction-conditions__choices">{[...AFFLICTION_CONDITIONS[`degree${degree}` as keyof typeof AFFLICTION_CONDITIONS], ...config.conditions[degree - 1].filter(value => !(AFFLICTION_CONDITIONS[`degree${degree}` as keyof typeof AFFLICTION_CONDITIONS] as readonly string[]).includes(value))].map(condition => <label key={condition}><input className="app-checkbox" type="checkbox" checked={config.conditions[degree - 1].includes(condition)} onChange={() => set(`afflictionDegree${degree}`, toggle(config.conditions[degree - 1], condition))}/>{t(`conditions.${condition}`, { defaultValue: condition })}</label>)}</div>
    </fieldset>)}
    <label htmlFor={id}>{t('builder.affliction.recovery')}</label><select id={id} className="app-select" value={config.recovery} onChange={event => set('afflictionRecovery', event.target.value)}><option value="">{t('builder.selectOption')}</option>{['fortitude', 'will', 'dodge', 'parry', 'toughness'].map(value => <option key={value} value={value}>{t(`defenses.${value}`)}</option>)}{config.recovery && !['fortitude', 'will', 'dodge', 'parry', 'toughness'].includes(config.recovery) && <option value={config.recovery}>{afflictionRecoveryLabel(config.recovery, key => t(key))}</option>}</select>
  </details>;
}
