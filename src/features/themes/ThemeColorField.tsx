import { useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, X } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { formatColorInput, parseColorInput, type ColorNotation } from './colorInput';
import type { ColorRole, ThemeColor } from './themeModel';

export function ThemeColorField({ role, color, base, transparent, open, onToggle, onClose, onChange, onValidityChange }: {
  role: ColorRole; color: ThemeColor; base: ThemeColor; transparent: boolean; open: boolean;
  onToggle: () => void; onClose: () => void;
  onChange: (color: ThemeColor) => void; onValidityChange: (valid: boolean) => void;
}) {
  const { t } = useTranslation();
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const [notation, setNotation] = useState<ColorNotation>('hex');
  const [text, setText] = useState(formatColorInput(color, 'hex'));
  const valid = parseColorInput(text, color, transparent);
  const label = t(`theme.color.${role}`);
  function update(next: ThemeColor) { setText(formatColorInput(next, notation)); onChange(next); onValidityChange(true); }
  function close() { onClose(); trigger.current?.focus(); }
  return <div className="theme-color-field" onKeyDown={event => {
    if (open && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
  }}>
    <label htmlFor={id}>{label}</label>
    <div className="theme-color-controls">
      <button ref={trigger} type="button" className="theme-color-swatch" aria-label={t('theme.pickColor', { color: label })}
        aria-expanded={open} aria-controls={`${id}-picker`} onClick={onToggle}>
        <span style={{ background: color.hex, opacity: color.alpha }} />
      </button>
      <input id={id} className="theme-color-value" type="text" value={text} spellCheck={false} autoComplete="off" maxLength={80}
        aria-invalid={!valid} aria-describedby={!valid ? `${id}-error` : undefined}
        onChange={event => { const value = event.target.value; setText(value); const next = parseColorInput(value, color, transparent); onValidityChange(!!next); if (next) onChange(next); }}
        onBlur={() => { if (valid) setText(formatColorInput(valid, notation)); }}
        onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); if (valid) update(valid); } }} />
      <button type="button" title={t('theme.resetColor', { color: label })} aria-label={t('theme.resetColor', { color: label })} onClick={() => update(base)}><RotateCcw size={15} /></button>
    </div>
    {open && <div id={`${id}-picker`} className="theme-color-picker" role="group" aria-label={t('theme.pickColor', { color: label })}>
      <div className="theme-color-picker-toolbar">
        <label>{t('theme.colorFormat')}<select aria-label={t('theme.colorFormatFor', { color: label })} value={notation} onChange={event => {
          const next = event.target.value as ColorNotation;
          setNotation(next); setText(formatColorInput(color, next)); onValidityChange(true);
        }}>{(['hex', 'rgb', 'hsl'] as const).map(format => <option key={format} value={format}>{format.toUpperCase()}</option>)}</select></label>
        <button type="button" aria-label={t('theme.closePicker')} onClick={close}><X size={16} /></button>
      </div>
      <HexColorPicker color={color.hex} onChange={hex => update({ ...color, hex: hex.toUpperCase() })} />
      <p>{t('theme.colorInputHelp')}</p>
    </div>}
    {transparent && <label className="theme-alpha">{t('theme.opacity')}<input type="range" min="0" max="100" step="1" value={Math.round(color.alpha * 100)} aria-label={t('theme.colorOpacity', { color: label })} onChange={event => update({ ...color, alpha: Number(event.target.value) / 100 })} /><output>{Math.round(color.alpha * 100)}%</output></label>}
    {!valid && <span className="theme-color-error" id={`${id}-error`}>{t(transparent ? 'theme.invalidColorAlpha' : 'theme.invalidColor')}</span>}
  </div>;
}
