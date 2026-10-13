import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/appStore';
import { analyticsEnabledAtStartup } from './startup';
import './usageStatisticsSettings.css';

export function UsageStatisticsSettings() {
  const { t } = useTranslation();
  const id = useId();
  const enabled = useAppStore((s) => s.analyticsEnabled !== false);
  const setEnabled = useAppStore((s) => s.setAnalyticsEnabled);
  const pending = enabled !== analyticsEnabledAtStartup;

  return (
    <section className="analytics-settings" aria-labelledby={`${id}-title`}>
      <span className="analytics-settings-title" id={`${id}-title`}>{t('analytics.title')}</span>
      <label className="analytics-settings-control">
        <span>{t('analytics.allow')}</span>
        <input type="checkbox" role="switch" checked={enabled}
          aria-describedby={`${id}-description${pending ? ` ${id}-pending` : ''}`}
          onChange={(event) => setEnabled(event.target.checked)} />
      </label>
      <p className="analytics-settings-hint" id={`${id}-description`}>{t('analytics.description')}</p>
      <a className="analytics-settings-link" href="https://www.cloudflare.com/trust-hub/gdpr/"
        target="_blank" rel="noopener noreferrer">{t('analytics.privacy')}</a>
      {pending && <p className="analytics-settings-hint" id={`${id}-pending`} role="status">{t('analytics.pending')}</p>}
    </section>
  );
}
