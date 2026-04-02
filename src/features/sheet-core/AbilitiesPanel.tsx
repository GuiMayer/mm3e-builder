import { useCharStore } from '../../store/charStore';
import type { AbilityKey } from '../../entities/types';
import { useTranslation } from 'react-i18next';

const ABILITY_KEYS: AbilityKey[] = ['str', 'sta', 'agl', 'dex', 'fgt', 'int', 'awe', 'pre'];

export function AbilitiesPanel({ cost }: { cost: number }) {
  const { t } = useTranslation();
  const abilities = useCharStore((s) => s.character.abilities);
  const absentAbilities = useCharStore((s) => s.character.absentAbilities);
  const setAbility = useCharStore((s) => s.setAbility);
  const toggleAbsentAbility = useCharStore((s) => s.toggleAbsentAbility);

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t('abilities.title')}</h2>
        <span className="panel-cost">{cost} {t('common.pp')}</span>
      </div>
      <div className="abilities-grid">
        {ABILITY_KEYS.map((key) => {
          const isAbsent = absentAbilities.includes(key);
          return (
            <div key={key} className={`ability-card ${isAbsent ? 'absent' : ''}`}>
              <span className="ability-abbr">{key.toUpperCase()}</span>
              <span className="ability-name">{t(`abilities.${key}`)}</span>
              {isAbsent ? (
                <span className="ability-value">--</span>
              ) : (
                <input
                  type="number"
                  className="ability-input"
                  value={abilities[key]}
                  onChange={(e) => setAbility(key, Number(e.target.value) || 0)}
                />
              )}
              <button
                className="ability-toggle"
                onClick={() => toggleAbsentAbility(key)}
                title={isAbsent ? t('abilities.restore') : t('abilities.absent')}
              >
                {isAbsent ? '✚' : '✕'}
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        .abilities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: var(--s-sm); }
        .ability-card {
          display: flex; flex-direction: column; align-items: center; gap: var(--s-xs);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-md); padding: var(--s-md) var(--s-sm);
          transition: all var(--t-fast); position: relative;
        }
        .ability-card:hover { border-color: var(--c-border-active); }
        .ability-card.absent { opacity: 0.4; }
        .ability-abbr { font-family: var(--f-heading); font-size: 0.7rem; font-weight: 800; color: var(--c-primary); letter-spacing: 0.1em; }
        .ability-name { font-size: 0.75rem; color: var(--c-text-secondary); }
        .ability-value { font-size: 1.3rem; font-weight: 700; color: var(--c-text-muted); }
        .ability-input {
          width: 60px; text-align: center;
          background: var(--c-bg); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); color: var(--c-text);
          font-family: var(--f-heading); font-size: 1.3rem; font-weight: 700;
          padding: var(--s-xs);
        }
        .ability-input:focus { outline: none; border-color: var(--c-primary); box-shadow: 0 0 0 2px var(--c-primary-muted); }
        .ability-toggle {
          position: absolute; top: 4px; right: 4px;
          background: transparent; border: none; color: var(--c-text-muted);
          cursor: pointer; font-size: 0.65rem; opacity: 0; transition: opacity var(--t-fast);
        }
        .ability-card:hover .ability-toggle { opacity: 1; }
      `}</style>
    </section>
  );
}
