# For You – hearts & lyrics
npm install → npm run dev (or npm run build, then host the `dist` folder over HTTPS).

1. Run `npm run dev`, open `/?sync` (e.g. http://localhost:5173/?sync).
2. Paste the lyrics, press Play song, tap (or Space) as each line begins.
3. Copy lyrics.json → paste into `public/lyrics.json`. Open `/` to preview. Customise texts in `src/config.js`.
4. Swap the song: replace `public/song.mp3` (same name) and re-sync.

Song is trimmed to 55s. Lyrics: paste into `public/lyrics.txt`; timings: `public/timings.json` (start `t` and `end` per line, in seconds).
