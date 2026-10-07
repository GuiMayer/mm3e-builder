import { useRef, useEffect, useLayoutEffect } from 'react';
import type { InputHTMLAttributes } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  variant?: 'small' | 'medium' | 'large' | 'compact';
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  className = '',
  variant = 'medium',
  ...rest
}: NumberInputProps) {
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentValueRef = useRef(value);
  const currentConfigRef = useRef({ onChange, min, max, step, disabled });

  useLayoutEffect(() => {
    currentValueRef.current = value;
    currentConfigRef.current = { onChange, min, max, step, disabled };
    if (disabled) {
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    }
  }, [value, onChange, min, max, step, disabled]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  const clampValue = (val: number): number => {
    let clamped = val;
    if (min !== undefined) clamped = Math.max(min, clamped);
    if (max !== undefined) clamped = Math.min(max, clamped);
    return clamped;
  };

  // Repeat handlers read the latest committed props, never the initial closure.
  const changeByStep = (direction: 1 | -1) => {
    const config = currentConfigRef.current;
    if (config.disabled) return;
    const previous = currentValueRef.current;
    let next = previous + config.step * direction;
    if (config.min !== undefined) next = Math.max(config.min, next);
    if (config.max !== undefined) next = Math.min(config.max, next);
    if (next !== previous) {
      currentValueRef.current = next;
      config.onChange(next);
    }
  };
  const handleIncrement = () => changeByStep(1);
  const handleDecrement = () => changeByStep(-1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = Number(e.target.value);
    if (!isNaN(parsed)) {
      onChange(clampValue(parsed));
    } else if (e.target.value === '' || e.target.value === '-') {
      // Allow empty or just minus sign for typing negative numbers
      onChange(0);
    }
  };

  // Hold functionality: 300ms initial delay, then 100ms interval
  const startHold = (action: () => void, e?: React.TouchEvent | React.MouseEvent) => {
    if (disabled) return;
    if (e && 'button' in e && e.button !== 0) return;
    
    // Prevent touch events from triggering mouse events (fixes double-increment on mobile)
    if (e && 'touches' in e) {
      e.preventDefault();
    }
    
    // Execute once immediately
    action();
    
    // Clear any existing timers
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    
    // Start hold after 300ms threshold
    holdTimeoutRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(action, 100);
    }, 300);
  };

  const stopHold = (e?: React.TouchEvent | React.MouseEvent) => {
    // Prevent touch events from triggering mouse events
    if (e && 'touches' in e) {
      e.preventDefault();
    }
    
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  // Icon size based on variant
  const iconSize = variant === 'small' ? 12 : variant === 'large' ? 16 : 14;

  return (
    <div className={`number-input-wrapper number-input-wrapper--${variant}${disabled ? ' number-input-wrapper--disabled' : ''}`}>
      <button
        type="button"
        className="number-input-btn number-input-btn--decrement"
        onMouseDown={(e) => startHold(handleDecrement, e)}
        onMouseUp={(e) => stopHold(e)}
        onMouseLeave={(e) => stopHold(e)}
        onTouchStart={(e) => startHold(handleDecrement, e)}
        onTouchEnd={(e) => stopHold(e)}
        onTouchCancel={(e) => stopHold(e)}
        onBlur={() => stopHold()}
        onClick={(e) => { if (e.detail === 0) handleDecrement(); }}
        disabled={disabled || (min !== undefined && value <= min)}
        aria-label="Decrement"
      >
        <ChevronDown size={iconSize} />
      </button>
      
      <input
        type="number"
        className={`number-input-field ${className}`.trim()}
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        {...rest}
      />
      
      <button
        type="button"
        className="number-input-btn number-input-btn--increment"
        onMouseDown={(e) => startHold(handleIncrement, e)}
        onMouseUp={(e) => stopHold(e)}
        onMouseLeave={(e) => stopHold(e)}
        onTouchStart={(e) => startHold(handleIncrement, e)}
        onTouchEnd={(e) => stopHold(e)}
        onTouchCancel={(e) => stopHold(e)}
        onBlur={() => stopHold()}
        onClick={(e) => { if (e.detail === 0) handleIncrement(); }}
        disabled={disabled || (max !== undefined && value >= max)}
        aria-label="Increment"
      >
        <ChevronUp size={iconSize} />
      </button>

      <style>{`
        /* Hide native spinners */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }

        .number-input-wrapper {
          display: inline-flex;
          align-items: stretch;
          position: relative;
          border-radius: var(--r-sm);
          outline: 1px solid transparent;
          outline-offset: -1px;
          transition: outline-color var(--t-fast), box-shadow var(--t-fast);
        }

        .number-input-wrapper:hover:not(.number-input-wrapper--disabled),
        .number-input-wrapper:focus-within {
          outline-color: var(--c-primary);
        }

        .number-input-wrapper:focus-within {
          box-shadow: 0 0 0 2px var(--c-primary-muted);
        }

        .number-input-wrapper input[type="number"] {
          border-left: none !important;
          border-right: none !important;
          border-radius: 0 !important;
        }

        .number-input-field {
          background: var(--c-surface-elevated);
          border: 1px solid var(--c-border);
          color: var(--c-text);
          font: inherit;
          min-width: 0;
          padding: var(--s-xs) var(--s-sm);
          text-align: center;
        }

        .number-input-wrapper .number-input-field:focus {
          border-color: var(--c-border);
          box-shadow: none;
          outline: none;
        }

        .number-input-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--c-border);
          color: var(--c-text-secondary);
          cursor: pointer;
          transition: all var(--t-fast);
          padding: 0;
          flex-shrink: 0;
        }

        .number-input-btn--decrement {
          border-radius: var(--r-sm) 0 0 var(--r-sm);
          border-right: none;
        }

        .number-input-btn--increment {
          border-radius: 0 var(--r-sm) var(--r-sm) 0;
          border-left: none;
        }

        .number-input-btn:hover:not(:disabled) {
          background: var(--c-primary-muted);
          color: var(--c-primary);
        }

        .number-input-wrapper .number-input-btn:focus-visible {
          outline: none;
        }

        .number-input-btn:active:not(:disabled) {
          background: var(--c-primary-muted);
        }

        .number-input-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Variant sizes */
        .number-input-wrapper--small .number-input-btn {
          width: 28px;
        }

        .number-input-wrapper--medium .number-input-btn {
          width: 32px;
        }

        .number-input-wrapper--large .number-input-btn {
          width: 36px;
        }

        .number-input-wrapper--compact .number-input-btn {
          width: 32px;
        }

        /* Mobile touch targets - Balanced for usability and space constraints */
        @media (max-width: 768px) {
          .number-input-btn {
            min-height: 44px; /* WCAG 2.1 AA compliant vertical touch target */
          }

          .number-input-wrapper--small .number-input-btn {
            width: 38px;
          }

          .number-input-wrapper--medium .number-input-btn {
            width: 40px;
          }

          .number-input-wrapper--large .number-input-btn {
            width: 44px;
          }

          /* Compact variant for mobile - smaller buttons but still touch-friendly */
          .number-input-wrapper--compact .number-input-btn {
            width: 32px;
          }
        }
      `}</style>
    </div>
  );
}
