import { useTranslation } from 'react-i18next';
import { Button } from '../../shared/ui/Button';
import { useTraitValues } from '../../shared/hooks/useTraitValues';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { SKILL_DEFS } from '../../entities/gameDataLoaders';
import type { TraitSourceEntry } from '../../shared/lib/traitSources';
import type { PowerSource } from '../../shared/lib/powerUsage';
import { PowerUsageControls } from './PowerUsageControls';

export function TraitSourceList({ entries, onEdit, onReference }: { entries: TraitSourceEntry[]; onEdit: (source: PowerSource, componentId: string) => void; onReference?: (source: PowerSource) => void }) {
  const { t } = useTranslation();
  const { warnings } = useTraitValues();
  const skills = useLocalizedData(SKILL_DEFS);
  const sources = [...new Map(entries.map(entry => [entry.source.key, entry.source])).values()];
  return <div className="trait-source-list">{sources.map(source => {
    const items = entries.filter(entry => entry.source.key === source.key);
    return <section className="trait-source" key={source.key}>
      <div className="trait-source__heading"><strong>{source.name}</strong>{onReference && <Button size="sm" variant="ghost" onClick={() => onReference(source)}>{t('traits.reference')}</Button>}<Button size="sm" variant="ghost" onClick={() => onEdit(source, items[0].component.id)}>{t(items.some(item => item.status === 'unbound') ? 'traits.defineTarget' : 'traits.editPower')}</Button></div>
      {items.map(item => {
        const target = item.component.enhancedTarget;
        const label = target?.kind === 'ability' ? t(`abilities.${target.key}`) : target?.kind === 'defense' ? t(`defenses.${target.key}`) : target?.kind === 'skill' ? `${skills.find(skill => skill.id === target.skillId)?.name ?? target.skillId}${target.subtype ? ': ' + target.subtype : ''}` : item.component.effectId === 'protection' ? t('defenses.toughness') : t('traits.noTarget');
        return <div className={`trait-source__effect ${item.status !== 'active' ? 'trait-source__effect--inactive' : ''}`} key={`${item.branchId}:${item.component.id}`}>
          <strong>+{item.status === 'active' ? item.ranks : item.component.ranks}</strong><span>{label}{source.power.alternateEffects.length > 0 && <small>{item.branchId === 'base' ? t('builder.baseEffect') : item.branchName}</small>}</span><span className="trait-source__status">{t(`traits.status.${item.status}`)}</span>
        </div>;
      })}
      <PowerUsageControls source={source} />
      {source.power.components.length > 1 && <small>{t('traits.linkedUsage')}</small>}
      {source.equipment && <small>{t('traits.nonStackingHint')}</small>}
      {warnings.filter(warning => warning.params?.name === source.name).map((warning, index) => <p className="trait-warning" key={`${warning.key}:${index}`}>{t(warning.key, warning.params)}</p>)}
    </section>;
  })}</div>;
}
