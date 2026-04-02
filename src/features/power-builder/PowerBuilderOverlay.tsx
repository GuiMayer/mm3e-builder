import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import type { ICharacterPower, IAlternateEffect, IModifierDef } from '../../entities/types';
import powerDefsRaw from '../../data/powers.json';
import modifierDefsRaw from '../../data/modifiers.json';
import { calculatePowerCost, calculateArrayCost } from '../../shared/lib/mathEngine';
import { EffectPalette } from './EffectPalette';
import { X, Save, Plus, Trash2, Zap } from 'lucide-react';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { useTranslation } from 'react-i18next';

// ── Droppable Zone Component ──
function ModifierDropzone({ activeId, children }: { activeId: string | null; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'power-dropzone' });
  return (
    <div
      ref={setNodeRef}
      className={`build-dropzone ${isOver || activeId ? 'build-dropzone--active' : ''}`}
    >
      {children}
    </div>
  );
}

interface Props {
  existingPower?: ICharacterPower;
  onSave: (power: ICharacterPower) => void;
  onClose: () => void;
}

export function PowerBuilderOverlay({ existingPower, onSave, onClose }: Props) {
  const { t } = useTranslation();
  const powerDefs = useLocalizedData(powerDefsRaw);
  const modifierDefs = useLocalizedData(modifierDefsRaw);

  const [power, setPower] = useState<ICharacterPower>(
    existingPower ?? {
      id: uuidv4(),
      name: '',
      effectId: '',
      ranks: 1,
      modifiers: [],
      notes: '',
      alternateEffects: [],
    }
  );

  const [paletteFilter, setPaletteFilter] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const selectedEffect = powerDefs.find((d) => d.id === power.effectId);

  // Calculate costs
  const mainCost = useMemo(() => {
    if (!selectedEffect) return 0;
    return calculatePowerCost(selectedEffect.baseCost, power.ranks, power.modifiers, modifierDefs as unknown as IModifierDef[]);
  }, [selectedEffect, power.ranks, power.modifiers, modifierDefs]);

  const dynamicCount = power.alternateEffects.filter((a) => a.dynamic).length;
  const totalCost = calculateArrayCost(mainCost, power.alternateEffects.length, dynamicCount);

  // Drag handlers
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || over.id !== 'power-dropzone') return;

    const modId = active.id as string;
    // Check if already applied
    const alreadyApplied = power.modifiers.find((m) => m.modifierId === modId);
    if (alreadyApplied) {
      // Increment ranks for flat mods
      setPower((p) => ({
        ...p,
        modifiers: p.modifiers.map((m) =>
          m.modifierId === modId ? { ...m, ranks: m.ranks + 1 } : m
        ),
      }));
    } else {
      setPower((p) => ({
        ...p,
        modifiers: [...p.modifiers, { modifierId: modId, ranks: 1 }],
      }));
    }
  }

  function removeModifier(modId: string) {
    setPower((p) => ({
      ...p,
      modifiers: p.modifiers.filter((m) => m.modifierId !== modId),
    }));
  }

  function updateModifierRanks(modId: string, ranks: number) {
    setPower((p) => ({
      ...p,
      modifiers: p.modifiers.map((m) =>
        m.modifierId === modId ? { ...m, ranks: Math.max(1, ranks) } : m
      ),
    }));
  }

  function addAlternateEffect() {
    const alt: IAlternateEffect = {
      id: uuidv4(),
      name: '',
      effectId: '',
      ranks: 1,
      modifiers: [],
      dynamic: false,
      notes: '',
    };
    setPower((p) => ({ ...p, alternateEffects: [...p.alternateEffects, alt] }));
  }

  function removeAlternateEffect(id: string) {
    setPower((p) => ({
      ...p,
      alternateEffects: p.alternateEffects.filter((a) => a.id !== id),
    }));
  }

  function updateAlternateEffect(id: string, update: Partial<IAlternateEffect>) {
    setPower((p) => ({
      ...p,
      alternateEffects: p.alternateEffects.map((a) =>
        a.id === id ? { ...a, ...update } : a
      ),
    }));
  }

  function handleSave() {
    if (!power.effectId) return;
    onSave(power);
  }

  const activeMod = activeId ? modifierDefs.find((m) => m.id === activeId) : null;

  return (
    <div className="builder-overlay">
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Top Bar */}
        <div className="builder-topbar">
          <h2 className="builder-topbar-title">
            <Zap size={18} /> {t('builder.title')}
          </h2>
          <div className="builder-topbar-actions">
            <button className="builder-action-btn" onClick={addAlternateEffect}>
              <Plus size={14} /> {t('builder.addAlternate')}
            </button>
            <button className="builder-action-btn builder-save-btn" onClick={handleSave} disabled={!power.effectId}>
              <Save size={14} /> {t('builder.save')}
            </button>
            <button className="builder-action-btn builder-close-btn" onClick={onClose}>
              <X size={14} /> {t('builder.close')}
            </button>
          </div>
        </div>

        <div className="builder-body">
          {/* Sidebar: Effect Palette */}
          <EffectPalette filter={paletteFilter} onFilterChange={setPaletteFilter} />

          {/* Main: Build Workspace */}
          <div className="builder-workspace">
            {/* Effect Selector */}
            <div className="build-section">
              <label className="build-label">{t('builder.baseEffect')}</label>
              <select
                className="build-select"
                value={power.effectId}
                onChange={(e) => setPower((p) => ({ ...p, effectId: e.target.value }))}
              >
                <option value="">{t('builder.selectEffect')}</option>
                {powerDefs.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({t('common.costBase')}: {d.baseCost}/{t('common.rank')})</option>
                ))}
              </select>
            </div>

            {/* Name and Ranks */}
            <div className="build-row">
              <div className="build-section build-section--flex">
                <label className="build-label">{t('builder.powerName')}</label>
                <input
                  className="build-input"
                  value={power.name}
                  onChange={(e) => setPower((p) => ({ ...p, name: e.target.value }))}
                  placeholder={t('builder.powerNamePlaceholder')}
                />
              </div>
              <div className="build-section">
                <label className="build-label">{t('builder.ranks')}</label>
                <input
                  type="number" min={1}
                  className="build-input build-input--small"
                  value={power.ranks}
                  onChange={(e) => setPower((p) => ({ ...p, ranks: Math.max(1, Number(e.target.value) || 1) }))}
                />
              </div>
            </div>

            {selectedEffect && (
              <div className="build-effect-info">
                <span className="effect-badge">{selectedEffect.type}</span>
                <span className="effect-detail">{t('common.action')}: {selectedEffect.action}</span>
                <span className="effect-detail">{t('common.range')}: {selectedEffect.range}</span>
                <span className="effect-detail">{t('common.duration')}: {selectedEffect.duration}</span>
                <p className="effect-desc">{selectedEffect.description}</p>
              </div>
            )}

            {/* Dropzone for Modifiers */}
            <div className="build-section">
              <label className="build-label">{t('builder.modifiers')}</label>
              <ModifierDropzone activeId={activeId}>
                {power.modifiers.length === 0 && !activeId && (
                  <span className="dropzone-placeholder">{t('builder.dropHere')}</span>
                )}
                {power.modifiers.map((applied) => {
                  const def = modifierDefs.find((d) => d.id === applied.modifierId);
                  if (!def) return null;
                  return (
                    <div key={applied.modifierId} className={`applied-mod ${def.category === 'flaw' ? 'applied-mod--flaw' : ''}`}>
                      <span className="applied-mod-name">{def.name}</span>
                      {def.costType === 'flat' && (
                        <input
                          type="number" min={1}
                          className="applied-mod-ranks"
                          value={applied.ranks}
                          onChange={(e) => updateModifierRanks(applied.modifierId, Number(e.target.value) || 1)}
                        />
                      )}
                      <span className="applied-mod-cost">
                        {def.costValue > 0 ? '+' : ''}{def.costValue}/{def.costType === 'per_rank' ? t('common.rank') : t('common.flat')}
                      </span>
                      <button className="applied-mod-remove" onClick={() => removeModifier(applied.modifierId)}>
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </ModifierDropzone>
            </div>

            {/* Notes */}
            <div className="build-section">
              <label className="build-label">{t('builder.notes')}</label>
              <textarea
                className="build-textarea"
                value={power.notes}
                onChange={(e) => setPower((p) => ({ ...p, notes: e.target.value }))}
                placeholder={t('builder.notesPlaceholder')}
                rows={2}
              />
            </div>

            {/* Alternate Effects */}
            {power.alternateEffects.length > 0 && (
              <div className="build-section">
                <label className="build-label">{t('builder.alternateEffects')}</label>
                {power.alternateEffects.map((alt) => (
                  <div key={alt.id} className="alt-effect-card">
                    <div className="alt-effect-row">
                      <input
                        className="build-input build-input--sm"
                        value={alt.name}
                        onChange={(e) => updateAlternateEffect(alt.id, { name: e.target.value })}
                        placeholder={t('builder.powerName')}
                      />
                      <select
                        className="build-select build-select--sm"
                        value={alt.effectId}
                        onChange={(e) => updateAlternateEffect(alt.id, { effectId: e.target.value })}
                      >
                        <option value="">{t('common.select')}</option>
                        {powerDefs.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                      <input
                        type="number" min={1}
                        className="build-input build-input--tiny"
                        value={alt.ranks}
                        onChange={(e) => updateAlternateEffect(alt.id, { ranks: Math.max(1, Number(e.target.value) || 1) })}
                      />
                      <label className="alt-dynamic-label">
                        <input
                          type="checkbox"
                          checked={alt.dynamic}
                          onChange={(e) => updateAlternateEffect(alt.id, { dynamic: e.target.checked })}
                        />
                        {t('builder.dynamic')}
                      </label>
                      <button className="alt-remove" onClick={() => removeAlternateEffect(alt.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer: Cost Summary */}
        <div className="builder-footer">
          <div className="cost-breakdown">
            {selectedEffect && (
              <>
                <span>{t('builder.base')}: {selectedEffect.baseCost}/{t('common.rank')}</span>
                <span className="cost-sep">×</span>
                <span>{power.ranks} {t('common.ranks')}</span>
                {power.modifiers.length > 0 && (
                  <>
                    <span className="cost-sep">+</span>
                    <span>{t('builder.mods', { count: power.modifiers.length })}</span>
                  </>
                )}
                {power.alternateEffects.length > 0 && (
                  <>
                    <span className="cost-sep">+</span>
                    <span>{t('builder.alts', { count: power.alternateEffects.length })}</span>
                  </>
                )}
              </>
            )}
          </div>
          <div className="cost-total">
            <span className="cost-total-label">{t('builder.total')}:</span>
            <span className="cost-total-value">{totalCost} {t('common.pp')}</span>
          </div>
        </div>

        <DragOverlay>
          {activeMod && (
            <div className="drag-ghost">
              <span>{activeMod.name}</span>
              <span className="drag-ghost-cost">
                {activeMod.costValue > 0 ? '+' : ''}{activeMod.costValue}
              </span>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <style>{`
        .builder-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: var(--c-bg);
          display: flex; flex-direction: column;
          animation: fadeIn 0.2s ease;
        }
        .builder-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: var(--s-sm) var(--s-lg);
          background: var(--c-surface); border-bottom: 1px solid var(--c-border);
        }
        .builder-topbar-title {
          display: flex; align-items: center; gap: var(--s-sm);
          font-size: 1rem; font-weight: 700; color: var(--c-primary);
        }
        .builder-topbar-actions { display: flex; gap: var(--s-xs); }
        .builder-action-btn {
          display: flex; align-items: center; gap: 4px;
          padding: var(--s-xs) var(--s-sm);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); color: var(--c-text-secondary);
          font-family: var(--f-body); font-size: 0.8rem; cursor: pointer;
          transition: all var(--t-fast);
        }
        .builder-action-btn:hover { border-color: var(--c-primary); color: var(--c-text); }
        .builder-save-btn { background: var(--c-primary); color: var(--c-text-inverse); border-color: var(--c-primary); }
        .builder-save-btn:hover { opacity: 0.9; }
        .builder-save-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .builder-close-btn:hover { border-color: var(--c-error); color: var(--c-error); }

        .builder-body {
          flex: 1; display: flex; overflow: hidden;
        }

        .builder-workspace {
          flex: 1; padding: var(--s-lg); overflow-y: auto;
          display: flex; flex-direction: column; gap: var(--s-md);
        }

        .build-section { display: flex; flex-direction: column; gap: var(--s-xs); }
        .build-section--flex { flex: 1; }
        .build-row { display: flex; gap: var(--s-md); }
        .build-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--c-text-secondary); }
        .build-select, .build-input, .build-textarea {
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); padding: var(--s-sm) var(--s-md);
          color: var(--c-text); font-family: var(--f-body); font-size: 0.9rem;
        }
        .build-select:focus, .build-input:focus, .build-textarea:focus {
          outline: none; border-color: var(--c-primary); box-shadow: 0 0 0 2px var(--c-primary-muted);
        }
        .build-input--small { width: 80px; text-align: center; }
        .build-input--sm { flex: 1; min-width: 100px; }
        .build-input--tiny { width: 55px; text-align: center; }
        .build-select--sm { flex: 1; min-width: 120px; }
        .build-textarea { resize: vertical; line-height: 1.5; }

        .build-effect-info {
          display: flex; flex-wrap: wrap; gap: var(--s-sm); align-items: center;
          padding: var(--s-sm) var(--s-md);
          background: var(--c-primary-muted); border-radius: var(--r-sm);
        }
        .effect-badge {
          font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
          padding: 2px 8px; border-radius: var(--r-full);
          background: var(--c-primary); color: var(--c-text-inverse);
        }
        .effect-detail { font-size: 0.78rem; color: var(--c-text-secondary); }
        .effect-desc { font-size: 0.82rem; color: var(--c-text); width: 100%; margin-top: var(--s-xs); }

        .build-dropzone {
          min-height: 80px; border: 2px dashed var(--c-border); border-radius: var(--r-md);
          padding: var(--s-md); display: flex; flex-wrap: wrap; gap: var(--s-sm);
          align-items: flex-start; transition: all var(--t-fast);
        }
        .build-dropzone--active { border-color: var(--c-primary); background: var(--c-primary-muted); }
        .dropzone-placeholder { color: var(--c-text-muted); font-size: 0.85rem; font-style: italic; }

        .applied-mod {
          display: flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: var(--r-full);
          background: rgba(74, 222, 128, 0.12); border: 1px solid rgba(74, 222, 128, 0.3);
          font-size: 0.8rem;
        }
        .applied-mod--flaw {
          background: rgba(248, 113, 113, 0.12); border-color: rgba(248, 113, 113, 0.3);
        }
        .applied-mod-name { font-weight: 600; }
        .applied-mod-ranks {
          width: 30px; text-align: center; background: var(--c-bg);
          border: 1px solid var(--c-border); border-radius: var(--r-sm);
          color: var(--c-text); font-size: 0.75rem; padding: 1px;
        }
        .applied-mod-cost { font-size: 0.7rem; color: var(--c-text-muted); }
        .applied-mod-remove {
          background: transparent; border: none; color: var(--c-text-muted);
          cursor: pointer; display: flex; transition: color var(--t-fast);
        }
        .applied-mod-remove:hover { color: var(--c-error); }

        .alt-effect-card {
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); padding: var(--s-sm); margin-bottom: var(--s-xs);
        }
        .alt-effect-row { display: flex; gap: var(--s-sm); align-items: center; flex-wrap: wrap; }
        .alt-dynamic-label {
          display: flex; align-items: center; gap: 4px;
          font-size: 0.78rem; color: var(--c-accent); cursor: pointer;
        }
        .alt-remove {
          background: transparent; border: none; color: var(--c-text-muted);
          cursor: pointer; display: flex; transition: color var(--t-fast);
        }
        .alt-remove:hover { color: var(--c-error); }

        .builder-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: var(--s-sm) var(--s-lg);
          background: var(--c-surface); border-top: 1px solid var(--c-border);
        }
        .cost-breakdown {
          display: flex; align-items: center; gap: var(--s-sm);
          font-size: 0.85rem; color: var(--c-text-secondary);
        }
        .cost-sep { color: var(--c-text-muted); }
        .cost-total { display: flex; align-items: center; gap: var(--s-sm); }
        .cost-total-label { font-size: 0.9rem; font-weight: 600; }
        .cost-total-value {
          font-family: var(--f-heading); font-size: 1.4rem;
          font-weight: 800; color: var(--c-primary);
        }

        .drag-ghost {
          display: flex; align-items: center; gap: var(--s-sm);
          padding: 6px 14px; border-radius: var(--r-full);
          background: var(--c-primary); color: var(--c-text-inverse);
          font-size: 0.82rem; font-weight: 600; box-shadow: var(--shadow-lg);
          opacity: 0.9;
        }
        .drag-ghost-cost { font-size: 0.7rem; opacity: 0.8; }
      `}</style>
    </div>
  );
}
