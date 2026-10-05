import { useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { SENSE_TRAITS } from '../../data/senseTraits';
import { useDialogFocus } from '../../shared/hooks/useDialogFocus';
import { NumberInput } from '../../shared/ui/NumberInput';
import { Button } from '../../shared/ui/Button';
import { resolveModifierDefinition } from '../../shared/lib/rulesCatalog';
import { powerComponents, type PersonalPowerModel, type ComponentRankPolicy } from './personalPowerModel';
import { PowerCompositionPreview } from './PowerCompositionPreview';

export function PersonalModelEditor({ model, onChange, onComposition, onSave, onClose, error }: {
  model: PersonalPowerModel; onChange: (model: PersonalPowerModel) => void; onComposition: () => void;
  onSave: () => void; onClose: () => void; error?: string | null;
}) {
  const { t, i18n } = useTranslation();
  const ref = useRef<HTMLDivElement>(null); const titleId = useId();
  const [nameError, setNameError] = useState(false);
  const [rankError, setRankError] = useState(false);
  useDialogFocus(ref, true, onClose);
  const update = (id: string, values: Partial<ComponentRankPolicy>) => { setRankError(false); onChange({ ...model, policies: { ...model.policies, [id]: { ...model.policies[id], ...values } } }); };
  const coefficientRow = (componentId: string, kind: 'modifierRanks' | 'affectedRanks' | 'senseRanks', id: string, label: string) => {
    const values = model.policies[componentId][kind]; const coefficient = values[id];
    return <div className="personal-policy-row" key={`${kind}:${id}`}><label><input type="checkbox" className="app-checkbox" checked={coefficient !== undefined} onChange={event => {
      const next = { ...values }; if (event.target.checked) next[id] = 1; else delete next[id]; update(componentId, { [kind]: next });
    }}/>{label}</label>{coefficient !== undefined && <NumberInput min={1} max={1000000} value={coefficient} aria-label={`${label} · ${t('personalLibrary.coefficient')}`} onChange={value => update(componentId, { [kind]: { ...values, [id]: value } })}/>}</div>;
  };
  return <div className="power-library-overlay" onClick={onClose}><div className="personal-editor" ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onClick={event => event.stopPropagation()}>
    <header><h2 id={titleId}>{t('personalLibrary.editorTitle')}</h2><Button variant="ghost" onClick={onClose} title={t('builder.close')}><X size={18}/></Button></header>
    <label>{t('personalLibrary.name')}<input type="text" maxLength={200} value={model.name} onChange={event => { setNameError(false); onChange({ ...model, name: event.target.value }); }}/></label>
    <label>{t('personalLibrary.description')}<textarea maxLength={50000} value={model.description} onChange={event => onChange({ ...model, description: event.target.value })}/></label>
    <Button variant="secondary" onClick={onComposition}>{t('personalLibrary.composition')}</Button>
    <h3>{t('personalLibrary.rankPolicies')}</h3><p className="personal-notes">{t('personalLibrary.policiesHelp')}</p>
    {powerComponents(model.power).map(component => {
      const effect = POWER_DEFS.find(item => item.id === component.effectId);
      const label = effect?.i18n?.[i18n.language]?.name ?? effect?.name ?? component.effectId;
      const alternate = model.power.alternateEffects.find(item => item.components.some(c => c.id === component.id));
      const policy = model.policies[component.id];
      return <section className="personal-policy" key={component.id}>
        <strong>{alternate ? `${alternate.name} · ` : ''}{label} · {component.ranks}</strong>
        <label>{t('personalLibrary.rankPolicies')}<select className="app-select" value={policy.mode} aria-label={`${t('personalLibrary.rankPolicies')}: ${alternate?.name ? `${alternate.name} · ` : ''}${label}`} onChange={event => update(component.id, { mode: event.target.value as ComponentRankPolicy['mode'] })}><option value="fixed">{t('personalLibrary.fixed')}</option><option value="scalable">{t('personalLibrary.scalable')}</option></select></label>
        {policy.mode === 'scalable' && <>{component.senseTraits?.length ? <p className="personal-notes">{t('personalLibrary.senseDerived')}</p> : <label>{t('personalLibrary.multiplier')}<NumberInput min={0} max={1000000} value={policy.multiplier} aria-label={`${t('personalLibrary.multiplier')}: ${label}`} onChange={value => update(component.id, { multiplier: value })}/></label>}
          <details><summary>{t('personalLibrary.advanced')}</summary>
            {component.modifiers.map((modifier, index) => {
              const definition = effect && resolveModifierDefinition(modifier, effect, MODIFIER_DEFS).definition;
              const name = `${definition?.i18n?.[i18n.language]?.name ?? definition?.name ?? modifier.modifierId} (${index + 1})`;
              return <div key={modifier.instanceId}>{coefficientRow(component.id, 'modifierRanks', modifier.instanceId!, t('personalLibrary.scaleModifier', { name }))}
                {(modifier.affectedRanks !== undefined || typeof modifier.options?.affectedRanks === 'number') && coefficientRow(component.id, 'affectedRanks', modifier.instanceId!, t('personalLibrary.scaleAffected', { name }))}</div>;
            })}
            {component.senseTraits?.map((trait, index) => coefficientRow(component.id, 'senseRanks', String(index), t('personalLibrary.scaleSense', { name: `${t(`powerLibrary.sense.${trait.id}`, { defaultValue: SENSE_TRAITS.find(item => item.id === trait.id)?.label ?? trait.id })} (${index + 1})` })))}
          </details></>}
      </section>;
    })}
    <details><summary>{t('powerLibrary.preview')}</summary><PowerCompositionPreview power={model.power}/></details>
    {(error || nameError || rankError) && <p role="alert">{t(nameError ? 'personalLibrary.invalidName' : rankError ? 'personalLibrary.invalidRank' : error!)}</p>}
    <footer><Button variant="ghost" onClick={onClose}>{t('common.cancel')}</Button><Button onClick={() => {
      if (!model.name.trim() || model.name.trim().length > 200) { setNameError(true); return; }
      if (Object.values(model.policies).some(policy => !Number.isSafeInteger(policy.multiplier) || policy.multiplier < 0 || [...Object.values(policy.modifierRanks), ...Object.values(policy.affectedRanks), ...Object.values(policy.senseRanks)].some(value => !Number.isSafeInteger(value) || value < 1))) { setRankError(true); return; }
      onSave();
    }}>{t('common.save')}</Button></footer>
  </div></div>;
}
