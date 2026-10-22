import { useState } from 'react';
import config from './config.js';
import usePlayer from './hooks/usePlayer.js';
import useLyrics from './hooks/useLyrics.js';
import Hearts from './components/Hearts.jsx';
import Lyrics from './components/Lyrics.jsx';
import PlayButton from './components/PlayButton.jsx';
import NameGate from './components/NameGate.jsx';
import ForYou from './components/ForYou.jsx';
import SyncStudio from './components/SyncStudio.jsx';

export default function App() {
  const [stage, setStage] = useState('gate'), [name, setName] = useState('');
  const player = usePlayer(config.song), lyrics = useLyrics();
  const sync = new URLSearchParams(location.search).has('sync');
  const open = () => { setStage('show'); player.play(); window.__burst?.(innerWidth / 2, innerHeight / 2, 24); };

  return (
    <>
      <div className="orb o1" /><div className="orb o2" />
      <Hearts pulse={player.pulse} />
      {sync ? <SyncStudio player={player} /> : <>
        {stage === 'gate' && <NameGate onSubmit={n => { setName(n); setStage('for'); }} />}
        {stage === 'for' && <ForYou name={name} onOpen={open} />}
        {stage === 'show' && <>
          <div className="tag">for {name} ♥</div>
          <Lyrics lyrics={lyrics} getTime={player.getTime} active={player.playing} />
          <PlayButton playing={player.playing} onToggle={player.toggle} getProgress={player.getProgress} />
          {player.error && <div className="toast">Couldn’t play the song — check that public/song.mp3 exists</div>}
        </>}
      </>}
    </>
  );
}
