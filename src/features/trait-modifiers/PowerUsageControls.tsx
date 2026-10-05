import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTraitValues } from '../../shared/hooks/useTraitValues';
import { useCharactersStore } from '../../store/charactersStore';
import { powerBranches, isPermanentComponent, powerAllocationSummary, type PowerSource } from '../../shared/lib/powerUsage';
import type { IPowerUsage } from '../../entities/types';
import { NumberInput } from '../../shared/ui/NumberInput';
import { POWER_DEFS } from '../../entities/gameDataLoaders';
import './traitModifiers.css';

export function PowerUsageControls({ source }: { source: PowerSource }) {
  const { t, i18n } = useTranslation();
  const { original, characterId } = useTraitValues();
  const usage = original.powerUsage?.[source.key] ?? {};
  const branches = powerBranches(source.power);
  const branch = branches.find(item => item.id === (usage.branchId ?? 'base')) ?? branches[0];
  const controllable = branch.dynamic ? branches.filter(item => item.dynamic).flatMap(item => item.components) : branch.components;
  const permanent = controllable.length > 0 && controllable.every(isPermanentComponent);
  const [expanded, setExpanded] = useState(false);
  function update(patch: Partial<IPowerUsage>) {
    if (!characterId) return;
    const current = useCharactersStore.getState().getCharacterById(characterId)?.character;
    if (current) useCharactersStore.getState().updateCharacter(characterId, { powerUsage: { ...current.powerUsage, [source.key]: { ...current.powerUsage?.[source.key], ...patch } } });
  }
  const defaultAllocations = Object.fromEntries(branch.components.map(component => [component.id, component.ranks]));
  const pool = branch.dynamic ? powerAllocationSummary(source, usage) : undefined;
  return <div className="trait-usage__row"><label><input className="app-checkbox" type="checkbox" aria-label={`${t('traits.applyEnhancements')} · ${source.name}`} checked={permanent || usage.enabled !== false} disabled={permanent} onChange={event => update({ enabled: event.target.checked })} /> {t(permanent ? 'traits.permanent' : 'traits.applyEnhancements')}</label>
    {source.resource && !source.personal && <label><input className="app-checkbox" type="checkbox" aria-label={`${t('traits.recipient')} · ${source.name}`} checked={usage.recipient === 'character'} onChange={event => update({ recipient: event.target.checked ? 'character' : 'resource' })} /> {t('traits.recipient')}</label>}
    {branches.length > 1 && <select aria-label={`${t('traits.branch')} · ${source.name}`}  value={usage.branchId ?? 'base'} onChange={event => update({ branchId: event.target.value, allocations: undefined })}>{usage.branchId && !branches.some(item => item.id === usage.branchId) && <option value={usage.branchId} disabled>{t('traits.status.invalid')}</option>}{branches.map(item => <option key={item.id} value={item.id}>{item.id === 'base' ? t('builder.baseEffect') : item.name || t('builder.alternateEffects')} {item.dynamic ? `· ${t('builder.dynamic')}` : ''}</option>)}</select>}
    {branch.dynamic && <button type="button" className="trait-control__add" onClick={() => setExpanded(value => !value)}>{t('traits.allocate')}</button>}
    {pool && <small className={pool.cost > pool.budget ? 'trait-warning' : ''}>{t('traits.allocationPool', pool)}</small>}
    {branch.dynamic && (expanded || usage.allocations) && <div className="trait-usage__allocation">{branches.filter(item => item.dynamic).flatMap(item => item.components.map(component => { const effect = POWER_DEFS.find(def => def.id === component.effectId); return <label key={component.id}>{item.name} · {effect?.i18n?.[i18n.language]?.name ?? effect?.name ?? component.effectId}<NumberInput variant="small" value={(usage.allocations ?? defaultAllocations)[component.id] ?? 0} min={0} max={component.ranks} onChange={ranks => update({ allocations: { ...(usage.allocations ?? defaultAllocations), [component.id]: ranks } })} /></label>; }))}</div>}
  </div>;
}
