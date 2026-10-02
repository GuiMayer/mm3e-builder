import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoDialog } from './InfoDialog';
import type { CampaignMigrationBase, PendingCampaignMigration } from '../../services/storage/campaignMigration';
import './campaignMigration.css';

export function CampaignMigrationDialog({ pending, onApply, onBackup, error }: {
  pending: PendingCampaignMigration;
  onApply: (bases: Record<string, CampaignMigrationBase>) => void;
  onBackup: () => void;
  error: string;
}) {
  const { t } = useTranslation();
  const [bases, setBases] = useState<Record<string, CampaignMigrationBase>>(() => Object.fromEntries(pending.characters.map(row => [row.key, { initialPowerLevel: row.powerLevel, initialPP: row.powerLevel * 15 }])));
  const valid = Object.values(bases).every(base => Number.isSafeInteger(base.initialPowerLevel) && base.initialPowerLevel >= 1 && Number.isSafeInteger(base.initialPP) && base.initialPP >= 0 && base.initialPP <= 1_000_000);
  return <InfoDialog isOpen onClose={() => {}} dismissible={false} title={t('campaign.migrationTitle')}>
    <div className="campaign-migration">
      <p>{t('campaign.migrationExplanation')}</p>
      <p className="campaign-migration-hint">{t('campaign.migrationReviewHint')}</p>
      <div className="campaign-migration-list">
        {pending.characters.map((row, index) => {
          const base = bases[row.key];
          const available = row.active ? base.initialPP + row.adjustments : row.powerLevel * 15;
          return <fieldset key={row.key}>
            <legend>{row.name || t('header.heroName')} · {t('header.powerLevel')} {row.powerLevel}</legend>
            <div className="campaign-migration-fields">
              <label htmlFor={`migration-pl-${index}`}>{t('campaign.initialPL')}
                <input id={`migration-pl-${index}`} type="number" min={1} step={1} value={Number.isNaN(base.initialPowerLevel) ? '' : base.initialPowerLevel}
                  onChange={event => { const value = event.target.value === '' ? NaN : Number(event.target.value); setBases(current => ({ ...current, [row.key]: { initialPowerLevel: value, initialPP: value * 15 } })); }} />
              </label>
              <label htmlFor={`migration-pp-${index}`}>{t('campaign.initialPP')}
                <input id={`migration-pp-${index}`} type="number" min={0} max={1_000_000} step={1} value={Number.isNaN(base.initialPP) ? '' : base.initialPP}
                  onChange={event => setBases(current => ({ ...current, [row.key]: { ...base, initialPP: event.target.value === '' ? NaN : Number(event.target.value) } }))} />
              </label>
            </div>
            <p>{t('campaign.migrationPreview', { before: row.previousAvailable, after: Number.isFinite(available) ? available : '—', adjustments: row.adjustments })}</p>
            {!row.active && <p className="campaign-migration-hint">{t('campaign.inactiveMigration')}</p>}
          </fieldset>;
        })}
      </div>
      <p>{t('campaign.migrationPreserved')}</p>
      {error && <p role="alert" className="campaign-error">{t(error)}</p>}
      <div className="campaign-migration-actions">
        <button className="btn btn-secondary" onClick={onBackup}>{t('draft.export')}</button>
        <button className="btn btn-primary" disabled={!valid} onClick={() => onApply(bases)}>{t('campaign.migrationApply')}</button>
      </div>
    </div>
  </InfoDialog>;
}
