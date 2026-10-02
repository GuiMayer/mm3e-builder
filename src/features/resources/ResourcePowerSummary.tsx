import { useState } from 'react';
import { Edit3, Info, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { IAlternateEffect, ICharacterPower } from '../../entities/types';
import { MODIFIER_DEFS, POWER_DEFS } from '../../entities/gameDataLoaders';
import { Tooltip } from '../../shared/ui/Tooltip';
import { PowerReferenceDialog, type PowerReferenceTarget } from '../sheet-core/PowerReferenceDialog';
import { buildPowerReferences, localizeReference } from '../sheet-core/powerReference';
import './resourcePowerSummary.css';

export function ResourcePowerSummary({ power, onEdit, onRemove, label }: { power: ICharacterPower; onEdit: () => void; onRemove?: () => void; label?: string }) {
  const { t, i18n } = useTranslation();
  const [target, setTarget] = useState<PowerReferenceTarget | null>(null);
  const hint = (description?: string) => `${description || t('rulesInfo.missing')}\n\n${t('rulesInfo.clickForDetails')}`;
  const summary = (slot: ICharacterPower | IAlternateEffect) => buildPowerReferences(slot.components, POWER_DEFS, MODIFIER_DEFS, i18n.language).map(reference => `${reference.definition?.name ?? reference.component.effectId}: ${reference.definition?.description || t('rulesInfo.missing')}`).join('\n\n');
  function effects(slot: ICharacterPower | IAlternateEffect) {
    return buildPowerReferences(slot.components, POWER_DEFS, MODIFIER_DEFS, i18n.language).map(reference => <div className="resource-power__component" key={reference.component.id}>
      <Tooltip content={hint(reference.definition?.description)}><button type="button" className="resource-power__effect" aria-haspopup="dialog" onClick={() => setTarget({ kind: 'effect', reference })}>{reference.definition?.name ?? reference.component.effectId} {reference.component.ranks}</button></Tooltip>
      {reference.modifiers.map((modifier, index) => <Tooltip key={index} content={hint(modifier.definition?.description)}><button type="button" className="resource-power__modifier" aria-haspopup="dialog" onClick={() => setTarget({ kind: 'modifier', reference: modifier, effectName: reference.definition?.name ?? reference.component.effectId })}>{modifier.definition?.name ?? modifier.applied.modifierId}</button></Tooltip>)}
    </div>);
  }
  return <section className="resource-power">
    <div className="resource-power__header">
      <Tooltip content={hint(summary(power))}><button type="button" className="resource-power__name" aria-haspopup="dialog" onClick={() => setTarget({ kind: 'power', power })}>{label && power.name && <span>{label}: </span>}{power.name || label || t('resources.unnamedEffect')} <Info size={13}/></button></Tooltip>
      <div className="resource-power__actions">
        <Tooltip content={t('resources.editPower')}><button type="button" className="resource-power__edit" aria-label={t('resources.editPowerNamed', { name: power.name || label || t('resources.unnamedEffect') })} onClick={onEdit}><Edit3 size={15}/></button></Tooltip>
        {onRemove && <Tooltip content={t('common.remove')}><button type="button" className="resource-power__edit" aria-label={t('resources.removePowerNamed', { name: power.name || t('resources.unnamedEffect') })} onClick={onRemove}><Trash2 size={15}/></button></Tooltip>}
      </div>
    </div>
    {effects(power)}
    {[power.activation ? 'activation' : '', power.removable && power.removable !== 'none' ? 'removable' : ''].filter(Boolean).map(id => {
      const raw = MODIFIER_DEFS.find(modifier => modifier.id === id);
      const definition = raw && localizeReference(raw, i18n.language);
      return <Tooltip key={id} content={hint(definition?.description)}><button type="button" className="resource-power__modifier" aria-haspopup="dialog" onClick={() => setTarget({ kind: 'modifier', reference: { definition, source: 'generic', applied: { modifierId: id, ranks: 1, options: { subtypeId: id === 'activation' ? power.activation! : power.removable! } } } })}>{definition?.name ?? id}</button></Tooltip>;
    })}
    {power.alternateEffects.map(alternate => <div className="resource-power__alternate" key={alternate.id}>
      <Tooltip content={hint(summary(alternate))}><button type="button" className="resource-power__name" aria-haspopup="dialog" onClick={() => setTarget({ kind: 'power', power: alternate })}>↪ {alternate.name || t('rulesInfo.alternate')}{alternate.dynamic ? ` · ${t('rulesInfo.dynamic')}` : ''}</button></Tooltip>
      {effects(alternate)}
    </div>)}
    {target && <PowerReferenceDialog target={target} onClose={() => setTarget(null)}/>}
  </section>;
}
