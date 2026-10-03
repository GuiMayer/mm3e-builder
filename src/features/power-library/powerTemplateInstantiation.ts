import type { ICharacterPower, ICharacterPowerComponent } from '../../entities/types';
import { createId } from '../../shared/lib/identity';
import type { PowerTemplate, PowerTemplateComponent } from './types';
import { libraryText } from './types';

export function instantiatePowerTemplate(template: PowerTemplate, ranks = 1, language = 'en'): ICharacterPower {
  if (!Number.isSafeInteger(ranks) || ranks < 1) throw new Error('Invalid template ranks');
  const instantiate = (component: PowerTemplateComponent): ICharacterPowerComponent => {
    const { scalable, ...fields } = component;
    return { ...structuredClone(fields), id: createId(), ranks: scalable ? ranks : component.ranks };
  };
  return {
    id: createId(), name: libraryText(template.name, language),
    components: template.components.map(instantiate),
    notes: `${libraryText(template.summary, language)}\nPower Profiles · ${libraryText(template.name, language)} · p. ${template.page}`,
    descriptors: [...(template.descriptors ?? [])],
    alternateEffects: (template.alternateEffects ?? []).map(alternate => ({
      id: createId(), name: libraryText(alternate.name, language), notes: '',
      dynamic: alternate.dynamic ?? false, components: alternate.components.map(instantiate),
    })),
    ...(template.activation ? { activation: template.activation } : {}),
    ...(template.removable ? { removable: template.removable } : {}),
    ...(template.baseDynamic ? { baseDynamic: true } : {}),
  };
}
