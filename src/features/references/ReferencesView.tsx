import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, ChevronDown, ChevronUp, ChevronRight, Search, X } from 'lucide-react';
import { BASIC_CONDITIONS, COMBINED_CONDITIONS, CONDITIONS } from '../../data/conditions';
import { NumberInput } from '../../shared/ui/NumberInput';
import { BENCHMARK_SECTION, REFERENCE_SECTIONS, getSizeSection, filterReferenceSection, referenceText, type ReferenceCategory, type ReferenceSection } from './referenceCatalog';
import { MEASUREMENTS, getMeasurement, checkDegree, damageDegree, formatMeasure, type Measure, type MeasurementSystem } from './measurements';
import { loadMeasurementSystem, saveMeasurementSystem } from './measurementPreferences';
import './references.css';

type Category = 'quick' | 'all' | ReferenceCategory;
const CATEGORIES: Category[] = ['quick', 'measurements', 'combat', 'conditions', 'checks', 'hero', 'all'];
const QUICK = new Set(['measurements', 'damage', 'turn', 'checks']);

function ReferenceGrid({ children }: { children: ReactNode }) {
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    let frame = 0;
    const cards = Array.from(grid.children) as HTMLElement[];
    const update = () => {
      const masonry = getComputedStyle(grid).gridAutoRows === '1px';
      for (const card of cards) {
        // One-pixel tracks let the next card occupy the shorter column without
        // stretching its neighbour. Keep DOM order and component state intact.
        const gap = parseFloat(getComputedStyle(card).marginBottom) || 0;
        const span = Math.ceil(card.getBoundingClientRect().height + gap);
        card.style.gridRowEnd = masonry ? `span ${span}` : '';
      }
    };
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    });
    observer.observe(grid);
    cards.forEach(card => observer.observe(card));
    update();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [children]);
  return <div className="reference-grid" ref={gridRef}>{children}</div>;
}

function ReferenceCard({ section, open, onToggle, children }: { section: ReferenceSection; open: boolean; onToggle: () => void; children: ReactNode }) {
  const { t, i18n } = useTranslation();
  return <section className={`reference-card ${['measurements','size','actions','maneuvers'].includes(section.id) ? 'reference-card--wide' : ''}`}>
    <h2><button type="button" className="reference-card__toggle" aria-expanded={open} aria-controls={`reference-${section.id}`} onClick={onToggle}>
      {open ? <ChevronDown size={17}/> : <ChevronRight size={17}/>}<span>{referenceText(section.title, i18n.language)}</span><small>{t('ref119.pages', { pages: section.pages })}</small>
    </button></h2>
    {open && <div className="reference-card__body" id={`reference-${section.id}`}>{children}{section.note && <p className="reference-card__note">{referenceText(section.note, i18n.language)}</p>}</div>}
  </section>;
}

function ReferenceTable({ section }: { section: ReferenceSection }) {
  const { i18n } = useTranslation();
  return <table className="reference-table"><caption className="sr-only">{referenceText(section.title, i18n.language)}</caption>
    <thead><tr>{section.columns.map((column, index) => <th scope="col" key={index}>{referenceText(column, i18n.language)}</th>)}</tr></thead>
    <tbody>{section.rows.map(row => <tr key={row.id}>{row.cells.map((cell, index) => index === 0 ? <th scope="row" key={index}>{referenceText(cell, i18n.language)}</th> : <td key={index} data-label={referenceText(section.columns[index], i18n.language)}>{referenceText(cell, i18n.language)}</td>)}</tr>)}</tbody>
  </table>;
}

function UnitToggle({ system, onChange }: { system: MeasurementSystem; onChange: (system: MeasurementSystem) => void }) {
  const { t } = useTranslation();
  return <fieldset className="reference-unit-toggle"><legend>{t('ref119.units')}</legend><div>{(['metric','imperial'] as const).map(unit => <button type="button" key={unit} aria-pressed={system === unit} onClick={() => onChange(unit)}>{t(`ref119.${unit}`)}</button>)}</div></fieldset>;
}

function Measurements({ section, system, onSystemChange }: { section: ReferenceSection; system: MeasurementSystem; onSystemChange: (system: MeasurementSystem) => void }) {
  const { t, i18n } = useTranslation();
  const [rank, setRank] = useState(0);
  const [rankInput, setRankInput] = useState('0');
  function selectRank(value: number) {
    if (!Number.isSafeInteger(value)) return;
    setRank(value); setRankInput(String(value));
  }
  const current = getMeasurement(rank);
  const format = (value: Measure) => formatMeasure(value, i18n.language, (unit, count) => t(`ref119.unit.${unit}`, { count }));
  const visible = new Set(section.rows.map(row => row.id));
  return <>
    <div className="reference-tools"><label>{t('ref119.rank')}<span className="reference-rank-input">
      <button type="button" aria-label={t('ref119.decreaseRank')} onClick={() => selectRank(rank - 1)} disabled={rank === Number.MIN_SAFE_INTEGER}><ChevronDown size={14}/></button>
      <input type="text" role="spinbutton" inputMode="text" autoComplete="off" aria-label={t('ref119.rank')} aria-valuenow={rank} value={rankInput} onChange={event => {
        const raw = event.target.value;
        if (!/^-?\d*$/.test(raw)) return;
        if (raw === '' || raw === '-') { setRankInput(raw); return; }
        const value = Number(raw);
        if (Number.isSafeInteger(value)) { setRankInput(raw); setRank(value); }
      }} onBlur={() => setRankInput(String(rank))} onKeyDown={event => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') { event.preventDefault(); selectRank(rank + (event.key === 'ArrowUp' ? 1 : -1)); }
        if (event.key === 'Enter' || event.key === 'Escape') { event.preventDefault(); setRankInput(String(rank)); }
      }}/>
      <button type="button" aria-label={t('ref119.increaseRank')} onClick={() => selectRank(rank + 1)} disabled={rank === Number.MAX_SAFE_INTEGER}><ChevronUp size={14}/></button>
    </span></label>
      <UnitToggle system={system} onChange={onSystemChange}/></div>
    <dl className="reference-measures">{(['mass','time','distance','volume'] as const).map(key => <div key={key}><dt>{t(`ref119.${key}`)}</dt><dd>{format(key === 'time' ? current.time : current[system][key])}</dd></div>)}</dl>
    {(rank > 30 || rank < -5) && <p className="reference-card__note" role="status">{t('ref119.extrapolated', { rank, base: rank > 30 ? 30 : -5, steps: Math.abs(rank - (rank > 30 ? 30 : -5)), operation: t(rank > 30 ? 'ref119.doubling' : 'ref119.halving') })}</p>}
    <p className="reference-card__note">{t('ref119.measurementHelp')}</p>
    <div className="reference-measure-scroll" role="region" aria-label={t('ref119.fullMeasurements')} tabIndex={0}>
      <table className="reference-measure-table"><caption className="sr-only">{t('ref119.fullMeasurements')} · {t(`ref119.${system}`)}</caption><thead><tr>{['rank','mass','time','distance','volume'].map(key => <th key={key} scope="col">{t(`ref119.${key}`)}</th>)}</tr></thead>
        <tbody>{MEASUREMENTS.filter(row => visible.has(String(row.rank))).map(row => <tr key={row.rank} className={row.rank === rank ? 'reference-table__selected' : undefined}>
          <th scope="row"><button type="button" onClick={() => selectRank(row.rank)} aria-pressed={row.rank === rank} aria-label={t('ref119.selectRank', { rank: row.rank })}>{row.rank}</button></th>
          <td>{format(row[system].mass)}</td><td>{format(row.time)}</td><td>{format(row[system].distance)}</td><td>{format(row[system].volume)}</td>
        </tr>)}</tbody></table>
    </div><p className="reference-card__note">{t('ref119.measurementFormula')}</p>
  </>;
}

function CheckTools({ damage }: { damage?: boolean }) {
  const { t } = useTranslation();
  const [result, setResult] = useState(20);
  const [difficulty, setDifficulty] = useState(damage ? 10 : 20);
  const dc = damage ? 15 + difficulty : difficulty;
  const check = checkDegree(result, dc);
  const degree = damage ? damageDegree(result, difficulty) : undefined;
  return <div className="reference-check">
    <div className="reference-tools"><label>{t(damage ? 'ref119.damageRank' : 'ref119.dc')}<NumberInput aria-label={t(damage ? 'ref119.damageRank' : 'ref119.dc')} value={difficulty} min={damage ? -5 : -100} max={100} variant="compact" onChange={value => setDifficulty(Math.trunc(value))}/></label>
      <label>{t('ref119.checkTotal')}<NumberInput aria-label={t('ref119.checkTotal')} value={result} min={-100} max={200} variant="compact" onChange={value => setResult(Math.trunc(value))}/></label></div>
    <p role="status" aria-live="polite">{damage ? t('ref119.damageResult', { dc, result: t(`ref119.damage.${degree}`) }) : t(check.success ? 'ref119.success' : 'ref119.failure', { count: check.degrees })}</p>
    <small>{t('ref119.queryOnly')}</small>
    {damage && <DamageMatrix/>}
  </div>;
}

function DamageMatrix() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return <div className="reference-matrix">
    <button type="button" aria-expanded={open} aria-controls="reference-damage-matrix" onClick={() => setOpen(value => !value)}>{open ? <ChevronDown size={15}/> : <ChevronRight size={15}/>} {t('ref119.matrix')}</button>
    {open && <div id="reference-damage-matrix"><p className="reference-card__note">{t('ref119.matrixHelp')}</p>
      <div className="reference-matrix__scroll" role="region" tabIndex={0} aria-label={t('ref119.matrix')}><table className="reference-matrix__table"><caption className="sr-only">{t('ref119.matrix')}</caption><thead><tr><th scope="col">{t('ref119.totalVsRank')}</th>{Array.from({ length: 20 }, (_, index) => <th scope="col" key={index}>{index + 1}</th>)}</tr></thead>
        <tbody>{Array.from({ length: 35 }, (_, result) => <tr key={result}><th scope="row">{result + 1}</th>{Array.from({ length: 20 }, (_, rank) => { const degree = damageDegree(result + 1, rank + 1); return <td key={rank} className={`reference-matrix__degree-${degree}`}><span aria-label={t(`ref119.damage.${degree}`)}>{degree || '—'}</span></td>; })}</tr>)}</tbody>
      </table></div></div>}
  </div>;
}

export function ReferencesView() {
  const { t, i18n } = useTranslation();
  const [category, setCategory] = useState<Category>('quick');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(new Set(QUICK));
  const [searchCollapsed, setSearchCollapsed] = useState(new Set<string>());
  const headerRef = useRef<HTMLElement>(null);
  const [system, setSystem] = useState<MeasurementSystem>(() => loadMeasurementSystem(i18n.language));
  // Persist the initial language default too, even before the first toggle click.
  useEffect(() => { saveMeasurementSystem(system); }, [system]);
  function changeSystem(next: MeasurementSystem) { setSystem(next); }
  const catalog = useMemo(() => {
    const conditionSections: ReferenceSection[] = [BASIC_CONDITIONS, COMBINED_CONDITIONS].map((conditions, index) => ({ id: index ? 'combined-conditions' : 'basic-conditions', category: 'conditions', title: index ? ['Combined conditions','Condições combinadas'] : ['Basic conditions','Condições básicas'], pages: '17–19', columns: index ? [['Condition','Condição'],['Components','Componentes'],['Effect','Efeito']] : [['Condition','Condição'],['Effect','Efeito']], rows: conditions.map(condition => {
      const title = t(`conditions.${condition.id}`, { lng: 'pt-BR', defaultValue: condition.name });
      const cells: [string,string][] = [[condition.name, `${title} (${condition.name})`]];
      if (index) cells.push([(condition.components ?? []).map(id => CONDITIONS.find(item => item.id === id)?.name ?? id).join(' + '), (condition.components ?? []).map(id => t(`conditions.${id}`, { lng: 'pt-BR', defaultValue: id })).join(' + ')]);
      cells.push([condition.description, t(`conditions.desc.${condition.id}`, { lng: 'pt-BR', defaultValue: condition.description })]);
      return { id: condition.id, cells };
    }) }));
    const measurements: ReferenceSection = { id: 'measurements', category: 'measurements', title: ['Measurements table','Tabela de medidas'], pages: '10–11, 347', columns: [['Rank','Graduação'],['Mass','Massa'],['Time','Tempo'],['Distance','Distância'],['Volume','Volume']], rows: MEASUREMENTS.map(row => ({ id: String(row.rank), cells: [[String(row.rank),String(row.rank)], ...(['mass','time','distance','volume'] as const).map((key): [string,string] => [formatMeasure(key === 'time' ? row.time : row.imperial[key], 'en', (unit, count) => t(`ref119.unit.${unit}`, { lng: 'en', count })), formatMeasure(key === 'time' ? row.time : row.metric[key], 'pt-BR', (unit, count) => t(`ref119.unit.${unit}`, { lng: 'pt-BR', count }))])] })) };
    return [measurements, ...REFERENCE_SECTIONS, ...conditionSections, getSizeSection(system), BENCHMARK_SECTION];
  }, [t, system]);
  const searching = query.trim().length > 0;
  const sections = catalog.filter(section => searching || category === 'all' || (category === 'quick' ? QUICK.has(section.id) : section.category === category)).map(section => filterReferenceSection(section, query)).filter((section): section is ReferenceSection => !!section);
  function chooseCategory(next: Category) {
    setCategory(next); setQuery('');
    setExpanded(new Set(next === 'all' ? [] : catalog.filter(section => next === 'quick' ? QUICK.has(section.id) : section.category === next).map(section => section.id)));
    headerRef.current?.scrollIntoView({ block: 'start' });
  }
  function toggle(id: string) { const update = (previous: Set<string>) => { const next = new Set(previous); if (next.has(id)) next.delete(id); else next.add(id); return next; }; if (searching) setSearchCollapsed(update); else setExpanded(update); }
  return <div className="references-view">
    <header className="reference-header" ref={headerRef}><div><h1><BookOpen size={24}/> {t('ref.title')}</h1><p>{t('ref119.subtitle')}</p></div>
      <label className="reference-search"><span className="sr-only">{t('ref119.search')}</span><Search size={18}/><input type="search" aria-label={t('ref119.search')} placeholder={t('ref119.searchPlaceholder')} value={query} onChange={event => { setQuery(event.target.value); setSearchCollapsed(new Set()); }}/>{query && <button type="button" aria-label={t('ref119.clearSearch')} onClick={() => setQuery('')}><X size={17}/></button>}</label>
    </header>
    <div className="reference-layout"><nav className="reference-nav" aria-label={t('ref119.topics')}>{CATEGORIES.map(item => <button type="button" key={item} aria-pressed={!searching && item === category} onClick={() => chooseCategory(item)}>{t(`ref119.category.${item}`)}</button>)}</nav>
      <div className="reference-content"><div className="reference-toolbar"><p role="status">{searching ? t('ref119.searchResults', { count: sections.length }) : t(`ref119.category.${category}`)}</p><div><button type="button" onClick={() => searching ? setSearchCollapsed(new Set()) : setExpanded(new Set(sections.map(section => section.id)))}>{t('ref119.expandAll')}</button><button type="button" onClick={() => searching ? setSearchCollapsed(new Set(sections.map(section => section.id))) : setExpanded(new Set())}>{t('ref119.collapseAll')}</button></div></div>
        {!sections.length && <p className="reference-empty">{t('ref119.noResults')}</p>}
        <ReferenceGrid>{sections.map(section => <ReferenceCard key={section.id} section={section} open={searching ? !searchCollapsed.has(section.id) : expanded.has(section.id)} onToggle={() => toggle(section.id)}>
          {section.id === 'measurements' ? <Measurements section={section} system={system} onSystemChange={changeSystem}/> : <>{section.id === 'size' && <div className="reference-tools"><UnitToggle system={system} onChange={changeSystem}/></div>}{section.id === 'damage' && <CheckTools damage/>}{section.id === 'checks' && <CheckTools/>}<ReferenceTable section={section}/></>}
        </ReferenceCard>)}</ReferenceGrid>
      </div>
    </div>
    <footer className="reference-source">{t('ref119.source')} <a href="https://greenroninstore.com/products/mutants-masterminds-gamemaster-s-kit-revised-edition" target="_blank" rel="noreferrer">{t('ref119.screenLink')}</a></footer>
  </div>;
}
