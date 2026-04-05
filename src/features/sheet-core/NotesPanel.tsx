import { useState } from 'react';
import { useCharStore } from '../../store/charStore';
import { useTranslation } from 'react-i18next';
import { FileText, ChevronDown, ChevronRight } from 'lucide-react';

/**
 * F-14: Background & Notes panel
 * Collapsible free-text textarea at the bottom of the character sheet.
 */
export function NotesPanel() {
  const { t } = useTranslation();
  const notes = useCharStore((s) => s.character.notes ?? '');
  const setNotes = useCharStore((s) => s.setNotes);
  const [open, setOpen] = useState(false);

  return (
    <section className="panel notes-panel">
      <button
        className="notes-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <FileText size={14} />
        <span className="notes-toggle-label">{t('notes.title')}</span>
        {notes && !open && (
          <span className="notes-pill">{t('notes.charCount', { count: notes.length })}</span>
        )}
      </button>

      {open && (
        <div className="notes-body">
          <textarea
            className="notes-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('notes.placeholder')}
            rows={6}
          />
          {notes.length > 0 && (
            <div className="notes-footer">
              {t('notes.charCount', { count: notes.length })}
            </div>
          )}
        </div>
      )}

      <style>{`
        .notes-panel {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--r-lg);
          overflow: hidden;
        }
        .notes-toggle {
          display: flex;
          align-items: center;
          gap: var(--s-xs);
          width: 100%;
          background: var(--c-surface-elevated);
          border: none;
          border-bottom: 1px solid transparent;
          padding: var(--s-sm) var(--s-md);
          cursor: pointer;
          color: var(--c-text-muted);
          font-family: var(--f-body);
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          text-align: left;
          transition: all var(--t-fast);
        }
        .notes-toggle:hover { color: var(--c-text); }
        .notes-toggle[aria-expanded="true"] { border-bottom-color: var(--c-border); }
        .notes-toggle-label { flex: 1; }
        .notes-pill {
          font-size: 0.68rem;
          color: var(--c-text-muted);
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          border-radius: var(--r-full);
          padding: 0 8px;
        }
        .notes-body {
          padding: var(--s-md);
        }
        .notes-textarea {
          width: 100%;
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          border-radius: var(--r-md);
          padding: var(--s-md);
          color: var(--c-text);
          font-family: var(--f-body);
          font-size: 0.875rem;
          line-height: 1.6;
          resize: vertical;
          min-height: 120px;
          transition: border-color var(--t-fast);
          box-sizing: border-box;
        }
        .notes-textarea:focus {
          outline: none;
          border-color: var(--c-primary);
          box-shadow: 0 0 0 2px rgba(var(--c-primary-rgb, 99 102 241), 0.1);
        }
        .notes-textarea::placeholder { color: var(--c-text-muted); }
        .notes-footer {
          text-align: right;
          font-size: 0.7rem;
          color: var(--c-text-muted);
          margin-top: var(--s-xs);
        }
      `}</style>
    </section>
  );
}
