import { useEffect, useRef, useState, useCallback } from 'react';
import { X } from 'lucide-react';

type DrawerHeight = 'closed' | 'peek' | 'full';

interface Props {
  isOpen: boolean;
  height: DrawerHeight;
  onHeightChange: (h: DrawerHeight) => void;
  onClose: () => void;
  children: React.ReactNode;
}

const HEIGHT_MAP: Record<DrawerHeight, string> = {
  closed: '0',
  peek: '35vh',
  full: '85vh',
};

const HEIGHT_PX: Record<DrawerHeight, number> = {
  closed: 0,
  peek: 0.35,
  full: 0.85,
};

export function MobileModifierDrawer({ isOpen, height, onHeightChange, onClose, children }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(0);
  const [dragVelocity, setDragVelocity] = useState(0);
  const lastMoveTime = useRef(0);
  const lastMoveY = useRef(0);

  // Calculate pixel heights based on viewport
  useEffect(() => {
    if (height !== 'closed') {
      const vh = window.innerHeight;
      setCurrentHeight(vh * HEIGHT_PX[height]);
    } else {
      setCurrentHeight(0);
    }
  }, [height]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartHeight(currentHeight);
    lastMoveTime.current = Date.now();
    lastMoveY.current = e.touches[0].clientY;
    setDragVelocity(0);
    
    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, [currentHeight]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    const vh = window.innerHeight;
    const newHeight = Math.max(0, Math.min(vh * 0.85, startHeight + deltaY));

    // Calculate velocity for momentum-based snapping
    const now = Date.now();
    const timeDelta = now - lastMoveTime.current;
    if (timeDelta > 0) {
      const yDelta = lastMoveY.current - currentY;
      setDragVelocity(yDelta / timeDelta);
    }
    lastMoveTime.current = now;
    lastMoveY.current = currentY;

    setCurrentHeight(newHeight);
  }, [isDragging, startY, startHeight]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const vh = window.innerHeight;
    const heightPercent = currentHeight / vh;

    // Use velocity for smarter snapping
    const velocityThreshold = 0.5; // pixels per ms
    const swipeDown = dragVelocity < -velocityThreshold;
    const swipeUp = dragVelocity > velocityThreshold;

    // Snap to nearest state with velocity consideration
    if (swipeDown && heightPercent < 0.7) {
      // Fast swipe down - close or go to peek
      if (heightPercent < 0.5) {
        onHeightChange('closed');
        onClose();
      } else {
        onHeightChange('peek');
      }
    } else if (swipeUp && heightPercent > 0.2) {
      // Fast swipe up - go to peek or full
      if (heightPercent < 0.6) {
        onHeightChange('peek');
      } else {
        onHeightChange('full');
      }
    } else {
      // Normal snap based on position
      if (heightPercent < 0.15) {
        onHeightChange('closed');
        onClose();
      } else if (heightPercent < 0.55) {
        onHeightChange('peek');
      } else {
        onHeightChange('full');
      }
    }

    // Haptic feedback on snap
    if ('vibrate' in navigator) {
      navigator.vibrate(15);
    }
  }, [isDragging, currentHeight, dragVelocity, onHeightChange, onClose]);

  // Close on backdrop click
  const handleBackdropClick = useCallback(() => {
    onHeightChange('closed');
    onClose();
  }, [onHeightChange, onClose]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onHeightChange('closed');
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, onHeightChange]);

  if (!isOpen && height === 'closed') return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && height !== 'closed' && (
        <div className="mobile-drawer-backdrop" onClick={handleBackdropClick} />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`mobile-drawer ${isDragging ? 'mobile-drawer--dragging' : ''}`}
        style={{
          height: isDragging ? `${currentHeight}px` : HEIGHT_MAP[height],
          transform: height === 'closed' ? 'translateY(100%)' : 'translateY(0)',
        }}
        data-state={height}
        role="dialog"
        aria-label="Modifier palette"
        aria-hidden={!isOpen}
        aria-modal={isOpen}
      >
        {/* Drag handle */}
        <div
          className="mobile-drawer-handle-area"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="button"
          aria-label="Drag to resize drawer"
          tabIndex={0}
        >
          <div className="mobile-drawer-handle" />
          <span className="mobile-drawer-state-indicator" aria-live="polite" aria-atomic="true">
            {height === 'peek' ? 'Preview' : height === 'full' ? 'Expanded' : ''}
          </span>
          <button
            className="mobile-drawer-close"
            onClick={handleBackdropClick}
            aria-label="Close drawer"
            tabIndex={0}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="mobile-drawer-content">
          {children}
        </div>
      </div>

      <style>{`
        .mobile-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 999;
          animation: fadeIn 0.2s ease;
        }

        .mobile-drawer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--c-surface);
          border-top-left-radius: var(--r-lg);
          border-top-right-radius: var(--r-lg);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, height;
        }

        .mobile-drawer--dragging {
          transition: none;
        }

        .mobile-drawer-handle-area {
          flex-shrink: 0;
          padding: var(--s-sm) var(--s-md);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: grab;
          touch-action: none;
          min-height: 48px;
        }

        .mobile-drawer-handle-area:active {
          cursor: grabbing;
        }

        .mobile-drawer-handle {
          width: 40px;
          height: 4px;
          background: var(--c-border);
          border-radius: var(--r-full);
          opacity: 0.6;
          transition: all 0.2s ease;
        }

        .mobile-drawer--dragging .mobile-drawer-handle {
          width: 50px;
          height: 5px;
          opacity: 1;
          background: var(--c-primary);
        }

        .mobile-drawer-state-indicator {
          position: absolute;
          left: var(--s-md);
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.7rem;
          color: var(--c-text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.7;
        }

        .mobile-drawer-close {
          position: absolute;
          right: var(--s-md);
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--c-text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--s-xs);
          border-radius: var(--r-sm);
          transition: all var(--t-fast);
          min-width: 44px;
          min-height: 44px;
        }

        .mobile-drawer-close:hover {
          background: var(--c-surface-elevated);
          color: var(--c-text);
        }

        .mobile-drawer-close:focus-visible {
          outline: 2px solid var(--c-primary);
          outline-offset: 2px;
        }

        .mobile-drawer-content {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mobile-drawer {
            transition: none;
          }
          .mobile-drawer-backdrop {
            animation: none;
          }
        }

        /* Hide on desktop - only show on mobile */
        @media (min-width: 769px) {
          .mobile-drawer-backdrop,
          .mobile-drawer {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
