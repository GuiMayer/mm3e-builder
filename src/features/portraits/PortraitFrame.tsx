import type { ButtonHTMLAttributes, ReactEventHandler } from 'react';
import { User } from 'lucide-react';
import type { ICharacterHeader } from '../../entities/types';
import './portraits.css';

export interface PortraitFrameSize { width: number; height: number }

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  src?: string;
  imageAlt: string;
  fit?: ICharacterHeader['portraitFit'];
  onImageLoad?: ReactEventHandler<HTMLImageElement>;
  onImageError?: ReactEventHandler<HTMLImageElement>;
}

/** One frame for both the sheet and editor: same border, background and image fit. */
export function PortraitFrame({ src, imageAlt, fit = 'contain', onImageLoad, onImageError, className = '', ...buttonProps }: Props) {
  return <button {...buttonProps} type="button" className={`hero-avatar portrait-frame ${className}`}>
    {src ? <img key={src} style={{ objectFit: fit, objectPosition: 'center' }} src={src} referrerPolicy="no-referrer" alt={imageAlt} onLoad={onImageLoad} onError={onImageError} /> : <User size={32} />}
  </button>;
}
