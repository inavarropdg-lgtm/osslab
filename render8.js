/* ================= v13 · Comunidad: The Stage + Voting Session + Tatami Karma =================
Datos (S.social, guardado con save(); misma forma que tendría el backend):
  clips: [{id, techId, url, platform, vid, belt, author, mine, at}]
  votes: {clipId: [{by, stars, chips:[], comment, at}]}   (solo votos de este usuario; los de ejemplo viven en SEED)
  karma: número · log: [{t, pts, at, ref}] */
const BELTS5={blanco:{es:'Blanco',en:'White'},azul:{es:'Azul',en:'Blue'},morado:{es:'Morado',en:'Purple'},marron:{es:'Marrón',en:'Brown'},negro:{es:'Negro',en:'Black'}};
const STARL={1:{es:'Falta control',en:'Needs control'},2:{es:'Falta control',en:'Needs control'},3:{es:'Mecánica base',en:'Base mechanics'},4:{es:'Lista para spar',en:'Ready for sparring'},5:{es:'Nivel competición',en:'Competition level'}};
const FBCHIPS=[{k:'cadera',e:'👍',l:{es:'Buen control de cadera',en:'Good hip control'}},{k:'codos',e:'⚠️',l:{es:'Cierra más los codos',en:'Keep elbows tighter'}},{k:'trans',e:'⚡',l:{es:'Buena transición',en:'Good transition'}},{k:'lento',e:'🐢',l:{es:'Hazlo más despacio',en:'Slow it down'}}];
const KARMA={upload:10,vote:20};
/* ---------- URL parsing / validation ---------- */
function parseClip(raw){const u=(raw||'').trim();if(!u)return {ok:false,msg:''};
let m;
if((m=/^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/i.exec(u)))return {ok:true,platform:'youtube',vid:m[1],url:'https://www.youtube.com/watch?v='+m[1]};
if((m=/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:reel|reels|p)\/([\w-]{5,})/i.exec(u)))return {ok:true,platform:'instagram',vid:m[1],url:'https://www.instagram.com/reel/'+m[1]+'/'};
if((m=/^(?:https?:\/\/)?(?:www\.|m\.)?tiktok\.com\/@([\w.-]+)\/video\/(\d{8,})/i.exec(u)))return {ok:true,platform:'tiktok',vid:m[2],url:'https://www.tiktok.com/@'+m[1]+'/video/'+m[2]};
if(/(?:vm|vt)\.tiktok\.com\//i.test(u))return {ok:false,msg:L('Los enlaces cortos de TikTok no se pueden leer. Abre el vídeo y copia el enlace completo (tiktok.com/@usuario/video/…).','Short TikTok links cannot be read. Open the video and copy the full link (tiktok.com/@user/video/…).')};
if(/instagram\.com\/stories/i.test(u))return {ok:false,msg:L('Las historias caducan. Sube la ejecución como Reel y pega su enlace.','Stories expire. Post the execution as a Reel and paste its link.')};
return {ok:false,msg:L('Pega un enlace de YouTube (oculto vale), un Reel de Instagram o un vídeo de TikTok.','Paste a YouTube link (unlisted is fine), an Instagram Reel or a TikTok video.')}}
const PLAT={youtube:'YouTube',instagram:'Instagram',tiktok:'TikTok',local:'Vídeo'};
function clipEmbedSrc(c){return c.platform==='youtube'?`https://www.youtube-nocookie.com/embed/${c.vid}?rel=0&modestbranding=1&playsinline=1`:c.platform==='instagram'?`https://www.instagram.com/reel/${c.vid}/embed`:`https://www.tiktok.com/embed/v2/${c.vid}`}
function clipPlayer(c){if(c.platform==='local')return `<div class="cvid tall lvw"><video class="lvid" data-lid="${esc(c.vid)}" controls playsinline preload="metadata"></video><p class="lvn">${L('Guardado solo en este dispositivo.','Stored on this device only.')}</p></div>`;const tall=c.platform!=='youtube';
if(CAN_EMBED)return `<div class="cvid${tall?' tall':''}"><iframe src="${clipEmbedSrc(c)}" title="${esc(c.author)} · ${esc(PLAT[c.platform])}" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
return `<div class="cvid cvph"><span class="tplay">${ic('Play')}</span><p class="tvt">${esc(PLAT[c.platform])} · ${esc(c.author)}</p><p class="tvn">${L('Vista previa: el clip se incrusta en la app instalada. Aquí ábrelo aparte:','Preview: the clip is embedded in the installed app. Open it separately here:')} <a href="${esc(c.url)}" target="_blank" rel="noopener">${L('ver clip','watch clip')} ${ic('ExternalLink')}</a></p></div>`}
/* ---------- seed: ejecuciones de ejemplo ---------- */
const SEED=[
{id:'seed-1',techId:'upa',platform:'youtube',vid:'UyxNPnR24hE',belt:'blanco',author:'Laura M.',at:'2026-11-20',votes:[{by:'s1',stars:3,chips:['cadera']},{by:'s2',stars:4,chips:['trans']},{by:'s3',stars:3,chips:['codos']}]},
{id:'seed-2',techId:'escape-montada-codo-rodilla',platform:'youtube',vid:'RvVX2kSTd8g',belt:'azul',author:'Dani R.',at:'2026-11-21',votes:[{by:'s1',stars:4,chips:['cadera']},{by:'s4',stars:4,chips:['cadera','trans']}]},
{id:'seed-3',techId:'tijera-guardia-cerrada',platform:'youtube',vid:'63LRiI9Qn2o',belt:'blanco',author:'Pablo G.',at:'2026-11-21',votes:[{by:'s2',stars:2,chips:['lento']},{by:'s5',stars:3,chips:['codos']}]},
{id:'seed-4',techId:'pase-toreando',platform:'youtube',vid:'_FrzbP9-5UA',belt:'morado',author:'Irene S.',at:'2026-11-22',votes:[{by:'s3',stars:5,chips:['trans']},{by:'s6',stars:4,chips:['trans']},{by:'s1',stars:5,chips:['cadera']}]},
{id:'seed-5',techId:'triangulo',platform:'youtube',vid:'k54daRsX3co',belt:'azul',author:'Marcos T.',at:'2026-11-22',votes:[{by:'s4',stars:3,chips:['codos']}]},
{id:'seed-6',techId:'mata-leon',platform:'youtube',vid:'T6KFE37K07s',belt:'azul',author:'Sergio P.',at:'2026-11-23',votes:[]},
{id:'seed-7',techId:'gamba',platform:'youtube',vid:'3hROB_XHTRo',belt:'blanco',author:'Ana L.',at:'2026-11-23',votes:[{by:'s5',stars:4,chips:['cadera']}]},
{id:'seed-8',techId:'retencion-guardia',platform:'youtube',vid:'QeIsRLfPtBM',belt:'morado',author:'Javi C.',at:'2026-11-24',votes:[]}
].map(c=>Object.assign(c,{url:'https://www.youtube.com/watch?v='+c.vid,seed:true}));
function soc(){if(!S.social)S.social={clips:[],votes:{},karma:0,log:[]};const s=S.social;s.clips=s.clips||[];s.votes=s.votes||{};s.log=s.log||[];s.karma=s.karma||0;return s}
function allClips(){return SEED.concat(soc().clips)}
function clipById(id){return allClips().find(c=>c.id===id)}
function votesOf(c){return (c.votes||[]).concat(soc().votes[c.id]||[])}
function myVote(c){return (soc().votes[c.id]||[])[0]||null}
function clipsFor(techId){return allClips().filter(c=>c.techId===techId).sort((a,b)=>(b.at>a.at?1:-1))}
function clipStats(c){const v=votesOf(c),n=v.length;let sw=0,ws=0;const ch={};for(const x of v){const w=x.coach?COACH_W:1;sw+=w;ws+=x.stars*w;for(const k of x.chips||[])ch[k]=(ch[k]||0)+1}return {n,avg:sw?ws/sw:0,ch,coach:v.some(x=>x.coach)}}
function pendingClips(){return allClips().filter(c=>!c.mine&&!myVote(c)).sort((a,b)=>votesOf(a).length-votesOf(b).length)}
function addKarma(t,pts,ref){const s=soc();s.karma+=pts;s.log.unshift({t,pts,ref,at:new Date().toISOString()});s.log=s.log.slice(0,50)}
function starsRO(avg){return `<span class="srow" aria-label="${avg.toFixed(1)} / 5">${[1,2,3,4,5].map(i=>`<i class="${avg>=i-.25?'on':avg>=i-.75?'half':''}">★</i>`).join('')}</span>`}
function fmtAvg(x){return x.toFixed(1).replace('.',S.lang==='en'?'.':',')}
/* ---------- rating panel (shared by card and Voting Session) ---------- */
function ratePanel(c,mode){const d=S.rate&&S.rate.id===c.id?S.rate:{id:c.id,stars:0,chips:[],comment:''};const st=d.stars;
return `<div class="rate" data-clip="${c.id}"><div class="rstars" role="radiogroup" aria-label="${L('Puntuación','Rating')}">${[1,2,3,4,5].map(i=>`<button role="radio" aria-checked="${st===i}" data-act="rate-star" data-v="${i}" data-c="${c.id}" class="${st>=i?'on':''}" aria-label="${i} · ${esc(T(STARL[i]))}">★</button>`).join('')}</div>
<p class="rlabel">${st?`<b>${st}/5</b> · ${esc(T(STARL[st]))}`:L('Toca de 1 a 5 · 1-2 Falta control · 3 Mecánica base · 4 Lista para spar · 5 Nivel competición','Tap 1 to 5 · 1-2 Needs control · 3 Base mechanics · 4 Ready for sparring · 5 Competition level')}</p>
<div class="fchips">${FBCHIPS.map(f=>`<button data-act="${mode==='vs'?'vs-chip':'rate-chip'}" data-v="${f.k}" data-c="${c.id}" aria-pressed="${d.chips.includes(f.k)}"${mode==='vs'&&!st?' disabled':''}>${f.e} ${esc(T(f.l))}</button>`).join('')}</div>
${mode==='vs'?`<div class="vsact"><button class="link" data-act="vs-skip">${L('Saltar','Skip')}</button>${st?`<button class="link" data-act="vs-send">${L('Enviar sin chip','Send without chip')} ›</button>`:''}</div>`:`<label class="rcom"><span class="sr">${L('Comentario corto (opcional)','Short comment (optional)')}</span><input id="rate-com" maxlength="140" placeholder="${L('Comentario corto (opcional, 140)','Short comment (optional, 140)')}" value="${esc(d.comment||'')}"></label>
<div class="ksa"><button class="link" data-act="rate-cancel">${L('Cancelar','Cancel')}</button><button class="cta sm" data-act="rate-send" data-v="${c.id}"${st?'':' disabled'}>${L(`Enviar valoración · +${KARMA.vote}`,`Send rating · +${KARMA.vote}`)}</button></div>`}</div>`}
function clipCard(c){const s=clipStats(c),mv=myVote(c),open=S.rate&&S.rate.id===c.id&&S.rate.open;
return `<article class="clip" id="clip-${c.id}">${c.ch&&c.ch===challenge().id?`<p class="chtag">${ic('Flag')} ${L('Participa en el reto de la semana','Weekly challenge entry')}</p>`:''}${clipPlayer(c)}${coachBlock(c)}
<div class="ch"><span class="ava sm"><b>${esc(c.author[0])}</b></span><div class="chb"><p class="cht">${esc(c.author)}${c.mine?` <span class="pill">${L('Tú','You')}</span>`:''}${c.seed?` <span class="pill">${L('Ejemplo','Sample')}</span>`:''}</p><p class="chs">${c.belt?`<i class="bd l-${c.belt}"></i>${esc(T(BELTS5[c.belt]))} · `:''}${esc(PLAT[c.platform])} · ${fmtS(new Date(c.at))}</p></div>
<div class="cstat">${s.n?`${starsRO(s.avg)}<span class="cnum"><b>${fmtAvg(s.avg)}</b> · ${s.n} ${s.n===1?L('valoración','rating'):L('valoraciones','ratings')}</span>`:`<span class="cnum">${L('Sin valoraciones aún','No ratings yet')}</span>`}</div></div>
${Object.keys(s.ch).length?`<div class="ctally">${FBCHIPS.filter(f=>s.ch[f.k]).map(f=>`<span class="pill">${f.e} ${esc(T(f.l))} · ${s.ch[f.k]}</span>`).join('')}</div>`:''}
${votesOf(c).filter(v=>v.comment&&!v.coach).slice(-2).map(v=>`<p class="ccom">«${esc(cmt(v))}»</p>`).join('')}
${c.mine?`<div class="cfoot"><span class="pr-s">${L('Tu ejecución. La comunidad te dejará su valoración aquí.','Your execution. The community will rate it here.')}</span><button class="link danger" data-act="clip-del" data-v="${c.id}">${L('Eliminar','Delete')}</button></div>${reviewBlock(c)}`
:mv?`<p class="cmine">${ic('Check')} ${L('Tu valoración','Your rating')}: ${mv.stars}/5 · ${esc(T(STARL[mv.stars]))}${mv.chips.length?' · '+mv.chips.map(k=>FBCHIPS.find(f=>f.k===k).e).join(' '):''}</p>`
:open?ratePanel(c,'card'):`<button class="cta ghost sm" data-act="rate-open" data-v="${c.id}">${ic('Star')} ${L(`Valorar · +${KARMA.vote} karma`,`Rate · +${KARMA.vote} karma`)}</button>`}
</article>`}
function communityPane(t){const cs=clipsFor(t.id),d=S.socDraft&&S.socDraft.t===t.id?S.socDraft:{t:t.id,url:'',belt:null},p=parseClip(d.url);
return `${challengeCard(true)}${S.socDraft&&S.socDraft.ch&&S.socDraft.t===t.id?`<p class="chtag">${ic('Flag')} ${L('Tu ejecución entrará en el reto de la semana','Your execution will enter the weekly challenge')}</p>`:''}<section class="pr-card up"><p class="pr-t2">${L('Sube tu ejecución','Upload your execution')}</p><p class="pr-s">${L('Máximo 30 segundos: solo la técnica, sin el roll entero.','30 seconds max: just the technique, not the whole roll.')}</p>
<label class="cta ghost upfile">${ic('Camera')} ${d.local?L('Cambiar vídeo','Change video'):L('Grabar o elegir vídeo','Record or choose a video')}<input id="soc-file" type="file" accept="video/*" capture="environment" hidden></label>
<p class="upmsg ${d.local?'ok':d.fileErr?'bad':''}" id="soc-fmsg">${d.local?`${ic('Check')} ${L('Vídeo listo','Video ready')} · ${d.local.dur} s`:esc(d.fileErr||'')}</p>
<p class="pr-s uor">${L('o pega un enlace (YouTube oculto, Reel de Instagram o TikTok):','or paste a link (unlisted YouTube, Instagram Reel or TikTok):')}</p>
<label class="upurl"><span class="sr">URL</span><input id="soc-url" inputmode="url" autocomplete="off" placeholder="https://youtu.be/…" value="${esc(d.url)}"></label>
<p class="upmsg ${p.ok?'ok':d.url?'bad':''}" id="soc-msg">${p.ok?`${ic('Check')} ${PLAT[p.platform]} ${L('detectado','detected')}`:esc(p.msg||'')}</p>
<p class="pr-s" style="margin-top:10px">${L('Tu cinturón (opcional)','Your belt (optional)')}</p>
<div class="beltpick" role="group">${Object.entries(BELTS5).map(([k,v])=>`<button data-act="soc-belt" data-v="${k}" aria-pressed="${d.belt===k}"><i class="bd l-${k}"></i>${esc(T(v))}</button>`).join('')}</div>
<label class="tog upcons"><input type="checkbox" data-act="soc-cons" ${d.consent?'checked':''}><span>${L('Si sale mi compañero, sabe que lo publico y está de acuerdo.','If my partner appears, they know I am posting it and agree.')}</span></label>
<button class="cta" data-act="soc-pub" id="soc-pub"${(p.ok||d.local)&&d.consent?'':' disabled'} style="margin-top:12px">${L(`Publicar ejecución · +${KARMA.upload} karma`,`Publish execution · +${KARMA.upload} karma`)}</button></section>
<p class="pg-h">${L('Ejecuciones de la comunidad','Community executions')} · ${cs.length}</p>
${cs.length?cs.map(clipCard).join(''):`<p class="pr-s">${L('Todavía nadie ha subido esta técnica. Sé el primero y gana karma.','Nobody has uploaded this technique yet. Be the first and earn karma.')}</p>`}`}
/* ---------- Voting Session ---------- */
const VS_SECS=60;let vsTimer=null;
function vsStart(){const q=pendingClips().map(c=>c.id);S.vs={q,i:0,end:Date.now()+VS_SECS*1000,n:0,pts:0,done:false};S.rate={id:q[0],stars:0,chips:[],comment:''};vsTick();}
function vsTick(){clearInterval(vsTimer);vsTimer=setInterval(()=>{if(!S.vs||S.vs.done){clearInterval(vsTimer);return}const left=Math.max(0,S.vs.end-Date.now());const bar=document.getElementById('vs-bar'),lab=document.getElementById('vs-left');if(bar)bar.style.width=(left/(VS_SECS*10))+'%';if(lab)lab.textContent=Math.ceil(left/1000)+' s';if(left<=0){S.vs.done=true;clearInterval(vsTimer);save();render()}},250)}
function vsNext(){const v=S.vs;v.i++;if(v.i>=v.q.length){v.done=true;clearInterval(vsTimer)}else S.rate={id:v.q[v.i],stars:0,chips:[],comment:''};save();render();window.scrollTo(0,0)}
function vsView(){const v=S.vs;
if(v.done||!v.q.length){return `<div class="pad vsend"><button class="link tback" data-act="vs-close">${ic('ArrowLeft')} ${L('Técnica','Technique')}</button>
<div class="vsdone"><span class="pic t-orange">${ic('Star')}</span><h1 class="display sm">${v.q.length?L('Sesión terminada','Session finished'):L('Nada pendiente','Nothing pending')}</h1>
<p class="pr-s">${v.q.length?L(`Has valorado ${v.n} ${v.n===1?'clip':'clips'} y ganado ${v.pts} puntos de karma.`,`You rated ${v.n} ${v.n===1?'clip':'clips'} and earned ${v.pts} karma points.`):L('Ya has valorado todas las ejecuciones de la comunidad. Vuelve más tarde.','You have rated every community execution. Come back later.')}</p>
<p class="vsk">${ic('Zap')} ${soc().karma} <small>Tatami Karma</small></p>
${pendingClips().length?`<button class="cta" data-act="vs-start">${L('Otra sesión de 60 s','Another 60 s session')}</button>`:''}<button class="cta ghost" data-act="vs-close" style="margin-top:8px">${L('Volver a Técnica','Back to Technique')}</button></div></div>`}
const c=clipById(v.q[v.i]),t=techById(c.techId),left=Math.max(0,v.end-Date.now());
return `<div class="pad vs"><div class="vstop"><button class="link" data-act="vs-close">${ic('ArrowLeft')} ${L('Salir','Exit')}</button><span class="pill">${v.i+1}/${v.q.length}</span><span class="vsl" id="vs-left">${Math.ceil(left/1000)} s</span></div>
<div class="vstrack"><i id="vs-bar" style="width:${left/(VS_SECS*10)}%"></i></div>
<p class="tcat">${esc(T(TCAT[t.cat]))} · ${esc(T(t.n))}</p>
${clipPlayer(c)}
<p class="chs">${esc(c.author)}${c.belt?` · <i class="bd l-${c.belt}"></i>${esc(T(BELTS5[c.belt]))}`:''}</p>
<details class="vskeys"><summary>${L('Puntos clave para valorar','Key points to judge')}</summary><ol>${(S.lang==='en'&&t.k.en?t.k.en:t.k.es).map(x=>`<li>${esc(x)}</li>`).join('')}</ol></details>
${ratePanel(c,'vs')}
<p class="pr-s vshint">${L('Elige estrellas y toca un chip: pasa solo al siguiente. +20 por voto.','Pick stars and tap a chip: it moves on by itself. +20 per vote.')}</p></div>`}
/* ---------- karma sheet ---------- */
function karmaBadge(){return `<button class="kbadge" data-act="karma-open" aria-label="Karma ${soc().karma}">${ic('Zap')}<b>${soc().karma}</b></button>`}
function karmaSheet(){const s=soc();const lab={upload:L('Subiste una ejecución','You uploaded an execution'),vote:L('Valoraste a otro atleta','You rated another athlete'),del:L('Eliminaste una ejecución','You deleted an execution')};
return `<div class="modal" role="dialog" aria-modal="true" aria-label="Karma"><button class="mbg" data-act="karma-close" aria-label="${L('Cerrar','Close')}"></button><div class="sheet ksheet"><p class="vsk">${ic('Zap')} ${s.karma} <small>Tatami Karma</small></p>
<p class="pr-s">${L(`+${KARMA.upload} por subir una ejecución · +${KARMA.vote} por valorar a otro atleta. Ayudar vale el doble que subir.`,`+${KARMA.upload} for uploading an execution · +${KARMA.vote} for rating another athlete. Helping is worth twice uploading.`)}</p>
<p class="pg-h">${L('Actividad','Activity')}</p>${s.log.length?`<div class="pgroup">${s.log.slice(0,12).map(x=>`<div class="klog"><span>${esc(lab[x.t]||x.t)}${x.ref&&techById(x.ref)?` · ${esc(T(techById(x.ref).n))}`:''}</span><b class="${x.pts<0?'neg':''}">${x.pts>0?'+':''}${x.pts}</b></div>`).join('')}</div>`:`<p class="pr-s">${L('Aún no tienes puntos. Abre «Valorar clips» y valora tu primer clip.','No points yet. Open “Rate clips” and rate your first clip.')}</p>`}
<button class="cta" data-act="karma-vs" style="margin-top:14px">${L('Valorar clips (60 s)','Rate clips (60 s)')}</button><button class="cta ghost" data-act="karma-close" style="margin-top:8px">${L('Cerrar','Close')}</button></div></div>`}
/* ---------- actions ---------- */
function socAct(t,act,v){const rr=()=>{save();render();return true},s=soc();
switch(act){
case 'tec-pane':S.tecPane=v;S.rate=null;return rr();
case 'soc-belt':{const d=S.socDraft&&S.socDraft.t===S.tecOpen?S.socDraft:{t:S.tecOpen,url:'',belt:null};d.belt=d.belt===v?null:v;S.socDraft=d;return rr()}
case 'soc-pub':{const d=S.socDraft;if(!d||!d.consent)return true;const p=d.local?{ok:true,platform:'local',vid:d.local.id,url:''}:parseClip(d.url);if(!p.ok)return true;
 const dup=allClips().find(c=>c.techId===d.t&&c.vid===p.vid);if(dup){const m=document.getElementById('soc-msg');if(m){m.className='upmsg bad';m.textContent=L('Ese vídeo ya está publicado en esta técnica.','That video is already posted on this technique.')}return true}
 const id='me-'+Date.now().toString(36);s.clips.push({id,techId:d.t,url:p.url,platform:p.platform,vid:p.vid,belt:d.belt||null,author:L('Tú','You'),mine:true,at:iso(today()),ch:d.ch&&d.ch===challenge().id&&d.t===challenge().techId?d.ch:null});addKarma('upload',KARMA.upload,d.t);S.socDraft=null;save();render();const el=document.getElementById('clip-'+id);if(el&&el.scrollIntoView)el.scrollIntoView({block:'center'});return true}
case 'clip-del':{const i=s.clips.findIndex(c=>c.id===v&&c.mine);if(i>=0){const c=s.clips[i];if(c.platform==='local')idbDel(c.vid);s.clips.splice(i,1);delete s.votes[v];addKarma('del',-KARMA.upload,c.techId)}return rr()}
case 'rate-open':S.rate={id:v,stars:0,chips:[],comment:'',open:true};return rr();
case 'rate-cancel':S.rate=null;return rr();
case 'rate-star':{const c=t.dataset.c;if(!S.rate||S.rate.id!==c)S.rate={id:c,stars:0,chips:[],comment:'',open:true};S.rate.stars=+v;return rr()}
case 'rate-chip':{const r=S.rate;if(!r)return true;const k=r.chips.indexOf(v);if(k>=0)r.chips.splice(k,1);else r.chips.push(v);return rr()}
case 'rate-send':{const r=S.rate,c=clipById(v);if(!r||!r.stars||!c||c.mine||myVote(c))return true;const com=document.getElementById('rate-com');r.comment=(com&&com.value||r.comment||'').trim().slice(0,140);
 s.votes[c.id]=[Object.assign({by:'me',stars:r.stars,chips:r.chips.slice(),comment:r.comment,at:new Date().toISOString()},prof().isSuperCoach?{coach:true}:{})];addKarma('vote',KARMA.vote,c.techId);S.rate=null;return rr()}
case 'vs-start':S.tab='tec';S.tecOpen=null;S.play=null;S.karmaOpen=false;vsStart();save();render();window.scrollTo(0,0);return true;
case 'karma-vs':S.karmaOpen=false;S.tab='tec';S.tecOpen=null;vsStart();save();render();window.scrollTo(0,0);return true;
case 'vs-close':clearInterval(vsTimer);S.vs=null;S.rate=null;return rr();
case 'vs-skip':vsNext();return true;
case 'vs-chip':case 'vs-send':{const r=S.rate,c=r&&clipById(r.id);if(!r||!r.stars||!c)return true;const chips=act==='vs-chip'?[v]:[];
 s.votes[c.id]=[Object.assign({by:'me',stars:r.stars,chips,comment:'',at:new Date().toISOString()},prof().isSuperCoach?{coach:true}:{})];addKarma('vote',KARMA.vote,c.techId);S.vs.n++;S.vs.pts+=KARMA.vote;vsNext();return true}
case 'karma-open':S.karmaOpen=true;return rr();
case 'karma-close':S.karmaOpen=false;return rr();
}return false}
/* live URL validation without re-render (keeps focus) */
document.addEventListener('input',e=>{const t=e.target;if(!t)return;
if(t.id==='soc-url'){const d=S.socDraft&&S.socDraft.t===S.tecOpen?S.socDraft:{t:S.tecOpen,url:'',belt:null};d.url=t.value;S.socDraft=d;const p=parseClip(t.value),m=document.getElementById('soc-msg'),b=document.getElementById('soc-pub');
 if(p.ok&&d.local){idbDel(d.local.id);d.local=null}if(m){m.className='upmsg '+(p.ok?'ok':t.value?'bad':'');m.innerHTML=p.ok?`${ic('Check')} ${PLAT[p.platform]} ${L('detectado','detected')}`:esc(p.msg||'')}if(b)b.disabled=!((p.ok||d.local)&&d.consent);save()}
if(t.id==='rate-com'&&S.rate){S.rate.comment=t.value.slice(0,140)}});
