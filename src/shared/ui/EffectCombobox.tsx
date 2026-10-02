import { useEffect, useId, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import type { IPowerEffect } from '../../entities/types';
import { useAlphabeticalList } from '../hooks/useAlphabeticalList';

export interface EffectComboboxProps {
  value: string;
  onChange: (id: string) => void;
  allEffects: IPowerEffect[];
  t: (key: string) => string;
  onInfo: (e: IPowerEffect) => void;
}

/**
 * Live-search combobox for power effects.
 * ─ Single input field; as you type a floating dropdown appears.
 * ─ Arrow keys navigate, Enter selects, Escape closes.
 * ─ Clicking outside closes the dropdown.
 * ─ Replaces the old [filter input + type select + separate select] pattern.
 */
export function EffectCombobox({ value, onChange, allEffects, t, onInfo }: EffectComboboxProps) {
  const [query, setQuery] = useState(() => allEffects.find((effect) => effect.id === value)?.name ?? '');
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedEff = allEffects.find((d) => d.id === value) ?? null;
  const orderedEffects = useAlphabeticalList(allEffects);

  // Filtered list — matches name or type, case-insensitive
  const filtered = query.trim()
    ? orderedEffects.filter((e) =>
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.type.toLowerCase().includes(query.toLowerCase())
      )
    : orderedEffects;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!listRef.current) return;
    const item = listRef.current.children[highlightIdx] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [highlightIdx]);

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (e.key === 'Escape' && open) { e.preventDefault(); e.stopPropagation(); setOpen(false); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx((i) => Math.max(0, Math.min(i + 1, filtered.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const eff = filtered[highlightIdx];
      if (eff) selectEffect(eff.id);
    }
  }

  function selectEffect(id: string) {
    onChange(id);
    const eff = allEffects.find((e) => e.id === id);
    setQuery(eff?.name ?? '');
    setOpen(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setHighlightIdx(0);
    setOpen(true);
    // Clear selection when user clears input or types something new
    if (e.target.value === '') onChange('');
  }

  function handleInputFocus() {
    setOpen(true);
    // When focused, show all options if nothing typed yet
    if (!query && selectedEff) setQuery('');
  }

  // When a value is passed externally (e.g. existing power loaded),
  // sync the visible text. This is a legitimate use of setState in effect
  // because we're synchronizing with an external prop change.
  const prevValueRef = useRef(value);
  const prevNameRef = useRef(selectedEff?.name);
  useEffect(() => {
    if (value !== prevValueRef.current || selectedEff?.name !== prevNameRef.current) {
      prevValueRef.current = value;
      prevNameRef.current = selectedEff?.name;
      const eff = allEffects.find((e) => e.id === value);
      const newQuery = eff?.name ?? '';
      // Only update if different to avoid unnecessary re-renders
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery(prev => prev === newQuery ? prev : newQuery);
    }
  }, [value, allEffects, selectedEff?.name]);

  return (
    <div className="ecb-root" ref={containerRef}>
      <div className="ecb-input-row">
        <input
          ref={inputRef}
          role="combobox"
          aria-label={t('builder.searchEffect')}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open && filtered.length > 0 ? listId : undefined}
          aria-activedescendant={open && filtered[highlightIdx] ? `${listId}-${filtered[highlightIdx].id}` : undefined}
          className="ecb-input"
          value={query}
          placeholder={t('builder.searchEffect')}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          onClick={(e) => { e.stopPropagation(); setOpen(true); }}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          className="ecb-info-btn"
          disabled={!selectedEff}
          onClick={(e) => { e.stopPropagation(); if (selectedEff) onInfo(selectedEff); }}
          title={t('builder.viewEffect')}
          aria-label={t('builder.viewEffect')}
          type="button"
        >
          <Info size={14} />
        </button>
      </div>

      {open && filtered.length > 0 && (
        <ul id={listId} className="ecb-dropdown" ref={listRef} role="listbox" aria-label={t('builder.searchEffect')}>
          {filtered.map((eff, idx) => (
            <li
              key={eff.id}
              id={`${listId}-${eff.id}`}
              role="option"
              aria-selected={eff.id === value}
              className={[
                'ecb-item',
                eff.id === value ? 'ecb-item--selected' : '',
                idx === highlightIdx ? 'ecb-item--highlighted' : '',
              ].join(' ')}
              onMouseDown={(e) => { e.preventDefault(); selectEffect(eff.id); }}
              onMouseEnter={() => setHighlightIdx(idx)}
            >
              <span className="ecb-item-name">{eff.name}</span>
              <span className="ecb-item-meta">
                <span className={`ecb-tag ecb-tag--${eff.type}`}>{eff.type}</span>
                <span className="ecb-cost">{eff.baseCost} PP/rank</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      {open && filtered.length === 0 && query && (
        <div className="ecb-empty">{t('builder.noEffectsFound')}</div>
      )}

      <style>{`
        .ecb-root {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .ecb-input-row {
          display: flex;
          gap: var(--s-xs);
          align-items: center;
        }
        .ecb-input {
          flex: 1;
          background: var(--c-surface-elevated);
          border: 1px solid var(--c-border);
          border-radius: var(--r-sm);
          padding: 7px 10px;
          color: var(--c-text);
          font-family: var(--f-body);
          font-size: 0.9rem;
          transition: border-color var(--t-fast);
        }
        .ecb-input:focus {
          outline: none;
          border-color: var(--c-primary);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--c-primary) 18%, transparent);
        }
        .ecb-info-btn {
          background: transparent;
          border: 1px solid var(--c-border);
          border-radius: var(--r-sm);
          color: var(--c-text-muted);
          cursor: pointer;
          padding: 6px 8px;
          display: flex;
          align-items: center;
          transition: all var(--t-fast);
          flex-shrink: 0;
        }
        .ecb-info-btn:hover:not(:disabled) {
          border-color: var(--c-primary);
          color: var(--c-primary);
        }
        .ecb-info-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        /* ── Dropdown ── */
        .ecb-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          z-index: 200;
          margin: 0;
          padding: 4px 0;
          list-style: none;
          background: var(--c-surface-elevated);
          border: 1px solid var(--c-border);
          border-radius: var(--r-md);
          box-shadow: 0 8px 24px rgba(var(--c-shadow-rgb, 0, 0, 0), calc(var(--c-shadow-alpha, 0.2) * 1.75));
          max-height: 280px;
          overflow-y: auto;
          scrollbar-width: thin;
        }
        .ecb-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 7px 12px;
          cursor: pointer;
          gap: var(--s-sm);
          transition: background var(--t-fast);
        }
        .ecb-item--highlighted {
          background: color-mix(in srgb, var(--c-primary) 14%, transparent);
        }
        .ecb-item--selected .ecb-item-name {
          color: var(--c-primary);
          font-weight: 600;
        }
        .ecb-item-name {
          font-size: 0.88rem;
          color: var(--c-text);
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ecb-item-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .ecb-tag {
          font-size: 0.68rem;
          padding: 2px 6px;
          border-radius: 99px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 600;
        }
        .ecb-tag--attack   { background: color-mix(in srgb,var(--c-category-attack, #ef4444) 18%,transparent); color:var(--c-category-attack, #f87171); }
        .ecb-tag--defense  { background: color-mix(in srgb,var(--c-category-defense, #3b82f6) 18%,transparent); color:var(--c-category-defense, #60a5fa); }
        .ecb-tag--movement { background: color-mix(in srgb,var(--c-category-movement, #10b981) 18%,transparent); color:var(--c-category-movement, #34d399); }
        .ecb-tag--sensory  { background: color-mix(in srgb,var(--c-category-sensory, #a855f7) 18%,transparent); color:var(--c-category-sensory, #c084fc); }
        .ecb-tag--control  { background: color-mix(in srgb,var(--c-category-control, #f59e0b) 18%,transparent); color:var(--c-category-control, #fbbf24); }
        .ecb-tag--general  { background: color-mix(in srgb,var(--c-category-general, #6b7280) 18%,transparent); color:var(--c-category-general, #9ca3af); }
        .ecb-cost {
          font-size: 0.72rem;
          color: var(--c-text-muted);
        }
        .ecb-empty {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          z-index: 200;
          padding: 10px 14px;
          background: var(--c-surface-elevated);
          border: 1px solid var(--c-border);
          border-radius: var(--r-md);
          color: var(--c-text-muted);
          font-size: 0.85rem;
          box-shadow: 0 8px 24px rgba(var(--c-shadow-rgb, 0, 0, 0), calc(var(--c-shadow-alpha, 0.2) * 1.25));
        }
      `}</style>
    </div>
  );
}
