import { InfoDialog } from '../../shared/ui/InfoDialog';
import { Tooltip } from '../../shared/ui/Tooltip';
import { memo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCharacterSelector } from '../../shared/hooks/useActiveCharacter';
import { useCharacterActions } from '../../shared/hooks/useCharacterActions';
import { useTranslation } from 'react-i18next';
import { useDerivedDefenses } from '../../shared/hooks/useDerivedDefenses';
import { Info } from 'lucide-react';
import { NumberInput } from '../../shared/ui/NumberInput';
import { getEffectiveAbilityRank } from '../../shared/lib/abilityRanks';
import { RollButton } from '../dice-roller/RollButton';

function DefensesPanelComponent({ cost }: { cost: number }) {
  const { t } = useTranslation();
  const character = useCharacterSelector(useShallow((value) => ({ abilities: value.abilities, absentAbilities: value.absentAbilities, defenses: value.defenses })));
  const { setDefense } = useCharacterActions();
  const abilities = character.abilities;
  const absentAbilities = character.absentAbilities;
  const defenses = character.defenses;

  const { toughnessBonus, toughnessTotal, toughnessBreakdown, initiativeTotal, initiativeBreakdown } =
    useDerivedDefenses();

  const [detail, setDetail] = useState<null | 'toughness' | 'initiative'>(null);

  const agility = getEffectiveAbilityRank(abilities, absentAbilities, 'agl');
  const fighting = getEffectiveAbilityRank(abilities, absentAbilities, 'fgt');
  const stamina = getEffectiveAbilityRank(abilities, absentAbilities, 'sta');
  const awareness = getEffectiveAbilityRank(abilities, absentAbilities, 'awe');

  const purchasedRows = [
    { key: 'dodge'     as const, base: agility, baseLabel: 'AGL' },
    { key: 'parry'     as const, base: fighting, baseLabel: 'FGT' },
    { key: 'fortitude' as const, base: stamina, baseLabel: 'STA' },
    { key: 'will'      as const, base: awareness, baseLabel: 'AWE' },
  ];

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t('defenses.title')}</h2>
        <span className="panel-cost">{cost} {t('common.pp')}</span>
      </div>

      <div className="defenses-table">

        {/* Initiative — read-only derived row */}
        <div
          className="defense-row defense-row--initiative"
        >
          <div className="defense-label">
            <span className="defense-name">{t('defenses.initiative')}</span>
            <Tooltip content={initiativeBreakdown.join('\n')}><button type="button" className="defense-detail-btn" aria-label={t('defenses.initiative')} aria-haspopup="dialog" onClick={() => setDetail('initiative')}><Info size={14} /></button></Tooltip>
          </div>
          <div className="defense-calculation">
          <span className="defense-base">AGL {agility}</span>
          <span className="defense-plus">+</span>
          <span className="defense-input defense-derived">{initiativeTotal - agility}</span>
          </div>
          <span className="sheet-check-result">
            <span className="defense-total">{initiativeTotal >= 0 ? `+${initiativeTotal}` : `${initiativeTotal}`}</span>
            <span className="sheet-roll-slot"><RollButton bonus={initiativeTotal} label={t('defenses.initiative')} section={t('defenses.title')} breakdown={initiativeBreakdown} /></span>
          </span>
        </div>

        <div className="defense-divider" />

        {/* Purchased defense rows */}
        {purchasedRows.map((r) => (
          <div key={r.key} className="defense-row">
            <span className="defense-name">{t(`defenses.${r.key}`)}</span>
            <div className="defense-calculation">
            <span className="defense-base">{r.baseLabel} {r.base}</span>
            <span className="defense-plus">+</span>
            <NumberInput
              variant="medium"
              className="defense-input"
              value={defenses[r.key]}
              onChange={(value) => setDefense(r.key, Math.max(0, value))}
              min={0}
            />
            </div>
            <span className="sheet-check-result">
              <span className="defense-total">{r.base + defenses[r.key]}</span>
              <span className="sheet-roll-slot">{(r.key === 'fortitude' || r.key === 'will') && <RollButton bonus={r.base + defenses[r.key]} label={t(`defenses.${r.key}`)} section={t('defenses.title')} breakdown={[`${r.baseLabel} ${r.base}`, `${t('common.ranks')} ${defenses[r.key]}`]} />}</span>
            </span>
          </div>
        ))}

        {/* Toughness — read-only, derived, with breakdown tooltip */}
        <div
          className="defense-row defense-row--readonly defense-row--toughness"
        >
          <div className="defense-label">
            <span className="defense-name">{t('defenses.toughness')}</span>
            <Tooltip content={['STA ' + stamina, ...toughnessBreakdown, '= ' + toughnessTotal].join('\n')}><button type="button" className="defense-detail-btn" aria-label={t('defenses.toughnessBreakdown')} aria-haspopup="dialog" onClick={() => setDetail('toughness')}><Info size={14} /></button></Tooltip>
          </div>
          <div className="defense-calculation">
          <span className="defense-base">STA {stamina}</span>
          <span className="defense-plus">+</span>
          <span className="defense-input defense-derived">{toughnessBonus}</span>
          </div>
          <span className="sheet-check-result">
            <span className="defense-total">{toughnessTotal}</span>
            <span className="sheet-roll-slot"><RollButton bonus={toughnessTotal} label={t('defenses.toughness')} section={t('defenses.title')} breakdown={[`STA ${stamina}`, ...toughnessBreakdown]} /></span>
          </span>
        </div>

      </div>

      {detail && <InfoDialog isOpen title={t(detail === 'initiative' ? 'defenses.initiative' : 'defenses.toughnessBreakdown')} onClose={() => setDetail(null)}>
        {(detail === 'initiative' ? initiativeBreakdown : ['STA ' + stamina, ...toughnessBreakdown, '= ' + toughnessTotal]).map((line, index) => <p key={index}>{line}</p>)}
      </InfoDialog>}

      <style>{`
        .defenses-table { display: flex; flex-direction: column; gap: var(--s-xs); }
        .defense-detail-btn{display:inline-flex;align-items:center;justify-content:center;padding:6px;min-width:32px;min-height:32px;background:transparent;border:0;color:var(--c-text-muted);cursor:pointer;}

        .defense-row {
          position: relative;
          display: grid; grid-template-columns: minmax(120px,1fr) auto auto; align-items: center; gap: var(--s-sm);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); padding: var(--s-sm) var(--s-md);
        }
        .defense-label,.defense-calculation { display: flex; align-items: center; gap: var(--s-xs); }
        .defense-calculation { flex-wrap: wrap; min-width: 0; }
        .defense-calculation>.number-input-wrapper { flex-shrink: 0; }
        .defense-row--readonly { cursor: default; }
        .defense-row--toughness:hover { border-color: var(--c-border-active); opacity: 1; }
        .defense-row--initiative {
          opacity: 1;
          cursor: default;
          border-style: dashed;
        }
        .defense-row--initiative:hover { border-color: var(--c-border-active); }

        .defense-divider {
          height: 1px;
          background: var(--c-border);
          margin: var(--s-xs) 0;
          opacity: 0.4;
        }

        .defense-name { font-weight: 600; font-size: 0.85rem; min-width: 0; }
        .defense-base { font-size: 0.78rem; color: var(--c-text-secondary); min-width: 60px; }
        .defense-plus { color: var(--c-text-muted); }

        .defense-input {
          width: 50px; text-align: center;
          background: var(--c-bg); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); color: var(--c-text);
          font-family: var(--f-body); font-size: 0.9rem; padding: var(--s-xs);
        }
        .defense-input:focus { outline: none; border-color: var(--c-primary); }

        .defense-derived {
          background: transparent;
          border-color: transparent;
          color: var(--c-text-muted);
          font-style: italic;
          font-size: 0.85rem;
          pointer-events: none;
        }

        .defense-total {
          font-weight: 700; font-size: 0.95rem;
          color: var(--c-primary); min-width: 40px;
          text-align: right;
        }

        /* Mobile responsive layout */
        @media (max-width: 768px) {
          .defense-detail-btn { min-width: 44px; min-height: 44px; }
          .defense-row {
            grid-template-columns: minmax(0,1fr) auto;
            gap: var(--s-xs);
          }
          .defense-row>.defense-name,.defense-label { grid-column: 1 / -1; }
          .defense-name {
            min-width: 80px;
          }
          .defense-base {
            min-width: 50px;
          }
          .defense-input {
            width: 60px;
          }
        }
        @media (max-width: 380px) {
          .defense-row { grid-template-columns: minmax(0,1fr); }
          .defense-row>.sheet-check-result { justify-self: end; }
        }
      `}</style>
    </section>
  );
}

export const DefensesPanel = memo(DefensesPanelComponent);
