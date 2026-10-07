import { lazy, Suspense, useDeferredValue, useId, useMemo, useRef, useState } from 'react';
import { ArrowLeft, FilePlus, LibraryBig, Plus, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ARCHETYPES } from '../../data/archetypes';
import { instantiateArchetype, local, power, type Answers, type Choice } from '../../data/archetypes/model';
import type { ICharacterPower } from '../../entities/types';
import { createDefaultCharacter } from '../../entities/characterDefaults';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { calculatePowerPricing } from '../../shared/lib/mathEngine';
import { getPricingStrengthContext } from '../../shared/lib/pricingStrength';
import { effectiveTraitCharacter } from '../../shared/lib/traitValues';
import { validateRequiredPowerFields } from '../../shared/lib/validation';
import { validateCharacterSemantics } from '../../shared/lib/semanticValidation';
import { useDialogFocus } from '../../shared/hooks/useDialogFocus';
import { useCharactersStore } from '../../store/charactersStore';
import { Modal } from '../../shared/ui/Modal';
import { ArchetypePreview } from './ArchetypePreview';
import { commitCharacterCreation } from './commitCharacterCreation';
import '../power-library/powerLibrary.css';
import '../power-library/personalLibrary.css';
import './characterCreation.css';

const PowerBuilder = lazy(()=>import('../power-builder/PowerBuilderOverlay').then(module=>({default:module.PowerBuilderOverlay})));
const PowerLibrary = lazy(()=>import('../power-library/PowerLibraryDialog').then(module=>({default:module.PowerLibraryDialog})));
const normalize=(value:string)=>value.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
interface Props { onClose:()=>void; onCreated:(tabId:string)=>void }
type Editor = { choice:Choice; index:number; draft:ICharacterPower; library?:boolean };

export function CharacterCreationDialog({onClose,onCreated}:Props) {
  const {t,i18n}=useTranslation();const language=i18n.resolvedLanguage??i18n.language;
  const [stage,setStage]=useState<'menu'|'archetypes'>('menu');
  const [query,setQuery]=useState('');const deferred=useDeferredValue(query);
  const [selected,setSelected]=useState('');const [detail,setDetail]=useState(false);
  const [answers,setAnswers]=useState<Record<string,Answers>>({});
  const [error,setError]=useState<string|null>(null);const [editor,setEditor]=useState<Editor|null>(null);
  const [editorError,setEditorError]=useState<string|null>(null);
  const committing=useRef(false);const content=useRef<HTMLDivElement>(null);const title=useId();
  const hydrated=useCharactersStore(state=>state.isDraftHydrated);
  useDialogFocus(content,stage==='archetypes',onClose);
  const entry=ARCHETYPES.find(item=>item.id===selected);
  const current=useMemo(()=>answers[selected]??{},[answers,selected]);
  const preview=useMemo(()=>entry?instantiateArchetype(entry,current,language):null,[entry,current,language]);
  // Price an edited choice against the fixed archetype, excluding that choice's old enhancements.
  const editorContext=useMemo(()=>entry&&editor?instantiateArchetype(entry,{...current,[editor.choice.id]:[]},language):null,[entry,current,editor,language]);
  const results=ARCHETYPES.filter(item=>normalize([item.name.en,item.name.pt,item.summary.en,item.summary.pt].join(' ')).includes(normalize(deferred.trim()))).sort((a,b)=>local(a.name,language).localeCompare(local(b.name,language),language));
  function update(id:string,value:Answers[string]) { setAnswers(previous=>({...previous,[selected]:{...previous[selected],[id]:value}}));setError(null); }
  function create(blank=false) {
    if(committing.current||!hydrated)return;
    const draft=blank?{character:createDefaultCharacter(),resources:[]}:entry?instantiateArchetype(entry,current,language):null;
    if(!draft||'valid'in draft&&!draft.valid)return;
    committing.current=true;
    try { const id=commitCharacterCreation(draft);onCreated(id); }
    catch(cause){ setError(cause instanceof Error&&['creation.startupPending','creation.recoveryError'].includes(cause.message)?cause.message:'creation.storageError');committing.current=false; }
  }
  function edit(choice:Choice,index:number,library=false) {
    const values=current[choice.id] as ICharacterPower[]|undefined;
    setEditorError(null);setEditor({choice,index,draft:values?.[index]??power('',[]),library});
  }
  function savePower(draft:ICharacterPower) {
    if(!editor||!preview)return;
    if(editor.library) { setEditor({...editor,draft,library:false});setEditorError(null);return; }
    const strength=getPricingStrengthContext((editorContext??preview).character,(editorContext??preview).resources);
    const price=calculatePowerPricing(draft,POWER_DEFS,MODIFIER_DEFS,strength);
    const invalid=validateCharacterSemantics(createDefaultCharacter({powers:[draft]}),{powerDefs:POWER_DEFS,modifierDefs:MODIFIER_DEFS}).some(issue=>issue.severity==='error');
    if(invalid||!draft.components.length||draft.alternateEffects.length||draft.removable&&draft.removable!=='none'||price.diagnostics.length||(editor.choice.equipment?price.equipmentTotal:price.total)>(editor.choice.budget??0)||draft.components.some(item=>!!validateRequiredPowerFields(item,POWER_DEFS.find(def=>def.id===item.effectId)))) {
      setEditorError(t('creation.effectRules',{budget:editor.choice.budget,unit:editor.choice.equipment?'EP':'PP'}));return;
    }
    if(['senses','sentinel-senses'].includes(editor.choice.id)&&(draft.components.some(item=>item.effectId!=='senses'||!item.senseTraits?.length)||draft.components.reduce((sum,item)=>sum+item.ranks,0)!==editor.choice.budget)) {
      setEditorError(t('creation.sensesRules',{count:editor.choice.budget}));return;
    }
    const values=[...((current[editor.choice.id] as ICharacterPower[]|undefined)??[])];values[editor.index]=draft;
    update(editor.choice.id,values);setEditor(null);setEditorError(null);
  }
  function choiceControl(choice:Choice) {
    const value=current[choice.id];const label=local(choice.label,language);
    const id=`${title}-${choice.id}`;
    return <div className="creation-field" key={choice.id}>
      {choice.kind==='text'?<label htmlFor={id}>{label}<input id={id} className="app-input" maxLength={200} value={typeof value==='string'?value:''} onChange={event=>update(choice.id,event.target.value)}/></label>:choice.kind==='select'?<label htmlFor={id}>{label}<select id={id} className="app-select" value={typeof value==='string'?value:choice.optional?choice.options?.[0].value??'':''} onChange={event=>update(choice.id,event.target.value)}>{!choice.optional&&<option value="">{t('builder.selectOption')}</option>}{choice.options?.map(option=><option key={option.value} value={option.value}>{local(option.label,language)}</option>)}</select></label>:choice.kind==='multi'?<fieldset><legend>{label} · {t('creation.chooseCount',{count:choice.count})}</legend><div className="creation-checkboxes">{[...(choice.options??[])].sort((a,b)=>local(a.label,language).localeCompare(local(b.label,language),language)).map(option=>{
        const list=Array.isArray(value)?value as string[]:[];return <label key={option.value}><input type="checkbox" className="app-checkbox" checked={list.includes(option.value)} disabled={!list.includes(option.value)&&list.length>=(choice.count??0)} onChange={event=>update(choice.id,event.target.checked?[...list,option.value]:list.filter(item=>item!==option.value))}/><span>{local(option.label,language)}</span></label>;
      })}</div></fieldset>:<fieldset><legend>{label} · {t('creation.chooseCount',{count:choice.count})}</legend><p>{t('creation.effectRules',{budget:choice.budget,unit:choice.equipment?'EP':'PP'})}</p>{Array.from({length:choice.count??1},(_,index)=>{
        const draft=Array.isArray(value)?(value as ICharacterPower[])[index]:undefined;
        return <div className="creation-effect" key={index}><span>{draft?.name||t('creation.effectNumber',{number:index+1})}</span><div><button type="button" onClick={()=>edit(choice,index)}>{t(draft?'personalLibrary.edit':'creation.configure')}</button>{!['senses','sentinel-senses'].includes(choice.id)&&<button type="button" onClick={()=>edit(choice,index,true)}>{t('creation.fromLibrary')}</button>}</div></div>;
      })}</fieldset>}
    </div>;
  }
  if(stage==='menu')return <Modal isOpen compact title={t('creation.title')} onClose={onClose}><p className="creation-intro">{t('creation.help')}</p><div className="creation-start"><button type="button" disabled={!hydrated} onClick={()=>create(true)}><FilePlus size={22}/><span><strong>{t('creation.blank')}</strong><small>{t('creation.blankHelp')}</small></span></button><button type="button" onClick={()=>setStage('archetypes')}><LibraryBig size={22}/><span><strong>{t('creation.archetype')}</strong><small>{t('creation.archetypeHelp')}</small></span></button></div>{error&&<p role="alert">{t(error)}</p>}</Modal>;
  return <>
    <div className="power-library-overlay creation-overlay" style={editor?{visibility:'hidden'}:undefined} onClick={onClose}>
      <div ref={content} role="dialog" aria-modal="true" aria-labelledby={title} tabIndex={-1} className={`power-library-dialog creation-dialog ${detail?'power-library-dialog--detail':''}`} onClick={event=>event.stopPropagation()}>
        <header><div><h2 id={title}>{t('creation.archetypes')}</h2><p>{t('creation.catalogHelp')}</p></div><button type="button" aria-label={t('builder.close')} onClick={onClose}><X size={20}/></button></header>
        <div className="power-library-filters"><button type="button" onClick={()=>setStage('menu')}><ArrowLeft size={16}/>{t('creation.startBack')}</button><label className="power-library-search"><Search size={17}/><input aria-label={t('creation.search')} placeholder={t('creation.search')} value={query} onChange={event=>setQuery(event.target.value)}/></label></div>
        <div className="power-library-workspace power-library-workspace--no-sidebar">
          <div className="power-library-results"><p className="power-library-count">{t('powerLibrary.count',{count:results.length})}</p>{results.map(item=><button type="button" className="power-library-result" key={item.id} aria-pressed={selected===item.id} onClick={()=>{setSelected(item.id);setDetail(true);setError(null);}}><strong>{local(item.name,language)}</strong><small>{t('creation.levelBudget')} · p. {item.page}</small><span>{local(item.summary,language)}</span></button>)}{!results.length&&<p role="status">{t('powerLibrary.noResults')}</p>}</div>
          <section className="power-library-preview" aria-label={t('creation.preview')}>
            <button type="button" className="power-library-back" onClick={()=>setDetail(false)}><ArrowLeft size={16}/>{t('powerLibrary.back')}</button>
            {entry&&preview?<><h3>{local(entry.name,language)}</h3><p>{local(entry.summary,language)}</p><p className="power-library-source">Deluxe Hero’s Handbook · p. {entry.page} · {t('creation.levelBudget')}</p>
              <p className="creation-name">{t('creation.heroName',{name:local(entry.name,language)})}</p>
              {entry.note&&<p className="power-library-discrepancy" role="note">{local(entry.note,language)}</p>}
              {preview.choices.filter(choice=>!choice.optional).map(choiceControl)}
              {preview.choices.some(choice=>choice.optional)&&<details className="creation-variants"><summary>{t('creation.variants')}</summary>{preview.choices.filter(choice=>choice.optional).map(choiceControl)}</details>}
              <ArchetypePreview preview={preview}/>
              {preview.missing.length>0&&<p role="status">{t('creation.required')} {preview.missing.map(id=>local(preview.choices.find(choice=>choice.id===id)!.label,language)).join(' · ')}</p>}
              {editorError&&<p role="alert">{editorError}</p>}{error&&<p role="alert">{t(error)}</p>}
              <footer><div><strong>{preview.summary.totalSpent} / 150 PP</strong><small>{preview.valid?t('creation.ready'):t('creation.requiredShort')}</small></div><button type="button" className="power-library-apply" disabled={!hydrated||!preview.valid} onClick={()=>create()}><Plus size={16}/>{t('creation.create')}</button></footer>
            </>:<p>{t('creation.select')}</p>}
          </section>
        </div>
      </div>
    </div>
    {editor&&editorContext&&<Suspense fallback={<p role="status">{t('common.loading')}</p>}>{editor.library?<PowerLibrary strength={getPricingStrengthContext(editorContext.character,editorContext.resources)} costUnit={editor.choice.equipment?'EP':'PP'} onClose={()=>setEditor(null)} onApply={draft=>savePower(draft)}/>:<PowerBuilder templateMode draftCharacter={{...effectiveTraitCharacter(editorContext.character,editorContext.resources),powers:[],resourceLinks:[]}} existingPower={editor.draft.components.length?editor.draft:undefined} isNewPower={!editor.draft.components.length} equipmentMode={editor.choice.equipment} saveError={editorError} onClose={()=>setEditor(null)} onSave={savePower}/>}</Suspense>}
  </>;
}
