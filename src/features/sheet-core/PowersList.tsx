import { PowerEnhancementsButton } from '../trait-modifiers/PowerEnhancementsButton';
import { useCharactersStore } from '../../store/charactersStore';
import { replaceCharacterPower } from '../../shared/lib/powerEditing';
import { lazy, Suspense, useState } from 'react';
import { useActiveCharacter } from '../../shared/hooks/useActiveCharacter';
import { useCharacterActions } from '../../shared/hooks/useCharacterActions';
import type { ICharacterPower } from '../../entities/types';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { useCalculatedPP } from '../../shared/hooks/useCalculatedPP';
import { Tooltip } from '../../shared/ui/Tooltip';
import { Plus, Edit3, Trash2, Zap, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDialog } from '../../shared/ui/appDialogContext';
import { buildPowerReferences, localizeReference } from './powerReference';
import { PowerReferenceDialog, type PowerReferenceTarget } from './PowerReferenceDialog';

const PowerBuilderOverlay = lazy(() =>
  import('../power-builder/PowerBuilderOverlay').then((module) => ({ default: module.PowerBuilderOverlay }))
);

export function PowersList() {
  const { t, i18n } = useTranslation();
  const powerDefs = useLocalizedData(POWER_DEFS);
  const modifierDefs = useLocalizedData(MODIFIER_DEFS);
  
  const { character, characterId } = useActiveCharacter();
  const { setPowers } = useCharacterActions();
  const powers = character.powers;
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderCharacterId, setBuilderCharacterId] = useState<string | null>(null);
  const [builderPower, setBuilderPower] = useState<ICharacterPower | undefined>();

  const dialog = useAppDialog();
  const [referenceTarget, setReferenceTarget] = useState<PowerReferenceTarget | null>(null);



  function handleSavePower(power: ICharacterPower) {
    const store = useCharactersStore.getState();
    const original = builderCharacterId && store.getCharacterById(builderCharacterId);
    const next = original && replaceCharacterPower(original.character, { kind: 'power', powerId: builderPower?.id }, power);
    if (!next || !builderCharacterId) return;
    store.updateCharacter(builderCharacterId, { powers: next.powers });
    setBuilderOpen(false);
  }

  async function handleDeletePower(index: number) {
    const power = powers[index];
    const altCount = power.alternateEffects.length;
    const msg = altCount > 0
      ? t('powers.deleteConfirmWithAlt', { name: power.name, count: altCount })
      : t('powers.deleteConfirm', { name: power.name });

    if (await dialog.confirm({ title: t('powers.deleteTitle'), message: msg, confirmLabel: t('common.delete'), danger: true })) {
      setPowers(powers.filter((_, i) => i !== index));
    }
  }

  function openNew() {
    setBuilderCharacterId(characterId);
    setBuilderPower(undefined);
    setBuilderOpen(true);
  }

  function openEdit(index: number) {
    setBuilderCharacterId(characterId);
    setBuilderPower(powers[index]);
    setBuilderOpen(true);
  }

  const { powersCost: totalPowersCost, powerPricing } = useCalculatedPP();

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t('powers.title')}</h2>
        <span className="panel-cost">{totalPowersCost} {t('common.pp')}</span>
      </div>

      {powers.length === 0 && (
        <p className="power-empty">{t('powers.noPowers')}</p>
      )}

      <div className="powers-grid">
        {powers.map((power, i) => {
          const totalCost = powerPricing[i]?.total ?? 0;

          const references = buildPowerReferences(power.components, powerDefs, modifierDefs, i18n.language);
          const effectNames = references.map(reference => `${reference.definition?.name ?? reference.component.effectId} ${reference.component.ranks}`);
          const powerSummary = references.map(reference => `${reference.definition?.name ?? reference.component.effectId}: ${reference.definition?.description || t('rulesInfo.missing')}`).join('\n\n');
          const appliedModifiers = references.flatMap(reference => reference.modifiers.map(modifier => ({ modifier, effectName: reference.definition?.name ?? reference.component.effectId, componentId: reference.component.id })));
          const powerModifierIds = [power.activation ? 'activation' : '', power.removable && power.removable !== 'none' ? 'removable' : ''].filter(Boolean);

          return (
            <div key={power.id} className="power-card-item">
              <div className="power-card-top">
                <div className="power-card-icon">
                  <Zap size={18} />
                </div>
                <div className="power-card-info">
                  <Tooltip content={powerSummary + '\n\n' + t('rulesInfo.clickForDetails')}>
                    <button type="button" className="power-card-name power-reference-button" aria-haspopup="dialog" onClick={() => setReferenceTarget({ kind: 'power', power })}>{power.name || t('powers.unnamed')} <Info size={13} /></button>
                  </Tooltip>
                  <span className="power-card-effect">{references.map((reference, index) => <span key={reference.component.id}>
                    {index > 0 && ' + '}<Tooltip content={(reference.definition?.description || t('rulesInfo.missing')) + '\n\n' + t('rulesInfo.clickForDetails')}>
                      <button type="button" className="power-reference-button" aria-haspopup="dialog" onClick={() => setReferenceTarget({ kind: 'effect', reference })}>{effectNames[index]}</button>
                    </Tooltip>
                  </span>)}</span>
                  {power.descriptors && power.descriptors.length > 0 && (
                    <div className="power-card-descriptors">
                      {power.descriptors.map((desc, idx) => (
                        <span key={idx} className="power-descriptor-tag">{desc}</span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="power-card-cost">{totalCost} {t('common.pp')}</span>
              </div>

              {(appliedModifiers.length > 0 || powerModifierIds.length > 0) && <div className="power-card-mods">
                {appliedModifiers.map(({ modifier, effectName, componentId }, index) => <Tooltip key={`${componentId}-${index}`} content={effectName + '\n' + (modifier.definition?.description || t('rulesInfo.missing')) + '\n\n' + t('rulesInfo.clickForDetails')}>
                  <button type="button" className="power-mod-tag power-reference-button" aria-haspopup="dialog" onClick={() => setReferenceTarget({ kind: 'modifier', reference: modifier, effectName })}>{modifier.definition?.name ?? modifier.applied.modifierId}</button>
                </Tooltip>)}
                {powerModifierIds.map(id => {
                  const raw = modifierDefs.find(definition => definition.id === id);
                  const definition = raw && localizeReference(raw, i18n.language);
                  return <Tooltip key={id} content={(definition?.description || t('rulesInfo.missing')) + '\n\n' + t('rulesInfo.clickForDetails')}>
                    <button type="button" className="power-mod-tag power-reference-button" aria-haspopup="dialog" onClick={() => setReferenceTarget({ kind: 'modifier', reference: { definition, source: 'generic', applied: { modifierId: id, ranks: 1, options: { subtypeId: id === 'activation' ? power.activation! : power.removable! } } } })}>{definition?.name ?? id}</button>
                  </Tooltip>;
                })}
              </div>}

              {power.alternateEffects.length > 0 && (
                <div className="power-alt-info">
                  {power.alternateEffects.map((ae) => {
                    const aeEffects = ae.components
                      .map((c) => powerDefs.find((d) => d.id === c.effectId)?.name)
                      .filter(Boolean)
                      .join(' + ');
                    return (
                      <Tooltip key={ae.id} content={buildPowerReferences(ae.components, powerDefs, modifierDefs, i18n.language).map(reference => reference.definition?.description || t('rulesInfo.missing')).join('\n\n') + '\n\n' + t('rulesInfo.clickForDetails')}>
                      <button type="button" className="power-alt-tag power-reference-button" aria-haspopup="dialog" onClick={() => setReferenceTarget({ kind: 'power', power: ae })}>
                        ↪ {ae.name || aeEffects || 'AE'}{ae.dynamic ? ' ⚡' : ''}
                      </button></Tooltip>
                    );
                  })}
                </div>
              )}

              {power.notes && (
                <p className="power-card-notes">{power.notes}</p>
              )}

              <div className="power-card-actions">
                <PowerEnhancementsButton key={`${characterId}:${power.id}`} sourceKey={`power:${power.id}`} onEdit={() => openEdit(i)} />
                <Tooltip content={t('powers.editTooltip')}>
                  <button onClick={() => openEdit(i)} className="power-action-btn">
                    <Edit3 size={14} /> {t('common.edit')}
                  </button>
                </Tooltip>
                <button onClick={() => handleDeletePower(i)} className="power-action-btn power-action-btn--danger" title={t('common.remove')}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button className="power-new-btn" onClick={openNew}>
        <Plus size={18} /> {t('powers.newPowerBtn')}
      </button>

      {referenceTarget && <PowerReferenceDialog target={referenceTarget} onClose={() => setReferenceTarget(null)} />}

      {builderOpen && (
        <Suspense fallback={<div className="panel">{t('common.loading')}</div>}>
          <PowerBuilderOverlay
            existingPower={builderPower}
            sourceCharacterId={builderCharacterId}
            onSave={handleSavePower}
            onClose={() => { setBuilderOpen(false); }}
          />
        </Suspense>
      )}

      <style>{`
        .power-empty { color: var(--c-text-muted); font-size: 0.85rem; font-style: italic; }
        .powers-grid { display: flex; flex-direction: column; gap: var(--s-sm); }

        .power-card-item {
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-md); padding: var(--s-md);
          transition: border-color var(--t-fast), box-shadow var(--t-fast);
        }
        .power-card-item:hover {
          border-color: var(--c-border-active);
          box-shadow: 0 0 12px rgba(var(--c-primary-rgb), 0.15);
        }
        .power-card-top { display: flex; align-items: center; gap: var(--s-sm); }
        .power-card-icon {
          width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
          background: var(--c-primary-muted); border-radius: var(--r-sm); color: var(--c-primary);
        }
        .power-card-info { min-width:0; flex: 1; display: flex; flex-direction: column; }
        .power-reference-button{font:inherit;color:inherit;background:none;border:0;padding:0;text-align:left;cursor:pointer;overflow-wrap:anywhere;}
        .power-reference-button:hover{text-decoration:underline;text-underline-offset:3px;}
        .power-reference-button:focus-visible{outline:2px solid var(--c-primary);outline-offset:3px;border-radius:3px;}
        .power-card-name.power-reference-button{display:inline-flex;align-items:center;gap:6px;align-self:flex-start;}
        .power-card-name { font-weight: 700; font-size: 0.95rem; }
        .power-card-effect { font-size: 0.78rem; color: var(--c-text-secondary); }
        .power-card-cost { font-weight: 800; font-size: 1.1rem; color: var(--c-primary); font-variant-numeric: tabular-nums; }

        .power-card-mods { display: flex; flex-wrap: wrap; gap: 4px; margin-top: var(--s-sm); }
        .power-mod-tag {
          font-family:var(--f-body);font-size: 0.7rem; padding: 4px 8px; border-radius: var(--r-full);
          background: var(--c-primary-muted); color: var(--c-primary); font-weight: 500;
        }
        .power-alt-info { display: flex; flex-wrap: wrap; gap: 4px; margin-top: var(--s-xs); }
        .power-alt-tag {
          font-size: 0.7rem; padding: 2px 8px; border-radius: var(--r-full);
          background: rgba(var(--c-custom-accent-rgb, 139, 92, 246), 0.12); color: var(--c-accent); font-weight: 500;
          border: 1px solid rgba(var(--c-custom-accent-rgb, 139, 92, 246), 0.25);
        }
        .power-card-notes { font-size: 0.78rem; color: var(--c-text-muted); font-style: italic; margin-top: var(--s-xs); }

        .power-card-actions {
          display: flex; gap: var(--s-xs); margin-top: var(--s-sm);
          padding-top: var(--s-sm); border-top: 1px solid var(--c-border);
        }
        .power-action-btn {
          display: flex; align-items: center; gap: 4px;
          background: transparent; border: 1px solid var(--c-border);
          border-radius: var(--r-sm); padding: 4px 10px;
          color: var(--c-text-secondary); font-family: var(--f-body);
          font-size: 0.75rem; cursor: pointer; transition: all var(--t-fast);
        }
        .power-action-btn:hover { background: var(--c-primary-muted); color: var(--c-primary); border-color: var(--c-primary); }
        .power-action-btn--danger:hover { background: rgba(var(--c-error-rgb, 248, 113, 113), 0.15); color: var(--c-error); border-color: var(--c-error); }

        .power-new-btn {
          display: flex; align-items: center; justify-content: center; gap: var(--s-sm);
          margin-top: var(--s-sm); padding: var(--s-md);
          background: var(--c-primary-muted); border: 2px dashed var(--c-primary);
          border-radius: var(--r-md); color: var(--c-primary);
          font-family: var(--f-heading); font-size: 0.95rem; font-weight: 700;
          cursor: pointer; transition: all var(--t-fast); width: 100%;
        }
        @media(max-width:600px){.power-card-info .power-reference-button,.power-card-mods .power-reference-button,.power-alt-info .power-reference-button{min-height:36px;}.power-card-cost{flex-shrink:0;}.power-card-name{overflow-wrap:anywhere;}}
        .power-new-btn:hover { background: var(--c-primary); color: var(--c-action-text, var(--c-text-inverse)); box-shadow: var(--shadow-glow); }
      `}</style>
    </section>
  );
}
