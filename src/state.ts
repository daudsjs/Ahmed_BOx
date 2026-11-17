export type AimMode = 'off' | 'tap' | 'hold';

export type PanelState = {
  master: boolean;
  boxes: boolean;
  tracer: boolean;
  ring: number;
  targetLock: boolean;
  mode: AimMode;
  sensitivity: number;
  opacity: number;
  reduceMotion: boolean;
  speed: number;
  steady: boolean;
};

export type Pos = { x: number; y: number };

export const STATE_KEY = 'free-panel:state:v1';
export const POS_KEY = 'free-panel:pos:v1';

export const BASE_VALUES: PanelState = {
  master: true,
  boxes: true,
  tracer: false,
  ring: 90,
  targetLock: true,
  mode: 'tap',
  sensitivity: 8,
  opacity: 100,
  reduceMotion: false,
  speed: 10,
  steady: true,
};

function clampNumber(value: unknown, alt: number, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return alt;
  return Math.min(max, Math.max(min, value));
}

function readBoolean(value: unknown, alt: boolean): boolean {
  return typeof value === 'boolean' ? value : alt;
}

function readMode(value: unknown, alt: AimMode): AimMode {
  return value === 'off' || value === 'tap' || value === 'hold' ? value : alt;
}

export function mergeState(raw: unknown): PanelState {
  const source = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
  return {
    master: readBoolean(source.master, BASE_VALUES.master),
    boxes: readBoolean(source.boxes, BASE_VALUES.boxes),
    tracer: readBoolean(source.tracer, BASE_VALUES.tracer),
    ring: clampNumber(source.ring, BASE_VALUES.ring, 40, 200),
    targetLock: readBoolean(source.targetLock, BASE_VALUES.targetLock),
    mode: readMode(source.mode, BASE_VALUES.mode),
    sensitivity: clampNumber(source.sensitivity, BASE_VALUES.sensitivity, 1, 20),
    opacity: clampNumber(source.opacity, BASE_VALUES.opacity, 40, 100),
    reduceMotion: readBoolean(source.reduceMotion, BASE_VALUES.reduceMotion),
    speed: clampNumber(source.speed, BASE_VALUES.speed, 5, 30),
    steady: readBoolean(source.steady, BASE_VALUES.steady),
  };
}

export function readState(): PanelState {
  if (typeof window === 'undefined') return BASE_VALUES;
  try {
    const raw = window.localStorage.getItem(STATE_KEY);
    if (!raw) return BASE_VALUES;
    return mergeState(JSON.parse(raw));
  } catch {
    return BASE_VALUES;
  }
}

export function writeState(state: PanelState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    // Private mode or a full quota: the panel still works, it just will not remember.
  }
}

export function readPos(): Pos | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(POS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (typeof parsed.x !== 'number' || typeof parsed.y !== 'number') return null;
    return { x: parsed.x, y: parsed.y };
  } catch {
    return null;
  }
}

export function writePos(pos: Pos): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(POS_KEY, JSON.stringify(pos));
  } catch {
    // Ignore: position memory is a nicety, not a requirement.
  }
}
