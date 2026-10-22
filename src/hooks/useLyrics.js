import { useEffect, useState } from 'react';

// A draft made in Sync Studio (this browser only) overrides public/lyrics.json.
export default function useLyrics() {
  const [lyrics, setLyrics] = useState([]);
  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem('lyrics-draft') || '[]');
      if (draft.length) {
        setLyrics(draft);
        return;
      }
    } catch (error) {
      console.error('Could not read the saved lyrics draft.', error);
    }

    fetch('./lyrics.json')
      .then(response => {
        if (!response.ok) throw new Error(`Could not load lyrics.json (${response.status}).`);
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data) || data.some(line => !Number.isFinite(line.t) || typeof line.text !== 'string')) {
          throw new Error('lyrics.json must contain lyric entries with numeric timestamps and text.');
        }
        setLyrics(data);
      })
      .catch(error => console.error('Could not load lyrics.', error));
  }, []);
  return lyrics;
}
