import { useDeferredValue, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Search, X } from 'lucide-react';
import { POWER_LIBRARY_INDEX, POWER_PROFILES, loadPowerProfile, searchLibrary, type LibraryEntry } from '../../data/power-library';
import type { ICharacterPower, ICharacterPowerComponent } from '../../entities/types';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { calculatePowerPricing } from '../../shared/lib/mathEngine';
import { validateRequiredPowerFields } from '../../shared/lib/validation';
import { useDialogFocus } from '../../shared/hooks/useDialogFocus';
import { NumberInput } from '../../shared/ui/NumberInput';
import { Tooltip } from '../../shared/ui/Tooltip';
import { ConfigurableFieldSelector } from '../power-builder/components/ConfigurableFieldSelector';
import { EffectReference } from '../power-builder/components/EffectReference';
import { SenseTraitsEditor } from '../power-builder/components/SenseTraitsEditor';
import { SENSE_TRAITS } from '../../data/senseTraits';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { resolveModifierDefinition } from '../../shared/lib/rulesCatalog';
import type { IPowerEffect } from '../../entities/types';
import { applyPowerTemplate, canApplyPowerTemplate } from './powerTemplateApplication';
import { instantiatePowerTemplate } from './powerTemplateInstantiation';
import { libraryText, type PowerLibraryTarget, type PowerTemplate } from './types';
import './powerLibrary.css';

interface Props {
  power: ICharacterPower; target: PowerLibraryTarget; strength: number; costUnit: 'PP' | 'EP';
  onApply: (recipe: ICharacterPower, useName: boolean) => void; onClose: () => void;
}
export function PowerLibraryDialog({ power, target, strength, costUnit, onApply, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const effects = useLocalizedData(POWER_DEFS) as IPowerEffect[];
  const contentRef = useRef<HTMLDivElement>(null);
  const request = useRef(0);
  const titleId = useId();
  useDialogFocus(contentRef, true, onClose);
  const [query, setQuery] = useState('');
  const [profile, setProfile] = useState('');
  const [selected, setSelected] = useState<PowerTemplate | null>(null);
  const [draft, setDraft] = useState<ICharacterPower | null>(null);
  const [useName, setUseName] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [pending, setPending] = useState<LibraryEntry | null>(null);
  const results = searchLibrary(POWER_LIBRARY_INDEX, useDeferredValue(query), profile, language);
  const select = async (entry: LibraryEntry) => {
    const serial = ++request.current;
    setPending(entry); setStatus('loading'); setSelected(null); setDraft(null);
    try {
      const templates = await loadPowerProfile(entry.profileId);
      if (request.current !== serial) return;
      const template = templates.find(candidate => candidate.id === entry.id);
      if (!template) throw new Error('Missing template');
      setSelected(template); setDraft(instantiatePowerTemplate(template, 1, language));
      setUseName(false); setStatus('idle');
    } catch { if (request.current === serial) setStatus('error'); }
  };
  const compatible = draft && canApplyPowerTemplate(power, draft, target);
  const pricing = draft ? calculatePowerPricing(draft, POWER_DEFS, MODIFIER_DEFS, strength) : null;
  const allComponents = draft ? [...draft.components, ...draft.alternateEffects.flatMap(ae => ae.components)] : [];
  const originalComponents = selected ? [...selected.components, ...(selected.alternateEffects ?? []).flatMap(ae => ae.components)] : [];
  const missingFields = allComponents.some((component, index) => {
    const original = originalComponents[index];
    return validateRequiredPowerFields(component, POWER_DEFS.find(effect => effect.id === component.effectId))
      || original.choices?.some(choice => !component.fieldValues?.[choice.id])
      || (original.chooseSenses && (!component.senseTraits?.length || component.senseTraits.some(trait => {
        const definition = SENSE_TRAITS.find(item => item.id === trait.id);
        return !definition || (definition.requiresSense && !trait.senseType) || (definition.requiresDetail && !trait.detail?.trim());
      })));
  });
  const applied = compatible && draft ? applyPowerTemplate(power, draft, target, useName) : null;
  const finalPricing = applied ? calculatePowerPricing(applied, POWER_DEFS, MODIFIER_DEFS, strength) : null;
  const cost = (value: NonNullable<typeof pricing>) => costUnit === 'EP' ? value.equipmentTotal : value.total;
  const update = (id: string, values: Partial<ICharacterPowerComponent>) => setDraft(previous => previous && ({ ...previous,
    components: previous.components.map(component => component.id === id ? { ...component, ...values } : component),
    alternateEffects: previous.alternateEffects.map(ae => ({ ...ae, components: ae.components.map(component => component.id === id ? { ...component, ...values } : component) })),
  }));
  const targetName = target.kind === 'alternate'
    ? power.alternateEffects.find(ae => ae.id === target.alternateId)?.name || t('builder.addAlternate')
    : target.alternateId ? t('builder.addLinkedEffect') : power.components[0]?.id === target.componentId ? t('builder.baseEffect') : t('builder.addLinkedEffect');
  const apply = () => {
    if (!draft) return;
    const choices = allComponents.flatMap((component, index) => (originalComponents[index].choices ?? []).map(choice => {
      const value = component.fieldValues?.[choice.id];
      const option = choice.options.find(item => item.value === value);
      return option ? `${libraryText(choice.label, language)}: ${libraryText(option.label, language)}` : '';
    })).filter(Boolean);
    onApply({ ...draft, notes: [draft.notes, ...choices].join('\n') }, useName);
  };

  return <div className="power-library-overlay" onClick={onClose}>
    <div ref={contentRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={`power-library-dialog ${draft || status !== 'idle' ? 'power-library-dialog--detail' : ''}`} onClick={event => event.stopPropagation()}>
      <header><div><h2 id={titleId}>{t('powerLibrary.title')}</h2><p>{t('powerLibrary.target', { name: targetName })}</p></div><button type="button" aria-label={t('builder.close')} onClick={onClose}><X size={20}/></button></header>
      <div className="power-library-filters"><label className="power-library-search"><Search size={17}/><input autoFocus value={query} placeholder={t('powerLibrary.search')} aria-label={t('powerLibrary.search')} onChange={event => setQuery(event.target.value)}/></label>
        <select className="app-select" aria-label={t('powerLibrary.profile')} value={profile} onChange={event => setProfile(event.target.value)}><option value="">{t('powerLibrary.allProfiles')}</option>{POWER_PROFILES.filter(item => POWER_LIBRARY_INDEX.some(entry => entry.profileId === item.id)).map(item => <option value={item.id} key={item.id}>{libraryText(item.name, language)}</option>)}</select></div>
      <div className="power-library-workspace">
        <nav className="power-library-profiles" aria-label={t('powerLibrary.profile')}><button type="button" aria-pressed={!profile} onClick={() => setProfile('')}>{t('powerLibrary.allProfiles')}</button>{POWER_PROFILES.filter(item => POWER_LIBRARY_INDEX.some(entry => entry.profileId === item.id)).map(item => <button type="button" key={item.id} aria-pressed={item.id === profile} onClick={() => setProfile(item.id)}>{libraryText(item.name, language)}</button>)}</nav>
        <div className="power-library-results" aria-label={t('powerLibrary.results')}>
          <p className="power-library-count">{t('powerLibrary.count', { count: results.length })}</p>
          {results.map(entry => <button type="button" className="power-library-result" key={entry.id} aria-pressed={selected?.id === entry.id} onClick={() => { void select(entry); }}><strong>{libraryText(entry.name, language)}</strong><small>{libraryText(POWER_PROFILES.find(item => item.id === entry.profileId)!.name, language)} · {libraryText(entry.section, language)} · p. {entry.page}{entry.referenceOnly ? ` · ${t('powerLibrary.referenceOnly')}` : ''}</small><span>{libraryText(entry.summary, language)}</span></button>)}
          {!results.length && <p>{t('powerLibrary.noResults')}</p>}
        </div>
        <section className="power-library-preview" aria-label={t('powerLibrary.preview')}>
          <button type="button" className="power-library-back" onClick={() => { request.current++; setDraft(null); setSelected(null); setStatus('idle'); }}><ArrowLeft size={16}/>{t('powerLibrary.back')}</button>
          {status === 'loading' && <p role="status">{t('powerLibrary.loading')}</p>}
          {status === 'error' && <div role="alert"><p>{t('powerLibrary.loadError')}</p><button type="button" onClick={() => { if (pending) void select(pending); }}>{t('powerLibrary.retry')}</button></div>}
          {selected && draft && pricing ? <>
            <h3>{libraryText(selected.name, language)}</h3><p>{libraryText(selected.summary, language)}</p><p className="power-library-source">Power Profiles · p. {selected.page}{language.startsWith('pt') ? ` · ${selected.name.en}` : ''}</p>
            {selected.audit.discrepancy && <p role="note" className="power-library-discrepancy">{libraryText(selected.audit.discrepancy.reason, language)}</p>}
            {selected.requiresCharacterChanges && <p role="alert" className="power-library-discrepancy">{libraryText(selected.requiresCharacterChanges, language)}</p>}
            {selected.sourceFormula && <details className="power-library-book-reference"><summary>{t('powerLibrary.sourceFormula')}</summary><p>{selected.sourceFormula}</p></details>}
            {allComponents.map((component, index) => {
              const definition = effects.find(effect => effect.id === component.effectId);
              const originalComponent = originalComponents[index];
              if (!definition) return null;
              return <article className="power-library-component" key={component.id}>
                <div className="power-library-component-header"><strong>{definition.name}</strong>{originalComponent.scalable ? <NumberInput value={originalComponent.modifierRanksOnly ? component.modifiers.find(modifier => originalComponent.scaledModifiers?.includes(modifier.modifierId))?.ranks ?? 1 : component.ranks / (originalComponent.rankMultiplier ?? 1)} min={1} onChange={ranks => update(component.id, { ranks: originalComponent.modifierRanksOnly ? 0 : ranks * (originalComponent.rankMultiplier ?? 1), ...(originalComponent.scaledSenseTraits ? { senseTraits: originalComponent.senseTraits?.map(trait => ({ ...trait, ranks: trait.ranks * ranks })) } : {}), modifiers: component.modifiers.map((modifier, modIndex) => originalComponent.scaledModifiers?.includes(modifier.modifierId) ? { ...modifier, ranks: originalComponent.modifiers[modIndex].ranks * ranks } : modifier) })} aria-label={`${t('builder.ranks')}: ${definition.name}`}/> : <span>{t('powerLibrary.fixedRanks', { count: component.ranks })}</span>}</div>
                <div className="power-library-modifiers">{component.modifiers.map((modifier, modifierIndex) => {
                  const resolved = resolveModifierDefinition(modifier, definition, MODIFIER_DEFS).definition;
                  return <Tooltip key={`${modifier.modifierId}-${modifierIndex}`} content={resolved?.i18n?.[language]?.description ?? resolved?.description ?? ''}><span tabIndex={0}>{resolved?.i18n?.[language]?.name ?? resolved?.name ?? modifier.modifierId}{modifier.ranks > 1 ? ` ${modifier.ranks}` : ''}{modifier.option ? ` (${modifier.option})` : ''}</span></Tooltip>;
                })}</div>
                {component.senseTraits?.length ? <ul className="power-library-purchases">{component.senseTraits.map((trait, traitIndex) => <li key={traitIndex}>{t(`powerLibrary.sense.${trait.id}`, { defaultValue: SENSE_TRAITS.find(item => item.id === trait.id)?.label ?? trait.id })} {trait.ranks}{trait.senseType ? ` · ${trait.senseType}` : ''}{trait.detail ? ` · ${trait.detail}` : ''}</li>)}</ul> : null}
                {Object.entries(component.fieldValues ?? {}).filter(([id]) => !originalComponent.choices?.some(choice => choice.id === id)).map(([id, value]) => <p className="power-library-field-value" key={id}><strong>{definition.configurableFields?.find(field => field.id === id)?.label ?? id}: </strong>{Array.isArray(value) ? value.join(', ') : value}</p>)}
                {definition.configurableFields?.some(field => field.required && !originalComponent.fieldValues?.[field.id]) && <ConfigurableFieldSelector fields={definition.configurableFields} values={component.fieldValues ?? {}} onChange={(id, value) => update(component.id, { fieldValues: { ...component.fieldValues, [id]: value } })} t={t}/>}
                {originalComponent.choices?.map(choice => <label className="power-library-choice" key={choice.id}>{libraryText(choice.label, language)}<select className="app-select" value={component.fieldValues?.[choice.id] as string ?? ''} onChange={event => update(component.id, { fieldValues: { ...component.fieldValues, [choice.id]: event.target.value } })}><option value="">{t('builder.selectOption')}</option>{choice.options.map(option => <option key={option.value} value={option.value}>{libraryText(option.label, language)}</option>)}</select></label>)}
                {originalComponent.chooseSenses && <SenseTraitsEditor traits={component.senseTraits ?? []} onChange={senseTraits => update(component.id, { senseTraits, ranks: senseTraits.reduce((sum, trait) => sum + trait.ranks, 0) })}/>}
                <details><summary>{t('powerLibrary.effectInfo')}</summary><EffectReference effect={definition} component={component} t={t}/></details>
              </article>;
            })}
            {draft.alternateEffects.length > 0 && <p>{t('powerLibrary.includesAlternates', { count: draft.alternateEffects.length })}</p>}
            <label className="power-library-name-option"><input className="app-checkbox" type="checkbox" checked={useName} onChange={event => setUseName(event.target.checked)}/>{t('powerLibrary.useName')}</label>
            <p className="power-library-impact">{t(draft.alternateEffects.length ? 'powerLibrary.replaceArray' : target.kind === 'alternate' ? 'powerLibrary.replaceAlternate' : 'powerLibrary.replaceComponent')}</p>
            {!compatible && <p role="alert">{t('powerLibrary.incompatible')}</p>}
            {missingFields && <p role="status">{t('powerLibrary.requiredChoices')}</p>}
            <footer><div><strong>{cost(pricing)} {costUnit}</strong>{finalPricing && <small>{t('powerLibrary.resultTotal', { cost: cost(finalPricing), unit: costUnit })}</small>}</div><button type="button" className="power-library-apply" disabled={!compatible || missingFields || pricing.diagnostics.length > 0 || !!selected.requiresCharacterChanges} onClick={apply}>{t(draft.alternateEffects.length ? 'powerLibrary.applyArray' : 'powerLibrary.apply')}</button></footer>
          </> : status === 'idle' && <p>{t('powerLibrary.choose')}</p>}
        </section>
      </div>
    </div>
  </div>;
}
