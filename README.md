❤️ HeartFULL

A romantic, single-page web experience built as a heartfelt gift. Someone opens it, enters their name, gets a personal "this is for you" moment, and then watches glowing red hearts float across a dark, dreamy screen while a song plays and the lyrics appear line by line in time with the music.

Built with React + Vite. Works on desktop and mobile, and can be installed like an app and used offline.

Features
Personal welcome – asks for a name, then shows a "this is for you" message addressed to them
Floating hearts – dozens of glowing hearts drifting at different depths on a lightweight canvas
Beat-reactive visuals – hearts, background glow and the play button pulse with the song's bass beats
Synced lyrics – each line fades in word by word and lifts away as the next one arrives
Glass play/pause control – frosted-glass button with a circular progress ring
Tap-to-burst – tapping the screen sends out a small burst of hearts
Sync Studio – built-in tool for timing lyrics by tapping along to the song
Offline / installable – service worker and web manifest, so it can be added to a phone's home screen
Respects reduced-motion settings
Project structure
public/
  song.mp3          the music (swap in any song under this name)
  lyrics.txt        lyric lines, one per row ([bracketed] rows are ignored)
  timings.json      start/end time in seconds for each line
  sw.js             service worker (offline support)
  manifest.webmanifest, icon.svg
src/
  config.js         texts, messages, timing options
  App.jsx           screens: name → "for you" → show
  components/       Hearts, Lyrics, PlayButton, NameGate, ForYou, SyncStudio
  hooks/            usePlayer (audio + beat detection), useLyrics
  index.css         theme and animations
Getting started
bash
npm install
npm run dev        # development server
npm run build      # production build in /dist
npm run preview    # preview the production build
Customising
Song: replace public/song.mp3, then update timings.json.
Lyrics: put one line per row in public/lyrics.txt. Line n uses entry n in timings.json.
Timing: edit public/timings.json — each entry is { "t": start, "end": end } in seconds.
Wording: welcome text, greeting and the finale message are in src/config.js.
Colours: theme variables are at the top of src/index.css; heart colours are at the top of src/components/Hearts.jsx.
Pre-filled name: share a link like https://your-site/?to=Name to pre-fill the name field.
Syncing lyrics with Sync Studio
Run the app and open /?sync.
Paste the lyrics (one line per row) and press Play song.
Tap the button (or press Space) as each line begins; Backspace undoes the last tap.
Copy the generated JSON and use it as public/timings.json and public/lyrics.txt.
Deploying

Build with npm run build and host the dist folder on any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages). Use HTTPS so offline mode and "Add to Home Screen" work. The app uses relative paths, so it also works from a sub-folder.

Tech

React 18 · Vite · Canvas 2D · Web Audio API · Service Worker · CSS (glassmorphism, no UI libraries)

Note on media

The song and lyrics belong to their respective owners. Use them only in line with their licensing, especially if you host the project publicly.
