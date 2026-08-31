/* ================================================
   Skills Section Component
   List of skills with ranks and total bonus
   ================================================ */

import type { AbilityKey, ICharacter } from '../../../entities/types';
import type { ISkillDef } from '../../../entities/types';
import { escapeHtml, formatBonus } from './utils';
import { getEffectiveAbilityRank } from '../../../shared/lib/abilityRanks';

export interface SkillsSectionData {
  character: ICharacter;
  skillDefs: Record<string, ISkillDef>;
  skillsCost: number;
}

/**
 * Render the skills section
 */
export function renderSkillsSection(data: SkillsSectionData): string {
  const { character, skillDefs, skillsCost } = data;
  const { skills, abilities, absentAbilities } = character;

  // Filter skills with ranks > 0
  const activeSkills = skills.filter(skill => skill.ranks > 0);

  if (activeSkills.length === 0) {
    return `
      <div class="pdf-section">
        <div class="pdf-section-title">Skills</div>
        <p class="text-muted">No skills trained.</p>
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
    .map(skill => renderSkillEntry(skill, skillDefs, abilities, absentAbilities))
    .join('');
  
  const totalRanks = skills.reduce((sum, s) => sum + s.ranks, 0);

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">
        Skills
        <span class="section-cost">${skillsCost} PP (${totalRanks} ranks)</span>
      </div>
      <div class="skills-grid">
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
  absentAbilities: AbilityKey[]
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
    <div class="skill-entry">
      <span class="skill-name">${escapeHtml(displayName)}</span>
      <span class="skill-ranks">${skill.ranks} ranks${otherBonus !== 0 ? `, ${otherBonus > 0 ? '+' : ''}${otherBonus} other` : ''}</span>
      <span class="skill-total">${formatBonus(total)}</span>
    </div>
  `;
}
