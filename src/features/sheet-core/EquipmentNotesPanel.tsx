import { useCharStore } from '../../store/charStore';
import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';

/**
 * EquipmentNotesPanel — F-09 (v1.0)
 *
 * A simple free-text area for equipment notes.
 * Data model: character.equipmentNotes: string
 *
 * Architecture note:
 * The field name 'equipmentNotes' is intentionally specific so the v1.1
 * structured Equipment system (see FUTURE_EXPANSIONS.md FX-03) can add
 * character.equipment[], character.vehicles[], character.headquarters[]
 * alongside this field without conflicting with it.
 */
export function EquipmentNotesPanel() {
  const { t } = useTranslation();
  const equipmentNotes = useCharStore((s) => s.character.equipmentNotes);
  const setEquipmentNotes = useCharStore((s) => s.setEquipmentNotes);

  return (
    <section className="panel equipment-notes-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <Package size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          {t('equipment.title')}
        </h2>
        <span className="panel-hint">{t('equipment.hint')}</span>
      </div>

      <textarea
        className="equipment-textarea"
        value={equipmentNotes}
        onChange={(e) => setEquipmentNotes(e.target.value)}
        placeholder={t('equipment.placeholder')}
        rows={5}
        spellCheck={false}
      />

      <style>{`
        .equipment-notes-panel .panel-header {
          align-items: flex-start;
          flex-direction: column;
          gap: 2px;
        }
        .equipment-notes-panel .panel-hint {
          font-size: 0.75rem;
          color: var(--c-text-muted);
          font-style: italic;
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
