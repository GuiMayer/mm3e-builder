import { useState } from 'react';
import type {
  IEquipmentItem,
  IModifierDef,
  IPowerEffect,
} from '../../entities/types';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { useEquipmentCalculations } from './hooks/useEquipmentCalculations';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../shared/ui/Modal';
import { NumberInput } from '../../shared/ui/NumberInput';
import { Button } from '../../shared/ui/Button';
import { useAppStore } from '../../store/appStore';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { useAppDialog } from '../../shared/ui/appDialogContext';
import { createId } from '../../shared/lib/identity';

interface Props {
  existingItem?: IEquipmentItem;
  onSave: (item: IEquipmentItem) => void;
  onClose: () => void;
}

export function EquipmentBuilder({ existingItem, onSave, onClose }: Props) {
  const { t } = useTranslation();
  const powerDefs = useLocalizedData(POWER_DEFS) as IPowerEffect[];
  const modifierDefs = useLocalizedData(MODIFIER_DEFS) as IModifierDef[];
  const validationRules = useAppStore((s) => s.validationRules);
  const dialog = useAppDialog();

  // Build initial state
  const [item, setItem] = useState<IEquipmentItem>(
    existingItem ?? {
      id: createId(),
      name: '',
      components: [{ id: createId(), effectId: '', ranks: 1, modifiers: [] }],
      notes: '',
      alternateEffects: [],
    }
  );

  // Use cost calculation hook
  const {
    componentCosts,
    baseCost,
    equipmentPoints,
    totalEP,
  } = useEquipmentCalculations({
    item,
    powerDefs,
    allModDefs: modifierDefs,
    validationRules,
  });

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem({ ...item, name: e.target.value });
  };

  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setItem({ ...item, notes: e.target.value });
  };

  // Handle component rank change
  const handleRankChange = (componentId: string, newRank: number) => {
    setItem({
      ...item,
      components: item.components.map((c) =>
        c.id === componentId ? { ...c, ranks: newRank } : c
      ),
    });
  };

  // Add new component
  const handleAddComponent = () => {
    setItem({
      ...item,
      components: [
        ...item.components,
        { id: createId(), effectId: '', ranks: 1, modifiers: [] },
      ],
    });
  };

  // Remove component
  const handleRemoveComponent = (componentId: string) => {
    if (item.components.length === 1) return; // Keep at least one component
    setItem({
      ...item,
      components: item.components.filter((c) => c.id !== componentId),
    });
  };

  // Handle save
  const handleSave = async () => {
    if (!item.name.trim()) {
      await dialog.alert({ title: t('equipment.alertTitle'), message: t('equipment.builder.nameRequired') });
      return;
    }
    onSave(item);
  };

  return (
    <Modal isOpen onClose={onClose} title={t('equipment.builder.title')}>
      <div className="equipment-builder">
        {/* Header: Name and Cost Summary */}
        <div className="builder-header">
          <div className="form-group">
            <label htmlFor="equipment-name">{t('equipment.builder.name')}</label>
            <input
              id="equipment-name"
              type="text"
              value={item.name}
              onChange={handleNameChange}
              placeholder={t('equipment.builder.namePlaceholder')}
              className="app-input form-input"
            />
          </div>

          <div className="cost-summary">
            <div className="cost-item">
              <span className="cost-label">{t('equipment.builder.baseCost')}:</span>
              <span className="cost-value">{baseCost} PP</span>
            </div>
            <div className="cost-item">
              <span className="cost-label">{t('equipment.builder.equipmentPoints')}:</span>
              <span className="cost-value">{equipmentPoints} EP</span>
            </div>
            {(item.alternateEffects?.length ?? 0) > 0 && (
              <div className="cost-item">
                <span className="cost-label">{t('equipment.builder.totalEP')}:</span>
                <span className="cost-value">{totalEP} EP</span>
              </div>
            )}
          </div>
        </div>

        {/* Components Section */}
        <div className="components-section">
          <h3>{t('equipment.builder.components')}</h3>
          {item.components.map((comp, idx) => {
            const effectDef = powerDefs.find((d) => d.id === comp.effectId);
            const costResult = componentCosts[idx];

            return (
              <div key={comp.id} className="component-card">
                <div className="component-header">
                  <span className="component-label">
                    {effectDef?.name || t('equipment.builder.selectEffect')}
                  </span>
                  {item.components.length > 1 && (
                    <button
                      onClick={() => handleRemoveComponent(comp.id)}
                      className="btn-icon"
                      title={t('equipment.builder.removeComponent')}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="component-body">
                  <div className="form-group">
                    <label>{t('equipment.builder.ranks')}</label>
                    <NumberInput
                      value={comp.ranks}
                      onChange={(val) => handleRankChange(comp.id, val)}
                      min={1}
                      max={20}
                    />
                  </div>

                  {costResult && (
                    <div className="component-cost">
                      <span>{t('equipment.builder.cost')}: {costResult.total} PP</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <Button onClick={handleAddComponent} variant="secondary" size="sm">
            <Plus size={16} />
            {t('equipment.builder.addComponent')}
          </Button>
        </div>

        {/* Notes Section */}
        <div className="notes-section">
          <label htmlFor="equipment-notes">{t('equipment.builder.notes')}</label>
          <textarea
            id="equipment-notes"
            value={item.notes || ''}
            onChange={handleNotesChange}
            placeholder={t('equipment.builder.notesPlaceholder')}
            rows={3}
            className="app-textarea form-textarea"
          />
        </div>

        {/* Action Buttons */}
        <div className="builder-actions">
          <Button onClick={onClose} variant="secondary">
            <X size={16} />
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} variant="primary">
            <Save size={16} />
            {t('common.save')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
