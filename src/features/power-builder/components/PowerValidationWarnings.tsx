import { AlertTriangle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ================================================
   PowerValidationWarnings Component
   Displays validation warnings for power builder
   ================================================ */

interface PowerValidationWarningsProps {
  plViolation: string | null;
  aeValidations: Array<{ valid: boolean; message?: string }>;
  aeNames: string[];
  strictMode: boolean;
}

export function PowerValidationWarnings({
  plViolation,
  aeValidations,
  aeNames,
  strictMode,
}: PowerValidationWarningsProps) {
  const { t } = useTranslation();

  const hasWarnings = plViolation || aeValidations.some((v) => !v.valid);

  if (!hasWarnings) return null;

  return (
    <div className="builder-warnings">
      {/* PL Violation Warning */}
      {plViolation && strictMode && (
        <div className="validation-warning validation-warning--error">
          <AlertTriangle size={16} />
          <div className="validation-warning-content">
            <strong>{t('builder.plViolation')}</strong>
            <p>{plViolation}</p>
          </div>
        </div>
      )}

      {/* AE Cost Violations */}
      {aeValidations.map((validation, index) => {
        if (validation.valid) return null;

        return (
          <div
            key={index}
            className="validation-warning validation-warning--warning"
          >
            <AlertTriangle size={16} />
            <div className="validation-warning-content">
              <strong>
                {t('builder.aeViolation', { name: aeNames[index] || `AE ${index + 1}` })}
              </strong>
              <p>{validation.message || t('builder.aeExceedsCap')}</p>
            </div>
          </div>
        );
      })}

      {/* Info about strict mode if disabled */}
      {!strictMode && plViolation && (
        <div className="validation-warning validation-warning--info">
          <Info size={16} />
          <div className="validation-warning-content">
            <p>{t('builder.strictModeDisabled')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
