/* ================================================
   Component Utilities
   Helper functions for HTML generation
   ================================================ */

/**
 * Escape HTML special characters to prevent injection
 */
export function escapeHtml(text: string | number | undefined | null): string {
  if (text === undefined || text === null) return '';
  const str = String(text);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Format a number with sign (e.g., +3, -2, 0)
 */
export function formatBonus(value: number): string {
  if (value > 0) return `+${value}`;
  if (value < 0) return `${value}`;
  return '0';
}

/**
 * Calculate ability modifier from ability score
 * M&M 3e: bonus = score (abilities are already modifiers)
 */
export function getAbilityBonus(score: number): number {
  return score;
}

/**
 * Join array items with separator, filtering out empty values
 */
export function joinNonEmpty(items: (string | undefined | null)[], separator: string = ', '): string {
  return items.filter(item => item !== undefined && item !== null && item !== '').join(separator);
}

/**
 * Pluralize a word based on count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular;
  return plural || `${singular}s`;
}

/**
 * Truncate text with ellipsis if too long
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Convert newlines to <br> tags
 */
export function nl2br(text: string): string {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

/**
 * Check if value is present and not empty
 */
export function isPresent(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Conditional class names
 */
export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
