(()=>{
const el=id=>document.getElementById(id);
const read=(k,d)=>{try{return localStorage.getItem(k)??d}catch{return d}};
const write=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
let sound=read('gym-sound','on')==='on',audio;
function syncSound(){el('soundToggle').textContent=sound?'🔊':'🔇';el('soundToggle').setAttribute('aria-pressed',String(sound));el('soundToggle').setAttribute('aria-label',sound?'Silenciar sonidos':'Activar sonidos')}
function tone(success=false){if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();const now=audio.currentTime;[0,...(success?[.09]:[])].forEach((delay,i)=>{const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.setValueAtTime(success?(i?880:660):480,now+delay);gain.gain.setValueAtTime(0,now+delay);gain.gain.linearRampToValueAtTime(.18,now+delay+.01);gain.gain.exponentialRampToValueAtTime(.001,now+delay+.1);osc.connect(gain);gain.connect(audio.destination);osc.start(now+delay);osc.stop(now+delay+.12)})}catch{}}
syncSound();el('soundToggle').onclick=()=>{sound=!sound;write('gym-sound',sound?'on':'off');syncSound();if(sound)tone()};
function palette(name){if(!['gold','cyan','violet'].includes(name))name='gold';document.body.dataset.palette=name;document.querySelectorAll('[data-palette]').forEach(b=>{if(b.tagName==='BUTTON')b.setAttribute('aria-pressed',String(b.dataset.palette===name))});write('gym-palette',name)}
palette(read('gym-palette','gold'));document.querySelectorAll('.swatch').forEach(b=>b.onclick=()=>palette(b.dataset.palette));
document.addEventListener('click',e=>{const b=e.target.closest('button,summary');if(!b||b.disabled)return;if(!['soundToggle','startSound','startQuiet','skipIntro'].includes(b.id))tone(b.id==='done'||b.id==='restDone');if(b.tagName==='BUTTON'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const r=b.getBoundingClientRect(),ripple=document.createElement('span');ripple.className='ripple';ripple.style.left=(e.detail?e.clientX-r.left:r.width/2)+'px';ripple.style.top=(e.detail?e.clientY-r.top:r.height/2)+'px';b.append(ripple);setTimeout(()=>ripple.remove(),600)}},true);
let promptEvent=null;const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const dialog=el('installDialog');
function installed(){el('installApp').textContent='✓ Instalada';el('installApp').setAttribute('aria-label','Aplicación instalada');if(dialog.open)dialog.close()}
function openInstall(){if(standalone()){installed();return}el('installGuide').hidden=true;el('confirmInstall').hidden=false;el('confirmInstall').textContent=promptEvent?'Instalar ahora':'Ver cómo instalar';el('laterInstall').textContent='Ahora no';if(!dialog.open)dialog.showModal()}
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();promptEvent=event;el('installApp').textContent='↓ Instalar';el('confirmInstall').textContent='Instalar ahora'});
window.addEventListener('appinstalled',()=>{promptEvent=null;write('gym-installed','yes');installed()});
el('installApp').onclick=openInstall;
el('confirmInstall').onclick=async()=>{if(promptEvent){const event=promptEvent;promptEvent=null;dialog.close();try{await event.prompt();const choice=await event.userChoice;if(choice.outcome==='accepted')installed()}catch{openInstall();el('installGuide').hidden=false}}else{el('installGuide').hidden=false;el('confirmInstall').hidden=true;el('laterInstall').textContent='Entendido'}};
el('laterInstall').onclick=()=>{write('gym-install-later',String(Date.now()));dialog.close()};dialog.addEventListener('cancel',()=>write('gym-install-later',String(Date.now())));
function offerInstall(){if(standalone())installed();else if(read('gym-installed','no')!=='yes'&&Date.now()-Number(read('gym-install-later','0'))>7*86400000)setTimeout(()=>{if(!document.querySelector('dialog[open]'))openInstall()},900)}
const startup=el('startup');let leaving=false;
document.querySelector('main').inert=true;

setTimeout(()=>{el('loadingText').textContent='Todo listo'},1400);
function bootSound(){if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});const now=audio.currentTime;const master=audio.createGain();master.gain.value=.55;const compressor=audio.createDynamicsCompressor();master.connect(compressor);compressor.connect(audio.destination);
// Original short retro-console chord, synthesized locally.
[98,147,196,246.94,293.66,587.33].forEach((freq,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type=i<2?'triangle':'sine';o.frequency.setValueAtTime(freq*.55,now);o.frequency.exponentialRampToValueAtTime(freq,now+.55);g.gain.setValueAtTime(.001,now);g.gain.exponentialRampToValueAtTime(i<2?.12:.075,now+.25+i*.07);g.gain.exponentialRampToValueAtTime(.001,now+2.3);o.connect(g);g.connect(master);o.start(now);o.stop(now+2.4)});setTimeout(()=>{master.disconnect();if(audio.state==='suspended')audio.close().then(()=>{audio=null}).catch(()=>{})},2700)}catch{}}
function enter(withSound){if(leaving)return;leaving=true;if(withSound)bootSound();el('loadingText').textContent='Bienvenido';startup.classList.add('leaving');document.querySelector('main').inert=false;setTimeout(()=>{startup.hidden=true;offerInstall()},500)}
el('skipIntro').onclick=()=>enter(false);
// Browsers may suspend AudioContext until a gesture. Never block navigation.
bootSound();
setTimeout(()=>enter(false),1800);

// A loading or script failure must never trap the user behind the welcome screen.
setTimeout(()=>{if(!leaving)enter(false)},15000);

el('importBackup').onclick=()=>el('backupFile').click();
el('backupFile').onchange=async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>2000000)throw Error();const backup=JSON.parse(await file.text());if(!backup.data||typeof backup.data!=='object'||Array.isArray(backup.data))throw Error();const clean={};for(const [date,record] of Object.entries(backup.data)){if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!record||typeof record!=='object')continue;const items={};for(const [id,item]of Object.entries(record.items||{})){if(/^(?:\d{1,3}|machine-\d{1,3})$/.test(id)&&item&&typeof item.done==='boolean')items[id]={done:item.done}}clean[date]={items,rest:record.rest===true}}if(!Object.keys(clean).length)throw Error();for(const [date,record]of Object.entries(clean)){data[date]={...data[date],...record,items:{...data[date]?.items,...record.items}}}save();render();toast('Respaldo restaurado en este teléfono.')}catch{toast('No se pudo leer este respaldo. Elige el archivo JSON de tu rutina.')}event.target.value=''};
})();
