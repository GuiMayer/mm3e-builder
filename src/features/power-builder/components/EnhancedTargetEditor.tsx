import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ICharacter, ICharacterPowerComponent, ITraitTarget } from '../../../entities/types';
import { POWER_DEFS, MODIFIER_DEFS } from '../../../entities/gameDataLoaders';
import { setEnhancedTarget, traitTargetKey } from '../../../shared/lib/traitTargets';
import { calculateComponentPricing } from '../../../shared/lib/mathEngine';
import { useAppDialog } from '../../../shared/ui/appDialogContext';
import { Button } from '../../../shared/ui/Button';
import { TraitTargetSelect } from '../../trait-modifiers/TraitTargetSelect';

export function EnhancedTargetEditor({ component, character, onChange }: { component: ICharacterPowerComponent; character: ICharacter; onChange: (update: Partial<ICharacterPowerComponent>) => void }) {
  const { t } = useTranslation();
  const dialog = useAppDialog();
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(!!component.enhancedTarget);
  async function choose(target?: ITraitTarget) {
    if (target && component.enhancedTarget && traitTargetKey(target) === traitTargetKey(component.enhancedTarget)) return;
    const proposed = setEnhancedTarget(component, target);
    if (target) {
      const effect = POWER_DEFS.find(def => def.id === 'enhanced-trait')!;
      const before = calculateComponentPricing(component, effect, MODIFIER_DEFS).total;
      const after = calculateComponentPricing(proposed, effect, MODIFIER_DEFS).total;
      const current = target.kind === 'ability' ? character.abilities[target.key] : target.kind === 'defense' ? target.key === 'toughness' ? character.abilities.sta : character.defenses[target.key] : character.skills.find(skill => skill.skillId === target.skillId && (skill.subtype ?? null) === (target.subtype ?? null))?.ranks ?? 0;
      setBusy(true);
      const confirmed = await dialog.confirm({ title: t('traits.target'), message: t('traits.targetReview', { before, after, current, proposed: current + component.ranks }) });
      setBusy(false);
      if (!confirmed) return;
    }
    onChange({ enhancedTarget: proposed.enhancedTarget, variableCostOption: proposed.variableCostOption });
  }
  if (!expanded) return <Button variant="ghost" size="sm" onClick={() => setExpanded(true)}>{t('traits.addTarget')}</Button>;
  return <div className="enhanced-target-editor"><TraitTargetSelect target={component.enhancedTarget} onChange={target => void choose(target)} disabled={busy} skills={character.skills} /><small>{t(component.enhancedTarget ? 'traits.targetCost' : 'traits.targetMissingHint')}</small></div>;
}
