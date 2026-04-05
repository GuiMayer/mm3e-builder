import { useOffenseSummary } from '../../shared/hooks/useOffenseSummary';
import { useTranslation } from 'react-i18next';
import { Zap } from 'lucide-react';

export function OffensePanel() {
  const { t } = useTranslation();
  const entries = useOffenseSummary();

  return (
    <section className="panel offense-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <Zap size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          {t('offense.title')}
        </h2>
      </div>

      <div className="offense-table">
        {/* Header row */}
        <div className="offense-row offense-row--header">
          <span className="offense-col offense-col--name">{t('offense.attack')}</span>
          <span className="offense-col offense-col--bonus">{t('offense.bonus')}</span>
          <span className="offense-col offense-col--range">{t('offense.range')}</span>
          <span className="offense-col offense-col--effect">{t('offense.effect')}</span>
          <span className="offense-col offense-col--notes">{t('offense.notes')}</span>
        </div>

        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`offense-row ${entry.isAE ? 'offense-row--ae' : ''} ${entry.id === '__unarmed__' ? 'offense-row--unarmed' : ''}`}
          >
            <span className="offense-col offense-col--name">
              {entry.isAE && <span className="offense-ae-indent">↳ </span>}
              {entry.name}
            </span>
            <span className="offense-col offense-col--bonus">{entry.bonus}</span>
            <span className="offense-col offense-col--range">{t(`offense.range_${entry.range.toLowerCase()}`, { defaultValue: entry.range })}</span>
            <span className="offense-col offense-col--effect">{entry.effect}</span>
            <span className="offense-col offense-col--notes">{entry.notes}</span>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="offense-empty">{t('offense.noAttacks')}</div>
        )}
      </div>

      <style>{`
        .offense-panel { }

        .offense-table {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--c-border);
          border-radius: var(--r-md);
          overflow: hidden;
        }

        .offense-row {
          display: grid;
          grid-template-columns: 1fr 60px 90px 1fr 120px;
          align-items: center;
          gap: var(--s-sm);
          padding: var(--s-sm) var(--s-md);
          border-bottom: 1px solid var(--c-border);
          transition: background var(--t-fast);
        }
        .offense-row:last-child { border-bottom: none; }
        .offense-row:hover:not(.offense-row--header) {
          background: var(--c-surface-elevated);
        }

        .offense-row--header {
          background: var(--c-surface-elevated);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--c-text-muted);
        }

        .offense-row--ae {
          opacity: 0.7;
          background: transparent;
          font-size: 0.85rem;
        }
        .offense-row--ae:hover { opacity: 0.9; }

        .offense-row--unarmed {
          opacity: 0.8;
          font-style: italic;
        }

        .offense-col { font-size: 0.875rem; }
        .offense-col--name { font-weight: 600; color: var(--c-text); }
        .offense-col--bonus {
          font-family: var(--f-heading);
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--c-primary);
          text-align: center;
        }
        .offense-col--range {
          font-size: 0.78rem;
          color: var(--c-text-secondary);
        }
        .offense-col--effect {
          color: var(--c-text-secondary);
        }
        .offense-col--notes {
          font-size: 0.75rem;
          color: var(--c-text-muted);
          font-style: italic;
        }

        .offense-ae-indent {
          color: var(--c-text-muted);
          margin-right: 2px;
          font-style: normal;
        }

        .offense-empty {
          padding: var(--s-md);
          text-align: center;
          color: var(--c-text-muted);
          font-size: 0.85rem;
          font-style: italic;
        }
      `}</style>
    </section>
  );
}
