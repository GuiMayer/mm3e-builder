import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTraitValues } from '../../shared/hooks/useTraitValues';
import { useResourcesStore } from '../../store/resourcesStore';
import { getTraitSourceEntries } from '../../shared/lib/traitSources';
import { Modal } from '../../shared/ui/Modal';
import { Button } from '../../shared/ui/Button';
import { TraitSourceList } from './TraitSourceList';
import { PowerReferenceDialog, type PowerReferenceTarget } from '../sheet-core/PowerReferenceDialog';
import './traitModifiers.css';

export function PowerEnhancementsButton({ sourceKey, onEdit }: { sourceKey: string; onEdit: () => void }) {
  const { t } = useTranslation();
  const { original } = useTraitValues();
  const resources = useResourcesStore(store => store.resources);
  const [reference, setReference] = useState<PowerReferenceTarget | null>(null);
  const [open, setOpen] = useState(false);
  const entries = getTraitSourceEntries(original, resources).filter(item => item.source.key === sourceKey);
  if (!entries.length) return null;
  return <><Button size="sm" variant="ghost" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`${t('traits.enhancements')} · ${entries[0].source.name}`}>{t('traits.enhancements')}</Button>
    <Modal isOpen={open && !reference} onClose={() => setOpen(false)} title={`${t('traits.enhancements')} · ${entries[0].source.name}`} compact>
      <div className="trait-adjustments"><TraitSourceList entries={entries} onReference={source => setReference({ kind: 'power', power: source.power })} onEdit={() => { setOpen(false); onEdit(); }} /></div>
    </Modal>{reference && <PowerReferenceDialog target={reference} onClose={() => setReference(null)} />}</>;
}
