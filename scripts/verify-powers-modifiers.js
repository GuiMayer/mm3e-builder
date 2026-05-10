#!/usr/bin/env node

/**
 * Powers Modifiers Verification Script
 * 
 * This script verifies the completeness of power modifiers in powers.json
 * by comparing against the source book.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load powers.json
const powersPath = join(__dirname, '../src/data/powers.json');
const powersData = JSON.parse(readFileSync(powersPath, 'utf-8'));

// Load source book
const bookPath = join(__dirname, '../docs/sources/Mutants & Masterminds 3 - Powers.md');
const bookContent = readFileSync(bookPath, 'utf-8');

/**
 * Extract power section from the book
 */
function extractPowerSection(powerName) {
  const lines = bookContent.split('\n');
  const sectionStart = lines.findIndex(line => 
    line.trim().toUpperCase() === `## ${powerName.toUpperCase()}`
  );
  
  if (sectionStart === -1) {
    return null;
  }
  
  // Find the end of this power section (next ## heading)
  let sectionEnd = sectionStart + 1;
  while (sectionEnd < lines.length && !lines[sectionEnd].match(/^## [A-Z]/)) {
    sectionEnd++;
  }
  
  return lines.slice(sectionStart, sectionEnd).join('\n');
}

/**
 * Count modifiers in a power section from the book
 */
function countModifiersInBook(section) {
  if (!section) return { extras: 0, flaws: 0 };
  
  const lines = section.split('\n');
  let inExtras = false;
  let inFlaws = false;
  let extrasCount = 0;
  let flawsCount = 0;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Check for section headers
    if (trimmed === '## EXTRAS') {
      inExtras = true;
      inFlaws = false;
      continue;
    }
    if (trimmed === '## FLAWS') {
      inFlaws = true;
      inExtras = false;
      continue;
    }
    
    // Stop counting when we hit another major section
    if (trimmed.startsWith('## ') && trimmed !== '## EXTRAS' && trimmed !== '## FLAWS') {
      inExtras = false;
      inFlaws = false;
    }
    
    // Count modifiers (they typically start with a name followed by a colon)
    if (inExtras && trimmed.match(/^[A-Z][a-zA-Z\s()]+:/)) {
      extrasCount++;
    }
    if (inFlaws && trimmed.match(/^[A-Z][a-zA-Z\s()]+:/)) {
      flawsCount++;
    }
  }
  
  return { extras: extrasCount, flaws: flawsCount };
}

/**
 * Count modifiers in powers.json
 */
function countModifiersInJSON(power) {
  const extras = power.extras?.length || 0;
  const flaws = power.flaws?.length || 0;
  return { extras, flaws };
}

/**
 * Main verification function
 */
function verifyPowers(powerNames = null) {
  const results = [];
  const powersToCheck = powerNames || powersData.map(p => p.name);
  
  for (const powerName of powersToCheck) {
    const power = powersData.find(p => p.name === powerName);
    if (!power) {
      results.push({
        name: powerName,
        status: 'NOT_FOUND_IN_JSON',
        jsonExtras: 0,
        jsonFlaws: 0,
        bookExtras: 0,
        bookFlaws: 0,
        missing: 0
      });
      continue;
    }
    
    const section = extractPowerSection(powerName);
    if (!section) {
      results.push({
        name: powerName,
        status: 'NOT_FOUND_IN_BOOK',
        jsonExtras: power.extras?.length || 0,
        jsonFlaws: power.flaws?.length || 0,
        bookExtras: 0,
        bookFlaws: 0,
        missing: 0
      });
      continue;
    }
    
    const jsonCounts = countModifiersInJSON(power);
    const bookCounts = countModifiersInBook(section);
    
    const totalJSON = jsonCounts.extras + jsonCounts.flaws;
    const totalBook = bookCounts.extras + bookCounts.flaws;
    const missing = totalBook - totalJSON;
    
    results.push({
      name: powerName,
      status: missing === 0 ? 'COMPLETE' : missing > 0 ? 'INCOMPLETE' : 'EXTRA_MODIFIERS',
      jsonExtras: jsonCounts.extras,
      jsonFlaws: jsonCounts.flaws,
      bookExtras: bookCounts.extras,
      bookFlaws: bookCounts.flaws,
      missing: missing
    });
  }
  
  return results;
}

/**
 * Generate report
 */
function generateReport(results) {
  console.log('\n=== POWERS MODIFIERS VERIFICATION REPORT ===\n');
  
  const complete = results.filter(r => r.status === 'COMPLETE');
  const incomplete = results.filter(r => r.status === 'INCOMPLETE');
  const notFoundInBook = results.filter(r => r.status === 'NOT_FOUND_IN_BOOK');
  const notFoundInJSON = results.filter(r => r.status === 'NOT_FOUND_IN_JSON');
  const extra = results.filter(r => r.status === 'EXTRA_MODIFIERS');
  
  console.log(`Total Powers Checked: ${results.length}`);
  console.log(`Complete: ${complete.length}`);
  console.log(`Incomplete: ${incomplete.length}`);
  console.log(`Not Found in Book: ${notFoundInBook.length}`);
  console.log(`Not Found in JSON: ${notFoundInJSON.length}`);
  console.log(`Extra Modifiers: ${extra.length}`);
  console.log('');
  
  if (incomplete.length > 0) {
    console.log('=== INCOMPLETE POWERS ===\n');
    incomplete.sort((a, b) => b.missing - a.missing);
    for (const result of incomplete) {
      console.log(`${result.name}:`);
      console.log(`  JSON: ${result.jsonExtras} extras, ${result.jsonFlaws} flaws (total: ${result.jsonExtras + result.jsonFlaws})`);
      console.log(`  Book: ${result.bookExtras} extras, ${result.bookFlaws} flaws (total: ${result.bookExtras + result.bookFlaws})`);
      console.log(`  Missing: ${result.missing} modifiers`);
      console.log('');
    }
  }
  
  if (complete.length > 0) {
    console.log('=== COMPLETE POWERS ===\n');
    for (const result of complete) {
      console.log(`${result.name}: ${result.jsonExtras} extras, ${result.jsonFlaws} flaws`);
    }
    console.log('');
  }
  
  if (notFoundInBook.length > 0) {
    console.log('=== NOT FOUND IN BOOK ===\n');
    for (const result of notFoundInBook) {
      console.log(`${result.name}`);
    }
    console.log('');
  }
}

// Run verification
const highPriorityPowers = [
  'Affliction',
  'Comprehend',
  'Concealment',
  'Create',
  'Damage',
  'Illusion',
  'Immortality',
  'Immunity',
  'Insubstantial',
  'Morph',
  'Movement',
  'Nullify'
];

console.log('Verifying high priority powers...');
const results = verifyPowers(highPriorityPowers);
generateReport(results);

// Export for use in other scripts
export { verifyPowers, generateReport };
