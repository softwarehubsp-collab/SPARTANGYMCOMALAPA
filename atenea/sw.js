const CACHE='atenea-v3.3';
const CORE=["./assets/bridge-user.mp4","./assets/bridge-machine.webp","./assets/bridge-video-poster.jpg","./", "./app.js?v=3.3", "./assets/curl-acostado.gif", "./assets/curl-acostado.jpg", "./assets/e0.gif", "./assets/e0.jpg", "./assets/e1.gif", "./assets/e1.jpg", "./assets/e10.gif", "./assets/e10.jpg", "./assets/e12.gif", "./assets/e12.jpg", "./assets/e13.gif", "./assets/e13.jpg", "./assets/e15.gif", "./assets/e15.jpg", "./assets/e16.gif", "./assets/e16.jpg", "./assets/e17.gif", "./assets/e17.jpg", "./assets/e18.gif", "./assets/e18.jpg", "./assets/e19.gif", "./assets/e19.jpg", "./assets/e2.gif", "./assets/e2.jpg", "./assets/e20.gif", "./assets/e20.jpg", "./assets/e21.gif", "./assets/e21.jpg", "./assets/e22.gif", "./assets/e22.jpg", "./assets/e3.gif", "./assets/e3.jpg", "./assets/e5.gif", "./assets/e5.jpg", "./assets/e6.gif", "./assets/e6.jpg", "./assets/e7.gif", "./assets/e7.jpg", "./assets/e8.gif", "./assets/e8.jpg", "./assets/e9.gif", "./assets/e9.jpg", "./assets/food-casamiento.jpg", "./assets/food-desayuno.jpg", "./assets/food-fruta.jpg", "./assets/food-pescado.jpg", "./assets/food-pipian.jpg", "./assets/food-pollo.jpg", "./assets/food-pupusas.jpg", "./assets/food-sopa-pollo.jpg", "./assets/food-sopa-res.jpg", "./assets/food.jpg", "./assets/hip-thrust-barra.gif", "./assets/hip-thrust-barra.jpg", "./assets/logo.jpg", "./assets/puente-barra.gif", "./assets/puente-barra.jpg", "./assets/puente-disco.gif", "./assets/puente-disco.jpg", "./assets/ref-14-poster.jpg", "./assets/ref-14.gif", "./assets/ref-23-poster.jpg", "./assets/ref-23.gif", "./assets/ref-24.jpg", "./assets/ref-30-poster.jpg", "./assets/ref-30.jpg", "./assets/ref-31-poster.jpg", "./assets/ref-31.jpg", "./assets/ref-32-poster.jpg", "./assets/ref-32.jpg", "./assets/ref-33-poster.jpg", "./assets/ref-33.gif", "./assets/ref-34-poster.jpg", "./assets/ref-34.jpg", "./assets/ref-35-poster.jpg", "./assets/ref-35.jpg", "./assets/ref-36-poster.jpg", "./assets/ref-36.gif", "./assets/ref-37-poster.jpg", "./assets/ref-37.gif", "./assets/ref-38-poster.jpg", "./assets/ref-38.jpg", "./assets/ref-39-poster.jpg", "./assets/ref-39.jpg", "./assets/ref-40-poster.jpg", "./assets/ref-40.jpg", "./assets/ref-41-poster.jpg", "./assets/ref-41.jpg", "./assets/ref-42-poster.jpg", "./assets/ref-42.jpg", "./assets/ref-43-poster.jpg", "./assets/ref-43.jpg", "./assets/ref-44.jpg", "./assets/ref-45-poster.jpg", "./assets/ref-45.jpg", "./assets/ref-46-poster.jpg", "./assets/ref-46.gif", "./assets/ref-47-poster.jpg", "./assets/ref-47.gif", "./assets/ref-48-poster.jpg", "./assets/ref-48.gif", "./assets/ref-49-poster.jpg", "./assets/ref-49.jpg", "./assets/ref-50.jpg", "./assets/ref-51-poster.jpg", "./assets/ref-51.jpg", "./data.js?v=3.3", "./icon-192.png", "./icon-512.png", "./index.html", "./manifest.webmanifest", "./menus.js?v=3.3", "./style.css?v=3.3"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(async c=>{
 const essential=['./index.html','./app.js?v=3.3','./data.js?v=3.3','./menus.js?v=3.3','./style.css?v=3.3'];
 await Promise.all(essential.map(async path=>{const r=await fetch(new Request(path,{cache:'reload'}));if(!r.ok)throw Error(path);await c.put(path,r);}));
 await self.skipWaiting();
 await Promise.allSettled(CORE.filter(path=>!essential.includes(path)).map(path=>c.add(path)));
}));});
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
