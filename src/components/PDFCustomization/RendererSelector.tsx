import { useTranslation } from 'react-i18next';
import type { PDFRenderer } from '../../services/pdf/types';
import './RendererSelector.css';

interface RendererSelectorProps {
  value: PDFRenderer;
  onChange: (renderer: PDFRenderer) => void;
}

export function RendererSelector({ value, onChange }: RendererSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="renderer-selector">
      <label className="renderer-selector__label">
        {t('pdf.customization.renderer.label')}
      </label>

      <div className="renderer-selector__options">
        <label className="renderer-option">
          <input
            type="radio"
            name="renderer"
            value="paged"
            checked={value === 'paged'}
            onChange={(e) => onChange(e.target.value as PDFRenderer)}
          />
          <div className="renderer-option__content">
            <span className="renderer-option__title">
              {t('pdf.customization.renderer.paged')}
            </span>
            <span className="renderer-option__hint">
              {t('pdf.customization.renderer.pagedHint')}
            </span>
          </div>
        </label>

        <label className="renderer-option">
          <input
            type="radio"
            name="renderer"
            value="html2canvas"
            checked={value === 'html2canvas'}
            onChange={(e) => onChange(e.target.value as PDFRenderer)}
          />
          <div className="renderer-option__content">
            <span className="renderer-option__title">
              {t('pdf.customization.renderer.html2canvas')}
            </span>
            <span className="renderer-option__hint">
              {t('pdf.customization.renderer.html2canvasHint')}
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}
