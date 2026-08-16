import { createContext, useContext } from 'react';

export type DialogOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  requireAcknowledgement?: boolean;
  acknowledgementLabel?: string;
};

export type DialogApi = {
  confirm: (options: DialogOptions) => Promise<boolean>;
  alert: (options: Omit<DialogOptions, 'cancelLabel' | 'danger' | 'requireAcknowledgement'>) => Promise<void>;
};

export const DialogContext = createContext<DialogApi | null>(null);

export function useAppDialog(): DialogApi {
  const api = useContext(DialogContext);
  if (!api) throw new Error('useAppDialog must be used within AppDialogProvider');
  return api;
}
