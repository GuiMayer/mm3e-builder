import { useState } from 'react';
import { useCharStore } from '../../store/charStore';
import type { IComplication } from '../../entities/types';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ComplicationsPanel() {
  const { t } = useTranslation();
  const complications = useCharStore((s) => s.character.complications);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  function setComplications(next: IComplication[]) {
    useCharStore.setState((s) => ({
      character: { ...s.character, complications: next },
      isDirty: true,
    }));
  }

  function addComplication() {
    if (!newTitle.trim()) return;
    setComplications([...complications, { title: newTitle.trim(), description: newDesc.trim() }]);
    setNewTitle('');
    setNewDesc('');
    setShowAdd(false);
  }

  function removeComplication(index: number) {
    setComplications(complications.filter((_, i) => i !== index));
  }

  function updateComplication(index: number, field: 'title' | 'description', value: string) {
    const next = [...complications];
    next[index] = { ...next[index], [field]: value };
    setComplications(next);
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
        <button className="skill-add-btn" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> {t('complications.add')}
        </button>
      ) : (
        <div className="comp-add-form">
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
            <button className="skill-confirm-btn" onClick={addComplication} disabled={!newTitle.trim()}>
              {t('common.add')}
            </button>
            <button className="skill-cancel-btn" onClick={() => { setShowAdd(false); setNewTitle(''); setNewDesc(''); }}>
              {t('common.cancel')}
            </button>
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
        }
        .comp-card:hover { border-color: var(--c-border-active); }
        .comp-header { display: flex; align-items: center; gap: var(--s-sm); margin-bottom: var(--s-sm); }
        .comp-title-input {
          flex: 1; background: transparent; border: none; border-bottom: 1px solid var(--c-border);
          color: var(--c-text); font-family: var(--f-heading); font-size: 0.95rem; font-weight: 600;
          padding: var(--s-xs) 0;
        }
        .comp-title-input:focus { outline: none; border-color: var(--c-primary); }
        .comp-desc-input {
          width: 100%; background: transparent; border: 1px solid var(--c-border);
          border-radius: var(--r-sm); color: var(--c-text-secondary); font-family: var(--f-body);
          font-size: 0.85rem; padding: var(--s-sm); resize: vertical; line-height: 1.5;
        }
        .comp-desc-input:focus { outline: none; border-color: var(--c-primary); color: var(--c-text); }
        .comp-remove {
          background: transparent; border: none; color: var(--c-text-muted);
          cursor: pointer; transition: color var(--t-fast); display: flex; padding: var(--s-xs);
        }
        .comp-remove:hover { color: var(--c-error); }
        .comp-add-form {
          display: flex; flex-direction: column; gap: var(--s-sm); margin-top: var(--s-sm);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-md); padding: var(--s-md);
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
