import type { ReactElement, MouseEvent, TouchEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NumberInput, type NumberInputProps } from '../shared/ui/NumberInput';

// Preserve refs across renders and apply layout effects after committing the tree.
const hooks = vi.hoisted(() => ({ refs: [] as { current: unknown }[], cursor: 0, layouts: [] as (() => void)[], cleanups: [] as (() => void)[] }));
vi.mock('react', () => ({
  useRef: (initial: unknown) => hooks.refs[hooks.cursor++] ?? (hooks.refs[hooks.cursor - 1] = { current: initial }),
  useLayoutEffect: (effect: () => void) => hooks.layouts.push(effect),
  useEffect: (effect: () => (() => void)) => { if (!hooks.cleanups.length) hooks.cleanups.push(effect()); },
}));
type ButtonProps = {
  onMouseDown: (event: MouseEvent) => void; onMouseUp: (event: MouseEvent) => void;
  onClick: (event: MouseEvent) => void; onBlur: () => void; onTouchCancel: (event: TouchEvent) => void;
};
const mouse = (detail = 1, button = 0) => ({ detail, button } as MouseEvent);
function render(props: NumberInputProps) {
  hooks.cursor = 0; hooks.layouts = [];
  const tree = NumberInput(props);
  hooks.layouts.forEach(effect => effect());
  const children = (tree as ReactElement<{ children: ReactElement<ButtonProps>[] }>).props.children;
  return { decrement: children[0].props, increment: children[2].props };
}
beforeEach(() => {
  vi.useFakeTimers(); hooks.refs = []; hooks.cleanups = []; hooks.cursor = 0;
});
afterEach(() => { hooks.cleanups.forEach(cleanup => cleanup()); vi.useRealTimers(); });

describe('NumberInput interactions', () => {
  it('advances on every repeat using the newest value and callback across rerenders', () => {
    let props: NumberInputProps = { value: 0, onChange: vi.fn() };
    const first = vi.fn((value: number) => { props = { ...props, value }; render(props); });
    props.onChange = first;
    const buttons = render(props);
    buttons.increment.onMouseDown(mouse());
    expect(first).toHaveBeenLastCalledWith(1);
    const next = vi.fn((value: number) => { props = { ...props, value }; render(props); });
    props = { ...props, onChange: next };
    render(props);
    vi.advanceTimersByTime(600);
    expect(next.mock.calls.map(([value]) => value)).toEqual([2, 3, 4]);
    expect(first).toHaveBeenCalledTimes(1);
    buttons.increment.onMouseUp(mouse());
    vi.advanceTimersByTime(1000);
    expect(next).toHaveBeenCalledTimes(3);
  });

  it('supports keyboard or assistive clicks without counting a mouse click twice', () => {
    const onChange = vi.fn();
    const buttons = render({ value: 5, onChange });
    buttons.increment.onMouseDown(mouse());
    buttons.increment.onMouseUp(mouse());
    buttons.increment.onClick(mouse(1));
    expect(onChange.mock.calls).toEqual([[6]]);
    buttons.increment.onClick(mouse(0));
    buttons.decrement.onClick(mouse(0));
    expect(onChange.mock.calls).toEqual([[6], [7], [6]]);
  });

  it('respects the latest step and bounds while holding and stops when disabled', () => {
    const onChange = vi.fn();
    const buttons = render({ value: 0, onChange });
    buttons.increment.onMouseDown(mouse());
    render({ value: 1, onChange, step: 3, max: 5 });
    vi.advanceTimersByTime(700);
    expect(onChange.mock.calls).toEqual([[1], [4], [5]]);
    render({ value: 5, onChange, disabled: true });
    vi.advanceTimersByTime(1000);
    buttons.increment.onClick(mouse(0));
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('decrements to the lower bound and ignores non-primary mouse presses', () => {
    const onChange = vi.fn();
    const buttons = render({ value: 0, onChange, min: -2 });
    buttons.increment.onMouseDown(mouse(1, 2));
    expect(onChange).not.toHaveBeenCalled();
    buttons.decrement.onMouseDown(mouse());
    vi.advanceTimersByTime(1000);
    expect(onChange.mock.calls).toEqual([[-1], [-2]]);
  });

  it.each(['blur', 'touch cancel', 'unmount'])('cancels repeats on %s', event => {
    const onChange = vi.fn();
    const buttons = render({ value: 0, onChange });
    buttons.increment.onMouseDown(mouse());
    if (event === 'blur') buttons.increment.onBlur();
    else if (event === 'touch cancel') buttons.increment.onTouchCancel({ touches: [], preventDefault: vi.fn() } as unknown as TouchEvent);
    else hooks.cleanups.forEach(cleanup => cleanup());
    vi.advanceTimersByTime(1000);
    expect(onChange.mock.calls).toEqual([[1]]);
  });
});
