import { useEffect, useRef } from 'react';

export default function PlayButton({ playing, onToggle, getProgress }) {
  const button = useRef(null);
  useEffect(() => { let raf; const loop = () => { if (button.current) button.current.style.setProperty('--progress', `${getProgress() * 100}%`); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf); }, [getProgress]);
  return (
    <button ref={button} className={'ctl' + (playing ? ' on' : '')} onClick={onToggle} aria-label={playing ? 'Pause music' : 'Play music'}>
      <svg className="i play" width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
      <svg className="i pause" width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4.2" height="14" rx="1.4" /><rect x="13.8" y="5" width="4.2" height="14" rx="1.4" /></svg>
    </button>
  );
}
