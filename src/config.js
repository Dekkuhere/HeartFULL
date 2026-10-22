// ✏️ Everything you'd want to customise lives here (timings live in public/lyrics.json).
export default {
  song: './song.mp3',
  from: '',                          // optional: your name, shown as "— from {from}"
  gate: { title: 'Before we begin…', hint: 'What should I call you?', button: 'Continue' },
  forYou: (name) => ({ greeting: name, line1: 'this is for you', line2: 'Someone made this little moment just for you. Turn your sound on ♥', button: 'Open' }),
  hold: 11,                          // seconds a line lingers if no next line arrives
  lead: 0.25,                        // Sync Studio: stamp lines this many seconds early to offset tap delay
  // Used only while lyrics.json is empty, so the page is never blank:
  fallback: ['Every love story is beautiful', 'but yours is my favourite', 'Here’s to the start of forever', 'and every happy day after'],
};
