import type { IVariableCostOption } from '../../../entities/types';
import type { TFunction } from 'i18next';

/* ================================================
   VariableCostSelector Component
   Allows selection of variable cost option for effects
   like Affliction, Illusion, Immunity, etc.
   ================================================ */

interface VariableCostSelectorProps {
  options: IVariableCostOption[];
  costType?: 'per_rank' | 'flat';
  selected: string | undefined;
  onChange: (optionName: string) => void;
  t: TFunction;
  name?: string;
}

export function VariableCostSelector({
  options,
  costType = 'per_rank',
  selected,
  onChange,
  t,
  name,
}: VariableCostSelectorProps) {
  return (
    <div className="variable-cost-selector">
      <label className="build-label">
        {t('builder.costOption')}
      </label>
      <div className="cost-options">
        {options.map((opt) => (
          <label key={opt.name} className="cost-option-radio">
            <input
              className="app-radio"
              type="radio"
              name={name ?? 'variable-cost'}
              value={opt.name}
              checked={selected === opt.name}
              onChange={() => onChange(opt.name)}
            />
            <span className="cost-option-label">
              {opt.name}
            </span>
            <span className="cost-option-cost">
              {opt.cost} PP{costType === 'per_rank' ? '/rank' : ''}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
