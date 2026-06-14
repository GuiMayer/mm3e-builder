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
      <label className="renderer-selector__label" htmlFor="renderer-select">
        {t('pdf.customization.renderer.label')}
      </label>
      <select
        id="renderer-select"
        className="renderer-selector__select"
        value={value}
        onChange={(e) => onChange(e.target.value as PDFRenderer)}
      >
        <option value="html2canvas">
          {t('pdf.customization.renderer.html2canvas')}
        </option>
        <option value="paged">
          {t('pdf.customization.renderer.paged')}
        </option>
      </select>
    </div>
  );
}
