import { useCallback, useEffect, useRef, useState } from 'react';

// Audio element + live beat detection (bass energy via Web Audio). pulse.current is 1 on a beat and decays to 0.
export default function usePlayer(src) {
  const audio = useRef(null), ctx = useRef(null), node = useRef(null), pulse = useRef(0);
  const [playing, setPlaying] = useState(false), [ended, setEnded] = useState(false), [error, setError] = useState(false);

  useEffect(() => {
    const a = new Audio(src); a.preload = 'auto'; a.playsInline = true; audio.current = a;
    const end = () => { setPlaying(false); setEnded(true); }, err = () => setError(true);
    a.addEventListener('ended', end); a.addEventListener('error', err);
    return () => { a.pause(); a.removeEventListener('ended', end); a.removeEventListener('error', err); ctx.current?.close(); ctx.current = node.current = null; };
  }, [src]);

  useEffect(() => {
    let raf, avg = 0, last = 0; const buf = new Uint8Array(256);
    const loop = (now) => {
      if (node.current && playing) {
        node.current.getByteFrequencyData(buf);
        let s = 0; for (let i = 1; i <= 5; i++) s += buf[i];
        const bass = s / 5;
        if (bass > avg * 1.22 && bass > 100 && now - last > 260) { pulse.current = 1; last = now; }
        avg = avg * 0.94 + bass * 0.06;
      }
      pulse.current *= 0.9;
      document.documentElement.style.setProperty('--pulse', pulse.current.toFixed(3));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }, [playing]);

  const play = useCallback(async () => {
    const a = audio.current; if (!a) return;
    if (!ctx.current) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext, c = new AC(), n = c.createAnalyser();
        n.fftSize = 512; n.smoothingTimeConstant = 0.6;
        c.createMediaElementSource(a).connect(n); n.connect(c.destination); ctx.current = c; node.current = n;
      } catch (_) {}
    }
    try { await ctx.current?.resume(); if (ended) a.currentTime = 0; await a.play(); setEnded(false); setPlaying(true); }
    catch (_) { setError(true); }
  }, [ended]);
  const pause = useCallback(() => { audio.current?.pause(); setPlaying(false); }, []);
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, play, pause]);

  useEffect(() => { const f = () => document.hidden && pause(); document.addEventListener('visibilitychange', f); return () => document.removeEventListener('visibilitychange', f); }, [pause]);

  return {
    playing, ended, error, play, pause, toggle, pulse,
    getTime: () => audio.current?.currentTime || 0,
    getProgress: () => { const a = audio.current; return a && a.duration ? a.currentTime / a.duration : 0; },
  };
}
