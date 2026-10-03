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
  onRanksChange: (ranks: number) => void;
  onOptionsChange: (options: Record<string, boolean | number | string>) => void;
}

export function ModifierParameterControls({
  applied,
  definition,
  effectRanks,
  effectAction,
  onRanksChange,
  onOptionsChange,
}: ModifierParameterControlsProps) {
  const { t, i18n } = useTranslation();
  const ranked = isRankedModifier(definition);
  const subtypeId = getSelectedModifierSubtypeId(applied, definition);
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
              aria-label={`${t('builder.modifierRanks')}: ${definition.name}`}
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
              aria-label={`${t('builder.effectRanksAffected')}: ${definition.name}`}
            />
          </div>
        )}

        {definition.subtypes && definition.subtypes.length > 0 && (
          <div className="applied-mod-field">
            <span className="applied-mod-field-label">{t('builder.subtypeLabel')}</span>
            <select
              className="applied-mod-subtype"
              value={subtypeId}
              onChange={(event) => onOptionsChange({
                ...applied.options,
                subtypeId: event.target.value,
              })}
              title={t('builder.subtypeLabel')}
            >
              <option value="">{t('builder.subtypeNone')}</option>
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
