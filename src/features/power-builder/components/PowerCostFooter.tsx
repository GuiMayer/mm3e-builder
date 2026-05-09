import { useTranslation } from 'react-i18next';

/* ================================================
   PowerCostFooter Component
   Displays total cost and breakdown for a power
   ================================================ */

interface PowerCostFooterProps {
  totalCost: number;
  mainCost: number;
  arrayCost: number;
  removableDiscount: number;
  aeCount: number;
  dynamicCount: number;
  powerLevel: number;
}

export function PowerCostFooter({
  totalCost,
  mainCost,
  arrayCost,
  removableDiscount,
  aeCount,
  dynamicCount,
  powerLevel,
}: PowerCostFooterProps) {
  const { t } = useTranslation();

  const isOverBudget = totalCost > powerLevel;
  const isUnderBudget = totalCost < powerLevel && totalCost > 0;

  return (
    <div className="builder-footer">
      <div className="builder-cost-summary">
        <div className="cost-breakdown">
          <span className="cost-label">{t('builder.mainCost')}:</span>
          <span className="cost-value">{mainCost} PP</span>
        </div>

        {aeCount > 0 && (
          <div className="cost-breakdown">
            <span className="cost-label">
              {t('builder.arrayFormula')} ({aeCount} AE{dynamicCount > 0 ? `, ${dynamicCount} dynamic` : ''}):
            </span>
            <span className="cost-value">{arrayCost} PP</span>
          </div>
        )}

        {removableDiscount > 0 && (
          <div className="cost-breakdown">
            <span className="cost-label">{t('builder.removable.discount')}:</span>
            <span className="cost-value cost-value--discount">−{removableDiscount} PP</span>
          </div>
        )}

        <div className="cost-breakdown cost-breakdown--total">
          <span className="cost-label cost-label--total">{t('builder.totalCost')}:</span>
          <span
            className={`cost-value cost-value--total ${
              isOverBudget
                ? 'cost-value--over'
                : isUnderBudget
                ? 'cost-value--under'
                : ''
            }`}
          >
            {totalCost} PP
          </span>
        </div>

        {isOverBudget && (
          <div className="cost-warning cost-warning--over">
            {t('builder.overBudget', { pl: powerLevel })}
          </div>
        )}

        {isUnderBudget && (
          <div className="cost-info">
            {t('builder.underBudget', { remaining: powerLevel - totalCost })}
          </div>
        )}
      </div>
    </div>
  );
}
