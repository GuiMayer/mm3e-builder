import { useRef, useEffect } from 'react';
import type { InputHTMLAttributes } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  variant?: 'small' | 'medium' | 'large';
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

  const handleIncrement = () => {
    const newValue = clampValue(value + step);
    if (newValue !== value) onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = clampValue(value - step);
    if (newValue !== value) onChange(newValue);
  };

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
  const startHold = (action: () => void) => {
    if (disabled) return;
    
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

  const stopHold = () => {
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
    <div className={`number-input-wrapper number-input-wrapper--${variant}`}>
      <button
        type="button"
        className="number-input-btn number-input-btn--decrement"
        onMouseDown={() => startHold(handleDecrement)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(handleDecrement)}
        onTouchEnd={stopHold}
        disabled={disabled || (min !== undefined && value <= min)}
        aria-label="Decrement"
      >
        <ChevronDown size={iconSize} />
      </button>
      
      <input
        type="number"
        className={className}
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
        onMouseDown={() => startHold(handleIncrement)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(handleIncrement)}
        onTouchEnd={stopHold}
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
        }

        .number-input-wrapper input[type="number"] {
          border-left: none !important;
          border-right: none !important;
          border-radius: 0 !important;
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
          border-color: var(--c-primary);
          color: var(--c-primary);
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
      `}</style>
    </div>
  );
}
