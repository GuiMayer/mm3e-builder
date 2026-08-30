import { lazy, Suspense, useState } from 'react';
import { useActiveCharacter } from '../../shared/hooks/useActiveCharacter';
import { useCharacterActions } from '../../shared/hooks/useCharacterActions';
import type { ICharacterPower } from '../../entities/types';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { calcPowerTotalCost } from '../../shared/lib/mathEngine';
import { Tooltip } from '../../shared/ui/Tooltip';
import { Plus, Edit3, Trash2, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDialog } from '../../shared/ui/appDialogContext';
import { resolveModifierDefinition } from '../../shared/lib/rulesCatalog';

const PowerBuilderOverlay = lazy(() =>
  import('../power-builder/PowerBuilderOverlay').then((module) => ({ default: module.PowerBuilderOverlay }))
);

export function PowersList() {
  const { t } = useTranslation();
  const powerDefs = useLocalizedData(POWER_DEFS);
  const modifierDefs = useLocalizedData(MODIFIER_DEFS);
  
  const { character } = useActiveCharacter();
  const { setPowers } = useCharacterActions();
  const powers = character.powers;
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const dialog = useAppDialog();



  function handleSavePower(power: ICharacterPower) {
    if (editIndex !== null) {
      const next = [...powers];
      next[editIndex] = power;
      setPowers(next);
    } else {
      setPowers([...powers, power]);
    }
    setBuilderOpen(false);
    setEditIndex(null);
  }

  async function handleDeletePower(index: number) {
    const power = powers[index];
    const altCount = power.alternateEffects.length;
    const msg = altCount > 0
      ? t('powers.deleteConfirmWithAlt', { name: power.name, count: altCount })
      : t('powers.deleteConfirm', { name: power.name });

    if (await dialog.confirm({ title: t('powers.deleteTitle'), message: msg, confirmLabel: t('common.delete'), danger: true })) {
      setPowers(powers.filter((_, i) => i !== index));
    }
  }

  function openNew() {
    setEditIndex(null);
    setBuilderOpen(true);
  }

  function openEdit(index: number) {
    setEditIndex(index);
    setBuilderOpen(true);
  }

  const totalPowersCost = powers.reduce(
    (sum, p) => sum + calcPowerTotalCost(p, powerDefs, modifierDefs),
    0
  );

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t('powers.title')}</h2>
        <span className="panel-cost">{totalPowersCost} {t('common.pp')}</span>
      </div>

      {powers.length === 0 && (
        <p className="power-empty">{t('powers.noPowers')}</p>
      )}

      <div className="powers-grid">
        {powers.map((power, i) => {
          const totalCost = calcPowerTotalCost(power, powerDefs, modifierDefs);

          // Build display info from components
          const effectNames = power.components
            .map((c) => powerDefs.find((d) => d.id === c.effectId))
            .filter(Boolean)
            .map((d) => `${d!.name} ${power.components.find((c) => c.effectId === d!.id)?.ranks ?? ''}`);

          const appliedModNames = power.components.flatMap((comp) =>
            comp.modifiers.map((m) => {
              const effectDef = powerDefs.find((definition) => definition.id === comp.effectId);
              const md = effectDef
                ? resolveModifierDefinition(m, effectDef, modifierDefs).definition
                : undefined;
              return md ? md.name : m.modifierId;
            })
          );

          return (
            <div key={power.id} className="power-card-item">
              <div className="power-card-top">
                <div className="power-card-icon">
                  <Zap size={18} />
                </div>
                <div className="power-card-info">
                  <span className="power-card-name">{power.name || t('powers.unnamed')}</span>
                  <span className="power-card-effect">{effectNames.join(' + ')}</span>
                  {power.descriptors && power.descriptors.length > 0 && (
                    <div className="power-card-descriptors">
                      {power.descriptors.map((desc, idx) => (
                        <span key={idx} className="power-descriptor-tag">{desc}</span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="power-card-cost">{totalCost} {t('common.pp')}</span>
              </div>

              {appliedModNames.length > 0 && (
                <div className="power-card-mods">
                  {appliedModNames.map((name, j) => (
                    <span key={j} className="power-mod-tag">{name}</span>
                  ))}
                </div>
              )}

              {power.alternateEffects.length > 0 && (
                <div className="power-alt-info">
                  {power.alternateEffects.map((ae) => {
                    const aeEffects = ae.components
                      .map((c) => powerDefs.find((d) => d.id === c.effectId)?.name)
                      .filter(Boolean)
                      .join(' + ');
                    return (
                      <span key={ae.id} className="power-alt-tag">
                        ↪ {ae.name || aeEffects || 'AE'}{ae.dynamic ? ' ⚡' : ''}
                      </span>
                    );
                  })}
                </div>
              )}

              {power.notes && (
                <p className="power-card-notes">{power.notes}</p>
              )}

              <div className="power-card-actions">
                <Tooltip content={t('powers.editTooltip')}>
                  <button onClick={() => openEdit(i)} className="power-action-btn">
                    <Edit3 size={14} /> {t('common.edit')}
                  </button>
                </Tooltip>
                <button onClick={() => handleDeletePower(i)} className="power-action-btn power-action-btn--danger" title={t('common.remove')}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button className="power-new-btn" onClick={openNew}>
        <Plus size={18} /> {t('powers.newPowerBtn')}
      </button>

      {builderOpen && (
        <Suspense fallback={<div className="panel">{t('common.loading')}</div>}>
          <PowerBuilderOverlay
            existingPower={editIndex !== null ? powers[editIndex] : undefined}
            onSave={handleSavePower}
            onClose={() => { setBuilderOpen(false); setEditIndex(null); }}
          />
        </Suspense>
      )}

      <style>{`
        .power-empty { color: var(--c-text-muted); font-size: 0.85rem; font-style: italic; }
        .powers-grid { display: flex; flex-direction: column; gap: var(--s-sm); }

        .power-card-item {
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-md); padding: var(--s-md);
          transition: border-color var(--t-fast), box-shadow var(--t-fast);
        }
        .power-card-item:hover {
          border-color: var(--c-border-active);
          box-shadow: 0 0 12px rgba(var(--c-primary-rgb), 0.15);
        }
        .power-card-top { display: flex; align-items: center; gap: var(--s-sm); }
        .power-card-icon {
          width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
          background: var(--c-primary-muted); border-radius: var(--r-sm); color: var(--c-primary);
        }
        .power-card-info { flex: 1; display: flex; flex-direction: column; }
        .power-card-name { font-weight: 700; font-size: 0.95rem; }
        .power-card-effect { font-size: 0.78rem; color: var(--c-text-secondary); }
        .power-card-cost { font-weight: 800; font-size: 1.1rem; color: var(--c-primary); font-variant-numeric: tabular-nums; }

        .power-card-mods { display: flex; flex-wrap: wrap; gap: 4px; margin-top: var(--s-sm); }
        .power-mod-tag {
          font-size: 0.7rem; padding: 2px 8px; border-radius: var(--r-full);
          background: var(--c-primary-muted); color: var(--c-primary); font-weight: 500;
        }
        .power-alt-info { display: flex; flex-wrap: wrap; gap: 4px; margin-top: var(--s-xs); }
        .power-alt-tag {
          font-size: 0.7rem; padding: 2px 8px; border-radius: var(--r-full);
          background: rgba(139,92,246,0.12); color: var(--c-accent); font-weight: 500;
          border: 1px solid rgba(139,92,246,0.25);
        }
        .power-card-notes { font-size: 0.78rem; color: var(--c-text-muted); font-style: italic; margin-top: var(--s-xs); }

        .power-card-actions {
          display: flex; gap: var(--s-xs); margin-top: var(--s-sm);
          padding-top: var(--s-sm); border-top: 1px solid var(--c-border);
        }
        .power-action-btn {
          display: flex; align-items: center; gap: 4px;
          background: transparent; border: 1px solid var(--c-border);
          border-radius: var(--r-sm); padding: 4px 10px;
          color: var(--c-text-secondary); font-family: var(--f-body);
          font-size: 0.75rem; cursor: pointer; transition: all var(--t-fast);
        }
        .power-action-btn:hover { background: var(--c-primary-muted); color: var(--c-primary); border-color: var(--c-primary); }
        .power-action-btn--danger:hover { background: rgba(248,113,113,0.15); color: var(--c-error); border-color: var(--c-error); }

        .power-new-btn {
          display: flex; align-items: center; justify-content: center; gap: var(--s-sm);
          margin-top: var(--s-sm); padding: var(--s-md);
          background: var(--c-primary-muted); border: 2px dashed var(--c-primary);
          border-radius: var(--r-md); color: var(--c-primary);
          font-family: var(--f-heading); font-size: 0.95rem; font-weight: 700;
          cursor: pointer; transition: all var(--t-fast); width: 100%;
        }
        .power-new-btn:hover { background: var(--c-primary); color: var(--c-text-inverse); box-shadow: var(--shadow-glow); }
      `}</style>
    </section>
  );
}
