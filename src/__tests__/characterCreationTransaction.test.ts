import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { commitCharacterCreation } from '../features/character-creation/commitCharacterCreation';
import { instantiateArchetype } from '../data/archetypes/model';
import { batch1 } from '../data/archetypes/batch1';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { useCharactersStore } from '../store/charactersStore';
import { useResourcesStore } from '../store/resourcesStore';
import { clearDraftMulti } from '../services/storage/characterDraftStorage';
const values=new Map<string,string>();
let failKey:string|null=null;
const storage={getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{if(key===failKey)throw new DOMException('Full','QuotaExceededError');values.set(key,value);},removeItem:(key:string)=>{values.delete(key);}};
beforeEach(()=>{
  values.clear();failKey=null;vi.stubGlobal('localStorage',storage);clearDraftMulti();
  useCharactersStore.setState({tabs:[],activeCharacterId:null,historyByTabId:{},isDraftHydrated:true});
  useResourcesStore.setState({resources:[],past:[],future:[],lastSavedSource:null,source:null,quarantined:[],loadError:null,storageError:null});
});
afterEach(()=>vi.unstubAllGlobals());
it('Commits the localized hero and its fresh resources without altering an existing character',()=>{
  const id=commitCharacterCreation({character:createDefaultCharacter(),resources:[]});
  const original=structuredClone(useCharactersStore.getState().tabs[0]);
  const draft=instantiateArchetype(batch1[0],{expertise:'Science'},'pt-BR');
  const created=commitCharacterCreation(draft);
  expect(created).not.toBe(id);expect(useCharactersStore.getState().tabs[0]).toEqual(original);
  expect(useCharactersStore.getState().tabs[1].character.header.name).toBe('Armadura de Combate');
  expect(useResourcesStore.getState().resources).toHaveLength(1);
  expect(JSON.parse(storage.getItem('mm3e-draft-characters')!).characters).toHaveLength(2);
});
it('Restores memory, resources and durable draft if metadata persistence fails',()=>{
  commitCharacterCreation({character:createDefaultCharacter(),resources:[]});
  const before=useCharactersStore.getState();const durable=new Map(values);
  failKey='mm3e-draft-metadata';
  const spy=vi.spyOn(console,'error').mockImplementation(()=>{});
  expect(()=>commitCharacterCreation(instantiateArchetype(batch1[0],{expertise:'Science'},'en'))).toThrow();
  expect(useCharactersStore.getState().tabs).toEqual(before.tabs);expect(useResourcesStore.getState().resources).toEqual([]);
  expect(values).toEqual(durable);spy.mockRestore();
});
it('Rejects resource write conflicts without modifying a newer external library',()=>{
  storage.setItem('mm3e-resource-library','external');
  expect(()=>commitCharacterCreation(instantiateArchetype(batch1[0],{expertise:'Science'},'en'))).toThrow();
  expect(storage.getItem('mm3e-resource-library')).toBe('external');expect(useCharactersStore.getState().tabs).toHaveLength(0);
});
it('Does not create anything before draft hydration',()=>{
  useCharactersStore.setState({isDraftHydrated:false});
  expect(()=>commitCharacterCreation({character:createDefaultCharacter(),resources:[]})).toThrow('creation.startupPending');
  expect(values.size).toBe(0);expect(useCharactersStore.getState().tabs).toHaveLength(0);
});
