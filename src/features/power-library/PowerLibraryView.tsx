import { lazy, Suspense, useDeferredValue, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Search } from 'lucide-react';
import type { ICharacterPower } from '../../entities/types';
import { useCharactersStore } from '../../store/charactersStore';
import { useResourcesStore } from '../../store/resourcesStore';
import { getPricingStrengthContext } from '../../shared/lib/pricingStrength';
import { calculatePowerPricing } from '../../shared/lib/mathEngine';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { downloadBlob } from '../../services/downloadHelper';
import { useAppDialog } from '../../shared/ui/appDialogContext';
import { PowerLibraryDialog } from './PowerLibraryDialog';
import { PowerCompositionPreview } from './PowerCompositionPreview';
import { PersonalModelDetail } from './PersonalModelPicker';
import { PersonalModelEditor } from './PersonalModelEditor';
import { usePersonalLibraryStore } from './personalLibraryStore';
import { createPersonalModel, duplicatePersonalModel, prepareModelImport, parsePersonalLibrary, serializePersonalLibrary, searchPersonalModels, updateModelComposition, PERSONAL_LIBRARY_MAX_BYTES, type PersonalPowerModel } from './personalPowerModel';
import { usePersonalLibrarySync } from './usePersonalLibrarySync';
import { resolveLibraryPowerDestination, type LibraryPowerEdit } from './libraryCharacterEditing';
import { getLibraryDestinationStrength } from './libraryPricing';
import { PowerDestinationDialog } from './PowerDestinationDialog';
import './powerLibrary.css';
import './personalLibrary.css';
const CharacterCreationDialog = lazy(()=>import('../character-creation/CharacterCreationDialog').then(module=>({default:module.CharacterCreationDialog})));

const PowerBuilderOverlay = lazy(() => import('../power-builder/PowerBuilderOverlay').then(module => ({ default: module.PowerBuilderOverlay })));

export function PowerLibraryView({ onOpenPower }: { onOpenPower: (edit: LibraryPowerEdit) => void }) {
  const { t, i18n } = useTranslation(); const dialog = useAppDialog();
  const tabs = useCharactersStore(state => state.tabs);
  const resources = useResourcesStore(state => state.resources);
  const library = usePersonalLibraryStore();
  const [section, setSection] = useState<'profiles' | 'characters' | 'models'>('profiles');
  const [pendingPower, setPendingPower] = useState<ICharacterPower | null>(null);
  const [creatingCharacter,setCreatingCharacter] = useState(false);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [query, setQuery] = useState(''); const search = useDeferredValue(query);
  const [characterFilter, setCharacterFilter] = useState('');
  const [selectedPower, setSelectedPower] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [editor, setEditor] = useState<{ draft: PersonalPowerModel; original?: PersonalPowerModel } | null>(null);
  const [compositionOpen, setCompositionOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  usePersonalLibrarySync();
  const strengthForPower = (power: ICharacterPower) => getLibraryDestinationStrength(power);
  const usePower = (draft: ICharacterPower) => {
    setDestinationError(null); setPendingPower(structuredClone(draft));
  };
  const selectDestination = (tabId: string) => {
    if (!pendingPower) return;
    const edit = resolveLibraryPowerDestination(useCharactersStore.getState().tabs, tabId, pendingPower);
    if (!edit) { setDestinationError('personalLibrary.destinationMissing'); return; }
    setPendingPower(null); onOpenPower(edit);
  };
  const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase();
  const words = normalize(search).trim().split(/\s+/).filter(Boolean);
  const powers = tabs.flatMap(tab => tab.character.powers.map(power => ({ tab, power, key: `${tab.id}:${power.id}` })))
    .filter(item => (!characterFilter || item.tab.id === characterFilter) && words.every(word => normalize([item.power.name, item.power.notes, item.tab.character.header.name, ...(item.power.descriptors ?? [])].join(' ')).includes(word)))
    .sort((a, b) => a.power.name.localeCompare(b.power.name, i18n.language) || a.tab.character.header.name.localeCompare(b.tab.character.header.name, i18n.language));
  const currentPower = tabs.flatMap(tab => tab.character.powers.map(power => ({ tab, power, key: `${tab.id}:${power.id}` }))).find(item => item.key === selectedPower);
  const models = searchPersonalModels(library.models, search, i18n.language);
  const currentModel = library.models.find(model => model.id === selectedModel);
  const beginModel = (power: ICharacterPower) => { setError(null); setEditor({ draft: createPersonalModel(power) }); };
  const saveModel = () => {
    if (!editor) return;
    const name = editor.draft.name.trim();
    const model = { ...editor.draft, name, power: { ...editor.draft.power, name }, updatedAt: new Date().toISOString() };
    if (library.put(model, editor.original)) { setSelectedModel(model.id); setSection('models'); setEditor(null); setError(null); setMessage('personalLibrary.saved'); }
  };
  const exportModels = async (original = false) => {
    try {
      const text = original ? library.source : serializePersonalLibrary(library.models);
      if (text !== null) await downloadBlob(new Blob([text], { type: 'application/json' }), original ? 'power-models-original.json' : 'power-models.json');
    } catch { setError('bundle.exportError'); }
  };
  const importModels = async (file?: File) => {
    if (!file) return;
    setMessage(null); setError(null);
    const source = usePersonalLibraryStore.getState().source;
    try {
      if (file.size > PERSONAL_LIBRARY_MAX_BYTES) throw new Error('personalLibrary.tooLarge');
      let incoming = parsePersonalLibrary(await file.text());
      const conflicts = incoming.some(model => usePersonalLibraryStore.getState().models.some(existing => existing.id === model.id));
      let mode: 'copy' | 'keep' | 'replace' = 'keep';
      if (conflicts) {
        const choice = await dialog.choose({ title: t('personalLibrary.import'), message: t('personalLibrary.importConflict'), choices: ['copy', 'replace', 'keep'].map(value => ({ value, label: t(`personalLibrary.import${value[0].toUpperCase()}${value.slice(1)}`) })) });
        if (!choice) return; mode = choice as 'copy' | 'keep' | 'replace';
      }
      const state = usePersonalLibraryStore.getState();
      if (state.source !== source) throw new Error('personalLibrary.storageConflict');
      incoming = prepareModelImport(state.models, incoming, mode, name => t('personalLibrary.copyName', { name: name.slice(0, 190) }));
      if (state.merge(incoming, mode)) setMessage('personalLibrary.imported');
    } catch (failure) { setError(failure instanceof Error && ['personalLibrary.tooLarge', 'personalLibrary.storageConflict'].includes(failure.message) ? failure.message : 'personalLibrary.invalidFile'); }
  };
  return <div className="personal-library">
    <h1>{t('personalLibrary.title')}</h1>
    <nav className="personal-library-tabs" aria-label={t('personalLibrary.sources')}>{(['profiles', 'characters', 'models'] as const).map(value => <button key={value} type="button" aria-pressed={section === value} onClick={() => { setSection(value); setQuery(''); setMessage(null); setError(null); }}>{t(`personalLibrary.${value}`)}</button>)}</nav>
    {(error || library.error) && <div role="alert"><p>{t(error ?? library.error!)}</p>{library.error && <div className="personal-actions"><button onClick={() => { library.reload(); setError(null); }}>{t('personalLibrary.reload')}</button>{library.source !== null && <button onClick={() => void exportModels(true)}>{t('personalLibrary.exportOriginal')}</button>}</div>}</div>}
    {message && <p role="status">{t(message)}</p>}
    {section === 'profiles' ? <PowerLibraryDialog embedded strength={0} strengthForPower={strengthForPower} costUnit="PP" onUse={usePower}/> : <div className="power-library-embedded">
      <div className={`power-library-dialog ${section === 'models' ? currentModel ? 'power-library-dialog--detail' : '' : currentPower ? 'power-library-dialog--detail' : ''}`}>
      <header><div><h2>{t(`personalLibrary.${section}`)}</h2><p>{t(section === 'models' ? 'personalLibrary.backupNotice' : 'personalLibrary.charactersHelp')}</p></div>
        {section === 'models' && <div className="personal-browser-actions">
          <button disabled={library.error === 'personalLibrary.readError'} onClick={() => { setEditor(null); setCompositionOpen(true); }}>{t('personalLibrary.create')}</button>
          <button disabled={!library.models.length || library.error === 'personalLibrary.readError'} onClick={() => void exportModels()}>{t('personalLibrary.export')}</button>
          <button disabled={library.error === 'personalLibrary.readError'} onClick={() => importRef.current?.click()}>{t('personalLibrary.import')}</button>
          <input hidden ref={importRef} type="file" accept=".json,application/json" onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; void importModels(file); }}/>
        </div>}
      </header>
      <div className="power-library-filters"><label className="power-library-search"><Search size={17}/><input value={query} onChange={event => setQuery(event.target.value)} aria-label={t(section === 'models' ? 'personalLibrary.searchModels' : 'personalLibrary.searchPowers')} placeholder={t(section === 'models' ? 'personalLibrary.searchModels' : 'personalLibrary.searchPowers')}/></label>
        {section === 'characters' && <select className="app-select" value={characterFilter} aria-label={t('personalLibrary.characters')} onChange={event => setCharacterFilter(event.target.value)}><option value="">{t('personalLibrary.allCharacters')}</option>{tabs.map(tab => <option key={tab.id} value={tab.id}>{tab.character.header.name || t('tabs.unnamed')}</option>)}</select>}
      </div>
      <div className={`power-library-workspace ${section === 'models' ? 'power-library-workspace--no-sidebar' : ''}`}>
        {section === 'characters' && <nav className="power-library-profiles" aria-label={t('personalLibrary.characters')}>
          <button type="button" aria-pressed={!characterFilter} onClick={() => setCharacterFilter('')}>{t('personalLibrary.allCharacters')}</button>
          {tabs.map(tab => <button type="button" key={tab.id} aria-pressed={characterFilter === tab.id} onClick={() => setCharacterFilter(tab.id)}>{tab.character.header.name || t('tabs.unnamed')}</button>)}
        </nav>}
        <div className="power-library-results" aria-label={t('powerLibrary.results')}><p className="power-library-count">{t('personalLibrary.resultCount', { count: section === 'characters' ? powers.length : models.length })}</p>{section === 'characters' ? <>{powers.map(item => <button key={item.key} className="power-library-result" aria-pressed={item.key === selectedPower} onClick={() => setSelectedPower(item.key)}><strong>{item.power.name || t('powers.unnamed')}</strong><small>{item.tab.character.header.name || t('tabs.unnamed')} · {calculatePowerPricing(item.power, POWER_DEFS, MODIFIER_DEFS, getPricingStrengthContext(item.tab.character, resources)).total} PP</small>{item.power.notes && <span>{item.power.notes}</span>}</button>)}{!powers.length && <p>{t('personalLibrary.emptyPowers')}</p>}</> : <>{models.map(model => <button key={model.id} className="power-library-result" aria-pressed={model.id === selectedModel} onClick={() => setSelectedModel(model.id)}><strong>{model.name}</strong>{model.description && <span>{model.description}</span>}</button>)}{!models.length && <p>{t('personalLibrary.emptyModels')}</p>}</>}</div>
        <section className="power-library-preview" aria-label={t('powerLibrary.preview')}>
          <button className="power-library-back" onClick={() => { setSelectedPower(''); setSelectedModel(''); }}><ArrowLeft size={16}/>{t('powerLibrary.back')}</button>
          {section === 'characters' ? currentPower ? <><h3>{currentPower.power.name || t('powers.unnamed')}</h3><p className="power-library-source">{currentPower.tab.character.header.name || t('tabs.unnamed')}</p><div className="personal-actions"><button disabled={library.error === 'personalLibrary.readError'} onClick={() => beginModel(currentPower.power)}>{t('personalLibrary.saveModel')}</button></div><PowerCompositionPreview power={currentPower.power} strength={getPricingStrengthContext(currentPower.tab.character, resources)} showCost={false}/><footer><strong>{calculatePowerPricing(currentPower.power, POWER_DEFS, MODIFIER_DEFS, getPricingStrengthContext(currentPower.tab.character, resources)).total} PP</strong><button className="power-library-apply" onClick={() => onOpenPower({ tabId: currentPower.tab.id, draft: structuredClone(currentPower.power), original: structuredClone(currentPower.power) })}>{t('personalLibrary.editPower')}</button></footer></> : <p>{t('personalLibrary.choose')}</p> : currentModel ? <>
            <div className="personal-actions"><button onClick={() => { setError(null); setEditor({ draft: structuredClone(currentModel), original: structuredClone(currentModel) }); }}>{t('personalLibrary.edit')}</button><button onClick={() => { const copy = duplicatePersonalModel(currentModel); copy.name = t('personalLibrary.copyName', { name: copy.name.slice(0, 190) }); copy.power.name = copy.name; if (library.put(copy)) setSelectedModel(copy.id); }}>{t('personalLibrary.duplicate')}</button><button onClick={async () => { if (await dialog.confirm({ title: t('personalLibrary.delete'), message: t('personalLibrary.deleteConfirm', { name: currentModel.name }), danger: true }) && library.remove(currentModel)) setSelectedModel(''); }}>{t('personalLibrary.delete')}</button></div>
            <PersonalModelDetail key={`${currentModel.id}:${currentModel.updatedAt}`} model={currentModel} strength={0} strengthForPower={strengthForPower} onUse={usePower} footer/>
          </> : <p>{t('personalLibrary.choose')}</p>}
        </section>
      </div></div>
    </div>}
    {pendingPower && !creatingCharacter && <PowerDestinationDialog power={pendingPower} error={destinationError} onClose={() => { setPendingPower(null); setDestinationError(null); }} onSelect={selectDestination} onCreate={() => setCreatingCharacter(true)}/>}
    {creatingCharacter && <Suspense fallback={<p role="status">{t('common.loading')}</p>}><CharacterCreationDialog onClose={()=>setCreatingCharacter(false)} onCreated={id=>{setCreatingCharacter(false);selectDestination(id);}}/></Suspense>}
    {editor && !compositionOpen && <PersonalModelEditor model={editor.draft} onChange={draft => setEditor({ ...editor, draft })} onComposition={() => setCompositionOpen(true)} onSave={saveModel} onClose={() => setEditor(null)} error={library.error}/>}
    {compositionOpen && <Suspense fallback={<p role="status">{t('common.loading')}</p>}><PowerBuilderOverlay templateMode existingPower={editor?.draft.power} isNewPower={!editor} onClose={() => setCompositionOpen(false)} onSave={power => { setEditor(editor ? { ...editor, draft: updateModelComposition(editor.draft, power) } : { draft: createPersonalModel(power) }); setCompositionOpen(false); }}/></Suspense>}
  </div>;
}
