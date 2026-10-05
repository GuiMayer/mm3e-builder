import { useTranslation } from 'react-i18next';
import type { IAppliedModifier, IModifierDef } from '../../../entities/types';
import {
  calcModifierCost,
  getPerRankModifierCost,
  getSelectedModifierSubtypeId,
  isRankedModifier,
} from '../../../shared/lib/mathEngine';
import { getAffectedRanks } from '../../../shared/lib/componentRanks';
import { NumberInput } from '../../../shared/ui/NumberInput';

interface ModifierParameterControlsProps {
  applied: IAppliedModifier;
  definition: IModifierDef;
  effectRanks: number;
  effectAction?: string;
  applicationNumber?: number;
  onRanksChange: (ranks: number) => void;
  onOptionsChange: (options: Record<string, boolean | number | string>) => void;
}

export function ModifierParameterControls({
  applied,
  definition,
  effectRanks,
  effectAction,
  applicationNumber,
  onRanksChange,
  onOptionsChange,
}: ModifierParameterControlsProps) {
  const { t, i18n } = useTranslation();
  const ranked = isRankedModifier(definition);
  const applicationLabel = `${definition.name}${applicationNumber ? ` (#${applicationNumber})` : ''}`;
  const subtypeId = getSelectedModifierSubtypeId(applied, definition);
  const durationSteps = definition.id === 'increased_duration';
  const overLimit = definition.maxRanks !== undefined && applied.ranks > definition.maxRanks;
  const cost = definition.costType === 'per_rank'
    ? getPerRankModifierCost(applied, definition, effectAction)
    : calcModifierCost(applied, definition);

  return (
    <>
      <div className="applied-mod-parameters">
        {ranked && (
          <div className="applied-mod-field">
            <span className="applied-mod-field-label">{t('builder.modifierRanks')}</span>
            <NumberInput
              variant="small"
              className="applied-mod-ranks"
              value={applied.ranks}
              onChange={onRanksChange}
              min={1}
              aria-label={`${t('builder.modifierRanks')}: ${applicationLabel}`}
            />
          </div>
        )}

        {definition.costType === 'per_rank' && (
          <div className="applied-mod-field">
            <span className="applied-mod-field-label">{t('builder.effectRanksAffected')}</span>
            <NumberInput
              variant="small"
              className="applied-mod-ranks"
              value={getAffectedRanks(applied) ?? effectRanks}
              onChange={(value) => onOptionsChange({
                ...applied.options,
                affectedRanks: Math.max(1, Math.min(effectRanks, value)),
              })}
              min={1}
              max={effectRanks}
              aria-label={`${t('builder.effectRanksAffected')}: ${applicationLabel}`}
            />
          </div>
        )}

        {definition.subtypes && definition.subtypes.length > 0 && (
          <div className="applied-mod-field">
            <span className="applied-mod-field-label">{t(durationSteps ? 'builder.durationSteps' : 'builder.subtypeLabel')}</span>
            <select
              className="applied-mod-subtype"
              value={subtypeId || (durationSteps ? 'one_step' : '')}
              onChange={(event) => onOptionsChange({
                ...applied.options,
                subtypeId: event.target.value,
              })}
              title={t(durationSteps ? 'builder.durationSteps' : 'builder.subtypeLabel')}
              aria-label={`${t(durationSteps ? 'builder.durationSteps' : 'builder.subtypeLabel')}: ${applicationLabel}`}
            >
              {!durationSteps && <option value="">{t('builder.subtypeNone')}</option>}
              {definition.subtypes.map((subtype) => (
                <option key={subtype.id} value={subtype.id}>
                  {subtype.i18n?.[i18n.language]?.label ?? subtype.label}
                  {' '}({subtype.costValue >= 0 ? '+' : ''}{subtype.costValue}/{t('common.rank')})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {(applicationNumber !== undefined || applied.options?.note !== undefined) && (
        <input
          className="applied-mod-instance-note"
          value={typeof applied.options?.note === 'string' ? applied.options.note : ''}
          placeholder={t('builder.modifierNotePlaceholder')}
          aria-label={`${t('builder.modifierNote')}: ${applicationLabel}`}
          onChange={event => onOptionsChange({ ...applied.options, note: event.target.value })}
        />
      )}

      <span className="applied-mod-cost">
        {definition.costType === 'per_rank'
          ? `${cost >= 0 ? '+' : ''}${cost}/${t('common.rank')}`
          : `${cost > 0 ? '+' : ''}${cost}pp`}
      </span>

      {overLimit && (
        <span className="applied-mod-overlimit" title={t('builder.plWarning')}>
          ⚠️
        </span>
      )}
    </>
  );
}
