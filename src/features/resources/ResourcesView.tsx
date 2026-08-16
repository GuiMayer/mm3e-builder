import { useMemo, useState } from 'react';
import { Archive, Edit3, Plus, Trash2, Wand2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ICharacterPower, IHeadquartersResource, IResource, IResourceFeature, IVehicleResource, ResourceType } from '../../entities/types';
import { useResourcesStore } from '../../store/resourcesStore';
import { useCharactersStore } from '../../store/charactersStore';
import { useAppDialog } from '../../shared/ui/appDialogContext';
import { getResourceEPCost, getVehicleBaseTraits } from '../../shared/lib/resourceCalculations';
import { Button } from '../../shared/ui/Button';
import { Modal } from '../../shared/ui/Modal';
import { NumberInput } from '../../shared/ui/NumberInput';
import { createId } from '../../shared/lib/identity';
import { PowerBuilderOverlay } from '../power-builder/PowerBuilderOverlay';

const RESOURCE_TYPES: ResourceType[] = ['gadget', 'gear', 'vehicle', 'headquarters', 'custom'];
const VEHICLE_SIZES: IVehicleResource['size'][] = ['medium', 'large', 'huge', 'gargantuan', 'colossal', 'awesome'];
const HEADQUARTERS_SIZES: IHeadquartersResource['size'][] = ['miniscule', 'fine', 'diminutive', 'tiny', 'small', 'medium', 'large', 'huge', 'gargantuan', 'colossal', 'awesome'];
type PowerTarget = { resource: IResource; index?: number };
type EditingResource = { resource: IResource; isNew: boolean };

function blankPower(): ICharacterPower {
  return { id: createId(), name: '', components: [{ id: createId(), effectId: '', ranks: 1, modifiers: [], fieldValues: {} }], notes: '', alternateEffects: [] };
}
function makeResource(type: ResourceType): IResource {
  const base = { id: createId(), type, name: '', notes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  if (type === 'vehicle') { const traits = getVehicleBaseTraits('medium'); return { ...base, type, size: 'medium', strength: traits.strength, speed: 0, defense: traits.defense, toughness: traits.toughness, features: [], systems: [] }; }
  if (type === 'headquarters') return { ...base, type, size: 'small', toughness: 6, features: [], effects: [] };
  return { ...base, type, power: blankPower() };
}
function featuresToText(features: IResourceFeature[]) { return features.map((feature) => `${feature.name}${feature.ranks && feature.ranks > 1 ? ` x${feature.ranks}` : ''}`).join('\n'); }
function textToFeatures(text: string): IResourceFeature[] { return text.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => { const match = line.match(/^(.*?)(?:\s*[x×]\s*(\d+))?$/i); return { id: createId(), name: match?.[1]?.trim() || line, ranks: match?.[2] ? Number(match[2]) : 1 }; }); }

export function ResourcesView() {
  const { t } = useTranslation();
  const resources = useResourcesStore((state) => state.resources);
  const { addResource, updateResource, removeResource } = useResourcesStore();
  const tabs = useCharactersStore((state) => state.tabs);
  const [editing, setEditing] = useState<EditingResource | null>(null);
  const [powerTarget, setPowerTarget] = useState<PowerTarget | null>(null);
  const dialog = useAppDialog();
  const ordered = useMemo(() => [...resources].sort((a, b) => a.name.localeCompare(b.name)), [resources]);
  const save = (resource: IResource) => {
    const savedResource = { ...resource, updatedAt: new Date().toISOString() };
    if (editing?.isNew) addResource(savedResource);
    else updateResource(savedResource);
    setEditing(null);
  };
  const deleteResource = async (resource: IResource) => {
    const uses = tabs.filter((tab) => (tab.character.resourceLinks ?? []).some((link) => link.resourceId === resource.id)).length;
    if (uses) {
      await dialog.alert({
        title: t('resources.deleteInUseTitle'),
        message: t('resources.deleteInUse', { count: uses }),
      });
      return;
    }
    if (await dialog.confirm({
      title: t('resources.deleteTitle'),
      message: t('resources.deleteConfirm', { name: resource.name || t('resources.unnamed') }),
      confirmLabel: t('common.delete'),
      danger: true,
    })) removeResource(resource.id);
  };
  const currentPower = powerTarget && (powerTarget.resource.type === 'vehicle' ? powerTarget.index === undefined ? undefined : powerTarget.resource.systems[powerTarget.index] : powerTarget.resource.type === 'headquarters' ? powerTarget.index === undefined ? undefined : powerTarget.resource.effects[powerTarget.index] : powerTarget.resource.power);
  const savePower = (power: ICharacterPower) => {
    if (!powerTarget) return;
    const { resource, index } = powerTarget;
    if (resource.type === 'vehicle') updateResource({ ...resource, systems: index === undefined ? [...resource.systems, power] : resource.systems.map((item, i) => i === index ? power : item), updatedAt: new Date().toISOString() });
    else if (resource.type === 'headquarters') updateResource({ ...resource, effects: index === undefined ? [...resource.effects, power] : resource.effects.map((item, i) => i === index ? power : item), updatedAt: new Date().toISOString() });
    else updateResource({ ...resource, power, updatedAt: new Date().toISOString() });
    setPowerTarget(null);
  };
  return <div className="resources-view">
    <header className="resources-view__header"><div><h1><Archive size={21} /> {t('resources.title')}</h1><p>{t('resources.libraryHint')}</p></div><div className="resources-view__new">{RESOURCE_TYPES.map((type) => <Button key={type} size="sm" variant="secondary" onClick={() => setEditing({ resource: makeResource(type), isNew: true })}><Plus size={14} /> {t(`resources.type.${type}`)}</Button>)}</div></header>
    <div className="resources-view__grid">{ordered.map((resource) => <ResourceCard key={resource.id} resource={resource} onEdit={() => setEditing({ resource, isNew: false })} onDelete={() => deleteResource(resource)} onPower={(index) => setPowerTarget({ resource, index })} onRemovePower={(index) => { if (resource.type === 'vehicle') updateResource({ ...resource, systems: resource.systems.filter((_, i) => i !== index), updatedAt: new Date().toISOString() }); if (resource.type === 'headquarters') updateResource({ ...resource, effects: resource.effects.filter((_, i) => i !== index), updatedAt: new Date().toISOString() }); }} />)}{!ordered.length && <div className="resources-view__empty">{t('resources.libraryEmpty')}</div>}</div>
    {editing && <ResourceEditor resource={editing.resource} isNew={editing.isNew} onClose={() => setEditing(null)} onSave={save} />}
    {powerTarget && <PowerBuilderOverlay existingPower={currentPower ?? undefined} equipmentMode onSave={savePower} onClose={() => setPowerTarget(null)} />}
    <style>{`.resources-view { margin:0 auto; max-width:1200px; padding:var(--s-lg); }.resources-view__header { display:flex; gap:var(--s-lg); justify-content:space-between; margin-bottom:var(--s-xl); }.resources-view h1 { align-items:center; display:flex; font-size:1.4rem; gap:var(--s-sm); margin:0 0 var(--s-xs); }.resources-view__header p { color:var(--c-text-muted); margin:0; max-width:650px; }.resources-view__new { align-content:flex-start; display:flex; flex-wrap:wrap; gap:var(--s-xs); justify-content:flex-end; }.resources-view__grid { display:grid; gap:var(--s-md); grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); }.resources-view__empty { border:1px dashed var(--c-border); border-radius:var(--r-md); color:var(--c-text-muted); grid-column:1/-1; padding:var(--s-xl); text-align:center; }@media(max-width:700px){.resources-view{padding:var(--s-md)}.resources-view__header{flex-direction:column}.resources-view__new{justify-content:flex-start}}`}</style>
  </div>;
}

function ResourceCard({ resource, onEdit, onDelete, onPower, onRemovePower }: { resource: IResource; onEdit: () => void; onDelete: () => void; onPower: (index?: number) => void; onRemovePower: (index: number) => void }) {
  const { t } = useTranslation();
  const powers = resource.type === 'vehicle' ? resource.systems : resource.type === 'headquarters' ? resource.effects : [];
  const container = resource.type === 'vehicle' || resource.type === 'headquarters';
  return <article className="resource-card"><div className="resource-card__top"><span>{t(`resources.type.${resource.type}`)}</span><div><button onClick={onEdit} aria-label={t('common.edit')}><Edit3 size={14} /></button><button onClick={onDelete} aria-label={t('common.delete')}><Trash2 size={14} /></button></div></div><h2>{resource.name || t('resources.unnamed')}</h2>{resource.notes && <p>{resource.notes}</p>}{resource.type === 'vehicle' && <p className="traits">{t(`resources.size.${resource.size}`)} · {t('resources.strengthShort')} {resource.strength} · {t('resources.speed')} {resource.speed} · {t('resources.defense')} {resource.defense} · {t('resources.toughness')} {resource.toughness}</p>}{resource.type === 'headquarters' && <p className="traits">{t(`resources.size.${resource.size}`)} · {t('resources.toughness')} {resource.toughness}</p>}{container ? <div className="resource-card__powers"><div><b>{t(resource.type === 'vehicle' ? 'resources.systems' : 'resources.effects')}</b><button onClick={() => onPower()}><Plus size={13} /> {t('common.add')}</button></div>{powers.map((power, index) => <div className="resource-card__power" key={power.id}><button onClick={() => onPower(index)}>{power.name || t('resources.unnamedEffect')}</button><button onClick={() => onRemovePower(index)} aria-label={t('common.remove')}><Trash2 size={13} /></button></div>)}</div> : <button className="resource-card__effects" onClick={() => onPower()}><Wand2 size={14} /> {t('resources.editEffects')}</button>}<footer>{getResourceEPCost(resource)} EP</footer><style>{`.resource-card{background:var(--c-surface);border:1px solid var(--c-border);border-radius:var(--r-md);display:flex;flex-direction:column;gap:var(--s-sm);min-width:0;padding:var(--s-md)}.resource-card__top,.resource-card__powers>div,.resource-card__power{align-items:center;display:flex;justify-content:space-between}.resource-card__top span{color:var(--c-primary);font-size:.7rem;font-weight:700;text-transform:uppercase}.resource-card button{background:transparent;border:0;color:var(--c-text-muted);cursor:pointer;padding:4px}.resource-card button:hover{color:var(--c-primary)}.resource-card h2{font-size:1rem;margin:0}.resource-card p{color:var(--c-text-secondary);font-size:.8rem;margin:0;white-space:pre-wrap}.resource-card .traits{color:var(--c-text-muted)}.resource-card__effects{align-items:center;background:var(--c-primary-muted)!important;border:1px solid var(--c-primary)!important;border-radius:var(--r-sm)!important;color:var(--c-primary)!important;display:flex;gap:var(--s-xs);justify-content:center}.resource-card__powers{border-top:1px solid var(--c-border);padding-top:var(--s-sm)}.resource-card__powers>div:first-child button{align-items:center;color:var(--c-primary);display:flex;font-size:.75rem}.resource-card__power{background:var(--c-surface-elevated);border-radius:var(--r-sm);margin-top:var(--s-xs)}.resource-card__power button:first-child{flex:1;text-align:left}.resource-card footer{border-top:1px solid var(--c-border);color:var(--c-primary);font-weight:700;padding-top:var(--s-sm)}`}</style></article>;
}

function ResourceEditor({ resource, isNew, onClose, onSave }: { resource: IResource; isNew: boolean; onClose: () => void; onSave: (resource: IResource) => void }) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(resource);
  const update = (key: 'name' | 'notes', value: string) => setDraft((current) => ({ ...current, [key]: value }));
  return <Modal isOpen onClose={onClose} title={t(isNew ? 'resources.createTitle' : 'resources.editTitle')} compact><div className="resource-editor"><label>{t('resources.name')}<input value={draft.name} onChange={(event) => update('name', event.target.value)} autoFocus /></label><label>{t('resources.notes')}<textarea value={draft.notes} onChange={(event) => update('notes', event.target.value)} rows={3} /></label>{draft.type === 'vehicle' && <VehicleFields resource={draft} onChange={setDraft} />}{draft.type === 'headquarters' && <HeadquartersFields resource={draft} onChange={setDraft} />}<div><Button variant="ghost" onClick={onClose}>{t('common.cancel')}</Button><Button onClick={() => onSave(draft)}>{t('common.save')}</Button></div></div><style>{`.resource-editor{display:flex;flex-direction:column;gap:var(--s-md);min-width:min(420px,75vw)}.resource-editor label{color:var(--c-text-secondary);display:flex;flex-direction:column;font-size:.8rem;gap:var(--s-xs)}.resource-editor input,.resource-editor textarea,.resource-editor select{background:var(--c-surface-elevated);border:1px solid var(--c-border);border-radius:var(--r-sm);color:var(--c-text);font:inherit;padding:var(--s-sm)}.resource-editor>div:last-child{display:flex;gap:var(--s-sm);justify-content:flex-end}`}</style></Modal>;
}

function VehicleFields({ resource, onChange }: { resource: IVehicleResource; onChange: (resource: IVehicleResource) => void }) {
  const { t } = useTranslation();
  const base = getVehicleBaseTraits(resource.size);
  return <fieldset className="resource-fields"><legend>{t('resources.vehicleTraits')}</legend><label>{t('resources.size')}<select value={resource.size} onChange={(event) => { const size = event.target.value as IVehicleResource['size']; const traits = getVehicleBaseTraits(size); onChange({ ...resource, size, strength: traits.strength, defense: traits.defense, toughness: traits.toughness }); }}>{VEHICLE_SIZES.map((size) => <option value={size} key={size}>{t(`resources.size.${size}`)}</option>)}</select></label><div className="resource-fields__numbers"><label>{t('resources.strengthShort')}<NumberInput value={resource.strength} min={base.strength} variant="compact" onChange={(strength) => onChange({ ...resource, strength })} /></label><label>{t('resources.speed')}<NumberInput value={resource.speed} min={0} variant="compact" onChange={(speed) => onChange({ ...resource, speed })} /></label><label>{t('resources.defense')}<NumberInput value={resource.defense} min={base.defense} variant="compact" onChange={(defense) => onChange({ ...resource, defense })} /></label><label>{t('resources.toughness')}<NumberInput value={resource.toughness} min={base.toughness} variant="compact" onChange={(toughness) => onChange({ ...resource, toughness })} /></label></div><label>{t('resources.featuresHint')}<textarea value={featuresToText(resource.features)} rows={3} onChange={(event) => onChange({ ...resource, features: textToFeatures(event.target.value) })} /></label><FieldStyles /></fieldset>;
}
function HeadquartersFields({ resource, onChange }: { resource: IHeadquartersResource; onChange: (resource: IHeadquartersResource) => void }) { const { t } = useTranslation(); return <fieldset className="resource-fields"><legend>{t('resources.headquartersTraits')}</legend><label>{t('resources.size')}<select value={resource.size} onChange={(event) => onChange({ ...resource, size: event.target.value as IHeadquartersResource['size'] })}>{HEADQUARTERS_SIZES.map((size) => <option value={size} key={size}>{t(`resources.size.${size}`)}</option>)}</select></label><label>{t('resources.toughness')}<NumberInput value={resource.toughness} min={6} variant="compact" onChange={(toughness) => onChange({ ...resource, toughness })} /></label><label>{t('resources.featuresHint')}<textarea value={featuresToText(resource.features)} rows={3} onChange={(event) => onChange({ ...resource, features: textToFeatures(event.target.value) })} /></label><FieldStyles /></fieldset>; }
function FieldStyles() { return <style>{`.resource-fields{border:1px solid var(--c-border);border-radius:var(--r-sm);display:flex;flex-direction:column;gap:var(--s-sm);margin:0;padding:var(--s-sm)}.resource-fields__numbers{display:grid;gap:var(--s-sm);grid-template-columns:repeat(2,1fr)}.resource-fields__numbers input{min-width:0;width:100%}`}</style>; }
