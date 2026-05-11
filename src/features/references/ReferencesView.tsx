import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BASIC_CONDITIONS, COMBINED_CONDITIONS, CONDITIONS } from '../../data/conditions';
import { ChevronDown, ChevronRight } from 'lucide-react';

/* -- Static combat reference data ---------------------------------------- */

interface CombatAction {
  id: string;
  action: string;
  type: string;
  effect: string;
}

interface CombatManeuver {
  id: string;
  name: string;
  atkMod: string;
  defMod: string;
  effect: string;
}

const COMBAT_ACTIONS: CombatAction[] = [
  { id: 'aid',     action: 'Aid',     type: 'standard', effect: "+2 (or +5 on 2+ degrees) to an ally's check on the character's next turn" },
  { id: 'aim',     action: 'Aim',     type: 'standard', effect: '+2 circumstance bonus to the next ranged attack check (readied)' },
  { id: 'charge',  action: 'Charge',  type: 'standard', effect: 'Move in a straight line then make a close attack at the end' },
  { id: 'defend',  action: 'Defend',  type: 'standard', effect: "Opposed check; treat rolls of 10 or less as 10 for active defenses until next turn" },
  { id: 'disarm',  action: 'Disarm',  type: 'standard', effect: '-2 attack check; target makes STR check vs. attack result to retain weapon' },
  { id: 'escape',  action: 'Escape',  type: 'move',     effect: 'Opposed STR or Acrobatics check to break a Grab or restraint' },
  { id: 'grab',    action: 'Grab',    type: 'standard', effect: 'Attack check; target resists with STR or Dodge; if caught, target is hindered and vulnerable' },
  { id: 'recover', action: 'Recover', type: 'standard', effect: "Remove the character's highest active condition; once per combat encounter" },
  { id: 'smash',   action: 'Smash',   type: 'standard', effect: '-5 attack check against held or stationary objects; ignores Toughness cap' },
  { id: 'trip',    action: 'Trip',    type: 'standard', effect: '-2 attack check; target resists with STR or Acrobatics; on failure, target goes prone' },
];

const COMBAT_MANEUVERS: CombatManeuver[] = [
  { id: 'accurate_attack',  name: 'Accurate Attack',  atkMod: '+1 or +2', defMod: '--',       effect: '-1 or -2 to effect rank' },
  { id: 'allout_attack',    name: 'All-out Attack',   atkMod: '+1 or +2', defMod: '-1 or -2', effect: '--' },
  { id: 'defensive_attack', name: 'Defensive Attack', atkMod: '-1 or -2', defMod: '+1 or +2', effect: '--' },
  { id: 'power_attack',     name: 'Power Attack',     atkMod: '-1 or -2', defMod: '--',       effect: '+1 or +2 to effect rank' },
  { id: 'slam_attack',      name: 'Slam Attack',      atkMod: '-1 or -2', defMod: '+1 or +2', effect: "Charge variant; attacker takes half Toughness damage on a hit" },
  { id: 'team_attack',      name: 'Team Attack',      atkMod: '--',        defMod: '--',       effect: 'Multiple attackers hit simultaneously vs. one target; use highest result + 2 per extra' },
];

/* -- Accordion helper ------------------------------------------------------- */

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="ref-accordion">
      <button className="ref-accordion-toggle" onClick={() => setOpen((v) => !v)}>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {title}
      </button>
      {open && <div className="ref-accordion-body">{children}</div>}
    </div>
  );
}

/* -- Main view -------------------------------------------------------------- */

export function ReferencesView() {
  const { t } = useTranslation();

  return (
    <div className="references-view">
      <div className="ref-header">
        <h1 className="ref-title">{t('ref.title')}</h1>
        <p className="ref-subtitle">{t('ref.subtitle')}</p>
      </div>

      <div className="ref-grid">
        {/* Combat Actions (F-19) */}
        <div className="ref-card">
          <Accordion title={t('ref.combatActions')}>
            <table className="ref-table">
              <thead>
                <tr>
                  <th>{t('ref.col.action')}</th>
                  <th>{t('ref.col.type')}</th>
                  <th>{t('ref.col.effect')}</th>
                </tr>
              </thead>
              <tbody>
                {COMBAT_ACTIONS.map((row, i) => (
                  <tr key={i}>
                    <td className="ref-td--name">{t(`ref.actions.${row.id}`)}</td>
                    <td className="ref-td--type">{t(`ref.actionTypes.${row.type}`)}</td>
                    <td>{t(`ref.actionEffects.${row.id}`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Accordion>
        </div>

        {/* Combat Maneuvers (F-19) */}
        <div className="ref-card">
          <Accordion title={t('ref.combatManeuvers')}>
            <table className="ref-table">
              <thead>
                <tr>
                  <th>{t('ref.col.action')}</th>
                  <th>{t('ref.col.atk')}</th>
                  <th>{t('ref.col.def')}</th>
                  <th>{t('ref.col.effect')}</th>
                </tr>
              </thead>
              <tbody>
                {COMBAT_MANEUVERS.map((row, i) => (
                  <tr key={i}>
                    <td className="ref-td--name">{t(`ref.maneuvers.${row.id}`)}</td>
                    <td className="ref-td--type">{row.atkMod}</td>
                    <td className="ref-td--type">{row.defMod}</td>
                    <td>{t(`ref.maneuverEffects.${row.id}`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Accordion>
        </div>

        {/* Basic Conditions (F-20) */}
        <div className="ref-card">
          <Accordion title={t('ref.conditions')}>
            <table className="ref-table">
              <thead>
                <tr>
                  <th>{t('ref.col.condition')}</th>
                  <th>{t('ref.col.description')}</th>
                </tr>
              </thead>
              <tbody>
                {BASIC_CONDITIONS.map((cond) => (
                  <tr key={cond.id}>
                    <td className="ref-td--name">{t(`conditions.${cond.id}`, { defaultValue: cond.name })}</td>
                    <td className="ref-td--desc">{t(`conditions.desc.${cond.id}`, { defaultValue: cond.description })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Accordion>
        </div>

        {/* Combined Conditions (F-20) */}
        <div className="ref-card">
          <Accordion title={t('ref.combinedConditions')}>
            <table className="ref-table">
              <thead>
                <tr>
                  <th>{t('ref.col.condition')}</th>
                  <th>{t('ref.col.components')}</th>
                  <th>{t('ref.col.description')}</th>
                </tr>
              </thead>
              <tbody>
                {COMBINED_CONDITIONS.map((cond) => (
                  <tr key={cond.id}>
                    <td className="ref-td--name">{t(`conditions.${cond.id}`, { defaultValue: cond.name })}</td>
                    <td className="ref-td--components">
                      {(cond.components ?? [])
                        .map((id) => CONDITIONS.find((c) => c.id === id)?.name ?? id)
                        .join(' + ')}
                    </td>
                    <td className="ref-td--desc">{t(`conditions.desc.${cond.id}`, { defaultValue: cond.description })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Accordion>
        </div>
      </div>

      <style>{`
        .references-view {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--s-xl) var(--s-lg);
          display: flex;
          flex-direction: column;
          gap: var(--s-xl);
        }
        .ref-header {
          text-align: center;
          margin-bottom: var(--s-md);
        }
        .ref-title {
          font-family: var(--f-heading);
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, var(--c-primary), var(--c-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 var(--s-xs);
        }
        .ref-subtitle {
          color: var(--c-text-muted);
          font-size: 0.9rem;
          margin: 0;
        }
        .ref-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--s-lg);
        }
        @media (max-width: 900px) {
          .ref-grid { grid-template-columns: 1fr; }
        }
        .ref-card {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--r-lg);
          overflow: hidden;
        }
        .ref-accordion-toggle {
          display: flex;
          align-items: center;
          gap: var(--s-xs);
          width: 100%;
          padding: var(--s-md) var(--s-lg);
          background: var(--c-surface-elevated);
          border: none;
          border-bottom: 1px solid var(--c-border);
          color: var(--c-text);
          font-family: var(--f-heading);
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          text-align: left;
          transition: background var(--t-fast);
        }
        .ref-accordion-toggle:hover { background: var(--c-primary-muted); }
        .ref-accordion-body {
          overflow-x: auto;
        }
        .ref-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
        }
        .ref-table th {
          background: var(--c-bg);
          padding: var(--s-xs) var(--s-md);
          text-align: left;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--c-text-muted);
          border-bottom: 1px solid var(--c-border);
        }
        .ref-table td {
          padding: var(--s-xs) var(--s-md);
          border-bottom: 1px solid var(--c-border);
          color: var(--c-text-secondary);
          vertical-align: top;
          line-height: 1.5;
        }
        .ref-table tr:last-child td { border-bottom: none; }
        .ref-table tr:hover td { background: var(--c-surface-elevated); }
        .ref-td--name {
          font-weight: 600;
          color: var(--c-text);
          white-space: nowrap;
          width: 130px;
        }
        .ref-td--type {
          white-space: nowrap;
          color: var(--c-primary);
          font-weight: 600;
          width: 80px;
        }
        .ref-td--components {
          white-space: nowrap;
          color: var(--c-accent);
          font-size: 0.75rem;
          width: 160px;
        }
        .ref-td--desc {
          font-size: 0.8rem;
          color: var(--c-text-muted);
        }
      `}</style>
    </div>
  );
}
