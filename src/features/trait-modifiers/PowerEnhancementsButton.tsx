import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { useTraitValues } from '../../shared/hooks/useTraitValues';
import { useResourcesStore } from '../../store/resourcesStore';
import { getTraitSourceEntries } from '../../shared/lib/traitSources';
import { Modal } from '../../shared/ui/Modal';
import { TraitSourceList } from './TraitSourceList';
import { PowerReferenceDialog, type PowerReferenceTarget } from '../sheet-core/PowerReferenceDialog';
import './traitModifiers.css';

export function PowerEnhancementsButton({ sourceKey, onEdit }: { sourceKey: string; onEdit: () => void }) {
  const { t } = useTranslation();
  const { original, warnings } = useTraitValues();
  const resources = useResourcesStore(store => store.resources);
  const [reference, setReference] = useState<PowerReferenceTarget | null>(null);
  const [open, setOpen] = useState(false);
  const entries = getTraitSourceEntries(original, resources).filter(item => item.source.key === sourceKey);
  if (!entries.length) return null;
  const needsReview = entries.some(item => ['unbound', 'invalid', 'absent'].includes(item.status)) || warnings.some(warning => warning.params?.name === entries[0].source.name && (warning.key !== 'traits.missingTarget' || entries.some(item => item.status === 'unbound')));
  return <><button type="button" className="power-enhancements-button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`${t('traits.enhancements')} · ${entries[0].source.name}`} title={needsReview ? t('traits.reviewSource') : undefined}>{t('traits.enhancements')}{needsReview && <AlertTriangle size={14} aria-hidden="true" />}</button>
    <Modal isOpen={open && !reference} onClose={() => setOpen(false)} title={`${t('traits.enhancements')} · ${entries[0].source.name}`} compact>
      <div className="trait-adjustments"><TraitSourceList entries={entries} onReference={source => setReference({ kind: 'power', power: source.power })} onEdit={() => { setOpen(false); onEdit(); }} /></div>
    </Modal>{reference && <PowerReferenceDialog target={reference} onClose={() => setReference(null)} />}</>;
}
