import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { useValidModifiers } from './hooks/useValidModifiers';
import { Search, ArrowUpCircle, ArrowDownCircle, Zap, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { IPowerEffect, IModifierDef } from '../../entities/types';
import { Modal } from '../../shared/ui/Modal';

type PaletteTab = 'extras' | 'flaws' | 'specific';

interface Props {
  filter: string;
  onFilterChange: (val: string) => void;
  selectedEffect?: IPowerEffect;
  onAddModifier: (modId: string, isPowerSpecific?: boolean) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  contextName?: string | null;   // badge shown when palette serves an AE component
  equipmentMode?: boolean;        // when true, hide 'removable' modifier
}

export function EffectPalette({
  filter,
  onFilterChange,
  selectedEffect,
  onAddModifier,
  collapsed,
  onToggleCollapse,
  contextName,
  equipmentMode,
}: Props) {
  const { t } = useTranslation();
  const modifierDefs = useLocalizedData(MODIFIER_DEFS) as IModifierDef[];
  const [activeTab, setActiveTab] = useState<PaletteTab>('extras');
  const [modalMod, setModalMod] = useState<IModifierDef | null>(null);

  // Phase 4: Use valid modifiers hook to check power-specific availability
  const { powerSpecificModifiers } = useValidModifiers(selectedEffect, modifierDefs);
  const powerSpecificIds = new Set(powerSpecificModifiers.map((m) => m.id));

  const lowerFilter = filter.toLowerCase();

  const generalExtras = modifierDefs.filter(
    (m) =>
      m.category === 'extra' &&
      // Arrays are edited in the dedicated Alternate Effects section, which
      // enforces their cap and Dynamic pricing. Do not add this flat modifier
      // directly to a component.
      m.id !== 'alternate_effect' &&
      m.id !== 'activation' &&
      (m.name.toLowerCase().includes(lowerFilter) || m.description.toLowerCase().includes(lowerFilter))
  );
  const generalFlaws = modifierDefs.filter(
    (m) =>
      m.category === 'flaw' &&
      // Hide 'removable' in equipment mode (EP system handles it)
      !(equipmentMode && m.id === 'removable') &&
      (m.name.toLowerCase().includes(lowerFilter) || m.description.toLowerCase().includes(lowerFilter))
  );

  const specificMods: IModifierDef[] = selectedEffect
    ? [
        ...(selectedEffect.extras || []).filter(
          (m) =>
            m.name.toLowerCase().includes(lowerFilter) ||
            m.description.toLowerCase().includes(lowerFilter)
        ),
        ...(selectedEffect.flaws || []).filter(
          (m) =>
            m.name.toLowerCase().includes(lowerFilter) ||
            m.description.toLowerCase().includes(lowerFilter)
        ),
      ]
    : [];

  const specificCount = specificMods.length;

  if (collapsed) {
    return (
      <aside className="palette palette--collapsed">
        <button className="palette-toggle-btn" onClick={onToggleCollapse} title={t('builder.expandPalette')}>
          <ChevronRight size={16} />
        </button>
        {contextName && (
          <span className="palette-collapsed-context" title={contextName}>
            {contextName}
          </span>
        )}
        <style>{`
          .palette--collapsed { width: 36px; min-width: 36px; align-items: center; padding-top: var(--s-sm); }
          .palette-toggle-btn {
            background: transparent; border: none; color: var(--c-text-muted);
            cursor: pointer; display: flex; padding: var(--s-xs);
            transition: color var(--t-fast);
          }
          .palette-toggle-btn:hover { color: var(--c-primary); }
          .palette-collapsed-context {
            writing-mode: vertical-rl;
            text-orientation: mixed;
            font-size: 0.65rem;
            color: var(--c-accent);
            opacity: 0.85;
            padding: var(--s-xs) 0;
            max-height: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: default;
            margin-top: var(--s-xs);
          }
        `}</style>
      </aside>
    );
  }

  return (
    <aside className="palette">
      {/* Header with collapse button */}
      <div className="palette-header">
        <div className="palette-search">
          <Search size={14} className="palette-search-icon" />
          <input
            className="palette-search-input"
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            placeholder={t('palette.search')}
          />
        </div>
        <button className="palette-toggle-btn" onClick={onToggleCollapse} title={t('builder.collapseAll')}>
          <ChevronLeft size={16} />
        </button>
      </div>
      {contextName && (
        <div className="palette-context-badge">
          ✏️ {contextName}
        </div>
      )}

      {/* Tabs */}
      <div className="palette-tabs">
        <button
          className={`palette-tab ${activeTab === 'extras' ? 'palette-tab--active palette-tab--extra' : ''}`}
          onClick={() => setActiveTab('extras')}
        >
          <ArrowUpCircle size={12} /> {t('palette.extras')} ({generalExtras.length})
        </button>
        <button
          className={`palette-tab ${activeTab === 'flaws' ? 'palette-tab--active palette-tab--flaw' : ''}`}
          onClick={() => setActiveTab('flaws')}
        >
          <ArrowDownCircle size={12} /> {t('palette.flaws')} ({generalFlaws.length})
        </button>
        <button
          className={`palette-tab ${activeTab === 'specific' ? 'palette-tab--active palette-tab--specific' : ''} ${!selectedEffect ? 'palette-tab--disabled' : ''}`}
          onClick={() => selectedEffect && setActiveTab('specific')}
          title={!selectedEffect ? t('palette.noSpecificEffect') : undefined}
        >
          <Zap size={12} /> {t('palette.specific')} ({specificCount})
        </button>
      </div>

      {/* List */}
      <div className="palette-list-container">
        {activeTab === 'extras' &&
          generalExtras.map((mod) => (
            <DraggableModifier
              key={mod.id}
              mod={mod}
              isPowerSpecific={false}
              hasPowerSpecificVersion={powerSpecificIds.has(mod.id)}
              selectedEffectName={selectedEffect?.name}
              onAdd={onAddModifier}
              onInfo={setModalMod}
            />
          ))}
        {activeTab === 'flaws' &&
          generalFlaws.map((mod) => (
            <DraggableModifier
              key={mod.id}
              mod={mod}
              isPowerSpecific={false}
              hasPowerSpecificVersion={powerSpecificIds.has(mod.id)}
              selectedEffectName={selectedEffect?.name}
              onAdd={onAddModifier}
              onInfo={setModalMod}
            />
          ))}
        {activeTab === 'specific' && !selectedEffect && (
          <p className="palette-empty">{t('palette.noSpecificEffect')}</p>
        )}
        {activeTab === 'specific' &&
          selectedEffect &&
          specificMods.length === 0 && (
            <p className="palette-empty">{t('palette.noSpecificMods')}</p>
          )}
        {activeTab === 'specific' &&
          specificMods.map((mod) => (
            <DraggableModifier
              key={mod.id}
              mod={mod}
              isPowerSpecific={true}
              onAdd={onAddModifier}
              onInfo={setModalMod}
            />
          ))}
      </div>

      {/* Modifier detail modal */}
      {modalMod && (
        <Modal
          isOpen={true}
          compact
          title={modalMod.name}
          onClose={() => setModalMod(null)}
        >
          <div className="mod-modal-content">
            <div className="mod-modal-meta">
              <span className={`mod-badge ${modalMod.category === 'flaw' ? 'mod-badge--flaw' : 'mod-badge--extra'}`}>
                {modalMod.category === 'extra' ? 'Extra' : 'Flaw'}
              </span>
              <span className="mod-badge mod-badge--cost">
                {modalMod.costValue > 0 ? '+' : ''}{modalMod.costValue}
                {modalMod.costType === 'per_rank' ? '/rank' : modalMod.costType === 'flat_ranked' ? ' flat/rank' : ' flat'}
              </span>
              {modalMod.maxRanks && (
                <span className="mod-badge mod-badge--max">max {modalMod.maxRanks}</span>
              )}
            </div>
            <p className="mod-modal-desc">{modalMod.longDescription || modalMod.description}</p>
            {modalMod.options && modalMod.options.length > 0 && (
              <div className="mod-modal-options">
                <h4>Options:</h4>
                <ul>
                  {modalMod.options.map((opt) => (
                    <li key={opt.label}><strong>{opt.label}</strong>: {opt.notes}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      )}

      <style>{`
        .palette {
          width: 270px; min-width: 270px; background: var(--c-surface);
          border-right: 1px solid var(--c-border);
          display: flex; flex-direction: column; overflow: hidden;
          transition: width var(--t-fast);
        }
        .palette-header {
          display: flex; align-items: center;
          border-bottom: 1px solid var(--c-border);
        }
        .palette-search {
          flex: 1; display: flex; align-items: center; gap: var(--s-xs);
          padding: var(--s-sm) var(--s-md);
        }
        .palette-search-icon { color: var(--c-text-muted); flex-shrink: 0; }
        .palette-search-input {
          flex: 1; background: transparent; border: none;
          color: var(--c-text); font-family: var(--f-body); font-size: 0.85rem;
        }
        .palette-search-input:focus { outline: none; }
        .palette-search-input::placeholder { color: var(--c-text-muted); }
        .palette-toggle-btn {
          background: transparent; border: none; color: var(--c-text-muted);
          cursor: pointer; display: flex; padding: var(--s-sm);
          transition: color var(--t-fast); flex-shrink: 0;
        }
        .palette-toggle-btn:hover { color: var(--c-primary); }
        .palette-context-badge {
          font-size: 0.7rem; font-weight: 600; padding: 4px var(--s-md);
          background: rgba(245,158,11,0.12); border-bottom: 1px solid rgba(245,158,11,0.3);
          color: #f59e0b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .palette-tabs {
          display: flex; border-bottom: 1px solid var(--c-border);
          flex-shrink: 0;
        }
        .palette-tab {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 4px; padding: 6px 4px; font-size: 0.7rem; font-weight: 600;
          background: transparent; border: none; cursor: pointer;
          color: var(--c-text-muted); transition: all var(--t-fast);
          text-align: center;
        }
        .palette-tab:hover { color: var(--c-text); background: var(--c-surface-elevated); }
        .palette-tab--active { border-bottom: 2px solid; }
        .palette-tab--active.palette-tab--extra { color: var(--c-success); border-color: var(--c-success); }
        .palette-tab--active.palette-tab--flaw { color: var(--c-error); border-color: var(--c-error); }
        .palette-tab--active.palette-tab--specific { color: #f59e0b; border-color: #f59e0b; }
        .palette-tab--disabled { opacity: 0.4; cursor: not-allowed; }

        .palette-list-container {
          flex: 1; overflow-y: auto; padding: var(--s-sm) var(--s-md);
          display: flex; flex-direction: column; gap: 4px;
        }
        .palette-empty {
          color: var(--c-text-muted); font-size: 0.82rem;
          font-style: italic; text-align: center; padding: var(--s-md);
        }
        .mod-modal-content { display: flex; flex-direction: column; gap: var(--s-md); }
        .mod-modal-meta { display: flex; gap: var(--s-xs); flex-wrap: wrap; }
        .mod-badge {
          font-size: 0.7rem; font-weight: 700; padding: 2px 8px;
          border-radius: var(--r-full); text-transform: uppercase;
        }
        .mod-badge--extra { background: rgba(74,222,128,0.2); color: var(--c-success); }
        .mod-badge--flaw { background: rgba(248,113,113,0.2); color: var(--c-error); }
        .mod-badge--cost { background: var(--c-surface-elevated); color: var(--c-text-secondary); }
        .mod-badge--max { background: rgba(245,158,11,0.15); color: #f59e0b; }
        .mod-modal-desc { font-size: 0.88rem; line-height: 1.6; color: var(--c-text); }
        .mod-modal-options h4 { font-size: 0.78rem; font-weight: 700; color: var(--c-text-secondary); margin-bottom: var(--s-xs); }
        .mod-modal-options ul { margin: 0; padding-left: var(--s-md); display: flex; flex-direction: column; gap: 4px; }
        .mod-modal-options li { font-size: 0.82rem; color: var(--c-text-secondary); }

        /* Mobile optimizations for palette */
        @media (max-width: 768px) {
          .palette {
            width: 100%;
            min-width: 100%;
            border-right: none;
          }
          
          .palette-header {
            padding: 0;
          }
          
          .palette-search {
            padding: var(--s-md);
          }
          
          .palette-search-input {
            font-size: 1rem;
          }
          
          .palette-tabs {
            position: sticky;
            top: 0;
            background: var(--c-surface);
            z-index: 10;
          }
          
          .palette-tab {
            padding: var(--s-sm) var(--s-xs);
            font-size: 0.8rem;
            min-height: var(--touch-target-min);
          }
          
          .palette-list-container {
            padding: var(--s-md);
            gap: var(--s-sm);
          }
          
          .palette-context-badge {
            font-size: 0.8rem;
            padding: var(--s-sm) var(--s-md);
          }
        }
      `}</style>
    </aside>
  );
}

// ── Draggable Modifier Item ──
function DraggableModifier({
  mod,
  isPowerSpecific,
  hasPowerSpecificVersion,
  selectedEffectName,
  onAdd,
  onInfo,
}: {
  mod: IModifierDef;
  isPowerSpecific: boolean;
  hasPowerSpecificVersion?: boolean;
  selectedEffectName?: string;
  onAdd: (id: string, isPowerSpecific?: boolean) => void;
  onInfo: (mod: IModifierDef) => void;
}) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: mod.id });

  const costLabel =
    mod.costType === 'per_rank'
      ? `${mod.costValue > 0 ? '+' : ''}${mod.costValue}/${t('common.rank')}`
      : mod.costType === 'flat_ranked'
      ? `${mod.costValue > 0 ? '+' : ''}${mod.costValue} ${t('palette.flatRank')}`
      : `${mod.costValue > 0 ? '+' : ''}${mod.costValue} ${t('common.flat')}`;

  const isExtra = mod.category === 'extra';
  const itemClass = isPowerSpecific
    ? 'palette-item palette-item--specific'
    : isExtra
    ? 'palette-item'
    : 'palette-item palette-item--flaw';

  // Phase 4: Show tooltip when power-specific version exists
  const tooltipText = hasPowerSpecificVersion && selectedEffectName
    ? `${mod.name} - Power-specific version available for ${selectedEffectName} in "Specific" tab`
    : `${mod.category === 'extra' ? 'Extra' : 'Flaw'}: ${mod.name}, cost ${costLabel}`;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${itemClass} ${isDragging ? 'palette-item--dragging' : ''} ${hasPowerSpecificVersion ? 'palette-item--has-specific' : ''}`}
      aria-label={tooltipText}
      title={hasPowerSpecificVersion ? tooltipText : undefined}
    >
      <span className="palette-item-name">
        {mod.name}
        {hasPowerSpecificVersion && <span className="palette-item-specific-indicator" title="Power-specific version available">⚡</span>}
      </span>
      <div className="palette-item-actions">
        <span className="palette-item-cost">{costLabel}</span>
        <button
          className="palette-item-info"
          onClick={(e) => { e.stopPropagation(); onInfo(mod); }}
          title={t('builder.viewModifier')}
        >
          <Info size={11} />
        </button>
        <button
          className="palette-item-add"
          onClick={(e) => { e.stopPropagation(); onAdd(mod.id, isPowerSpecific); }}
          title={t('palette.clickToAdd')}
        >
          +
        </button>
      </div>

      <style>{`
        .palette-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 5px 8px; border-radius: var(--r-sm);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          cursor: grab; transition: all var(--t-fast);
          font-size: 0.8rem; user-select: none; gap: 6px;
        }
        .palette-item:hover { border-color: var(--c-success); background: rgba(74,222,128,0.08); }
        .palette-item--flaw:hover { border-color: var(--c-error); background: rgba(248,113,113,0.08); }
        .palette-item--specific { border-color: rgba(245,158,11,0.3); }
        .palette-item--specific:hover { border-color: #f59e0b; background: rgba(245,158,11,0.08); }
        .palette-item--has-specific { border-left: 3px solid rgba(245,158,11,0.5); }
        .palette-item--dragging { opacity: 0.4; cursor: grabbing; }
        .palette-item-name { font-weight: 500; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: flex; align-items: center; gap: 4px; }
        .palette-item-specific-indicator { 
          font-size: 0.7rem; color: #f59e0b; flex-shrink: 0;
          animation: pulse-glow 2s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .palette-item-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
        .palette-item-cost { font-size: 0.68rem; color: var(--c-text-muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
        .palette-item-info, .palette-item-add {
          background: transparent; border: none; cursor: pointer;
          color: var(--c-text-muted); display: flex; align-items: center;
          padding: 1px 3px; border-radius: 3px; transition: all var(--t-fast);
          font-size: 0.75rem; line-height: 1;
        }
        .palette-item-info:hover { color: var(--c-primary); background: var(--c-primary-muted); }
        .palette-item-add:hover { color: var(--c-success); background: rgba(74,222,128,0.15); }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .palette-item {
            flex-direction: row;
            align-items: center;
            padding: var(--s-sm) var(--s-md);
            gap: var(--s-sm);
            min-height: var(--touch-target-min);
          }
          
          .palette-item-name {
            flex: 1;
            font-size: 0.9rem;
            white-space: normal;
            overflow: visible;
            text-overflow: unset;
            line-height: 1.3;
          }
          
          .palette-item-actions {
            gap: var(--s-xs);
            flex-shrink: 0;
            align-items: center;
          }
          
          .palette-item-cost {
            font-size: 0.75rem;
            padding: 2px 6px;
            background: var(--c-surface);
            border-radius: var(--r-xs);
          }
          
          .palette-item-info, .palette-item-add {
            min-width: var(--touch-target-min);
            min-height: var(--touch-target-min);
            padding: var(--s-xs);
            font-size: 0.85rem;
          }
          
          .palette-item-add {
            font-size: 1.1rem;
            font-weight: 600;
          }
        }
      `}</style>
    </div>
  );
}
