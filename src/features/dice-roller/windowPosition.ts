export interface WindowPosition { x: number; y: number }
interface Size { width: number; height: number }

/** Keep a floating window within the viewport, with a small reachable edge gap. */
export function constrainWindow(position: WindowPosition, panel: Size, viewport: Size): WindowPosition {
  const maxX = Math.max(0, viewport.width - panel.width);
  const maxY = Math.max(0, viewport.height - panel.height);
  const gapX = Math.min(8, maxX / 2);
  const gapY = Math.min(8, maxY / 2);
  return {
    x: Math.min(maxX - gapX, Math.max(gapX, position.x)),
    y: Math.min(maxY - gapY, Math.max(gapY, position.y)),
  };
}
