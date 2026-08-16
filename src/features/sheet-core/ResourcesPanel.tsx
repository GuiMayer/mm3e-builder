import { useState } from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useActiveCharacter } from '../../shared/hooks/useActiveCharacter';
import { useCharacterActions } from '../../shared/hooks/useCharacterActions';
import { useCalculatedPP } from '../../shared/hooks/useCalculatedPP';
import { useResourcesStore } from '../../store/resourcesStore';
import { getResourceEPCost } from '../../shared/lib/resourceCalculations';
import { createId } from '../../shared/lib/identity';

export function ResourcesPanel() {
  const { t } = useTranslation();
  const { character } = useActiveCharacter();
  const { setResourceLinks } = useCharacterActions();
  const resources = useResourcesStore((state) => state.resources);
  const { equipmentEPLimit, totalEPUsed, isOverEquipmentLimit } = useCalculatedPP();
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const links = character.resourceLinks ?? [];

  function addLink() {
    if (!selectedResourceId || links.some((link) => link.resourceId === selectedResourceId)) return;
    setResourceLinks([...links, { id: createId(), resourceId: selectedResourceId, isFree: false }]);
    setSelectedResourceId('');
  }

  function updateLink(id: string, updates: Partial<(typeof links)[number]>) {
    setResourceLinks(links.map((link) => link.id === id ? { ...link, ...updates } : link));
  }

  function removeLink(id: string) {
    setResourceLinks(links.filter((link) => link.id !== id));
  }

  return (
    <section className="panel resources-panel">
      <div className="panel-header">
        <h2 className="panel-title"><Package size={15} /> {t('resources.characterTitle')}</h2>
        <span className={`panel-cost ${isOverEquipmentLimit ? 'panel-cost--error' : ''}`}>{totalEPUsed} / {equipmentEPLimit} EP</span>
      </div>
      <p className="resources-panel__hint">{t('resources.characterHint')}</p>

      {isOverEquipmentLimit && <div className="resources-panel__warning">{t('resources.overBudget')}</div>}

      <div className="resources-panel__list">
        {links.map((link) => {
          const resource = resources.find((item) => item.id === link.resourceId);
          if (!resource) return <div className="resources-panel__missing" key={link.id}>{t('resources.missing')}<button onClick={() => removeLink(link.id)} aria-label={t('common.remove')}><Trash2 size={14} /></button></div>;
          const cost = link.isFree ? 0 : link.contributionEP ?? getResourceEPCost(resource);
          return (
            <article className="resources-panel__item" key={link.id}>
              <div className="resources-panel__item-main"><strong>{resource.name || t('resources.unnamed')}</strong><span>{t(`resources.type.${resource.type}`)}</span></div>
              <label className="resources-panel__free"><input type="checkbox" checked={link.isFree} onChange={(event) => updateLink(link.id, { isFree: event.target.checked })} /> {t('resources.free')}</label>
              <strong className="resources-panel__cost">{cost} EP</strong>
              <button className="resources-panel__remove" onClick={() => removeLink(link.id)} title={t('common.remove')} aria-label={t('common.remove')}><Trash2 size={14} /></button>
            </article>
          );
        })}
        {links.length === 0 && <p className="resources-panel__empty">{t('resources.empty')}</p>}
      </div>

      <div className="resources-panel__add">
        <select value={selectedResourceId} onChange={(event) => setSelectedResourceId(event.target.value)} aria-label={t('resources.add')}>
          <option value="">{t('resources.select')}</option>
          {resources.filter((resource) => !links.some((link) => link.resourceId === resource.id)).map((resource) => <option value={resource.id} key={resource.id}>{resource.name || t('resources.unnamed')} — {t(`resources.type.${resource.type}`)}</option>)}
        </select>
        <button onClick={addLink} disabled={!selectedResourceId}><Plus size={15} /> {t('common.add')}</button>
      </div>

      <style>{`
        .resources-panel .panel-header { align-items:center; justify-content:space-between; }
        .resources-panel__hint,.resources-panel__empty { color:var(--c-text-muted); font-size:.82rem; margin:0 0 var(--s-md); }
        .resources-panel__warning { background:rgba(248,113,113,.12); border:1px solid var(--c-error); border-radius:var(--r-sm); color:var(--c-error); font-size:.8rem; margin-bottom:var(--s-md); padding:var(--s-sm); }
        .resources-panel__list { display:flex; flex-direction:column; gap:var(--s-xs); }
        .resources-panel__item,.resources-panel__missing { align-items:center; background:var(--c-surface-elevated); border:1px solid var(--c-border); border-radius:var(--r-sm); display:grid; gap:var(--s-sm); grid-template-columns:minmax(0,1fr) auto auto auto; padding:var(--s-sm); }
        .resources-panel__item-main { display:flex; flex-direction:column; min-width:0; }
        .resources-panel__item-main strong { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .resources-panel__item-main span { color:var(--c-text-muted); font-size:.7rem; text-transform:capitalize; }
        .resources-panel__free { color:var(--c-text-secondary); font-size:.76rem; white-space:nowrap; }
        .resources-panel__cost { color:var(--c-primary); font-variant-numeric:tabular-nums; }
        .resources-panel__remove,.resources-panel__missing button { background:transparent; border:0; color:var(--c-text-muted); cursor:pointer; display:flex; padding:4px; }
        .resources-panel__remove:hover,.resources-panel__missing button:hover { color:var(--c-error); }
        .resources-panel__add { display:flex; gap:var(--s-sm); margin-top:var(--s-md); }
        .resources-panel__add select { background:var(--c-surface); border:1px solid var(--c-border); border-radius:var(--r-sm); color:var(--c-text); flex:1; min-width:0; padding:var(--s-xs) var(--s-sm); }
        .resources-panel__add button { align-items:center; background:var(--c-primary-muted); border:1px solid var(--c-primary); border-radius:var(--r-sm); color:var(--c-primary); cursor:pointer; display:flex; font:inherit; font-size:.8rem; gap:4px; padding:var(--s-xs) var(--s-sm); }
        .resources-panel__add button:disabled { cursor:not-allowed; opacity:.5; }
        @media (max-width:768px) { .resources-panel__item { grid-template-columns:1fr auto; } .resources-panel__free { grid-column:1; } .resources-panel__cost { grid-column:2; grid-row:2; } .resources-panel__remove { grid-column:2; grid-row:1; } }
      `}</style>
    </section>
  );
}
