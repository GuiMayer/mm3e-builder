import { lazy, Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Zap } from 'lucide-react';
import type { ICharacterPower, ITraitModifier, ITraitTarget } from '../../entities/types';
import { useTraitValues } from '../../shared/hooks/useTraitValues';
import { useCharactersStore } from '../../store/charactersStore';
import { useResourcesStore } from '../../store/resourcesStore';
import { traitTargetKey, setEnhancedTarget } from '../../shared/lib/traitTargets';
import { getPowerSources, powerBranches, type PowerSource } from '../../shared/lib/powerUsage';
import { getResourcePowers } from '../../shared/lib/resourcePowers';
import { replaceCharacterPower, replaceResourcePower } from '../../shared/lib/powerEditing';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { SKILL_DEFS } from '../../entities/gameDataLoaders';
import { createId } from '../../shared/lib/identity';
import { useAppDialog } from '../../shared/ui/appDialogContext';
import { Modal } from '../../shared/ui/Modal';
import { Button } from '../../shared/ui/Button';
import { NumberInput } from '../../shared/ui/NumberInput';
import { calculateComponentPricing } from '../../shared/lib/mathEngine';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import './traitModifiers.css';

const PowerBuilderOverlay = lazy(() => import('../power-builder/PowerBuilderOverlay').then(module => ({ default: module.PowerBuilderOverlay })));
interface Editor { power: ICharacterPower; source?: PowerSource; originId: string; componentId?: string; }
export function TraitModifiersControl({ target, onAddLegacy }: { target: ITraitTarget; onAddLegacy?: () => void }) {
  const { t } = useTranslation();
  const state = useTraitValues();
  const resources = useResourcesStore(store => store.resources);
  const dialog = useAppDialog();
  const key = traitTargetKey(target);
  const modifiers = state.original.traitModifiers?.filter(item => traitTargetKey(item.target) === key) ?? [];
  const contributions = state.contributions.filter(item => item.key === key);
  const sources = getPowerSources(state.original, resources);
  const existing = sources.flatMap(source => powerBranches(source.power).flatMap(branch => branch.components.filter(component => component.effectId === 'enhanced-trait').map(component => ({ id: `${source.key}:${component.id}`, source, component }))));
  const [form, setForm] = useState<ITraitModifier | null>(null);
  const [kind, setKind] = useState<'circumstance' | 'power' | 'legacy'>('circumstance');
  const [existingId, setExistingId] = useState('');
  const [editor, setEditor] = useState<Editor | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const skills = useLocalizedData(SKILL_DEFS);
  const label = target.kind === 'ability' ? t(`abilities.${target.key}`) : target.kind === 'defense' ? t(`defenses.${target.key}`) : `${skills.find(skill => skill.id === target.skillId)?.name ?? target.skillId}${target.subtype ? ': ' + target.subtype : ''}`;
  function modify(next: ITraitModifier[] | undefined) {
    if (!state.characterId) return;
    useCharactersStore.getState().updateCharacter(state.characterId, { traitModifiers: next?.length ? next : undefined });
  }
  function add() {
    setKind('circumstance'); setExistingId('');
    setForm({ id: createId(), target, value: 0, source: '', scope: 'check', active: true });
  }
  function saveModifier() {
    if (!form) return;
    const current = useCharactersStore.getState().getCharacterById(state.characterId!)?.character.traitModifiers ?? [];
    modify(current.some(item => item.id === form.id) ? current.map(item => item.id === form.id ? form : item) : [...current, form]);
    setForm(null);
  }
  async function openBuilder(source?: PowerSource, componentId?: string, bind = false) {
    if (!state.characterId) return;
    let power = source?.power;
    if (!power) power = { id: createId(), name: `${t('traits.enhancement')} · ${label}`, notes: '', alternateEffects: [], components: [target.kind === 'defense' && target.key === 'toughness'
      ? { id: createId(), effectId: 'protection', ranks: 1, modifiers: [] }
      : setEnhancedTarget({ id: createId(), effectId: 'enhanced-trait', ranks: 1, modifiers: [] }, target)] };
    else if (bind) {
      const component = powerBranches(power).flatMap(branch => branch.components).find(item => item.id === componentId);
      if (!component) return;
      const proposed = setEnhancedTarget(component, target);
      const effect = POWER_DEFS.find(def => def.id === 'enhanced-trait')!;
      const before = calculateComponentPricing(component, effect, MODIFIER_DEFS).total, after = calculateComponentPricing(proposed, effect, MODIFIER_DEFS).total;
      const current = target.kind === 'ability' ? state.character.abilities[target.key] : target.kind === 'defense' ? target.key === 'toughness' ? state.character.abilities.sta : state.character.defenses[target.key] : state.character.skills.find(skill => skill.skillId === target.skillId && (skill.subtype ?? null) === (target.subtype ?? null))?.ranks ?? 0;
      if (!await dialog.confirm({ title: t('traits.target'), message: t('traits.targetReview', { before, after, current, proposed: current + component.ranks }) })) return;
      const replace = (components: ICharacterPower['components']) => components.map(item => item.id === componentId ? proposed : item);
      power = { ...power, components: replace(power.components), alternateEffects: power.alternateEffects.map(alternate => ({ ...alternate, components: replace(alternate.components) })) };
    }
    setForm(null); setSaveError(null); setEditor({ power, source, originId: state.characterId, componentId });
  }
  function savePower(power: ICharacterPower) {
    if (!editor) return;
    const store = useCharactersStore.getState();
    const current = store.getCharacterById(editor.originId)?.character;
    if (!current) { setSaveError(t('recovery.changed')); return; }
    if (editor.source?.resource) {
      const resource = useResourcesStore.getState().getResource(editor.source.resource.id);
      const entry = resource && getResourcePowers(resource).find(item => item.power.id === editor.source!.power.id);
      if (entry && JSON.stringify(entry.power) !== JSON.stringify(editor.source.power)) { setSaveError(t('recovery.changed')); return; }
      const replacement = resource && entry && replaceResourcePower(resource, entry.target, power);
      if (!replacement || !useResourcesStore.getState().updateResource(replacement)) { setSaveError(t('resources.error.storageWrite')); return; }
    } else {
      if (editor.source && JSON.stringify((editor.source.equipment ? current.equipment : current.powers)?.find(item => item.id === editor.source!.power.id)) !== JSON.stringify(editor.source.power)) { setSaveError(t('recovery.changed')); return; }
      const replacement = replaceCharacterPower(current, { kind: editor.source?.equipment ? 'equipment' : 'power', powerId: editor.source?.power.id }, power);
      if (!replacement) { setSaveError(t('recovery.changed')); return; }
      store.updateCharacter(editor.originId, editor.source?.equipment ? { equipment: replacement.equipment } : { powers: replacement.powers });
    }
    setEditor(null);
  }
  const isAbility = target.kind === 'ability';
  const addButton = <button type="button" className="trait-control__add" title={t('traits.add')} aria-label={`${t('traits.add')} · ${label}`} onClick={add}><Plus size={14} /></button>;
  return <div className="trait-control">
    {isAbility && <div className="trait-control__toolbar"><span>{t('traits.modifiers')}</span>{addButton}</div>}
    {contributions.map(item => {
      const editButton = <button type="button" aria-label={t('traits.editPower')} title={t('traits.editPower')} onClick={() => void openBuilder(sources.find(source => source.key === item.sourceKey), item.componentId)}><Pencil size={13} /></button>;
      return <div className="trait-control__row" key={`${item.sourceKey}:${item.componentId}`}>
        <Zap size={12} />
        {isAbility ? <span className="trait-control__content"><strong className="trait-control__value">+{item.ranks}</strong><span className="trait-control__source">{item.name}</span><small className="trait-control__scope">{t('traits.enhancement')}</small></span> : <span title={`+${item.ranks} · ${item.name}`}>+{item.ranks} · {item.name}</span>}
        {isAbility ? <div className="trait-control__actions">{editButton}</div> : editButton}
      </div>;
    })}
    {contributions.some(item => item.equipment) && contributions.length > 1 && <small className="trait-warning">{t('traits.nonStackingHint')}</small>}
    {modifiers.map(item => {
      const value = `${item.value >= 0 ? '+' : ''}${item.value}`;
      const source = item.source || t('traits.circumstance');
      const scope = t(item.scope === 'check' ? 'traits.checkOnly' : 'traits.activeDefense');
      const actions = <><button type="button" aria-label={t('common.edit')} title={t('common.edit')} onClick={() => { setKind('circumstance'); setForm({ ...item }); }}><Pencil size={13} /></button><button type="button" aria-label={t('common.remove')} title={t('common.remove')} onClick={() => modify(state.original.traitModifiers?.filter(modifier => modifier.id !== item.id))}><Trash2 size={13} /></button></>;
      return <div className={`trait-control__row ${item.active ? '' : 'trait-control__row--inactive'}`} key={item.id}>
        <input className="app-checkbox" type="checkbox" aria-label={t('traits.active')} checked={item.active} onChange={event => modify(state.original.traitModifiers?.map(modifier => modifier.id === item.id ? { ...modifier, active: event.target.checked } : modifier))} />
        {isAbility ? <span className="trait-control__content"><strong className="trait-control__value">{value}</strong><span className="trait-control__source">{source}</span><small className="trait-control__scope">{scope}</small></span> : <span title={`${value} · ${source} · ${scope}`}>{value} · {source} · {scope}</span>}
        {isAbility ? <div className="trait-control__actions">{actions}</div> : actions}
      </div>;
    })}
    {!isAbility && addButton}
    <Modal isOpen={!!form} onClose={() => setForm(null)} title={`${t('traits.add')} · ${label}`} compact>{form && <div className="trait-editor">
      <label>{t('traits.kind')}<select disabled={modifiers.some(item => item.id === form.id)} value={kind} onChange={event => setKind(event.target.value as typeof kind)}><option value="circumstance">{t('traits.circumstance')}</option><option value="power">{t('traits.enhancement')}</option>{onAddLegacy && <option value="legacy">{t('traits.legacyBonus')}</option>}</select></label>
      {kind === 'circumstance' && <><label>{t('traits.value')}<NumberInput value={form.value} onChange={value => setForm({ ...form, value })} /></label><label>{t('traits.source')}<input value={form.source} onChange={event => setForm({ ...form, source: event.target.value })} /></label>{target.kind === 'defense' && (target.key === 'dodge' || target.key === 'parry') && <label>{t('traits.scope')}<select value={form.scope} onChange={event => setForm({ ...form, scope: event.target.value as ITraitModifier['scope'] })}><option value="check">{t('traits.checkOnly')}</option><option value="active-defense">{t('traits.activeDefense')}</option></select></label>}<small>{t('traits.circumstanceHint')}</small></>}
      {kind === 'power' && <><label>{t('traits.powerChoice')}<select value={existingId} onChange={event => setExistingId(event.target.value)}><option value="">{t('traits.newPower')}</option>{existing.map(item => <option key={item.id} value={item.id}>{item.source.name} · {item.component.ranks}</option>)}</select></label><small>{t(target.kind === 'defense' && target.key === 'toughness' ? 'traits.toughnessHint' : 'traits.powerHint')}</small></>}
      {kind === 'legacy' && <small>{t('traits.legacyHint')}</small>}
      <div className="trait-editor__actions"><Button variant="ghost" onClick={() => setForm(null)}>{t('common.cancel')}</Button><Button onClick={() => { if (kind === 'circumstance') saveModifier(); else if (kind === 'legacy') { onAddLegacy?.(); setForm(null); } else { const entry = existing.find(item => item.id === existingId); void openBuilder(entry?.source, entry?.component.id, !!entry); } }}>{t(kind === 'power' ? 'traits.openBuilder' : 'common.save')}</Button></div>
    </div>}</Modal>
    {editor && <Suspense fallback={null}><PowerBuilderOverlay existingPower={editor.power} initialComponentId={editor.componentId} isNewPower={!editor.source} sourceCharacterId={editor.originId} onSave={savePower} onClose={() => setEditor(null)} equipmentMode={editor.source?.equipment}
      resourceContext={editor.source?.resource ? { resource: editor.source.resource, kind: getResourcePowers(editor.source.resource).find(item => item.power.id === editor.source!.power.id)!.target.kind, effectId: editor.source.power.id } : undefined} saveError={saveError} /></Suspense>}
  </div>;
}
