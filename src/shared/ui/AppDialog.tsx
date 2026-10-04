import { formatDiagnostic } from '../lib/formatDiagnostic';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import { Button } from './Button';
import { DialogContext, type DialogOptions } from './appDialogContext';
import { ModifierRecoveryDialog } from './ModifierRecoveryDialog';
import { inspectModifierSources } from '../lib/modifierSourceRecovery';

export function AppDialogProvider({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  const [dialog, setDialog] = useState<(DialogOptions & { resolve: (value: boolean) => void; kind: 'confirm' | 'alert' }) | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [recovery, setRecovery] = useState<{ value: unknown; original: string; resolve: (value: unknown | null) => void } | null>(null);
  const reviewModifierSources = useCallback(<T,>(value: T, original: string): Promise<T | null> => {
    if (!inspectModifierSources(value).length) return Promise.resolve(value);
    return new Promise(resolve => setRecovery({ value, original, resolve: repaired => resolve(repaired as T | null) }));
  }, []);
  const close = useCallback((value: boolean) => {
    if (dialog) dialog.resolve(value);
    setDialog(null);
    setAcknowledged(false);
  }, [dialog]);
  const confirm = useCallback((options: DialogOptions) => new Promise<boolean>((resolve) => {
    setAcknowledged(false);
    setDialog({ ...options, resolve, kind: 'confirm' });
  }), []);
  const alert = useCallback((options: Omit<DialogOptions, 'cancelLabel' | 'danger' | 'requireAcknowledgement'>) => new Promise<void>((resolve) => {
    setDialog({ ...options, resolve: () => resolve(), kind: 'alert' });
  }), []);
  const api = useMemo(() => ({ confirm, alert, reviewModifierSources }), [alert, confirm, reviewModifierSources]);
  return (
    <DialogContext.Provider value={api}>
      {children}
      {recovery && <ModifierRecoveryDialog value={recovery.value} original={recovery.original} onResolve={value => { recovery.resolve(value); setRecovery(null); }} />}
      <Modal isOpen={Boolean(dialog)} onClose={() => close(false)} title={dialog?.title ?? t('dialog.confirmation')} compact>
        <div className="app-dialog">
          <p>{dialog?.messageDiagnostic ? formatDiagnostic({ ...dialog.messageDiagnostic, params: { ...dialog.messageDiagnostic.params, ...(dialog.messageDiagnostic.nested ? { message: formatDiagnostic(dialog.messageDiagnostic.nested, t, i18n.language) } : {}) } }, t, i18n.language) : dialog?.message}</p>
          {dialog?.requireAcknowledgement && (
            <label className="app-dialog__check">
              <input className="app-checkbox" type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} />
              <span>{dialog.acknowledgementLabel ?? t('dialog.acknowledge')}</span>
            </label>
          )}
          <div className="app-dialog__actions">
            {dialog?.kind === 'confirm' && <Button variant="ghost" onClick={() => close(false)}>{dialog.cancelLabel ?? t('common.cancel')}</Button>}
            <Button variant={dialog?.danger ? 'danger' : 'primary'} disabled={Boolean(dialog?.requireAcknowledgement && !acknowledged)} onClick={() => close(true)}>
              {dialog?.confirmLabel ?? t('common.ok')}
            </Button>
          </div>
        </div>
        <style>{`
          .app-dialog { display:flex; flex-direction:column; gap:var(--s-md); min-width:min(400px,75vw); }
          .app-dialog p { color:var(--c-text-secondary); line-height:1.45; margin:0; white-space:pre-wrap; }
          .app-dialog__actions { display:flex; gap:var(--s-sm); justify-content:flex-end; }
          .app-dialog__check { align-items:center; border:1px solid var(--c-border); border-radius:var(--r-sm); color:var(--c-text); cursor:pointer; display:flex; gap:var(--s-sm); padding:var(--s-sm); }
          .app-dialog__check:hover { border-color:var(--c-primary); }
        `}</style>
      </Modal>
    </DialogContext.Provider>
  );
}
