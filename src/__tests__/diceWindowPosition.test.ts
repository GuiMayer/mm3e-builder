import { describe, expect, it } from 'vitest';
import { constrainWindow } from '../features/dice-roller/windowPosition';

describe('Dice window viewport bounds', () => {
  const panel = { width: 350, height: 600 };
  const viewport = { width: 1200, height: 900 };

  it('preserves freely chosen positions within the viewport', () => {
    expect(constrainWindow({ x: 270, y: 140 }, panel, viewport)).toEqual({ x: 270, y: 140 });
  });

  it('keeps all four edges reachable when dragged beyond the viewport', () => {
    expect(constrainWindow({ x: -500, y: -300 }, panel, viewport)).toEqual({ x: 8, y: 8 });
    expect(constrainWindow({ x: 3000, y: 2000 }, panel, viewport)).toEqual({ x: 842, y: 292 });
  });

  it('recovers an existing position after the viewport shrinks', () => {
    expect(constrainWindow({ x: 842, y: 292 }, { width: 350, height: 464 }, { width: 800, height: 600 })).toEqual({ x: 442, y: 128 });
  });

  it('handles a viewport with little or no remaining space without negative coordinates', () => {
    expect(constrainWindow({ x: 100, y: 100 }, panel, { width: 360, height: 610 })).toEqual({ x: 5, y: 5 });
    expect(constrainWindow({ x: -100, y: 100 }, panel, { width: 350, height: 600 })).toEqual({ x: 0, y: 0 });
  });
});
