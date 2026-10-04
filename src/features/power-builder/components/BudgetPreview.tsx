import { createDefaultCharacter } from '../../../entities/characterDefaults';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ICharacterPower, IValidationRules } from '../../../entities/types';
import { useCharactersStore } from '../../../store/charactersStore';
import { useResourcesStore } from '../../../store/resourcesStore';
import { projectPowerBudget, powerBudgetSignature, type BudgetEditTarget } from '../budgetProjection';
import './budgetPreview.css';

const unlinkedContext = createDefaultCharacter();

export function BudgetPreview({ characterId, target, power, rules }: { characterId: string | null; target: BudgetEditTarget; power: ICharacterPower; rules: IValidationRules }) {
  const { t } = useTranslation();
  const tabs = useCharactersStore(state => state.tabs);
  const resources = useResourcesStore(state => state.resources);
  const [expanded, setExpanded] = useState(false);
  const character = tabs.find(tab => tab.id === characterId)?.character ?? (target.kind === 'resource' && characterId === null ? unlinkedContext : undefined);
  const signature = powerBudgetSignature(power);
  const draft = useMemo(() => JSON.parse(signature) as ICharacterPower, [signature]);
  const projection = useMemo(() => character ? projectPowerBudget(character, resources, target, draft) : null, [character, resources, target, draft]);
  const others = useMemo(() => expanded && target.kind === 'resource' ? tabs.filter(tab => tab.id !== characterId && tab.character.resourceLinks?.some(link => link.resourceId === target.target.resourceId))
    .map(tab => ({ tab, projection: projectPowerBudget(tab.character, resources, target, draft) })) : [], [expanded, target, tabs, characterId, resources, draft]);
  if (!projection) return <div className="budget-preview">{t('builder.budget.unavailable')}</div>;
  const row = (value: NonNullable<typeof projection>, name: string) => <div className="budget-preview__row">
    <strong>{name}</strong>
    <span className={rules.enforcePPBudget && value.after.remaining < 0 ? 'budget-preview__excess' : ''}>{t('builder.budget.pp', { spent: value.after.totalSpent, available: value.after.totalAvailable, remaining: value.after.remaining })}</span>
    {(value.after.equipmentRanks > 0 || value.before.totalEPUsed > 0 || value.after.totalEPUsed > 0) && <span className={rules.enforcePPBudget && rules.enforceEquipmentPPLimit && value.after.totalEPUsed > value.after.equipmentEPLimit ? 'budget-preview__excess' : ''}>{t('builder.budget.ep', { spent: value.after.totalEPUsed, available: value.after.equipmentEPLimit, remaining: value.after.equipmentEPLimit - value.after.totalEPUsed })}</span>}
  </div>;
  return <section className="budget-preview" aria-label={t('builder.budget.title')}>
    <div className="budget-preview__purchase">{t(target.kind === 'resource' ? 'builder.budget.resourceCost' : 'builder.budget.purchaseCost', { previous: projection.oldCost, next: projection.newCost, delta: `${projection.difference > 0 ? '+' : ''}${projection.difference}`, unit: projection.unit })}</div>
    {projection.linked ? row(projection, character?.header.name || t('tabs.unnamed')) : <span>{t('builder.budget.unlinked')}</span>}
    {target.kind === 'resource' && <details open={expanded} onToggle={event => setExpanded(event.currentTarget.open)}>
      <summary>{t('builder.budget.shared')}</summary>
      <p>{t('builder.budget.localScope')}</p>
      {others.map(({ tab, projection: value }) => value && <div key={tab.id}>{row(value, tab.character.header.name || t('tabs.unnamed'))}</div>)}
      {!others.length && <p>{t('builder.budget.noOthers')}</p>}
    </details>}
  </section>;
}
