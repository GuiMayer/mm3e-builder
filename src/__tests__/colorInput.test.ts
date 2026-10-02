import { describe, expect, it } from 'vitest';
import { formatColorInput, parseColorInput } from '../features/themes/colorInput';

const opaque = { hex: '#123456', alpha: 1 };

describe('Theme color input conversion', () => {
  it.each(['#0f8', '0f8', '#00FF88', '00ff88', 'rgb(0, 255, 136)', 'rgb(0 255 136)', 'hsl(152, 100%, 50%)', 'hsl(152deg 100% 50%)'])('accepts %s and retains the storage format', input => {
    expect(parseColorInput(input, opaque, false)).toEqual({ hex: '#00FF88', alpha: 1 });
  });
  it('preserves existing opacity when input does not specify alpha', () => {
    expect(parseColorInput('rgb(0 255 136)', { ...opaque, alpha: .15 }, true)).toEqual({ hex: '#00FF88', alpha: .15 });
  });
  it.each(['#0f88', '#00ff8888', 'rgba(0, 255, 136, .5)', 'rgb(0 255 136 / 50%)', 'hsla(152, 100%, 50%, .5)', 'hsl(152 100% 50% / 50%)'])('applies explicit alpha from %s only to transparent roles', input => {
    const result = parseColorInput(input, opaque, true)!;
    expect(result.hex).toBe('#00FF88');
    expect(result.alpha).toBeGreaterThanOrEqual(.5);
    expect(result.alpha).toBeLessThanOrEqual(.534);
    expect(parseColorInput(input, opaque, false)).toBeNull();
  });
  it.each(['', '#12', 'rgb(1 2)', 'var(--color)', 'url(example)', 'red'])('rejects invalid or unsupported input %s', input => {
    expect(parseColorInput(input, opaque, true)).toBeNull();
  });
  it('changes display notation without changing the stored color or opacity', () => {
    const color = { hex: '#00FF88', alpha: .15 };
    for (const notation of ['hex', 'rgb', 'hsl'] as const) {
      expect(parseColorInput(formatColorInput(color, notation), color, true)).toEqual(color);
    }
    expect(color).toEqual({ hex: '#00FF88', alpha: .15 });
  });
});
