import { useState, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="tooltip-bubble" role="tooltip">
          {content}
        </div>
      )}

      <style>{`
        .tooltip-wrapper {
          position: relative;
          display: inline-flex;
        }
        .tooltip-bubble {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: var(--c-surface-elevated);
          color: var(--c-text);
          border: 1px solid var(--c-border);
          border-radius: var(--r-sm);
          padding: var(--s-xs) var(--s-sm);
          font-size: 0.75rem;
          white-space: nowrap;
          max-width: 280px;
          white-space: normal;
          z-index: 500;
          box-shadow: var(--shadow-md);
          animation: fadeIn 0.12s ease;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
