import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

interface Props {
  onClick: () => void;
  contextLabel?: string;
}

/** Mobile palette action stays in the footer, clear of editable fields. */
export function ModifierDrawerFAB({ onClick, contextLabel }: Props) {
  const { t } = useTranslation();
  return (
    <button
      className="modifier-fab"
      onClick={onClick}
      aria-label={t('builder.openModifierPalette')}
      title={contextLabel ? t('builder.addModifiersTo', { name: contextLabel }) : t('builder.addModifier')}
    >
      <Plus size={24} />
      <style>{`
        .modifier-fab {
          flex-shrink: 0; width: 44px; height: 44px; border-radius: var(--r-full);
          background: var(--c-primary); color: var(--c-text-inverse); border: none;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background-color var(--t-fast);
        }
        .modifier-fab:hover { background: var(--c-primary-hover, var(--c-primary)); }
        .modifier-fab:focus-visible { outline: 2px solid var(--c-primary); outline-offset: 2px; }
        @media (min-width: 769px) { .modifier-fab { display: none; } }
      `}</style>
    </button>
  );
}
