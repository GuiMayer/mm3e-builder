import { useState } from 'react';
import { useCharStore } from '../../store/charStore';
import { useTranslation } from 'react-i18next';
import { Package, Plus, Edit3, Trash2, AlertTriangle } from 'lucide-react';
import type { IEquipmentItem } from '../../entities/types';
import { EquipmentBuilder } from '../equipment-builder/EquipmentBuilder';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { useEquipmentCalculations } from '../equipment-builder/hooks/useEquipmentCalculations';
import { Tooltip } from '../../shared/ui/Tooltip';
import { useCalculatedPP } from '../../shared/hooks/useCalculatedPP';

/**
 * EquipmentNotesPanel — F-15 (v1.1)
 *
 * Supports both structured equipment items and free-text notes.
 * Data model:
 * - character.equipment: IEquipmentItem[]
 * - character.equipmentNotes: string
 */
export function EquipmentNotesPanel() {
  const { t } = useTranslation();
  const powerDefs = useLocalizedData(POWER_DEFS);
  const modifierDefs = useLocalizedData(MODIFIER_DEFS);
  
  const equipment = useCharStore((s) => s.character.equipment ?? []);
  const setEquipment = useCharStore((s) => s.setEquipment);
  const equipmentNotes = useCharStore((s) => s.character.equipmentNotes);
  const setEquipmentNotes = useCharStore((s) => s.setEquipmentNotes);
  
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // F-15: Get equipment validation data
  const { totalEPUsed, equipmentEPLimit, isOverEquipmentLimit } = useCalculatedPP();

  function handleSaveEquipment(item: IEquipmentItem) {
    if (editIndex !== null) {
      const next = [...equipment];
      next[editIndex] = item;
      setEquipment(next);
    } else {
      setEquipment([...equipment, item]);
    }
    setBuilderOpen(false);
    setEditIndex(null);
  }

  function handleDeleteEquipment(index: number) {
    const item = equipment[index];
    const msg = t('equipment.deleteConfirm', { name: item.name }) || `Delete ${item.name}?`;
    
    if (confirm(msg)) {
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

  return (
    <section className="panel equipment-notes-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <Package size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          {t('equipment.title')}
        </h2>
        {equipment.length > 0 && (
          <span className="panel-cost">{totalEPUsed} / {equipmentEPLimit} {t('equipment.ep')}</span>
        )}
      </div>

      {/* F-15: Equipment PP Limit validation warning */}
      {isOverEquipmentLimit && (
        <div className="equipment-limit-warning">
          <AlertTriangle size={16} />
          <span>
            {t('equipment.limitExceeded', { 
              used: totalEPUsed, 
              limit: equipmentEPLimit,
              over: totalEPUsed - equipmentEPLimit 
            }) || `Equipment limit exceeded! Using ${totalEPUsed} EP but limit is ${equipmentEPLimit} EP (${totalEPUsed - equipmentEPLimit} over). Increase Equipment advantage ranks or remove equipment.`}
          </span>
        </div>
      )}

      {/* Structured Equipment List */}
      {equipment.length > 0 && (
        <div className="equipment-grid">
          {equipment.map((item, i) => {
            // Calculate EP inline without using hook (hooks can't be called in loops)
            const baseCost = item.components.reduce((sum, comp) => {
              const effectDef = powerDefs.find((d) => d.id === comp.effectId);
              if (!effectDef) return sum;
              
              const rankCost = (effectDef.costPerRank ?? 1) * comp.ranks;
              const modCost = comp.modifiers.reduce((modSum, mod) => {
                const modDef = modifierDefs.find((m) => m.id === mod.modifierId);
                return modSum + (modDef?.flatCost ?? 0);
              }, 0);
              
              return sum + rankCost + modCost;
            }, 0);
            
            // Equipment discount: -2 per 5 PP (Easily Removable)
            const discount = Math.floor(baseCost / 5) * 2;
            const equipmentPoints = Math.max(1, baseCost - discount);
            
            // Add 1 EP per alternate effect if any
            const aeCount = item.alternateEffects?.length ?? 0;
            const totalEP = equipmentPoints + aeCount;

            // Build display info from components
            const effectNames = item.components
              .map((c) => powerDefs.find((d) => d.id === c.effectId))
              .filter(Boolean)
              .map((d) => `${d!.name} ${item.components.find((c) => c.effectId === d!.id)?.ranks ?? ''}`);

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
                  <span className="equipment-card-cost">{totalEP} {t('equipment.ep')}</span>
                </div>

                {item.notes && (
                  <p className="equipment-card-notes">{item.notes}</p>
                )}

                <div className="equipment-card-actions">
                  <Tooltip content={t('equipment.editTooltip')}>
                    <button onClick={() => openEdit(i)} className="equipment-action-btn">
                      <Edit3 size={14} /> {t('common.edit')}
                    </button>
                  </Tooltip>
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

      <button className="equipment-new-btn" onClick={openNew}>
        <Plus size={18} /> {t('equipment.newEquipmentBtn')}
      </button>

      {/* Free-text Equipment Notes */}
      <div className="equipment-notes-section">
        <label className="equipment-notes-label">{t('equipment.notesLabel')}</label>
        <textarea
          className="equipment-textarea"
          value={equipmentNotes}
          onChange={(e) => setEquipmentNotes(e.target.value)}
          placeholder={t('equipment.placeholder')}
          rows={5}
          spellCheck={false}
        />
      </div>

      {/* Equipment Builder Modal */}
      {builderOpen && (
        <EquipmentBuilder
          existingItem={editIndex !== null ? equipment[editIndex] : undefined}
          onSave={handleSaveEquipment}
          onClose={() => {
            setBuilderOpen(false);
            setEditIndex(null);
          }}
        />
      )}

      <style>{`
        .equipment-notes-panel .panel-header {
          align-items: center;
          justify-content: space-between;
        }
        .equipment-limit-warning {
          display: flex;
          align-items: center;
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
        }
        .equipment-grid {
          display: flex;
          flex-direction: column;
          gap: var(--s-md);
          margin-bottom: var(--s-lg);
        }
        .equipment-card-item {
          background: var(--c-surface-elevated);
          border: 1px solid var(--c-border);
          border-radius: var(--r-md);
          padding: var(--s-md);
          transition: border-color var(--t-fast);
        }
        .equipment-card-item:hover {
          border-color: var(--c-primary);
        }
        .equipment-card-top {
          display: flex;
          align-items: center;
          gap: var(--s-sm);
          margin-bottom: var(--s-sm);
        }
        .equipment-card-icon {
          color: var(--c-primary);
          display: flex;
          align-items: center;
        }
        .equipment-card-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .equipment-card-name {
          font-weight: 600;
          color: var(--c-text);
          font-size: 0.95rem;
        }
        .equipment-card-effect {
          font-size: 0.8rem;
          color: var(--c-text-muted);
        }
        .equipment-card-cost {
          font-weight: 600;
          color: var(--c-primary);
          font-size: 0.9rem;
        }
        .equipment-card-notes {
          font-size: 0.8rem;
          color: var(--c-text-secondary);
          margin: var(--s-sm) 0;
          line-height: 1.5;
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
          padding: 4px 8px;
          background: transparent;
          border: 1px solid var(--c-border);
          border-radius: var(--r-sm);
          color: var(--c-text-secondary);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all var(--t-fast);
        }
        .equipment-action-btn:hover {
          background: var(--c-surface);
          border-color: var(--c-primary);
          color: var(--c-primary);
        }
        .equipment-action-btn--danger:hover {
          border-color: var(--c-error);
          color: var(--c-error);
        }
        .equipment-new-btn {
          display: flex;
          align-items: center;
          gap: var(--s-xs);
          padding: var(--s-sm) var(--s-md);
          background: var(--c-primary);
          color: white;
          border: none;
          border-radius: var(--r-md);
          font-weight: 500;
          cursor: pointer;
          transition: opacity var(--t-fast);
          margin-bottom: var(--s-lg);
        }
        .equipment-new-btn:hover {
          opacity: 0.9;
        }
        .equipment-notes-section {
          display: flex;
          flex-direction: column;
          gap: var(--s-xs);
        }
        .equipment-notes-label {
          font-size: 0.85rem;
          color: var(--c-text-secondary);
          font-weight: 500;
        }
        .equipment-textarea {
          width: 100%;
          background: var(--c-surface-elevated);
          border: 1px solid var(--c-border);
          border-radius: var(--r-md);
          color: var(--c-text-secondary);
          font-family: var(--f-body);
          font-size: 0.875rem;
          line-height: 1.65;
          padding: var(--s-md);
          resize: vertical;
          min-height: 110px;
          transition: border-color var(--t-fast), color var(--t-fast);
          box-sizing: border-box;
        }
        .equipment-textarea:focus {
          outline: none;
          border-color: var(--c-primary);
          color: var(--c-text);
        }
        .equipment-textarea::placeholder {
          color: var(--c-text-muted);
          font-style: italic;
        }
      `}</style>
    </section>
  );
}
