import { useMemo, useState } from 'react';
import { Crosshair, Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { useOffenseSummary, type IOffenseEntry } from '../../shared/hooks/useOffenseSummary';
import { useActiveCharacter } from '../../shared/hooks/useActiveCharacter';
import { useCharacterActions } from '../../shared/hooks/useCharacterActions';
import { useTranslation } from 'react-i18next';
import type { IManualOffenseRow } from '../../entities/types';
import { NumberInput } from '../../shared/ui/NumberInput';

type EffectFilter = 'all' | 'attack' | 'resistance' | 'area' | 'affects-others';

interface EffectGroup {
  id: string;
  label: string;
  sourceType: IOffenseEntry['sourceType'];
  profiles: IOffenseEntry[];
}

function matchesFilter(profile: IOffenseEntry, filter: EffectFilter): boolean {
  return filter === 'all' || profile.tags.includes(filter);
}

function buildGroups(profiles: IOffenseEntry[]): EffectGroup[] {
  const groups = new Map<string, EffectGroup>();
  for (const profile of profiles) {
    const id = profile.sourceType === 'unarmed'
      ? 'unarmed'
      : profile.sourceType === 'manual'
      ? 'manual'
      : `${profile.sourceType}:${profile.sourceName ?? profile.id}`;
    const existing = groups.get(id);
    if (existing) {
      existing.profiles.push(profile);
      continue;
    }
    groups.set(id, {
      id,
      label: profile.sourceType === 'manual' ? '' : profile.sourceName ?? profile.name,
      sourceType: profile.sourceType,
      profiles: [profile],
    });
  }
  return [...groups.values()];
}

export function OffensePanel() {
  const { t } = useTranslation();
  const entries = useOffenseSummary();
  const { character } = useActiveCharacter();
  const { setManualOffenseRows } = useCharacterActions();
  const manualRows = character.manualOffenseRows ?? [];

  const [activeFilter, setActiveFilter] = useState<EffectFilter>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [draft, setDraft] = useState<Omit<IManualOffenseRow, 'id'>>({
    name: '', bonus: 0, range: 'close', effect: '', notes: '',
  });

  const visibleEntries = useMemo(
    () => entries.filter((entry) => matchesFilter(entry, activeFilter)),
    [activeFilter, entries]
  );
  const groups = useMemo(() => buildGroups(visibleEntries), [visibleEntries]);

  function startAdd() {
    setDraft({ name: '', bonus: 0, range: 'close', effect: '', notes: '' });
    setAddingNew(true);
    setEditingId(null);
  }

  function saveNew() {
    if (!draft.name.trim() || !draft.effect.trim()) return;
    setManualOffenseRows([...manualRows, { ...draft, id: crypto.randomUUID() }]);
    setAddingNew(false);
  }

  function startEdit(row: IManualOffenseRow) {
    setEditingId(row.id);
    setDraft({ name: row.name, bonus: row.bonus, range: row.range, effect: row.effect, notes: row.notes });
    setAddingNew(false);
  }

  function saveEdit() {
    if (!editingId || !draft.name.trim() || !draft.effect.trim()) return;
    setManualOffenseRows(manualRows.map((row) => row.id === editingId ? { ...draft, id: editingId } : row));
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setAddingNew(false);
  }

  const filters: EffectFilter[] = ['all', 'attack', 'resistance', 'area', 'affects-others'];

  return (
    <section className="panel targeted-effects-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <Crosshair size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          {t('targeted.title')}
        </h2>
      </div>

      <p className="targeted-effects-description">{t('targeted.description')}</p>

      <div className="targeted-filter-bar" aria-label={t('targeted.filter.label')}>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`targeted-filter ${activeFilter === filter ? 'targeted-filter--active' : ''}`}
            onClick={() => setActiveFilter(filter)}
            aria-pressed={activeFilter === filter}
          >
            {t(`targeted.filter.${filter}`)}
          </button>
        ))}
      </div>

      <div className="targeted-effects-list">
        {groups.map((group) => (
          <section key={group.id} className={`targeted-source targeted-source--${group.sourceType}`}>
            <div className="targeted-source-header">
              <span className="targeted-source-type">{t(`targeted.source.${group.sourceType}`)}</span>
              <h3>{group.sourceType === 'manual' ? t('targeted.manualTitle') : group.label}</h3>
              <span className="targeted-source-count">{group.profiles.length}</span>
            </div>

            <div className="targeted-profile-list">
              {group.profiles.map((profile) => profile.isManual ? (
                <ManualProfile
                  key={profile.id}
                  profile={profile}
                  row={manualRows.find((row) => row.id === profile.id)!}
                  editing={editingId === profile.id}
                  draft={draft}
                  onDraftChange={setDraft}
                  onEdit={() => startEdit(manualRows.find((row) => row.id === profile.id)!)}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                  onRemove={() => setManualOffenseRows(manualRows.filter((row) => row.id !== profile.id))}
                  t={t}
                />
              ) : (
                <EffectProfile key={profile.id} profile={profile} t={t} />
              ))}
            </div>
          </section>
        ))}

        {groups.length === 0 && (
          <p className="targeted-effects-empty">{t('targeted.noMatches')}</p>
        )}

        {(activeFilter === 'all' || 'attack' === activeFilter || 'resistance' === activeFilter) && (
          <section className="targeted-source targeted-source--manual">
            <div className="targeted-source-header">
              <span className="targeted-source-type">{t('targeted.source.manual')}</span>
              <h3>{t('targeted.manualTitle')}</h3>
            </div>
            {addingNew ? (
              <ManualEditor
                draft={draft}
                onDraftChange={setDraft}
                onSave={saveNew}
                onCancel={cancelEdit}
                t={t}
              />
            ) : (
              <button className="targeted-add-btn" onClick={startAdd}>
                <Plus size={13} /> {t('offense.custom.add')}
              </button>
            )}
          </section>
        )}
      </div>

      <style>{`
        .targeted-effects-description { margin: 0 0 var(--s-md); color: var(--c-text-secondary); font-size: 0.84rem; line-height: 1.5; }
        .targeted-filter-bar { display: flex; flex-wrap: wrap; gap: var(--s-xs); margin-bottom: var(--s-md); }
        .targeted-filter { background: var(--c-surface-elevated); border: 1px solid var(--c-border); border-radius: var(--r-full); color: var(--c-text-secondary); cursor: pointer; font: inherit; font-size: 0.74rem; padding: 4px 10px; transition: all var(--t-fast); }
        .targeted-filter:hover, .targeted-filter--active { border-color: var(--c-primary); color: var(--c-primary); background: var(--c-primary-muted); }
        .targeted-effects-list { display: flex; flex-direction: column; gap: var(--s-md); }
        .targeted-source { border: 1px solid var(--c-border); border-radius: var(--r-md); overflow: hidden; }
        .targeted-source-header { align-items: center; background: var(--c-surface-elevated); border-bottom: 1px solid var(--c-border); display: flex; gap: var(--s-sm); padding: var(--s-sm) var(--s-md); }
        .targeted-source-header h3 { color: var(--c-text); flex: 1; font-size: 0.88rem; margin: 0; }
        .targeted-source-type { border-radius: var(--r-full); color: var(--c-text-muted); background: var(--c-surface); font-size: 0.64rem; font-weight: 700; letter-spacing: 0.05em; padding: 2px 7px; text-transform: uppercase; }
        .targeted-source-count { color: var(--c-text-muted); font-size: 0.76rem; font-variant-numeric: tabular-nums; }
        .targeted-profile-list { display: flex; flex-direction: column; }
        .targeted-profile { align-items: center; display: grid; gap: var(--s-sm); grid-template-columns: minmax(130px, 1.2fr) minmax(90px, .8fr) minmax(90px, .8fr) minmax(120px, 1fr) minmax(100px, .9fr); padding: var(--s-sm) var(--s-md); border-bottom: 1px solid var(--c-border); }
        .targeted-profile:last-child { border-bottom: none; }
        .targeted-profile--alternate { background: rgba(var(--c-primary-rgb), .025); }
        .targeted-profile-main { min-width: 0; }
        .targeted-profile-name { color: var(--c-text); font-size: .86rem; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .targeted-profile-component { color: var(--c-text-secondary); font-size: .74rem; margin-top: 2px; }
        .targeted-profile--alternate .targeted-profile-name::before { color: var(--c-text-muted); content: '↳ '; }
        .targeted-profile-fact { color: var(--c-text-secondary); font-size: .77rem; min-width: 0; }
        .targeted-profile-fact strong { color: var(--c-primary); font-family: var(--f-heading); font-size: .86rem; }
        .targeted-profile-fact-label { color: var(--c-text-muted); display: block; font-size: .62rem; font-weight: 700; letter-spacing: .05em; margin-bottom: 1px; text-transform: uppercase; }
        .targeted-profile-tags { display: flex; flex-wrap: wrap; gap: 4px; }
        .targeted-tag { border-radius: var(--r-full); color: var(--c-text-secondary); background: var(--c-surface-elevated); border: 1px solid var(--c-border); font-size: .65rem; padding: 1px 6px; white-space: nowrap; }
        .targeted-tag--attack { color: var(--c-primary); border-color: var(--c-primary-muted); }
        .targeted-tag--resistance { color: var(--c-warning); }
        .targeted-tag--dynamic { color: var(--c-accent); }
        .targeted-effects-empty { color: var(--c-text-muted); font-size: .84rem; font-style: italic; margin: 0; padding: var(--s-md); text-align: center; }
        .targeted-add-btn { align-items: center; background: transparent; border: 0; color: var(--c-text-muted); cursor: pointer; display: flex; font: inherit; font-size: .78rem; gap: var(--s-xs); justify-content: center; padding: var(--s-sm); width: 100%; }
        .targeted-add-btn:hover { background: var(--c-primary-muted); color: var(--c-primary); }
        .targeted-manual-editor { align-items: end; display: grid; gap: var(--s-xs); grid-template-columns: minmax(110px, 1fr) 114px 105px minmax(120px, 1fr) minmax(100px, 1fr) auto; padding: var(--s-sm); }
        .targeted-input, .targeted-select, .targeted-bonus-input { background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--r-sm); color: var(--c-text); font: inherit; font-size: .78rem; min-width: 0; padding: 4px 6px; }
        .targeted-input, .targeted-select { width: 100%; }
        .targeted-bonus-input { text-align: center; width: 48px; }
        .targeted-input:focus, .targeted-select:focus, .targeted-bonus-input:focus { border-color: var(--c-primary); outline: none; }
        .targeted-editor-actions { display: flex; gap: 2px; }
        .targeted-icon-btn { align-items: center; background: transparent; border: 0; border-radius: var(--r-sm); color: var(--c-text-muted); cursor: pointer; display: flex; padding: 5px; }
        .targeted-icon-btn:hover { background: var(--c-surface-elevated); color: var(--c-text); }
        .targeted-icon-btn--confirm:hover { color: var(--c-success); }
        .targeted-icon-btn--remove:hover { color: var(--c-error); }
        @media (max-width: 768px) {
          .targeted-profile { align-items: start; grid-template-columns: 1fr 1fr; padding: var(--s-md); }
          .targeted-profile-main { grid-column: 1 / -1; }
          .targeted-profile-tags { grid-column: 1 / -1; }
          .targeted-manual-editor { grid-template-columns: 1fr 1fr; padding: var(--s-md); }
          .targeted-manual-editor > :nth-child(1), .targeted-manual-editor > :nth-child(4), .targeted-manual-editor > :nth-child(5), .targeted-editor-actions { grid-column: 1 / -1; }
          .targeted-input, .targeted-select, .targeted-bonus-input { min-height: var(--touch-target-min); }
          .targeted-icon-btn { min-height: var(--touch-target-min); min-width: var(--touch-target-min); justify-content: center; }
        }
      `}</style>
    </section>
  );
}

function EffectProfile({ profile, t }: { profile: IOffenseEntry; t: (key: string) => string }) {
  return (
    <article className={`targeted-profile ${profile.relationship !== 'base' && profile.relationship !== 'unarmed' ? 'targeted-profile--alternate' : ''}`}>
      <div className="targeted-profile-main">
        <div className="targeted-profile-name" title={profile.bonusBreakdown}>{profile.name}</div>
        {profile.componentName && <div className="targeted-profile-component">{profile.componentName}</div>}
      </div>
      <div className="targeted-profile-fact">
        <span className="targeted-profile-fact-label">{t('targeted.fact.roll')}</span>
        <strong>{profile.requiresAttackCheck ? profile.bonus : t('targeted.noAttackRoll')}</strong>
      </div>
      <div className="targeted-profile-fact">
        <span className="targeted-profile-fact-label">{t('offense.range')}</span>
        {t(`offense.range_${profile.range.toLowerCase()}`)}
      </div>
      <div className="targeted-profile-fact">
        <span className="targeted-profile-fact-label">{t('offense.effect')}</span>
        {profile.effect}
      </div>
      <div className="targeted-profile-fact">
        <span className="targeted-profile-fact-label">{t('targeted.fact.resistance')}</span>
        {profile.resistance ?? '—'}
      </div>
      <div className="targeted-profile-tags">
        {profile.tags.map((tag) => <span key={tag} className={`targeted-tag targeted-tag--${tag}`}>{t(`targeted.tag.${tag}`)}</span>)}
        {profile.notes && <span className="targeted-tag">{profile.notes}</span>}
      </div>
    </article>
  );
}

function ManualProfile({ profile, row, editing, draft, onDraftChange, onEdit, onSave, onCancel, onRemove, t }: {
  profile: IOffenseEntry;
  row: IManualOffenseRow;
  editing: boolean;
  draft: Omit<IManualOffenseRow, 'id'>;
  onDraftChange: (draft: Omit<IManualOffenseRow, 'id'>) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onRemove: () => void;
  t: (key: string) => string;
}) {
  if (editing) return <ManualEditor draft={draft} onDraftChange={onDraftChange} onSave={onSave} onCancel={onCancel} t={t} />;
  return (
    <article className="targeted-profile">
      <div className="targeted-profile-main"><div className="targeted-profile-name">{profile.name}</div><div className="targeted-profile-component">{t('targeted.source.manual')}</div></div>
      <div className="targeted-profile-fact"><span className="targeted-profile-fact-label">{t('targeted.fact.roll')}</span><strong>{profile.bonus}</strong></div>
      <div className="targeted-profile-fact"><span className="targeted-profile-fact-label">{t('offense.range')}</span>{t(`offense.range_${profile.range}`)}</div>
      <div className="targeted-profile-fact"><span className="targeted-profile-fact-label">{t('offense.effect')}</span>{profile.effect}</div>
      <div className="targeted-profile-fact"><span className="targeted-profile-fact-label">{t('offense.notes')}</span>{row.notes || '—'}</div>
      <div className="targeted-editor-actions">
        <button className="targeted-icon-btn" onClick={onEdit} title={t('offense.custom.edit')}><Pencil size={13} /></button>
        <button className="targeted-icon-btn targeted-icon-btn--remove" onClick={onRemove} title={t('offense.custom.remove')}><Trash2 size={13} /></button>
      </div>
    </article>
  );
}

function ManualEditor({ draft, onDraftChange, onSave, onCancel, t }: {
  draft: Omit<IManualOffenseRow, 'id'>;
  onDraftChange: (draft: Omit<IManualOffenseRow, 'id'>) => void;
  onSave: () => void;
  onCancel: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="targeted-manual-editor">
      <input className="targeted-input" value={draft.name} onChange={(event) => onDraftChange({ ...draft, name: event.target.value })} placeholder={t('offense.custom.name')} aria-label={t('offense.custom.name')} autoFocus />
      <NumberInput variant="medium" className="targeted-bonus-input" value={draft.bonus} onChange={(bonus) => onDraftChange({ ...draft, bonus })} aria-label={t('offense.bonus')} />
      <select className="targeted-select" value={draft.range} onChange={(event) => onDraftChange({ ...draft, range: event.target.value as IManualOffenseRow['range'] })} aria-label={t('offense.range')}>
        <option value="close">{t('offense.range_close')}</option><option value="ranged">{t('offense.range_ranged')}</option><option value="perception">{t('offense.range_perception')}</option>
      </select>
      <input className="targeted-input" value={draft.effect} onChange={(event) => onDraftChange({ ...draft, effect: event.target.value })} placeholder="Damage 6" aria-label={t('offense.effect')} />
      <input className="targeted-input" value={draft.notes} onChange={(event) => onDraftChange({ ...draft, notes: event.target.value })} placeholder={t('offense.custom.notes')} aria-label={t('offense.custom.notes')} onKeyDown={(event) => { if (event.key === 'Enter') onSave(); }} />
      <span className="targeted-editor-actions"><button className="targeted-icon-btn targeted-icon-btn--confirm" onClick={onSave} title={t('offense.custom.save')}><Check size={14} /></button><button className="targeted-icon-btn targeted-icon-btn--remove" onClick={onCancel} title={t('offense.custom.cancel')}><X size={14} /></button></span>
    </div>
  );
}
