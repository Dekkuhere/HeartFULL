import { useState } from 'react';
import config from '../config.js';

export default function NameGate({ onSubmit }) {
  const [name, setName] = useState(new URLSearchParams(location.search).get('to') || '');
  const go = (e) => { e.preventDefault(); if (name.trim()) onSubmit(name.trim()); };
  return (
    <form className="screen fade" onSubmit={go}>
      <h1 className="script">{config.gate.title}</h1>
      <input className="glass-input" value={name} onChange={e => setName(e.target.value)} placeholder={config.gate.hint} autoFocus maxLength={30} aria-label="Your name" />
      <button className="glass-btn" type="submit" disabled={!name.trim()}>{config.gate.button}</button>
    </form>
  );
}
