import { Plus } from 'lucide-react';

interface Props {
  onClick: () => void;
  contextLabel?: string;
  isAE?: boolean;
}

export function ModifierDrawerFAB({ onClick, contextLabel, isAE }: Props) {
  return (
    <button
      className="modifier-fab"
      onClick={onClick}
      aria-label="Open modifier palette"
      title={contextLabel ? `Add modifiers to ${contextLabel}` : 'Add modifiers'}
    >
      <Plus size={24} />
      {contextLabel && (
        <span className="modifier-fab-badge" data-ae={isAE}>
          {contextLabel}
        </span>
      )}

      <style>{`
        .modifier-fab {
          position: fixed;
          bottom: 80px;
          right: var(--s-lg);
          width: 56px;
          height: 56px;
          border-radius: var(--r-full);
          background: var(--c-primary);
          color: var(--c-text-inverse);
          border: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 998;
          transition: all var(--t-fast);
          animation: fabSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .modifier-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }

        .modifier-fab:active {
          transform: scale(0.95);
        }

        .modifier-fab:focus-visible {
          outline: 3px solid var(--c-primary);
          outline-offset: 3px;
        }

        .modifier-fab-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--c-accent);
          color: var(--c-text-inverse);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: var(--r-full);
          white-space: nowrap;
          max-width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          animation: badgePulse 2s ease-in-out infinite;
        }

        .modifier-fab-badge[data-ae="true"] {
          background: #f59e0b;
        }

        @keyframes fabSlideIn {
          from {
            transform: translateY(100px) scale(0);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes badgePulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .modifier-fab {
            animation: none;
          }
          .modifier-fab:hover {
            transform: none;
          }
        }

        /* Hide on desktop */
        @media (min-width: 769px) {
          .modifier-fab {
            display: none;
          }
        }
      `}</style>
    </button>
  );
}
