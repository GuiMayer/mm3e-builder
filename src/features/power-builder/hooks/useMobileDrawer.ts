import { useState, useEffect, useCallback } from 'react';

type DrawerHeight = 'closed' | 'peek' | 'full';

const STORAGE_KEY = 'powerbuilder-drawer-state';

export function useMobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState<DrawerHeight>(() => {
    if (typeof localStorage === 'undefined') return 'closed';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'peek' || saved === 'full') {
      return saved;
    }
    return 'closed';
  });

  // Save preferred state to localStorage
  useEffect(() => {
    if (height !== 'closed') {
      localStorage.setItem(STORAGE_KEY, height);
    }
  }, [height]);

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
