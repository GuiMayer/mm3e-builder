import { lazy, Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ICharacterPower, ITraitTarget } from '../../entities/types';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS } from '../../entities/gameDataLoaders';
import { SENSE_TRAITS } from '../../data/senseTraits';
import { calculatePowerPricing } from '../../shared/lib/mathEngine';
import { getAffectedRanks } from '../../shared/lib/componentRanks';
import { buildPowerReferences } from '../sheet-core/powerReference';
import type { PowerReferenceTarget } from '../sheet-core/PowerReferenceDialog';
import { NumberInput } from '../../shared/ui/NumberInput';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { powerComponents, type PersonalPowerModel } from './personalPowerModel';

const PowerReferenceDialog = lazy(() => import('../sheet-core/PowerReferenceDialog').then(module => ({ default: module.PowerReferenceDialog })));

export function ModelRankInputs({ model, ranks, onChange }: { model: PersonalPowerModel; ranks: Record<string, number>; onChange: (ranks: Record<string, number>) => void }) {
  const { t, i18n } = useTranslation();
  return <div className="personal-rank-inputs">{powerComponents(model.power).map(component => {
    const definition = POWER_DEFS.find(effect => effect.id === component.effectId);
    const label = definition?.i18n?.[i18n.language]?.name ?? definition?.name ?? component.effectId;
    const alternate = model.power.alternateEffects.find(a => a.components.some(c => c.id === component.id));
    const policy = model.policies[component.id];
    return <label key={component.id}><span>{alternate ? `${alternate.name} · ` : ''}{label}</span>{policy.mode === 'scalable'
      ? <NumberInput min={1} max={1000000} value={ranks[component.id] ?? 1} onChange={value => onChange({ ...ranks, [component.id]: value })} aria-label={`${t('builder.ranks')}: ${alternate?.name ? `${alternate.name} · ` : ''}${label}`} />
      : <small>{t('powerLibrary.fixedRanks', { count: component.ranks })}</small>}</label>;
  })}</div>;
}

export function PowerCompositionPreview({ power, strength = 0, costUnit = 'PP', showCost = true }: { power: ICharacterPower; strength?: number; costUnit?: 'PP' | 'EP'; showCost?: boolean }) {
  const { t, i18n } = useTranslation();
  const skills = useLocalizedData(SKILL_DEFS);
  const [reference, setReference] = useState<PowerReferenceTarget | null>(null);
  const pricing = showCost ? calculatePowerPricing(power, POWER_DEFS, MODIFIER_DEFS, strength) : null;
  const traitLabel = (target: ITraitTarget) => {
    if (target.kind === 'ability') return t(`abilities.${target.key}`);
    if (target.kind === 'defense') return t(`defenses.${target.key}`);
    const skill = skills.find(item => item.id === target.skillId);
    return `${skill?.name ?? target.skillId}${target.subtype ? ` · ${target.subtype}` : ''}`;
  };
  const group = (components: ICharacterPower['components']) => buildPowerReferences(components, POWER_DEFS, MODIFIER_DEFS, i18n.language).map(item =>
    <article key={item.component.id} className="power-library-component">
      <div className="power-library-component-header"><button className="personal-reference-link" onClick={() => setReference({ kind: 'effect', reference: item })}><strong>{item.definition?.name ?? item.component.effectId}</strong></button><span>{item.component.ranks} {t('common.ranks')}</span></div>
      <div className="power-library-modifiers">{item.modifiers.map((modifier, index) => {
        const affected = getAffectedRanks(modifier.applied);
        const subtype = modifier.definition?.subtypes?.find(option => option.id === modifier.applied.options?.subtypeId);
        const option = modifier.applied.option || subtype?.i18n?.[i18n.language]?.label || subtype?.label;
        return <button type="button" className="personal-modifier-link" key={modifier.applied.instanceId ?? index} onClick={() => setReference({ kind: 'modifier', reference: modifier, effectName: item.definition?.name })}>
          {modifier.definition?.name ?? modifier.applied.modifierId} · {modifier.applied.ranks}{option ? ` · ${option}` : ''}{affected !== undefined ? ` · ${t('rulesInfo.affectedRanks', { count: affected })}` : ''}{modifier.applied.options?.note ? ` · ${modifier.applied.options.note}` : ''}
        </button>;
      })}</div>
      {item.component.variableCostOption && <p className="power-library-field-value">{t('builder.costOption')}: {item.component.variableCostOption}</p>}
      {Object.entries(item.component.fieldValues ?? {}).map(([id, value]) => {
        const field = item.definition?.configurableFields?.find(field => field.id === id);
        const values = (Array.isArray(value) ? value : [value]).map(selection => {
          const option = field?.options?.find(option => option.value === selection);
          return option?.i18n?.[i18n.language]?.label ?? option?.label ?? selection;
        });
        return <p className="power-library-field-value" key={id}>{field?.i18n?.[i18n.language]?.label ?? field?.label ?? id}: {values.join(', ')}</p>;
      })}
      {item.component.enhancedTarget && <p className="power-library-field-value">{t('personalLibrary.traitTarget')}: {traitLabel(item.component.enhancedTarget)}</p>}
      {!!item.component.senseTraits?.length && <ul className="power-library-purchases">{item.component.senseTraits.map((trait, index) => <li key={index}>{t(`powerLibrary.sense.${trait.id}`, { defaultValue: SENSE_TRAITS.find(sense => sense.id === trait.id)?.label ?? trait.id })} · {trait.ranks}{trait.senseType ? ` · ${trait.senseType}` : ''}{trait.detail ? ` · ${trait.detail}` : ''}</li>)}</ul>}
    </article>);
  return <div className="personal-composition">
    <div className="personal-cost">{pricing && <strong>{costUnit === 'PP' ? pricing.total : pricing.equipmentTotal} {costUnit}</strong>}<button className="personal-reference-link" onClick={() => setReference({ kind: 'power', power })}>{t('personalLibrary.fullReference')}</button></div>
    {!!power.descriptors?.length && <p>{power.descriptors.join(' · ')}</p>}
    {power.notes && <p className="personal-notes">{power.notes}</p>}
    {power.activation && <p>{t('builder.activation')}: {t(`rulesInfo.action.${power.activation}`)}</p>}
    {power.removable && power.removable !== 'none' && <p>{t(`builder.removable.${power.removable}`)}</p>}
    {power.baseDynamic && <p>{t('rulesInfo.dynamic')}</p>}
    {group(power.components)}
    {power.alternateEffects.map(alternate => <details key={alternate.id} className="personal-alternate"><summary>{alternate.name || t('rulesInfo.alternate')}{alternate.dynamic ? ` · ${t('rulesInfo.dynamic')}` : ''}</summary>{alternate.notes && <p className="personal-notes">{alternate.notes}</p>}{group(alternate.components)}</details>)}
    {reference && <Suspense fallback={null}><PowerReferenceDialog target={reference} onClose={() => setReference(null)}/></Suspense>}
  </div>;
}
