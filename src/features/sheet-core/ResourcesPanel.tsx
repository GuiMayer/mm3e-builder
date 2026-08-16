import { useEffect, useMemo, useRef, useState } from 'react';
import { Package, Plus, Search, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ICharacterResourceLink, ResourceType } from '../../entities/types';
import { useActiveCharacter } from '../../shared/hooks/useActiveCharacter';
import { useCharacterActions } from '../../shared/hooks/useCharacterActions';
import { useCalculatedPP } from '../../shared/hooks/useCalculatedPP';
import { useResourcesStore } from '../../store/resourcesStore';
import { getResourceEPCost } from '../../shared/lib/resourceCalculations';
import { createId } from '../../shared/lib/identity';
import { Button } from '../../shared/ui/Button';

const RESOURCE_TYPES: ResourceType[] = ['gadget', 'gear', 'vehicle', 'headquarters', 'custom'];
const EMPTY_RESOURCE_LINKS: ICharacterResourceLink[] = [];

export function ResourcesPanel() {
  const { t } = useTranslation();
  const { character } = useActiveCharacter();
  const { setResourceLinks } = useCharacterActions();
  const resources = useResourcesStore((state) => state.resources);
  const { equipmentEPLimit, totalEPUsed, isOverEquipmentLimit } = useCalculatedPP();
  const [showSelector, setShowSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<ResourceType>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);
  const links = character.resourceLinks ?? EMPTY_RESOURCE_LINKS;

  useEffect(() => {
    if (showSelector) searchRef.current?.focus();
  }, [showSelector]);

  function addLink(resourceId: string) {
    if (links.some((link) => link.resourceId === resourceId)) return;
    setResourceLinks([...links, { id: createId(), resourceId, isFree: false }]);
  }

  function updateLink(id: string, updates: Partial<(typeof links)[number]>) {
    setResourceLinks(links.map((link) => link.id === id ? { ...link, ...updates } : link));
  }

  function removeLink(id: string) {
    setResourceLinks(links.filter((link) => link.id !== id));
  }

  function toggleFilter(type: ResourceType) {
    setActiveFilters((previous) => {
      const next = new Set(previous);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  function closeSelector() {
    setShowSelector(false);
    setSearchTerm('');
    setActiveFilters(new Set());
  }

  const selectableResources = useMemo(() => {
    const linkedResourceIds = new Set(links.map((link) => link.resourceId));
    const term = searchTerm.trim().toLowerCase();
    return resources.filter((resource) =>
      !linkedResourceIds.has(resource.id)
      && (activeFilters.size === 0 || activeFilters.has(resource.type))
      && (term === '' || resource.name.toLowerCase().includes(term))
    );
  }, [activeFilters, links, resources, searchTerm]);

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

      {!showSelector ? (
        <Button variant="ghost" size="md" onClick={() => setShowSelector(true)}>
          <Plus size={16} /> {t('resources.add')}
        </Button>
      ) : (
        <div className="resources-panel__selector">
          <div className="resources-panel__search">
            <Search size={14} className="resources-panel__search-icon" />
            <input
              ref={searchRef}
              className="resources-panel__search-input"
              type="text"
              placeholder={t('resources.searchPlaceholder')}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="resources-panel__filters" aria-label={t('resources.filterLabel')}>
            {RESOURCE_TYPES.map((type) => (
              <button
                type="button"
                key={type}
                className={`resources-panel__filter ${activeFilters.has(type) ? 'resources-panel__filter--active' : ''}`}
                onClick={() => toggleFilter(type)}
                aria-pressed={activeFilters.has(type)}
              >
                {t(`resources.type.${type}`)}
              </button>
            ))}
          </div>

          <div className="resources-panel__results">
            {selectableResources.length === 0 && (
              <p className="resources-panel__no-results">{t('resources.noResults')}</p>
            )}
            {selectableResources.map((resource) => (
              <button
                type="button"
                key={resource.id}
                className="resources-panel__result"
                onClick={() => addLink(resource.id)}
              >
                <span className="resources-panel__result-name">{resource.name || t('resources.unnamed')}</span>
                <span className="resources-panel__result-type">{t(`resources.type.${resource.type}`)}</span>
              </button>
            ))}
          </div>

          <div className="resources-panel__selector-footer">
            <button type="button" className="resources-panel__close-selector" onClick={closeSelector}>
              <X size={14} /> {t('resources.closeSelector')}
            </button>
          </div>
        </div>
      )}

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
        .resources-panel__selector { animation:fadeIn .2s ease; background:var(--c-surface-elevated); border:1px solid var(--c-border); border-radius:var(--r-md); margin-top:var(--s-sm); padding:var(--s-md); }
        .resources-panel__search { align-items:center; border-bottom:1px solid var(--c-border); display:flex; gap:var(--s-xs); padding-bottom:var(--s-sm); }
        .resources-panel__search-icon { color:var(--c-text-muted); flex-shrink:0; }
        .resources-panel__search-input { background:transparent; border:0; color:var(--c-text); flex:1; font:inherit; font-size:.85rem; min-width:0; }
        .resources-panel__search-input:focus { outline:0; }
        .resources-panel__search-input::placeholder { color:var(--c-text-muted); }
        .resources-panel__filters { display:flex; flex-wrap:wrap; gap:var(--s-xs); padding:var(--s-sm) 0; }
        .resources-panel__filter { background:transparent; border:1px solid var(--c-border); border-radius:var(--r-full); color:var(--c-text-secondary); cursor:pointer; font:inherit; font-size:.72rem; font-weight:600; letter-spacing:.03em; padding:var(--s-xs) var(--s-sm); text-transform:uppercase; transition:all var(--t-fast); }
        .resources-panel__filter:hover { border-color:var(--c-primary); color:var(--c-text); }
        .resources-panel__filter--active { background:var(--c-primary-muted); border-color:rgba(var(--c-primary-rgb),.5); color:var(--c-primary); }
        .resources-panel__results { display:flex; flex-direction:column; gap:2px; max-height:220px; overflow-y:auto; }
        .resources-panel__no-results { color:var(--c-text-muted); font-size:.82rem; font-style:italic; margin:0; padding:var(--s-sm) 0; }
        .resources-panel__result { align-items:center; background:transparent; border:0; border-radius:var(--r-sm); color:var(--c-text); cursor:pointer; display:flex; font:inherit; font-size:.84rem; gap:var(--s-sm); padding:6px var(--s-sm); text-align:left; transition:background var(--t-fast); width:100%; }
        .resources-panel__result:hover { background:var(--c-primary-muted); }
        .resources-panel__result-name { flex:1; font-weight:500; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .resources-panel__result-type { color:var(--c-text-muted); font-size:.7rem; font-weight:600; text-transform:uppercase; }
        .resources-panel__selector-footer { border-top:1px solid var(--c-border); display:flex; justify-content:flex-end; margin-top:var(--s-sm); padding-top:var(--s-sm); }
        .resources-panel__close-selector { align-items:center; background:var(--c-surface-elevated); border:1px solid var(--c-border); border-radius:var(--r-sm); color:var(--c-text-secondary); cursor:pointer; display:flex; font:inherit; font-size:.78rem; gap:4px; padding:var(--s-xs) var(--s-sm); }
        .resources-panel__close-selector:hover { border-color:var(--c-primary); color:var(--c-primary); }
        @media (max-width:768px) { .resources-panel__item { grid-template-columns:1fr auto; } .resources-panel__free { grid-column:1; } .resources-panel__cost { grid-column:2; grid-row:2; } .resources-panel__remove { grid-column:2; grid-row:1; } }
      `}</style>
    </section>
  );
}
