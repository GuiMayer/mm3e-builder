import { useDraggable } from '@dnd-kit/core';
import modifierDefsRaw from '../../data/modifiers.json';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { Tooltip } from '../../shared/ui/Tooltip';
import { Search, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  filter: string;
  onFilterChange: (val: string) => void;
}

export function EffectPalette({ filter, onFilterChange }: Props) {
  const { t } = useTranslation();
  const modifierDefs = useLocalizedData(modifierDefsRaw as any) as typeof modifierDefsRaw;
  const lowerFilter = filter.toLowerCase();

  const extras = modifierDefs.filter(
    (m) => m.category === 'extra' &&
      (m.name.toLowerCase().includes(lowerFilter) || m.description.toLowerCase().includes(lowerFilter))
  );
  const flaws = modifierDefs.filter(
    (m) => m.category === 'flaw' &&
      (m.name.toLowerCase().includes(lowerFilter) || m.description.toLowerCase().includes(lowerFilter))
  );

  return (
    <aside className="palette">
      <div className="palette-search">
        <Search size={14} className="palette-search-icon" />
        <input
          className="palette-search-input"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder={t('palette.search')}
        />
      </div>

      <div className="palette-section">
        <h3 className="palette-heading">
          <ArrowUpCircle size={14} /> {t('palette.extras')} ({extras.length})
        </h3>
        <div className="palette-list">
          {extras.map((mod) => (
            <DraggableModifier key={mod.id} mod={mod} />
          ))}
        </div>
      </div>

      <div className="palette-section">
        <h3 className="palette-heading palette-heading--flaw">
          <ArrowDownCircle size={14} /> {t('palette.flaws')} ({flaws.length})
        </h3>
        <div className="palette-list">
          {flaws.map((mod) => (
            <DraggableModifier key={mod.id} mod={mod} />
          ))}
        </div>
      </div>

      <style>{`
        .palette {
          width: 260px; min-width: 260px; background: var(--c-surface);
          border-right: 1px solid var(--c-border);
          display: flex; flex-direction: column; overflow-y: auto;
        }
        .palette-search {
          display: flex; align-items: center; gap: var(--s-xs);
          padding: var(--s-sm) var(--s-md);
          border-bottom: 1px solid var(--c-border);
        }
        .palette-search-icon { color: var(--c-text-muted); flex-shrink: 0; }
        .palette-search-input {
          flex: 1; background: transparent; border: none;
          color: var(--c-text); font-family: var(--f-body); font-size: 0.85rem;
        }
        .palette-search-input:focus { outline: none; }
        .palette-search-input::placeholder { color: var(--c-text-muted); }

        .palette-section { padding: var(--s-sm) var(--s-md); }
        .palette-heading {
          font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--c-success);
          display: flex; align-items: center; gap: var(--s-xs);
          margin-bottom: var(--s-sm);
        }
        .palette-heading--flaw { color: var(--c-error); }
        .palette-list { display: flex; flex-direction: column; gap: 4px; }
      `}</style>
    </aside>
  );
}

// ── Draggable Modifier Item ──
function DraggableModifier({ mod }: { mod: typeof modifierDefsRaw[0] }) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: mod.id,
  });

  const costLabel = `${mod.costValue > 0 ? '+' : ''}${mod.costValue}/${mod.costType === 'per_rank' ? t('common.rank') : t('common.flat')}`;

  return (
    <Tooltip content={`${mod.description} (${costLabel})`}>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={`palette-item ${mod.category === 'flaw' ? 'palette-item--flaw' : ''} ${isDragging ? 'palette-item--dragging' : ''}`}
        aria-label={t('palette.modifierAria', { type: mod.category === 'extra' ? t('palette.extras') : t('palette.flaws'), name: mod.name, cost: costLabel })}
      >
        <span className="palette-item-name">{mod.name}</span>
        <span className="palette-item-cost">{costLabel}</span>
      </div>

      <style>{`
        .palette-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 6px 10px; border-radius: var(--r-sm);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          cursor: grab; transition: all var(--t-fast);
          font-size: 0.82rem; user-select: none;
        }
        .palette-item:hover { border-color: var(--c-success); background: rgba(74,222,128,0.08); }
        .palette-item--flaw:hover { border-color: var(--c-error); background: rgba(248,113,113,0.08); }
        .palette-item--dragging { opacity: 0.4; cursor: grabbing; }
        .palette-item-name { font-weight: 500; }
        .palette-item-cost { font-size: 0.7rem; color: var(--c-text-muted); font-variant-numeric: tabular-nums; }
      `}</style>
    </Tooltip>
  );
}
