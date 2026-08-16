import { lazy, Suspense, useState } from 'react';
import { useActiveCharacter } from '../../shared/hooks/useActiveCharacter';
import { useCharacterActions } from '../../shared/hooks/useCharacterActions';
import { useTranslation } from 'react-i18next';
import { Package, Plus, Edit3, Trash2, AlertTriangle } from 'lucide-react';
import type { ICharacterPower } from '../../entities/types';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { calcEquipmentEPCost } from '../../shared/lib/mathEngine';
import { useCalculatedPP } from '../../shared/hooks/useCalculatedPP';
import { useAppDialog } from '../../shared/ui/appDialogContext';

const PowerBuilderOverlay = lazy(() =>
  import('../power-builder/PowerBuilderOverlay').then((module) => ({ default: module.PowerBuilderOverlay }))
);

/**
 * EquipmentNotesPanel — F-15 (v2.0)
 *
 * Equipment section that uses PowerBuilderOverlay.
 * Equipment items are stored as ICharacterPower[] with removable='none'.
 * EP cost is calculated via calcEquipmentEPCost() which does NOT apply
 * the removable discount (it's inherent in the Equipment advantage system).
 * Only visible when the Equipment advantage is purchased.
 * EP budget = Equipment advantage ranks × 5.
 */
export function EquipmentNotesPanel() {
  const { t } = useTranslation();
  const powerDefs = useLocalizedData(POWER_DEFS);
  const modifierDefs = useLocalizedData(MODIFIER_DEFS);
  
  const { character } = useActiveCharacter();
  const { setEquipment } = useCharacterActions();
  const equipmentRaw = character.equipment;
  const equipment = equipmentRaw ?? [];
  const dialog = useAppDialog();
  
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // F-15: Get equipment validation data
  const { equipmentRanks, totalEPUsed, equipmentEPLimit, isOverEquipmentLimit } = useCalculatedPP();

  // Don't render if Equipment advantage is not purchased
  if (equipmentRanks === 0) return null;

  function handleSaveEquipment(power: ICharacterPower) {
    // Equipment items should NOT have removable set — EP cost is calculated
    // without removable discount (it's inherent in the Equipment advantage).
    // Strip removable if user set it accidentally in Power Builder.
    const equipmentItem: ICharacterPower = {
      ...power,
      removable: 'none',
    };

    if (editIndex !== null) {
      const next = [...equipment];
      next[editIndex] = equipmentItem;
      setEquipment(next);
    } else {
      setEquipment([...equipment, equipmentItem]);
    }
    setBuilderOpen(false);
    setEditIndex(null);
  }

  async function handleDeleteEquipment(index: number) {
    const item = equipment[index];
    const msg = t('equipment.deleteConfirm', { name: item.name }) || `Delete ${item.name}?`;
    
    if (await dialog.confirm({ title: 'Delete equipment', message: msg, confirmLabel: 'Delete', danger: true })) {
      setEquipment(equipment.filter((_, i) => i !== index));
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

  // Prepare the power for editing — equipment does not use removable
  function getEditPower(): ICharacterPower | undefined {
    if (editIndex === null) return undefined;
    const item = equipment[editIndex];
    return { ...item, removable: 'none' };
  }

  return (
    <section className="panel equipment-notes-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <Package size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          {t('equipment.title')}
        </h2>
        <span className={`panel-cost ${isOverEquipmentLimit ? 'panel-cost--error' : ''}`}>{totalEPUsed} / {equipmentEPLimit} {t('equipment.ep')}</span>
      </div>

      {/* F-15: Equipment EP Limit validation warning */}
      {isOverEquipmentLimit && (
        <div className="equipment-limit-warning">
          <AlertTriangle size={16} />
          <div className="equipment-limit-warning-content">
            <strong>
              {t('equipment.limitExceededTitle') || 'Equipment Point limit exceeded!'}
            </strong>
            <div className="equipment-limit-calc">
              <span>{t('equipment.limitCalcBudget') || 'Budget'}: {equipmentRanks} {t('equipment.limitCalcRanks') || 'ranks'} × 5 = <strong>{equipmentEPLimit} {t('equipment.ep')}</strong></span>
              <span>{t('equipment.limitCalcUsed') || 'Used'}: <strong>{totalEPUsed} {t('equipment.ep')}</strong></span>
              <span className="equipment-limit-over">
                {t('equipment.limitCalcOver') || 'Over by'}: <strong>{totalEPUsed - equipmentEPLimit} {t('equipment.ep')}</strong>
              </span>
            </div>
            <span className="equipment-limit-hint">
              {t('equipment.limitHint') || 'Increase Equipment advantage ranks or remove equipment items.'}
            </span>
          </div>
        </div>
      )}

      {/* Equipment Items List */}
      {equipment.length > 0 && (
        <div className="equipment-grid">
          {equipment.map((item, i) => {
            const totalCost = calcEquipmentEPCost(item, powerDefs, modifierDefs);

            // Build display info from components
            const effectNames = item.components
              .map((c) => powerDefs.find((d) => d.id === c.effectId))
              .filter(Boolean)
              .map((d) => `${d!.name} ${item.components.find((c) => c.effectId === d!.id)?.ranks ?? ''}`);

            const appliedModNames = item.components.flatMap((comp) =>
              comp.modifiers.map((m) => {
                const md = modifierDefs.find((d) => d.id === m.modifierId);
                return md ? md.name : m.modifierId;
              })
            );

            return (
              <div key={item.id} className="equipment-card-item">
                <div className="equipment-card-top">
                  <div className="equipment-card-icon">
                    <Package size={18} />
                  </div>
                  <div className="equipment-card-info">
                    <span className="equipment-card-name">{item.name || t('equipment.unnamed')}</span>
                    <span className="equipment-card-effect">{effectNames.join(' + ')}</span>
                  </div>
                  <span className="equipment-card-cost">{totalCost} {t('equipment.ep')}</span>
                </div>

                {appliedModNames.length > 0 && (
                  <div className="equipment-card-mods">
                    {appliedModNames.map((name, j) => (
                      <span key={j} className="equipment-mod-tag">{name}</span>
                    ))}
                  </div>
                )}

                {item.alternateEffects.length > 0 && (
                  <div className="equipment-alt-info">
                    {item.alternateEffects.map((ae) => {
                      const aeEffects = ae.components
                        .map((c) => powerDefs.find((d) => d.id === c.effectId)?.name)
                        .filter(Boolean)
                        .join(' + ');
                      return (
                        <span key={ae.id} className="equipment-alt-tag">
                          ↪ {ae.name || aeEffects || 'AE'}{ae.dynamic ? ' ⚡' : ''}
                        </span>
                      );
                    })}
                  </div>
                )}

                {item.notes && (
                  <p className="equipment-card-notes">{item.notes}</p>
                )}

                <div className="equipment-card-actions">
                  <button onClick={() => openEdit(i)} className="equipment-action-btn">
                    <Edit3 size={14} /> {t('common.edit')}
                  </button>
                  <button 
                    onClick={() => handleDeleteEquipment(i)} 
                    className="equipment-action-btn equipment-action-btn--danger" 
                    title={t('common.remove')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {equipment.length === 0 && (
        <p className="equipment-empty">{t('equipment.noEquipment') || 'No equipment added yet. Use the button below to add equipment items.'}</p>
      )}

      <button className="equipment-new-btn" onClick={openNew}>
        <Plus size={18} /> {t('equipment.newEquipmentBtn')}
      </button>

      {/* Power Builder Overlay — reused for equipment */}
      {builderOpen && (
        <Suspense fallback={<div className="panel">{t('common.loading', { defaultValue: 'Loading...' })}</div>}>
          <PowerBuilderOverlay
            existingPower={getEditPower()}
            onSave={handleSaveEquipment}
            onClose={() => {
              setBuilderOpen(false);
              setEditIndex(null);
            }}
            equipmentMode={true}
          />
        </Suspense>
      )}

      <style>{`
        .equipment-notes-panel .panel-header {
          align-items: center;
          justify-content: space-between;
        }
        .equipment-notes-panel .panel-cost--error {
          color: var(--c-error, #ef4444);
          font-weight: 700;
          animation: shake 0.3s ease;
        }
        .equipment-limit-warning {
          display: flex;
          align-items: flex-start;
          gap: var(--s-sm);
          padding: var(--s-md);
          background: var(--c-error-bg, rgba(239, 68, 68, 0.1));
          border: 1px solid var(--c-error, #ef4444);
          border-radius: var(--r-md);
          color: var(--c-error, #ef4444);
          font-size: 0.875rem;
          margin-bottom: var(--s-md);
        }
        .equipment-limit-warning svg {
          flex-shrink: 0;
          margin-top: 2px;
        }
        .equipment-limit-warning-content {
          display: flex;
          flex-direction: column;
          gap: var(--s-xs);
        }
        .equipment-limit-calc {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 0.8rem;
          font-variant-numeric: tabular-nums;
          padding: var(--s-xs) var(--s-sm);
          background: rgba(0, 0, 0, 0.08);
          border-radius: var(--r-sm);
        }
        .equipment-limit-over {
          color: var(--c-error, #ef4444);
        }
        .equipment-limit-hint {
          font-size: 0.78rem;
          opacity: 0.85;
          font-style: italic;
        }
        .equipment-empty {
          color: var(--c-text-muted);
          font-size: 0.85rem;
          font-style: italic;
        }
        .equipment-grid {
          display: flex;
          flex-direction: column;
          gap: var(--s-sm);
          margin-bottom: var(--s-lg);
        }
        .equipment-card-item {
          background: var(--c-surface-elevated);
          border: 1px solid var(--c-border);
          border-radius: var(--r-md);
          padding: var(--s-md);
          transition: border-color var(--t-fast), box-shadow var(--t-fast);
        }
        .equipment-card-item:hover {
          border-color: var(--c-border-active);
          box-shadow: 0 0 12px rgba(var(--c-primary-rgb), 0.15);
        }
        .equipment-card-top {
          display: flex;
          align-items: center;
          gap: var(--s-sm);
        }
        .equipment-card-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--c-primary-muted);
          border-radius: var(--r-sm);
          color: var(--c-primary);
        }
        .equipment-card-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .equipment-card-name {
          font-weight: 700;
          font-size: 0.95rem;
        }
        .equipment-card-effect {
          font-size: 0.78rem;
          color: var(--c-text-secondary);
        }
        .equipment-card-cost {
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--c-primary);
          font-variant-numeric: tabular-nums;
        }
        .equipment-card-mods {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: var(--s-sm);
        }
        .equipment-mod-tag {
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: var(--r-full);
          background: var(--c-primary-muted);
          color: var(--c-primary);
          font-weight: 500;
        }
        .equipment-alt-info {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: var(--s-xs);
        }
        .equipment-alt-tag {
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: var(--r-full);
          background: rgba(139,92,246,0.12);
          color: var(--c-accent);
          font-weight: 500;
          border: 1px solid rgba(139,92,246,0.25);
        }
        .equipment-card-notes {
          font-size: 0.78rem;
          color: var(--c-text-muted);
          font-style: italic;
          margin-top: var(--s-xs);
        }
        .equipment-card-actions {
          display: flex;
          gap: var(--s-xs);
          margin-top: var(--s-sm);
          padding-top: var(--s-sm);
          border-top: 1px solid var(--c-border);
        }
        .equipment-action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: 1px solid var(--c-border);
          border-radius: var(--r-sm);
          padding: 4px 10px;
          color: var(--c-text-secondary);
          font-family: var(--f-body);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all var(--t-fast);
        }
        .equipment-action-btn:hover {
          background: var(--c-primary-muted);
          color: var(--c-primary);
          border-color: var(--c-primary);
        }
        .equipment-action-btn--danger:hover {
          background: rgba(248,113,113,0.15);
          color: var(--c-error);
          border-color: var(--c-error);
        }
        .equipment-new-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--s-sm);
          margin-top: var(--s-sm);
          padding: var(--s-md);
          background: var(--c-primary-muted);
          border: 2px dashed var(--c-primary);
          border-radius: var(--r-md);
          color: var(--c-primary);
          font-family: var(--f-heading);
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--t-fast);
          width: 100%;
        }
        .equipment-new-btn:hover {
          background: var(--c-primary);
          color: var(--c-text-inverse);
          box-shadow: var(--shadow-glow);
        }
      `}</style>
    </section>
  );
}
