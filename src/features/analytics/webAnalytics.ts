const SCRIPT_ID = 'mm3e-web-analytics';
const SCRIPT_URL = 'https://static.cloudflareinsights.com/beacon.min.js';

interface AnalyticsOptions {
  enabled: boolean;
  preferencesReady: boolean;
  production: boolean;
  token: string | undefined;
  location: Pick<Location, 'hostname' | 'pathname'>;
  document: Pick<Document, 'getElementById' | 'createElement' | 'head'>;
}

/** Load once at startup. Preference changes take effect on the next page load. */
export function loadWebAnalytics(options: AnalyticsOptions): boolean {
  const { enabled, preferencesReady, production, token, location, document } = options;
  if (!enabled || !preferencesReady || !production || !token || !/^[a-f\d]{32}$/i.test(token)
    || location.hostname !== 'guimayer.github.io'
    || !location.pathname.startsWith('/mm3e-builder/')) return false;

  try {
    if (document.getElementById(SCRIPT_ID)) return true;
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'module';
    script.async = true;
    script.src = SCRIPT_URL;
    script.setAttribute('data-cf-beacon', JSON.stringify({ token }));
    document.head.appendChild(script);
    return true;
  } catch {
    // Optional analytics must never prevent the sheet from opening.
    return false;
  }
}
