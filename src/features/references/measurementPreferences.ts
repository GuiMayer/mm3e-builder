import type { MeasurementSystem } from './measurements';

export const MEASUREMENT_SYSTEM_KEY = 'mm3e-reference-measurement-system';

export function loadMeasurementSystem(language: string, storage?: Pick<Storage, 'getItem'>): MeasurementSystem {
  try {
    const saved = (storage ?? localStorage).getItem(MEASUREMENT_SYSTEM_KEY);
    if (saved === 'metric' || saved === 'imperial') return saved;
  } catch { /* A blocked preference store must not prevent consultation. */ }
  return language.toLowerCase().startsWith('pt') ? 'metric' : 'imperial';
}

export function saveMeasurementSystem(system: MeasurementSystem, storage?: Pick<Storage, 'setItem'>): void {
  try { (storage ?? localStorage).setItem(MEASUREMENT_SYSTEM_KEY, system); }
  catch { /* Keep the selection usable in memory when persistence is unavailable. */ }
}
