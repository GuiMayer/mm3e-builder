import { describe, expect, it } from 'vitest';
import { portraitDrawRect } from '../services/pdf/portraitLayout';

describe('PDF portrait fitting', () => {
  it('keeps a tall portrait whole and centers the side borders', () => {
    expect(portraitDrawRect(400, 800, 200, 100, 'contain')).toEqual({ x: 75, y: 0, width: 50, height: 100 });
  });
  it('fills a wide frame by cropping equal amounts from the top and bottom', () => {
    expect(portraitDrawRect(400, 800, 200, 100, 'cover')).toEqual({ x: 0, y: -150, width: 200, height: 400 });
  });
  it('stretches only when explicitly selected', () => {
    expect(portraitDrawRect(400, 800, 200, 100, 'fill')).toEqual({ x: 0, y: 0, width: 200, height: 100 });
  });
  it('centers a landscape portrait inside a tall header without distortion', () => {
    expect(portraitDrawRect(800, 400, 100, 200, 'contain')).toEqual({ x: 0, y: 75, width: 100, height: 50 });
  });
});
