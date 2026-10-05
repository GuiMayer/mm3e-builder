import { useId, useState } from 'react';
import { Button } from '../../shared/ui/Button';
import { useTranslation } from 'react-i18next';
import type { ICharacterSkill, ITraitTarget } from '../../entities/types';
import { SKILL_DEFS } from '../../entities/gameDataLoaders';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { traitTargetKey } from '../../shared/lib/traitTargets';

export function TraitTargetSelect({ target, category, onChange, skills, disabled }: { target?: ITraitTarget; category: ITraitTarget['kind']; onChange: (target?: ITraitTarget) => void; skills: ICharacterSkill[]; disabled?: boolean }) {
  const { t, i18n } = useTranslation();
  const id = useId();
  const [customSkillId, setCustomSkillId] = useState('');
  const [subtype, setSubtype] = useState('');
  const [search, setSearch] = useState('');
  const definitions = useLocalizedData(SKILL_DEFS);
  const abilities = ['str', 'sta', 'agl', 'dex', 'fgt', 'int', 'awe', 'pre'] as const;
  const defenses = ['dodge', 'parry', 'fortitude', 'will', 'toughness'] as const;
  const targets: { target: ITraitTarget; name: string }[] = [
    ...abilities.map(key => ({ target: { kind: 'ability' as const, key }, name: t(`abilities.${key}`) })),
    ...defenses.map(key => ({ target: { kind: 'defense' as const, key }, name: t(`defenses.${key}`) })),
    ...definitions.filter(def => !def.subtyped).map(def => ({ target: { kind: 'skill' as const, skillId: def.id }, name: def.name })),
    ...skills.filter(skill => definitions.find(def => def.id === skill.skillId)?.subtyped && skill.subtype).map(skill => ({ target: { kind: 'skill' as const, skillId: skill.skillId, subtype: skill.subtype }, name: `${definitions.find(def => def.id === skill.skillId)?.name ?? skill.skillId}: ${skill.subtype}` })),
  ];
  if (target && !targets.some(item => traitTargetKey(item.target) === traitTargetKey(target))) targets.push({ target, name: target.kind === 'skill' ? `${definitions.find(def => def.id === target.skillId)?.name ?? target.skillId}${target.subtype ? ': ' + target.subtype : ''}` : traitTargetKey(target) });
  const term = search.trim().toLocaleLowerCase(i18n.language);
  const matches = (name: string) => name.toLocaleLowerCase(i18n.language).includes(term);
  const options = [...new Map(targets.filter(item => item.target.kind === category && (matches(item.name) || (target && traitTargetKey(item.target) === traitTargetKey(target)))).map(item => [traitTargetKey(item.target), item])).values()].sort((a,b) => a.name.localeCompare(b.name,i18n.language));
  return <div className="trait-target-select">
    {category === 'skill' && <label htmlFor={`${id}-search`}>{t('traits.searchTarget')}<input id={`${id}-search`} type="search" value={search} disabled={disabled} onChange={event => setSearch(event.target.value)} /></label>}
    <label htmlFor={id}>{t('traits.target')}</label>
    <select id={id} disabled={disabled} value={customSkillId ? `new-skill:${customSkillId}` : target ? traitTargetKey(target) : ''} onChange={event => {
      if (event.target.value.startsWith('new-skill:')) { setCustomSkillId(event.target.value.slice(10)); setSubtype(''); }
      else { setCustomSkillId(''); onChange(options.find(item => traitTargetKey(item.target) === event.target.value)?.target); }
    }}>
      <option value="">{t('traits.noTarget')}</option>
      {options.map(item => <option key={traitTargetKey(item.target)} value={traitTargetKey(item.target)}>{item.name}</option>)}
      {category === 'skill' && <optgroup label={t('traits.newSubtype')}>{definitions.filter(def => def.subtyped && matches(def.name)).sort((a,b) => a.name.localeCompare(b.name,i18n.language)).map(def => <option key={def.id} value={`new-skill:${def.id}`}>{def.name}</option>)}</optgroup>}
    </select>
    {customSkillId && <div className="trait-target-select__subtype"><label>{t('traits.skillSubtype')}<input value={subtype} disabled={disabled} onChange={event => setSubtype(event.target.value)} /></label><div><Button size="sm" disabled={disabled || !subtype.trim()} onClick={() => { onChange({ kind: 'skill', skillId: customSkillId, subtype: subtype.trim() }); setCustomSkillId(''); }}>{t('traits.useTarget')}</Button><Button size="sm" variant="ghost" onClick={() => setCustomSkillId('')}>{t('common.cancel')}</Button></div></div>}
  </div>;
}
