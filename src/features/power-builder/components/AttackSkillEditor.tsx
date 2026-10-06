import { useTranslation } from 'react-i18next';
import type { ICharacter, ICharacterPowerComponent } from '../../../entities/types';

/** Keep explicit archetype combat associations editable without changing purchased ranks. */
export function AttackSkillEditor({component,character,onChange}:{component:ICharacterPowerComponent;character:ICharacter;onChange:(fields:NonNullable<ICharacterPowerComponent['fieldValues']>)=>void}) {
  const {t}=useTranslation();
  const current=typeof component.fieldValues?.attackSkill==='string'?component.fieldValues.attackSkill:'';
  const options=[...new Set([current,...character.skills.filter(skill=>['close_combat','ranged_combat'].includes(skill.skillId)).map(skill=>skill.subtype??'')])].filter(Boolean).sort((a,b)=>a.localeCompare(b));
  return <div className="configurable-fields"><label className="configurable-field build-label">{t('builder.attackSkill')}<select className="app-select field-dropdown" value={current} onChange={event=>{const fields={...component.fieldValues};if(event.target.value)fields.attackSkill=event.target.value;else delete fields.attackSkill;onChange(fields);}}><option value="">{t('builder.attackSkillDefault')}</option>{options.map(value=><option key={value} value={value}>{value}</option>)}</select></label></div>;
}
