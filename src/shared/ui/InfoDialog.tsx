import type { ComponentProps } from 'react';
import { Modal } from './Modal';
import './referenceInfo.css';

/** Read-only reference dialogs share a wider reading layout and existing focus management. */
export function InfoDialog(props: Omit<ComponentProps<typeof Modal>, 'compact'>) {
  return <div className="reference-info"><Modal {...props} compact /></div>;
}
