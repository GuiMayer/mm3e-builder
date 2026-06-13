import { useState } from 'react';
import { useOffenseSummary } from '../../shared/hooks/useOffenseSummary';
import { useActiveCharacter } from '../../shared/hooks/useActiveCharacter';
import { useCharacterActions } from '../../shared/hooks/useCharacterActions';
import { useTranslation } from 'react-i18next';
import { Zap, Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import type { IManualOffenseRow } from '../../entities/types';
import { NumberInput } from '../../shared/ui/NumberInput';

export function OffensePanel() {
  const { t } = useTranslation();
  const entries = useOffenseSummary();
  const { character } = useActiveCharacter();
  const { setManualOffenseRows } = useCharacterActions();
  const manualRows = character.manualOffenseRows ?? [];

  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [draft, setDraft] = useState<Omit<IManualOffenseRow, 'id'>>({
    name: '', bonus: 0, range: 'close', effect: '', notes: '',
  });

  function startAdd() {
    setDraft({ name: '', bonus: 0, range: 'close', effect: '', notes: '' });
    setAddingNew(true);
    setEditingId(null);
  }

  function saveNew() {
    if (!draft.name.trim()) return;
    const newRow: IManualOffenseRow = { ...draft, id: crypto.randomUUID() };
    setManualOffenseRows([...manualRows, newRow]);
    setAddingNew(false);
  }

  function startEdit(row: IManualOffenseRow) {
    setEditingId(row.id);
    setDraft({ name: row.name, bonus: row.bonus, range: row.range, effect: row.effect, notes: row.notes });
    setAddingNew(false);
  }

  function saveEdit() {
    if (!editingId) return;
    setManualOffenseRows(manualRows.map((r) => r.id === editingId ? { ...draft, id: editingId } : r));
    setEditingId(null);
  }

  function removeRow(id: string) {
    setManualOffenseRows(manualRows.filter((r) => r.id !== id));
  }

  function cancelEdit() {
    setEditingId(null);
    setAddingNew(false);
  }

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
          <span className="offense-col offense-col--actions" />
        </div>

        {/* Auto-derived rows */}
        {entries.filter((e) => !e.isManual).map((entry) => (
          <div
            key={entry.id}
            className={`offense-row ${entry.isAE ? 'offense-row--ae' : ''} ${entry.id === '__unarmed__' ? 'offense-row--unarmed' : ''} ${entry.isNoRoll ? 'offense-row--noroll' : ''}`}
          >
            <span className="offense-col offense-col--name">
              {entry.isAE && <span className="offense-ae-indent">↳ </span>}
              {entry.name}
            </span>
            <span className="offense-col offense-col--bonus">
              <span
                className="offense-bonus-value"
                title={entry.bonusBreakdown || undefined}
              >
                {entry.bonus}
              </span>
            </span>
            <span className="offense-col offense-col--range">
              {t(`offense.range_${entry.range.toLowerCase()}`, { defaultValue: entry.range })}
            </span>
            <span className="offense-col offense-col--effect">{entry.effect}</span>
            <span className="offense-col offense-col--notes">{entry.notes}</span>
            <span className="offense-col offense-col--actions" />
          </div>
        ))}

        {/* Manual rows */}
        {manualRows.map((row) =>
          editingId === row.id ? (
            <div key={row.id} className="offense-row offense-row--editing">
              <input
                className="offense-input offense-col--name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder={t('offense.custom.name')}
                autoFocus
              />
              <NumberInput
                variant="medium"
                className="offense-input offense-col--bonus"
                value={draft.bonus}
                onChange={(value) => setDraft({ ...draft, bonus: value })}
              />
              <select
                className="offense-select offense-col--range"
                value={draft.range}
                onChange={(e) => setDraft({ ...draft, range: e.target.value as IManualOffenseRow['range'] })}
              >
                <option value="close">{t('offense.range_close', { defaultValue: 'Close' })}</option>
                <option value="ranged">{t('offense.range_ranged', { defaultValue: 'Ranged' })}</option>
                <option value="perception">{t('offense.range_perception', { defaultValue: 'Perception' })}</option>
              </select>
              <input
                className="offense-input offense-col--effect"
                value={draft.effect}
                onChange={(e) => setDraft({ ...draft, effect: e.target.value })}
                placeholder="Damage 6"
              />
              <input
                className="offense-input offense-col--notes"
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                placeholder={t('offense.custom.notes')}
              />
              <span className="offense-col offense-col--actions offense-edit-actions">
                <button className="offense-icon-btn offense-icon-btn--confirm" onClick={saveEdit} title={t('offense.custom.save')}><Check size={13} /></button>
                <button className="offense-icon-btn offense-icon-btn--cancel" onClick={cancelEdit} title={t('offense.custom.cancel')}><X size={13} /></button>
              </span>
            </div>
          ) : (
            <div key={row.id} className="offense-row offense-row--manual">
              <span className="offense-col offense-col--name">
                <span className="offense-manual-badge" title={t('offense.custom.badge')}>✎</span>
                {row.name}
              </span>
              <span className="offense-col offense-col--bonus">{row.bonus >= 0 ? `+${row.bonus}` : row.bonus}</span>
              <span className="offense-col offense-col--range">
                {t(`offense.range_${row.range}`, { defaultValue: row.range })}
              </span>
              <span className="offense-col offense-col--effect">{row.effect}</span>
              <span className="offense-col offense-col--notes">{row.notes}</span>
              <span className="offense-col offense-col--actions offense-edit-actions">
                <button className="offense-icon-btn" onClick={() => startEdit(row)} title={t('offense.custom.edit')}><Pencil size={12} /></button>
                <button className="offense-icon-btn offense-icon-btn--cancel" onClick={() => removeRow(row.id)} title={t('offense.custom.remove')}><Trash2 size={12} /></button>
              </span>
            </div>
          )
        )}

        {/* Inline "add" row */}
        {addingNew && (
          <div className="offense-row offense-row--editing">
            <input
              className="offense-input offense-col--name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder={t('offense.custom.name')}
              autoFocus
            />
            <NumberInput
              variant="medium"
              className="offense-input offense-col--bonus"
              value={draft.bonus}
              onChange={(value) => setDraft({ ...draft, bonus: value })}
            />
            <select
              className="offense-select offense-col--range"
              value={draft.range}
              onChange={(e) => setDraft({ ...draft, range: e.target.value as IManualOffenseRow['range'] })}
            >
              <option value="close">{t('offense.range_close', { defaultValue: 'Close' })}</option>
              <option value="ranged">{t('offense.range_ranged', { defaultValue: 'Ranged' })}</option>
              <option value="perception">{t('offense.range_perception', { defaultValue: 'Perception' })}</option>
            </select>
            <input
              className="offense-input offense-col--effect"
              value={draft.effect}
              onChange={(e) => setDraft({ ...draft, effect: e.target.value })}
              placeholder="Damage 6"
            />
            <input
              className="offense-input offense-col--notes"
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              placeholder={t('offense.custom.notes')}
              onKeyDown={(e) => { if (e.key === 'Enter') saveNew(); }}
            />
            <span className="offense-col offense-col--actions offense-edit-actions">
              <button className="offense-icon-btn offense-icon-btn--confirm" onClick={saveNew} title={t('offense.custom.save')}><Check size={13} /></button>
              <button className="offense-icon-btn offense-icon-btn--cancel" onClick={cancelEdit} title={t('offense.custom.cancel')}><X size={13} /></button>
            </span>
          </div>
        )}

        {entries.length === 0 && manualRows.length === 0 && (
          <div className="offense-empty">{t('offense.noAttacks')}</div>
        )}

        {/* Add custom attack button */}
        {!addingNew && (
          <button className="offense-add-btn" onClick={startAdd}>
            <Plus size={13} /> {t('offense.custom.add')}
          </button>
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
          grid-template-columns: 1fr 64px 90px 1fr 110px 52px;
          align-items: center;
          gap: var(--s-sm);
          padding: var(--s-sm) var(--s-md);
          border-bottom: 1px solid var(--c-border);
          transition: background var(--t-fast);
        }
        .offense-row:last-child { border-bottom: none; }
        .offense-row:hover:not(.offense-row--header):not(.offense-row--editing) {
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
        .offense-row--noroll .offense-bonus-value {
          color: var(--c-text-muted);
          font-style: italic;
        }
        .offense-row--manual {
          border-left: 2px solid var(--c-accent);
        }
        .offense-row--editing {
          background: var(--c-bg);
          border-left: 2px solid var(--c-primary);
          gap: var(--s-xs);
          padding: var(--s-xs) var(--s-sm);
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
        .offense-col--range { font-size: 0.78rem; color: var(--c-text-secondary); }
        .offense-col--effect { color: var(--c-text-secondary); }
        .offense-col--notes { font-size: 0.75rem; color: var(--c-text-muted); font-style: italic; }
        .offense-col--actions { display: flex; justify-content: flex-end; }

        .offense-bonus-value {
          cursor: help;
          border-bottom: 1px dashed transparent;
          transition: border-color var(--t-fast);
        }
        .offense-bonus-value[title]:hover { border-bottom-color: var(--c-primary); }

        .offense-ae-indent { color: var(--c-text-muted); margin-right: 2px; font-style: normal; }
        .offense-manual-badge {
          font-size: 0.7rem;
          color: var(--c-accent);
          margin-right: 4px;
          opacity: 0.8;
        }

        .offense-input, .offense-select {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--r-sm);
          padding: 2px var(--s-xs);
          color: var(--c-text);
          font-family: var(--f-body);
          font-size: 0.8rem;
          width: 100%;
          transition: border-color var(--t-fast);
        }
        .offense-input:focus, .offense-select:focus {
          outline: none;
          border-color: var(--c-primary);
        }

        .offense-edit-actions {
          display: flex;
          gap: 2px;
          opacity: 0;
          transition: opacity var(--t-fast);
        }
        .offense-row:hover .offense-edit-actions { opacity: 1; }
        .offense-row--editing .offense-edit-actions { opacity: 1; }

        .offense-icon-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--c-text-muted);
          padding: 3px;
          border-radius: var(--r-sm);
          display: flex;
          align-items: center;
          transition: all var(--t-fast);
        }
        .offense-icon-btn:hover { color: var(--c-text); background: var(--c-surface-elevated); }
        .offense-icon-btn--confirm:hover { color: var(--c-success, #22c55e); }
        .offense-icon-btn--cancel:hover { color: var(--c-error); }

        .offense-empty {
          padding: var(--s-md);
          text-align: center;
          color: var(--c-text-muted);
          font-size: 0.85rem;
          font-style: italic;
        }

        .offense-add-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--s-xs);
          width: 100%;
          padding: var(--s-sm);
          background: transparent;
          border: none;
          border-top: 1px dashed var(--c-border);
          color: var(--c-text-muted);
          font-family: var(--f-body);
          font-size: 0.78rem;
          cursor: pointer;
          transition: all var(--t-fast);
        }
        .offense-add-btn:hover {
          color: var(--c-primary);
          background: var(--c-primary-muted);
        }
      `}</style>
    </section>
  );
}
