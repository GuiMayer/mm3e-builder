/* ================================================
   Template Renderer — Convert character data to HTML
   ================================================ */

import type { ICharacter } from '../../entities/types';
import type { IPDFTemplateRenderer } from './types';
import { loadStyles } from './styles';

/**
 * Default template renderer
 * Converts character data to HTML string ready for PDF conversion
 */
export class PDFTemplateRenderer implements IPDFTemplateRenderer {
  /**
   * Render character data to HTML
   */
  async renderToHTML(character: ICharacter): Promise<string> {
    // TODO: Implement actual rendering using components
    // For now, return a placeholder structure with new styles
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${character.header.name || 'Character'} - M&M 3e</title>
  <style>${this.getStyles()}</style>
</head>
<body>
  <div class="pdf-page">
    <div class="header-section character-name-running">
      <div class="header-main">
        <div class="character-name">${character.header.name || 'Unnamed Hero'}</div>
        <div class="header-field">
          <span class="header-field-label">Player:</span>
          <span class="header-field-value">${character.header.player || ''}</span>
        </div>
        <div class="header-field">
          <span class="header-field-label">Identity:</span>
          <span class="header-field-value">${character.header.identity || ''}</span>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-box">
          <div class="stat-box-label">Power Level</div>
          <div class="stat-box-value">${character.header.powerLevel || 10}</div>
        </div>
        <div class="stat-box">
          <div class="stat-box-label">Hero Points</div>
          <div class="stat-box-value">${character.header.heroPoints || 0}</div>
        </div>
      </div>
    </div>
    
    <div class="pdf-section">
      <div class="pdf-section-title">Character Sheet Preview</div>
      <p>This is a placeholder showing the new CSS system.</p>
      <p>Full component implementation coming in next phase.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
    
    return html;
  }
  
  /**
   * Get CSS styles for print layout
   */
  getStyles(): string {
    return loadStyles();
  }
}
