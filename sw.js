const CACHE_NAME = "my-money-v1"; // bump to my-money-v2 on every release
const ASSETS = ["./","./index.html","./css/style.css","./manifest.json","./data/translations.js","./js/storage.js","./js/state.js","./js/language.js","./js/utils.js","./js/currency.js","./js/transactions.js","./js/summary.js","./js/ui.js","./js/app.js",
  "./assets/icon-192.png","./assets/icon-512.png","./assets/apple-touch-icon.png","./assets/favicon.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return; // never touch cross-origin traffic
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{
    if(res.ok){const cp=res.clone();caches.open(CACHE_NAME).then(c=>c.put(r,cp));}
    return res;
  }).catch(()=>r.mode==="navigate"?caches.match("./index.html"):Response.error())));
});
