const STORE_KEY='miVozV2Data';
const DEFAULT_DATA={
  activeCharacter:'bruno',
  characters:{
    bruno:{id:'bruno',name:'Bruno',emoji:'🐶',role:'Constructor tranquilo',desc:'Amigable, protector y claro.',welcome:'Hola campeón, estoy contigo.',voiceAudio:''},
    luna:{id:'luna',name:'Luna',emoji:'🐕',role:'Cachorrita cariñosa',desc:'Dulce, paciente y suave.',welcome:'Hola, vamos a aprender juntos.',voiceAudio:''},
    max:{id:'max',name:'Max',emoji:'🚚',role:'Camión feliz',desc:'Divertido y con energía.',welcome:'¡Vamos, tú puedes!',voiceAudio:''},
    tito:{id:'tito',name:'Tito',emoji:'🚜',role:'Tractor de calma',desc:'Ideal para respirar y volver a intentar.',welcome:'Respira tranquilo, estoy aquí.',voiceAudio:''}
  },
  categories:{
    'Necesidades':[
      {label:'Agua',phrase:'Quiero agua',emoji:'💧',audio:''},{label:'Comer',phrase:'Quiero comer',emoji:'🍽️',audio:''},{label:'Baño',phrase:'Quiero ir al baño',emoji:'🚽',audio:''},{label:'Dormir',phrase:'Quiero dormir',emoji:'🛏️',audio:''},{label:'Ayuda',phrase:'Necesito ayuda',emoji:'🆘',audio:''},{label:'Más',phrase:'Quiero más',emoji:'➕',audio:''},{label:'Terminé',phrase:'Ya terminé',emoji:'✅',audio:''},{label:'No',phrase:'No quiero',emoji:'🚫',audio:''}
    ],
    'Emociones':[
      {label:'Feliz',phrase:'Estoy feliz',emoji:'😊',audio:''},{label:'Triste',phrase:'Estoy triste',emoji:'😢',audio:''},{label:'Enojado',phrase:'Estoy enojado',emoji:'😠',audio:''},{label:'Cansado',phrase:'Estoy cansado',emoji:'🥱',audio:''},{label:'Dolor',phrase:'Me duele',emoji:'🤕',audio:''},{label:'Miedo',phrase:'Tengo miedo',emoji:'😟',audio:''}
    ],
    'Jugar':[
      {label:'Jugar',phrase:'Quiero jugar',emoji:'🧸',audio:''},{label:'Carro',phrase:'Quiero carro',emoji:'🚗',audio:''},{label:'Pelota',phrase:'Quiero pelota',emoji:'⚽',audio:''},{label:'Música',phrase:'Quiero música',emoji:'🎵',audio:''},{label:'Libro',phrase:'Quiero libro',emoji:'📘',audio:''},{label:'Parque',phrase:'Quiero ir al parque',emoji:'🌳',audio:''}
    ],
    'Comida':[
      {label:'Leche',phrase:'Quiero leche',emoji:'🥛',audio:''},{label:'Pan',phrase:'Quiero pan',emoji:'🍞',audio:''},{label:'Fruta',phrase:'Quiero fruta',emoji:'🍎',audio:''},{label:'Galleta',phrase:'Quiero galleta',emoji:'🍪',audio:''},{label:'Arroz',phrase:'Quiero arroz',emoji:'🍚',audio:''},{label:'Helado',phrase:'Quiero helado',emoji:'🍦',audio:''}
    ]
  },
  family:[], videos:{
    'Canciones':[{title:'Canción tranquila',emoji:'🎵',url:'',file:'',source:'Ejemplo'}],
    'Aprender':[{title:'Colores',emoji:'🌈',url:'',file:'',source:'Ejemplo'}],
    'Animales':[{title:'Animales',emoji:'🐶',url:'',file:'',source:'Ejemplo'}]
  }, stats:{}, settings:{rate:.9,pitch:1.2,useRecorded:true,celebrate:true,voiceIndex:0}
};
let data=load(), currentCategory=Object.keys(data.categories)[0], currentVideoCategory=Object.keys(data.videos||{'Canciones':[]})[0], voices=[], currentRoutine='morning', currentGame='coloring', breathingTimer=null;
const routines={morning:[['🌞','Me despierto'],['🚽','Voy al baño'],['🪥','Me lavo los dientes'],['👕','Me visto'],['🍽️','Desayuno']],night:[['🛁','Me baño'],['🧸','Guardo juguetes'],['🪥','Me lavo los dientes'],['📘','Cuento'],['🛏️','Dormir']],school:[['🎒','Preparo bulto'],['🚗','Voy a la escuela'],['👋','Saludo'],['🍎','Merienda'],['🏠','Regreso a casa']]};
const calmItems=[['Estoy triste','Estoy triste','😢'],['Estoy enojado','Estoy enojado','😠'],['Tengo miedo','Tengo miedo','😟'],['Me duele','Me duele','🤕'],['Abrazo','Quiero un abrazo','🤗'],['Silencio','Quiero silencio','🤫'],['Descanso','Quiero descansar','🛏️'],['Ayuda','Necesito ayuda','🆘']];
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function clone(o){return JSON.parse(JSON.stringify(o))} function load(){try{return Object.assign(clone(DEFAULT_DATA),JSON.parse(localStorage.getItem(STORE_KEY)||'{}'))}catch{return clone(DEFAULT_DATA)}} function save(){localStorage.setItem(STORE_KEY,JSON.stringify(data))}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1700)}
function fileToDataURL(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
function activeChar(){return data.characters[data.activeCharacter]||data.characters.bruno}
function recordUse(phrase){data.stats[phrase]=(data.stats[phrase]||0)+1;save();renderStats()}
function playAudio(src){return new Promise((res,rej)=>{const a=new Audio(src);a.onended=res;a.onerror=rej;a.play().catch(rej)})}
async function speak(text, audio=''){recordUse(text); if(data.settings.useRecorded&&audio){try{await playAudio(audio);return}catch{}} if('speechSynthesis' in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='es-CR';u.rate=data.settings.rate;u.pitch=data.settings.pitch;if(voices[data.settings.voiceIndex])u.voice=voices[data.settings.voiceIndex];speechSynthesis.speak(u)}else toast(text)}
async function characterSpeak(text){const c=activeChar(); if(data.settings.useRecorded&&c.voiceAudio){try{await playAudio(c.voiceAudio);return}catch{}} speak(text||c.welcome)}
function initNav(){ $$('.nav-btn').forEach(b=>b.onclick=()=>{ $$('.nav-btn,.view').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#'+b.dataset.view).classList.add('active'); if(b.dataset.view==='play')setTimeout(drawTemplate,80); if(b.dataset.view==='reports')renderStats();}); }
function renderCharacters(){const g=$('#characterGrid');g.innerHTML='';Object.values(data.characters).forEach(c=>{const card=document.createElement('button');card.className='character-card '+(c.id===data.activeCharacter?'active':'');card.innerHTML=`<div class="character-top"><div class="character-emoji">${c.emoji}</div><div><h3>${c.name}</h3><p>${c.role}</p></div></div><span class="tag">${c.desc}</span>`;card.onclick=()=>{data.activeCharacter=c.id;save();renderCharacters();updateHero();characterSpeak(c.welcome)};g.appendChild(card)});}
function updateHero(){const c=activeChar();$('#activeMascotEmoji').textContent=c.emoji}
function renderCategories(){const bar=$('#categoryBar');bar.innerHTML='';Object.keys(data.categories).forEach(c=>{const b=document.createElement('button');b.className='chip '+(c===currentCategory?'active':'');b.textContent=c;b.onclick=()=>{currentCategory=c;renderCategories();renderTalk()};bar.appendChild(b)})}
function renderTalk(){const g=$('#talkGrid');g.innerHTML='';(data.categories[currentCategory]||[]).forEach(item=>{const b=document.createElement('button');b.className='talk-card';b.innerHTML=`<div>${item.emoji}</div><div class="label">${item.label}</div><div class="phrase">${item.phrase}</div>`;b.onclick=()=>speak(item.phrase,item.audio);g.appendChild(b)})}
function initQuick(){ $$('.quick-card').forEach(b=>b.onclick=()=>speak(b.dataset.say)); $('#speakWelcomeBtn').onclick=()=>characterSpeak(activeChar().welcome); }
function renderFamily(){const g=$('#familyGrid');g.innerHTML='';data.family.forEach((f,i)=>{const b=document.createElement('button');b.className='talk-card';b.innerHTML=`${f.photo?`<img class="family-img" src="${f.photo}" alt="${f.name}">`:`<div>👤</div>`}<div class="label">${f.name}</div><div class="phrase">${f.phrase||f.name}</div><button class="mini-delete" data-i="${i}">Eliminar</button>`;b.onclick=e=>{if(e.target.matches('.mini-delete')){data.family.splice(i,1);save();renderFamily();return} speak(f.phrase||f.name,f.audio)};g.appendChild(b)})}
function initFamily(){ $('#familyForm').onsubmit=async e=>{e.preventDefault();let name=$('#familyName').value.trim(), phrase=$('#familyPhrase').value.trim();let photo=$('#familyPhoto').files[0]?await fileToDataURL($('#familyPhoto').files[0]):'';let audio=$('#familyAudio').files[0]?await fileToDataURL($('#familyAudio').files[0]):'';data.family.push({name,phrase:phrase||name,photo,audio});save();e.target.reset();renderFamily();toast('Familiar agregado')}; }
function renderRoutine(){const list=$('#routineList');list.innerHTML='';routines[currentRoutine].forEach(([emoji,text],i)=>{const row=document.createElement('div');row.className='routine-item';row.innerHTML=`<div class="routine-check"></div><div>${emoji}</div><div>${text}</div>`;row.onclick=()=>{row.classList.toggle('done');row.querySelector('.routine-check').textContent=row.classList.contains('done')?'✓':'';if($$('#routineList .done').length===routines[currentRoutine].length){ if(data.settings.celebrate) characterSpeak('Excelente, terminaste tu rutina.'); toast('🎉 Rutina completa')}};list.appendChild(row)})}
function initRoutines(){ $$('.routine-tab').forEach(b=>b.onclick=()=>{$$('.routine-tab').forEach(x=>x.className='btn light routine-tab');b.className='btn primary routine-tab';currentRoutine=b.dataset.routine;renderRoutine()}); renderRoutine(); }
function renderCalm(){const g=$('#calmGrid');g.innerHTML='';calmItems.forEach(([label,phrase,emoji])=>{const b=document.createElement('button');b.className='talk-card';b.innerHTML=`<div>${emoji}</div><div class="label">${label}</div><div class="phrase">${phrase}</div>`;b.onclick=()=>speak(phrase);g.appendChild(b)})}
function initBreathing(){ $('#breathingBtn').onclick=()=>{clearInterval(breathingTimer);let left=30, big=false;speak('Respiremos juntos');breathingTimer=setInterval(()=>{left-=4;big=!big;$('#breathingCircle').classList.toggle('expand',big);$('#breathingCircle').textContent=big?'Inhala':'Exhala';if(left<=0){clearInterval(breathingTimer);$('#breathingCircle').classList.remove('expand');$('#breathingCircle').textContent='Muy bien';characterSpeak('Muy bien, lo hiciste excelente.')}},4000)} }
const canvas=$('#paintCanvas'), ctx=canvas.getContext('2d');let painting=false, eraser=false, template='pup';
function pos(e){const r=canvas.getBoundingClientRect(),p=e.touches?e.touches[0]:e;return{x:(p.clientX-r.left)*canvas.width/r.width,y:(p.clientY-r.top)*canvas.height/r.height}}
function drawTemplate(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.lineWidth=7;ctx.strokeStyle='#20314a';ctx.lineCap='round';ctx.lineJoin='round';if(template==='pup'){ctx.strokeRect(345,285,310,210);ctx.beginPath();ctx.arc(500,215,112,0,Math.PI*2);ctx.stroke();ctx.strokeRect(410,88,62,90);ctx.strokeRect(530,88,62,90);ctx.beginPath();ctx.arc(455,210,12,0,7);ctx.arc(545,210,12,0,7);ctx.stroke();ctx.strokeRect(455,265,92,42);ctx.strokeRect(370,495,60,85);ctx.strokeRect(570,495,60,85)}else if(template==='truck'){ctx.strokeRect(180,285,420,175);ctx.strokeRect(600,345,170,115);ctx.beginPath();ctx.arc(305,480,50,0,7);ctx.arc(660,480,50,0,7);ctx.stroke();ctx.strokeRect(640,365,70,48);ctx.strokeRect(250,220,210,70)}else{ctx.beginPath();for(let i=0;i<5;i++){let a=(-90+i*72)*Math.PI/180;let x=500+180*Math.cos(a),y=305+180*Math.sin(a);i?ctx.lineTo(x,y):ctx.moveTo(x,y);a+=36*Math.PI/180;ctx.lineTo(500+78*Math.cos(a),305+78*Math.sin(a))}ctx.closePath();ctx.stroke();}}
function initPaint(){ $$('.templateBtn').forEach(b=>b.onclick=()=>{template=b.dataset.template;drawTemplate()});$('#eraserBtn').onclick=()=>{eraser=!eraser;toast(eraser?'Borrador activo':'Pincel activo')};$('#clearCanvasBtn').onclick=drawTemplate;['mousedown','touchstart'].forEach(ev=>canvas.addEventListener(ev,e=>{painting=true;let p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y)}));['mousemove','touchmove'].forEach(ev=>canvas.addEventListener(ev,e=>{if(!painting)return;e.preventDefault();let p=pos(e);ctx.lineWidth=+$('#brushSize').value;ctx.strokeStyle=eraser?'#fff':$('#paintColor').value;ctx.lineTo(p.x,p.y);ctx.stroke()}));['mouseup','mouseleave','touchend'].forEach(ev=>canvas.addEventListener(ev,()=>painting=false));drawTemplate();}
function art(k){return {pup:'🐶🚧',truck:'🚚😊',heart:'❤️👨‍👩‍👦'}[k]||'🐶'}
function newPuzzle(){let n=+$('#pieceCount').value,k=$('#puzzleKind').value,dz=$('#dropZone'),pz=$('#piecesZone');dz.innerHTML='';pz.innerHTML='';$('#puzzleStatus').textContent='';for(let i=0;i<n;i++){let s=document.createElement('div');s.className='drop-slot';s.dataset.index=i;s.textContent=i+1;s.ondragover=e=>e.preventDefault();s.ondrop=e=>{let id=e.dataTransfer.getData('text'),piece=document.getElementById(id);if(piece.dataset.index===s.dataset.index){s.textContent='';s.appendChild(piece);s.classList.add('slot-ok');if($$('#dropZone .piece').length===n){$('#puzzleStatus').textContent='¡Rompecabezas completo!';if(data.settings.celebrate)characterSpeak('Muy bien, lo lograste.')}}else toast('Intenta otra vez')};dz.appendChild(s)}[...Array(n).keys()].sort(()=>Math.random()-.5).forEach(i=>{let p=document.createElement('div');p.id='piece'+Date.now()+i;p.className='piece';p.draggable=true;p.dataset.index=i;p.textContent=`${art(k)} ${i+1}`;p.ondragstart=e=>e.dataTransfer.setData('text',p.id);pz.appendChild(p)})}
function initGames(){ $$('.game-tab').forEach(b=>b.onclick=()=>{$$('.game-tab').forEach(x=>x.className='btn light game-tab');b.className='btn primary game-tab';currentGame=b.dataset.game;$$('.game-panel').forEach(x=>x.classList.remove('active-game'));$('#'+currentGame+'Game').classList.add('active-game');if(currentGame==='coloring')setTimeout(drawTemplate,80)});$('#newPuzzleBtn').onclick=newPuzzle;$('#newMatchBtn').onclick=newMatch;newPuzzle();newMatch();}
function newMatch(){const pairs=[['💧','Agua'],['🍽️','Comer'],['🧸','Jugar'],['🆘','Ayuda']].sort(()=>Math.random()-.5).slice(0,3);let cards=[];pairs.forEach(([e,w])=>{cards.push({type:'e',val:e,key:w});cards.push({type:'w',val:w,key:w})});cards.sort(()=>Math.random()-.5);let g=$('#matchGrid');g.innerHTML='';let selected=[];cards.forEach((c,i)=>{let b=document.createElement('button');b.className='match-card';b.textContent=c.val;b.dataset.key=c.key;b.onclick=()=>{if(b.classList.contains('done'))return;b.classList.add('selected');selected.push(b);if(selected.length===2){if(selected[0].dataset.key===selected[1].dataset.key&&selected[0]!==selected[1]){selected.forEach(x=>{x.classList.remove('selected');x.classList.add('done')});speak(selected[0].dataset.key);if($$('#matchGrid .done').length===cards.length)characterSpeak('Excelente, encontraste las parejas.')}else setTimeout(()=>selected.forEach(x=>x.classList.remove('selected')),500);selected=[]}};g.appendChild(b)})}

function youtubeEmbed(url){
  if(!url)return '';
  let id='';
  try{
    const u=new URL(url);
    if(u.hostname.includes('youtu.be')) id=u.pathname.replace('/','');
    else if(u.searchParams.get('v')) id=u.searchParams.get('v');
    else if(u.pathname.includes('/embed/')) id=u.pathname.split('/embed/')[1].split(/[?&]/)[0];
    else if(u.pathname.includes('/shorts/')) id=u.pathname.split('/shorts/')[1].split(/[?&]/)[0];
  }catch{ id=url.trim(); }
  id=(id||'').replace(/[^a-zA-Z0-9_-]/g,'');
  return id?`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`:'';
}
function renderVideoCategories(){
  if(!data.videos)data.videos={'Canciones':[]};
  if(!currentVideoCategory||!data.videos[currentVideoCategory])currentVideoCategory=Object.keys(data.videos)[0];
  const bar=$('#videoCategoryBar'); if(!bar)return; bar.innerHTML='';
  Object.keys(data.videos).forEach(c=>{const b=document.createElement('button');b.className='chip '+(c===currentVideoCategory?'active':'');b.textContent=c;b.onclick=()=>{currentVideoCategory=c;renderVideoCategories();renderVideos()};bar.appendChild(b)});
}
function renderVideos(){
  const g=$('#videoGrid'); if(!g)return; g.innerHTML='';
  const list=(data.videos&&data.videos[currentVideoCategory])||[];
  if(!list.length){g.innerHTML='<div class="panel">Agrega videos desde Ajustes.</div>';return;}
  list.forEach((v,i)=>{const b=document.createElement('button');b.className='video-card';b.innerHTML=`<div class="emoji">${v.emoji||'📺'}</div><div class="label">${v.title}</div><div class="source">${v.file?'Video local':(v.url?'YouTube curado':'Pendiente')}</div><button class="mini-delete" data-i="${i}">Eliminar</button>`;b.onclick=e=>{if(e.target.matches('.mini-delete')){data.videos[currentVideoCategory].splice(i,1);save();renderVideos();return}playVideo(v)};g.appendChild(b)});
}
function playVideo(v){
  const p=$('#videoPlayer'); if(!p)return;
  recordUse('Video: '+v.title);
  if(v.file){p.innerHTML=`<video class="local-video" controls autoplay playsinline src="${v.file}"></video>`;return;}
  const embed=youtubeEmbed(v.url||'');
  if(embed){p.innerHTML=`<iframe class="video-frame" src="${embed}" title="${v.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;return;}
  p.innerHTML=`<div class="big-icon">${v.emoji||'📺'}</div><h3>${v.title}</h3><p>Este video aún no tiene enlace o archivo. Puedes editar/agregar otro desde Ajustes.</p>`;
  characterSpeak('Elige otro video.');
}
function stopVideo(){const p=$('#videoPlayer'); if(p)p.innerHTML='<div class="big-icon">📺</div><h3>Video detenido</h3><p>Selecciona otro video cuando quieras.</p>';}
function initVideos(){renderVideoCategories();renderVideos();$('#stopVideoBtn').onclick=stopVideo;$('#videoPraiseBtn').onclick=()=>characterSpeak('Muy bien, elegiste un video.');}

function renderStats(){let entries=Object.entries(data.stats).sort((a,b)=>b[1]-a[1]);let g=$('#statsList');g.innerHTML=entries.length?'':'<div class="panel">Aún no hay historial.</div>';let max=Math.max(1,...entries.map(x=>x[1]));entries.forEach(([k,v])=>{let r=document.createElement('div');r.className='stat-row';r.innerHTML=`<b>${k}</b> — ${v} veces<div class="bar"><span style="width:${(v/max)*100}%"></span></div>`;g.appendChild(r)})}
function initSettings(){function loadVoices(){voices=speechSynthesis.getVoices().filter(v=>v.lang.startsWith('es')||v.lang.startsWith('en'));let sel=$('#voiceSelect');sel.innerHTML='';voices.forEach((v,i)=>{let o=document.createElement('option');o.value=i;o.textContent=`${v.name} (${v.lang})`;sel.appendChild(o)});sel.value=data.settings.voiceIndex||0} if('speechSynthesis'in window){loadVoices();speechSynthesis.onvoiceschanged=loadVoices} $('#voiceSelect').onchange=e=>{data.settings.voiceIndex=+e.target.value;save()};$('#rateRange').value=data.settings.rate;$('#pitchRange').value=data.settings.pitch;$('#useRecordedToggle').checked=data.settings.useRecorded;$('#celebrateToggle').checked=data.settings.celebrate;$('#rateRange').oninput=e=>{data.settings.rate=+e.target.value;save()};$('#pitchRange').oninput=e=>{data.settings.pitch=+e.target.value;save()};$('#useRecordedToggle').onchange=e=>{data.settings.useRecorded=e.target.checked;save()};$('#celebrateToggle').onchange=e=>{data.settings.celebrate=e.target.checked;save()};renderCharVoiceSettings();$('#wordForm').onsubmit=async e=>{e.preventDefault();let cat=$('#wordCategory').value.trim(),label=$('#wordLabel').value.trim(),phrase=$('#wordPhrase').value.trim(),emoji=$('#wordEmoji').value.trim();let audio=$('#wordAudio').files[0]?await fileToDataURL($('#wordAudio').files[0]):'';if(!data.categories[cat])data.categories[cat]=[];data.categories[cat].push({label,phrase,emoji,audio});save();currentCategory=cat;e.target.reset();renderCategories();renderTalk();toast('Tarjeta agregada')};
$('#videoForm').onsubmit=async e=>{
  e.preventDefault();
  let cat=$('#videoCategory').value.trim(), title=$('#videoTitle').value.trim(), emoji=$('#videoEmoji').value.trim(), url=$('#videoUrl').value.trim();
  let file=$('#videoFile').files[0]?await fileToDataURL($('#videoFile').files[0]):'';
  if(!data.videos)data.videos={}; if(!data.videos[cat])data.videos[cat]=[];
  data.videos[cat].push({title,emoji,url,file,source:file?'local':'youtube'});
  save(); currentVideoCategory=cat; e.target.reset(); renderVideoCategories(); renderVideos(); toast('Video agregado');
};
$('#exportBtn').onclick=()=>{let blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='mi-voz-v2-datos.json';a.click()};$('#importBtn').onclick=()=>$('#importFile').click();$('#importFile').onchange=async e=>{let f=e.target.files[0];if(!f)return;let txt=await f.text();data=Object.assign(clone(DEFAULT_DATA),JSON.parse(txt));save();location.reload()};$('#resetAllBtn').onclick=()=>{if(confirm('¿Restaurar todos los datos?')){localStorage.removeItem(STORE_KEY);location.reload()}};$('#clearStatsBtn').onclick=()=>{data.stats={};save();renderStats()};}
function renderCharVoiceSettings(){let box=$('#characterVoiceSettings');box.innerHTML='';Object.values(data.characters).forEach(c=>{let row=document.createElement('div');row.className='char-voice-row';row.innerHTML=`<b>${c.emoji} ${c.name}</b><input type="file" accept="audio/*" data-char="${c.id}"><button class="btn light" data-test="${c.id}">Probar</button>`;box.appendChild(row)});box.querySelectorAll('input[type=file]').forEach(inp=>inp.onchange=async e=>{let f=e.target.files[0];if(!f)return;data.characters[inp.dataset.char].voiceAudio=await fileToDataURL(f);save();toast('Voz guardada')});box.querySelectorAll('[data-test]').forEach(b=>b.onclick=()=>{data.activeCharacter=b.dataset.test;save();updateHero();renderCharacters();characterSpeak(data.characters[b.dataset.test].welcome)})}
let deferredPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#installBtn').classList.remove('hidden')});$('#installBtn').onclick=()=>deferredPrompt?.prompt(); if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js');
initNav();renderCharacters();updateHero();renderCategories();renderTalk();initQuick();initFamily();renderFamily();initRoutines();renderCalm();initBreathing();initVideos();initPaint();initGames();initSettings();renderStats();
