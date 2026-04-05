import { useState } from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { useTranslation } from 'react-i18next';
import { CONDITIONS, BASIC_CONDITIONS, COMBINED_CONDITIONS } from '../../data/conditions';
import { Activity, ChevronDown, ChevronRight, X } from 'lucide-react';

/**
 * F-16: Active Conditions Tracker
 * Session-only state — never persisted to the character save file.
 * Shows a grid of clickable condition badges with hover tooltip.
 */
export function ConditionsPanel() {
  const { t } = useTranslation();
  const activeConditions = useSessionStore((s) => s.activeConditions);
  const toggleCondition = useSessionStore((s) => s.toggleCondition);
  const clearConditions = useSessionStore((s) => s.clearConditions);

  const [open, setOpen] = useState(true);

  // Only count non-'normal' active conditions
  const realActive = [...activeConditions].filter((id) => id !== 'normal').length;

  return (
    <section className="panel conditions-panel">
      <div className="conditions-header">
        <button
          className="conditions-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <Activity size={14} />
          {t('conditions.title')}
          {realActive > 0 && (
            <span className="conditions-badge conditions-badge--alert">
              {t('conditions.activeCount', { count: realActive })}
            </span>
          )}
        </button>
        {open && realActive > 0 && (
          <button className="conditions-clear-btn" onClick={clearConditions} title={t('conditions.clearAll')}>
            <X size={13} /> {t('conditions.clearAll')}
          </button>
        )}
      </div>

      {open && (
        <div className="conditions-body">
          {/* Basic conditions */}
          <div className="conditions-section-label">{t('conditions.basic')}</div>
          <div className="conditions-grid">
            {BASIC_CONDITIONS.filter((c) => c.id !== 'normal').map((cond) => {
              const isActive = activeConditions.has(cond.id);
              return (
                <button
                  key={cond.id}
                  className={`condition-badge ${isActive ? 'condition-badge--active' : ''}`}
                  onClick={() => toggleCondition(cond.id)}
                  title={cond.description}
                >
                  {t(`conditions.${cond.id}`, { defaultValue: cond.name })}
                </button>
              );
            })}
          </div>

          {/* Combined conditions */}
          <div className="conditions-section-label">{t('conditions.combined')}</div>
          <div className="conditions-grid">
            {COMBINED_CONDITIONS.map((cond) => {
              const isActive = activeConditions.has(cond.id);
              return (
                <button
                  key={cond.id}
                  className={`condition-badge condition-badge--combined ${isActive ? 'condition-badge--active' : ''}`}
                  onClick={() => toggleCondition(cond.id)}
                  title={`${cond.description}${cond.components ? `\n\n= ${cond.components.map((id) => CONDITIONS.find((c) => c.id === id)?.name ?? id).join(' + ')}` : ''}`}
                >
                  {t(`conditions.${cond.id}`, { defaultValue: cond.name })}
                </button>
              );
            })}
          </div>

          {realActive === 0 && (
            <div className="conditions-normal-hint">
              {t(`conditions.normal`, { defaultValue: 'Normal' })} — no active conditions
            </div>
          )}
        </div>
      )}

      <style>{`
        .conditions-panel {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--r-lg);
          overflow: hidden;
        }
        .conditions-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--s-sm) var(--s-md);
          background: var(--c-surface-elevated);
          border-bottom: 1px solid var(--c-border);
        }
        .conditions-toggle {
          display: flex;
          align-items: center;
          gap: var(--s-xs);
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--c-text-muted);
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-family: var(--f-body);
          padding: 0;
          transition: color var(--t-fast);
        }
        .conditions-toggle:hover { color: var(--c-text); }
        .conditions-badge {
          margin-left: var(--s-xs);
          padding: 2px 8px;
          border-radius: var(--r-full);
          font-size: 0.68rem;
          font-weight: 700;
        }
        .conditions-badge--alert {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #ef4444;
        }
        .conditions-clear-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: 1px solid var(--c-border);
          border-radius: var(--r-sm);
          padding: 2px var(--s-sm);
          color: var(--c-text-muted);
          font-family: var(--f-body);
          font-size: 0.72rem;
          cursor: pointer;
          transition: all var(--t-fast);
        }
        .conditions-clear-btn:hover {
          color: var(--c-error);
          border-color: var(--c-error);
        }

        .conditions-body {
          padding: var(--s-md);
          display: flex;
          flex-direction: column;
          gap: var(--s-sm);
        }
        .conditions-section-label {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--c-text-muted);
          margin-bottom: 2px;
        }
        .conditions-grid {
          display: flex;
          flex-wrap: wrap;
          gap: var(--s-xs);
          margin-bottom: var(--s-sm);
        }
        .condition-badge {
          padding: 4px 10px;
          border-radius: var(--r-full);
          border: 1px solid var(--c-border);
          background: var(--c-bg);
          color: var(--c-text-secondary);
          font-family: var(--f-body);
          font-size: 0.78rem;
          cursor: pointer;
          transition: all var(--t-fast);
          user-select: none;
        }
        .condition-badge:hover {
          border-color: var(--c-primary);
          color: var(--c-text);
          background: var(--c-primary-muted);
        }
        .condition-badge--combined {
          border-style: dashed;
          opacity: 0.85;
        }
        .condition-badge--active {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.5);
          color: #ef4444;
          font-weight: 600;
          border-style: solid;
          opacity: 1;
          box-shadow: 0 0 6px rgba(239, 68, 68, 0.15);
        }
        .condition-badge--active:hover {
          background: rgba(239, 68, 68, 0.2);
        }
        .conditions-normal-hint {
          font-size: 0.78rem;
          color: var(--c-text-muted);
          font-style: italic;
          text-align: center;
          padding: var(--s-xs);
        }
      `}</style>
    </section>
  );
}
