import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTraitValues } from '../../shared/hooks/useTraitValues';
import { useResourcesStore } from '../../store/resourcesStore';
import { useCharactersStore } from '../../store/charactersStore';
import { getPowerSources, powerBranches, isPermanentComponent, type PowerSource } from '../../shared/lib/powerUsage';
import type { IPowerUsage } from '../../entities/types';
import { NumberInput } from '../../shared/ui/NumberInput';
import { POWER_DEFS } from '../../entities/gameDataLoaders';
import './traitModifiers.css';

export function TraitUsagePanel() {
  const { t } = useTranslation();
  const state = useTraitValues();
  const resources = useResourcesStore(store => store.resources);
  const sources = getPowerSources(state.original, resources).filter(source => powerBranches(source.power).some(branch => branch.components.some(component => component.effectId === 'enhanced-trait')) || state.original.powerUsage?.[source.key]);
  if (!sources.length) return null;
  return <section className="panel"><details><summary className="panel-title">{t('traits.usage')}</summary><p>{t('traits.usageHint')}</p><div className="trait-usage">{sources.map(source => <UsageRow key={`${state.characterId}:${source.key}`} source={source} />)}</div></details>{state.warnings.map((warning, index) => <p className="trait-warning" key={`${warning.key}:${index}`}>{t(warning.key, warning.params)}</p>)}</section>;
}
function UsageRow({ source }: { source: PowerSource }) {
  const { t, i18n } = useTranslation();
  const { original, characterId } = useTraitValues();
  const usage = original.powerUsage?.[source.key] ?? {};
  const branches = powerBranches(source.power);
  const branch = branches.find(item => item.id === (usage.branchId ?? 'base')) ?? branches[0];
  const permanent = branch.components.every(isPermanentComponent);
  const [expanded, setExpanded] = useState(false);
  function update(patch: Partial<IPowerUsage>) {
    if (!characterId) return;
    const current = useCharactersStore.getState().getCharacterById(characterId)?.character;
    if (current) useCharactersStore.getState().updateCharacter(characterId, { powerUsage: { ...current.powerUsage, [source.key]: { ...current.powerUsage?.[source.key], ...patch } } });
  }
  const defaultAllocations = Object.fromEntries(branch.components.map(component => [component.id, component.ranks]));
  return <div className="trait-usage__row"><strong>{source.name}</strong><label><input className="app-checkbox" type="checkbox" checked={permanent || usage.enabled !== false} disabled={permanent} onChange={event => update({ enabled: event.target.checked })} /> {t(permanent ? 'traits.permanent' : 'traits.active')}</label>
    {source.resource && !source.personal && <label><input className="app-checkbox" type="checkbox" checked={usage.recipient === 'character'} onChange={event => update({ recipient: event.target.checked ? 'character' : 'resource' })} /> {t('traits.recipient')}</label>}
    {branches.length > 1 && <select aria-label={t('traits.branch')} value={branch.id} onChange={event => update({ branchId: event.target.value, allocations: undefined })}>{branches.map(item => <option key={item.id} value={item.id}>{item.id === 'base' ? t('builder.baseEffect') : item.name || t('builder.alternateEffects')} {item.dynamic ? `· ${t('builder.dynamic')}` : ''}</option>)}</select>}
    {branch.dynamic && <button type="button" className="trait-control__add" onClick={() => setExpanded(value => !value)}>{t('traits.allocate')}</button>}
    {branch.dynamic && (expanded || usage.allocations) && <div className="trait-usage__allocation">{branches.filter(item => item.dynamic).flatMap(item => item.components.map(component => { const effect = POWER_DEFS.find(def => def.id === component.effectId); return <label key={component.id}>{item.name} · {effect?.i18n?.[i18n.language]?.name ?? effect?.name ?? component.effectId}<NumberInput variant="small" value={(usage.allocations ?? defaultAllocations)[component.id] ?? 0} min={0} max={component.ranks} onChange={ranks => update({ allocations: { ...(usage.allocations ?? defaultAllocations), [component.id]: ranks } })} /></label>; }))}</div>}
  </div>;
}
