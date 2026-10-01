import { useState, useCallback } from 'react';

type DrawerHeight = 'closed' | 'peek' | 'full';

export function useMobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  // Each editor starts closed. Restoring a saved height without restoring
  // isOpen leaves an aria-hidden panel covering the workspace.
  const [height, setHeight] = useState<DrawerHeight>('closed');

  const openDrawer = useCallback((initialHeight: DrawerHeight = 'peek') => {
    setIsOpen(true);
    setHeight(initialHeight);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    setHeight('closed');
  }, []);

  const toggleDrawer = useCallback(() => {
    if (isOpen && height !== 'closed') {
      closeDrawer();
    } else {
      openDrawer();
    }
  }, [isOpen, height, closeDrawer, openDrawer]);

  return {
    isOpen,
    height,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    setHeight,
  };
}
