import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useIsMobile } from '../../shared/hooks/useIsMobile';
import { D20Icon } from './D20Icon';
import { constrainWindow } from './windowPosition';
import type { WindowPosition } from './windowPosition';

interface Drag {
  pointerId: number;
  element: HTMLElement;
  pointerX: number;
  pointerY: number;
  start: WindowPosition;
}

export function DiceWindow({ id, titleId, isOpen, onClose, children }: {
  id: string; titleId: string; isOpen: boolean; onClose: () => void; children: ReactNode;
}) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const panelRef = useRef<HTMLElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const [position, setPosition] = useState<WindowPosition | null>(null);
  const [dragging, setDragging] = useState(false);

  function finishDrag() {
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag?.element.hasPointerCapture(drag.pointerId)) drag.element.releasePointerCapture(drag.pointerId);
    setDragging(false);
  }

  useEffect(() => {
    function onResize() {
      const drag = dragRef.current;
      dragRef.current = null;
      if (drag?.element.hasPointerCapture(drag.pointerId)) drag.element.releasePointerCapture(drag.pointerId);
      setDragging(false);
      const panel = panelRef.current;
      if (!panel || window.innerWidth <= 768) return;
      setPosition(current => current && constrainWindow(current,
        { width: panel.offsetWidth, height: panel.offsetHeight },
        { width: window.innerWidth, height: window.innerHeight }));
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function move(next: WindowPosition) {
    const panel = panelRef.current;
    if (!panel) return;
    setPosition(constrainWindow(next,
      { width: panel.offsetWidth, height: panel.offsetHeight },
      { width: window.innerWidth, height: window.innerHeight }));
  }

  function startDrag(event: PointerEvent<HTMLElement>) {
    if (isMobile || !isOpen || !event.isPrimary || event.button !== 0 || dragRef.current) return;
    if ((event.target as HTMLElement).closest('button, input, select, a')) return;
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const start = constrainWindow({ x: rect.left, y: rect.top },
      { width: panel.offsetWidth, height: panel.offsetHeight },
      { width: window.innerWidth, height: window.innerHeight });
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, element: event.currentTarget, pointerX: event.clientX, pointerY: event.clientY, start };
    setPosition(start);
    setDragging(true);
  }

  function drag(event: PointerEvent<HTMLElement>) {
    const current = dragRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    move({ x: current.start.x + event.clientX - current.pointerX, y: current.start.y + event.clientY - current.pointerY });
  }

  function endDrag(event: PointerEvent<HTMLElement>) {
    if (dragRef.current?.pointerId === event.pointerId) finishDrag();
  }

  function moveWithKeyboard(event: KeyboardEvent<HTMLElement>) {
    if (isMobile || event.target !== event.currentTarget) return;
    if (event.key === 'Home') { event.preventDefault(); finishDrag(); setPosition(null); return; }
    const direction: Record<string, WindowPosition> = {
      ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
    };
    const delta = direction[event.key];
    const rect = panelRef.current?.getBoundingClientRect();
    if (!delta || !rect) return;
    event.preventDefault();
    event.stopPropagation();
    const step = event.shiftKey ? 50 : 10;
    move({ x: rect.left + delta.x * step, y: rect.top + delta.y * step });
  }

  function close() { finishDrag(); onClose(); }

  const style = position ? { '--dice-left': `${position.x}px`, '--dice-top': `${position.y}px` } as CSSProperties : undefined;
  return <aside ref={panelRef} id={id} className="dice-panel" style={style} data-open={isOpen} data-detached={!!position} data-dragging={dragging} aria-hidden={!isOpen} inert={!isOpen} aria-labelledby={titleId}
    onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); close(); } }}>
    <header className="dice-panel-header" role={isMobile ? undefined : 'group'} tabIndex={isMobile ? undefined : 0} aria-label={isMobile ? undefined : t('dice.move')} title={isMobile ? undefined : t('dice.moveHint')}
      onPointerDown={startDrag} onPointerMove={drag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag} onKeyDown={moveWithKeyboard}>
      <h2 id={titleId}><D20Icon /> {t('dice.title')}</h2>
      <button type="button" onClick={close} aria-label={t('dice.close')}><X size={18} /></button>
    </header>
    {children}
  </aside>;
}
