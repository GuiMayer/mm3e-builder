import { useEffect, useRef, type RefObject } from 'react';

let scrollLocks = 0;
let originalOverflow = '';

/** Shared focus and scroll management for stacked dialogs. */
export function useDialogFocus(contentRef: RefObject<HTMLElement | null>, isOpen: boolean, onClose: () => void, escapeEnabled = true) {
  const onCloseRef = useRef(onClose);
  const escapeEnabledRef = useRef(escapeEnabled);
  useEffect(() => { onCloseRef.current = onClose; escapeEnabledRef.current = escapeEnabled; }, [onClose, escapeEnabled]);
  useEffect(() => {
    if (!isOpen) return;
    const mountedContent = contentRef.current;
    if (!mountedContent) return;
    const content = mountedContent;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (scrollLocks++ === 0) originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => Array.from(content.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]',
    )).filter((element) => element.getClientRects().length > 0);
    const isTopmost = () => Array.from(document.querySelectorAll('[role="dialog"][aria-modal="true"]')).at(-1) === content;
    (focusable()[0] ?? content).focus();
    function handleKey(e: KeyboardEvent) {
      if (!isTopmost() || e.defaultPrevented) return;
      if (e.key === 'Escape' && escapeEnabledRef.current) {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
      } else if (e.key === 'Tab') {
        const targets = focusable();
        const first = targets[0] ?? content;
        const last = targets.at(-1) ?? content;
        if (!content.contains(document.activeElement) || (e.shiftKey ? document.activeElement === first : document.activeElement === last)) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        }
      }
    }
    function containFocus(e: FocusEvent) {
      if (isTopmost() && !content.contains(e.target as Node)) (focusable()[0] ?? content).focus();
    }
    document.addEventListener('keydown', handleKey);
    document.addEventListener('focusin', containFocus);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('focusin', containFocus);
      if (--scrollLocks === 0) document.body.style.overflow = originalOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isOpen, contentRef]);

}
