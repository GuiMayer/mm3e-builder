/**
 * Power Modifiers Audit Script
 * 
 * Compares power-specific modifiers in powers.json against the official
 * Mutants & Masterminds 3e Hero's Handbook to identify gaps and coverage.
 * 
 * Usage: npx tsx scripts/auditPowerModifiers.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PowerModifier {
  id: string;
  name: string;
  category: 'extra' | 'flaw';
  costType: string;
  costValue: number;
  description: string;
}

interface Power {
  id: string;
  name: string;
  baseCost: number;
  extras: PowerModifier[];
  flaws: PowerModifier[];
}

interface HandbookReference {
  power: string;
  extras: string[];
  flaws: string[];
  pageReference: string;
  notes?: string;
}

// Official M&M 3e Hero's Handbook power-specific modifiers
// Extracted from docs/sources/Mutants & Masterminds 3 - Powers.md
const HANDBOOK_REFERENCES: HandbookReference[] = [
  {
    power: 'affliction',
    extras: ['Alternate Resistance', 'Concentration', 'Cumulative', 'Extra Condition', 'Progressive'],
    flaws: ['Instant Recovery', 'Limited Degree'],
    pageReference: 'p.3-36 (lines 3-180)',
  },
  {
    power: 'burrowing',
    extras: ['Penetrating', 'Ranged'],
    flaws: ['Limited'],
    pageReference: 'p.181-216',
  },
  {
    power: 'communication',
    extras: ['Area', 'Dimensional', 'Rapid', 'Selective', 'Subtle'],
    flaws: ['Limited', 'Sense-Dependent'],
    pageReference: 'p.218-333',
  },
  {
    power: 'create',
    extras: ['Continuous', 'Impervious', 'Innate', 'Movable', 'Precise', 'Selective', 'Stationary', 'Subtle', 'Tether'],
    flaws: ['Feedback', 'Permanent', 'Proportional'],
    pageReference: 'p.494-620',
  },
  {
    power: 'damage',
    extras: [],
    flaws: [],
    pageReference: 'p.649-806',
    notes: 'No power-specific modifiers in handbook',
  },
  {
    power: 'flight',
    extras: ['Aquatic', 'Continuous', 'Subtle'],
    flaws: ['Concentration', 'Distracting', 'Gliding', 'Levitation', 'Platform', 'Wings'],
    pageReference: 'p.1161-1255 (lines 1160-1259)',
  },
  {
    power: 'healing',
    extras: ['Action', 'Affects Objects', 'Area', 'Energizing', 'Perception', 'Persistent', 'Ranged', 'Restorative', 'Resurrection', 'Selective', 'Stabilize'],
    flaws: ['Empathic', 'Limited', 'Temporary'],
    pageReference: 'p.1286-1378 (lines 1285-1384)',
  },
  {
    power: 'illusion',
    extras: ['Believable', 'Independent', 'Selective'],
    flaws: ['Feedback', 'Limited to One Subject', 'Phantasm', 'Ranged', 'Resistible'],
    pageReference: 'p.1379-1522',
  },
  {
    power: 'insubstantial',
    extras: ['Affects Corporeal', 'Affects Others', 'Attack', 'Continuous', 'Innate', 'Precise', 'Progressive', 'Reaction', 'Subtle'],
    flaws: ['Absent Strength', 'Permanent'],
    pageReference: 'p.1523-1650',
    notes: 'Currently has empty arrays in powers.json',
  },
  {
    power: 'enhanced_trait',
    extras: ['Limited'],
    flaws: ['Limited', 'Permanent', 'Reduced Trait'],
    pageReference: 'p.900-1000',
    notes: 'Currently has empty arrays in powers.json',
  },
  {
    power: 'extra_limbs',
    extras: ['Continuous', 'Projection', 'Sustained'],
    flaws: ['Distracting'],
    pageReference: 'p.1100-1159',
    notes: 'Currently has empty arrays in powers.json',
  },
  {
    power: 'growth',
    extras: ['Permanent'],
    flaws: [],
    pageReference: 'p.1256-1285',
    notes: 'Currently has empty arrays in powers.json',
  },
];

interface AuditResult {
  power: string;
  powerName: string;
  status: 'complete' | 'partial' | 'empty' | 'not_found';
  currentExtras: string[];
  currentFlaws: string[];
  handbookExtras: string[];
  handbookFlaws: string[];
  missingExtras: string[];
  missingFlaws: string[];
  extraExtras: string[]; // In JSON but not in handbook
  extraFlaws: string[];
  coverage: number; // 0-100%
  priority: 'high' | 'medium' | 'low';
  pageReference: string;
  notes?: string;
}

function loadPowers(): Power[] {
  const powersPath = path.join(__dirname, '../src/data/powers.json');
  const content = fs.readFileSync(powersPath, 'utf-8');
  return JSON.parse(content);
}

function normalizeId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

function determinePriority(missingCount: number): 'high' | 'medium' | 'low' {
  if (missingCount >= 6) return 'high';
  if (missingCount >= 3) return 'medium';
  return 'low';
}

function auditPowers(): AuditResult[] {
  const powers = loadPowers();
  const results: AuditResult[] = [];

  for (const ref of HANDBOOK_REFERENCES) {
    const power = powers.find(p => p.id === ref.power);
    
    if (!power) {
      results.push({
        power: ref.power,
        powerName: ref.power,
        status: 'not_found',
        currentExtras: [],
        currentFlaws: [],
        handbookExtras: ref.extras,
        handbookFlaws: ref.flaws,
        missingExtras: ref.extras,
        missingFlaws: ref.flaws,
        extraExtras: [],
        extraFlaws: [],
        coverage: 0,
        priority: 'high',
        pageReference: ref.pageReference,
        notes: ref.notes,
      });
      continue;
    }

    const currentExtras = power.extras.map(e => e.name);
    const currentFlaws = power.flaws.map(f => f.name);

    const missingExtras = ref.extras.filter(h => 
      !currentExtras.some(c => normalizeId(c) === normalizeId(h))
    );
    const missingFlaws = ref.flaws.filter(h => 
      !currentFlaws.some(c => normalizeId(c) === normalizeId(h))
    );

    const extraExtras = currentExtras.filter(c => 
      !ref.extras.some(h => normalizeId(c) === normalizeId(h))
    );
    const extraFlaws = currentFlaws.filter(c => 
      !ref.flaws.some(h => normalizeId(c) === normalizeId(h))
    );

    const totalHandbook = ref.extras.length + ref.flaws.length;
    const totalMissing = missingExtras.length + missingFlaws.length;
    const coverage = totalHandbook === 0 ? 100 : Math.round(((totalHandbook - totalMissing) / totalHandbook) * 100);

    let status: 'complete' | 'partial' | 'empty';
    if (currentExtras.length === 0 && currentFlaws.length === 0) {
      status = 'empty';
    } else if (totalMissing === 0) {
      status = 'complete';
    } else {
      status = 'partial';
    }

    results.push({
      power: power.id,
      powerName: power.name,
      status,
      currentExtras,
      currentFlaws,
      handbookExtras: ref.extras,
      handbookFlaws: ref.flaws,
      missingExtras,
      missingFlaws,
      extraExtras,
      extraFlaws,
      coverage,
      priority: determinePriority(totalMissing),
      pageReference: ref.pageReference,
      notes: ref.notes,
    });
  }

  return results.sort((a, b) => {
    // Sort by priority (high first), then by missing count
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    const aMissing = a.missingExtras.length + a.missingFlaws.length;
    const bMissing = b.missingExtras.length + b.missingFlaws.length;
    return bMissing - aMissing;
  });
}

function generateMarkdownReport(results: AuditResult[]): string {
  const totalPowers = results.length;
  const completePowers = results.filter(r => r.status === 'complete').length;
  const partialPowers = results.filter(r => r.status === 'partial').length;
  const emptyPowers = results.filter(r => r.status === 'empty').length;
  const avgCoverage = Math.round(results.reduce((sum, r) => sum + r.coverage, 0) / totalPowers);

  const highPriority = results.filter(r => r.priority === 'high');
  const mediumPriority = results.filter(r => r.priority === 'medium');
  const lowPriority = results.filter(r => r.priority === 'low');

  let md = `# Power-Specific Modifiers Audit Report\n\n`;
  md += `**Generated:** ${new Date().toISOString()}\n\n`;
  md += `## Executive Summary\n\n`;
  md += `- **Total Powers Audited:** ${totalPowers}\n`;
  md += `- **Complete:** ${completePowers} (${Math.round(completePowers/totalPowers*100)}%)\n`;
  md += `- **Partial:** ${partialPowers} (${Math.round(partialPowers/totalPowers*100)}%)\n`;
  md += `- **Empty:** ${emptyPowers} (${Math.round(emptyPowers/totalPowers*100)}%)\n`;
  md += `- **Average Coverage:** ${avgCoverage}%\n\n`;

  md += `### Priority Breakdown\n\n`;
  md += `- **High Priority:** ${highPriority.length} powers (${highPriority.reduce((sum, r) => sum + r.missingExtras.length + r.missingFlaws.length, 0)} missing modifiers)\n`;
  md += `- **Medium Priority:** ${mediumPriority.length} powers (${mediumPriority.reduce((sum, r) => sum + r.missingExtras.length + r.missingFlaws.length, 0)} missing modifiers)\n`;
  md += `- **Low Priority:** ${lowPriority.length} powers (${lowPriority.reduce((sum, r) => sum + r.missingExtras.length + r.missingFlaws.length, 0)} missing modifiers)\n\n`;

  md += `---\n\n`;

  // High Priority Section
  if (highPriority.length > 0) {
    md += `## 🔴 High Priority Powers (6+ Missing Modifiers)\n\n`;
    for (const result of highPriority) {
      md += generatePowerSection(result);
    }
  }

  // Medium Priority Section
  if (mediumPriority.length > 0) {
    md += `## 🟡 Medium Priority Powers (3-5 Missing Modifiers)\n\n`;
    for (const result of mediumPriority) {
      md += generatePowerSection(result);
    }
  }

  // Low Priority Section
  if (lowPriority.length > 0) {
    md += `## 🟢 Low Priority Powers (<3 Missing Modifiers)\n\n`;
    for (const result of lowPriority) {
      md += generatePowerSection(result);
    }
  }

  // Complete Powers Section
  const complete = results.filter(r => r.status === 'complete');
  if (complete.length > 0) {
    md += `## ✅ Complete Powers\n\n`;
    for (const result of complete) {
      md += `### ${result.powerName}\n`;
      md += `- **Coverage:** 100%\n`;
      md += `- **Reference:** ${result.pageReference}\n`;
      md += `- **Extras:** ${result.currentExtras.join(', ') || 'None'}\n`;
      md += `- **Flaws:** ${result.currentFlaws.join(', ') || 'None'}\n\n`;
    }
  }

  return md;
}

function generatePowerSection(result: AuditResult): string {
  let section = `### ${result.powerName}\n\n`;
  section += `- **Status:** ${result.status.toUpperCase()}\n`;
  section += `- **Coverage:** ${result.coverage}%\n`;
  section += `- **Reference:** ${result.pageReference}\n`;
  
  if (result.notes) {
    section += `- **Notes:** ${result.notes}\n`;
  }

  const totalMissing = result.missingExtras.length + result.missingFlaws.length;
  section += `- **Missing:** ${totalMissing} modifiers\n\n`;

  if (result.missingExtras.length > 0) {
    section += `**Missing Extras (${result.missingExtras.length}):**\n`;
    for (const extra of result.missingExtras) {
      section += `- [ ] ${extra}\n`;
    }
    section += `\n`;
  }

  if (result.missingFlaws.length > 0) {
    section += `**Missing Flaws (${result.missingFlaws.length}):**\n`;
    for (const flaw of result.missingFlaws) {
      section += `- [ ] ${flaw}\n`;
    }
    section += `\n`;
  }

  if (result.currentExtras.length > 0) {
    section += `**Current Extras:** ${result.currentExtras.join(', ')}\n\n`;
  }

  if (result.currentFlaws.length > 0) {
    section += `**Current Flaws:** ${result.currentFlaws.join(', ')}\n\n`;
  }

  if (result.extraExtras.length > 0 || result.extraFlaws.length > 0) {
    section += `**⚠️ Extra modifiers not in handbook:**\n`;
    if (result.extraExtras.length > 0) {
      section += `- Extras: ${result.extraExtras.join(', ')}\n`;
    }
    if (result.extraFlaws.length > 0) {
      section += `- Flaws: ${result.extraFlaws.join(', ')}\n`;
    }
    section += `\n`;
  }

  section += `---\n\n`;
  return section;
}

function generateJSONReport(results: AuditResult[]): string {
  return JSON.stringify({
    generated: new Date().toISOString(),
    summary: {
      totalPowers: results.length,
      complete: results.filter(r => r.status === 'complete').length,
      partial: results.filter(r => r.status === 'partial').length,
      empty: results.filter(r => r.status === 'empty').length,
      averageCoverage: Math.round(results.reduce((sum, r) => sum + r.coverage, 0) / results.length),
    },
    powers: results,
  }, null, 2);
}

// Main execution
console.log('🔍 Auditing power-specific modifiers...\n');

const results = auditPowers();

// Generate reports
const docsDir = path.join(__dirname, '../docs/testing');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const mdReport = generateMarkdownReport(results);
const mdPath = path.join(docsDir, 'power-modifiers-audit.md');
fs.writeFileSync(mdPath, mdReport);
console.log(`✅ Markdown report: ${mdPath}`);

const jsonReport = generateJSONReport(results);
const jsonPath = path.join(docsDir, 'power-modifiers-audit.json');
fs.writeFileSync(jsonPath, jsonReport);
console.log(`✅ JSON report: ${jsonPath}`);

// Console summary
console.log('\n📊 Summary:');
console.log(`- Total Powers: ${results.length}`);
console.log(`- Complete: ${results.filter(r => r.status === 'complete').length}`);
console.log(`- Partial: ${results.filter(r => r.status === 'partial').length}`);
console.log(`- Empty: ${results.filter(r => r.status === 'empty').length}`);
console.log(`- Average Coverage: ${Math.round(results.reduce((sum, r) => sum + r.coverage, 0) / results.length)}%`);

const highPriority = results.filter(r => r.priority === 'high');
if (highPriority.length > 0) {
  console.log('\n🔴 High Priority Powers:');
  for (const p of highPriority) {
    const missing = p.missingExtras.length + p.missingFlaws.length;
    console.log(`  - ${p.powerName}: ${missing} missing (${p.coverage}% coverage)`);
  }
}

console.log('\n✨ Audit complete!');
