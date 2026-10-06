import { useTranslation } from 'react-i18next';
import type { ReturnTypeOfArchetype } from './types';
import { effectiveTraitCharacter } from '../../shared/lib/traitValues';
import { deriveCharacterDefenses } from '../../shared/lib/derivedDefenses';
import { buildTargetedEffectProfiles } from '../../shared/lib/offenseSummary';
import { getPricingStrength } from '../../shared/lib/pricingStrength';
import { ADVANTAGE_DEFS, MODIFIER_DEFS, POWER_DEFS, SKILL_DEFS } from '../../entities/gameDataLoaders';
import { PowerCompositionPreview } from '../power-library/PowerCompositionPreview';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { getResourceCost } from '../../shared/lib/resourceCalculations';

export function ArchetypePreview({ preview }: { preview: ReturnTypeOfArchetype }) {
  const { t }=useTranslation();
  const { character, resources, summary }=preview;
  const skills=useLocalizedData(SKILL_DEFS);const advantages=useLocalizedData(ADVANTAGE_DEFS);
  const effective=effectiveTraitCharacter(character,resources);
  const defenses=deriveCharacterDefenses(character,POWER_DEFS,resources);
  const attacks=buildTargetedEffectProfiles(character,POWER_DEFS,SKILL_DEFS,ADVANTAGE_DEFS,MODIFIER_DEFS,undefined,resources,false);
  const strength=getPricingStrength(character,resources);
  return <div className="creation-preview">
    <dl className="creation-costs">{[['abilities',summary.abilitiesCost],['powers',summary.powersCost],['advantages',summary.advantagesCost],['skills',summary.skillsCost],['defenses',summary.defensesCost]].map(([key,value])=><div key={key}><dt>{t(`${key}.title`)}</dt><dd>{value} PP</dd></div>)}</dl>
    <details open><summary>{t('abilities.title')}</summary><div className="creation-values">{Object.entries(character.abilities).map(([key,base])=><div key={key}><strong>{t(`abilities.${key}`)}</strong><span>{character.absentAbilities.includes(key as keyof typeof character.abilities)?'—':effective.abilities[key as keyof typeof effective.abilities]}</span><small>{t('creation.baseValue',{value:base})}</small></div>)}</div></details>
    <details><summary>{t('defenses.title')}</summary><div className="creation-values">{(['dodge','parry','fortitude','will','toughness'] as const).map(key=><div key={key}><strong>{t(`defenses.${key}`)}</strong><span>{key==='fortitude'&&character.absentAbilities.includes('sta')?t('creation.immune'):defenses[`${key}Total`]}</span></div>)}<div><strong>{t('creation.initiative')}</strong><span>{defenses.initiativeTotal}</span></div></div></details>
    <details><summary>{t('creation.attacks')}</summary><ul className="creation-rows">{attacks.map(attack=><li key={attack.id}><strong>{attack.name}</strong><span>{attack.bonus} · {attack.effect}</span></li>)}</ul></details>
    <details><summary>{t('skills.title')}</summary><ul className="creation-rows">{effective.skills.map((entry,index)=><li key={index}><strong>{skills.find(def=>def.id===entry.skillId)?.name}{entry.subtype?` · ${entry.subtype}`:''}</strong><span>{entry.ranks} {t('common.ranks')}</span></li>)}</ul></details>
    <details><summary>{t('advantages.title')}</summary><ul className="creation-rows">{effective.advantages.map((entry,index)=><li key={index}><strong>{advantages.find(def=>def.id===entry.advantageId)?.name}{entry.subtype?` · ${entry.subtype}`:''}</strong><span>{entry.ranks}</span></li>)}</ul></details>
    <details><summary>{t('powers.title')}</summary>{character.powers.map(item=><details key={item.id}><summary>{item.name}</summary><PowerCompositionPreview power={item} strength={strength}/></details>)}</details>
    {resources.length>0&&<details><summary>{t('creation.equipment')} · {summary.totalEPUsed} / {summary.equipmentEPLimit} EP</summary>{resources.map(resource=>{const cost=getResourceCost(resource,POWER_DEFS,MODIFIER_DEFS,strength);return <details key={resource.id}><summary>{resource.name} · {cost.total} {cost.unit}</summary>{resource.type==='vehicle'?<p>{t('creation.vehicleValues',{strength:resource.strength,speed:resource.speed,defense:10+resource.defense,toughness:resource.toughness})}</p>:resource.type!=='headquarters'&&<PowerCompositionPreview power={resource.power} strength={strength} costUnit={cost.unit}/>}</details>;})}</details>}
  </div>;
}
