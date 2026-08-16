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
import {
  calculateAbilitiesCost,
  calculateDefensesCost,
  calculateSkillsCost,
  calculateAdvantagesCost,
  calcPowerTotalCost,
} from '../../shared/lib/mathEngine';
import { buildOffenseSummary } from '../../shared/lib/offenseSummary';
import type { PDFCustomizationOptions, ColorScheme, LayoutMode, FontFamily, FontSize } from './types';
import { DEFAULT_CUSTOMIZATION, COLOR_THEMES, SPACING_SCALES, FONT_SIZE_SCALES } from './types';

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
    if (customization.includeComplications) {
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
    const html = generateHTMLDocument(bodyContent, includeStyles, customization);

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
  customization: PDFCustomizationOptions
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
  <div class="pdf-container">
    ${bodyContent}
  </div>
</body>
</html>`;
}

/**
 * Get PDF stylesheet with customization applied
 */
function getPDFStyles(customization: PDFCustomizationOptions): string {
  // Import styles and apply customization
  const baseStyles = getBaseStyles();
  
  // Apply customizations
  let styles = applyColorTheme(baseStyles, customization.colorScheme);
  styles = applyLayoutMode(styles, customization.layoutMode);
  styles = applyFontFamily(styles, customization.fontFamily);
  styles = applyFontSize(styles, customization.fontSize);
  
  return styles;
}
/**
 * Get base PDF stylesheet
 */
function getBaseStyles(): string {
  return `
/* ================================================
   CSS Variables - Design System Theme
   ================================================ */
:root {
  /* Color Palette - Conservative Professional Theme */
  --color-primary: #2c5aa0;
  --color-primary-light: #4a7bc8;
  --color-primary-dark: #1e3a70;
  --color-secondary: #5a6c7d;
  --color-accent: #6b7a8c;
  
  /* Semantic Colors */
  --color-success: #2d7a3e;
  --color-warning: #d97706;
  --color-danger: #b91c1c;
  --color-info: #0369a1;
  
  /* Neutrals */
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  --color-text-muted: #9ca3af;
  --color-border: #d1d5db;
  --color-border-light: #e5e7eb;
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-bg-tertiary: #f3f4f6;
  --color-bg-accent: #e8edf4;
  
  /* Typography Scale */
  --font-family-base: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --font-size-xs: 7pt;
  --font-size-sm: 8pt;
  --font-size-base: 10pt;
  --font-size-md: 11pt;
  --font-size-lg: 12pt;
  --font-size-xl: 14pt;
  --font-size-2xl: 16pt;
  --font-size-3xl: 20pt;
  --line-height-tight: 1.2;
  --line-height-base: 1.4;
  --line-height-relaxed: 1.6;
  
  /* Spacing Scale (using inches for print) */
  --space-xs: 0.03in;
  --space-sm: 0.05in;
  --space-md: 0.08in;
  --space-lg: 0.1in;
  --space-xl: 0.15in;
  --space-2xl: 0.2in;
  --space-3xl: 0.3in;
  
  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 3px;
  --radius-lg: 4px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  /* Layout */
  --page-width: 8.5in;
  --page-padding: 0.5in;
}

/* Base reset and typography */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--color-text);
  background: var(--color-bg-primary);
}

/* ================================================
   Layout & Container
   ================================================ */
.pdf-container {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 0.3in;
}

@media print {
  .page-break { page-break-after: always; }
  .pdf-section { page-break-inside: avoid; }
}

/* ================================================
   Typography Utilities
   ================================================ */
.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-md { font-size: var(--font-size-md); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }
.text-2xl { font-size: var(--font-size-2xl); }
.text-3xl { font-size: var(--font-size-3xl); }
.text-bold { font-weight: 700; }
.text-semibold { font-weight: 600; }
.text-medium { font-weight: 500; }
.text-muted { color: var(--color-text-muted); font-style: italic; }
.text-light { color: var(--color-text-light); }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-left { text-align: left; }
.text-uppercase { text-transform: uppercase; letter-spacing: 0.5px; }

/* ================================================
   Card System
   ================================================ */
.card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--space-md);
  margin-bottom: var(--space-lg);
}

.card-header {
  background: var(--color-bg-accent);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-md);
  margin: calc(-1 * var(--space-md)) calc(-1 * var(--space-md)) var(--space-md);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  font-weight: 600;
}

.card-body {
  padding: var(--space-md);
}

/* ================================================
   Section Styles
   ================================================ */
.pdf-section { 
  margin-bottom: var(--space-2xl);
}

.pdf-section-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary-dark);
  border-bottom: 2px solid var(--color-primary);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-cost {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-secondary);
  background: var(--color-bg-secondary);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
  text-transform: none;
  letter-spacing: normal;
}

.pdf-subsection { 
  margin-bottom: var(--space-xl);
}

.pdf-subsection-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-xs);
  border-bottom: 1px solid var(--color-border-light);
}

/* ================================================
   Header Section
   ================================================ */
.header-section {
  margin-bottom: var(--space-2xl);
}

.header-main {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  padding: var(--space-xl);
  border: 2px solid var(--color-primary-dark);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-xl);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.character-name {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-md);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.header-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.stat-box {
  background: var(--color-bg-primary);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.stat-box.highlight-box {
  border-color: var(--color-danger);
  background: var(--color-bg-secondary);
}

.stat-box.success-box {
  border-color: var(--color-success);
  background: var(--color-bg-secondary);
}

.stat-box-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-xs);
}

.stat-box-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary-dark);
}

.header-field {
  margin-bottom: var(--space-sm);
  color: var(--color-bg-primary);
}

.header-field-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.header-field-value {
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-left: var(--space-sm);
}

.physical-description {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

.description-field {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
}

.description-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-xs);
}

.description-value {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
}

/* ================================================
   Abilities Section
   ================================================ */
.abilities-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.ability-box {
  background: var(--color-bg-primary);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  text-align: center;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.ability-box.absent {
  border-color: var(--color-border);
  background: var(--color-bg-tertiary);
  opacity: 0.6;
}

.ability-name {
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-xs);
}

.ability-value {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary-dark);
  margin: var(--space-sm) 0;
  line-height: 1;
}

.ability-bonus {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-light);
  margin-top: var(--space-xs);
}

/* ================================================
   Defenses Section
   ================================================ */
.defenses-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.defense-box {
  background: var(--color-bg-primary);
  border: 2px solid var(--color-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  text-align: center;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.defense-name {
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-xs);
}

.defense-value {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary-dark);
  margin: var(--space-sm) 0;
  line-height: 1;
}

.defense-breakdown {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin-top: var(--space-xs);
}

/* ================================================
   Offense Section (Table)
   ================================================ */
.offense-container {
  width: 100%;
  margin-top: var(--space-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.offense-table {
  display: grid;
  grid-template-columns: 25% 10% 15% 25% 25%;
  background: var(--color-bg-primary);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.offense-table .offense-col {
  padding: var(--space-md);
  border-right: 1px solid var(--color-border-light);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
  word-wrap: break-word;
  overflow-wrap: break-word;
  display: flex;
  align-items: flex-start;
}

.offense-table .offense-col:nth-child(5n) {
  border-right: none;
}

.offense-table .offense-header-col {
  background: var(--color-bg-primary);
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.offense-table .offense-col:nth-child(n+6):nth-child(10n+6),
.offense-table .offense-col:nth-child(n+6):nth-child(10n+7),
.offense-table .offense-col:nth-child(n+6):nth-child(10n+8),
.offense-table .offense-col:nth-child(n+6):nth-child(10n+9),
.offense-table .offense-col:nth-child(n+6):nth-child(10n+10) {
  background: var(--color-bg-secondary);
}

.offense-col-attack {
  font-weight: 600;
  color: var(--color-text);
}

.offense-col-bonus,
.offense-col-range {
  text-align: center;
  justify-content: center;
  font-weight: 600;
}

.offense-col-notes {
  color: var(--color-text-secondary);
  font-size: calc(var(--font-size-sm) * 0.95);
}

/* ================================================
   Skills Section
   ================================================ */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm) var(--space-xl);
  margin-bottom: var(--space-md);
}

.skill-entry {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-secondary);
  border-left: 3px solid var(--color-primary);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-xs);
}

.skill-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  flex: 1;
  color: var(--color-text);
}

.skill-ranks {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin: 0 var(--space-md);
}

.skill-total {
  font-size: var(--font-size-base);
  font-weight: 700;
  min-width: 0.3in;
  text-align: right;
  color: var(--color-primary-dark);
}

/* ================================================
   Advantages Section
   ================================================ */
.advantages-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm) var(--space-xl);
  margin-bottom: var(--space-md);
}

.advantage-entry {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-secondary);
  border-left: 3px solid var(--color-accent);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-xs);
}

.advantage-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  flex: 1;
  color: var(--color-text);
}

.advantage-rank {
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--color-text-light);
  margin-left: var(--space-md);
}

/* ================================================
   Powers Section
   ================================================ */
.powers-list {
  margin-top: var(--space-lg);
}

.power-entry {
  margin-bottom: var(--space-xl);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-primary);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.power-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-border-light);
}

.power-name {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--color-text);
  flex: 1;
}

.power-cost {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--color-primary);
  margin-left: var(--space-lg);
  background: var(--color-bg-accent);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-sm);
}

.power-effects {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  margin-bottom: var(--space-sm);
  line-height: var(--line-height-relaxed);
}

.power-modifiers {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  font-style: italic;
  margin-bottom: var(--space-sm);
  padding-left: var(--space-md);
}

.power-descriptors {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin-top: var(--space-sm);
}

.power-description {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin-top: var(--space-md);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--color-border-light);
  line-height: var(--line-height-relaxed);
}

/* ================================================
   Equipment Section
   ================================================ */
.equipment-list {
  margin-top: var(--space-lg);
}

.equipment-entry {
  margin-bottom: var(--space-xl);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ================================================
   Complications Section
   ================================================ */
.complications-list {
  margin-top: var(--space-lg);
}

.complication-item {
  margin-bottom: var(--space-md);
  padding: var(--space-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-warning);
  border-radius: var(--radius-sm);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.complication-name {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  line-height: var(--line-height-relaxed);
}

/* ================================================
   Notes Section
   ================================================ */
.notes-section {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  white-space: pre-wrap;
  padding: var(--space-lg);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  margin-top: var(--space-lg);
  color: var(--color-text);
}

/* ================================================
   Power Point Summary Section
   ================================================ */
.pp-summary-compact {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-lg);
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-md);
}

.pp-breakdown {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.pp-breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm);
  background: var(--color-bg-primary);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-primary-light);
}

.pp-breakdown-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
}

.pp-breakdown-value {
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--color-primary-dark);
}

.pp-summary-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--color-bg-primary);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
}

.pp-summary-box.over-budget {
  border-color: var(--color-danger);
  background: var(--color-bg-secondary);
}

.pp-summary-box.under-budget {
  border-color: var(--color-success);
  background: var(--color-bg-secondary);
}

.pp-summary-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-xs);
}

.pp-summary-value {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.pp-summary-value.positive {
  color: var(--color-success);
}

.pp-summary-value.negative {
  color: var(--color-danger);
}

.pp-summary-fraction {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-top: var(--space-sm);
}

.pp-warning {
  text-align: center;
  font-weight: 700;
  color: var(--color-danger);
  margin-top: var(--space-md);
  font-size: var(--font-size-sm);
}

/* Legacy PP Totals (deprecated - use compact version) */
.pp-totals {
  margin-top: var(--space-lg);
  padding: var(--space-lg);
  border: 2px solid var(--color-primary-dark);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.pp-totals-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-sm) var(--space-xl);
  align-items: baseline;
}

.pp-label {
  font-size: var(--font-size-sm);
  text-align: right;
  color: var(--color-text);
}

.pp-value {
  font-size: var(--font-size-base);
  font-weight: 700;
  text-align: left;
  color: var(--color-text);
}

.pp-total-row {
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--color-border);
}

/* ================================================
   Badge System
   ================================================ */
.badge {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
  border-radius: var(--radius-sm);
  background: var(--color-bg-accent);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.badge-primary {
  background: var(--color-primary-light);
  color: var(--color-bg-primary);
  border-color: var(--color-primary);
}

.badge-success {
  background: var(--color-success);
  color: var(--color-bg-primary);
  border-color: var(--color-success);
}

.badge-warning {
  background: var(--color-warning);
  color: var(--color-bg-primary);
  border-color: var(--color-warning);
}

.badge-danger {
  background: var(--color-danger);
  color: var(--color-bg-primary);
  border-color: var(--color-danger);
}

/* ================================================
   Cost Display
   ================================================ */
.cost-summary {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
  font-weight: 600;
  color: var(--color-text);
}

/* ================================================
   Print Optimizations
   ================================================ */
@media print {
  body { 
    font-size: var(--font-size-sm);
  }
  
  .pdf-container { 
    padding: 0.2in;
    max-width: 100%;
  }
  
  .no-print { 
    display: none !important;
  }
  
  /* Adjust colors for better print */
  .header-main {
    background: var(--color-primary-dark);
    color: var(--color-bg-primary);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .stat-box,
  .ability-box,
  .defense-box,
  .power-entry,
  .equipment-entry {
    box-shadow: none;
    border-width: 1px;
  }
  
  .offense-table thead {
    background: var(--color-primary-dark);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  /* Ensure borders are visible in B&W */
  .card,
  .stat-box,
  .ability-box,
  .defense-box {
    border: 1.5px solid var(--color-border);
  }
  
  /* Reduce spacing for print */
  .pdf-section {
    margin-bottom: var(--space-xl);
  }
  
  .header-stats {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-sm);
  }
  
  /* Page breaks */
  .page-break { 
    page-break-after: always;
  }
  
  .pdf-section { 
    page-break-inside: avoid;
  }
  
  .power-entry,
  .equipment-entry {
    page-break-inside: avoid;
  }
}

/* ================================================
   A4 Layout Optimization
   ================================================ */
@page {
  size: A4;
  margin: 0.3in;
}

@media screen {
  /* Screen-only enhancements */
  .offense-table tbody tr:hover {
    background: var(--color-bg-accent);
  }
  
  .skill-entry:hover,
  .advantage-entry:hover {
    background: var(--color-bg-accent);
  }
}
  `;
}

/**
 * Apply color theme to stylesheet
 */
function applyColorTheme(styles: string, colorScheme: ColorScheme): string {
  const theme = COLOR_THEMES[colorScheme];
  
  return styles
    .replace(/--color-primary:\s*#[0-9a-fA-F]{6};/g, `--color-primary: ${theme.primary};`)
    .replace(/--color-primary-light:\s*#[0-9a-fA-F]{6};/g, `--color-primary-light: ${theme.primaryLight};`)
    .replace(/--color-primary-dark:\s*#[0-9a-fA-F]{6};/g, `--color-primary-dark: ${theme.primaryDark};`)
    .replace(/--color-secondary:\s*#[0-9a-fA-F]{6};/g, `--color-secondary: ${theme.secondary};`)
    .replace(/--color-accent:\s*#[0-9a-fA-F]{6};/g, `--color-accent: ${theme.accent};`);
}

/**
 * Apply layout mode (spacing) to stylesheet
 */
function applyLayoutMode(styles: string, layoutMode: LayoutMode): string {
  const spacing = SPACING_SCALES[layoutMode];
  
  return styles
    .replace(/--space-xs:\s*[\d.]+in;/g, `--space-xs: ${spacing.xs}in;`)
    .replace(/--space-sm:\s*[\d.]+in;/g, `--space-sm: ${spacing.sm}in;`)
    .replace(/--space-md:\s*[\d.]+in;/g, `--space-md: ${spacing.md}in;`)
    .replace(/--space-lg:\s*[\d.]+in;/g, `--space-lg: ${spacing.lg}in;`)
    .replace(/--space-xl:\s*[\d.]+in;/g, `--space-xl: ${spacing.xl}in;`)
    .replace(/--space-2xl:\s*[\d.]+in;/g, `--space-2xl: ${spacing['2xl']}in;`)
    .replace(/--space-3xl:\s*[\d.]+in;/g, `--space-3xl: ${spacing['3xl']}in;`)
    .replace(/--page-padding:\s*[\d.]+in;/g, `--page-padding: ${spacing.pagePadding}in;`);
}

/**
 * Apply font family to stylesheet
 */
function applyFontFamily(styles: string, fontFamily: FontFamily): string {
  const fontStack = fontFamily === 'Segoe UI' 
    ? "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    : fontFamily === 'Arial'
    ? "Arial, Helvetica, sans-serif"
    : fontFamily === 'Times New Roman'
    ? "'Times New Roman', Times, serif"
    : "Georgia, 'Times New Roman', serif";
  
  return styles.replace(/--font-family-base:\s*[^;]+;/g, `--font-family-base: ${fontStack};`);
}

/**
 * Apply font size scale to stylesheet
 */
function applyFontSize(styles: string, fontSize: FontSize): string {
  const scale = FONT_SIZE_SCALES[fontSize];
  
  return styles
    .replace(/--font-size-xs:\s*[\d.]+pt;/g, `--font-size-xs: ${scale.xs}pt;`)
    .replace(/--font-size-sm:\s*[\d.]+pt;/g, `--font-size-sm: ${scale.sm}pt;`)
    .replace(/--font-size-base:\s*[\d.]+pt;/g, `--font-size-base: ${scale.base}pt;`)
    .replace(/--font-size-md:\s*[\d.]+pt;/g, `--font-size-md: ${scale.md}pt;`)
    .replace(/--font-size-lg:\s*[\d.]+pt;/g, `--font-size-lg: ${scale.lg}pt;`)
    .replace(/--font-size-xl:\s*[\d.]+pt;/g, `--font-size-xl: ${scale.xl}pt;`)
    .replace(/--font-size-2xl:\s*[\d.]+pt;/g, `--font-size-2xl: ${scale['2xl']}pt;`)
    .replace(/--font-size-3xl:\s*[\d.]+pt;/g, `--font-size-3xl: ${scale['3xl']}pt;`);
}
