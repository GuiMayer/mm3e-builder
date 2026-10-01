import { englishPDFLabels, type PDFLabels } from '../pdfMessages';
/* ================================================
   Skills Section Component
   List of skills with ranks and total bonus
   ================================================ */

import type { AbilityKey, ICharacter } from '../../../entities/types';
import type { ISkillDef } from '../../../entities/types';
import { escapeHtml, formatBonus } from './utils';
import { getEffectiveAbilityRank } from '../../../shared/lib/abilityRanks';

export interface SkillsSectionData {
  labels?: PDFLabels;
  worksheet?: boolean;
  character: ICharacter;
  skillDefs: Record<string, ISkillDef>;
  skillsCost: number;
}

/**
 * Render the skills section
 */
export function renderSkillsSection(data: SkillsSectionData): string {
  const labels = data.labels ?? englishPDFLabels;
  const { character, skillDefs, skillsCost } = data;
  const { skills, abilities, absentAbilities } = character;

  // Filter skills with ranks > 0
  const activeSkills = data.worksheet ? [...skills, ...Object.values(skillDefs)
    .filter(def => !skills.some(skill => skill.skillId === def.id))
    .map(def => ({ skillId: def.id, ranks: 0, subtype: null }))] : skills.filter(skill => skill.ranks > 0);

  if (activeSkills.length === 0) {
    return `
      <div class="pdf-section">
        <div class="pdf-section-title">${labels('Skills')}</div>
        <p class="text-muted">${labels('No skills trained.')}</p>
      </div>
    `.trim();
  }

  // Sort skills alphabetically by skill definition name
  const sortedSkills = [...activeSkills].sort((a, b) => {
    const nameA = skillDefs[a.skillId]?.name || a.skillId;
    const nameB = skillDefs[b.skillId]?.name || b.skillId;
    return nameA.localeCompare(nameB);
  });

  const skillsHtml = sortedSkills
    .map(skill => renderSkillEntry(skill, skillDefs, abilities, absentAbilities, labels, !!data.worksheet, !skills.includes(skill)))
    .join('');
  
  const totalRanks = skills.reduce((sum, s) => sum + s.ranks, 0);

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">
        ${labels('Skills')}
        <span class="section-cost">${skillsCost} PP (${totalRanks} ${labels('ranks')})</span>
      </div>
      <div class="skills-grid">
        ${data.worksheet ? `<div class="pdf-list-heading"><span class="skill-name">${labels('Skills')}</span><span class="skill-ranks">${labels('ranks')}</span><span class="skill-other">${labels('Other')}</span><span class="skill-total">${labels('Total')}</span></div>` : ''}
        ${skillsHtml}
      </div>
    </div>
  `.trim();
}

/**
 * Render a single skill entry
 */
function renderSkillEntry(
  skill: ICharacter['skills'][0],
  skillDefs: Record<string, ISkillDef>,
  abilities: ICharacter['abilities'],
  absentAbilities: AbilityKey[],
  labels: PDFLabels,
  worksheet = false,
  blank = false
): string {
  // Get skill definition
  const skillDef = skillDefs[skill.skillId];
  const skillName = skillDef?.name || skill.skillId;
  const linkedAbility = skillDef?.baseAbility || 'int';

  // Calculate ability bonus
  const abilityBonus = getEffectiveAbilityRank(abilities, absentAbilities, linkedAbility);

  const otherBonus = skill.otherBonus ?? 0;
  const total = skill.ranks + abilityBonus + otherBonus;
  
  // Add subtype if present
  const displayName = skill.subtype ? `${skillName} (${skill.subtype})` : skillName;

  return `
    <div class="skill-entry${worksheet ? ' worksheet-skill' : ''}">
      <span class="skill-name">${escapeHtml(displayName)}${worksheet && skillDef?.subtyped && !skill.subtype ? '<span class="pdf-inline-blank"></span>' : ''}</span>
      <span class="skill-ranks">${blank ? '<span class="pdf-inline-blank short"></span>' : skill.ranks}${worksheet ? '' : ` ${labels('ranks')}${otherBonus !== 0 ? `, ${otherBonus > 0 ? '+' : ''}${otherBonus} ${labels('other')}` : ''}`}</span>
      ${worksheet ? `<span class="skill-other">${blank ? '<span class="pdf-inline-blank short"></span>' : formatBonus(otherBonus)}</span>` : ''}
      <span class="skill-total">${blank ? '<span class="pdf-inline-blank short"></span>' : formatBonus(total)}</span>
    </div>
  `;
}
