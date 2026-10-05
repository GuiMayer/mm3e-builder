import { useDeferredValue, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import type { ICharacterPower } from '../../entities/types';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { usePersonalLibraryStore } from './personalLibraryStore';
import { instantiatePersonalModel, type PersonalPowerModel } from './personalPowerModel';
import { PowerCompositionPreview, ModelRankInputs } from './PowerCompositionPreview';
import { applyPowerTemplate, canApplyPowerTemplate } from './powerTemplateApplication';
import { calculatePowerPricing } from '../../shared/lib/mathEngine';
import type { PowerLibraryTarget } from './types';
import { DEFAULT_VALIDATION_RULES } from '../../shared/lib/validationRules';
import { getBlockingPowerSaveIssues } from '../power-builder/powerSavePolicy';
import { formatDiagnostic } from '../../shared/lib/formatDiagnostic';

import { searchPersonalModels } from './personalPowerModel';
import { usePersonalLibrarySync } from './usePersonalLibrarySync';

export function PersonalModelDetail({ model, strength, costUnit = 'PP', strengthForPower, onUse, disabled, compatible, resultCost }: {
  model: PersonalPowerModel; strength: number; costUnit?: 'PP' | 'EP'; strengthForPower?: (power: ICharacterPower) => number;
  onUse: (power: ICharacterPower) => void; disabled?: boolean; compatible?: (power: ICharacterPower) => boolean;
  resultCost?: (power: ICharacterPower) => number;
}) {
  const { t, i18n } = useTranslation();
  const [ranks, setRanks] = useState<Record<string, number>>({});
  const preview = useMemo(() => {
    try { return { power: instantiatePersonalModel(model, ranks), error: null }; }
    catch { return { power: null, error: 'personalLibrary.invalidRank' }; }
  }, [model, ranks]);
  const power = preview.power;
  const issues = power ? getBlockingPowerSaveIssues(power, DEFAULT_VALIDATION_RULES, { powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS }) : [];
  const allowed = power && (!compatible || compatible(power));
  return <>
    <h3>{model.name}</h3>{model.description && <p className="personal-notes">{model.description}</p>}
    <ModelRankInputs model={model} ranks={ranks} onChange={setRanks}/>
    {preview.error && <p role="alert">{t(preview.error)}</p>}
    {power && <PowerCompositionPreview power={power} strength={strengthForPower?.(power) ?? strength} costUnit={costUnit}/>}
    {!allowed && power && <p role="status">{t('powerLibrary.incompatible')}</p>}
    {!!issues.length && <p role="status">{t('personalLibrary.completeInBuilder')} {formatDiagnostic(issues[0], t, i18n.language)}</p>}
    {allowed && power && resultCost && <p className="power-library-impact">{t('powerLibrary.resultTotal', { cost: resultCost(power), unit: costUnit })}</p>}
    <button type="button" className="power-library-apply" disabled={disabled || !allowed} onClick={() => { if (power) onUse(power); }}>{t('personalLibrary.use')}</button>
  </>;
}

export function PersonalModelPicker({ power, target, strength, strengthForPower, costUnit, onApply }: { power: ICharacterPower; target: PowerLibraryTarget; strength: number; strengthForPower?: (recipe: ICharacterPower) => number; costUnit: 'PP' | 'EP'; onApply: (recipe: ICharacterPower, useName: boolean) => void }) {
  const { t, i18n } = useTranslation();
  usePersonalLibrarySync();
  const models = usePersonalLibraryStore(state => state.models);
  const error = usePersonalLibraryStore(state => state.error);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [useName, setUseName] = useState(false);
  const selected = models.find(model => model.id === selectedId);
  const results = searchPersonalModels(models, useDeferredValue(query), i18n.language);
  return <div className={`personal-picker ${selected ? 'personal-picker--detail' : ''}`}>
    <label className="power-library-search"><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t('personalLibrary.searchModels')} aria-label={t('personalLibrary.searchModels')}/></label>
    {error && <p role="alert">{t(error)}</p>}
    <div className="personal-picker-workspace"><div className="power-library-results">
      {results.map(model => <button type="button" key={model.id} className="power-library-result" aria-pressed={model.id === selectedId} onClick={() => setSelectedId(model.id)}><strong>{model.name}</strong><span>{model.description}</span></button>)}
      {!results.length && <p>{t('personalLibrary.emptyModels')}</p>}
    </div><section className="power-library-preview" aria-label={t('powerLibrary.preview')}>
      {selected ? <><button type="button" className="power-library-back" onClick={() => setSelectedId(null)}><ArrowLeft size={16}/>{t('powerLibrary.back')}</button>
        <label className="power-library-name-option"><input type="checkbox" className="app-checkbox" checked={useName} onChange={event => setUseName(event.target.checked)}/>{t('powerLibrary.useName')}</label>
        <p className="power-library-impact">{t(selected.power.alternateEffects.length ? 'powerLibrary.replaceArray' : target.kind === 'alternate' ? 'powerLibrary.replaceAlternate' : 'powerLibrary.replaceComponent')}</p>
        <PersonalModelDetail key={`${selected.id}:${selected.updatedAt}`} model={selected} strength={strength} strengthForPower={strengthForPower} costUnit={costUnit} compatible={recipe => canApplyPowerTemplate(power, recipe, target)} resultCost={recipe => {
          const pricing = calculatePowerPricing(applyPowerTemplate(power, recipe, target), POWER_DEFS, MODIFIER_DEFS, strengthForPower?.(recipe) ?? strength);
          return costUnit === 'EP' ? pricing.equipmentTotal : pricing.total;
        }} onUse={recipe => onApply(recipe, useName)}/>
      </> : <p>{t('powerLibrary.choose')}</p>}
    </section></div>
  </div>;
}
