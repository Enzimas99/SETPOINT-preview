/* SETPOINT service worker v15
   - Instala guardando os arquivos essenciais.
   - Só trata pedidos do próprio site: chamadas à nuvem (Supabase) passam direto, sem cache e sem limite de tempo.
   - Rede com limite de 3 s e depois cache (Wi-Fi ruim na quadra não trava).
   - Remove caches antigos. Dados das partidas ficam no localStorage, fora do cache, e não são tocados.
   Ao publicar uma versão nova, aumente o número em CACHE. */
const CACHE='setpoint-v16',FILES=['./','./index.html','./fonts/barlow-400.woff2','./fonts/barlow-500.woff2','./fonts/barlow-600.woff2','./fonts/barlow-700.woff2','./fonts/barlow-condensed-700.woff2','./fonts/barlow-condensed-800.woff2','./config.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png','./favicon-32.png','./favicon-48.png','./logo.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(FILES.map(f=>c.add(f)))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const fresh=req=>new Promise((ok,no)=>{const t=setTimeout(()=>no('timeout'),3000);fetch(req).then(r=>{clearTimeout(t);ok(r)},e=>{clearTimeout(t);no(e)})});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(fresh(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
});
