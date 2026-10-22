const CACHE='atenea-v1';
const CORE=["./", "./index.html", "./style.css", "./app.js", "./data.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./assets/e0.gif", "./assets/e0.jpg", "./assets/e1.gif", "./assets/e1.jpg", "./assets/e10.gif", "./assets/e10.jpg", "./assets/e11.gif", "./assets/e11.jpg", "./assets/e12.gif", "./assets/e12.jpg", "./assets/e13.gif", "./assets/e13.jpg", "./assets/e14.gif", "./assets/e14.jpg", "./assets/e15.gif", "./assets/e15.jpg", "./assets/e16.gif", "./assets/e16.jpg", "./assets/e2.gif", "./assets/e2.jpg", "./assets/e3.gif", "./assets/e3.jpg", "./assets/e4.gif", "./assets/e4.jpg", "./assets/e5.gif", "./assets/e5.jpg", "./assets/e6.gif", "./assets/e6.jpg", "./assets/e7.gif", "./assets/e7.jpg", "./assets/e8.gif", "./assets/e8.jpg", "./assets/e9.gif", "./assets/e9.jpg", "./assets/food.jpg", "./assets/logo.jpg"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('atenea-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const url=new URL(e.request.url);
 if(e.request.method!=='GET'||url.origin!==location.origin||!url.href.startsWith(self.registration.scope))return;
 e.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(e.request.mode==='navigate'){
   try{const fresh=await fetch(e.request);if(fresh.ok)await cache.put(e.request,fresh.clone());return fresh;}
   catch{return (await cache.match(e.request))||(await cache.match('./index.html'))||Response.error();}
  }
  const saved=await cache.match(e.request);if(saved)return saved;
  try{const fresh=await fetch(e.request);if(fresh.ok)await cache.put(e.request,fresh.clone());return fresh;}catch{return Response.error();}
 })());
});
