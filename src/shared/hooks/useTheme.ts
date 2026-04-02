import { useEffect } from 'react';
import { useAppStore } from '../../store/appStore';

/**
 * Hook that syncs the active theme to the DOM and provides theme controls.
 */
export function useTheme() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, setTheme };
}
