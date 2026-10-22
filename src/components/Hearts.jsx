import { useEffect, useRef } from 'react';

const PAL = [['#ffb3bd', '#ff2d4a'], ['#ff9aa8', '#d41233'], ['#ffd0d5', '#e8344d'], ['#ff8a96', '#b3001f'], ['#ffffff', '#ff7a8c']];
const makeSprite = ([a, b]) => {
  const s = document.createElement('canvas'); s.width = s.height = 128; const x = s.getContext('2d');
  x.translate(64, 66); x.beginPath();
  for (let i = 0; i <= 60; i++) { const t = (i / 60) * Math.PI * 2, px = 16 * Math.sin(t) ** 3,
    py = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)); i ? x.lineTo(px * 3.3, py * 3.3) : x.moveTo(px * 3.3, py * 3.3); }
  x.closePath(); const g = x.createLinearGradient(-40, -40, 40, 50); g.addColorStop(0, a); g.addColorStop(1, b);
  x.shadowColor = b; x.shadowBlur = 16; x.fillStyle = g; x.fill();
  x.shadowBlur = 0; x.globalAlpha = 0.55; x.fillStyle = '#fff'; x.beginPath(); x.ellipse(-22, -22, 9, 5, -0.7, 0, 7); x.fill();
  return s;
};

export default function Hearts({ pulse }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, g = cv.getContext('2d'), sprites = PAL.map(makeSprite);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W, H, hearts = [], raf, last = performance.now();
    const mk = (bottom, x, y) => { const z = Math.random();
      return { x: x ?? Math.random() * W, y: y ?? (bottom ? H + 80 : Math.random() * H), s: 14 + z * 46, v: 14 + z * 42, ph: Math.random() * 6.28,
        sw: 10 + Math.random() * 28, r: (Math.random() - 0.5) * 0.5, sp: 0.3 + Math.random() * 0.6, a: 0.25 + z * 0.6, k: sprites[(Math.random() * sprites.length) | 0], life: 1 }; };
    const resize = () => { const d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
      cv.width = W * d; cv.height = H * d; g.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.round(Math.min(70, Math.max(26, (W * H) / 20000))); while (hearts.length < n) hearts.push(mk()); };
    const burst = (x, y, n) => { for (let i = 0; i < n; i++) { const h = mk(false, x, y); h.s = 12 + Math.random() * 26; h.vx = (Math.random() - 0.5) * 160;
      h.vy = -60 - Math.random() * 140; h.a = 0.9; h.burst = true; hearts.push(h); } };
    const onDown = (e) => { if (!e.target.closest('button,input,textarea')) burst(e.clientX, e.clientY, 10); };
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; const p = pulse?.current || 0;
      g.clearRect(0, 0, W, H);
      for (let i = hearts.length - 1; i >= 0; i--) { const h = hearts[i];
        if (h.burst) { h.x += h.vx * dt; h.y += h.vy * dt; h.vy += 90 * dt; h.vx *= 0.985; h.life -= dt * 0.5; if (h.life <= 0) { hearts.splice(i, 1); continue; } }
        else { h.y -= h.v * (1 + p * 1.2) * dt; h.ph += h.sp * dt; if (h.y < -80) Object.assign(h, mk(true)); }
        const sz = h.s * 2 * (1 + Math.sin(now / 700 + h.ph * 3) * 0.05 + p * 0.22);
        g.globalAlpha = h.a * (h.burst ? Math.max(0, h.life) : 1) * Math.min(1, (H - h.y + 60) / 120);
        g.save(); g.translate(h.x + (h.burst ? 0 : Math.sin(h.ph) * h.sw), h.y); g.rotate(h.r + Math.sin(h.ph) * 0.2);
        g.drawImage(h.k, -sz / 2, -sz / 2, sz, sz); g.restore(); }
      g.globalAlpha = 1; raf = requestAnimationFrame(frame);
    };
    resize(); addEventListener('resize', resize); addEventListener('pointerdown', onDown);
    window.__burst = burst; // lets the app trigger celebratory bursts
    if (!reduce) raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('pointerdown', onDown); delete window.__burst; };
  }, [pulse]);
  return <canvas ref={ref} className="hearts" />;
}
