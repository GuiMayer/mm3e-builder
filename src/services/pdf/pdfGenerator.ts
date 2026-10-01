/* ================================================
   PDF Generator Service
   Orchestrates all PDF components and generates HTML
   ================================================ */

import type { ICharacter, IPowerEffect, IModifierDef, ISkillDef, IAdvantageDef, IResource } from '../../entities/types';
import {
  renderHeaderSection,
  renderAbilitiesSection,
  renderDefensesSection,
  renderOffenseSection,
  renderSkillsSection,
  renderAdvantagesSection,
  renderPowersSection,
  renderEquipmentSection,
  renderComplicationsSection,
  renderNotesSection,
} from './components';
import { deriveCharacterDefenses } from '../../shared/lib/derivedDefenses';
import { calculateCharacterPointSummary } from '../../shared/lib/pointSummary';
import { buildOffenseSummary } from '../../shared/lib/offenseSummary';
import type { PDFCustomizationOptions } from './types';
import { getPDFStyles } from './pdfStyles';
import { resolvePDFFont } from './pdfFonts';
import { escapeHtml } from './components/utils';
import { DEFAULT_CUSTOMIZATION } from './types';

export interface PDFGeneratorOptions {
  character: ICharacter;
  powerDefs: IPowerEffect[];
  modifierDefs: IModifierDef[];
  skillDefs: Record<string, ISkillDef>;
  advantageDefs: Record<string, IAdvantageDef>;
  includeStyles?: boolean;  // Whether to include inline styles
  customization?: PDFCustomizationOptions;  // Customization options for PDF appearance
  resources?: IResource[];
}

export interface PDFGenerationResult {
  html: string;
  success: boolean;
  error?: string;
}

/**
 * Generate PDF-ready HTML for a character sheet
 */
export async function generateCharacterPDF(options: PDFGeneratorOptions): Promise<PDFGenerationResult> {
  try {
    const {
      character,
      powerDefs,
      modifierDefs,
      skillDefs,
      advantageDefs,
      includeStyles = true,
      customization = DEFAULT_CUSTOMIZATION,
      resources = [],
    } = options;

    const {
      abilitiesCost,
      defensesCost,
      skillsCost,
      advantagesCost,
      powersCost,
      totalSpent,
      ppEarned,
      totalAvailable,
      remaining,
    } = calculateCharacterPointSummary(
      character,
      resources,
      powerDefs,
      modifierDefs
    );

    // Calculate additional values needed for rendering
    const { toughnessTotal, initiativeTotal } = deriveCharacterDefenses(character, powerDefs, resources);

    // Build offense entries
    const offenseEntries = buildOffenseSummary(
      character,
      powerDefs,
      Object.values(skillDefs),
      Object.values(advantageDefs),
      modifierDefs,
      undefined,
      resources
    );

    // Generate sections
    const sections: string[] = [];

    // Header (now includes compact PP summary)
    sections.push(renderHeaderSection({
      character,
      powerPointsData: {
        abilitiesCost,
        defensesCost,
        skillsCost,
        advantagesCost,
        powersCost,
        totalAvailable,
        totalSpent,
        remaining,
        ppEarned,
      },
    }));

    // Abilities
    sections.push(renderAbilitiesSection({
      character,
      abilitiesCost,
    }));

    // Defenses
    sections.push(renderDefensesSection({
      character,
      defensesCost,
      toughnessTotal,
      initiativeTotal,
    }));

    // Offense
    sections.push(renderOffenseSection({
      offenseEntries,
    }));

    // Parallel lists share the page width without changing their source data.
    const skillsSection = customization.hideEmptySections !== false && !character.skills.some(skill => skill.ranks > 0) ? '' : renderSkillsSection({
      character,
      skillDefs,
      skillsCost,
    });
    const advantagesSection = customization.hideEmptySections !== false && character.advantages.length === 0 ? '' : renderAdvantagesSection({
      character,
      advantageDefs,
      advantagesCost,
    });
    sections.push(`<div class="pdf-columns">${skillsSection}${advantagesSection}</div>`);

    // Powers
    if (customization.hideEmptySections === false || character.powers.some(power => !power.removable || power.removable === 'none')) sections.push(renderPowersSection({
      character,
      powerDefs,
      modifierDefs,
      powersCost,
    }));

    // Equipment (optional based on customization)
    if (customization.includeEquipment) {
      const equipmentSection = renderEquipmentSection({
        character,
        powerDefs,
        modifierDefs,
        resources,
      });
      if (equipmentSection) {
        sections.push(equipmentSection);
      }
    }

    // Complications (optional based on customization)
    if (customization.includeComplications && (customization.hideEmptySections === false || character.complications.length > 0)) {
      const complicationsSection = renderComplicationsSection({
        character,
      });
      if (complicationsSection) {
        sections.push(complicationsSection);
      }
    }

    // Notes (optional based on customization)
    if (customization.includeNotes) {
      const notesSection = renderNotesSection({
        character,
      });
      if (notesSection) {
        sections.push(notesSection);
      }
    }

    // Combine sections
    const bodyContent = sections.filter(s => s.trim().length > 0).join('\n\n');

    // Generate full HTML
    const html = generateHTMLDocument(bodyContent, includeStyles, customization, character.header.name);

    return {
      html,
      success: true,
    };
  } catch (error) {
    console.error('PDF generation failed:', error);
    return {
      html: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate a complete HTML document with optional styles
 */
function generateHTMLDocument(
  bodyContent: string, 
  includeStyles: boolean, 
  customization: PDFCustomizationOptions,
  characterName: string
): string {
  const styles = includeStyles ? getPDFStyles(customization) : '';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>M&M 3e Character Sheet</title>
  ${styles ? `<style>${styles}</style>` : ''}
</head>
<body>
  <div class="pdf-container" data-character-name="${escapeHtml(characterName)}" data-pdf-font="${resolvePDFFont(customization.fontFamily)}" data-page-label="Page" data-continuation-label="continued">
    ${bodyContent}
  </div>
</body>
</html>`;
}

