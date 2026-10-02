import { useLayoutEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { useCustomThemeStore } from '../../features/themes/customThemeStore';
import { applyTheme } from '../../features/themes/applyTheme';

/**
 * Hook that syncs the active theme to the DOM and provides theme controls.
 */
export function useTheme() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const palette = useCustomThemeStore(s => s.palette);

  useLayoutEffect(() => { applyTheme(document.documentElement, theme, palette); }, [theme, palette]);

  return { theme, setTheme };
}
