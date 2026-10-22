import { useEffect, useState } from 'react';
import config from '../config.js';

// Open the site with ?sync → paste lyrics, play, tap on every line as it's sung, copy the JSON into public/lyrics.json.
export default function SyncStudio({ player }) {
  const [text, setText] = useState(() => localStorage.getItem('lyrics-text') || '');
  const [stamps, setStamps] = useState(() => { try { return JSON.parse(localStorage.getItem('lyrics-stamps') || '[]'); } catch { return []; } });
  const [copied, setCopied] = useState(false);
  const lines = text.split('\n').map(s => s.trim()).filter(Boolean), idx = stamps.length;
  const save = (s) => { setStamps(s); localStorage.setItem('lyrics-stamps', JSON.stringify(s));
    localStorage.setItem('lyrics-draft', JSON.stringify(s.map((t, i) => ({ t, text: lines[i] })))); };
  const tap = () => { if (idx < lines.length && player.playing) save([...stamps, Math.max(0, +(player.getTime() - config.lead).toFixed(2))]); };
  const undo = () => save(stamps.slice(0, -1));
  const json = JSON.stringify(stamps.map((t, i) => ({ t, text: lines[i] })), null, 2);
  useEffect(() => {
    const k = (e) => { if (e.target.tagName === 'TEXTAREA') return; if (e.code === 'Space') { e.preventDefault(); tap(); } if (e.code === 'Backspace') undo(); };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  });
  const copy = async () => { try { await navigator.clipboard.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { prompt('Copy this JSON', json); } };
  return (
    <div className="studio glass">
      <h2 className="script">Sync Studio</h2>
      <textarea value={text} placeholder="Paste your lyrics here, one line per row…" rows={6}
        onChange={e => { setText(e.target.value); localStorage.setItem('lyrics-text', e.target.value); }} />
      <div className="row">
        <button className="glass-btn sm" onClick={player.toggle}>{player.playing ? 'Pause' : 'Play song'}</button>
        <button className="glass-btn sm" onClick={undo} disabled={!idx}>Undo</button>
        <button className="glass-btn sm" onClick={() => save([])}>Restart</button>
      </div>
      <p className="cue">{idx < lines.length ? <>Next line: <b>{lines[idx] || '—'}</b></> : lines.length ? 'All lines stamped ✓' : 'Add lyrics above'}</p>
      <button className="tap" onClick={tap} disabled={!player.playing || idx >= lines.length}>TAP when the line starts <small>(or press Space · Backspace = undo)</small></button>
      <div className="row">
        <button className="glass-btn sm" onClick={copy} disabled={!stamps.length}>{copied ? 'Copied ✓' : 'Copy lyrics.json'}</button>
        <a className="glass-btn sm" href={location.pathname}>Preview ♥</a>
      </div>
      <p className="fine">Paste the copied JSON into <code>public/lyrics.json</code> before you publish. Your draft is also stored in this browser so you can preview it right away.</p>
    </div>
  );
}
