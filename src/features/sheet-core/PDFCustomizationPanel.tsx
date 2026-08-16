/* ================================================
   PDF Customization Panel
   Panel with options to customize PDF appearance
   ================================================ */

import { useTranslation } from 'react-i18next';
import type { PDFCustomizationOptions, ColorScheme, LayoutMode, FontFamily, FontSize, PDFRenderer } from '../../services/pdf/types';
import { COLOR_THEMES } from '../../services/pdf/types';
import { RendererSelector } from '../../components/PDFCustomization/RendererSelector';

interface PDFCustomizationPanelProps {
  options: PDFCustomizationOptions;
  onChange: (options: PDFCustomizationOptions) => void;
}

export function PDFCustomizationPanel({ options, onChange }: PDFCustomizationPanelProps) {
  const { t } = useTranslation();

  const handleColorSchemeChange = (colorScheme: ColorScheme) => {
    onChange({ ...options, colorScheme });
  };

  const handleLayoutModeChange = (layoutMode: LayoutMode) => {
    onChange({ ...options, layoutMode });
  };

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    onChange({ ...options, fontFamily });
  };

  const handleFontSizeChange = (fontSize: FontSize) => {
    onChange({ ...options, fontSize });
  };

  const handleRendererChange = (renderer: PDFRenderer) => {
    onChange({ ...options, renderer });
  };

  const handleSectionToggle = (section: 'notes' | 'complications' | 'equipment') => {
    if (section === 'notes') {
      onChange({ ...options, includeNotes: !options.includeNotes });
    } else if (section === 'complications') {
      onChange({ ...options, includeComplications: !options.includeComplications });
    } else {
      onChange({ ...options, includeEquipment: !options.includeEquipment });
    }
  };

  return (
    <div className="pdf-customization-panel">
      <h3 className="panel-title">{t('pdf.customization.title')}</h3>

      {/* Renderer Section */}
      <section className="panel-section">
        <RendererSelector
          value={options.renderer || 'html2canvas'}
          onChange={handleRendererChange}
        />
      </section>

      {/* Theme Section */}
      <section className="panel-section">
        <h4 className="section-label">{t('pdf.customization.theme.label')}</h4>
        <div className="theme-grid">
          {(['default', 'crimson', 'emerald', 'slate'] as ColorScheme[]).map((scheme) => (
            <button
              key={scheme}
              className={`theme-button ${options.colorScheme === scheme ? 'active' : ''}`}
              onClick={() => handleColorSchemeChange(scheme)}
              aria-label={t(`pdf.customization.theme.${scheme}`)}
            >
              <div className="theme-preview">
                <span 
                  className="theme-color primary" 
                  style={{ backgroundColor: COLOR_THEMES[scheme].primary }}
                />
                <span 
                  className="theme-color secondary" 
                  style={{ backgroundColor: COLOR_THEMES[scheme].secondary }}
                />
              </div>
              <span className="theme-name">{t(`pdf.customization.theme.${scheme}`)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Layout Section */}
      <section className="panel-section">
        <h4 className="section-label">{t('pdf.customization.layout.label')}</h4>
        <div className="button-group">
          <button
            className={`mode-button ${options.layoutMode === 'normal' ? 'active' : ''}`}
            onClick={() => handleLayoutModeChange('normal')}
          >
            {t('pdf.customization.layout.normal')}
          </button>
          <button
            className={`mode-button ${options.layoutMode === 'compact' ? 'active' : ''}`}
            onClick={() => handleLayoutModeChange('compact')}
          >
            {t('pdf.customization.layout.compact')}
          </button>
        </div>
        <p className="section-hint">
          {options.layoutMode === 'compact' 
            ? t('pdf.customization.layout.compactHint')
            : t('pdf.customization.layout.normalHint')}
        </p>
      </section>

      {/* Typography Section */}
      <section className="panel-section">
        <h4 className="section-label">{t('pdf.customization.typography.label')}</h4>
        
        <label className="input-label">
          {t('pdf.customization.typography.font')}
        </label>
        <select
          className="font-select"
          value={options.fontFamily}
          onChange={(e) => handleFontFamilyChange(e.target.value as FontFamily)}
        >
          <option value="Segoe UI">Segoe UI</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
        </select>

        <label className="input-label" style={{ marginTop: '0.75rem' }}>
          {t('pdf.customization.typography.size')}
        </label>
        <div className="button-group">
          {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
            <button
              key={size}
              className={`size-button ${options.fontSize === size ? 'active' : ''}`}
              onClick={() => handleFontSizeChange(size)}
            >
              {t(`pdf.customization.typography.${size}`)}
            </button>
          ))}
        </div>
      </section>

      {/* Sections Section */}
      <section className="panel-section">
        <h4 className="section-label">{t('pdf.customization.sections.label')}</h4>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              className="app-checkbox"
              type="checkbox"
              checked={options.includeNotes}
              onChange={() => handleSectionToggle('notes')}
            />
            <span>{t('pdf.customization.sections.notes')}</span>
          </label>
          <label className="checkbox-label">
            <input
              className="app-checkbox"
              type="checkbox"
              checked={options.includeComplications}
              onChange={() => handleSectionToggle('complications')}
            />
            <span>{t('pdf.customization.sections.complications')}</span>
          </label>
          <label className="checkbox-label">
            <input
              className="app-checkbox"
              type="checkbox"
              checked={options.includeEquipment}
              onChange={() => handleSectionToggle('equipment')}
            />
            <span>{t('pdf.customization.sections.equipment')}</span>
          </label>
        </div>
      </section>

      <style>{`
        .pdf-customization-panel {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          height: 100%;
          overflow-y: auto;
          padding: 1rem;
          background: var(--c-surface, #252525);
        }

        .panel-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--c-text, #e0e0e0);
          margin: 0 0 0.5rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--c-border, #333);
        }

        .panel-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .section-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--c-text-secondary, #999);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }

        .section-hint {
          font-size: 0.75rem;
          color: var(--c-text-tertiary, #666);
          margin: 0.25rem 0 0 0;
          font-style: italic;
        }

        /* Theme Grid */
        .theme-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .theme-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 0.5rem;
          background: var(--c-surface-elevated, #1e1e1e);
          border: 2px solid var(--c-border, #333);
          border-radius: var(--r-md, 8px);
          cursor: pointer;
          transition: all var(--t-fast, 0.15s);
        }

        .theme-button:hover {
          background: var(--c-surface, #282828);
          border-color: var(--c-text-secondary, #999);
        }

        .theme-button.active {
          background: var(--c-surface, #2a2a2a);
          border-color: var(--c-primary, #3b82f6);
          box-shadow: 0 0 0 1px var(--c-primary, #3b82f6);
        }

        .theme-preview {
          display: flex;
          gap: 0.25rem;
        }

        .theme-color {
          width: 24px;
          height: 24px;
          border-radius: var(--r-sm, 4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .theme-name {
          font-size: 0.75rem;
          color: var(--c-text, #e0e0e0);
          font-weight: 500;
          text-align: center;
        }

        /* Button Groups */
        .button-group {
          display: flex;
          gap: 0.5rem;
        }

        .mode-button,
        .size-button {
          flex: 1;
          padding: 0.5rem 0.75rem;
          background: var(--c-surface-elevated, #1e1e1e);
          border: 2px solid var(--c-border, #333);
          border-radius: var(--r-md, 8px);
          color: var(--c-text, #e0e0e0);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--t-fast, 0.15s);
        }

        .mode-button:hover,
        .size-button:hover {
          background: var(--c-surface, #282828);
          border-color: var(--c-text-secondary, #999);
        }

        .mode-button.active,
        .size-button.active {
          background: var(--c-primary, #3b82f6);
          border-color: var(--c-primary, #3b82f6);
          color: #fff;
        }

        /* Input Controls */
        .input-label {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--c-text-secondary, #999);
          margin-bottom: 0.25rem;
        }

        .font-select {
          padding: 0.5rem;
          background: var(--c-surface-elevated, #1e1e1e);
          border: 1px solid var(--c-border, #333);
          border-radius: var(--r-md, 8px);
          color: var(--c-text, #e0e0e0);
          font-size: 0.85rem;
          font-family: var(--f-body, system-ui, sans-serif);
          cursor: pointer;
          transition: border-color var(--t-fast, 0.15s);
        }

        .font-select:hover {
          border-color: var(--c-text-secondary, #999);
        }

        .font-select:focus {
          outline: none;
          border-color: var(--c-primary, #3b82f6);
        }

        /* Checkboxes */
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: var(--c-surface-elevated, #1e1e1e);
          border-radius: var(--r-md, 8px);
          cursor: pointer;
          transition: background var(--t-fast, 0.15s);
        }

        .checkbox-label:hover {
          background: var(--c-surface, #282828);
        }

        .checkbox-label .app-checkbox { cursor: pointer; }

        .checkbox-label span {
          font-size: 0.85rem;
          color: var(--c-text, #e0e0e0);
          font-weight: 500;
        }

        /* Scrollbar */
        .pdf-customization-panel::-webkit-scrollbar {
          width: 8px;
        }

        .pdf-customization-panel::-webkit-scrollbar-track {
          background: var(--c-surface, #1a1a1a);
        }

        .pdf-customization-panel::-webkit-scrollbar-thumb {
          background: var(--c-border, #333);
          border-radius: 4px;
        }

        .pdf-customization-panel::-webkit-scrollbar-thumb:hover {
          background: var(--c-text-secondary, #666);
        }
      `}</style>
    </div>
  );
}
