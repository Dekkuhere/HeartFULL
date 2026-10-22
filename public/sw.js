const V = 'for-you-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg', './lyrics.json'];
self.addEventListener('install', e => e.waitUntil((async () => {
  const c = await caches.open(V); await c.addAll(SHELL);
  try { await c.add('./song.mp3'); } catch (_) {}
  self.skipWaiting();
})()));
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== V) await caches.delete(k);
  await self.clients.claim();
})()));
async function ranged(req, res) { // iOS/Safari need real 206 responses for audio
  const buf = await res.arrayBuffer(), m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range'));
  const s = m[1] ? +m[1] : 0, e = m[2] ? +m[2] : buf.byteLength - 1;
  return new Response(buf.slice(s, e + 1), { status: 206, headers: {
    'Content-Type': res.headers.get('Content-Type') || 'audio/mpeg',
    'Content-Range': `bytes ${s}-${e}/${buf.byteLength}`, 'Content-Length': e - s + 1 } });
}
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  e.respondWith((async () => {
    const c = await caches.open(V), hit = await c.match(req.url, { ignoreSearch: true });
    if (req.headers.has('range')) return hit ? ranged(req, hit) : fetch(req);
    const refresh = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(refresh); return hit; }
    return (await refresh) || (await c.match('./index.html')) || Response.error();
  })());
});
