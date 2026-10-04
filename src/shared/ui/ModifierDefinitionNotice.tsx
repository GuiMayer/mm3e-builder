import { useTranslation } from 'react-i18next';
import { modifierDefinitionVersion } from '../lib/modifierPresentation';
import './modifierDefinitionNotice.css';

export function ModifierDefinitionNotice({ effectId, modifierId, detailed = false }: { effectId?: string; modifierId: string; detailed?: boolean }) {
  const { t } = useTranslation();
  const version = modifierDefinitionVersion(effectId, modifierId);
  if (!version) return null;
  const legacy = version.startsWith('legacy');
  const description = t(`catalog.version.${version}`);
  return detailed ? <p className="modifier-version modifier-version--detail"><strong>{t(legacy ? 'catalog.version.legacy' : 'catalog.version.current')}</strong> · {description}</p> : <small className={`modifier-version ${legacy ? 'modifier-version--legacy' : ''}`} title={description}>{t(legacy ? 'catalog.version.legacy' : 'catalog.version.current')}</small>;
}
