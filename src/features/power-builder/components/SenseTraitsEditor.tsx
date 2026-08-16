import { Plus, X } from 'lucide-react';
import type { ISenseTraitPurchase } from '../../../entities/types';
import { SENSE_TRAITS, SENSE_TYPES } from '../../../data/senseTraits';
import { NumberInput } from '../../../shared/ui/NumberInput';

interface Props { traits: ISenseTraitPurchase[]; onChange: (traits: ISenseTraitPurchase[]) => void; }
export function SenseTraitsEditor({ traits, onChange }: Props) {
  const total = traits.reduce((sum, trait) => sum + trait.ranks, 0);
  const update = (index: number, updateValue: Partial<ISenseTraitPurchase>) => onChange(traits.map((trait, i) => i === index ? { ...trait, ...updateValue } : trait));
  return <div className="configurable-fields"><div className="build-section-header"><label className="build-label">Sense traits — {total} ranks</label><button type="button" className="build-add-comp-btn" onClick={() => onChange([...traits, { id: 'direction_sense', ranks: 1 }])}><Plus size={12} /> Add trait</button></div>
    {traits.map((trait, index) => { const definition = SENSE_TRAITS.find((item) => item.id === trait.id) ?? SENSE_TRAITS[0]; return <div className="build-row" key={`${trait.id}-${index}`}><select className="build-select build-select--sm" value={trait.id} onChange={(e) => { const next = SENSE_TRAITS.find((item) => item.id === e.target.value)!; update(index, { id: next.id, ranks: next.minRanks, senseType: undefined, scope: undefined, detail: undefined }); }}>{SENSE_TRAITS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
      {definition.requiresSense && <select className="build-select build-select--sm" value={trait.senseType ?? ''} onChange={(e) => update(index, { senseType: e.target.value })}><option value="">Sense…</option>{SENSE_TYPES.map((type) => <option key={type}>{type}</option>)}</select>}
      {definition.supportsScope && <select className="build-select build-select--sm" value={trait.scope ?? 'sense'} onChange={(e) => update(index, { scope: e.target.value as 'sense' | 'type', ranks: e.target.value === 'type' ? definition.maxRanks : definition.minRanks })}><option value="sense">One sense</option><option value="type">Sense type</option></select>}
      {definition.maxRanks > definition.minRanks && <NumberInput variant="small" className="build-input build-input--small" value={trait.ranks} min={definition.minRanks} max={definition.maxRanks} onChange={(ranks) => update(index, { ranks })} />}
      {definition.requiresDetail && <input className="build-input build-input--sm" value={trait.detail ?? ''} placeholder="Detail…" onChange={(e) => update(index, { detail: e.target.value })} />}
      <button type="button" className="applied-mod-remove" onClick={() => onChange(traits.filter((_, i) => i !== index))}><X size={12} /></button></div>; })}
  </div>;
}
