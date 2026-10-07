import { englishPDFLabels, type PDFLabels } from '../pdfMessages';
/* ================================================
   Skills Section Component
   List of skills with ranks and total bonus
   ================================================ */

import type { ICharacter } from '../../../entities/types';
import type { ISkillDef } from '../../../entities/types';
import { escapeHtml, formatBonus } from './utils';
import { getEffectiveAbilityRank } from '../../../shared/lib/abilityRanks';
import { hasSkillContribution } from '../../../shared/lib/skillVisibility';
import { calculateSkillCheck } from '../../../shared/lib/skillCheck';

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
  const { skills } = character;

  // Filter skills with ranks > 0
  const activeSkills = data.worksheet ? [...skills, ...Object.values(skillDefs)
    .filter(def => !skills.some(skill => skill.skillId === def.id))
    .map(def => ({ skillId: def.id, ranks: 0, subtype: null, otherBonus: undefined }))] : skills.filter(skill => hasSkillContribution(skill, character));

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
    .map(skill => renderSkillEntry(skill, skillDefs, character, labels, !!data.worksheet, !skills.includes(skill)))
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
  character: ICharacter,
  labels: PDFLabels,
  worksheet = false,
  blank = false
): string {
  // Get skill definition
  const skillDef = skillDefs[skill.skillId];
  const skillName = skillDef?.name || skill.skillId;
  const linkedAbility = skillDef?.baseAbility || 'int';

  // Calculate ability bonus
  const check = skillDef ? calculateSkillCheck(character, skill, skillDef) : undefined;
  const abilityBonus = check?.ability ?? getEffectiveAbilityRank(character.abilities, character.absentAbilities, linkedAbility);
  const otherBonus = (check?.other ?? skill.otherBonus ?? 0) + (check?.advantage ?? 0) + (check?.circumstance ?? 0);
  const ranks = check?.ranks ?? skill.ranks;
  const total = ranks + abilityBonus + otherBonus;
  
  // Add subtype if present
  const displayName = skill.subtype ? `${skillName} (${skill.subtype})` : skillName;

  return `
    <div class="skill-entry${worksheet ? ' worksheet-skill' : ''}">
      <span class="skill-name">${escapeHtml(displayName)}${worksheet && skillDef?.subtyped && !skill.subtype ? '<span class="pdf-inline-blank"></span>' : ''}</span>
      <span class="skill-ranks">${blank ? '<span class="pdf-inline-blank short"></span>' : ranks}${worksheet ? '' : ` ${labels('ranks')}${otherBonus !== 0 ? `, ${otherBonus > 0 ? '+' : ''}${otherBonus} ${labels('other')}` : ''}`}</span>
      ${worksheet ? `<span class="skill-other">${blank ? '<span class="pdf-inline-blank short"></span>' : formatBonus(otherBonus)}</span>` : ''}
      <span class="skill-total">${blank ? '<span class="pdf-inline-blank short"></span>' : formatBonus(total)}</span>
    </div>
  `;
}
