import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ICharacter, ICharacterPowerComponent, ITraitTarget } from '../../../entities/types';
import { POWER_DEFS, MODIFIER_DEFS, ADVANTAGE_DEFS } from '../../../entities/gameDataLoaders';
import { enhancedAdvantage, enhancedImpervious } from '../../../shared/lib/enhancedTraits';
import { setEnhancedTarget, traitTargetKey, enhancedCostOption } from '../../../shared/lib/traitTargets';
import { calculateComponentPricing } from '../../../shared/lib/mathEngine';
import { useAppDialog } from '../../../shared/ui/appDialogContext';
import { TraitTargetSelect } from '../../trait-modifiers/TraitTargetSelect';
import '../../trait-modifiers/traitModifiers.css';

const categories = { ability: 'Enhanced Ability', defense: 'Enhanced Defense', skill: 'Enhanced Skill' } as const;

export function EnhancedTargetEditor({ component, character, onChange, reviewAssociation = false }: { reviewAssociation?: boolean; component: ICharacterPowerComponent; character: ICharacter; onChange: (update: Partial<ICharacterPowerComponent>) => void }) {
  const { t, i18n } = useTranslation();
  const dialog = useAppDialog();
  const categoryId = useId();
  const [busy, setBusy] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const effect = POWER_DEFS.find(def => def.id === 'enhanced-trait')!;
  const option = component.enhancedTarget ? enhancedCostOption(component.enhancedTarget) : component.variableCostOption ?? '';
  const category = (Object.keys(categories) as (keyof typeof categories)[]).find(key => categories[key] === option);
  const price = calculateComponentPricing(component, effect, MODIFIER_DEFS);
  const advantage = enhancedAdvantage(component);
  const extra = enhancedImpervious(component);
  const associated = !!component.enhancedTarget || !!advantage || extra;
  const fields = { ...component.fieldValues };
  function clearAssociation() {
    const rest = { ...fields };
    delete rest.enhancedAdvantageId; delete rest.enhancedAdvantageSubtype; delete rest.enhancedScope;
    delete rest.enhancedExtraId; delete rest.enhancedExtraTarget;
    return rest;
  }
  async function choose(target?: ITraitTarget) {
    if (target && component.enhancedTarget && traitTargetKey(target) === traitTargetKey(component.enhancedTarget)) return;
    const proposed = setEnhancedTarget(component, target);
    if (target && reviewAssociation && !reviewed) {
      const before = price.total;
      const after = calculateComponentPricing(proposed, effect, MODIFIER_DEFS).total;
      const current = target.kind === 'ability' ? character.abilities[target.key] : target.kind === 'defense' ? target.key === 'toughness' ? character.abilities.sta : character.defenses[target.key] : character.skills.find(skill => skill.skillId === target.skillId && (skill.subtype ?? null) === (target.subtype ?? null))?.ranks ?? 0;
      setBusy(true);
      const confirmed = await dialog.confirm({ title: t('traits.target'), message: t('traits.targetReview', { before, after, current, proposed: current + component.ranks }) });
      setBusy(false);
      if (!confirmed) return;
      setReviewed(true);
    }
    onChange({ enhancedTarget: proposed.enhancedTarget, variableCostOption: proposed.variableCostOption, fieldValues: clearAssociation() });
  }
  return <div className="enhanced-target-editor">
    <label htmlFor={categoryId}>{t('traits.category')}</label><select id={categoryId} disabled={busy} value={option} onChange={event => onChange({ enhancedTarget: undefined, variableCostOption: event.target.value || undefined, fieldValues: clearAssociation() })}>
      <option value="">{t('traits.chooseCategory')}</option>
      {effect.variableCost?.options.map(item => <option key={item.name} value={item.name}>{t(`traits.category.${item.name}`, { defaultValue: item.name })}</option>)}
      {option && !effect.variableCost?.options.some(item => item.name === option) && <option value={option}>{option}</option>}
    </select>
    {category && <TraitTargetSelect key={category} category={category} target={component.enhancedTarget} onChange={target => void choose(target)} disabled={busy} skills={character.skills} />}
    {option === 'Enhanced Advantage' && <><label>{t('traits.advantageTarget')}<select className="app-select" value={advantage?.advantageId ?? ''} onChange={event => onChange({ fieldValues: { ...clearAssociation(), enhancedAdvantageId: event.target.value } })}><option value="">{t('builder.selectOption')}</option>{[...ADVANTAGE_DEFS].sort((a,b) => (a.i18n?.[i18n.language]?.name ?? a.name).localeCompare(b.i18n?.[i18n.language]?.name ?? b.name, i18n.language)).map(def => <option key={def.id} value={def.id}>{def.i18n?.[i18n.language]?.name ?? def.name}</option>)}</select></label>{advantage && <label>{t('traits.advantageSpecialization')}<input value={advantage.subtype ?? ''} onChange={event => onChange({ fieldValues: { ...fields, enhancedAdvantageSubtype: event.target.value || '' } })}/></label>}</>}
    {component.enhancedTarget?.kind === 'ability' && component.enhancedTarget.key === 'str' && <label>{t('traits.strengthScope')}<select className="app-select" value={fields.enhancedScope === 'lifting' ? 'lifting' : 'all'} onChange={event => onChange({ fieldValues: { ...fields, enhancedScope: event.target.value } })}><option value="all">{t('traits.strengthAll')}</option><option value="lifting">{t('traits.strengthLifting')}</option></select></label>}
    {option === 'Enhanced Extra' && <label>{t('traits.extraTarget')}<select className="app-select" value={extra?'impervious':''} onChange={event=>onChange({fieldValues:event.target.value?{...clearAssociation(),enhancedExtraId:'impervious',enhancedExtraTarget:'toughness'}:clearAssociation()})}><option value="">{t('traits.manualCategoryHint')}</option><option value="impervious">{t('traits.imperviousToughness')}</option></select></label>}
    <div className="enhanced-target-editor__preview"><span>{associated ? t('traits.appliedRanks', { ranks: component.ranks }) : t('traits.noTarget')}</span><strong>{price.total} {t('common.pp')}</strong></div>
    <small>{t(associated ? 'traits.targetCost' : !option ? 'traits.chooseCategory' : category ? 'traits.targetMissingHint' : 'traits.manualCategoryHint')}</small>
  </div>;
}
