import { useState, useRef, useEffect } from 'react';

import { useAppStore } from '../../store/appStore';
import { useCharStore } from '../../store/charStore';
import { useCalculatedPP } from '../hooks/useCalculatedPP';
import { exportCharacterJSON, importCharacterJSON, I18nError } from '../../services/fileService';
import { generateExcel } from '../../services/excelGenerator';
import type { ExportLabels, GameDataRefs } from '../../services/excelGenerator';
import type { IPowerEffect, IModifierDef, IAdvantageDef, ISkillDef } from '../../entities/types';
import powerDefsJson from '../../data/powers.json';
import modifierDefsJson from '../../data/modifiers.json';
import advantageDefsJson from '../../data/advantages.json';
import skillDefsJson from '../../data/skills.json';
import { Settings, Download, Upload, FilePlus, Sun, Moon, Shield, ShieldOff, FileSpreadsheet } from 'lucide-react';

const THEMES = [
  { id: 'dark-knight', label: 'Dark Knight' },
  { id: 'arc-reactor', label: 'Arc Reactor' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'light-print', label: 'Light Print' },
];
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'pt-BR', label: 'Português (BR)' },
];

export function MenuBar() {
  const { t, i18n } = useTranslation();
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  
  // ensure i18n is synced with store on mount
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const strictMode = useAppStore((s) => s.strictMode);
  const toggleStrictMode = useAppStore((s) => s.toggleStrictMode);
  const character = useCharStore((s) => s.character);
  const loadCharacter = useCharStore((s) => s.loadCharacter);
  const resetCharacter = useCharStore((s) => s.resetCharacter);
  const { totalSpent, totalAvailable, remaining } = useCalculatedPP();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const char = await importCharacterJSON(file);
      loadCharacter(char);
    } catch (err) {
      if (err instanceof I18nError) {
        alert(t(err.i18nKey, err.i18nParams));
      } else {
        alert(t('errors.importError'));
      }
    }
    e.target.value = '';
  }
  
  function handleLanguageChange(lang: string) {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  }

  async function handleExportExcel() {
    const lang = i18n.language;
    const labels: ExportLabels = {
      sheetSummary: t('excel.sheetSummary'),
      sheetAbilities: t('excel.sheetAbilities'),
      sheetDefenses: t('excel.sheetDefenses'),
      sheetSkills: t('excel.sheetSkills'),
      sheetAdvantages: t('excel.sheetAdvantages'),
      sheetPowers: t('excel.sheetPowers'),
      sheetComplications: t('excel.sheetComplications'),
      heroName: t('header.heroName'),
      player: t('header.player'),
      identity: t('header.identity'),
      base: t('header.base'),
      powerLevel: t('header.powerLevel'),
      heroPoints: t('header.heroPoints'),
      powerPoints: t('header.powerPoints'),
      abilityNames: {
        str: t('abilities.str'),
        sta: t('abilities.sta'),
        agl: t('abilities.agl'),
        dex: t('abilities.dex'),
        fgt: t('abilities.fgt'),
        int: t('abilities.int'),
        awe: t('abilities.awe'),
        pre: t('abilities.pre'),
      },
      defenseNames: {
        dodge: t('defenses.dodge'),
        parry: t('defenses.parry'),
        fortitude: t('defenses.fortitude'),
        will: t('defenses.will'),
      },
      colName: t('excel.colName'),
      colRanks: t('excel.colRanks'),
      colAbility: t('excel.colAbility'),
      colTotal: t('excel.colTotal'),
      colCost: t('excel.colCost'),
      colDescription: t('excel.colDescription'),
      colEffect: t('excel.colEffect'),
      colModifiers: t('excel.colModifiers'),
      colNotes: t('excel.colNotes'),
      colTitle: t('excel.colTitle'),
      colAlternateEffects: t('excel.colAlternateEffects'),
      section: t('excel.section'),
      spent: t('excel.spent'),
      remaining: t('excel.remaining'),
      totalSpent: t('excel.totalSpent'),
      absent: t('excel.absent'),
      dynamic: t('excel.dynamic'),
      yes: t('excel.yes'),
      no: t('excel.no'),
    };

    const gameData: GameDataRefs = {
      powerDefs: powerDefsJson as IPowerEffect[],
      modifierDefs: modifierDefsJson as IModifierDef[],
      advantageDefs: advantageDefsJson as IAdvantageDef[],
      skillDefs: skillDefsJson as ISkillDef[],
    };

    try {
      await generateExcel(character, labels, gameData, lang);
    } catch (err) {
      console.error('Excel export failed:', err);
      alert(t('errors.importError'));
    }
  }

  return (
    <header className="menubar">
      <div className="menubar-left">
        <h1 className="menubar-title">{t('app.title')}</h1>
        <span className="menubar-pp" data-over={remaining < 0}>
          <strong>{totalSpent}</strong> / {totalAvailable} {t('common.pp')}
          {remaining < 0 && <span className="menubar-pp-warning"> ({remaining})</span>}
        </span>
      </div>

      <nav className="menubar-actions">
        <button className="menubar-btn" onClick={resetCharacter} title={t('menu.new')}>
          <FilePlus size={18} /> <span>{t('menu.new')}</span>
        </button>
        <button className="menubar-btn" onClick={() => exportCharacterJSON(character, i18n.language)} title={t('menu.export')}>
          <Download size={18} /> <span>{t('menu.export')}</span>
        </button>
        <button className="menubar-btn menubar-btn--excel" onClick={handleExportExcel} title={t('menu.exportExcel')}>
          <FileSpreadsheet size={18} /> <span>{t('menu.exportExcel')}</span>
        </button>
        <button className="menubar-btn" onClick={() => fileInputRef.current?.click()} title={t('menu.import')}>
          <Upload size={18} /> <span>{t('menu.import')}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />

        {/* Settings Dropdown */}
        <div className="menubar-dropdown-wrapper" ref={dropdownRef}>
          <button
            className="menubar-btn"
            onClick={() => setSettingsOpen(!settingsOpen)}
            title={t('menu.settings')}
          >
            <Settings size={18} />
          </button>

          {settingsOpen && (
            <div className="menubar-dropdown">
              <div className="dropdown-section">
                <span className="dropdown-label">{t('menu.theme')}</span>
                {THEMES.map((tItem) => (
                  <button
                    key={tItem.id}
                    className={`dropdown-item ${theme === tItem.id ? 'active' : ''}`}
                    onClick={() => setTheme(tItem.id as any)}
                  >
                    {tItem.id.includes('light') ? <Sun size={14} /> : <Moon size={14} />}
                    {tItem.label}
                  </button>
                ))}
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-section">
                <span className="dropdown-label">{t('menu.strictMode')}</span>
                <button className="dropdown-item" onClick={toggleStrictMode}>
                  {strictMode ? <Shield size={14} /> : <ShieldOff size={14} />}
                  {t('menu.strictMode')}: <strong>{strictMode ? t('menu.strictMode.active') : t('menu.strictMode.disabled')}</strong>
                </button>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-section">
                <span className="dropdown-label">{t('menu.language')}</span>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    className={`dropdown-item ${language === l.id ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(l.id)}
                  >
                    <Globe size={14} />
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <style>{`
        .menubar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--s-sm) var(--s-lg);
          background: var(--c-surface);
          border-bottom: 1px solid var(--c-border);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(12px);
        }
        .menubar-left {
          display: flex;
          align-items: center;
          gap: var(--s-lg);
        }
        .menubar-title {
          font-family: var(--f-heading);
          font-size: 1.1rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--c-primary), var(--c-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .menubar-pp {
          font-size: 0.85rem;
          color: var(--c-text-secondary);
          font-variant-numeric: tabular-nums;
        }
        .menubar-pp[data-over="true"] {
          color: var(--c-error);
        }
        .menubar-pp-warning {
          color: var(--c-error);
          font-weight: 600;
        }
        .menubar-actions {
          display: flex;
          align-items: center;
          gap: var(--s-xs);
        }
        .menubar-btn {
          display: flex;
          align-items: center;
          gap: var(--s-xs);
          padding: var(--s-xs) var(--s-sm);
          background: transparent;
          border: 1px solid transparent;
          border-radius: var(--r-md);
          color: var(--c-text-secondary);
          font-family: var(--f-body);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all var(--t-fast);
        }
        .menubar-btn:hover {
          background: var(--c-primary-muted);
          color: var(--c-text);
          border-color: var(--c-border);
        }
        .menubar-btn--excel {
          color: #22c55e;
        }
        .menubar-btn--excel:hover {
          background: rgba(34, 197, 94, 0.12);
          color: #16a34a;
          border-color: rgba(34, 197, 94, 0.3);
        }
        .menubar-dropdown-wrapper {
          position: relative;
        }
        .menubar-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + var(--s-xs));
          min-width: 220px;
          background: var(--c-surface-elevated);
          border: 1px solid var(--c-border);
          border-radius: var(--r-md);
          box-shadow: var(--shadow-lg);
          padding: var(--s-sm);
          animation: fadeIn 0.15s ease;
          z-index: 200;
        }
        .dropdown-section {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .dropdown-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--c-text-muted);
          padding: var(--s-xs) var(--s-sm);
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: var(--s-sm);
          padding: var(--s-xs) var(--s-sm);
          background: transparent;
          border: none;
          border-radius: var(--r-sm);
          color: var(--c-text);
          font-family: var(--f-body);
          font-size: 0.82rem;
          cursor: pointer;
          transition: background var(--t-fast);
          width: 100%;
          text-align: left;
        }
        .dropdown-item:hover {
          background: var(--c-primary-muted);
        }
        .dropdown-item.active {
          background: var(--c-primary-muted);
          color: var(--c-primary);
          font-weight: 600;
        }
        .dropdown-divider {
          height: 1px;
          background: var(--c-border);
          margin: var(--s-sm) 0;
        }
      `}</style>
    </header>
  );
}
