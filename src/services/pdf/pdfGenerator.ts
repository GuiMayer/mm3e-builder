/* ================================================
   PDF Generator Service
   Orchestrates all PDF components and generates HTML
   ================================================ */

import type { ICharacter, IPowerEffect, IModifierDef, ISkillDef, IAdvantageDef } from '../../entities/types';
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
  renderPowerPointTotalsSection,
} from './components';
import {
  calculateAbilitiesCost,
  calculateDefensesCost,
  calculateSkillsCost,
  calculateAdvantagesCost,
  calcPowerTotalCost,
} from '../../shared/lib/mathEngine';
import { buildOffenseSummary } from '../../shared/lib/offenseSummary';

export interface PDFGeneratorOptions {
  character: ICharacter;
  powerDefs: IPowerEffect[];
  modifierDefs: IModifierDef[];
  skillDefs: Record<string, ISkillDef>;
  advantageDefs: Record<string, IAdvantageDef>;
  includeStyles?: boolean;  // Whether to include inline styles
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
    } = options;

    // Calculate costs
    const abilitiesCost = calculateAbilitiesCost(character.abilities, character.absentAbilities);
    const defensesCost = calculateDefensesCost(character.defenses);
    
    // Calculate total skill ranks
    const totalSkillRanks = character.skills.reduce((sum, skill) => sum + skill.ranks, 0);
    const skillsCost = calculateSkillsCost(totalSkillRanks);
    
    // Calculate advantages cost
    const advantagesCost = calculateAdvantagesCost(
      character.advantages.map(adv => ({ ranks: adv.ranks || 1 }))
    );
    
    // Calculate powers cost
    const powersCost = character.powers.reduce(
      (sum, power) => sum + calcPowerTotalCost(power, powerDefs, modifierDefs),
      0
    );
    
    const totalSpent = abilitiesCost + defensesCost + skillsCost + advantagesCost + powersCost;
    const totalAvailable = character.header.powerLevel * 15;
    const remaining = totalAvailable - totalSpent;

    // Calculate additional values needed for rendering
    const staValue = character.absentAbilities.includes('sta') ? 0 : character.abilities.sta;
    const aweValue = character.absentAbilities.includes('awe') ? 0 : character.abilities.awe;
    const toughnessTotal = staValue; // Toughness is based on Stamina
    const initiativeTotal = aweValue;

    // Build offense entries
    const offenseEntries = buildOffenseSummary(
      character,
      powerDefs,
      Object.values(skillDefs),
      Object.values(advantageDefs),
      modifierDefs
    );

    // Generate sections
    const sections: string[] = [];

    // Header
    sections.push(renderHeaderSection({
      character,
      powerPointsData: {
        totalAvailable,
        totalSpent,
        remaining,
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

    // Skills
    sections.push(renderSkillsSection({
      character,
      skillDefs,
      skillsCost,
    }));

    // Advantages
    sections.push(renderAdvantagesSection({
      character,
      advantageDefs,
      advantagesCost,
    }));

    // Powers
    sections.push(renderPowersSection({
      character,
      powerDefs,
      modifierDefs,
      powersCost,
    }));

    // Equipment
    const equipmentSection = renderEquipmentSection({
      character,
      powerDefs,
      modifierDefs,
    });
    if (equipmentSection) {
      sections.push(equipmentSection);
    }

    // Complications
    const complicationsSection = renderComplicationsSection({
      character,
    });
    if (complicationsSection) {
      sections.push(complicationsSection);
    }

    // Notes
    const notesSection = renderNotesSection({
      character,
    });
    if (notesSection) {
      sections.push(notesSection);
    }

    // Power Point Totals
    sections.push(renderPowerPointTotalsSection({
      abilitiesCost,
      defensesCost,
      skillsCost,
      advantagesCost,
      powersCost,
      totalAvailable,
      totalSpent,
      remaining,
    }));

    // Combine sections
    const bodyContent = sections.filter(s => s.trim().length > 0).join('\n\n');

    // Generate full HTML
    const html = generateHTMLDocument(bodyContent, includeStyles);

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
function generateHTMLDocument(bodyContent: string, includeStyles: boolean): string {
  const styles = includeStyles ? getPDFStyles() : '';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>M&M 3e Character Sheet</title>
  ${styles ? `<style>${styles}</style>` : ''}
</head>
<body>
  <div class="pdf-container">
    ${bodyContent}
  </div>
</body>
</html>`;
}

/**
 * Get PDF stylesheet
 * Inline the styles from styles.css
 */
function getPDFStyles(): string {
  // Import styles - in production, you might want to use a bundler to inline this
  // For now, we'll embed the styles directly
  return `
/* Base reset and typography */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 10pt;
  line-height: 1.4;
  color: #333;
  background: #fff;
}

.pdf-container {
  max-width: 8.5in;
  margin: 0 auto;
  padding: 0.5in;
}

@media print {
  .page-break { page-break-after: always; }
  .pdf-section { page-break-inside: avoid; }
}

.pdf-section { margin-bottom: 0.2in; }
.pdf-section-title {
  font-size: 14pt;
  font-weight: bold;
  border-bottom: 2px solid #333;
  margin-bottom: 0.1in;
  padding-bottom: 0.05in;
}
.pdf-subsection { margin-bottom: 0.15in; }

/* Header section */
.header-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.1in; margin-bottom: 0.15in; }
.header-field { margin-bottom: 0.08in; }
.header-label { font-size: 8pt; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
.header-value { font-size: 11pt; font-weight: 600; }
.physical-description { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.1in; margin-top: 0.1in; }

/* Abilities section */
.abilities-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.1in; }
.ability-box { border: 1px solid #ccc; padding: 0.08in; text-align: center; }
.ability-name { font-size: 9pt; font-weight: bold; text-transform: uppercase; color: #555; }
.ability-score { font-size: 16pt; font-weight: bold; margin: 0.05in 0; }

/* Defenses section */
.defenses-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.1in; }
.defense-box { border: 1px solid #ccc; padding: 0.08in; text-align: center; }
.defense-name { font-size: 9pt; font-weight: bold; text-transform: uppercase; color: #555; }
.defense-total { font-size: 16pt; font-weight: bold; margin: 0.05in 0; }
.defense-breakdown { font-size: 8pt; color: #666; }

/* Offense section */
.offense-table { width: 100%; border-collapse: collapse; margin-top: 0.1in; }
.offense-table th { background: #f5f5f5; border: 1px solid #ccc; padding: 0.05in; font-size: 9pt; text-align: left; font-weight: bold; }
.offense-table td { border: 1px solid #ccc; padding: 0.05in; font-size: 9pt; }

/* Skills section */
.skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.05in 0.15in; }
.skill-entry { display: flex; justify-content: space-between; align-items: baseline; padding: 0.03in 0; border-bottom: 1px dotted #ddd; }
.skill-name { font-size: 9pt; flex: 1; }
.skill-ranks { font-size: 8pt; color: #666; margin: 0 0.1in; }
.skill-total { font-size: 10pt; font-weight: bold; min-width: 0.3in; text-align: right; }

/* Advantages section */
.advantages-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.05in 0.15in; }
.advantage-entry { display: flex; justify-content: space-between; align-items: baseline; padding: 0.03in 0; border-bottom: 1px dotted #ddd; }
.advantage-name { font-size: 9pt; flex: 1; }
.advantage-rank { font-size: 9pt; font-weight: bold; color: #666; margin-left: 0.1in; }

/* Powers section */
.powers-list { margin-top: 0.1in; }
.power-entry { margin-bottom: 0.12in; padding: 0.08in; border: 1px solid #ddd; border-radius: 3px; background: #fafafa; }
.power-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.05in; }
.power-name { font-size: 10pt; font-weight: bold; flex: 1; }
.power-cost { font-size: 10pt; font-weight: bold; color: #0066cc; margin-left: 0.1in; }
.power-effects { font-size: 9pt; margin-bottom: 0.03in; }
.power-modifiers { font-size: 8pt; color: #555; font-style: italic; margin-bottom: 0.03in; }
.power-description { font-size: 8pt; color: #666; margin-top: 0.05in; }

/* Equipment section */
.equipment-list { margin-top: 0.1in; }
.equipment-entry { margin-bottom: 0.12in; padding: 0.08in; border: 1px solid #ddd; border-radius: 3px; background: #f9f9f9; }

/* Complications section */
.complications-list { margin-top: 0.1in; }
.complication-item { margin-bottom: 0.08in; padding: 0.06in; border-left: 3px solid #cc6600; background: #fff9f0; }
.complication-name { font-size: 9pt; }

/* Notes section */
.notes-content { font-size: 9pt; line-height: 1.5; white-space: pre-wrap; padding: 0.1in; background: #f9f9f9; border: 1px solid #ddd; border-radius: 3px; margin-top: 0.1in; }

/* Power Point Totals */
.pp-totals { margin-top: 0.1in; padding: 0.1in; border: 2px solid #333; background: #f5f5f5; }
.pp-totals-grid { display: grid; grid-template-columns: auto 1fr; gap: 0.05in 0.15in; align-items: baseline; }
.pp-label { font-size: 9pt; text-align: right; }
.pp-value { font-size: 10pt; font-weight: bold; text-align: left; }
.pp-total-row { margin-top: 0.05in; padding-top: 0.05in; border-top: 1px solid #999; }

/* Utility classes */
.text-bold { font-weight: bold; }
.text-muted { color: #666; font-style: italic; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-small { font-size: 8pt; }

@media print {
  body { font-size: 9pt; }
  .pdf-container { padding: 0.3in; }
  .no-print { display: none; }
}
  `;
}
