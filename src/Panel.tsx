import { Choice, MODE_OPTIONS, Range, Toggle } from './controls';
import type { AimMode, PanelState } from './state';

export type PanelProps = {
  open: boolean;
  state: PanelState;
  onClose: () => void;
  onChange: (patch: Partial<PanelState>) => void;
  onReset: () => void;
};

export function Panel({ open, state, onClose, onChange, onReset }: PanelProps) {
  if (!open) return null;
  const isOff = !state.master;

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <section className="panel" style={{ opacity: state.opacity / 100 }} aria-label="Control panel">
        <div className="panel-grab" />
        <header className="panel-head">
          <div className="panel-titles">
            <h1 className="panel-title">Panel</h1>
            <p className="panel-sub">Opens with no key, no code, no account.</p>
          </div>
          <button type="button" className="panel-close" aria-label="Close the panel" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="panel-badge">Free · unlocked</div>

        <div className="panel-body">
          <div className="row row-master">
            <div className="row-text">
              <span className="row-label">Enable panel</span>
              <span className="row-hint">Master switch for every option below.</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={state.master}
              aria-label="Enable panel"
              className={state.master ? 'switch is-on' : 'switch'}
              onClick={() => onChange({ master: !state.master })}
            >
              <span className="switch-track">
                <span className="switch-dot" />
              </span>
            </button>
          </div>

          <h2 className="panel-group">On-screen</h2>
          <Toggle label="Box highlights" value={state.boxes} disabled={isOff} onChange={(boxes) => onChange({ boxes })} />
          <Toggle label="Tracer lines" value={state.tracer} disabled={isOff} onChange={(tracer) => onChange({ tracer })} />
          <Range
            label="Ring size"
            value={state.ring}
            min={40}
            max={200}
            disabled={isOff}
            format={(value) => `${value}px`}
            onChange={(ring) => onChange({ ring })}
          />

          <h2 className="panel-group">Targeting</h2>
          <Toggle label="Target lock" value={state.targetLock} disabled={isOff} onChange={(targetLock) => onChange({ targetLock })} />
          <Choice
            label="Mode"
            value={state.mode}
            options={MODE_OPTIONS}
            disabled={isOff}
            onChange={(next) => onChange({ mode: next as AimMode })}
          />
          <Range
            label="Sensitivity"
            value={state.sensitivity}
            min={1}
            max={20}
            disabled={isOff}
            format={(value) => `${value}`}
            onChange={(sensitivity) => onChange({ sensitivity })}
          />

          <h2 className="panel-group">Panel look</h2>
          <Range
            label="Opacity"
            value={state.opacity}
            min={40}
            max={100}
            step={5}
            disabled={isOff}
            format={(value) => `${value}%`}
            onChange={(opacity) => onChange({ opacity: opacity })}
          />
          <Toggle label="Reduce motion" value={state.reduceMotion} onChange={(reduceMotion) => onChange({ reduceMotion })} />

          <h2 className="panel-group">Movement</h2>
          <Range
            label="Speed"
            value={state.speed}
            min={5}
            max={30}
            disabled={isOff}
            format={(value) => `${(value / 10).toFixed(1)}x`}
            onChange={(speed) => onChange({ speed })}
          />
          <Toggle label="Zero drift" value={state.steady} disabled={isOff} onChange={(steady) => onChange({ steady })} />
        </div>

        <footer className="panel-foot">
          <button type="button" className="panel-reset" onClick={onReset}>
            Reset to defaults
          </button>
          <p className="panel-note">
            Everything stays on this device. No key, no account, no server.
          </p>
        </footer>
      </section>
    </>
  );
}
