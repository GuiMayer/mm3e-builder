import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import { Button } from './Button';
import { inspectModifierSources, recoverModifierSources, recoveryCostSummary, recoveryPreviewContext } from '../lib/modifierSourceRecovery';
import { preserveModifierRecoveryBackup } from '../../services/storage/modifierRecoveryBackup';
import { downloadBlob } from '../../services/downloadHelper';
import { useCharactersStore } from '../../store/charactersStore';
import { useResourcesStore } from '../../store/resourcesStore';
import { MODIFIER_DEFS, POWER_DEFS } from '../../entities/gameDataLoaders';

export function ModifierRecoveryDialog({ value, original, onResolve }: { value: unknown; original: string; onResolve: (value: unknown | null) => void }) {
  const { t, i18n } = useTranslation();
  const candidates = useMemo(() => inspectModifierSources(value), [value]);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState('');
  const repaired = useMemo(() => recoverModifierSources(value, selected), [value, selected]);
  const tabs = useCharactersStore(store => store.tabs);
  const resources = useResourcesStore(store => store.resources);
  const before = useMemo(() => recoveryCostSummary(recoveryPreviewContext(value, tabs.map(tab => tab.character), resources)), [value, tabs, resources]);
  const after = useMemo(() => recoveryCostSummary(recoveryPreviewContext(repaired, tabs.map(tab => tab.character), resources)), [repaired, tabs, resources]);
  const affectedKeys = useMemo(() => {
    const context = recoveryPreviewContext(value, tabs.map(tab => tab.character), resources);
    const potential = recoveryCostSummary(recoveryPreviewContext(recoverModifierSources(value, candidates.map(item => item.key)), tabs.map(tab => tab.character), resources));
    const keys = new Set(before.filter(item => { const next = potential.find(row => row.key === item.key); return next && (next.pp !== item.pp || next.ep !== item.ep); }).map(item => item.key));
    const affectedResources = new Set([...keys].filter(key => key.startsWith('resource:')).map(key => key.slice(9)));
    context.characters.forEach((character, index) => { if (character.resourceLinks?.some(link => affectedResources.has(link.resourceId))) keys.add(JSON.stringify(['characters', index])); });
    return keys;
  }, [value, tabs, resources, candidates, before]);
  function apply() {
    if (!preserveModifierRecoveryBackup(original)) { setError(t('recovery.backupError')); return; }
    onResolve(repaired);
  }
  async function exportOriginal() {
    try { await downloadBlob(new Blob([original], { type: 'text/plain' }), 'mm3e-modifier-source-original.txt'); }
    catch { setError(t('draft.exportError')); }
  }
  return <Modal isOpen onClose={() => onResolve(null)} title={t('recovery.title')} compact>
    <div className="modifier-recovery">
      <p>{t('recovery.description')}</p>
      {candidates.map(item => {
        const effect = POWER_DEFS.find(def => def.id === item.effectId)!;
        const modifier = MODIFIER_DEFS.find(def => def.id === item.modifierId)!;
        return <label key={item.key} className="modifier-recovery__entry">
          <input className="app-checkbox" type="checkbox" checked={selected.includes(item.key)} onChange={event => setSelected(keys => event.target.checked ? [...keys, item.key] : keys.filter(key => key !== item.key))} />
          <span><strong>{effect.i18n?.[i18n.language]?.name ?? effect.name} · {modifier.i18n?.[i18n.language]?.name ?? modifier.name}</strong><small>{item.label} · {t('recovery.component', { number: item.componentNumber })}</small><small>{t('recovery.componentCost', { before: item.before, after: item.after })}</small></span>
        </label>;
      })}
      <div aria-live="polite">{before.filter(item => affectedKeys.has(item.key)).map(item => <p key={item.key}>{item.name}: {item.pp} → {after.find(row => row.key === item.key)?.pp} PP{item.ep !== undefined ? ` · ${item.ep} → ${after.find(row => row.key === item.key)?.ep} EP` : ''}</p>)}</div>
      {error && <p role="alert">{error}</p>}
      <div className="modifier-recovery__actions"><Button variant="ghost" onClick={() => void exportOriginal()}>{t('recovery.export')}</Button><Button variant="ghost" onClick={() => onResolve(null)}>{t('common.cancel')}</Button><Button disabled={!selected.length} onClick={apply}>{t('recovery.apply')}</Button></div>
    </div>
    <style>{`.modifier-recovery{display:grid;gap:12px;max-width:700px}.modifier-recovery p{margin:0;line-height:1.5}.modifier-recovery__entry{display:flex;align-items:flex-start;gap:10px;border:1px solid var(--c-border);border-radius:var(--r-sm);padding:10px}.modifier-recovery__entry span{min-width:0}.modifier-recovery__entry small{display:block;overflow-wrap:anywhere;color:var(--c-text-secondary);margin-top:4px}.modifier-recovery__actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:8px}`}</style>
  </Modal>;
}
