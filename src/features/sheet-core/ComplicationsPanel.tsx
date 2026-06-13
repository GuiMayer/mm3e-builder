import { useState } from 'react';
import { useActiveCharacter } from '../../shared/hooks/useActiveCharacter';
import { useCharacterActions } from '../../shared/hooks/useCharacterActions';
import type { IComplication, ComplicationType } from '../../entities/types';
import { Plus, Trash2, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared/ui/Button';

// Emoji/icon per complication type for quick visual scanning
const TYPE_ICONS: Record<ComplicationType, string> = {
  motivation:     '🎯',
  enemy:          '⚡',
  identity:       '🎭',
  relationship:   '❤️',
  responsibility: '⚖️',
  secret:         '🔒',
  weakness:       '💢',
  accident:       '💥',
  social:         '👥',
  disability:     '♿',
  power_loss:     '📉',
};

const ALL_TYPES: ComplicationType[] = [
  'motivation', 'enemy', 'identity', 'relationship', 'responsibility',
  'secret', 'weakness', 'accident', 'social', 'disability', 'power_loss',
];

export function ComplicationsPanel() {
  const { t } = useTranslation();
  const { character } = useActiveCharacter();
  const { setComplications } = useCharacterActions();
  const complications = character.complications;

  const [showAdd, setShowAdd]       = useState(false);
  const [newTitle, setNewTitle]     = useState('');
  const [newDesc, setNewDesc]       = useState('');
  const [newType, setNewType]       = useState<ComplicationType | undefined>(undefined);
  const [typePickerFor, setTypePickerFor] = useState<number | null>(null);

  function addComplication() {
    if (!newTitle.trim()) return;
    setComplications([
      ...complications,
      { title: newTitle.trim(), description: newDesc.trim(), type: newType },
    ]);
    setNewTitle('');
    setNewDesc('');
    setNewType(undefined);
    setShowAdd(false);
  }

  function removeComplication(index: number) {
    setComplications(complications.filter((_, i) => i !== index));
  }

  function updateComplication(index: number, field: keyof IComplication, value: unknown) {
    const next = [...complications];
    next[index] = { ...next[index], [field]: value };
    setComplications(next);
  }

  function setType(index: number, type: ComplicationType | undefined) {
    updateComplication(index, 'type', type);
    setTypePickerFor(null);
  }

  return (
    <section className="panel">
      <h2 className="panel-title">{t('complications.title')}</h2>

      {complications.length === 0 && (
        <p className="comp-empty">{t('complications.noComplications')}</p>
      )}

      <div className="comp-list">
        {complications.map((comp, i) => (
          <div key={i} className="comp-card">
            <div className="comp-header">
              {/* Type badge — optional, click to open picker */}
              <button
                className={`comp-type-badge ${comp.type ? 'comp-type-badge--set' : 'comp-type-badge--empty'}`}
                onClick={() => setTypePickerFor(typePickerFor === i ? null : i)}
                title={comp.type ? t(`complications.type.${comp.type}`) : t('complications.typeLabel')}
              >
                {comp.type
                  ? <>{TYPE_ICONS[comp.type]} {t(`complications.type.${comp.type}`)}</>
                  : <Tag size={12} />
                }
              </button>

              <input
                className="comp-title-input"
                value={comp.title}
                onChange={(e) => updateComplication(i, 'title', e.target.value)}
                placeholder={t('complications.titlePlaceholder')}
              />
              <button className="comp-remove" onClick={() => removeComplication(i)} title={t('common.remove')}>
                <Trash2 size={14} />
              </button>
            </div>

            {/* Type picker popover */}
            {typePickerFor === i && (
              <div className="comp-type-picker">
                <button
                  className="comp-type-opt comp-type-opt--clear"
                  onClick={() => setType(i, undefined)}
                >
                  {t('complications.typeNone')}
                </button>
                {ALL_TYPES.map((type) => (
                  <button
                    key={type}
                    className={`comp-type-opt ${comp.type === type ? 'comp-type-opt--active' : ''}`}
                    onClick={() => setType(i, type)}
                  >
                    {TYPE_ICONS[type]} {t(`complications.type.${type}`)}
                  </button>
                ))}
              </div>
            )}

            <textarea
              className="comp-desc-input"
              value={comp.description}
              onChange={(e) => updateComplication(i, 'description', e.target.value)}
              placeholder={t('complications.descPlaceholder')}
              rows={2}
            />
          </div>
        ))}
      </div>

      {!showAdd ? (
        <Button variant="ghost" size="md" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> {t('complications.add')}
        </Button>
      ) : (
        <div className="comp-add-form">
          {/* Type picker in add form */}
          <div className="comp-add-type-row">
            <span className="comp-add-type-label">{t('complications.typeLabel')}:</span>
            <div className="comp-add-types">
              <button
                className={`comp-type-opt ${!newType ? 'comp-type-opt--active' : ''}`}
                onClick={() => setNewType(undefined)}
              >
                {t('complications.typeNone')}
              </button>
              {ALL_TYPES.map((type) => (
                <button
                  key={type}
                  className={`comp-type-opt ${newType === type ? 'comp-type-opt--active' : ''}`}
                  onClick={() => setNewType(type)}
                >
                  {TYPE_ICONS[type]} {t(`complications.type.${type}`)}
                </button>
              ))}
            </div>
          </div>
          <input
            className="comp-new-title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={t('complications.titlePlaceholder')}
          />
          <textarea
            className="comp-new-desc"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder={t('complications.descPlaceholder')}
            rows={2}
          />
          <div className="comp-add-actions">
            <Button variant="primary" size="sm" onClick={addComplication} disabled={!newTitle.trim()}>
              {t('common.add')}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => { setShowAdd(false); setNewTitle(''); setNewDesc(''); setNewType(undefined); }}>
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      )}

      <style>{`
        .comp-empty { color: var(--c-text-muted); font-size: 0.85rem; font-style: italic; }
        .comp-list { display: flex; flex-direction: column; gap: var(--s-sm); }
        .comp-card {
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-md); padding: var(--s-md);
          transition: border-color var(--t-fast);
          position: relative;
        }
        .comp-card:hover { border-color: var(--c-border-active); }
        .comp-header { display: flex; align-items: center; gap: var(--s-sm); margin-bottom: var(--s-sm); }
        .comp-title-input {
          flex: 1; background: transparent; border: none; border-bottom: 1px solid var(--c-border);
          color: var(--c-text); font-family: var(--f-heading); font-size: 0.95rem; font-weight: 600;
          padding: var(--s-xs) 0;
        }
        .comp-title-input:focus { outline: none; border-color: var(--c-primary); }

        /* Type badge */
        .comp-type-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 8px; border-radius: var(--r-full);
          border: 1px solid var(--c-border); background: transparent;
          font-size: 0.72rem; cursor: pointer; white-space: nowrap;
          color: var(--c-text-muted); transition: all var(--t-fast);
          font-family: var(--f-body);
        }
        .comp-type-badge--empty { min-width: 28px; justify-content: center; }
        .comp-type-badge--set {
          background: var(--c-surface); border-color: var(--c-border-active);
          color: var(--c-text-secondary); font-weight: 500;
        }
        .comp-type-badge:hover { border-color: var(--c-primary); color: var(--c-text); }

        /* Type picker */
        .comp-type-picker {
          display: flex; flex-wrap: wrap; gap: var(--s-xs);
          background: var(--c-surface); border: 1px solid var(--c-border-active);
          border-radius: var(--r-md); padding: var(--s-sm);
          margin-bottom: var(--s-sm);
          animation: fadeIn 0.12s ease;
        }
        .comp-type-opt {
          padding: 3px 8px; border-radius: var(--r-full);
          border: 1px solid var(--c-border); background: transparent;
          font-size: 0.72rem; cursor: pointer; font-family: var(--f-body);
          color: var(--c-text-muted); transition: all var(--t-fast);
        }
        .comp-type-opt:hover { border-color: var(--c-primary); color: var(--c-text); }
        .comp-type-opt--active {
          background: var(--c-primary); border-color: var(--c-primary);
          color: var(--c-bg); font-weight: 600;
        }
        .comp-type-opt--clear { color: var(--c-text-muted); font-style: italic; }

        .comp-desc-input {
          width: 100%; background: transparent; border: 1px solid var(--c-border);
          border-radius: var(--r-sm); color: var(--c-text-secondary); font-family: var(--f-body);
          font-size: 0.85rem; padding: var(--s-sm); resize: vertical; line-height: 1.5; box-sizing: border-box;
        }
        .comp-desc-input:focus { outline: none; border-color: var(--c-primary); color: var(--c-text); }
        .comp-remove {
          background: transparent; border: none; color: var(--c-text-muted);
          cursor: pointer; transition: color var(--t-fast); display: flex; padding: var(--s-xs);
        }
        .comp-remove:hover { color: var(--c-error); }

        /* Add form */
        .comp-add-form {
          display: flex; flex-direction: column; gap: var(--s-sm); margin-top: var(--s-sm);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-md); padding: var(--s-md);
        }
        .comp-add-type-row {
          display: flex; align-items: center; gap: var(--s-sm); flex-wrap: wrap;
        }
        .comp-add-type-label {
          font-size: 0.72rem; color: var(--c-text-muted); white-space: nowrap;
        }
        .comp-add-types {
          display: flex; flex-wrap: wrap; gap: 4px;
        }
        .comp-new-title {
          background: var(--c-bg); border: 1px solid var(--c-border); border-radius: var(--r-sm);
          color: var(--c-text); font-family: var(--f-body); font-size: 0.9rem; padding: var(--s-sm) var(--s-md);
        }
        .comp-new-desc {
          background: var(--c-bg); border: 1px solid var(--c-border); border-radius: var(--r-sm);
          color: var(--c-text); font-family: var(--f-body); font-size: 0.85rem; padding: var(--s-sm) var(--s-md);
          resize: vertical;
        }
        .comp-new-title:focus, .comp-new-desc:focus { outline: none; border-color: var(--c-primary); }
        .comp-add-actions { display: flex; gap: var(--s-sm); }
      `}</style>
    </section>
  );
}
