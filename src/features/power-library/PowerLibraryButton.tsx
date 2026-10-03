import { Grid2X2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '../../shared/ui/Tooltip';
import './powerLibrary.css';

export function PowerLibraryButton({ onClick, targetLabel }: { onClick: () => void; targetLabel: string }) {
  const { t } = useTranslation();
  return <Tooltip content={t('powerLibrary.title')}><button type="button" className="power-library-button"
    aria-label={`${t('powerLibrary.title')}: ${targetLabel}`} aria-haspopup="dialog"
    onClick={event => { event.stopPropagation(); onClick(); }}><Grid2X2 size={17}/></button></Tooltip>;
}
