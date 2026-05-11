import { useDraftAutoSave } from '../../shared/hooks/useDraftAutoSave';
import { usePLValidation } from '../../shared/hooks/usePLValidation';
import { useCalculatedPP } from '../../shared/hooks/useCalculatedPP';
import { AbilitiesPanel } from './AbilitiesPanel';
import { DefensesPanel } from './DefensesPanel';
import { SkillsPanel } from './SkillsPanel';
import { AdvantagesPanel } from './AdvantagesPanel';
import { PowersList } from './PowersList';
import { ComplicationsPanel } from './ComplicationsPanel';
import { HeaderPanel } from './HeaderPanel';
import { OffensePanel } from './OffensePanel';
import { EquipmentNotesPanel } from './EquipmentNotesPanel';
import { PPLogPanel } from './PPLogPanel';
import { ConditionsPanel } from './ConditionsPanel';
import { NotesPanel } from './NotesPanel';
import { useTranslation } from 'react-i18next';

export function SheetView() {
  const { t } = useTranslation();
  useDraftAutoSave();
  const violations = usePLValidation();
  const pp = useCalculatedPP();


  const pct = pp.totalAvailable > 0 ? Math.min(100, (pp.totalSpent / pp.totalAvailable) * 100) : 0;
  const isOver = pp.isOverBudget;

  return (
    <div className="sheet">
      {violations.length > 0 && (
        <div className="sheet-violations">
          {violations.map((v, i) => (
            <div key={i} className="violation-badge">
              ⚠️ {t(v.rule)}: {v.formula}
            </div>
          ))}
        </div>
      )}

      <HeaderPanel />
      <OffensePanel />
      <ConditionsPanel />
      <AbilitiesPanel cost={pp.abilitiesCost} />
      <DefensesPanel cost={pp.defensesCost} />
      <SkillsPanel cost={pp.skillsCost} />
      <AdvantagesPanel cost={pp.advantagesCost} />
      <PowersList />
      <ComplicationsPanel />
      <EquipmentNotesPanel />
      <PPLogPanel />
      <NotesPanel />

      {/* PP Summary Footer */}
      <div className="pp-summary-footer">
        <div className="pp-summary-item">
          <span className="pp-summary-label">{t('summary.abilities')}</span>
          <span className="pp-summary-value">{pp.abilitiesCost}</span>
        </div>
        <div className="pp-summary-item">
          <span className="pp-summary-label">{t('summary.defenses')}</span>
          <span className="pp-summary-value">{pp.defensesCost}</span>
        </div>
        <div className="pp-summary-item">
          <span className="pp-summary-label">{t('summary.skills')}</span>
          <span className="pp-summary-value">{pp.skillsCost}</span>
        </div>
        <div className="pp-summary-item">
          <span className="pp-summary-label">{t('summary.advantages')}</span>
          <span className="pp-summary-value">{pp.advantagesCost}</span>
        </div>
        <div className="pp-summary-item">
          <span className="pp-summary-label">{t('summary.powers')}</span>
          <span className="pp-summary-value">{pp.powersCost}</span>
        </div>
        <div className="pp-summary-item">
          <span className="pp-summary-label">{t('summary.totalSpent')}</span>
          <span className={`pp-summary-value ${isOver ? 'pp-summary-value--error' : 'pp-summary-value--primary'}`}>
            {pp.totalSpent}
          </span>
        </div>
        <div className="pp-summary-item">
          <span className="pp-summary-label">{t('summary.remaining')}</span>
          <span className={`pp-summary-value ${isOver ? 'pp-summary-value--error' : 'pp-summary-value--success'}`}>
            {pp.isBudgetEnforced ? pp.remaining : <span className="infinity-symbol">∞</span>}
          </span>
        </div>
      </div>

      <div className="pp-progress-bar">
        <div
          className={`pp-progress-fill ${!pp.isBudgetEnforced ? 'pp-progress-fill--limitless' : ''}`}
          style={{ width: pp.isBudgetEnforced ? `${Math.min(100, pct)}%` : '100%' }}
          data-over={isOver}
        />
      </div>

      <style>{`
        .sheet {
          display: flex;
          flex-direction: column;
          gap: var(--s-lg);
          padding-bottom: var(--s-3xl);
          animation: fadeIn 0.3s ease;
        }
        .sheet-violations {
          display: flex;
          flex-wrap: wrap;
          gap: var(--s-sm);
        }
        .violation-badge {
          padding: var(--s-xs) var(--s-md);
          background: rgba(248, 113, 113, 0.15);
          border: 1px solid var(--c-error);
          border-radius: var(--r-full);
          font-size: 0.78rem;
          color: var(--c-error);
          font-weight: 500;
          animation: shake 0.3s ease;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.8; text-shadow: 0 0 8px rgba(var(--c-primary-rgb), 0.4); }
          50% { opacity: 1; text-shadow: 0 0 16px rgba(var(--c-primary-rgb), 0.8); }
        }
        .infinity-symbol {
          display: inline-block;
          animation: pulse-glow 2s ease-in-out infinite;
          color: var(--c-primary);
          font-weight: bold;
        }
        .pp-progress-fill--limitless {
          animation: pulse-glow-bar 2s ease-in-out infinite;
        }
        @keyframes pulse-glow-bar {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
