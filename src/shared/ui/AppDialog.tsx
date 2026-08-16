import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import { Button } from './Button';
import { DialogContext, type DialogOptions } from './appDialogContext';

export function AppDialogProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [dialog, setDialog] = useState<(DialogOptions & { resolve: (value: boolean) => void; kind: 'confirm' | 'alert' }) | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
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
  const api = useMemo(() => ({ confirm, alert }), [alert, confirm]);
  return (
    <DialogContext.Provider value={api}>
      {children}
      <Modal isOpen={Boolean(dialog)} onClose={() => close(false)} title={dialog?.title ?? t('dialog.confirmation')} compact>
        <div className="app-dialog">
          <p>{dialog?.message}</p>
          {dialog?.requireAcknowledgement && (
            <label className="app-dialog__check">
              <input type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} />
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
          .app-dialog__check input { appearance:none; background:var(--c-surface-elevated); border:1px solid var(--c-border); border-radius:var(--r-sm); display:grid; height:18px; margin:0; place-content:center; width:18px; }
          .app-dialog__check input::before { background:var(--c-text-inverse); clip-path:polygon(14% 44%,0 65%,50% 100%,100% 16%,80% 0,43% 62%); content:''; height:11px; transform:scale(0); width:11px; }
          .app-dialog__check input:checked { background:var(--c-primary); border-color:var(--c-primary); }
          .app-dialog__check input:checked::before { transform:scale(1); }
        `}</style>
      </Modal>
    </DialogContext.Provider>
  );
}
