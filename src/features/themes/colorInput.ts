import { colord } from 'colord';
import type { ThemeColor } from './themeModel';

export type ColorNotation = 'hex' | 'rgb' | 'hsl';

/** Convert editor input only; the stored palette still uses HEX + alpha. */
export function parseColorInput(value: string, current: ThemeColor, transparent: boolean): ThemeColor | null {
  let input = value.trim();
  if (/^(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(input)) input = `#${input}`;
  const parsed = colord(input);
  if (!parsed.isValid()) return null;
  const explicitAlpha = /^#[\da-f]{4}$|^#[\da-f]{8}$/i.test(input) ||
    /^(?:rgba?|hsla?)\([^)]*(?:\/|,[^,]*,[^,]*,)/i.test(input);
  const alpha = explicitAlpha ? parsed.alpha() : current.alpha;
  if (!transparent && alpha !== 1) return null;
  return { hex: parsed.alpha(1).toHex().toUpperCase(), alpha };
}

export function formatColorInput(color: ThemeColor, notation: ColorNotation): string {
  const parsed = colord(color.hex).alpha(color.alpha);
  if (notation === 'rgb') return parsed.toRgbString();
  if (notation === 'hsl') return parsed.toHslString();
  return parsed.alpha(1).toHex().toUpperCase();
}
