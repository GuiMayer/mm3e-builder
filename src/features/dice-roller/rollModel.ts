/** Session-only values: never part of character persistence or exports. */
export interface RollSource {
  characterId: string;
  characterName: string;
  section: string;
  label: string;
  detail?: string;
  breakdown?: string[];
}

export interface RollRequest {
  bonus: number;
  source: RollSource | null;
  mode?: 'd20' | 'routine';
}

export interface RollResult extends RollRequest {
  id: number;
  die: number;
  total: number;
}

export const DEFAULT_ROLL_LIMIT = 15;

/** Reject the small incomplete range so every d20 face has equal probability. */
export function randomD20(): number {
  const buffer = new Uint32Array(1);
  do { crypto.getRandomValues(buffer); } while (buffer[0] >= 4_294_967_280);
  return buffer[0] % 20 + 1;
}

export function createRoll(request: RollRequest, id: number, draw: () => number = randomD20): RollResult {
  if (!Number.isSafeInteger(request.bonus)) throw new Error('Roll bonus must be a safe integer.');
  const die = request.mode === 'routine' ? 10 : draw();
  if (!Number.isInteger(die) || die < 1 || die > 20) throw new Error('Invalid d20 result.');
  const total = die + request.bonus;
  if (!Number.isSafeInteger(total)) throw new Error('Roll total must be a safe integer.');
  return {
    ...request, id, die, total,
    source: request.source ? { ...request.source, breakdown: request.source.breakdown?.slice() } : null,
  };
}

export function validRollLimit(limit: number): boolean {
  return Number.isSafeInteger(limit) && limit > 0;
}

export function limitRollHistory(history: RollResult[], limit: number): RollResult[] {
  if (!validRollLimit(limit)) throw new Error('Roll history limit must be a positive safe integer.');
  return history.slice(0, limit);
}

export function rollFormula(result: RollResult): string {
  const die = result.mode === 'routine' ? '10' : `d20 (${result.die})`;
  const bonus = result.bonus < 0 ? `− ${Math.abs(result.bonus)}` : `+ ${result.bonus}`;
  return `${die} ${bonus} = ${result.total}`;
}
