import { ModifierDefinitionNotice } from '../../shared/ui/ModifierDefinitionNotice';
import { resolveModifierDefinition } from '../../shared/lib/rulesCatalog';
import { afflictionSummary } from '../../shared/lib/afflictionConfiguration';
import { resolveEffectiveAction, resolveEffectiveDuration, resolveEffectiveRange } from '../../shared/lib/effectParameters';
import { useTranslation } from 'react-i18next';
import type { IAlternateEffect, ICharacterPowerComponent, ICharacterPower, IModifierDef, IPowerEffect } from '../../entities/types';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { InfoDialog } from '../../shared/ui/InfoDialog';
import { buildPowerReferences, localizeReference, type ComponentReference, type ModifierReference } from './powerReference';

export type PowerReferenceTarget = { kind: 'power'; power: ICharacterPower | IAlternateEffect } |
  { kind: 'effect'; reference: ComponentReference } | { kind: 'modifier'; reference: ModifierReference; effectName?: string };

function RuleDescription({ definition, component }: { definition?: IPowerEffect | IModifierDef; component?: ICharacterPowerComponent }) {
  const { t } = useTranslation();
  if (!definition) return <p>{t('rulesInfo.missing')}</p>;
  const effect = 'baseCost' in definition ? definition : undefined;
  const context = effect ? { effect, modifierDefs: MODIFIER_DEFS } : undefined;
  const action = effect && component ? resolveEffectiveAction(effect.action, component, context) : undefined;
  const duration = effect && component ? resolveEffectiveDuration(effect.duration, component, context) : undefined;
  const range = effect && component ? resolveEffectiveRange(effect.range, component, { effect, modifierDefs: MODIFIER_DEFS }) : undefined;
  return <>
    <div className="reference-meta">
      {'baseCost' in definition ? <>
        <span>{t(`rulesInfo.action.${action?.value ?? definition.action}`)}</span><span>{t(`rulesInfo.range.${range?.value ?? definition.range}`)}</span><span>{t(`rulesInfo.duration.${duration?.value ?? definition.duration}`)}</span>
        <span>{definition.variableCost ? t('rulesInfo.variableCost') : definition.baseCost + ' ' + t('common.pp') + '/' + t('common.rank')}</span>
      </> : <>
        <span>{t(`rulesInfo.${definition.category}`)}</span>
        {definition.appliesToPower || ['activation', 'removable'].includes(definition.id) ? <span>{t('rulesInfo.powerLevel')}</span> : <span>{definition.costValue > 0 ? '+' : ''}{definition.costValue} {t(`rulesInfo.cost.${definition.costType}`)}</span>}
      </>}
    </div>
    {(action?.provisional || duration?.provisional) && <p>{t('builder.validation.provisional')}</p>}
    {action?.maintenanceAction && <p>{t('builder.validation.maintenance')}: {t(`rulesInfo.action.${action.maintenanceAction}`)}</p>}
    {(definition.longDescription || definition.description).split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    {'options' in definition && !!definition.options?.length && <ul>{definition.options.map(option => <li key={option.label}><strong>{option.label}</strong>{option.notes && `: ${option.notes}`}</li>)}</ul>}
  </>;
}

function AppliedModifierDescription({ reference, effectName }: { reference: ModifierReference; effectName?: string }) {
  const { t, i18n } = useTranslation();
  const { applied, definition, source } = reference;
  const subtype = definition?.subtypes?.find(option => option.id === applied.options?.subtypeId);
  const optionLabel = applied.option || subtype?.i18n?.[i18n.language]?.label || subtype?.label;
  return <>
    <div className="reference-meta">
      {effectName && <span>{effectName}</span>}
      <span>{t('common.ranks')}: {applied.ranks}</span>
      {source === 'power-specific' && <span>{t('rulesInfo.specific')}</span>}
      {applied.affectedRanks !== undefined && <span>{t('rulesInfo.affectedRanks', { count: applied.affectedRanks })}</span>}
      {optionLabel && <span>{optionLabel}</span>}
    </div>
    <ModifierDefinitionNotice effectId={reference.effectId} modifierId={applied.modifierId} detailed />
    <RuleDescription definition={definition && subtype ? { ...definition, costValue: subtype.costValue } : definition} />
  </>;
}

function EffectDescription({ reference }: { reference: ComponentReference }) {
  const { t } = useTranslation();
  const { component, definition, modifiers } = reference;
  return <section className="reference-section">
    <h3>{definition?.name ?? component.effectId} · {component.ranks} {t('common.ranks')}</h3>
    <RuleDescription definition={definition} component={component} />
    {afflictionSummary(component, key => t(key), definition, MODIFIER_DEFS).map(line => <p key={line}>{line}</p>)}
    {modifiers.map((modifier, index) => <details key={index}>
      <summary>{modifier.definition?.name ?? modifier.applied.modifierId}</summary>
      <AppliedModifierDescription reference={modifier} />
    </details>)}
  </section>;
}

export function PowerReferenceDialog({ target, onClose }: { target: PowerReferenceTarget; onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const effectTarget = target.kind === 'effect' ? buildPowerReferences([target.reference.component], POWER_DEFS, MODIFIER_DEFS, i18n.language)[0] : undefined;
  const modifierEffect = target.kind === 'modifier' ? POWER_DEFS.find(effect => effect.id === target.reference.effectId) : undefined;
  const modifierDefinition = target.kind === 'modifier' ? modifierEffect ? resolveModifierDefinition(target.reference.applied, modifierEffect, MODIFIER_DEFS).definition : target.reference.definition : undefined;
  const modifierTarget = target.kind === 'modifier' ? { ...target.reference, definition: modifierDefinition && localizeReference(modifierDefinition, i18n.language) } : undefined;
  if (target.kind === 'modifier') return <InfoDialog isOpen title={modifierTarget?.definition?.name ?? target.reference.applied.modifierId} onClose={onClose}>
    <AppliedModifierDescription reference={modifierTarget!} effectName={target.effectName} />
  </InfoDialog>;
  if (target.kind === 'effect') return <InfoDialog isOpen title={effectTarget?.definition?.name ?? target.reference.component.effectId} onClose={onClose}>
    <EffectDescription reference={effectTarget!} />
  </InfoDialog>;
  const power = target.power;
  const references = buildPowerReferences(power.components, POWER_DEFS, MODIFIER_DEFS, i18n.language);
  const powerModifiers = ['activation' in power && power.activation ? 'activation' : '', 'removable' in power && power.removable && power.removable !== 'none' ? 'removable' : ''].filter(Boolean);
  return <InfoDialog isOpen title={power.name || t('powers.unnamed')} onClose={onClose}>
    {'descriptors' in power && !!power.descriptors?.length && <div className="reference-meta">{power.descriptors.map((descriptor, index) => <span key={index}>{descriptor}</span>)}</div>}
    {power.notes && <p>{power.notes}</p>}
    {references.map(reference => <EffectDescription key={reference.component.id} reference={reference} />)}
    {powerModifiers.map(id => {
      const definition = MODIFIER_DEFS.find(modifier => modifier.id === id);
      return <section className="reference-section" key={id}><h3>{definition && localizeReference(definition, i18n.language).name}</h3><RuleDescription definition={definition && localizeReference(definition, i18n.language)} /></section>;
    })}
    {'alternateEffects' in power && !!power.alternateEffects.length && <section className="reference-section">
      <h3>{t('rulesInfo.alternates')}</h3>
      {power.alternateEffects.map(alternate => <details key={alternate.id}><summary>{alternate.name || t('rulesInfo.alternate')}{alternate.dynamic ? ` · ${t('rulesInfo.dynamic')}` : ''}</summary>
        {alternate.notes && <p>{alternate.notes}</p>}
        {buildPowerReferences(alternate.components, POWER_DEFS, MODIFIER_DEFS, i18n.language).map(reference => <EffectDescription key={reference.component.id} reference={reference} />)}
      </details>)}
    </section>}
  </InfoDialog>;
}
