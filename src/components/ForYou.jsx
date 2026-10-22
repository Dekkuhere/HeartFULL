import config from '../config.js';

export default function ForYou({ name, onOpen }) {
  const c = config.forYou(name);
  return (
    <div className="screen">
      <p className="eyebrow rise" style={{ '--d': '0s' }}>{c.line1}</p>
      <h1 className="script big rise" style={{ '--d': '.5s' }}>{c.greeting}</h1>
      <p className="note rise" style={{ '--d': '1.2s' }}>{c.line2}{config.from && <><br />— {config.from}</>}</p>
      <button className="glass-btn rise" style={{ '--d': '2s' }} onClick={onOpen}>{c.button}</button>
    </div>
  );
}
