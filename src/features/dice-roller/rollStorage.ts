import { createRoll, DEFAULT_ROLL_LIMIT, validRollLimit } from './rollModel';
import type { RollResult, RollSource } from './rollModel';

export const DICE_PREFERENCES_KEY = 'mm3e-dice-preferences';
export type DiceStorage = Pick<Storage, 'getItem' | 'setItem'>;

export interface SavedRollState {
  limit: number;
  keepHistory: boolean;
  history: RollResult[];
}

function readRoll(value: unknown): RollResult | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Record<string, unknown>;
  if (!Number.isSafeInteger(item.id) || (item.id as number) < 1 ||
      (item.id as number) >= Number.MAX_SAFE_INTEGER ||
      !Number.isSafeInteger(item.bonus) || !Number.isInteger(item.die) ||
      (item.mode !== undefined && item.mode !== 'd20' && item.mode !== 'routine')) return null;
  let source: RollSource | null = null;
  if (item.source !== null) {
    if (!item.source || typeof item.source !== 'object') return null;
    const saved = item.source as Record<string, unknown>;
    if (['characterId', 'characterName', 'section', 'label'].some(key => typeof saved[key] !== 'string') ||
        (saved.detail !== undefined && typeof saved.detail !== 'string') ||
        (saved.breakdown !== undefined && (!Array.isArray(saved.breakdown) || saved.breakdown.some(part => typeof part !== 'string')))) return null;
    source = {
      characterId: saved.characterId as string,
      characterName: saved.characterName as string,
      section: saved.section as string,
      label: saved.label as string,
      ...(saved.detail !== undefined ? { detail: saved.detail as string } : {}),
      ...(saved.breakdown !== undefined ? { breakdown: saved.breakdown as string[] } : {}),
    };
  }
  try {
    const result = createRoll({ bonus: item.bonus as number, source, mode: item.mode as RollResult['mode'] }, item.id as number, () => item.die as number);
    return result.die === item.die && result.total === item.total ? result : null;
  } catch { return null; }
}

export function loadRollState(storage?: DiceStorage): SavedRollState {
  const defaults = { limit: DEFAULT_ROLL_LIMIT, keepHistory: false, history: [] };
  try {
    const raw = (storage ?? localStorage).getItem(DICE_PREFERENCES_KEY);
    if (!raw) return defaults;
    const saved: unknown = JSON.parse(raw);
    if (!saved || typeof saved !== 'object' || !('version' in saved) || saved.version !== 1) return defaults;
    const data = saved as Record<string, unknown>;
    const limit = typeof data.limit === 'number' && validRollLimit(data.limit) ? data.limit : DEFAULT_ROLL_LIMIT;
    const keepHistory = data.keepHistory === true;
    const history: RollResult[] = [];
    const seen = new Set<number>();
    if (keepHistory && Array.isArray(data.history)) {
      for (const value of data.history) {
        const result = readRoll(value);
        if (!result || seen.has(result.id)) continue;
        seen.add(result.id);
        history.push(result);
        if (history.length === limit) break;
      }
    }
    return { limit, keepHistory, history };
  } catch { return defaults; }
}

export function saveRollState(state: SavedRollState, storage?: DiceStorage): void {
  try {
    (storage ?? localStorage).setItem(DICE_PREFERENCES_KEY, JSON.stringify({
      version: 1,
      limit: state.limit,
      keepHistory: state.keepHistory,
      history: state.keepHistory ? state.history : [],
    }));
  } catch { /* Keep rolling in memory when storage is unavailable or full. */ }
}
