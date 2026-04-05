import { useState } from 'react';
import { useCharStore } from '../../store/charStore';
import { useTranslation } from 'react-i18next';
import { useDerivedDefenses } from '../../shared/hooks/useDerivedDefenses';
import { Info } from 'lucide-react';

export function DefensesPanel({ cost }: { cost: number }) {
  const { t } = useTranslation();
  const abilities  = useCharStore((s) => s.character.abilities);
  const defenses   = useCharStore((s) => s.character.defenses);
  const setDefense = useCharStore((s) => s.setDefense);

  const { toughnessBonus, toughnessTotal, toughnessBreakdown, initiativeTotal, initiativeBreakdown } =
    useDerivedDefenses();

  const [tooltip, setTooltip] = useState<null | 'toughness' | 'initiative'>(null);

  const purchasedRows = [
    { key: 'dodge'     as const, base: abilities.agl, baseLabel: 'AGL' },
    { key: 'parry'     as const, base: abilities.fgt, baseLabel: 'FGT' },
    { key: 'fortitude' as const, base: abilities.sta, baseLabel: 'STA' },
    { key: 'will'      as const, base: abilities.awe, baseLabel: 'AWE' },
  ];

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t('defenses.title')}</h2>
        <span className="panel-cost">{cost} {t('common.pp')}</span>
      </div>

      <div className="defenses-table">

        {/* Initiative — read-only derived row */}
        <div
          className="defense-row defense-row--initiative"
          onMouseEnter={() => setTooltip('initiative')}
          onMouseLeave={() => setTooltip(null)}
        >
          <span className="defense-name">{t('defenses.initiative')}</span>
          <span className="defense-base">AGL {abilities.agl}</span>
          <span className="defense-plus" />
          <span className="defense-input defense-derived">
            {initiativeTotal >= 0 ? `+${initiativeTotal}` : `${initiativeTotal}`}
          </span>
          <span className="defense-total defense-total--initiative">
            <Info size={12} style={{ opacity: 0.5 }} />
          </span>
          {tooltip === 'initiative' && (
            <div className="defense-tooltip">
              {initiativeBreakdown.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}
        </div>

        <div className="defense-divider" />

        {/* Purchased defense rows */}
        {purchasedRows.map((r) => (
          <div key={r.key} className="defense-row">
            <span className="defense-name">{t(`defenses.${r.key}`)}</span>
            <span className="defense-base">{r.baseLabel} {r.base}</span>
            <span className="defense-plus">+</span>
            <input
              type="number" min={0}
              className="defense-input"
              value={defenses[r.key]}
              onChange={(e) => setDefense(r.key, Math.max(0, Number(e.target.value) || 0))}
            />
            <span className="defense-total">{r.base + defenses[r.key]}</span>
          </div>
        ))}

        {/* Toughness — read-only, derived, with breakdown tooltip */}
        <div
          className="defense-row defense-row--readonly defense-row--toughness"
          onMouseEnter={() => setTooltip('toughness')}
          onMouseLeave={() => setTooltip(null)}
        >
          <span className="defense-name">{t('defenses.toughness')}</span>
          <span className="defense-base">STA {abilities.sta}</span>
          <span className="defense-plus">+</span>
          <span className="defense-input defense-derived">{toughnessBonus}</span>
          <span className="defense-total">{toughnessTotal}</span>
          {tooltip === 'toughness' && (
            <div className="defense-tooltip">
              <div className="defense-tooltip-title">{t('defenses.toughnessBreakdown')}</div>
              <div>STA {abilities.sta}</div>
              {toughnessBreakdown.map((line, i) => (
                <div key={i}>+ {line}</div>
              ))}
              <div className="defense-tooltip-total">= {toughnessTotal}</div>
            </div>
          )}
        </div>

      </div>

      <style>{`
        .defenses-table { display: flex; flex-direction: column; gap: var(--s-xs); }

        .defense-row {
          position: relative;
          display: flex; align-items: center; gap: var(--s-sm);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); padding: var(--s-sm) var(--s-md);
        }
        .defense-row--readonly { opacity: 0.7; cursor: default; }
        .defense-row--toughness:hover { border-color: var(--c-border-active); opacity: 1; }
        .defense-row--initiative {
          opacity: 0.55;
          cursor: default;
          border-style: dashed;
        }
        .defense-row--initiative:hover { opacity: 0.8; border-color: var(--c-border-active); }

        .defense-divider {
          height: 1px;
          background: var(--c-border);
          margin: var(--s-xs) 0;
          opacity: 0.4;
        }

        .defense-name { font-weight: 600; font-size: 0.85rem; min-width: 100px; }
        .defense-base { font-size: 0.78rem; color: var(--c-text-secondary); min-width: 60px; }
        .defense-plus { color: var(--c-text-muted); }

        .defense-input {
          width: 50px; text-align: center;
          background: var(--c-bg); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); color: var(--c-text);
          font-family: var(--f-body); font-size: 0.9rem; padding: var(--s-xs);
        }
        .defense-input:focus { outline: none; border-color: var(--c-primary); }

        .defense-derived {
          background: transparent;
          border-color: transparent;
          color: var(--c-text-muted);
          font-style: italic;
          font-size: 0.85rem;
          pointer-events: none;
        }

        .defense-total {
          font-weight: 700; font-size: 0.95rem;
          color: var(--c-primary); min-width: 40px;
          text-align: right; margin-left: auto;
          display: flex; align-items: center; gap: 4px;
        }
        .defense-total--initiative {
          color: var(--c-text-muted);
          font-weight: 500;
          font-size: 0.88rem;
        }

        /* Tooltip */
        .defense-tooltip {
          position: absolute;
          bottom: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          background: var(--c-surface);
          border: 1px solid var(--c-border-active);
          border-radius: var(--r-md);
          padding: var(--s-sm) var(--s-md);
          font-size: 0.78rem;
          color: var(--c-text-secondary);
          white-space: nowrap;
          z-index: 100;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          pointer-events: none;
          line-height: 1.7;
          animation: fadeIn 0.15s ease;
        }
        .defense-tooltip-title {
          font-weight: 700;
          color: var(--c-text);
          margin-bottom: 2px;
          font-size: 0.8rem;
        }
        .defense-tooltip-total {
          margin-top: 4px;
          padding-top: 4px;
          border-top: 1px solid var(--c-border);
          font-weight: 700;
          color: var(--c-primary);
        }
      `}</style>
    </section>
  );
}
