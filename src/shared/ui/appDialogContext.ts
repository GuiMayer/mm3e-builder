import type { RuleDiagnostic } from '../lib/diagnostics';
import { createContext, useContext } from 'react';

export type DialogOptions = {
  title?: string;
  message: string;
  messageDiagnostic?: RuleDiagnostic & { nested?: RuleDiagnostic };
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  requireAcknowledgement?: boolean;
  acknowledgementLabel?: string;
};

export type DialogApi = {
  choose: (options: { title: string; message: string; choices: { value: string; label: string }[] }) => Promise<string | null>;
  reviewModifierSources: <T>(value: T, original: string) => Promise<T | null>;
  confirm: (options: DialogOptions) => Promise<boolean>;
  alert: (options: Omit<DialogOptions, 'cancelLabel' | 'danger' | 'requireAcknowledgement'>) => Promise<void>;
};

export const DialogContext = createContext<DialogApi | null>(null);

export function useAppDialog(): DialogApi {
  const api = useContext(DialogContext);
  if (!api) throw new Error('useAppDialog must be used within AppDialogProvider');
  return api;
}
