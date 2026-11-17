import { useState } from 'react';
import { BASE_VALUES, type PanelState, type Pos, readPos, readState, writePos, writeState } from './state';
import { Launcher } from './Launcher';
import { Panel } from './Panel';

function App() {
  const [state, setState] = useState<PanelState>(() => readState());
  const [pos, setPos] = useState<Pos | null>(() => readPos());
  // Opens straight into the menu. There is no key screen anywhere in this app.
  const [open, setOpen] = useState<boolean>(true);

  const update = (patch: Partial<PanelState>) => {
    setState((current) => {
      const next = { ...current, ...patch };
      writeState(next);
      return next;
    });
  };

  const reset = () => {
    setState(BASE_VALUES);
    writeState(BASE_VALUES);
  };

  const movePos = (next: Pos) => {
    setPos(next);
    writePos(next);
  };

  return (
    <div className={state.reduceMotion ? 'app no-motion' : 'app'}>
      <Launcher open={open} initial={pos} onOpen={() => setOpen(true)} onMove={movePos} />
      <Panel
        open={open}
        state={state}
        onClose={() => setOpen(false)}
        onChange={update}
        onReset={reset}
      />
    </div>
  );
}

export default App;
