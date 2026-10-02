import { cloneElement, useState, type HTMLAttributes, type MouseEvent, type ReactElement, type Ref } from 'react';
import { autoUpdate, flip, FloatingPortal, hide, offset, safePolygon, shift, useDismiss, useFloating, useFocus, useHover, useInteractions, useMergeRefs, useRole } from '@floating-ui/react';
import './referenceInfo.css';

interface TooltipProps {
  content: string;
  children: ReactElement<HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> }>;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const { refs: { setReference, setFloating }, floatingStyles, context, middlewareData } = useFloating({
    open, onOpenChange: setOpen, placement: 'top', strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip({ padding: 12 }), shift({ padding: 12 }), hide()],
  });
  const hover = useHover(context, { mouseOnly: true, move: false, delay: { open: 250, close: 100 }, handleClose: safePolygon() });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);
  const ref = useMergeRefs([setReference, children.props.ref]);
  return <>
    {cloneElement(children, { ...getReferenceProps({ ...children.props, onClick: (event: MouseEvent<HTMLElement>) => { setOpen(false); children.props.onClick?.(event); } }), ref })}
    {open && content && <FloatingPortal>
      <div ref={setFloating} className={content.length > 90 ? 'tooltip-bubble tooltip-bubble--description' : 'tooltip-bubble'}
        style={{ ...floatingStyles, visibility: middlewareData.hide?.referenceHidden ? 'hidden' : undefined }} {...getFloatingProps()}>
        {content}
      </div>
    </FloatingPortal>}
  </>;
}
