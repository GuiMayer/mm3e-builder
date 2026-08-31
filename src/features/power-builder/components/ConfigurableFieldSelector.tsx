import type { IConfigurableField } from '../../../entities/types';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

/* ================================================
   ConfigurableFieldSelector Component
   Renders UI controls for configurable power fields
   (resistance type, sense medium, descriptor, etc.)
   ================================================ */

interface ConfigurableFieldSelectorProps {
  fields: IConfigurableField[];
  values: Record<string, string | string[]>;
  onChange: (fieldId: string, value: string | string[]) => void;
  t: TFunction;
}

export function ConfigurableFieldSelector({
  fields,
  values,
  onChange,
  t,
}: ConfigurableFieldSelectorProps) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;

  if (!fields || fields.length === 0) {
    return null;
  }

  return (
    <div className="configurable-fields">
      {fields.map((field) => (
        <div key={field.id} className="configurable-field">
          <label className="build-label">
            {field.i18n?.[language]?.label ?? field.label}
            {field.required && <span className="required-indicator"> *</span>}
          </label>

          {field.control === 'dropdown' && (
            <select
              value={(values[field.id] as string) || ''}
              onChange={(e) => onChange(field.id, e.target.value)}
              className="app-select field-dropdown"
            >
              <option value="">
                {t('builder.selectOption')}
              </option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.i18n?.[language]?.label ?? opt.label}
                </option>
              ))}
            </select>
          )}

          {field.control === 'text' && (
            <input
              type="text"
              value={(values[field.id] as string) || ''}
              onChange={(e) => onChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className="app-input field-text-input"
            />
          )}

          {(field.control === 'multi-select' || field.control === 'multiselect') && (
            <div className="field-multiselect">
              {field.options?.map((opt) => {
                const selectedValues = (values[field.id] as string[]) || [];
                const isChecked = selectedValues.includes(opt.value);

                return (
                  <label key={opt.value} className="multiselect-option">
                    <input
                      className="app-checkbox"
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...selectedValues, opt.value]
                          : selectedValues.filter((v) => v !== opt.value);
                        onChange(field.id, newValues);
                      }}
                    />
                    <span className="option-label">
                      {opt.i18n?.[language]?.label ?? opt.label}
                    </span>
                    {opt.description && (
                      <span className="option-description">
                        {opt.i18n?.[language]?.description ?? opt.description}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}

          {/* Show option descriptions for dropdown */}
          {field.control === 'dropdown' && values[field.id] && (
            <div className="field-description">
              {(() => {
                const option = field.options?.find((opt) => opt.value === values[field.id]);
                return option?.i18n?.[language]?.description ?? option?.description;
              })()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
