import { useState } from 'react';
import { useCharStore } from '../../store/charStore';
import { useCalculatedPP } from '../../shared/hooks/useCalculatedPP';
import { User, MapPin, Shield, Star, ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function HeaderPanel() {
  const { t } = useTranslation();
  const header = useCharStore((s) => s.character.header);
  const updateHeader = useCharStore((s) => s.updateHeader);
  const pp = useCalculatedPP();
  const isOver = pp.remaining < 0;
  const pct = pp.totalAvailable > 0 ? Math.min(100, (pp.totalSpent / pp.totalAvailable) * 100) : 0;

  // F-07: accordion open state (collapsed by default)
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <section className="header-panel">
      {/* Hero Identity Section */}
      <div className="hero-identity">
        <div className="hero-avatar">
          <User size={32} />
        </div>
        <div className="hero-fields">
          <div className="hero-name-field">
            <input
              className="hero-name-input"
              value={header.name}
              onChange={(e) => updateHeader({ name: e.target.value })}
              placeholder={t('header.heroName')}
            />
          </div>
          <div className="hero-meta-row">
            <div className="hero-meta-field">
              <label>{t('header.player')}</label>
              <input
                value={header.player}
                onChange={(e) => updateHeader({ player: e.target.value })}
                placeholder={t('header.player')}
              />
            </div>
            {/* F-03: Identity + Secret/Public toggle */}
            <div className="hero-meta-field hero-meta-field--identity">
              <label>{t('header.identity')}</label>
              <div className="hero-identity-row">
                <input
                  value={header.identity}
                  onChange={(e) => updateHeader({ identity: e.target.value })}
                  placeholder={t('header.identity')}
                />
                <div className="identity-type-toggle" title={t('header.identityTypeHint')}>
                  {(['secret', 'public'] as const).map((opt) => (
                    <button
                      key={opt}
                      className={`identity-type-opt ${(header.identityType ?? '') === opt ? 'identity-type-opt--active' : ''}`}
                      onClick={() =>
                        updateHeader({
                          identityType: header.identityType === opt ? undefined : opt,
                        })
                      }
                      title={t(`header.identityType.${opt}`)}
                    >
                      {opt === 'secret' ? '🔒' : '🌐'} {t(`header.identityType.${opt}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="hero-meta-field">
              <label><MapPin size={12} /> {t('header.base')}</label>
              <input
                value={header.base}
                onChange={(e) => updateHeader({ base: e.target.value })}
                placeholder={t('header.base')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="hero-stats-row">
        <div className="hero-stat-card hero-stat-card--pl">
          <Shield size={16} />
          <div className="hero-stat-info">
            <span className="hero-stat-label">{t('header.powerLevel')}</span>
            <input
              type="number"
              min={1}
              className="hero-stat-input"
              value={header.powerLevel}
              onChange={(e) => updateHeader({ powerLevel: Math.max(1, Number(e.target.value) || 1) })}
            />
          </div>
        </div>
        <div className="hero-stat-card hero-stat-card--hp">
          <Star size={16} />
          <div className="hero-stat-info">
            <span className="hero-stat-label">{t('header.heroPoints')}</span>
            <input
              type="number"
              min={0}
              className="hero-stat-input"
              value={header.heroPoints}
              onChange={(e) => updateHeader({ heroPoints: Math.max(0, Number(e.target.value) || 0) })}
            />
          </div>
        </div>
        <div className="hero-stat-card hero-stat-card--pp">
          <div className="hero-stat-info">
            <span className="hero-stat-label">{t('header.powerPoints')}</span>
            <span className={`hero-pp-display ${isOver ? 'hero-pp-display--over' : ''}`}>
              <strong>{pp.totalSpent}</strong>
              <span className="hero-pp-sep">/</span>
              <span>{pp.totalAvailable}</span>
            </span>
          </div>
          <div className="hero-pp-bar">
            <div
              className="hero-pp-bar-fill"
              style={{ width: `${pct}%` }}
              data-over={isOver}
            />
          </div>
        </div>
      </div>

      {/* F-07: Character Details accordion */}
      <div className="char-details-accordion">
        <button
          className="char-details-toggle"
          onClick={() => setDetailsOpen((v) => !v)}
          aria-expanded={detailsOpen}
        >
          {detailsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          {t('header.characterDetails')}
          {/* Show a subtle indicator when any field is filled */}
          {(header.gender || header.age || header.height || header.weight ||
            header.eyes || header.hair || header.groupAffiliation ||
            header.series || header.gameMaster) && (
            <span className="char-details-filled-dot" title={t('header.characterDetailsFilled')} />
          )}
        </button>

        {detailsOpen && (
          <div className="char-details-body">
            <div className="char-details-grid">
              <div className="hero-meta-field">
                <label>{t('header.gender')}</label>
                <input
                  value={header.gender ?? ''}
                  onChange={(e) => updateHeader({ gender: e.target.value || undefined })}
                  placeholder="—"
                />
              </div>
              <div className="hero-meta-field">
                <label>{t('header.age')}</label>
                <input
                  value={header.age ?? ''}
                  onChange={(e) => updateHeader({ age: e.target.value || undefined })}
                  placeholder="—"
                />
              </div>
              <div className="hero-meta-field">
                <label>{t('header.height')}</label>
                <input
                  value={header.height ?? ''}
                  onChange={(e) => updateHeader({ height: e.target.value || undefined })}
                  placeholder="—"
                />
              </div>
              <div className="hero-meta-field">
                <label>{t('header.weight')}</label>
                <input
                  value={header.weight ?? ''}
                  onChange={(e) => updateHeader({ weight: e.target.value || undefined })}
                  placeholder="—"
                />
              </div>
              <div className="hero-meta-field">
                <label>{t('header.eyes')}</label>
                <input
                  value={header.eyes ?? ''}
                  onChange={(e) => updateHeader({ eyes: e.target.value || undefined })}
                  placeholder="—"
                />
              </div>
              <div className="hero-meta-field">
                <label>{t('header.hair')}</label>
                <input
                  value={header.hair ?? ''}
                  onChange={(e) => updateHeader({ hair: e.target.value || undefined })}
                  placeholder="—"
                />
              </div>
            </div>
            <div className="char-details-grid char-details-grid--wide">
              <div className="hero-meta-field">
                <label>{t('header.groupAffiliation')}</label>
                <input
                  value={header.groupAffiliation ?? ''}
                  onChange={(e) => updateHeader({ groupAffiliation: e.target.value || undefined })}
                  placeholder="—"
                />
              </div>
              <div className="hero-meta-field">
                <label>{t('header.series')}</label>
                <input
                  value={header.series ?? ''}
                  onChange={(e) => updateHeader({ series: e.target.value || undefined })}
                  placeholder="—"
                />
              </div>
              <div className="hero-meta-field">
                <label>{t('header.gameMaster')}</label>
                <input
                  value={header.gameMaster ?? ''}
                  onChange={(e) => updateHeader({ gameMaster: e.target.value || undefined })}
                  placeholder="—"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .header-panel {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--r-lg);
          padding: var(--s-lg);
          display: flex;
          flex-direction: column;
          gap: var(--s-lg);
          animation: fadeIn 0.3s ease;
        }

        .hero-identity {
          display: flex;
          gap: var(--s-lg);
          align-items: flex-start;
        }

        .hero-avatar {
          width: 64px;
          height: 64px;
          border-radius: var(--r-lg);
          background: linear-gradient(135deg, var(--c-primary-muted), var(--c-surface-elevated));
          border: 2px solid var(--c-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--c-primary);
          flex-shrink: 0;
          transition: all var(--t-fast);
        }
        .hero-avatar:hover {
          border-color: var(--c-primary);
          box-shadow: 0 0 16px rgba(var(--c-primary-rgb), 0.3);
        }

        .hero-fields { flex: 1; display: flex; flex-direction: column; gap: var(--s-md); }

        .hero-name-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 2px solid var(--c-border);
          color: var(--c-text);
          font-family: var(--f-heading);
          font-size: 1.5rem;
          font-weight: 800;
          padding: var(--s-xs) 0;
          transition: border-color var(--t-fast);
        }
        .hero-name-input:focus {
          outline: none;
          border-color: var(--c-primary);
        }
        .hero-name-input::placeholder {
          color: var(--c-text-muted);
          font-weight: 400;
        }

        .hero-meta-row {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: var(--s-md);
        }

        /* F-03: Identity field gets wider to fit toggle */
        .hero-meta-field--identity {
          grid-column: span 2;
        }
        @media (max-width: 600px) {
          .hero-meta-field--identity { grid-column: span 1; }
        }

        /* F-03: Identity row = input + toggle side by side */
        .hero-identity-row {
          display: flex;
          gap: var(--s-sm);
          align-items: center;
          flex-wrap: wrap;
        }
        .hero-identity-row input {
          flex: 1;
          min-width: 100px;
        }
        .identity-type-toggle {
          display: flex;
          gap: 3px;
          flex-shrink: 0;
        }
        .identity-type-opt {
          padding: 3px 8px;
          border-radius: var(--r-full);
          border: 1px solid var(--c-border);
          background: transparent;
          font-size: 0.7rem;
          cursor: pointer;
          font-family: var(--f-body);
          color: var(--c-text-muted);
          transition: all var(--t-fast);
          white-space: nowrap;
        }
        .identity-type-opt:hover {
          border-color: var(--c-border-active);
          color: var(--c-text);
        }
        .identity-type-opt--active {
          background: var(--c-primary-muted);
          border-color: var(--c-primary);
          color: var(--c-primary);
          font-weight: 600;
        }

        .hero-meta-field {
          display: flex;
          flex-direction: column;
          gap: var(--s-xs);
        }
        .hero-meta-field label {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--c-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .hero-meta-field input {
          background: var(--c-surface-elevated);
          border: 1px solid var(--c-border);
          border-radius: var(--r-sm);
          padding: var(--s-sm) var(--s-md);
          color: var(--c-text);
          font-family: var(--f-body);
          font-size: 0.85rem;
          transition: border-color var(--t-fast);
        }
        .hero-meta-field input:focus {
          outline: none;
          border-color: var(--c-primary);
          box-shadow: 0 0 0 2px var(--c-primary-muted);
        }

        .hero-stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: var(--s-sm);
        }

        .hero-stat-card {
          display: flex;
          align-items: center;
          gap: var(--s-sm);
          padding: var(--s-md);
          background: var(--c-surface-elevated);
          border: 1px solid var(--c-border);
          border-radius: var(--r-md);
          transition: all var(--t-fast);
        }
        .hero-stat-card:hover {
          border-color: var(--c-border-active);
          box-shadow: 0 0 12px rgba(var(--c-primary-rgb), 0.1);
        }

        .hero-stat-card--pl { color: var(--c-primary); }
        .hero-stat-card--hp { color: var(--c-accent); }
        .hero-stat-card--pp { flex-direction: column; align-items: stretch; }

        .hero-stat-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .hero-stat-label {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--c-text-muted);
        }
        .hero-stat-input {
          width: 60px;
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          border-radius: var(--r-sm);
          padding: var(--s-xs) var(--s-sm);
          color: var(--c-text);
          font-family: var(--f-heading);
          font-size: 1.2rem;
          font-weight: 800;
          text-align: center;
        }
        .hero-stat-input:focus {
          outline: none;
          border-color: var(--c-primary);
        }

        .hero-pp-display {
          font-family: var(--f-heading);
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--c-text);
          font-variant-numeric: tabular-nums;
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .hero-pp-display strong {
          color: var(--c-primary);
        }
        .hero-pp-display--over strong {
          color: var(--c-error);
        }
        .hero-pp-sep {
          color: var(--c-text-muted);
          font-size: 1rem;
        }

        .hero-pp-bar {
          width: 100%;
          height: 4px;
          background: var(--c-bg);
          border-radius: var(--r-full);
          overflow: hidden;
          margin-top: var(--s-xs);
        }
        .hero-pp-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--c-primary), var(--c-accent));
          border-radius: var(--r-full);
          transition: width var(--t-normal);
        }
        .hero-pp-bar-fill[data-over="true"] {
          background: linear-gradient(90deg, var(--c-error), var(--c-warning));
        }

        /* ── F-07: Character Details accordion ── */
        .char-details-accordion {
          border-top: 1px solid var(--c-border);
          padding-top: var(--s-sm);
        }
        .char-details-toggle {
          display: flex;
          align-items: center;
          gap: var(--s-xs);
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--c-text-muted);
          font-family: var(--f-body);
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: var(--s-xs) 0;
          transition: color var(--t-fast);
        }
        .char-details-toggle:hover { color: var(--c-text); }
        .char-details-filled-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--c-primary);
          flex-shrink: 0;
        }
        .char-details-body {
          display: flex;
          flex-direction: column;
          gap: var(--s-md);
          padding-top: var(--s-md);
          animation: fadeIn 0.15s ease;
        }
        .char-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: var(--s-md);
        }
        .char-details-grid--wide {
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        }
      `}</style>
    </section>
  );
}
