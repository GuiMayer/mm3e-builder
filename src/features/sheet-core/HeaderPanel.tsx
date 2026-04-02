import { useCharStore } from '../../store/charStore';
import { useCalculatedPP } from '../../shared/hooks/useCalculatedPP';
import { User, MapPin, Shield, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function HeaderPanel() {
  const { t } = useTranslation();
  const header = useCharStore((s) => s.character.header);
  const updateHeader = useCharStore((s) => s.updateHeader);
  const pp = useCalculatedPP();
  const isOver = pp.remaining < 0;
  const pct = pp.totalAvailable > 0 ? Math.min(100, (pp.totalSpent / pp.totalAvailable) * 100) : 0;

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
            <div className="hero-meta-field">
              <label>{t('header.identity')}</label>
              <input
                value={header.identity}
                onChange={(e) => updateHeader({ identity: e.target.value })}
                placeholder={t('header.identity')}
              />
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
      `}</style>
    </section>
  );
}
