import { useState } from 'react';
import { Button } from '../../shared/ui/Button';
import { useTranslation } from 'react-i18next';
import type { ICharacterSkill, ITraitTarget } from '../../entities/types';
import { SKILL_DEFS } from '../../entities/gameDataLoaders';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { traitTargetKey } from '../../shared/lib/traitTargets';

export function TraitTargetSelect({ target, onChange, skills, disabled }: { target?: ITraitTarget; onChange: (target?: ITraitTarget) => void; skills: ICharacterSkill[]; disabled?: boolean }) {
  const { t, i18n } = useTranslation();
  const [customSkillId, setCustomSkillId] = useState('');
  const [subtype, setSubtype] = useState('');
  const definitions = useLocalizedData(SKILL_DEFS);
  const abilities = ['str', 'sta', 'agl', 'dex', 'fgt', 'int', 'awe', 'pre'] as const;
  const defenses = ['dodge', 'parry', 'fortitude', 'will', 'toughness'] as const;
  const targets: { target: ITraitTarget; name: string }[] = [
    ...abilities.map(key => ({ target: { kind: 'ability' as const, key }, name: t(`abilities.${key}`) })),
    ...defenses.map(key => ({ target: { kind: 'defense' as const, key }, name: t(`defenses.${key}`) })),
    ...definitions.filter(def => !def.subtyped).map(def => ({ target: { kind: 'skill' as const, skillId: def.id }, name: def.name })),
    ...skills.filter(skill => definitions.find(def => def.id === skill.skillId)?.subtyped && skill.subtype).map(skill => ({ target: { kind: 'skill' as const, skillId: skill.skillId, subtype: skill.subtype }, name: `${definitions.find(def => def.id === skill.skillId)?.name ?? skill.skillId}: ${skill.subtype}` })),
  ];
  if (target && !targets.some(item => traitTargetKey(item.target) === traitTargetKey(target))) targets.push({ target, name: traitTargetKey(target) });
  return <label className="trait-target-select"><span>{t('traits.target')}</span><select disabled={disabled} value={customSkillId ? `new-skill:${customSkillId}` : target ? traitTargetKey(target) : ''} onChange={event => { if (event.target.value.startsWith('new-skill:')) { setCustomSkillId(event.target.value.slice(10)); setSubtype(''); } else { setCustomSkillId(''); onChange(targets.find(item => traitTargetKey(item.target) === event.target.value)?.target); } }}><option value="">{t('traits.noTarget')}</option>{(['ability', 'defense', 'skill'] as const).map(kind => <optgroup key={kind} label={t(kind === 'ability' ? 'abilities.title' : kind === 'defense' ? 'defenses.title' : 'skills.title')}>{targets.filter(item => item.target.kind === kind).sort((a, b) => a.name.localeCompare(b.name, i18n.language)).map(item => <option key={traitTargetKey(item.target)} value={traitTargetKey(item.target)}>{item.name}</option>)}{kind === 'skill' && definitions.filter(def => def.subtyped).sort((a, b) => a.name.localeCompare(b.name, i18n.language)).map(def => <option key={def.id} value={`new-skill:${def.id}`}>{def.name} · {t('traits.newSubtype')}</option>)}</optgroup>)}</select>{customSkillId && <><input aria-label={t('traits.skillSubtype')} placeholder={t('traits.skillSubtype')} value={subtype} disabled={disabled} onChange={event => setSubtype(event.target.value)} /><Button size="sm" disabled={disabled || !subtype.trim()} onClick={() => { onChange({ kind: 'skill', skillId: customSkillId, subtype: subtype.trim() }); setCustomSkillId(''); }}>{t('traits.useTarget')}</Button></>}</label>;
}
