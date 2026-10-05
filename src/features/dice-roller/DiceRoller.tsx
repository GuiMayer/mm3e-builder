import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { D20Icon } from './D20Icon';
import { DiceWindow } from './DiceWindow';
import { rollFormula, validRollLimit } from './rollModel';
import type { RollResult } from './rollModel';
import { useRollSession } from './rollSessionStore';
import './diceRoller.css';

function RollCard({ result }: { result: RollResult }) {
  return <article className="dice-result">
    {result.source && <div className="dice-result-source">
      <strong>{result.source.label}</strong>
      <span>{result.source.characterName} · {result.source.section}</span>
      {result.source.detail && <span>{result.source.detail}</span>}
    </div>}
    <div className="dice-result-formula">{rollFormula(result)}</div>
    {!!result.source?.breakdown?.length && <details className="dice-result-breakdown"><summary>{result.source.breakdown.join(' + ')}</summary><ul>{result.source.breakdown.map((part, index) => <li key={index}>{part}</li>)}</ul></details>}
  </article>;
}

export function DiceRoller() {
  const { t } = useTranslation();
  const isOpen = useRollSession(state => state.isOpen);
  const history = useRollSession(state => state.history);
  const limit = useRollSession(state => state.limit);
  const keepHistory = useRollSession(state => state.keepHistory);
  const notice = useRollSession(state => state.notice);
  const setOpen = useRollSession(state => state.setOpen);
  const roll = useRollSession(state => state.roll);
  const [bonusText, setBonusText] = useState('0');
  const [limitText, setLimitText] = useState(String(limit));
  const [limitInvalid, setLimitInvalid] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasOpenRef = useRef(false);
  const panelId = useId();
  const titleId = useId();
  const limitHelpId = useId();
  const bonus = Number(bonusText);
  const bonusValid = bonusText.trim() !== '' && Number.isSafeInteger(bonus) && Number.isSafeInteger(bonus + 20);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus({ preventScroll: true });
    else if (wasOpenRef.current) triggerRef.current?.focus({ preventScroll: true });
    wasOpenRef.current = isOpen;
  }, [isOpen]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => useRollSession.getState().dismissNotice(notice.id), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  function close() {
    setOpen(false);
  }

  function applyLimit() {
    const next = Number(limitText);
    if (limitText.trim() === '' || !validRollLimit(next)) { setLimitInvalid(true); return; }
    useRollSession.getState().setLimit(next);
    setLimitText(String(next));
    setLimitInvalid(false);
  }

  const latest = history[0];
  return <>
    <button ref={triggerRef} type="button" className="dice-toggle" hidden={isOpen} aria-label={t('dice.open')} title={t('dice.open')} aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen(true)}><D20Icon size={24} /></button>
    <DiceWindow id={panelId} titleId={titleId} isOpen={isOpen} onClose={close}>
      <form className="dice-manual" onSubmit={event => { event.preventDefault(); if (bonusValid) roll({ bonus, source: null }); }}>
        <label htmlFor={`${panelId}-bonus`}>{t('dice.bonus')}</label>
        <div className="dice-manual-controls"><span>d20 +</span><input ref={inputRef} id={`${panelId}-bonus`} type="number" step="1" value={bonusText} onChange={event => setBonusText(event.target.value)} /><button type="submit" disabled={!bonusValid}><D20Icon size={16} /> {t('dice.roll')}</button></div>
      </form>
      <div className="dice-history-header"><span>{t('dice.history')} <small>{history.length}/{limit}</small></span><button type="button" disabled={!history.length} onClick={() => useRollSession.getState().clearHistory()}>{t('dice.clear')}</button></div>
      <div className="dice-history" role="log" aria-live="off" aria-label={t('dice.history')}>
        {history.length ? history.map(result => <RollCard key={result.id} result={result} />) : <p className="dice-empty">{t('dice.empty')}</p>}
      </div>
      <footer className="dice-panel-footer"><label htmlFor={`${panelId}-limit`}>{t('dice.limit')}<input id={`${panelId}-limit`} type="number" min="1" step="1" value={limitText} aria-invalid={limitInvalid} aria-describedby={limitInvalid ? limitHelpId : undefined} onChange={event => { setLimitText(event.target.value); setLimitInvalid(false); }} onBlur={applyLimit} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); applyLimit(); } }} /></label>
        {limitInvalid && <p id={limitHelpId}>{t('dice.invalidLimit')}</p>}
        <div className="dice-history-preference"><span>{t('dice.keepHistory')}</span><button type="button" className="dice-history-switch" role="switch" aria-label={t('dice.keepHistory')} aria-checked={keepHistory} aria-describedby={`${panelId}-history-help`} onClick={() => useRollSession.getState().setKeepHistory(!keepHistory)}><span /></button></div>
        <p id={`${panelId}-history-help`}>{t(keepHistory ? 'dice.historyLocal' : 'dice.sessionOnly')}</p>
      </footer>
    </DiceWindow>
    {notice && !isOpen && <div className="dice-notice"><div>{notice.source && <strong>{notice.source.label}</strong>}<span>{rollFormula(notice)}</span></div><button type="button" aria-label={t('dice.dismiss')} onClick={() => useRollSession.getState().dismissNotice(notice.id)}><X size={16} /></button></div>}
    <span className="dice-sr-only" role="status" aria-live="polite" aria-atomic="true">{latest && <span key={latest.id}>{`${latest.source ? `${latest.source.characterName}, ${latest.source.label}: ` : ''}${rollFormula(latest)}`}</span>}</span>
  </>;
}
