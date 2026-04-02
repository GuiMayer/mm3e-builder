import { useCharStore } from '../../store/charStore';
import { useTranslation } from 'react-i18next';

export function DefensesPanel({ cost }: { cost: number }) {
  const { t } = useTranslation();
  const abilities = useCharStore((s) => s.character.abilities);
  const defenses = useCharStore((s) => s.character.defenses);
  const setDefense = useCharStore((s) => s.setDefense);

  const rows = [
    { key: 'dodge' as const, base: abilities.agl, baseLabel: 'AGL' },
    { key: 'parry' as const, base: abilities.fgt, baseLabel: 'FGT' },
    { key: 'fortitude' as const, base: abilities.sta, baseLabel: 'STA' },
    { key: 'will' as const, base: abilities.awe, baseLabel: 'AWE' },
  ];

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t('defenses.title')}</h2>
        <span className="panel-cost">{cost} {t('common.pp')}</span>
      </div>
      <div className="defenses-table">
        {rows.map((r) => (
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
            <span className="defense-total">= {r.base + defenses[r.key]}</span>
          </div>
        ))}
        <div className="defense-row defense-row--readonly">
          <span className="defense-name">{t('defenses.toughness')}</span>
          <span className="defense-base">STA {abilities.sta}</span>
          <span className="defense-plus">+</span>
          <span className="defense-input defense-locked">{t('common.powers')}</span>
          <span className="defense-total">= {abilities.sta}</span>
        </div>
      </div>

      <style>{`
        .defenses-table { display: flex; flex-direction: column; gap: var(--s-xs); }
        .defense-row {
          display: flex; align-items: center; gap: var(--s-sm);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); padding: var(--s-sm) var(--s-md);
        }
        .defense-row--readonly { opacity: 0.6; }
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
        .defense-locked { background: transparent; border-color: transparent; color: var(--c-text-muted); font-style: italic; font-size: 0.78rem; }
        .defense-total { font-weight: 700; font-size: 0.95rem; color: var(--c-primary); min-width: 40px; text-align: right; }
      `}</style>
    </section>
  );
}
