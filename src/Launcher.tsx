import { useRef, useState } from 'react';
import type { Pos } from './state';

export type LauncherProps = {
  open: boolean;
  initial: Pos | null;
  onOpen: () => void;
  onMove: (pos: Pos) => void;
};

type DragState = {
  startX: number;
  startY: number;
  baseX: number;
  baseY: number;
};

type PointerLike = { clientX: number; clientY: number };

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function Launcher({ open, initial, onOpen, onMove }: LauncherProps) {
  const [pos, setPos] = useState<Pos>(() => initial ?? { x: 0, y: 0 });
  const dragRef = useRef<DragState | null>(null);
  const movedRef = useRef<boolean>(false);
  const latestRef = useRef<Pos>(pos);

  const handleDown = (event: PointerLike) => {
    dragRef.current = { startX: event.clientX, startY: event.clientY, baseX: pos.x, baseY: pos.y };
    movedRef.current = false;
    latestRef.current = pos;

    const handleMove = (moveEvent: PointerLike) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = moveEvent.clientX - drag.startX;
      const dy = moveEvent.clientY - drag.startY;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) movedRef.current = true;
      const limitX = Math.max(0, window.innerWidth / 2 - 70);
      const limitY = Math.max(0, window.innerHeight / 2 - 90);
      const next = { x: clamp(drag.baseX + dx, -limitX, limitX), y: clamp(drag.baseY + dy, -limitY, limitY) };
      latestRef.current = next;
      setPos(next);
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
      dragRef.current = null;
      if (movedRef.current) onMove(latestRef.current);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
  };

  const handleClick = () => {
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    onOpen();
  };

  return (
    <button
      type="button"
      className={open ? 'launcher is-open' : 'launcher'}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      aria-label="Open the panel"
      onPointerDown={(event) => handleDown(event)}
      onClick={handleClick}
    >
      <span className="launcher-dot" />
      <span className="launcher-dot" />
      <span className="launcher-dot" />
    </button>
  );
}

export { Launcher };
