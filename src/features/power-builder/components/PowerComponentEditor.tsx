import type {
  ICharacterPowerComponent,
  IPowerEffect,
  IModifierDef,
} from '../../../entities/types';
import { EffectCombobox } from '../../../shared/ui/EffectCombobox';
import { ModifierDropzone } from './ModifierDropzone';
import { X, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NumberInput } from '../../../shared/ui/NumberInput';

/* ================================================
   PowerComponentEditor Component
   Editor for a single power component
   ================================================ */

interface PowerComponentEditorProps {
  component: ICharacterPowerComponent;
  componentIndex: number;
  powerDefs: IPowerEffect[];
  allModDefs: IModifierDef[];
  isActive: boolean;
  canRemove: boolean;
  costTotal: number;
  costBreakdown: any;
  activeId: string | null;
  onSetActive: () => void;
  onUpdateComponent: (update: Partial<ICharacterPowerComponent>) => void;
  onRemoveComponent: () => void;
  onRemoveModifier: (modifierId: string) => void;
  onUpdateModifierRanks: (modifierId: string, ranks: number) => void;
  onUpdateModifierOption: (modifierId: string, option: string) => void;
  onUpdateModifierOptions: (modifierId: string, options: Record<string, boolean | number | string>) => void;
  onShowEffectInfo: (effect: IPowerEffect) => void;
}

export function PowerComponentEditor({
  component,
  componentIndex,
  powerDefs,
  allModDefs,
  isActive,
  canRemove,
  costTotal,
  costBreakdown,
  activeId,
  onSetActive,
  onUpdateComponent,
  onRemoveComponent,
  onRemoveModifier,
  onUpdateModifierRanks,
  onUpdateModifierOption,
  onUpdateModifierOptions,
  onShowEffectInfo,
}: PowerComponentEditorProps) {
  const { t } = useTranslation();
  const effectDef = powerDefs.find((d) => d.id === component.effectId);

  return (
    <div
      className={`component-card ${isActive ? 'component-card--active' : ''}`}
      onClick={onSetActive}
    >
      {/* Component header */}
      <div className="component-header">
        <span className="component-label">
          {componentIndex === 0 ? t('builder.mainEffect') : t('builder.effectN', { n: componentIndex + 1 })}
        </span>
        {costTotal > 0 && (
          <span className="component-cost">{costTotal} PP</span>
        )}
        {canRemove && (
          <button
            className="component-remove"
            onClick={(e) => { e.stopPropagation(); onRemoveComponent(); }}
            title={t('builder.removeComponent')}
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Effect selector with search */}
      <div className="build-row" style={{ alignItems: 'flex-end' }}>
        <div className="build-section build-section--flex">
          <EffectCombobox
            value={component.effectId}
            onChange={(effectId) => onUpdateComponent({ effectId })}
            allEffects={powerDefs}
            t={t}
            onInfo={onShowEffectInfo}
          />
        </div>
        <div className="build-section">
          <label className="build-label">{t('builder.ranks')}</label>
          <NumberInput
            variant="small"
            className="build-input build-input--small"
            value={component.ranks}
            onChange={(value) =>
              onUpdateComponent({
                ranks: Math.max(1, value),
              })
            }
            onClick={(e) => e.stopPropagation()}
            min={1}
          />
        </div>
      </div>

      {/* Effect info strip */}
      {effectDef && (
        <div className="build-effect-info">
          <span className="effect-badge">{effectDef.type}</span>
          <span className="effect-detail">{t('common.action')}: {effectDef.action}</span>
          <span className="effect-detail">{t('common.range')}: {effectDef.range}</span>
          <span className="effect-detail">{t('common.duration')}: {effectDef.duration}</span>
          <p className="effect-desc">{effectDef.description}</p>
          {effectDef.enhancesDefense && (
            <div className="defense-warning">
              <AlertTriangle size={13} />
              {t('builder.defenseWarning')}
            </div>
          )}
        </div>
      )}

      {/* Modifier dropzone */}
      <div className="build-section" onClick={(e) => e.stopPropagation()}>
        <label className="build-label">{t('builder.modifiers')}</label>
        <ModifierDropzone componentId={component.id} activeId={isActive ? activeId : null}>
          {component.modifiers.length === 0 && !activeId && (
            <span className="dropzone-placeholder">{t('builder.dropHere')}</span>
          )}
          {component.modifiers.map((applied) => {
            const def = allModDefs.find((d) => d.id === applied.modifierId);
            if (!def) return null;

            const modCostPP =
              def.costType === 'flat'
                ? def.costValue
                : def.costType === 'flat_ranked'
                ? def.costValue * applied.ranks
                : null; // per_rank shown differently

            const overPL =
              def.maxRanks !== undefined && applied.ranks > def.maxRanks;

            return (
              <div
                key={applied.modifierId}
                className={`applied-mod ${def.category === 'flaw' ? 'applied-mod--flaw' : ''} ${applied.isPowerSpecific ? 'applied-mod--specific' : ''}`}
              >
                <span className="applied-mod-name">{def.name}</span>
                {def.costType !== 'per_rank' && (
                  <NumberInput
                    variant="small"
                    className="applied-mod-ranks"
                    value={applied.ranks}
                    onChange={(value) =>
                      onUpdateModifierRanks(
                        applied.modifierId,
                        value
                      )
                    }
                    min={1}
                    max={def.maxRanks ?? undefined}
                  />
                )}
                {/* Sub-option dropdown */}
                {def.options && def.options.length > 0 && (
                  <select
                    className="applied-mod-option"
                    value={applied.option ?? ''}
                    onChange={(e) =>
                      onUpdateModifierOption(applied.modifierId, e.target.value)
                    }
                  >
                    <option value="">Shape...</option>
                    {def.options.map((opt) => (
                      <option key={opt.label} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {/* Conditional checkbox for Affects Objects */}
                {def.id === 'affects_objects' && (
                  <label className="applied-mod-checkbox">
                    <input
                      type="checkbox"
                      checked={applied.options?.affectsOnlyObjects === true}
                      onChange={(e) => {
                        const newOptions = {
                          ...applied.options,
                          affectsOnlyObjects: e.target.checked,
                        };
                        onUpdateModifierOptions(applied.modifierId, newOptions);
                      }}
                    />
                    {t('builder.affectsOnlyObjects')}
                  </label>
                )}
                {/* Subtype selector for modifiers with variable cost (e.g. Alternate Resistance) */}
                {def.subtypes && def.subtypes.length > 0 && (
                  <select
                    className="applied-mod-subtype"
                    value={(applied.options?.subtypeId as string) ?? ''}
                    onChange={(e) => {
                      onUpdateModifierOptions(applied.modifierId, {
                        ...applied.options,
                        subtypeId: e.target.value,
                      });
                    }}
                    title={t('builder.subtypeLabel')}
                  >
                    <option value="">{t('builder.subtypeNone')}</option>
                    {def.subtypes.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.label} (+{sub.costValue}/rank)
                      </option>
                    ))}
                  </select>
                )}
                <span className="applied-mod-cost">
                  {(() => {
                    // Show effective cost, accounting for active subtype
                    if (def.costType === 'per_rank') {
                      let effectiveCost = def.costValue;
                      if (def.subtypes && def.subtypes.length > 0) {
                        const sid = applied.options?.subtypeId as string | undefined;
                        const sub = sid ? def.subtypes.find((s) => s.id === sid) : undefined;
                        if (sub) effectiveCost = sub.costValue;
                      }
                      if (def.id === 'affects_objects') {
                        effectiveCost = applied.options?.affectsOnlyObjects === true ? 0 : 1;
                      }
                      return `${effectiveCost >= 0 ? '+' : ''}${effectiveCost}/rank`;
                    }
                    if (modCostPP !== null) {
                      return `${modCostPP > 0 ? '+' : ''}${modCostPP}pp`;
                    }
                    return '';
                  })()}
                </span>
                {overPL && (
                  <span className="applied-mod-overlimit" title={t('builder.plWarning')}>
                    ⚠️
                  </span>
                )}
                <button
                  className="applied-mod-remove"
                  onClick={() => onRemoveModifier(applied.modifierId)}
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </ModifierDropzone>
      </div>

      {/* Cost breakdown for this component */}
      {costBreakdown && costTotal > 0 && (
        <div className="component-breakdown">
          {costBreakdown.perRankExtras > 0 || costBreakdown.perRankFlaws > 0 ? (
            <span>
              ({costBreakdown.base} + {costBreakdown.perRankExtras} − {costBreakdown.perRankFlaws}) × {component.ranks} = {costBreakdown.rankCost}
              {costBreakdown.flatCost !== 0 ? ` + ${costBreakdown.flatCost} flat` : ''}
              {' = '}<strong>{costBreakdown.total} PP</strong>
            </span>
          ) : (
            <span>
              {costBreakdown.base}/rank × {component.ranks} = {costBreakdown.rankCost}
              {costBreakdown.flatCost !== 0 ? ` + ${costBreakdown.flatCost} flat` : ''}
              {' = '}<strong>{costBreakdown.total} PP</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
