import { memo, useId, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { BookOpen, ChevronDown, ChevronRight, Plus, Pencil, Undo2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCharactersStore } from '../../store/charactersStore';
import { useCharacterSelector } from '../../shared/hooks/useActiveCharacter';
import { useCharacterActions } from '../../shared/hooks/useCharacterActions';
import { useCalculatedPP } from '../../shared/hooks/useCalculatedPP';
import { useAppDialog } from '../../shared/ui/appDialogContext';
import { campaignInitialPP, localCampaignDate, isCampaignAmount, isCampaignDate, CAMPAIGN_AMOUNT_LIMIT } from '../../shared/lib/campaign';
import { Tooltip } from '../../shared/ui/Tooltip';
import type { IPPLogEntry } from '../../entities/types';
import './campaign.css';

interface EntryDraft { date: string; amount: string; note: string; session: string; kind: 'award' | 'adjustment' }
const freshDraft = (): EntryDraft => ({ date: localCampaignDate(), amount: '1', note: '', session: '', kind: 'award' });
const signed = (value: number) => `${value > 0 ? '+' : ''}${value}`;

function CampaignPanel({ characterId }: { characterId: string }) {
  const { t } = useTranslation();
  const id = useId();
  const character = useCharacterSelector(useShallow(value => ({ header: value.header, campaignMode: value.campaignMode, campaign: value.campaign, ppLog: value.ppLog })));
  const actions = useCharacterActions();
  const { totalAvailable, totalSpent, remaining, ppEarned, isBudgetEnforced } = useCalculatedPP();
  const dialog = useAppDialog();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<EntryDraft | null>(null);
  const [editing, setEditing] = useState<{ index: number; original: IPPLogEntry } | null>(null);
  const [base, setBase] = useState(String(campaignInitialPP(character)));
  const [baseEditing, setBaseEditing] = useState(false);
  const [error, setError] = useState('');
  const log = character.ppLog ?? [];
  const net = log.reduce((sum, entry) => sum + entry.amount, 0);
  const amount = Number(draft?.amount);
  const validAmount = !!draft?.amount.trim() && (isCampaignAmount(amount) || (editing !== null && amount === editing.original.amount));
  const validDate = !!draft && (isCampaignDate(draft.date) || (editing !== null && draft.date === editing.original.date));
  const valid = validAmount && validDate && (draft?.kind !== 'award' || amount > 0);
  const preview = character.campaignMode ? totalAvailable + amount - (editing?.original.amount ?? 0) : totalAvailable;
  const historyId = `${id}-history`;

  function start(entry?: IPPLogEntry, index?: number) {
    setEditing(entry && index !== undefined ? { index, original: entry } : null);
    setDraft(entry ? { date: entry.date, amount: String(entry.amount), note: entry.note, session: entry.session ?? '', kind: entry.kind ?? 'adjustment' } : freshDraft());
    setError('');
  }
  function save() {
    if (!draft || !valid) { setError('campaign.invalidEntry'); return; }
    const entry = { ...draft, amount, session: draft.session || undefined };
    const saved = editing ? actions.editPPLogEntry(characterId, editing.index, editing.original, entry) : actions.addPPLogEntry(entry, characterId);
    if (!saved) { setError('campaign.conflict'); return; }
    setDraft(null); setEditing(null); setError('');
  }
  async function remove(entry: IPPLogEntry, index: number) {
    if (!await dialog.confirm({ title: t('ppLog.removeTitle'), message: t('ppLog.confirmRemove'), confirmLabel: t('common.remove'), danger: true })) return;
    if (!actions.removePPLogEntry(entry.id, characterId, index, entry)) setError('campaign.conflict');
  }
  async function reverse(entry: IPPLogEntry, index: number) {
    if (!await dialog.confirm({ title: t('campaign.reverse'), message: t('campaign.confirmReverse', { amount: signed(-entry.amount) }) })) return;
    if (!actions.reversePPLogEntry(characterId, index, entry, t('campaign.reverseNote', { note: entry.note || entry.session || entry.date }))) setError('campaign.conflict');
  }
  async function toggleMode() {
    if (character.campaignMode && !await dialog.confirm({ message: t('menu.campaignMode.confirmDisable', { before: totalAvailable, after: character.header.powerLevel * 15 }) })) return;
    actions.setCampaignMode(!character.campaignMode, characterId);
    setDraft(null); setEditing(null);
  }

  return <section className="campaign-panel" aria-label={t('campaign.title')}>
    <div className="campaign-header">
      <button className="campaign-toggle" aria-expanded={open} aria-controls={historyId} onClick={() => setOpen(value => !value)}>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}<BookOpen size={16} />
        <span>{character.header.series || t('campaign.title')}</span>
        <span className={net < 0 ? 'campaign-badge campaign-negative' : 'campaign-badge'}>{signed(net)} PP</span>
      </button>
      {!character.campaignMode && <span className="campaign-state">{t('campaign.paused')}</span>}
    </div>
    <div className="campaign-summary">
      {[
        [t(character.campaignMode ? 'campaign.initialPP' : 'campaign.standardPP'), character.campaignMode ? campaignInitialPP(character) : character.header.powerLevel * 15],
        [t('campaign.adjustments'), ppEarned], [t('campaign.spent'), totalSpent], [t('campaign.balance'), remaining],
      ].map(([label, value], index) => <div key={label} className={index === 3 && remaining < 0 ? 'campaign-stat campaign-negative' : 'campaign-stat'}><span>{label}</span><strong>{value}</strong></div>)}
    </div>
    {!isBudgetEnforced && <p className="campaign-hint">{t('campaign.validationOff')}</p>}
    {open && <div id={historyId} className="campaign-body">
      {!character.campaignMode && <p className="campaign-hint">{t('campaign.pausedHint')}</p>}
      <p className="campaign-hint">{t('campaign.spendHint')}</p>
      <div className="campaign-toolbar">
        <button className="btn btn-primary" onClick={() => start()}><Plus size={14} />{t('campaign.register')}</button>
        <button className="btn btn-secondary" onClick={() => void toggleMode()}>{t(character.campaignMode ? 'campaign.disable' : 'campaign.enable')}</button>
      </div>
      {error && <p role="alert" className="campaign-error">{t(error)}</p>}
      {draft && <form className="campaign-form" onSubmit={event => { event.preventDefault(); save(); }} noValidate>
        <div className="campaign-form-grid">
          <label htmlFor={`${id}-kind`}>{t('campaign.type')}<select id={`${id}-kind`} value={draft.kind} onChange={event => setDraft({ ...draft, kind: event.target.value as EntryDraft['kind'] })}><option value="award">{t('campaign.award')}</option><option value="adjustment">{t('campaign.adjustment')}</option></select></label>
          <label htmlFor={`${id}-date`}>{t('ppLog.date')}<input id={`${id}-date`} type={isCampaignDate(draft.date) || !editing ? 'date' : 'text'} value={draft.date} onChange={event => setDraft({ ...draft, date: event.target.value })} /></label>
          <label htmlFor={`${id}-amount`}>{t('ppLog.amount')}<input id={`${id}-amount`} type="number" step={1} min={draft.kind === 'award' ? 1 : -CAMPAIGN_AMOUNT_LIMIT} max={CAMPAIGN_AMOUNT_LIMIT} value={draft.amount} onChange={event => setDraft({ ...draft, amount: event.target.value })} /></label>
          <label htmlFor={`${id}-session`}>{t('campaign.session')}<input id={`${id}-session`} value={draft.session} onChange={event => setDraft({ ...draft, session: event.target.value })} /></label>
        </div>
        <label htmlFor={`${id}-note`}>{t('ppLog.note')}<textarea id={`${id}-note`} rows={2} value={draft.note} placeholder={t('campaign.notePlaceholder')} onChange={event => setDraft({ ...draft, note: event.target.value })} /></label>
        {editing && (!isCampaignAmount(editing.original.amount) || !isCampaignDate(editing.original.date)) && <p className="campaign-hint">{t('campaign.legacyEntry')}</p>}
        <p className="campaign-preview" aria-live="polite">{valid ? t('campaign.preview', { total: preview }) : t('campaign.invalidEntry')}</p>
        <div className="campaign-toolbar"><button className="btn btn-primary" type="submit" disabled={!valid}>{t('campaign.save')}</button><button className="btn btn-secondary" type="button" onClick={() => { setDraft(null); setEditing(null); setError(''); }}>{t('menu.cancel')}</button></div>
      </form>}
      <div className="campaign-log">
        {log.length === 0 && <p className="campaign-hint">{t('ppLog.empty')}</p>}
        {log.map((entry, index) => ({ entry, index })).reverse().map(({ entry, index }) => {
          const reversed = log.some(item => item.reversesEntryId === entry.id);
          return <article key={`${entry.id}:${index}`} className="campaign-entry">
            <div className="campaign-entry-heading"><span>{entry.date || '—'}{entry.session ? ` · ${entry.session}` : ''}</span><strong className={entry.amount < 0 ? 'campaign-negative' : ''}>{signed(entry.amount)} PP</strong></div>
            {entry.note && <details className="campaign-entry-note"><summary>{entry.note.split('\n')[0]}</summary><p>{entry.note}</p></details>}
            <div className="campaign-entry-footer">
              <span>{reversed ? t('campaign.reversed') : entry.kind ? t(`campaign.${entry.kind}`) : ''}</span>
              <div className="campaign-entry-actions">
                <Tooltip content={t('campaign.edit')}><button aria-label={t('campaign.edit')} onClick={() => start(entry, index)}><Pencil size={15} /></button></Tooltip>
                {!reversed && !entry.reversesEntryId && entry.amount !== 0 && <Tooltip content={t('campaign.reverse')}><button aria-label={t('campaign.reverse')} onClick={() => void reverse(entry, index)}><Undo2 size={15} /></button></Tooltip>}
                <Tooltip content={t('ppLog.remove')}><button aria-label={t('ppLog.remove')} onClick={() => void remove(entry, index)}><Trash2 size={15} /></button></Tooltip>
              </div>
            </div>
          </article>;
        })}
      </div>
      <details className="campaign-options"><summary>{t('campaign.options')}</summary>
        <p className="campaign-hint">{t('campaign.budgetHint')}</p>
        {!baseEditing ? <button className="btn btn-secondary" onClick={() => { setBase(String(campaignInitialPP(character))); setBaseEditing(true); }}>{t('campaign.initialPP')}: {campaignInitialPP(character)} <Pencil size={13} /></button> : <form onSubmit={event => { event.preventDefault(); if (!base.trim() || !actions.setCampaignBudget(characterId, Number(base))) { setError('campaign.invalidBase'); return; } setBaseEditing(false); setError(''); }}>
          <label htmlFor={`${id}-base`}>{t('campaign.initialPP')}<input id={`${id}-base`} type="number" step={1} min={0} max={CAMPAIGN_AMOUNT_LIMIT} value={base} onChange={event => setBase(event.target.value)} /></label>
          <p className="campaign-preview" aria-live="polite">{base.trim() && Number.isSafeInteger(Number(base)) && Number(base) >= 0 && Number(base) <= CAMPAIGN_AMOUNT_LIMIT ? t('campaign.preview', { total: character.campaignMode ? Number(base) + net : totalAvailable }) : t('campaign.invalidBase')}</p>
          <div className="campaign-toolbar"><button className="btn btn-primary" type="submit">{t('campaign.save')}</button><button className="btn btn-secondary" type="button" onClick={() => setBaseEditing(false)}>{t('menu.cancel')}</button></div>
        </form>}
      </details>
    </div>}
  </section>;
}

export const PPLogPanel = memo(function PPLogPanel() {
  const characterId = useCharactersStore(state => state.activeCharacterId);
  const visible = useCharacterSelector(value => !!(value.campaignMode || value.campaign || value.ppLog?.length));
  return characterId && visible ? <CampaignPanel key={characterId} characterId={characterId} /> : null;
});
