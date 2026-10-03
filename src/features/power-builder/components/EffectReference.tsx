import type { TFunction } from 'i18next';
import { AlertTriangle } from 'lucide-react';
import type { IPowerEffect } from '../../../entities/types';

export function EffectReference({ effect, t }: { effect: IPowerEffect; t: TFunction }) {
  return (
    <div className="build-effect-info">
      <span className="effect-badge">{effect.type}</span>
      <span className="effect-detail">{t('common.action')}: {effect.action}</span>
      <span className="effect-detail">{t('common.range')}: {effect.range}</span>
      <span className="effect-detail">{t('common.duration')}: {effect.duration}</span>
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
