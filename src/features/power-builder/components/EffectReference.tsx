import type { TFunction } from 'i18next';
import { AlertTriangle } from 'lucide-react';
import { MODIFIER_DEFS } from '../../../entities/gameDataLoaders';
import { resolveEffectiveAction, resolveEffectiveDuration, resolveEffectiveRange } from '../../../shared/lib/effectParameters';
import type { ICharacterPowerComponent, IPowerEffect } from '../../../entities/types';

export function EffectReference({ effect, component, t }: { effect: IPowerEffect; component?: ICharacterPowerComponent; t: TFunction }) {
  const context = { effect, modifierDefs: MODIFIER_DEFS };
  const action = component ? resolveEffectiveAction(effect.action, component, context) : undefined;
  const duration = component ? resolveEffectiveDuration(effect.duration, component, context) : undefined;
  const range = component ? resolveEffectiveRange(effect.range, component) : undefined;
  return (
    <div className="build-effect-info">
      <div className="build-effect-meta">
        <span className="effect-badge">{effect.type}</span>
        <span className="effect-detail">{t('common.action')}: {t(`rulesInfo.action.${action?.value ?? effect.action}`)}</span>
        <span className="effect-detail">{t('common.range')}: {t(`rulesInfo.range.${range?.value ?? effect.range}`)}</span>
        <span className="effect-detail">{t('common.duration')}: {t(`rulesInfo.duration.${duration?.value ?? effect.duration}`)}</span>
      </div>
      {(action?.provisional || duration?.provisional) && <small>{t('builder.validation.provisional')}</small>}
      {action?.maintenanceAction && <small>{t('builder.validation.maintenance')}: {t(`rulesInfo.action.${action.maintenanceAction}`)}</small>}
      {action?.trigger && <small>{t('builder.trigger')}: {action.trigger}</small>}
      <p className="effect-desc">{effect.description}</p>
      {effect.enhancesDefense && (
        <div className="defense-warning">
          <AlertTriangle size={13} />
          {t('builder.defenseWarning')}
        </div>
      )}
    </div>
  );
}
