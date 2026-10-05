import { useMemo, useState } from 'react';
import { replaceResourcePower } from '../../shared/lib/powerEditing';
import { Archive, Copy, Edit3, Plus, Trash2, Wand2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ICharacterPower, IResource, IResourceFeature, IVehicleResource, IHeadquartersResource, ResourceType } from '../../entities/types';
import { useResourcesStore } from '../../store/resourcesStore';
import { useCharactersStore } from '../../store/charactersStore';
import { useActiveCharacter } from '../../shared/hooks/useActiveCharacter';
import { useAppDialog } from '../../shared/ui/appDialogContext';
import { getResourceCost, getResourceCostDetails, getVehicleBaseTraits, changeVehicleSize, isDeviceResource } from '../../shared/lib/resourceCalculations';
import { getCharacterStrength } from '../../shared/lib/componentRanks';
import { getResourcePowerWarnings } from '../../shared/lib/resourceWarnings';
import { needsResourceReview } from '../../shared/lib/resourceReview';
import { Button } from '../../shared/ui/Button';
import { Modal } from '../../shared/ui/Modal';
import { NumberInput } from '../../shared/ui/NumberInput';
import { createId } from '../../shared/lib/identity';
import { resolveResourceEditTarget, type ResourceEditTarget, type ResourcePowerTarget } from '../../shared/lib/resourcePowers';
import { ResourcePowerSummary } from './ResourcePowerSummary';
import { duplicateResource, getResourceCopyName } from '../../shared/lib/resourceDuplication';
import { Tooltip } from '../../shared/ui/Tooltip';
import { PowerBuilderOverlay } from '../power-builder/PowerBuilderOverlay';
import { ResourceReviewDialog } from './ResourceReviewDialog';
import './resources.css';

const TYPES: ResourceType[] = ['gadget', 'gear', 'vehicle', 'headquarters', 'custom'];
const VEHICLE_SIZES: IVehicleResource['size'][] = ['medium', 'large', 'huge', 'gargantuan', 'colossal', 'awesome'];
const HQ_SIZES: IHeadquartersResource['size'][] = ['miniscule', 'fine', 'diminutive', 'tiny', 'small', 'medium', 'large', 'huge', 'gargantuan', 'colossal', 'awesome'];
function blankPower(): ICharacterPower { return { id: createId(), name: '', components: [{ id: createId(), effectId: '', ranks: 1, modifiers: [], fieldValues: {} }], notes: '', alternateEffects: [] }; }
function makeResource(type: ResourceType, level: number): IResource {
  const base = { id: createId(), name: '', notes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  if (type === 'vehicle') return { ...base, type, size: 'medium', strength: 0, speed: 0, defense: 0, toughness: 5, features: [], systems: [] };
  if (type === 'headquarters') return { ...base, type, size: 'small', toughness: 6, powerLevel: level, features: [], effects: [] };
  return { ...base, type, costMode: type === 'gadget' ? 'device' : 'equipment', power: { ...blankPower(), ...(type === 'gadget' ? { removable: 'removable' as const } : {}) } };
}
export function ResourcesView({ initialEditTarget, initialCreateType }: {
  initialEditTarget?: ResourceEditTarget;
  initialCreateType?: ResourceType;
}) {
  const { t, i18n } = useTranslation();
  const { character } = useActiveCharacter();
  const resources = useResourcesStore((state) => state.resources);
  const saveError = useResourcesStore((state) => state.storageError);
  const [editing, setEditing] = useState<{ resource: IResource; isNew: boolean } | null>(() => {
    if (initialCreateType) return { resource: makeResource(initialCreateType, character.header.powerLevel), isNew: true };
    const resolved = resolveResourceEditTarget(resources, initialEditTarget);
    return resolved?.target.kind === 'traits' ? { resource: resolved.resource, isNew: false } : null;
  });
  const [powerTarget, setPowerTarget] = useState<ResourcePowerTarget | null>(() => {
    if (initialCreateType) return null;
    const resolved = resolveResourceEditTarget(resources, initialEditTarget);
    return resolved && resolved.target.kind !== 'traits' ? resolved.target : null;
  });
  const [review, setReview] = useState(false);
  const dialog = useAppDialog();
  const ordered = useMemo(() => [...resources].sort((a, b) => a.name.localeCompare(b.name, i18n.language, { sensitivity: 'base', numeric: true })), [resources, i18n.language]);
  const targetResource = resources.find((resource) => resource.id === powerTarget?.resourceId);
  const currentPower = targetResource && (targetResource.type === 'vehicle' ? powerTarget?.kind === 'movement' ? targetResource.movement : targetResource.systems.find((power) => power.id === powerTarget?.powerId) : targetResource.type === 'headquarters' ? targetResource.effects.find((power) => power.id === powerTarget?.powerId) : targetResource.power);
  const builderContext = useMemo(() => targetResource && powerTarget ? { resource: targetResource, kind: powerTarget.kind, effectId: powerTarget.powerId } : undefined, [targetResource, powerTarget]);
  function save(resource: IResource) {
    const state = useResourcesStore.getState();
    const current = state.getResource(resource.id);
    // Trait editing must retain systems which may have changed in another editor.
    const merged = current && resource.type === 'vehicle' && current.type === 'vehicle' ? { ...resource, systems: current.systems, movement: current.movement } : current && resource.type === 'headquarters' && current.type === 'headquarters' ? { ...resource, effects: current.effects, effectSettings: current.effectSettings } : current && resource.type !== 'vehicle' && resource.type !== 'headquarters' && current.type !== 'vehicle' && current.type !== 'headquarters' ? { ...resource, power: { ...current.power, removable: resource.power.removable } } : resource;
    const next = { ...merged, updatedAt: new Date().toISOString() };
    if (editing?.isNew ? state.addResource(next) : state.updateResource(next)) setEditing(null);
  }
  async function remove(resource: IResource) {
    if (useCharactersStore.getState().tabs.some((tab) => tab.character.resourceLinks?.some((link) => link.resourceId === resource.id))) { await dialog.alert({ title: t('resources.deleteInUseTitle'), message: t('resources.deleteInUse', { count: useCharactersStore.getState().tabs.filter((tab) => tab.character.resourceLinks?.some((link) => link.resourceId === resource.id)).length }) }); return; }
    if (await dialog.confirm({ title: t('resources.deleteTitle'), message: t('resources.deleteConfirm', { name: resource.name || t('resources.unnamed') }), confirmLabel: t('common.delete'), danger: true })) {
      if (useCharactersStore.getState().tabs.some((tab) => tab.character.resourceLinks?.some((link) => link.resourceId === resource.id))) return;
      useResourcesStore.getState().removeResource(resource.id);
    }
  }
  function duplicate(resourceId: string) {
    const state = useResourcesStore.getState();
    const original = state.getResource(resourceId);
    if (!original) return;
    const name = getResourceCopyName(t('resources.copyName', { name: original.name || t('resources.unnamed') }), state.resources);
    const copy = duplicateResource(original, name);
    if (state.addResource(copy)) setEditing({ resource: copy, isNew: false });
  }
  function savePower(power: ICharacterPower) {
    if (!powerTarget) return;
    const state = useResourcesStore.getState(), current = state.getResource(powerTarget.resourceId);
    if (!current) return;
    const next = replaceResourcePower(current, powerTarget, power);
    if (!next) return;
    if (state.updateResource({ ...next, updatedAt: new Date().toISOString() })) setPowerTarget(null);
  }
  async function removePower(resource: IResource, id: string) {
    if (!await dialog.confirm({ message: t('resources.removePowerConfirm'), confirmLabel: t('common.remove'), danger: true })) return;
    const current = useResourcesStore.getState().getResource(resource.id);
    if (current?.type === 'vehicle') useResourcesStore.getState().updateResource({ ...current, systems: current.systems.filter((power) => power.id !== id) });
    else if (current?.type === 'headquarters') useResourcesStore.getState().updateResource({ ...current, effects: current.effects.filter((power) => power.id !== id) });
  }
  return <div className="resources-view">
    <header className="resources-view__header"><div><h1><Archive size={21} /> {t('resources.title')}</h1><p>{t('resources.libraryHint')}</p></div><div className="resources-view__new">{TYPES.map((type) => <Button key={type} size="sm" variant="secondary" onClick={() => setEditing({ resource: makeResource(type, character.header.powerLevel), isNew: true })}><Plus size={14} /> {t(`resources.type.${type}`)}</Button>)}</div></header>
    {resources.some(needsResourceReview) && <div className="resource-notice"><p>{t('resources.review.pending')}</p><Button size="sm" onClick={() => setReview(true)}>{t('resources.review.title')}</Button></div>}
    <div className="resources-view__grid">{ordered.map((resource) => {
      const cost = getResourceCost(resource, undefined, undefined, getCharacterStrength(character));
      const powers = resource.type === 'vehicle' ? resource.systems : resource.type === 'headquarters' ? resource.effects : [];
      return <article className="resource-card" key={resource.id}>
        <div className="resource-card__top"><span>{t(`resources.type.${resource.type}`)}</span><div><Tooltip content={t('resources.duplicate')}><button onClick={() => duplicate(resource.id)} aria-label={t('resources.duplicate')}><Copy size={16}/></button></Tooltip><Tooltip content={t('resources.editInLibrary')}><button onClick={() => setEditing({ resource, isNew: false })} aria-label={t('common.edit')}><Edit3 size={16}/></button></Tooltip><button onClick={() => void remove(resource)} aria-label={t('common.delete')}><Trash2 size={16}/></button></div></div>
        <h2>{resource.name || t('resources.unnamed')}</h2>{resource.notes && <p>{resource.notes}</p>}
        {resource.type === 'vehicle' && <p>{t(`resources.size.${resource.size}`)} · {t('resources.strengthShort')} {resource.strength} · {t('resources.defense')} {resource.defense} · {t('resources.toughness')} {resource.toughness}</p>}
        {resource.type === 'headquarters' && <p>{t(`resources.size.${resource.size}`)} · {t('resources.toughness')} {resource.toughness} · {t('resources.hq.level')} {resource.powerLevel ?? 10}</p>}
        {(resource.type === 'vehicle' || resource.type === 'headquarters') && resource.features.length > 0 && <ul className="resource-card__features">{resource.features.map((feature) => <li key={feature.id}>{feature.name || t('resources.feature')} {(feature.ranks ?? 1) > 1 ? `×${feature.ranks}` : ''}{feature.notes && <small>{feature.notes}</small>}</li>)}</ul>}
        {resource.type === 'vehicle' && (resource.movement ? <ResourcePowerSummary power={resource.movement} label={t('resources.movement')} onEdit={() => setPowerTarget({ resourceId: resource.id, kind: 'movement', powerId: resource.movement!.id })}/> : <div className="resource-card__power"><span>{t('resources.movement')}: {resource.speed ? `${t('resources.movement.speed')} ${resource.speed}` : t('resources.movement.none')}</span><button aria-label={t('resources.movement.edit')} onClick={() => setPowerTarget({ resourceId: resource.id, kind: 'movement' })}><Wand2 size={16}/></button></div>)}
        {resource.type === 'vehicle' || resource.type === 'headquarters' ? <><div className="resource-card__power"><b>{t(resource.type === 'vehicle' ? 'resources.systems' : 'resources.effects')}</b><button onClick={() => setPowerTarget({ resourceId: resource.id, kind: resource.type === 'vehicle' ? 'system' : 'headquarters-effect' })}><Plus size={14}/> {t('common.add')}</button></div>{powers.map((power) => <div className="resource-card__system" key={power.id}><ResourcePowerSummary power={power} onEdit={() => setPowerTarget({ resourceId: resource.id, kind: resource.type === 'vehicle' ? 'system' : 'headquarters-effect', powerId: power.id })} onRemove={() => void removePower(resource, power.id)}/>{resource.type === 'headquarters' && <><label>{t('resources.hq.kind')}<select value={resource.effectSettings?.[power.id]?.kind ?? 'effect'} onChange={(event) => {
          const current = useResourcesStore.getState().getResource(resource.id);
          if (current?.type === 'headquarters') useResourcesStore.getState().updateResource({ ...current, effectSettings: { ...current.effectSettings, [power.id]: { ...current.effectSettings?.[power.id], target: current.effectSettings?.[power.id]?.target ?? 'resource', kind: event.target.value as 'effect' | 'defense-system' } } });
        }}><option value="effect">{t('resources.hq.effect')}</option><option value="defense-system">{t('resources.hq.defenseSystem')}</option></select></label><label>{t('resources.hq.target')}<select value={resource.effectSettings?.[power.id]?.target ?? 'resource'} onChange={(event) => {
          const current = useResourcesStore.getState().getResource(resource.id);
          if (current?.type === 'headquarters') useResourcesStore.getState().updateResource({ ...current, effectSettings: { ...current.effectSettings, [power.id]: { ...current.effectSettings?.[power.id], kind: current.effectSettings?.[power.id]?.kind ?? 'effect', target: event.target.value as 'resource' | 'occupants' | 'both' } } });
        }}>{['resource', 'occupants', 'both'].map((target) => <option key={target} value={target}>{t(`resources.hq.target.${target}`)}</option>)}</select></label>{getResourcePowerWarnings(resource, power, character).map((warning) => <p className="resource-warning" key={warning.key}>{t(warning.key, warning.values)}</p>)}</>}</div>)}</>
          : <ResourcePowerSummary power={resource.power} onEdit={() => setPowerTarget({ resourceId: resource.id, kind: 'power', powerId: resource.power.id })}/>}
        <details className="resource-card__cost-details"><summary>{t('resources.totalCost')}</summary><dl>{getResourceCostDetails(resource, getCharacterStrength(character)).map((part, index) => <div key={index}><dt>{part.key ? t(part.key) : part.name || t('resources.unnamedEffect')}</dt><dd>{part.cost} {cost.unit}</dd></div>)}</dl></details>
        <footer>{cost.total} {cost.unit}{needsResourceReview(resource) && <span> · {t('resources.review.required')}</span>}</footer>
      </article>;
    })}{!ordered.length && <p className="resources-view__empty">{t('resources.libraryEmpty')}</p>}</div>
    {editing && <ResourceEditor resource={editing.resource} isNew={editing.isNew} strength={getCharacterStrength(character)} onClose={() => setEditing(null)} onSave={save}/>}
    {builderContext && <PowerBuilderOverlay key={`${builderContext.resource.id}:${builderContext.kind}:${powerTarget?.powerId ?? 'new'}`} existingPower={currentPower && !currentPower.components.length ? { ...currentPower, components: blankPower().components } : currentPower} resourceContext={builderContext} saveError={saveError} equipmentMode={!isDeviceResource(builderContext.resource)} onSave={savePower} onClose={() => setPowerTarget(null)}/>}
    {review && <ResourceReviewDialog resources={resources} character={character} onClose={() => setReview(false)}/>}
  </div>;
}
function ResourceEditor({ resource, isNew, strength, onClose, onSave }: { resource: IResource; isNew: boolean; strength: number; onClose: () => void; onSave: (resource: IResource) => void }) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(resource);
  const saveError = useResourcesStore((state) => state.storageError);
  const cost = getResourceCost(draft, undefined, undefined, strength);
  const base = draft.type === 'vehicle' ? getVehicleBaseTraits(draft.size) : null;
  return <Modal isOpen onClose={onClose} title={t(isNew ? 'resources.createTitle' : 'resources.editTitle')}><div className="resource-editor">
    <label>{t('resources.name')}<input autoFocus value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })}/></label>
    <label>{t('resources.notes')}<textarea rows={3} value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })}/></label>
    {draft.type === 'vehicle' && base && <fieldset><legend>{t('resources.vehicleTraits')}</legend><label>{t('resources.size')}<select value={draft.size} onChange={(event) => setDraft(changeVehicleSize(draft, event.target.value as IVehicleResource['size']))}>{VEHICLE_SIZES.map((size) => <option value={size} key={size}>{t(`resources.size.${size}`)}</option>)}</select></label><p>{t('resources.sizeChangeHint')}</p><div className="resource-fields__numbers">{(['strength', 'defense', 'toughness'] as const).map((key) => <label key={key}>{t(key === 'strength' ? 'resources.strengthShort' : `resources.${key}`)}<NumberInput value={draft[key]} min={base[key]} variant="compact" onChange={(value) => setDraft({ ...draft, [key]: value })}/></label>)}</div><p>{t('resources.movement.builderHint')}</p><FeatureEditor features={draft.features} onChange={(features) => setDraft({ ...draft, features })}/></fieldset>}
    {draft.type === 'headquarters' && <fieldset><legend>{t('resources.headquartersTraits')}</legend><label>{t('resources.size')}<select value={draft.size} onChange={(event) => setDraft({ ...draft, size: event.target.value as IHeadquartersResource['size'] })}>{HQ_SIZES.map((size) => <option value={size} key={size}>{t(`resources.size.${size}`)}</option>)}</select></label><label>{t('resources.toughness')}<NumberInput value={draft.toughness} min={6} variant="compact" onChange={(toughness) => setDraft({ ...draft, toughness })}/></label><label>{t('resources.hq.level')}<NumberInput value={draft.powerLevel ?? 10} min={1} max={100} onChange={(powerLevel) => setDraft({ ...draft, powerLevel })}/></label><p>{t('resources.hq.levelHint')}</p><FeatureEditor features={draft.features} onChange={(features) => setDraft({ ...draft, features })}/></fieldset>}
    {draft.type !== 'vehicle' && draft.type !== 'headquarters' && <><label>{t('resources.costMode')}<select value={draft.costMode ?? 'equipment'} onChange={(event) => setDraft({ ...draft, costMode: event.target.value as 'equipment' | 'device', costReviewRequired: false, power: event.target.value === 'device' && !draft.power.removable ? { ...draft.power, removable: 'removable' } : draft.power })}><option value="equipment">{t('resources.costMode.equipment')}</option><option value="device">{t('resources.costMode.device')}</option></select></label><p>{t('resources.costMode.hint')}</p>{isDeviceResource(draft) && <label>{t('resources.removable')}<select value={draft.power.removable ?? 'none'} onChange={(event) => setDraft({ ...draft, power: { ...draft.power, removable: event.target.value as 'none' | 'removable' | 'easily_removable' } })}>{['none', 'removable', 'easily_removable'].map((value) => <option value={value} key={value}>{t(`resources.removable.${value}`)}</option>)}</select></label>}</>}
    <p className="resource-editor__cost">{t('resources.totalCost')}: <strong>{cost.total} {cost.unit}</strong></p>
    {saveError && <p role="alert" className="resource-warning">{t(saveError)}</p>}
    <div className="resource-editor__actions"><Button variant="ghost" onClick={onClose}>{t('common.cancel')}</Button><Button onClick={() => onSave(draft.type !== 'vehicle' && draft.type !== 'headquarters' ? { ...draft, costReviewRequired: false } : draft)}>{t('common.save')}</Button></div>
  </div></Modal>;
}
function FeatureEditor({ features, onChange }: { features: IResourceFeature[]; onChange: (features: IResourceFeature[]) => void }) {
  const { t } = useTranslation();
  function update(id: string, value: Partial<IResourceFeature>) { onChange(features.map((feature) => feature.id === id ? { ...feature, ...value } : feature)); }
  return <div className="resource-features"><b>{t('resources.features')}</b>{features.map((feature) => <fieldset key={feature.id}><div className="resource-feature__row"><label>{t('resources.feature')}<input value={feature.name} onChange={(event) => update(feature.id, { name: event.target.value })}/></label><label>{t('resources.feature.ranks')}<NumberInput value={feature.ranks ?? 1} min={1} variant="compact" onChange={(ranks) => update(feature.id, { ranks: Math.max(1, Math.trunc(ranks)) })}/></label><button type="button" aria-label={t('common.remove')} onClick={() => onChange(features.filter((item) => item.id !== feature.id))}><Trash2 size={16}/></button></div><label>{t('resources.notes')}<input value={feature.notes ?? ''} onChange={(event) => update(feature.id, { notes: event.target.value })}/></label></fieldset>)}<Button variant="ghost" size="sm" onClick={() => onChange([...features, { id: createId(), name: '', ranks: 1, notes: '' }])}><Plus size={14}/> {t('resources.feature.add')}</Button></div>;
}
