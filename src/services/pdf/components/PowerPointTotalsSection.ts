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
 * Render compact power point summary for header
 */
export function renderPowerPointSummaryCompact(data: PowerPointTotalsSectionData): string {
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
  const isClose = remaining >= 0 && remaining <= Math.floor(totalAvailable * 0.1);
  
  let summaryBoxClass = 'pp-summary-box';
  let valueClass = 'pp-summary-value';
  
  if (isOverbudget) {
    summaryBoxClass += ' over-budget';
    valueClass += ' negative';
  } else if (isClose) {
    summaryBoxClass += ' under-budget';
    valueClass += ' positive';
  } else {
    valueClass += ' positive';
  }

  return `
    <div class="pp-summary-compact">
      <div class="pp-breakdown">
        <div class="pp-breakdown-item">
          <span class="pp-breakdown-label">Abilities</span>
          <span class="pp-breakdown-value">${abilitiesCost} PP</span>
        </div>
        <div class="pp-breakdown-item">
          <span class="pp-breakdown-label">Defenses</span>
          <span class="pp-breakdown-value">${defensesCost} PP</span>
        </div>
        <div class="pp-breakdown-item">
          <span class="pp-breakdown-label">Skills</span>
          <span class="pp-breakdown-value">${skillsCost} PP</span>
        </div>
        <div class="pp-breakdown-item">
          <span class="pp-breakdown-label">Advantages</span>
          <span class="pp-breakdown-value">${advantagesCost} PP</span>
        </div>
        <div class="pp-breakdown-item">
          <span class="pp-breakdown-label">Powers</span>
          <span class="pp-breakdown-value">${powersCost} PP</span>
        </div>
      </div>
      
      <div class="${summaryBoxClass}">
        <div class="pp-summary-label">Points Remaining</div>
        <div class="${valueClass}">${remaining}</div>
        <div class="pp-summary-fraction">${totalSpent} / ${totalAvailable} PP</div>
        ${isOverbudget ? '<div class="pp-warning">Over Budget!</div>' : ''}
      </div>
    </div>
  `.trim();
}

/**
 * Render the power point totals section (legacy full version)
 * Note: This is now deprecated in favor of the compact version in header
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
        ${isOverbudget ? '<div class="text-center text-bold pp-warning">Character is over budget!</div>' : ''}
      </div>
    </div>
  `.trim();
}
