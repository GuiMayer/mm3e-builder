import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ICharacter, ICharacterPowerComponent, ITraitTarget } from '../../../entities/types';
import { POWER_DEFS, MODIFIER_DEFS } from '../../../entities/gameDataLoaders';
import { setEnhancedTarget, traitTargetKey, enhancedCostOption } from '../../../shared/lib/traitTargets';
import { calculateComponentPricing } from '../../../shared/lib/mathEngine';
import { useAppDialog } from '../../../shared/ui/appDialogContext';
import { TraitTargetSelect } from '../../trait-modifiers/TraitTargetSelect';
import '../../../features/trait-modifiers/traitModifiers.css';

const categories = { ability: 'Enhanced Ability', defense: 'Enhanced Defense', skill: 'Enhanced Skill' } as const;

export function EnhancedTargetEditor({ component, character, onChange }: { component: ICharacterPowerComponent; character: ICharacter; onChange: (update: Partial<ICharacterPowerComponent>) => void }) {
  const { t } = useTranslation();
  const dialog = useAppDialog();
  const categoryId = useId();
  const [busy, setBusy] = useState(false);
  const [legacyUnbound] = useState(!component.enhancedTarget && !!component.variableCostOption);
  const [reviewed, setReviewed] = useState(false);
  const effect = POWER_DEFS.find(def => def.id === 'enhanced-trait')!;
  const option = component.enhancedTarget ? enhancedCostOption(component.enhancedTarget) : component.variableCostOption ?? '';
  const category = (Object.keys(categories) as (keyof typeof categories)[]).find(key => categories[key] === option);
  const price = calculateComponentPricing(component, effect, MODIFIER_DEFS);
  async function choose(target?: ITraitTarget) {
    if (target && component.enhancedTarget && traitTargetKey(target) === traitTargetKey(component.enhancedTarget)) return;
    const proposed = setEnhancedTarget(component, target);
    if (target && legacyUnbound && !reviewed) {
      const before = price.total;
      const after = calculateComponentPricing(proposed, effect, MODIFIER_DEFS).total;
      const current = target.kind === 'ability' ? character.abilities[target.key] : target.kind === 'defense' ? target.key === 'toughness' ? character.abilities.sta : character.defenses[target.key] : character.skills.find(skill => skill.skillId === target.skillId && (skill.subtype ?? null) === (target.subtype ?? null))?.ranks ?? 0;
      setBusy(true);
      const confirmed = await dialog.confirm({ title: t('traits.target'), message: t('traits.targetReview', { before, after, current, proposed: current + component.ranks }) });
      setBusy(false);
      if (!confirmed) return;
      setReviewed(true);
    }
    onChange({ enhancedTarget: proposed.enhancedTarget, variableCostOption: proposed.variableCostOption });
  }
  return <div className="enhanced-target-editor">
    <label htmlFor={categoryId}>{t('traits.category')}</label><select id={categoryId} disabled={busy} value={option} onChange={event => onChange({ enhancedTarget: undefined, variableCostOption: event.target.value || undefined })}>
      <option value="">{t('traits.chooseCategory')}</option>
      {effect.variableCost?.options.map(item => <option key={item.name} value={item.name}>{t(`traits.category.${item.name}`, { defaultValue: item.name })}</option>)}
      {option && !effect.variableCost?.options.some(item => item.name === option) && <option value={option}>{option}</option>}
    </select>
    {category && <TraitTargetSelect key={category} category={category} target={component.enhancedTarget} onChange={target => void choose(target)} disabled={busy} skills={character.skills} />}
    <div className="enhanced-target-editor__preview"><span>{component.enhancedTarget ? t('traits.appliedRanks', { ranks: component.ranks }) : t('traits.noTarget')}</span><strong>{price.total} {t('common.pp')}</strong></div>
    <small>{t(component.enhancedTarget ? 'traits.targetCost' : category ? 'traits.targetMissingHint' : 'traits.manualCategoryHint')}</small>
  </div>;
}
