(() => {
'use strict';
const {categories,exercises,week}=window.ATENEA;
const $=id=>document.getElementById(id), app=$('app'), KEY='spartan-atenea-v1';
const paths={
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
 left:'<path d="m14 5-7 7 7 7"/>',right:'<path d="m10 5 7 7-7 7"/>',
 check:'<path d="m5 12 4 4L19 6"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',
 play:'<path d="m8 4 12 8-12 8Z"/>',pause:'<path d="M8 5v14M16 5v14"/>',
 sound:'<path d="m11 4-6 5H2v6h3l6 5Z"/><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/>',
 mute:'<path d="m11 4-6 5H2v6h3l6 5Z"/><path d="m16 9 6 6m0-6-6 6"/>',
 share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 10 6-4m-6 8 6 4"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4m8-4v4M8 14h2m4 0h2m-8 3h2"/>',
 clock:'<circle cx="12" cy="13" r="8"/><path d="M12 9v5l3 2M9 2h6m-3 0v3"/>',
 glutes:'<path d="M8 3c0 4-3 6-3 11 0 4 3 7 7 7s7-3 7-7c0-5-3-7-3-11M12 12v7M6 13c1-3 5-3 6 0 1-3 5-3 6 0"/>',
 legs:'<path d="M7 3h10l-1 8 2 9h-4l-2-9-2 9H6l2-9Z"/><path d="M10 5h4M7 15h3m4 0h3"/>',
 core:'<path d="m7 3-2 5 2 6-1 7h12l-1-7 2-6-2-5M12 7v11M9 10h6m-6 4h6"/>',
 heart:'<path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-4 4 1 9 8 15 7-6 12-11 8-15Z"/><path d="M3 11h4l2-4 4 9 2-5h6"/>',
 food:'<path d="M12 7c-5-4-10 1-8 6 1 4 3 8 6 8l2-1 2 1c3 0 5-4 6-8 2-5-3-10-8-6ZM12 7c0-4 2-5 5-5-1 3-2 4-5 5Z"/>',
 upper:'<path d="M9 3h6l1 3 5 2-2 7-3-1v7H8v-7l-3 1-2-7 5-2Z"/><path d="m8 7 4 3 4-3m-4 3v8"/>',
 moon:'<path d="M20 14A8 8 0 0 1 10 4a8.5 8.5 0 1 0 10 10ZM18 2v4m-2-2h4M21 7v3m-1.5-1.5h3"/>',
 chart:'<path d="M4 3v18h17M8 16v-4m5 4V8m5 8V4"/><path d="m7 6 3-3 3 3"/>',
 spark:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-11v1"/>',
 walk:'<circle cx="14" cy="4" r="2"/><path d="m10 21 2-7-3-3 2-4 4 1 2 4h4M5 13l3-4 3-2m1 7 5 7"/>',
 water:'<path d="M12 2C9 7 5 10 5 15a7 7 0 0 0 14 0c0-5-4-8-7-13Z"/>'
};
const icon=(name)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.spark}</svg>`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const localDate=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&localDate(new Date(s+'T12:00:00'))===s;
const today=()=>localDate(new Date());
const formatDate=s=>new Date(s+'T12:00:00').toLocaleDateString('es-SV',{weekday:'long',day:'numeric',month:'long'});
const empty=()=>({version:1,days:{},settings:{sound:true},installLater:0});
function cleanData(raw){
 if(!raw||raw.version!==1||!raw.days||typeof raw.days!=='object'||Array.isArray(raw.days))throw Error('Respaldo incompatible');
 const result=empty();
 for(const [date,r] of Object.entries(raw.days)){
  if(!validDate(date)||!r||typeof r!=='object'||Array.isArray(r))continue;
  const record={items:{},habits:{},rest:r.rest===true,minutes:Math.max(0,Math.min(240,Math.round(Number(r.minutes)||0)))};
  for(const e of exercises)if(r.items?.[e.id]===true)record.items[e.id]=true;
  for(const h of ['meal','water','walk'])if(r.habits?.[h]===true)record.habits[h]=true;
  if(Object.keys(record.items).length||record.minutes>0||record.habits.walk)record.rest=false;
  result.days[date]=record;
 }
 result.settings.sound=raw.settings?.sound!==false;
 result.installLater=Number.isFinite(raw.installLater)?raw.installLater:0;
 return result;
}
let data=empty(),storageOK=true;
try {const stored=localStorage.getItem(KEY);if(stored)data=cleanData(JSON.parse(stored));}catch{storageOK=false;}
let selectedDate=today(),paused=matchMedia('(prefers-reduced-motion: reduce)').matches,muscle=false,toastTimeout,audio,installEvent=null;
let restEnd=0,restRemaining=0,timerPaused=false;
function save(){try{localStorage.setItem(KEY,JSON.stringify(data));storageOK=true;}catch{storageOK=false;toast('No se pudo guardar. Descarga un respaldo de tu progreso.');}}
function record(){return data.days[selectedDate]||{items:{},habits:{},rest:false,minutes:0};}
function editRecord(){return data.days[selectedDate]??=( {items:{},habits:{},rest:false,minutes:0} );}
function count(r){return Object.values(r?.items||{}).filter(Boolean).length;}
function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('toast').classList.remove('visible'),3500);}
function tone(kind='tap'){
 if(!data.settings.sound)return;
 try{
  audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});
  const now=audio.currentTime,comp=audio.createDynamicsCompressor();comp.connect(audio.destination);
  const notes=kind==='boot'?[130.81,196,261.63,329.63,523.25]:kind==='done'?[523.25,783.99]:kind==='timer'?[659.25,783.99,1046.5]:[520];
  notes.forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain(),start=now+i*(kind==='boot'?.08:.1),duration=kind==='boot'?1.65:.15;o.type=kind==='boot'&&i<2?'triangle':'sine';o.frequency.setValueAtTime(kind==='boot'?f*.6:f,start);if(kind==='boot')o.frequency.exponentialRampToValueAtTime(f,start+.4);g.gain.setValueAtTime(.001,start);g.gain.exponentialRampToValueAtTime(kind==='boot'?.10:.27,start+.02);g.gain.exponentialRampToValueAtTime(.001,start+duration);o.connect(g);g.connect(comp);o.start(start);o.stop(start+duration+.03);});
  setTimeout(()=>comp.disconnect(),2600);
 }catch{}
}
function syncSound(){$('sound').innerHTML=icon(data.settings.sound?'sound':'mute');$('sound').setAttribute('aria-pressed',String(data.settings.sound));$('sound').setAttribute('aria-label',data.settings.sound?'Silenciar sonidos':'Activar sonidos');}
function showModal(html){$('modal-content').innerHTML=html;if(!$('modal').open)$('modal').showModal();}
function homeButton(){return `<button class="back-home" data-action="home">${icon('home')} Inicio</button>`;}
function dateChip(){return `<button class="date-chip" data-action="date">${icon('calendar')}${esc(formatDate(selectedDate))}</button>`;}
function go(route){muscle=false;paused=matchMedia('(prefers-reduced-motion: reduce)').matches;if(location.hash==='#'+route){render();}else location.hash=route;}
function categoryRoute(c){return ['panza','descanso','nutricion','progreso'].includes(c.id)?c.id:c.id+'/0';}
function weekRows(){return '<div class="week-list">'+[1,2,3,4,5,6,0].map(i=>`<div class="week-row ${new Date(selectedDate+'T12:00:00').getDay()===i?'selected':''}"><b>${week[i].short}</b><div><strong>${week[i].title}</strong><small>${week[i].type==='rest'?'Sin entrenamiento':week[i].type==='walk'?'Sin sesión de fuerza':'2 series por ejercicio · ritmo controlado'}</small></div></div>`).join('')+'</div>';}
function home(){
 const day=week[new Date(selectedDate+'T12:00:00').getDay()];
 return `<section class="hero"><span class="eyebrow">ATENEA · TU ESPACIO</span><h1>Tu fuerza.<br><em>Tu ritmo.</em></h1><p>Elige un grupo. Mira el movimiento.<br>Marca lo que hiciste.</p><div class="hero-mark">${icon('spark')}</div>${dateChip()}</section>
 <section class="today-card"><div class="today-top"><span>${selectedDate===today()?'Hoy':'Tu plan'} · ${day.name}</span><button data-action="week">Ver semana</button></div><h2>${day.title}</h2><p>${day.desc}</p><div class="today-links">${day.cats.length?day.cats.map(id=>{const c=categories.find(c=>c.id===id);return `<button class="mini-pill" data-go="${categoryRoute(c)}">${icon(c.icon)}${c.name==='Bajar la panza'?'Abdomen':c.name}</button>`;}).join(''):`<button class="mini-pill" data-action="rest">${icon(record().rest?'check':'moon')}${record().rest?'Descanso registrado':'Marcar descanso'}</button>`}</div></section>
 <div class="section-heading"><h2>¿Qué quieres trabajar?</h2><span>8 espacios</span></div><section class="menu-grid" aria-label="Grupos de ejercicios">${categories.map(c=>`<button class="category ${c.color}" data-go="${categoryRoute(c)}"><span class="tile-icon">${icon(c.icon)}</span><strong>${c.name}</strong><small>${c.sub}</small></button>`).join('')}</section><div class="home-note">${icon('check')}<span>${count(record())?count(record())+' ejercicios marcados en esta fecha.':'Tu progreso se guarda en este teléfono.'} Cada persona lleva su propio registro.</span></div>`;
}
function exercise(c,index){
 const e=exercises.find(e=>e.id===c.items[index]);if(!e)return home();const r=record(),n=c.items.filter(id=>r.items[id]).length;
 return `${homeButton()}<div class="exercise-top"><span>${c.name==='Bajar la panza'?'Abdomen':c.name} · ${index+1} de ${c.items.length}</span><span>${n} hechos</span></div><div class="progress-line"><i style="width:${100*n/c.items.length}%"></i></div><h1 class="exercise-title">${e.name}</h1>
 <div class="media"><img id="exercise-image" src="./assets/e${e.id}.${paused||muscle?'jpg':'gif'}" alt="${e.name}: ${e.views?'vistas del equipo':'posición inicial y final'}" width="600" height="400">${muscle&&e.mark?`<svg class="muscle-overlay" viewBox="0 0 600 400" aria-hidden="true"><ellipse cx="${e.mark[0]*600}" cy="${e.mark[1]*400}" rx="${e.mark[2]*600}" ry="${e.mark[3]*400}" fill="#39fa7b66" stroke="#7affab" stroke-width="3"/></svg>`:''}<div class="media-controls"><button data-action="pause" aria-label="${paused||muscle?'Reproducir GIF':'Pausar GIF'}">${icon(paused||muscle?'play':'pause')}${paused||muscle?'Reproducir':'Pausar'}</button>${e.mark?`<button data-action="muscle" aria-pressed="${muscle}"><span class="green-dot"></span>${muscle?'Ocultar zona':'Ver músculo'}</button>`:''}</div></div>
 <p class="gif-label">${muscle?'Zona principal orientativa · imagen pausada para verla con claridad.':e.views?'GIF de 2 vistas del equipo. Sigue las indicaciones de abajo.':'GIF de 2 posiciones reales · repite el movimiento lentamente.'}</p>
 <nav class="exercise-nav" aria-label="Navegación entre ejercicios"><button data-go="${c.id}/${index-1}" ${index===0?'disabled':''}>${icon('left')}Anterior</button><button class="nav-home" data-action="home">${icon('home')}Inicio</button><button data-go="${c.id}/${index+1}" ${index===c.items.length-1?'disabled':''}>${icon('right')}Siguiente</button></nav>
 <div class="muscle-name">${icon(e.views?'heart':'spark')}<span>${e.muscle}</span></div><div class="metrics"><div class="metric"><strong>${e.sets}</strong><span>${e.views?'sesión':'series'}</span></div><div class="metric"><strong>${e.reps}</strong><span>${e.unit||'repeticiones'}</span>${e.side?`<small>${e.side}</small>`:''}</div><div class="metric"><strong>${e.rest} s</strong><span>${e.views?'pausa opcional':'descanso'}</span></div></div>
 <button class="done-button ${r.items[e.id]?'complete':''}" data-done="${e.id}" aria-pressed="${!!r.items[e.id]}">${icon(r.items[e.id]?'check':'check')} ${r.items[e.id]?'Hecho · tocar para desmarcar':'Marcar ejercicio hecho'}</button><button class="secondary rest-button" data-timer="${e.rest}">${icon('clock')}Iniciar descanso de ${e.rest} segundos</button>
 <section class="howto"><h3>Así se hace</h3><ol class="steps">${e.steps.map(s=>`<li>${s}</li>`).join('')}</ol></section><p class="tip">${e.views?'La intensidad debe permitirte hablar. Si estás empezando, basta con menos minutos.':'Elige un peso que te deje unas 2–3 repeticiones posibles al terminar. Empieza con 5–10 minutos suaves y una serie ligera de práctica.'} Detente si aparece dolor agudo, mareo o malestar.</p>${dateChip()}${c.id==='panza'?'<button class="secondary wide" data-go="panza">Volver a la guía de hábitos</button>':''}`;
}
function habit(id,title,sub){const checked=record().habits[id];return `<button class="habit-row ${checked?'checked':''}" data-habit="${id}" aria-pressed="${!!checked}"><span class="check-box">${checked?icon('check'):''}</span><span><strong>${title}</strong><small>${sub}</small></span></button>`;}
function panza(){return `${homeButton()}<div class="page-head"><span class="eyebrow">ABDOMEN + HÁBITOS</span><h1>Bajar la panza,<br>paso a paso.</h1><p>Movimiento, alimentación y constancia.</p>${dateChip()}</div><div class="guide-intro"><p>Los abdominales fortalecen el abdomen, pero no eliminan grasa solo de esa zona. El cambio depende de tus hábitos y del balance de energía a lo largo del tiempo.</p></div>
 <article class="guide-card"><img src="./assets/e12.jpg" alt="Persona caminando en una caminadora" loading="lazy"><div class="guide-body"><span class="step-label">01 · CAMINA</span><h3>En máquina o de paseo.</h3><p>Empieza con 10–15 minutos a un ritmo cómodo. Puedes dividirlos en paseos cortos. Suma tiempo poco a poco; la referencia general para adultos es llegar a 150 minutos moderados por semana.</p><p>No necesitas correr ni usar una inclinación alta.</p><button class="secondary wide" data-go="cardio/2">${icon('walk')}Ver cómo caminar en máquina</button>${habit('walk','Hoy hice una caminata','Máquina o paseo al aire libre')}<label class="field">Minutos caminados hoy<input type="number" id="walk-minutes" min="0" max="240" step="1" value="${record().minutes||''}" placeholder="Por ejemplo: 15" inputmode="numeric"></label><button class="primary wide" data-action="minutes" style="margin-top:12px">Guardar minutos</button></div></article>
 <article class="guide-card"><img src="./assets/food.jpg" alt="Idea de plato con pollo, frijoles, arroz y verduras" style="object-position:center 57%" loading="lazy"><div class="guide-body"><span class="step-label">02 · COME CON EQUILIBRIO</span><h3>Comida que te acompaña.</h3><p>Combina verduras, una fuente de proteína y un acompañamiento como arroz, tortilla, papa o frijoles. Ajusta las porciones a tu hambre y necesidades; no hace falta eliminar todos los carbohidratos.</p><p>Prioriza agua y limita las bebidas azucaradas. Evita depender de tés o productos que prometen “quemar la panza”.</p><p class="small-note">Imagen ilustrativa de un plato; no representa una porción personalizada.</p>${habit('meal','Hoy incluí verduras y proteína','Un hábito sencillo, sin exigir perfección')}<button class="secondary wide" data-go="nutricion">Ver ideas de alimentación</button></div></article>
 <article class="guide-card"><img src="./assets/e13.jpg" alt="Ejercicio de control abdominal en colchoneta" loading="lazy"><div class="guide-body"><span class="step-label">03 · FORTALECE</span><h3>Un abdomen con control.</h3><p>Practica estos dos ejercicios en tu día de piernas y abdomen. Respira y prioriza la técnica.</p><button class="primary wide" data-go="panza/0">${icon('play')}Ver los 2 ejercicios</button></div></article>`;}
function nutrition(){return `${homeButton()}<div class="page-head"><span class="eyebrow">NUTRICIÓN</span><h1>Alimenta tu fuerza.</h1><p>Ideas prácticas para tus comidas de cada día.</p></div><article class="guide-card"><img src="./assets/food.jpg" alt="Plato ilustrativo con verduras, pollo, arroz y frijoles" loading="lazy"><div class="guide-body"><h3>Arma un plato variado.</h3><ul><li><strong>Verduras:</strong> ensalada, güisquil, ejotes o las que tengas.</li><li><strong>Proteína:</strong> pollo, pescado, huevos, frijoles, lentejas o tofu.</li><li><strong>Energía:</strong> tortilla, arroz, avena o papa. Elige la cantidad según tus necesidades.</li><li><strong>Bebida:</strong> agua con tus comidas y durante el día.</li></ul><p class="small-note">Foto ilustrativa. Las cantidades son individuales.</p></div></article>
 <section class="howto"><h3>Tu metabolismo no necesita trucos.</h3><p>El cuerpo usa energía para vivir, digerir alimentos y moverse. Entrenar fuerza, caminar, descansar y comer con regularidad son hábitos útiles. Ningún alimento acelera el metabolismo de forma mágica.</p></section>
 ${habit('water','Hoy elegí agua con mis comidas','Bebe según tu sed y las condiciones del día')}
 <details class="details"><summary>Estimar mis calorías de mantenimiento</summary><p>Una referencia opcional para adultas. No es una dieta para adelgazar ni una medición exacta de tu metabolismo.</p><p class="small-note">No usar durante embarazo o lactancia, ni en menores de 18 años. Si necesitas una pauta alimentaria personal, consulta a un profesional de nutrición.</p><form id="calorie-form"><div class="form-grid"><label class="field">Edad<input name="age" type="number" min="18" max="100" required placeholder="Años" inputmode="numeric"></label><label class="field">Peso en kg<input name="weight" type="number" min="35" max="250" step="0.1" required placeholder="kg" inputmode="decimal"></label><label class="field">Estatura en cm<input name="height" type="number" min="120" max="220" required placeholder="cm" inputmode="numeric"></label><label class="field">Actividad habitual<select name="activity"><option value="1.2">Poca actividad</option><option value="1.375">Ligera</option><option value="1.55">Moderada</option><option value="1.725">Alta</option></select></label></div><button class="primary wide" type="submit">Calcular referencia</button></form><div id="calorie-result" aria-live="polite"></div><p class="small-note">Ecuación de Mifflin–St Jeor para mujeres, multiplicada por un factor aproximado de actividad. El gasto real puede diferir; no restes calorías automáticamente a este resultado. Tus medidas no se guardan.</p></details><button class="secondary wide" data-go="panza">Ver la guía de caminata y hábitos</button>`;}
function rest(){return `${homeButton()}<div class="page-head"><span class="eyebrow">RECUPERACIÓN</span><h1>También se avanza<br>descansando.</h1><p>Una propuesta de 3 días de fuerza por semana.</p>${dateChip()}</div>${weekRows()}<p class="tip">Este es un punto de partida adaptable. Deja al menos un día entre sesiones de fuerza del mismo grupo y reduce el volumen si no te recuperas bien. No hace falta completar todas las categorías cada día.</p><button class="done-button ${record().rest?'complete':''}" data-action="rest">${icon(record().rest?'check':'moon')}${record().rest?'Descanso completo registrado':'Marcar descanso completo'}</button><section class="howto"><h3>Movilidad suave, si te apetece.</h3><p>Dos movimientos para los días sin fuerza. Son opcionales; descansar por completo también está bien.</p><button class="secondary wide" style="margin-top:18px" data-go="descanso/0">Ver movilidad</button></section>`;}
function progress(){
 const entries=Object.entries(data.days).filter(([,r])=>count(r)||r.rest||r.minutes||Object.values(r.habits).some(Boolean)).sort(([a],[b])=>b.localeCompare(a));
 const start=new Date(selectedDate+'T12:00:00');start.setDate(start.getDate()-((start.getDay()+6)%7));const end=new Date(start);end.setDate(end.getDate()+6);const a=localDate(start),b=localDate(end);
 const days=entries.filter(([d])=>d>=a&&d<=b),training=days.filter(([,r])=>count(r)>0).length,rests=days.filter(([,r])=>r.rest).length,minutes=days.reduce((n,[,r])=>n+r.minutes,0);
 return `${homeButton()}<div class="page-head"><span class="eyebrow">MI PROGRESO</span><h1>Cada paso cuenta.</h1><p>Tu semana, tus hábitos y tus descansos.</p>${dateChip()}</div><div class="stats"><div><strong>${training}</strong><span>días con ejercicios</span></div><div><strong>${rests}</strong><span>descansos</span></div><div><strong>${minutes}</strong><span>minutos a pie</span></div></div><p class="small-note">Semana del ${new Date(a+'T12:00:00').toLocaleDateString('es-SV',{day:'numeric',month:'short'})} al ${new Date(b+'T12:00:00').toLocaleDateString('es-SV',{day:'numeric',month:'short'})}.</p><section class="howto"><h3>Tu historial</h3>${entries.length?entries.slice(0,60).map(([d,r])=>`<div class="history-row"><button data-date="${d}"><strong>${esc(formatDate(d))}</strong><span>${r.rest?'Descanso completo':`${count(r)} ejercicios${r.minutes?' · '+r.minutes+' min caminados':''}${Object.values(r.habits).some(Boolean)?' · hábitos registrados':''}`}</span></button></div>`).join(''):`<div class="empty-state">${icon('chart')}<p>Tu primera marca aparecerá aquí.<br>Abre un grupo y toca “Hecho”.</p></div>`}</section><p class="status-line">${storageOK?'Guardado en este navegador.':'El navegador no permite guardar. Exporta un respaldo antes de cerrar.'} Cambiar de teléfono o borrar los datos del navegador puede eliminar este registro.</p><div class="button-row"><button class="secondary" data-action="export">${icon('download')}Respaldar</button><button class="secondary" data-action="import">${icon('upload')}Restaurar</button></div><p class="small-note">El respaldo contiene solo tus marcas, hábitos y preferencias. Restaurarlo combina los registros y conserva tus marcas actuales.</p>`;
}
function render(scroll=true){
 const route=location.hash.slice(1)||'home',[id,pos]=route.split('/'),c=categories.find(c=>c.id===id);
 if(c?.items&&pos!==undefined&&/^\d+$/.test(pos)&&Number(pos)<c.items.length)app.innerHTML=exercise(c,Number(pos));
 else app.innerHTML=id==='panza'?panza():id==='nutricion'?nutrition():id==='descanso'?rest():id==='progreso'?progress():home();
 if(scroll){window.scrollTo({top:0,behavior:'instant'});app.focus({preventScroll:true});}
 $('calorie-form')?.addEventListener('submit',ev=>{ev.preventDefault();const f=new FormData(ev.currentTarget),age=Number(f.get('age')),kg=Number(f.get('weight')),cm=Number(f.get('height')),factor=Number(f.get('activity'));if(!(age>=18&&age<=100&&kg>=35&&kg<=250&&cm>=120&&cm<=220&&[1.2,1.375,1.55,1.725].includes(factor)))return;const kcal=Math.round((10*kg+6.25*cm-5*age-161)*factor/10)*10;$('calorie-result').innerHTML=`<div class="calculator-result"><span>Mantenimiento estimado</span><strong>≈ ${kcal.toLocaleString('es-SV')} kcal/día</strong><p>Una orientación, no una meta obligatoria. Tu actividad real y tus necesidades pueden cambiar el resultado.</p></div>`;tone();});
}
function setDate(value){if(!validDate(value)||value>today()){toast('Elige hoy o una fecha anterior.');return;}selectedDate=value;if($('modal').open)$('modal').close();render(false);}
function markRest(){const r=editRecord();if(!r.rest&&(count(r)||r.minutes||r.habits.walk)){toast('Ya hay actividad registrada ese día. Elige otro día para descanso completo.');return;}r.rest=!r.rest;save();render(false);toast(r.rest?'Descanso completo registrado.':'Descanso desmarcado.');}
function about(){showModal(`<h2>ATENEA</h2><p>Una app de SPARTAN GYM COMALAPA para seguir ejercicios y hábitos. Es una guía general que puedes adaptar con tu entrenador.</p><p>Los GIFs muestran dos posiciones reales o dos vistas del equipo. Las zonas verdes son orientativas, no un mapa anatómico exacto.</p><p>Los registros se guardan en este navegador, sin cuenta ni envío a un servidor. Cada teléfono tiene su propio progreso. Usa “Respaldar” antes de cambiar de dispositivo.</p><ul class="source-list"><li><a href="https://github.com/yuhonas/free-exercise-db" target="_blank" rel="noopener">Fotos de ejercicios: Free Exercise DB</a> · dominio público. <a href="./EXERCISE-LICENSE.txt">Licencia</a>.</li><li><a href="https://www.cdc.gov/physical-activity-basics/guidelines/adults.html" target="_blank" rel="noopener">CDC · actividad física para adultos</a>.</li><li><a href="https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity/eating-physical-activity" target="_blank" rel="noopener">NIDDK · alimentación y actividad</a>.</li><li><a href="https://pubmed.ncbi.nlm.nih.gov/2305711/" target="_blank" rel="noopener">Mifflin–St Jeor · estimación energética</a>.</li><li>Foto de alimentación creada como ilustración. Iconos locales basados en formas geométricas y Lucide/Feather. <a href="./ICON-LICENSE.txt">Licencia de iconos</a>.</li></ul><p class="small-note">ATENEA 1.0 · power by: yuri</p>`);}
function installApp(){
 if(matchMedia('(display-mode: standalone)').matches||navigator.standalone){toast('Ya estás usando ATENEA como aplicación.');return;}
 showModal(`<img src="./icon-192.png" class="install-logo" alt="SPARTAN GYM"><h2>ATENEA en tu pantalla</h2><p>Ábrela desde un icono, como una aplicación. No necesitas un APK.</p><button class="primary wide" data-action="install-now">${icon('download')}${installEvent?'Instalar ATENEA':'Ver cómo instalar'}</button><div id="install-help" hidden><p><strong>Android · Chrome</strong><br>Abre el menú de tres puntos ⋮ y toca <strong>“Añadir a pantalla de inicio”</strong> o <strong>“Instalar aplicación”</strong>.</p><p><strong>iPhone · Safari</strong><br>Toca Compartir y después <strong>“Añadir a pantalla de inicio”</strong>.</p><p class="install-hint">Si abriste el enlace dentro de WhatsApp, ábrelo primero en Chrome o Safari. La opción depende del navegador y de que uses el enlace HTTPS.</p></div>`);
}
function startTimer(seconds){restRemaining=seconds;restEnd=Date.now()+seconds*1000;timerPaused=false;$('timer').classList.remove('hidden');updateTimer();}
function updateTimer(){if($('timer').classList.contains('hidden'))return;let n=timerPaused?restRemaining:Math.max(0,Math.ceil((restEnd-Date.now())/1000));$('timer-value').textContent=`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;$('timer-toggle').innerHTML=icon(timerPaused?'play':'pause');$('timer-toggle').setAttribute('aria-label',timerPaused?'Reanudar descanso':'Pausar descanso');if(!timerPaused&&n===0){$('timer').classList.add('hidden');tone('timer');toast('Descanso terminado. Continúa cuando estés lista.');}}
$('timer-toggle').onclick=()=>{if(timerPaused){restEnd=Date.now()+restRemaining*1000;timerPaused=false;}else{restRemaining=Math.max(0,Math.ceil((restEnd-Date.now())/1000));timerPaused=true;}updateTimer();};
$('timer-close').innerHTML=icon('close');$('timer-close').onclick=()=>$('timer').classList.add('hidden');setInterval(updateTimer,500);document.addEventListener('visibilitychange',updateTimer);
$('sound').onclick=()=>{data.settings.sound=!data.settings.sound;save();syncSound();if(data.settings.sound)tone('boot');};
$('share').innerHTML=icon('share');$('share').onclick=async()=>{const url=location.protocol==='https:'?new URL('./',location.href).href:'https://softwarehubsp-collab.github.io/SPARTANGYMCOMALAPA/atenea/';try{if(navigator.share){await navigator.share({title:'ATENEA · SPARTAN GYM COMALAPA',text:'Entrena a tu ritmo con ATENEA.',url});}else if(navigator.clipboard){await navigator.clipboard.writeText(url);toast('Enlace copiado. Pégalo en WhatsApp.');}else{showModal(`<h2>Comparte ATENEA</h2><p>Copia este enlace:</p><input aria-label="Enlace de ATENEA" value="${esc(url)}" readonly style="width:100%;padding:12px">`);}}catch(e){if(e.name!=='AbortError')toast('Puedes copiar el enlace desde la barra del navegador.');}};
$('install').onclick=installApp;$('close-modal').onclick=()=>{data.installLater=Date.now();save();$('modal').close();};$('modal').addEventListener('cancel',()=>{data.installLater=Date.now();save();});
window.addEventListener('beforeinstallprompt',ev=>{ev.preventDefault();installEvent=ev;if(Date.now()-data.installLater>7*86400000)setTimeout(()=>{if(!$('modal').open)installApp();},2500);});
window.addEventListener('appinstalled',()=>{installEvent=null;if($('modal').open)$('modal').close();$('install').textContent='Instalada';toast('ATENEA ya está en tu pantalla de inicio.');});
if(matchMedia('(display-mode: standalone)').matches||navigator.standalone)$('install').textContent='Instalada';
$('import-file').onchange=async ev=>{const file=ev.target.files[0];if(!file)return;try{if(file.size>2000000)throw Error();const incoming=cleanData(JSON.parse(await file.text()));for(const [date,r]of Object.entries(incoming.days)){const old=data.days[date];if(old){r.items={...r.items,...old.items};r.habits={...r.habits,...old.habits};r.minutes=Math.max(r.minutes,old.minutes);r.rest=(r.rest||old.rest)&&!count(r)&&!r.minutes&&!r.habits.walk;}data.days[date]=r;}save();render(false);toast('Respaldo restaurado y combinado.');}catch{toast('No es un respaldo válido de ATENEA.');}ev.target.value='';};
document.addEventListener('click',async ev=>{
 const b=ev.target.closest('button');if(!b||b.disabled)return;
 if(b.id!=='sound')tone(b.hasAttribute('data-done')?'done':'tap');
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const r=b.getBoundingClientRect(),dot=document.createElement('span');dot.className='ripple';dot.style.left=(ev.detail?ev.clientX-r.left:r.width/2)+'px';dot.style.top=(ev.detail?ev.clientY-r.top:r.height/2)+'px';b.append(dot);setTimeout(()=>dot.remove(),550);}
 if(b.dataset.go!==undefined){go(b.dataset.go);return;}
 if(b.dataset.date){selectedDate=b.dataset.date;go('home');return;}
 if(b.dataset.done!==undefined){const r=editRecord(),id=Number(b.dataset.done);if(!exercises.some(e=>e.id===id))return;if(r.items[id])delete r.items[id];else{r.items[id]=true;r.rest=false;}save();render(false);toast(r.items[id]?'Hecho. Tu avance quedó guardado.':'Ejercicio desmarcado.');return;}
 if(b.dataset.timer){startTimer(Number(b.dataset.timer));return;}
 if(b.dataset.habit){const r=editRecord(),h=b.dataset.habit;r.habits[h]=!r.habits[h];if(h==='walk'&&r.habits[h])r.rest=false;save();render(false);return;}
 switch(b.dataset.action){
 case 'home':go('home');break;
 case 'date':showModal(`<h2>¿Qué día quieres ver?</h2><p>Puedes registrar hoy o completar un día anterior.</p><input id="choose-date" type="date" max="${today()}" value="${selectedDate}"><button class="primary wide" data-action="date-save" style="margin-top:15px">Ver este día</button>`);break;
 case 'date-save':setDate($('choose-date').value);break;
 case 'week':showModal(`<h2>Tu semana ATENEA</h2><p>3 días de fuerza. Los paseos son opcionales; el fin de semana queda para descanso completo.</p>${weekRows()}<p class="small-note">Plan orientativo. Ajusta la carga con tu entrenador según tu recuperación.</p>`);break;
 case 'rest':markRest();break;
 case 'pause':if(muscle){muscle=false;paused=false;}else paused=!paused;render(false);break;
 case 'muscle':muscle=!muscle;render(false);break;
 case 'minutes':{const minutes=Number($('walk-minutes').value);if(!Number.isInteger(minutes)||minutes<0||minutes>240){toast('Escribe entre 0 y 240 minutos.');return;}const r=editRecord();r.minutes=minutes;if(minutes){r.habits.walk=true;r.rest=false;}save();render(false);toast('Minutos guardados.');break;}
 case 'about':about();break;
 case 'import':$('import-file').click();break;
 case 'export':{const blob=new Blob([JSON.stringify({...data,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='ATENEA-progreso-'+today()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Respaldo preparado para descargar.');break;}
 case 'install-now':if(installEvent){const prompt=installEvent;installEvent=null;try{await prompt.prompt();const answer=await prompt.userChoice;if(answer.outcome==='accepted')$('modal').close();}catch{$('install-help').hidden=false;}}else $('install-help').hidden=false;break;
 }
});
window.addEventListener('hashchange',()=>render());
syncSound();render(false);tone('boot');
if('serviceWorker'in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js',{scope:'./'}).then(reg=>{reg.update();}).catch(()=>{});
if(!storageOK)setTimeout(()=>toast('Activa el almacenamiento del navegador o guarda respaldos.'),2800);
// Small pure helpers also used by the local validation script.
window.AteneaLogic={validDate,cleanData,localDate,count};
})();
