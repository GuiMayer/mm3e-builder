import { useAppStore } from '../../store/appStore';

// Zustand restores local preferences synchronously before this snapshot is taken.
export const analyticsEnabledAtStartup = useAppStore.getState().analyticsEnabled !== false;

export async function startWebAnalytics(): Promise<boolean> {
  // Do not request the optional collector in development or after an opt-out.
  if (!analyticsEnabledAtStartup || !(useAppStore.persist?.hasHydrated() ?? false)
    || !import.meta.env.PROD || !import.meta.env.VITE_CLOUDFLARE_ANALYTICS_TOKEN
    || window.location.hostname !== 'guimayer.github.io'
    || !window.location.pathname.startsWith('/mm3e-builder/')) return false;
  try {
    // Blockers can reject this module as well as Cloudflare's external script.
    // Neither is a dependency of the UI or of the settings control.
    const { loadWebAnalytics } = await import('../analytics/webAnalytics');
    return loadWebAnalytics({
      enabled: analyticsEnabledAtStartup,
      preferencesReady: useAppStore.persist?.hasHydrated() ?? false,
      production: import.meta.env.PROD,
      token: import.meta.env.VITE_CLOUDFLARE_ANALYTICS_TOKEN,
      location: window.location,
      document,
    });
  } catch {
    return false;
  }
}
