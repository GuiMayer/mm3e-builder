import { useState } from 'react';
import { useCharStore } from '../../store/charStore';
import type { ICharacterPower, IModifierDef } from '../../entities/types';
import powerDefsRaw from '../../data/powers.json';
import modifierDefsRaw from '../../data/modifiers.json';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { calculatePowerCost, calculateArrayCost } from '../../shared/lib/mathEngine';
import { PowerBuilderOverlay } from '../power-builder/PowerBuilderOverlay';
import { Tooltip } from '../../shared/ui/Tooltip';
import { Plus, Edit3, Trash2, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function PowersList() {
  const { t } = useTranslation();
  const powerDefs = useLocalizedData(powerDefsRaw);
  const modifierDefs = useLocalizedData(modifierDefsRaw);
  
  const powers = useCharStore((s) => s.character.powers);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  function setPowers(next: ICharacterPower[]) {
    useCharStore.setState((s) => ({
      character: { ...s.character, powers: next },
      isDirty: true,
    }));
  }

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

  function handleDeletePower(index: number) {
    const power = powers[index];
    const altCount = power.alternateEffects.length;
    const msg = altCount > 0
      ? t('powers.deleteConfirmWithAlt', { name: power.name, count: altCount })
      : t('powers.deleteConfirm', { name: power.name });

    if (confirm(msg)) {
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

  // Calculate total power cost
  const totalPowersCost = powers.reduce((sum, p) => {
    const def = powerDefs.find((d) => d.id === p.effectId);
    const baseCost = def?.baseCost ?? 1;
    const mainCost = calculatePowerCost(baseCost, p.ranks, p.modifiers, modifierDefs as unknown as IModifierDef[]);
    const dynamicCount = p.alternateEffects.filter((a) => a.dynamic).length;
    return sum + calculateArrayCost(mainCost, p.alternateEffects.length, dynamicCount);
  }, 0);

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
          const effectDef = powerDefs.find((d) => d.id === power.effectId);
          const baseCost = effectDef?.baseCost ?? 1;
          const mainCost = calculatePowerCost(baseCost, power.ranks, power.modifiers, modifierDefs as unknown as IModifierDef[]);
          const dynamicCount = power.alternateEffects.filter((a) => a.dynamic).length;
          const totalCost = calculateArrayCost(mainCost, power.alternateEffects.length, dynamicCount);

          const appliedModNames = power.modifiers.map((m) => {
            const md = modifierDefs.find((d) => d.id === m.modifierId);
            return md ? md.name : m.modifierId;
          });

          return (
            <div key={power.id} className="power-card-item">
              <div className="power-card-top">
                <div className="power-card-icon">
                  <Zap size={18} />
                </div>
                <div className="power-card-info">
                  <span className="power-card-name">{power.name || t('powers.unnamed')}</span>
                  <span className="power-card-effect">{effectDef?.name || power.effectId} {power.ranks}</span>
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
                  <span>🔀 {power.alternateEffects.length} {t('powers.alternateEffects')}</span>
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
        <PowerBuilderOverlay
          existingPower={editIndex !== null ? powers[editIndex] : undefined}
          onSave={handleSavePower}
          onClose={() => { setBuilderOpen(false); setEditIndex(null); }}
        />
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
        .power-alt-info { font-size: 0.78rem; color: var(--c-accent); margin-top: var(--s-xs); }
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
