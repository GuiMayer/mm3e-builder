import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ICharacter, IResource } from '../../entities/types';
import { Modal } from '../../shared/ui/Modal';
import { Button } from '../../shared/ui/Button';
import { NumberInput } from '../../shared/ui/NumberInput';
import { applyResourceReview, needsResourceReview, type ResourceReviewChoice } from '../../shared/lib/resourceReview';
import { getResourceCost } from '../../shared/lib/resourceCalculations';
import { getCharacterStrength } from '../../shared/lib/componentRanks';
import { useResourcesStore } from '../../store/resourcesStore';

export function ResourceReviewDialog({ resources, character, onClose }: { resources: IResource[]; character: ICharacter; onClose: () => void }) {
  const { t } = useTranslation();
  const [choices, setChoices] = useState<Record<string, ResourceReviewChoice>>(() => Object.fromEntries(resources.filter(needsResourceReview).map((resource) => [resource.id,
    resource.type === 'vehicle' ? { movementEffect: 'speed' } : resource.type === 'headquarters' ? { powerLevel: character.header.powerLevel } : { costMode: resource.costMode ?? 'equipment', removable: resource.power.removable === 'easily_removable' ? 'easily_removable' : 'removable' }])));
  const [error, setError] = useState(false);
  const update = (id: string, value: Partial<ResourceReviewChoice>) => setChoices((current) => ({ ...current, [id]: { ...current[id], ...value } }));
  const preview = applyResourceReview(resources, choices);
  function save() {
    const current = useResourcesStore.getState();
    const next = applyResourceReview(current.resources, choices);
    if (!current.replaceResources(next)) { setError(true); return; }
    onClose();
  }
  return <Modal isOpen onClose={onClose} title={t('resources.review.title')}><div className="resource-review">
    <p>{t('resources.review.explanation')}</p>
    {resources.filter(needsResourceReview).map((resource) => {
      const choice = choices[resource.id], before = getResourceCost(resource, undefined, undefined, getCharacterStrength(character));
      const after = getResourceCost(preview.find((item) => item.id === resource.id)!, undefined, undefined, getCharacterStrength(character));
      return <fieldset key={resource.id}><legend>{resource.name || t('resources.unnamed')}</legend>
        {resource.type === 'vehicle' ? <><p>{t('resources.review.movementHint', { ranks: resource.speed })}</p><label>{t('resources.movement')}<select value={choice.movementEffect} onChange={(event) => update(resource.id, { movementEffect: event.target.value as ResourceReviewChoice['movementEffect'] })}>{['speed', 'flight', 'swimming', 'burrowing', 'systems'].map((effect) => <option key={effect} value={effect}>{t(`resources.movement.${effect}`)}</option>)}</select></label>{resource.systems.length > 0 && <p>{t('resources.review.systemsHint')}</p>}</>
          : resource.type === 'headquarters' ? <label>{t('resources.hq.level')}<NumberInput value={choice.powerLevel ?? 10} min={1} max={100} onChange={(powerLevel) => update(resource.id, { powerLevel })} /></label>
            : <><label>{t('resources.costMode')}<select value={choice.costMode} onChange={(event) => update(resource.id, { costMode: event.target.value as ResourceReviewChoice['costMode'] })}><option value="equipment">{t('resources.costMode.equipment')}</option><option value="device">{t('resources.costMode.device')}</option></select></label>{choice.costMode === 'device' && <label>{t('resources.removable')}<select value={choice.removable} onChange={(event) => update(resource.id, { removable: event.target.value as ResourceReviewChoice['removable'] })}>{['none', 'removable', 'easily_removable'].map((value) => <option key={value} value={value}>{t(`resources.removable.${value}`)}</option>)}</select></label>}</>}
        <p><b>{t('resources.review.costs', { before: `${before.total} ${before.unit}`, after: `${after.total} ${after.unit}` })}</b></p>
      </fieldset>;
    })}
    {error && <p role="alert">{t('resources.error.storageWrite')}</p>}
    <div className="resource-review__actions"><Button variant="ghost" onClick={onClose}>{t('resources.review.later')}</Button><Button onClick={save}>{t('resources.review.apply')}</Button></div>
    <style>{`.resource-review{display:flex;flex-direction:column;gap:var(--s-md)}.resource-review fieldset{border:1px solid var(--c-border);border-radius:var(--r-sm);padding:var(--s-md)}.resource-review p{color:var(--c-text-secondary)}.resource-review label{display:flex;flex-wrap:wrap;align-items:center;gap:var(--s-sm);margin:var(--s-sm) 0}.resource-review select{max-width:100%;background:var(--c-surface);color:var(--c-text);border:1px solid var(--c-border);padding:var(--s-sm)}.resource-review__actions{display:flex;flex-wrap:wrap;gap:var(--s-sm);justify-content:flex-end}`}</style>
  </div></Modal>;
}
