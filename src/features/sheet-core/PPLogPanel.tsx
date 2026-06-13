import { useState } from 'react';
import { useActiveCharacter } from '../../shared/hooks/useActiveCharacter';
import { useCharacterActions } from '../../shared/hooks/useCharacterActions';
import { useCalculatedPP } from '../../shared/hooks/useCalculatedPP';
import { useTranslation } from 'react-i18next';
import { BookOpen, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

/**
 * F-17: PP Advancement Log Panel
 * Displayed only when character.campaignMode = true.
 * Shows a PP breakdown (base + earned + total) and a log of PP awards.
 */
export function PPLogPanel() {
  const { t } = useTranslation();
  const { character } = useActiveCharacter();
  const { addPPLogEntry, removePPLogEntry } = useCharacterActions();
  const { totalAvailable, remaining, isBudgetEnforced } = useCalculatedPP();

  const [open, setOpen] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formDate, setFormDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [formAmount, setFormAmount] = useState<number | ''>(5);
  const [formNote, setFormNote] = useState('');

  if (!character.campaignMode) return null;

  const ppLog = character.ppLog ?? [];
  const ppEarned = ppLog.reduce((s, e) => s + e.amount, 0);
  const baseAvailable = character.header.powerLevel * 15;

  function handleAdd() {
    if (!formAmount || formAmount === 0) return;
    addPPLogEntry({
      date: formDate,
      amount: Number(formAmount),
      note: formNote,
    });
    setFormAmount(5);
    setFormNote('');
    setFormOpen(false);
  }

  function handleRemove(entryId: string) {
    const confirmed = window.confirm(t('ppLog.confirmRemove'));
    if (confirmed) {
      removePPLogEntry(entryId);
    }
  }

  return (
    <section className="pplog-panel">
      {/* Header */}
      <div className="pplog-header">
        <button className="pplog-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <BookOpen size={14} />
          {t('ppLog.title')}
          <span className="pplog-badge">{ppEarned > 0 ? `+${ppEarned} PP` : '0 PP'}</span>
        </button>
      </div>

      {open && (
        <div className="pplog-body">
          {/* PP Breakdown summary */}
          <div className="pplog-summary">
            <div className="pplog-summary-row">
              <span className="pplog-summary-label">{t('ppLog.base')}</span>
              <span className="pplog-summary-value">{baseAvailable}</span>
            </div>
            {ppEarned !== 0 && (
              <div className="pplog-summary-row pplog-summary-row--earned">
                <span className="pplog-summary-label">{t('ppLog.earned', { amount: ppEarned >= 0 ? `+${ppEarned}` : ppEarned })}</span>
                <span className="pplog-summary-value pplog-summary-value--earned">{ppEarned >= 0 ? `+${ppEarned}` : ppEarned}</span>
              </div>
            )}
            <div className="pplog-summary-divider" />
            <div className="pplog-summary-row pplog-summary-row--total">
              <span className="pplog-summary-label">{t('ppLog.total')}</span>
              <span className="pplog-summary-value pplog-summary-value--total">{isBudgetEnforced ? totalAvailable : <span className="infinity-symbol">∞</span>}</span>
            </div>
            <div className="pplog-summary-row">
              <span className="pplog-summary-label">{t('summary.remaining')}</span>
              <span className={`pplog-summary-value ${remaining < 0 ? 'pplog-summary-value--over' : 'pplog-summary-value--ok'}`}>
                {isBudgetEnforced ? remaining : <span className="infinity-symbol">∞</span>}
              </span>
            </div>
          </div>

          {/* Log entries */}
          <div className="pplog-entries">
            {ppLog.length === 0 && (
              <div className="pplog-empty">{t('ppLog.empty')}</div>
            )}
            {[...ppLog].reverse().map((entry) => (
              <div key={entry.id} className="pplog-entry">
                <span className="pplog-entry-date">{entry.date}</span>
                <span className={`pplog-entry-amount ${entry.amount >= 0 ? 'pplog-entry-amount--pos' : 'pplog-entry-amount--neg'}`}>
                  {entry.amount >= 0 ? '+' : ''}{entry.amount} PP
                </span>
                <span className="pplog-entry-note">{entry.note}</span>
                <button
                  className="pplog-entry-remove"
                  onClick={() => handleRemove(entry.id)}
                  title={t('ppLog.remove')}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Award PP form */}
          {formOpen ? (
            <div className="pplog-form">
              <div className="pplog-form-row">
                <div className="pplog-form-field">
                  <label>{t('ppLog.date')}</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                  />
                </div>
                <div className="pplog-form-field pplog-form-field--amount">
                  <label>{t('ppLog.amount')}</label>
                  <input
                    type="number"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="+5"
                  />
                </div>
              </div>
              <div className="pplog-form-field">
                <label>{t('ppLog.note')}</label>
                <input
                  type="text"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="Session 12: defeated the Collective"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
              </div>
              <div className="pplog-form-actions">
                <button className="pplog-btn pplog-btn--add" onClick={handleAdd}>
                  <Plus size={13} /> {t('ppLog.add')}
                </button>
                <button className="pplog-btn pplog-btn--cancel" onClick={() => setFormOpen(false)}>
                  {t('menu.cancel') || 'Cancel'}
                </button>
              </div>
            </div>
          ) : (
            <button className="pplog-award-btn" onClick={() => setFormOpen(true)}>
              <Plus size={13} /> {t('ppLog.awardPP')}
            </button>
          )}
        </div>
      )}

      <style>{`
        .pplog-panel {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-left: 3px solid var(--c-accent);
          border-radius: var(--r-lg);
          overflow: hidden;
          animation: fadeIn 0.2s ease;
        }
        .pplog-header {
          padding: var(--s-sm) var(--s-md);
          background: var(--c-surface-elevated);
          border-bottom: 1px solid var(--c-border);
        }
        .pplog-toggle {
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
          width: 100%;
          text-align: left;
          padding: 0;
          transition: color var(--t-fast);
        }
        .pplog-toggle:hover { color: var(--c-accent); }
        .pplog-badge {
          margin-left: auto;
          padding: 2px 8px;
          background: var(--c-accent-muted, rgba(139, 92, 246, 0.15));
          border: 1px solid var(--c-accent);
          border-radius: var(--r-full);
          color: var(--c-accent);
          font-size: 0.7rem;
          font-weight: 700;
        }
        .pplog-body {
          padding: var(--s-md);
          display: flex;
          flex-direction: column;
          gap: var(--s-md);
        }
        .pplog-summary {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: var(--c-bg);
          border-radius: var(--r-md);
          padding: var(--s-sm) var(--s-md);
        }
        .pplog-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
        }
        .pplog-summary-label { color: var(--c-text-muted); }
        .pplog-summary-value { font-weight: 600; font-variant-numeric: tabular-nums; }
        .pplog-summary-value--earned { color: var(--c-accent); }
        .pplog-summary-value--total { color: var(--c-primary); font-size: 1rem; font-family: var(--f-heading); }
        .pplog-summary-value--ok { color: var(--c-success, #22c55e); }
        .pplog-summary-value--over { color: var(--c-error); }
        .pplog-summary-row--total { font-weight: 700; }
        .pplog-summary-divider { height: 1px; background: var(--c-border); margin: 2px 0; }

        .pplog-entries {
          display: flex;
          flex-direction: column;
          gap: 2px;
          max-height: 240px;
          overflow-y: auto;
        }
        .pplog-empty {
          font-size: 0.8rem;
          color: var(--c-text-muted);
          font-style: italic;
          text-align: center;
          padding: var(--s-sm);
        }
        .pplog-entry {
          display: grid;
          grid-template-columns: 90px 65px 1fr auto;
          align-items: center;
          gap: var(--s-sm);
          padding: var(--s-xs) var(--s-sm);
          border-radius: var(--r-sm);
          font-size: 0.8rem;
          transition: background var(--t-fast);
        }
        .pplog-entry:hover { background: var(--c-surface-elevated); }
        .pplog-entry-date { color: var(--c-text-muted); font-variant-numeric: tabular-nums; }
        .pplog-entry-amount { font-weight: 700; font-variant-numeric: tabular-nums; }
        .pplog-entry-amount--pos { color: var(--c-accent); }
        .pplog-entry-amount--neg { color: var(--c-error); }
        .pplog-entry-note { color: var(--c-text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pplog-entry-remove {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--c-text-muted);
          opacity: 0;
          transition: opacity var(--t-fast), color var(--t-fast);
          padding: 2px;
          display: flex;
          align-items: center;
        }
        .pplog-entry:hover .pplog-entry-remove { opacity: 1; }
        .pplog-entry-remove:hover { color: var(--c-error); }

        .pplog-award-btn {
          display: flex;
          align-items: center;
          gap: var(--s-xs);
          background: transparent;
          border: 1px dashed var(--c-border);
          border-radius: var(--r-md);
          padding: var(--s-sm) var(--s-md);
          color: var(--c-text-muted);
          font-family: var(--f-body);
          font-size: 0.8rem;
          cursor: pointer;
          width: 100%;
          justify-content: center;
          transition: all var(--t-fast);
        }
        .pplog-award-btn:hover {
          border-color: var(--c-accent);
          color: var(--c-accent);
          background: var(--c-accent-muted, rgba(139, 92, 246, 0.08));
        }

        .pplog-form {
          display: flex;
          flex-direction: column;
          gap: var(--s-sm);
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          border-radius: var(--r-md);
          padding: var(--s-md);
        }
        .pplog-form-row {
          display: grid;
          grid-template-columns: 1fr 80px;
          gap: var(--s-sm);
        }
        .pplog-form-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pplog-form-field label {
          font-size: 0.68rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--c-text-muted);
        }
        .pplog-form-field input {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--r-sm);
          padding: var(--s-xs) var(--s-sm);
          color: var(--c-text);
          font-family: var(--f-body);
          font-size: 0.82rem;
          transition: border-color var(--t-fast);
        }
        .pplog-form-field input:focus {
          outline: none;
          border-color: var(--c-accent);
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.15);
        }
        .pplog-form-actions {
          display: flex;
          gap: var(--s-sm);
        }
        .pplog-btn {
          display: flex;
          align-items: center;
          gap: var(--s-xs);
          padding: var(--s-xs) var(--s-md);
          border-radius: var(--r-sm);
          border: none;
          cursor: pointer;
          font-family: var(--f-body);
          font-size: 0.8rem;
          font-weight: 600;
          transition: all var(--t-fast);
        }
        .pplog-btn--add {
          background: var(--c-accent);
          color: white;
        }
        .pplog-btn--add:hover { filter: brightness(1.1); }
        .pplog-btn--cancel {
          background: transparent;
          border: 1px solid var(--c-border);
          color: var(--c-text-muted);
        }
        .pplog-btn--cancel:hover {
          background: var(--c-surface-elevated);
          color: var(--c-text);
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.8; text-shadow: 0 0 8px rgba(var(--c-primary-rgb), 0.4); }
          50% { opacity: 1; text-shadow: 0 0 16px rgba(var(--c-primary-rgb), 0.8); }
        }
        .infinity-symbol {
          display: inline-block;
          animation: pulse-glow 2s ease-in-out infinite;
          color: var(--c-primary);
          font-weight: bold;
        }
      `}</style>
    </section>
  );
}
