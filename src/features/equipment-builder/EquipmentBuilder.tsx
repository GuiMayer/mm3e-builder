import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
      id: uuidv4(),
      name: '',
      components: [{ id: uuidv4(), effectId: '', ranks: 1, modifiers: [] }],
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
        { id: uuidv4(), effectId: '', ranks: 1, modifiers: [] },
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
      await dialog.alert({ title: 'Equipment', message: t('equipment.nameRequired') || 'Equipment name is required' });
      return;
    }
    onSave(item);
  };

  return (
    <Modal isOpen onClose={onClose} title={t('equipment.builder') || 'Equipment Builder'}>
      <div className="equipment-builder">
        {/* Header: Name and Cost Summary */}
        <div className="builder-header">
          <div className="form-group">
            <label htmlFor="equipment-name">{t('equipment.name') || 'Name'}</label>
            <input
              id="equipment-name"
              type="text"
              value={item.name}
              onChange={handleNameChange}
              placeholder={t('equipment.namePlaceholder') || 'e.g., Utility Belt, Armor Suit'}
              className="form-input"
            />
          </div>

          <div className="cost-summary">
            <div className="cost-item">
              <span className="cost-label">{t('equipment.baseCost') || 'Base Cost'}:</span>
              <span className="cost-value">{baseCost} PP</span>
            </div>
            <div className="cost-item">
              <span className="cost-label">{t('equipment.equipmentPoints') || 'Equipment Points'}:</span>
              <span className="cost-value">{equipmentPoints} EP</span>
            </div>
            {(item.alternateEffects?.length ?? 0) > 0 && (
              <div className="cost-item">
                <span className="cost-label">{t('equipment.totalEP') || 'Total EP'}:</span>
                <span className="cost-value">{totalEP} EP</span>
              </div>
            )}
          </div>
        </div>

        {/* Components Section */}
        <div className="components-section">
          <h3>{t('equipment.components') || 'Components'}</h3>
          {item.components.map((comp, idx) => {
            const effectDef = powerDefs.find((d) => d.id === comp.effectId);
            const costResult = componentCosts[idx];

            return (
              <div key={comp.id} className="component-card">
                <div className="component-header">
                  <span className="component-label">
                    {effectDef?.name || t('equipment.selectEffect') || 'Select Effect'}
                  </span>
                  {item.components.length > 1 && (
                    <button
                      onClick={() => handleRemoveComponent(comp.id)}
                      className="btn-icon"
                      title={t('equipment.removeComponent') || 'Remove Component'}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="component-body">
                  <div className="form-group">
                    <label>{t('equipment.ranks') || 'Ranks'}</label>
                    <NumberInput
                      value={comp.ranks}
                      onChange={(val) => handleRankChange(comp.id, val)}
                      min={1}
                      max={20}
                    />
                  </div>

                  {costResult && (
                    <div className="component-cost">
                      <span>{t('equipment.cost') || 'Cost'}: {costResult.total} PP</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <Button onClick={handleAddComponent} variant="secondary" size="sm">
            <Plus size={16} />
            {t('equipment.addComponent') || 'Add Component'}
          </Button>
        </div>

        {/* Notes Section */}
        <div className="notes-section">
          <label htmlFor="equipment-notes">{t('equipment.notes') || 'Notes'}</label>
          <textarea
            id="equipment-notes"
            value={item.notes || ''}
            onChange={handleNotesChange}
            placeholder={t('equipment.notesPlaceholder') || 'Optional notes about this equipment'}
            rows={3}
            className="form-textarea"
          />
        </div>

        {/* Action Buttons */}
        <div className="builder-actions">
          <Button onClick={onClose} variant="secondary">
            <X size={16} />
            {t('common.cancel') || 'Cancel'}
          </Button>
          <Button onClick={handleSave} variant="primary">
            <Save size={16} />
            {t('common.save') || 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
