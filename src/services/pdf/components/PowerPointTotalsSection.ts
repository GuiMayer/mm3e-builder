/* ================================================
   Power Point Totals Section Component
   Summary of PP costs by category
   ================================================ */

export interface PowerPointTotalsSectionData {
  abilitiesCost: number;
  defensesCost: number;
  skillsCost: number;
  advantagesCost: number;
  powersCost: number;
  totalAvailable: number;
  totalSpent: number;
  remaining: number;
}

/**
 * Render the power point totals section
 */
export function renderPowerPointTotalsSection(data: PowerPointTotalsSectionData): string {
  const {
    abilitiesCost,
    defensesCost,
    skillsCost,
    advantagesCost,
    powersCost,
    totalAvailable,
    totalSpent,
    remaining,
  } = data;

  const isOverbudget = remaining < 0;

  return `
    <div class="pdf-section">
      <div class="pdf-section-title">Power Point Summary</div>
      <div class="pp-totals">
        <div class="pp-totals-grid">
          <div class="pp-label">Abilities:</div>
          <div class="pp-value">${abilitiesCost}</div>
          
          <div class="pp-label">Defenses:</div>
          <div class="pp-value">${defensesCost}</div>
          
          <div class="pp-label">Skills:</div>
          <div class="pp-value">${skillsCost}</div>
          
          <div class="pp-label">Advantages:</div>
          <div class="pp-value">${advantagesCost}</div>
          
          <div class="pp-label">Powers:</div>
          <div class="pp-value">${powersCost}</div>
          
          <div class="pp-total-row pp-label">Total Spent:</div>
          <div class="pp-total-row pp-value">${totalSpent}</div>
          
          <div class="pp-label">Total Available:</div>
          <div class="pp-value">${totalAvailable}</div>
          
          <div class="pp-label ${isOverbudget ? 'text-bold' : ''}">Remaining:</div>
          <div class="pp-value ${isOverbudget ? 'text-bold' : ''}">${remaining}</div>
        </div>
        ${isOverbudget ? `<div class="text-center text-bold" style="color: #cc0000; margin-top: 0.1in;">⚠ Character is over budget!</div>` : ''}
      </div>
    </div>
  `.trim();
}
