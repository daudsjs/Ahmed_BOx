import type { AimMode } from './state';

type ToggleProps = {
  label: string;
  hint?: string;
  value: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
};

export function Toggle({ label, hint, value, disabled, onChange }: ToggleProps) {
  return (
    <div className="row">
      <div className="row-text">
        <span className="row-label">{label}</span>
        {hint ? <span className="row-hint">{hint}</span> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        disabled={disabled}
        className={value ? 'switch is-on' : 'switch'}
        onClick={() => onChange(!value)}
      >
        <span className="switch-track">
          <span className="switch-dot" />
        </span>
      </button>
    </div>
  );
}

type RangeProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format: (value: number) => string;
  disabled?: boolean;
  onChange: (next: number) => void;
};

export function Range({ label, value, min, max, step, format, disabled, onChange }: RangeProps) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <label className="row row-range">
      <div className="row-text">
        <span className="row-label">{label}</span>
        <span className="row-value">{format(value)}</span>
      </div>
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step ?? 1}
        value={value}
        disabled={disabled}
        aria-label={label}
        style={{ background: `linear-gradient(90deg, var(--accent) ${fill}%, rgba(255,255,255,0.12) ${fill}%)` }}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}

type ChoiceProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  onChange: (next: string) => void;
};

export function Choice({ label, value, options, disabled, onChange }: ChoiceProps) {
  return (
    <div className="row row-choice">
      <span className="row-label">{label}</span>
      <div className="seg" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={option.value === value ? 'seg-item is-active' : 'seg-item'}
            aria-pressed={option.value === value}
            disabled={disabled}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export const MODE_OPTIONS: { value: AimMode; label: string }[] = [
  { value: 'off', label: 'Off' },
  { value: 'tap', label: 'Tap' },
  { value: 'hold', label: 'Hold' },
];

