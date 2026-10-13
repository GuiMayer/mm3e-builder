import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadWebAnalytics } from '../features/analytics/webAnalytics';

function fixture() {
  const attributes: Record<string, string> = {};
  const script = { id: '', type: '', async: false, src: '', setAttribute: (key: string, value: string) => { attributes[key] = value; } };
  const appendChild = vi.fn();
  const getElementById = vi.fn().mockReturnValue(null);
  const createElement = vi.fn().mockReturnValue(script);
  const document = { getElementById, createElement, head: { appendChild } } as unknown as Document;
  const options = {
    enabled: true, preferencesReady: true, production: true,
    token: 'd81286176df744b7b7d354b32f1001cc',
    location: { hostname: 'guimayer.github.io', pathname: '/mm3e-builder/' }, document,
  };
  return { script, attributes, appendChild, getElementById, options };
}

describe('Optional production analytics', () => {
  it('loads the supplied module without adding character properties to its configuration', () => {
    const f = fixture();
    expect(loadWebAnalytics(f.options)).toBe(true);
    expect(f.script.type).toBe('module');
    expect(f.script.src).toBe('https://static.cloudflareinsights.com/beacon.min.js');
    expect(JSON.parse(f.attributes['data-cf-beacon'])).toEqual({ token: f.options.token });
    expect(f.appendChild).toHaveBeenCalledOnce();
  });
  it.each([
    { enabled: false }, { preferencesReady: false }, { production: false },
    { token: undefined }, { token: '' }, { token: 'invalid' },
    { location: { hostname: 'localhost', pathname: '/mm3e-builder/' } },
    { location: { hostname: 'guimayer.github.io', pathname: '/another-project/' } },
    { location: { hostname: 'guimayer.github.io', pathname: '/mm3e-builder-copy/' } },
  ])('does not insert a script with excluded configuration %j', (override) => {
    const f = fixture();
    expect(loadWebAnalytics({ ...f.options, ...override })).toBe(false);
    expect(f.appendChild).not.toHaveBeenCalled();
  });
  it('does not load a second copy', () => {
    const f = fixture();
    loadWebAnalytics(f.options);
    f.getElementById.mockReturnValue(f.script);
    loadWebAnalytics(f.options);
    expect(f.appendChild).toHaveBeenCalledOnce();
  });
  it('isolates optional script insertion failures from app startup', () => {
    const f = fixture();
    f.appendChild.mockImplementation(() => { throw new Error('blocked'); });
    expect(loadWebAnalytics(f.options)).toBe(false);
  });
});

describe('Analytics browser preference', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.doUnmock('../features/analytics/webAnalytics');
    vi.resetModules();
  });

  async function restore(state?: Record<string, unknown>, unreadable = false) {
    const storage = new Map<string, string>();
    if (state) storage.set('mm3e-app-preferences', JSON.stringify({ state, version: 0 }));
    const browserStorage = {
      getItem: (key: string) => { if (unreadable) throw new Error('unavailable'); return storage.get(key) ?? null; },
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    };
    vi.stubGlobal('localStorage', browserStorage);
    vi.stubGlobal('window', { localStorage: browserStorage, location: { hostname: 'guimayer.github.io', pathname: '/mm3e-builder/' } });
    vi.resetModules();
    const { useAppStore } = await import('../store/appStore');
    return { useAppStore, storage };
  }

  it('defaults to enabled for a new browser and existing preferences without this field', async () => {
    const fresh = await restore();
    expect(fresh.useAppStore.getState().analyticsEnabled).toBe(true);
    const legacy = await restore({ theme: 'dark-knight', language: 'pt-BR' });
    expect(legacy.useAppStore.getState().analyticsEnabled).toBe(true);
    expect(legacy.useAppStore.getState().language).toBe('pt-BR');
  });
  it('restores opt-out before startup and saves subsequent changes in app preferences only', async () => {
    const { useAppStore, storage } = await restore({ analyticsEnabled: false, language: 'pt-BR' });
    const { analyticsEnabledAtStartup } = await import('../features/usage-statistics/startup');
    expect(analyticsEnabledAtStartup).toBe(false);
    expect(useAppStore.persist.hasHydrated()).toBe(true);
    useAppStore.getState().setAnalyticsEnabled(true);
    expect(JSON.parse(storage.get('mm3e-app-preferences')!).state.analyticsEnabled).toBe(true);
    expect(analyticsEnabledAtStartup).toBe(false);
    useAppStore.getState().setAnalyticsEnabled(false);
    expect(JSON.parse(storage.get('mm3e-app-preferences')!).state.analyticsEnabled).toBe(false);
    expect([...storage.keys()]).toEqual(['mm3e-app-preferences']);
  });
  it('does not consider failed preference hydration ready for tracking', async () => {
    const { useAppStore } = await restore(undefined, true);
    expect(useAppStore.persist.hasHydrated()).toBe(false);
  });

  it('imports essential startup successfully even when a blocker rejects the collector module', async () => {
    await restore();
    vi.stubEnv('PROD', true);
    vi.stubEnv('VITE_CLOUDFLARE_ANALYTICS_TOKEN', fixture().options.token);
    const blockedModule = vi.fn(() => { throw new Error('NetworkError: blocked by EasyPrivacy /WebAnalytics.'); });
    vi.doMock('../features/analytics/webAnalytics', blockedModule);
    const { startWebAnalytics } = await import('../features/usage-statistics/startup');
    expect(blockedModule).not.toHaveBeenCalled();
    await expect(startWebAnalytics()).resolves.toBe(false);
    expect(blockedModule).toHaveBeenCalledOnce();
  });

  it.each(['development', 'opt-out', 'unreadable preferences'])('does not request even the collector module in %s', async (scenario) => {
    await restore({ analyticsEnabled: scenario !== 'opt-out' }, scenario === 'unreadable preferences');
    vi.stubEnv('PROD', scenario !== 'development');
    vi.stubEnv('VITE_CLOUDFLARE_ANALYTICS_TOKEN', fixture().options.token);
    const blockedModule = vi.fn(() => { throw new Error('blocked'); });
    vi.doMock('../features/analytics/webAnalytics', blockedModule);
    const { startWebAnalytics } = await import('../features/usage-statistics/startup');
    await expect(startWebAnalytics()).resolves.toBe(false);
    expect(blockedModule).not.toHaveBeenCalled();
  });
});
