import { useEffect, useRef, useState } from 'react';
import config from '../config.js';

export default function Lyrics({ lyrics, getTime, active }) {
  const [lines, setLines] = useState([]), shown = useRef(-2);
  useEffect(() => {
    if (!lyrics.length) return; let raf;
    const loop = () => {
      const t = getTime(); let idx = -1;
      for (let i = lyrics.length - 1; i >= 0; i--) if (t >= lyrics[i].t) { idx = i; break; }
      if (idx >= 0) { const L = lyrics[idx], next = lyrics[idx + 1], end = L.end ?? (next ? Math.min(next.t, L.t + config.hold) : L.t + config.hold);
        if (t > end && (L.end !== undefined || !next || t > L.t + config.hold)) idx = -1; }
      if (!active) idx = Math.min(idx, shown.current);
      if (idx !== shown.current) {
        shown.current = idx;
        setLines(p => { const n = p.map(l => ({ ...l, out: true })); if (idx >= 0) n.push({ key: `${idx}-${performance.now()}`, text: lyrics[idx].text }); return n; });
        setTimeout(() => setLines(p => p.filter(l => !l.out)), 1000);
        if (idx >= 0) window.__burst?.(innerWidth / 2, innerHeight * 0.62, 5);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }, [lyrics, getTime, active]);

  return (
    <div className="lyrics" aria-live="polite">
      {lines.map(l => (
        <div key={l.key} className={'line' + (l.out ? ' out' : '')}>
          {l.text.split(/(\s+)/).filter(Boolean).map((w, i) => <span key={i} className="w" style={{ '--i': i }}>{w}</span>)}
        </div>
      ))}
    </div>
  );
}
