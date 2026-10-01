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
import { createPDFLabels, localizePDFDefinition, localizePDFPowers, localizePDFModifiers, pdfLanguage } from './pdfMessages';
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
  language?: string;
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
      language = 'en',
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

    const labels = createPDFLabels(language);
    const displayPowerDefs = localizePDFPowers(powerDefs, language);
    const displayModifierDefs = localizePDFModifiers(modifierDefs, language);
    const displaySkillDefs = Object.fromEntries(Object.entries(skillDefs).map(([id, def]) => [id, localizePDFDefinition(def, language)]));
    const displayAdvantageDefs = Object.fromEntries(Object.entries(advantageDefs).map(([id, def]) => [id, localizePDFDefinition(def, language)]));
    const displayOffenseEntries = offenseEntries.map(entry => ({ ...entry,
      name: entry.sourceType === 'unarmed' ? labels('Unarmed') : entry.name,
      effect: entry.isManual ? entry.effect : powerDefs.reduce((effect, def) => effect.startsWith(`${def.name} `) ? `${displayPowerDefs.find(display => display.id === def.id)!.name}${effect.slice(def.name.length)}` : effect, entry.effect),
    }));

    const worksheet = customization.contentMode === 'worksheet';
    const hideEmpty = !worksheet && (customization.contentMode === 'filled' || customization.hideEmptySections !== false);

    // Generate sections
    const sections: string[] = [];

    // Header (now includes compact PP summary)
    sections.push(renderHeaderSection({
      character, labels, worksheet,
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
      character, labels,
      abilitiesCost,
    }));

    // Defenses
    sections.push(renderDefensesSection({
      character, labels,
      defensesCost,
      toughnessTotal,
      initiativeTotal,
    }));

    // Offense
    sections.push(renderOffenseSection({
      offenseEntries: displayOffenseEntries, labels, worksheet,
    }));

    // Parallel lists share the page width without changing their source data.
    const skillsSection = hideEmpty && !character.skills.some(skill => skill.ranks > 0) ? '' : renderSkillsSection({
      character, labels, worksheet,
      skillDefs: displaySkillDefs,
      skillsCost,
    });
    const advantagesSection = hideEmpty && character.advantages.length === 0 ? '' : renderAdvantagesSection({
      character, labels, worksheet,
      advantageDefs: displayAdvantageDefs,
      advantagesCost,
    });
    sections.push(`<div class="pdf-columns">${skillsSection}${advantagesSection}</div>`);

    // Powers
    if (!hideEmpty || character.powers.some(power => !power.removable || power.removable === 'none')) sections.push(renderPowersSection({
      character, labels, worksheet,
      powerDefs: displayPowerDefs,
      modifierDefs: displayModifierDefs,
      powersCost,
    }));

    // Equipment (optional based on customization)
    if (worksheet || customization.includeEquipment) {
      const equipmentSection = renderEquipmentSection({
        character, labels, worksheet,
        powerDefs: displayPowerDefs,
        modifierDefs: displayModifierDefs,
        resources,
      });
      if (equipmentSection) {
        sections.push(equipmentSection);
      }
    }

    // Complications (optional based on customization)
    if ((worksheet || customization.includeComplications) && (!hideEmpty || character.complications.length > 0)) {
      const complicationsSection = renderComplicationsSection({
        character, labels, worksheet,
      });
      if (complicationsSection) {
        sections.push(complicationsSection);
      }
    }

    // Notes (optional based on customization)
    if (worksheet || customization.includeNotes) {
      const notesSection = renderNotesSection({
        character, labels, worksheet,
      });
      if (notesSection) {
        sections.push(notesSection);
      }
    }

    // Combine sections
    const bodyContent = sections.filter(s => s.trim().length > 0).join('\n\n');

    // Generate full HTML
    const html = generateHTMLDocument(bodyContent, includeStyles, customization, character.header.name, language);

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
  characterName: string,
  language: string
): string {
  const styles = includeStyles ? getPDFStyles(customization) : '';
  
  return `<!DOCTYPE html>
<html lang="${pdfLanguage(language)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(characterName)} - M&amp;M 3e</title>
  ${styles ? `<style>${styles}</style>` : ''}
</head>
<body>
  <div class="pdf-container" data-character-name="${escapeHtml(characterName)}" data-pdf-font="${resolvePDFFont(customization.fontFamily)}" data-page-label="${createPDFLabels(language)('Page')}" data-continuation-label="${createPDFLabels(language)('continued')}">
    ${bodyContent}
  </div>
</body>
</html>`;
}

