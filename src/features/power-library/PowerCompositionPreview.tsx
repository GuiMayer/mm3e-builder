import { lazy, Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ICharacterPower } from '../../entities/types';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS } from '../../entities/gameDataLoaders';
import { SENSE_TRAITS } from '../../data/senseTraits';
import { calculatePowerPricing } from '../../shared/lib/mathEngine';
import { buildPowerReferences } from '../sheet-core/powerReference';
import type { PowerReferenceTarget } from '../sheet-core/PowerReferenceDialog';
import { NumberInput } from '../../shared/ui/NumberInput';
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

export function PowerCompositionPreview({ power, strength = 0, costUnit = 'PP' }: { power: ICharacterPower; strength?: number; costUnit?: 'PP' | 'EP' }) {
  const { t, i18n } = useTranslation();
  const [reference, setReference] = useState<PowerReferenceTarget | null>(null);
  const pricing = calculatePowerPricing(power, POWER_DEFS, MODIFIER_DEFS, strength);
  const group = (components: ICharacterPower['components']) => buildPowerReferences(components, POWER_DEFS, MODIFIER_DEFS, i18n.language).map(item =>
    <article key={item.component.id} className="power-library-component">
      <button className="personal-reference-link" onClick={() => setReference({ kind: 'effect', reference: item })}>{item.definition?.name ?? item.component.effectId} · {item.component.ranks} {t('builder.ranks')}</button>
      <div className="power-library-modifiers">{item.modifiers.map((modifier, index) => <button type="button" className="personal-modifier-link" key={modifier.applied.instanceId ?? index} onClick={() => setReference({ kind: 'modifier', reference: modifier, effectName: item.definition?.name })}>
        {modifier.definition?.name ?? modifier.applied.modifierId} · {modifier.applied.ranks}{modifier.applied.affectedRanks !== undefined ? ` · ${t('rulesInfo.affectedRanks', { count: modifier.applied.affectedRanks })}` : ''}
      </button>)}</div>
      {Object.entries(item.component.fieldValues ?? {}).map(([id, value]) => <p className="power-library-field-value" key={id}>{item.definition?.configurableFields?.find(field => field.id === id)?.label ?? id}: {Array.isArray(value) ? value.join(', ') : value}</p>)}
      {item.component.enhancedTarget && <p className="power-library-field-value">{t('personalLibrary.traitTarget')}: {item.component.enhancedTarget.kind === 'ability' ? t(`abilities.${item.component.enhancedTarget.key}`) : item.component.enhancedTarget.kind === 'defense' ? t(`defenses.${item.component.enhancedTarget.key}`) : `${t(`skills.${item.component.enhancedTarget.skillId}`, { defaultValue: SKILL_DEFS.find(skill => skill.id === (item.component.enhancedTarget?.kind === 'skill' ? item.component.enhancedTarget.skillId : ''))?.name ?? item.component.enhancedTarget.skillId })}${item.component.enhancedTarget.subtype ? ` · ${item.component.enhancedTarget.subtype}` : ''}`}</p>}
      {!!item.component.senseTraits?.length && <ul className="power-library-purchases">{item.component.senseTraits.map((trait, index) => <li key={index}>{t(`powerLibrary.sense.${trait.id}`, { defaultValue: SENSE_TRAITS.find(sense => sense.id === trait.id)?.label ?? trait.id })} · {trait.ranks}{trait.senseType ? ` · ${trait.senseType}` : ''}{trait.detail ? ` · ${trait.detail}` : ''}</li>)}</ul>}
    </article>);
  return <div className="personal-composition">
    <div className="personal-cost"><strong>{costUnit === 'PP' ? pricing.total : pricing.equipmentTotal} {costUnit}</strong><button className="personal-reference-link" onClick={() => setReference({ kind: 'power', power })}>{t('personalLibrary.fullReference')}</button></div>
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
