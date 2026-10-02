import { useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw } from 'lucide-react';
import { Modal } from '../../shared/ui/Modal';
import { useAppStore } from '../../store/appStore';
import { useCustomThemeStore } from './customThemeStore';
import { COLOR_GROUPS, COLOR_ROLES, PRESET_THEMES, contrastIssues, createCustomTheme, isPresetTheme, themeVariables, type ColorRole, type CustomTheme } from './themeModel';
import type { PresetTheme } from './presetPalettes';
import { ThemeColorField } from './ThemeColorField';
import './customTheme.css';

export function CustomThemeEditor({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<CustomTheme>(() => {
    const saved = useCustomThemeStore.getState().palette;
    const selected = useAppStore.getState().theme;
    return saved ? structuredClone(saved) : createCustomTheme(isPresetTheme(selected) ? selected : 'dark-knight');
  });
  const [error, setError] = useState('');
  const [fieldRevision, setFieldRevision] = useState(0);
  const [pickerRole, setPickerRole] = useState<ColorRole | null>(null);
  const [invalidRoles, setInvalidRoles] = useState<Partial<Record<ColorRole, boolean>>>({});
  const invalidFields = Object.values(invalidRoles).some(Boolean);
  const base = createCustomTheme(draft.baseTheme);
  const issues = contrastIssues(draft);
  function copyBase(selected: PresetTheme = draft.baseTheme) { setDraft(createCustomTheme(selected)); setFieldRevision(n => n + 1); setPickerRole(null); setInvalidRoles({}); setError(''); }
  function save() {
    if (invalidFields) return;
    if (!useCustomThemeStore.getState().save(draft)) { setError(t('theme.saveError')); return; }
    try { useAppStore.getState().setTheme('custom'); }
    catch { setError(t('theme.selectionError')); return; }
    onClose();
  }
  return <div className="theme-editor">
    <Modal isOpen onClose={onClose} title={t('theme.editorTitle')} compact>
      <form className="theme-editor-form" onSubmit={event => { event.preventDefault(); save(); }}>
        <div className="theme-base-controls"><label>{t('theme.base')}<select value={draft.baseTheme} onChange={event => copyBase(event.target.value as PresetTheme)}>{PRESET_THEMES.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><button type="button" onClick={() => copyBase()}><RotateCcw size={15} />{t('theme.useBase')}</button></div>
        <p className="theme-editor-intro">{t('theme.editorIntro')}</p>
        <div className="theme-editor-layout">
          <div className="theme-groups" key={fieldRevision}>
            {COLOR_GROUPS.map((group, index) => <details key={group} open={index === 0}>
              <summary>{t(`theme.group.${group}`)}</summary>
              {COLOR_ROLES.filter(([, category]) => category === group).map(([role, , transparent]) => <ThemeColorField key={role} role={role} color={draft.colors[role]} base={base.colors[role]} transparent={!!transparent}
                open={pickerRole === role} onToggle={() => setPickerRole(current => current === role ? null : role)} onClose={() => setPickerRole(null)}
                onValidityChange={valid => setInvalidRoles(current => ({ ...current, [role]: !valid }))}
                onChange={color => { setDraft(current => ({ ...current, colors: { ...current.colors, [role]: color } })); setError(''); }} />)}
            </details>)}
          </div>
          <section className="theme-preview-area" aria-label={t('theme.preview')}>
            <h3>{t('theme.preview')}</h3>
            <div className="theme-preview" style={themeVariables(draft) as CSSProperties}>
              <h4>{t('theme.previewTitle')}</h4><p>{t('theme.previewText')}</p>
              <div className="theme-preview-card"><strong>{t('theme.previewCard')}</strong><span className="theme-preview-secondary">{t('theme.previewSecondary')}</span><span className="theme-preview-muted">{t('theme.previewMuted')}</span>
                <label>{t('theme.previewField')}<input readOnly value="10" tabIndex={-1} /></label>
                <div className="theme-preview-actions"><span>{t('theme.previewAction')}</span><span className="theme-preview-hover">{t('theme.previewHover')}</span></div>
                <div className="theme-preview-states">{(['success', 'warning', 'error', 'info'] as const).map(role => <span key={role} style={{ color: `var(--c-${role})`, background: `var(--c-${role}-bg)` }}>{t(`theme.color.${role}`)}</span>)}</div>
                <span className="theme-preview-focus">{t('theme.previewFocus')}</span>
              </div>
            </div>
            <details className="theme-contrast"><summary>{t('theme.contrastSummary', { count: issues.length })}</summary><p>{t('theme.contrastHelp')}</p><ul>{issues.map(({ foreground, background, ratio, minimum }, i) => <li key={i}>{t(`theme.color.${foreground}`)} / {t(`theme.color.${background}`)}: {ratio.toFixed(2)}:1 ({t('theme.minimum')} {minimum}:1)</li>)}</ul></details>
          </section>
        </div>
        <footer className="theme-editor-footer">{error && <p role="alert">{error}</p>}<span>{t('theme.localOnly')}</span><div><button type="button" onClick={onClose}>{t('common.cancel')}</button><button type="submit" className="theme-save" disabled={invalidFields}>{t('theme.saveApply')}</button></div></footer>
      </form>
    </Modal>
  </div>;
}
