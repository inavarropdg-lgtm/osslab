/* ================= v16 · C1 Modo pizarra: sesión de un vistazo + cierre en 1 toque ================= */
Object.assign(ICN,{"LayoutList": "<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\"/><path d=\"M14 4h7\"/><path d=\"M14 9h7\"/><path d=\"M14 15h7\"/><path d=\"M14 20h7\"/>", "ListChecks": "<path d=\"m3 17 2 2 4-4\"/><path d=\"m3 7 2 2 4-4\"/><path d=\"M13 6h8\"/><path d=\"M13 12h8\"/><path d=\"M13 18h8\"/>", "Eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>", "Weight": "<circle cx=\"12\" cy=\"5\" r=\"3\"/><path d=\"M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z\"/>", "Image": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\"/><circle cx=\"9\" cy=\"9\" r=\"2\"/><path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\"/>", "Download": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"7 10 12 15 17 10\"/><line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\"/>", "Smile": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M8 14s1.5 2 4 2 4-2 4-2\"/><line x1=\"9\" x2=\"9.01\" y1=\"9\" y2=\"9\"/><line x1=\"15\" x2=\"15.01\" y1=\"9\" y2=\"9\"/>", "ThumbsUp": "<path d=\"M7 10v12\"/><path d=\"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z\"/>"});
const BD_CAT={str:{es:'Fuerza',en:'Strength'},acc:{es:'Complementarios',en:'Accessories'},cond:{es:'Acondicionamiento',en:'Conditioning'},mod:{es:'Módulo',en:'Module'},tec:{es:'Técnica en solitario',en:'Solo technique'},mob:{es:'Movilidad y core',en:'Mobility and core'}};
const BD_RATE=[[4,{es:'Fácil',en:'Easy'},'Smile'],[6,{es:'Bien',en:'Good'},'ThumbsUp'],[8,{es:'Dura',en:'Hard'},'Flame']];
function pMode(){return (S.a&&S.a.pmode)||'board'}
function bdCat(r,sp){if(r.tech)return 'tec';if(r.mod)return 'mod';if(sp.mob)return 'mob';if(sp.kind==='rounds')return 'cond';if((sp.kind==='kg'||sp.kind==='kgdist')&&!r.acc)return 'str';return 'acc'}
function bdRest(s){if(!s)return '';const m=Math.floor(s/60),x=s%60;return m?`${m}:${String(x).padStart(2,'0')} min`:`${x} s`}
function bdRx(r,sp){let p=rxT(r.p);if(sp.kind!=='block'&&sp.kind!=='rounds'&&sp.rx&&sp.rx.sets&&sp.n!==sp.rx.sets)p=p.replace(/^\s*\d+\s*×/,sp.n+' ×');if(sp.t)p=p.replace(/RPE\s*[\d–-]+/,'RPE '+sp.t);return p}
function bdRows(b,ph,as,idx,R){const live=liveFor(idx),P=playRows(b,ph,as,idx,R,live),amber=!!R&&R.state==='ambar';
return {P,rows:P.rows.map(r=>{const sp=exSpec(r,ph,b.cap,amber,P.force);let kg=null;if(sp.kind==='kg'){const g=sugKg(r.id,sp.rx.lo,sp.t,sp.inc,[]);kg=g&&g.kg!=null?g.kg:null}
 const cue=r.tech&&r.drill?(r.drill.how[S.lang==='en'?'en':'es']||[])[0]:(EX[r.id]&&EX[r.id].cue?T(EX[r.id].cue):'');
 return {r,sp,cat:bdCat(r,sp),rx:bdRx(r,sp),kg,rest:restFor(sp.kind,r.acc||r.mod),cue}})}}
function bdGroups(rows){const g=[];for(const x of rows){let last=g[g.length-1];if(!last||last.cat!==x.cat){last={cat:x.cat,items:[]};g.push(last)}last.items.push(x)}return g.map((x,i)=>Object.assign(x,{letter:String.fromCharCode(65+i)}))}
function modeSeg(){const m=pMode();return `<div class="bdseg" role="group" aria-label="${L('Vista de la sesión','Session view')}"><button data-act="bd-mode" data-v="board" aria-pressed="${m==='board'}">${ic('LayoutList')} ${L('Pizarra','Board')}</button><button data-act="bd-mode" data-v="track" aria-pressed="${m==='track'}">${ic('ListChecks')} ${L('Registrar series','Log sets')}</button></div>`}
function boardHTML(b,ph,as,idx,R){
const {P,rows}=bdRows(b,ph,as,idx,R),t=tplOf(b,as.key),dur=b.short?30:t.d,live=liveFor(idx),tk=(live&&live.bd)||{},grp=bdGroups(rows);
let h='';
if(P.red&&!P.force)h+=`<p class="note">${L('Sesión de recuperación en lugar de la Sesión','Recovery session instead of Session')} ${as.key}. <button class="link" data-act="force" data-v="${idx}">${L('Entrenar igualmente','Train anyway')}</button></p>`;
else if(P.force)h+=`<p class="note">${L('Versión mínima: 3 ejercicios, 2 series y esfuerzo suave.','Minimal version: 3 exercises, 2 sets, easy effort.')}</p>`;
else if(R&&R.state==='ambar')h+=`<p class="note">${L('Hoy, una serie menos y algo más suave. Ya está aplicado abajo.','Today, one less set and a bit easier. Already applied below.')}</p>`;
h+=`<div class="bdmeta"><span>${ic('Timer')} ${dur} min</span><span>${ic('Dumbbell')} ${rows.length} ${L('ejercicios','exercises')}</span><span>${ic('Eye')} ${L('Míralo entre series','Glance between sets')}</span></div>`;
h+=grp.map(g=>`<section class="bdblk"><p class="bdh"><b>${g.letter}</b>${esc(T(BD_CAT[g.cat]))}</p>${g.items.map((x,i)=>{const id=x.r.id,on=!!tk[id];
 return `<div class="bdrow${on?' on':''}"><span class="bdn">${g.letter}${i+1}</span><div class="bdb"><p class="bdx">${esc(itemName(x.r))}</p><p class="bdrx">${esc(x.rx)}</p><p class="bdi">${x.kg!=null?`<span>${ic('Weight')} ≈ ${fmt(x.kg)} kg</span>`:''}${x.rest?`<span>${ic('Timer')} ${L('Descanso','Rest')} ${bdRest(x.rest)}</span>`:''}</p>${x.cue?`<p class="bdc">${esc(x.cue)}</p>`:''}</div><button class="bdt" data-act="bd-tick" data-sx="${idx}" data-v="${esc(id)}" aria-pressed="${on}" aria-label="${L('Marcar','Mark')} ${esc(itemName(x.r))}">${on?'✓':''}</button></div>`}).join('')}</section>`).join('');
if(P.it.notes&&P.it.notes.length)h+=P.it.notes.map(x=>`<p class="note">${esc(x)}</p>`).join('');
h+=`<button class="link bdimg" data-act="bd-img" data-v="${idx}">${ic('Image')} ${L('Guardar como imagen','Save as image')}</button>`;
h+=`<div class="bdbar"><button class="cta" data-act="bd-done" data-v="${idx}">${ic('Check')} ${L('Sesión hecha','Session done')}</button></div>`;
return `<div class="player" data-mode="board"><div class="board">${h}</div></div>`}
function bdSheet(){const s=S.bdSheet;if(!s)return '';const b=build(),as=b.assign[s.idx];if(!as)return '';const t=tplOf(b,as.key),live=liveFor(s.idx),el=live&&live.start?Math.round((Date.now()-live.start)/60000):0,min=s.min!=null?s.min:Math.max(el,b.short?30:t.d||40);
return `<div class="modal" role="dialog" aria-modal="true" aria-label="${L('Cerrar sesión','Close session')}"><button class="mbg" data-act="bd-cancel" aria-label="${L('Cerrar','Close')}"></button><div class="sheet bds"><h2>${L('¿Cómo ha ido?','How did it go?')}</h2><p class="pr-s">${L('Un toque y queda guardada.','One tap and it is saved.')}</p>
<div class="bdrate">${BD_RATE.map(([v,l,i])=>`<button data-act="bd-rate" data-v="${v}">${ic(i)}<b>${esc(T(l))}</b></button>`).join('')}</div>
<label class="bdmin">${L('Minutos','Minutes')} <input id="bd-min" type="number" inputmode="numeric" min="5" max="240" value="${min}"></label>
<button class="link" data-act="bd-cancel">${L('Volver a la sesión','Back to the session')}</button></div></div>`}
function bdSum(s){return `<div class="sum" style="margin-top:14px"><div class="sumh"><span class="okc">✓</span><div><h3>${L('Sesión','Session')} ${s.key} ${L('guardada','saved')}</h3><p class="small">${s.min} min · ${esc(T((BD_RATE.find(x=>x[0]===s.srpe)||BD_RATE[1])[1]))}</p></div></div><p class="small">${L('Cuenta para tu carga semanal y tu racha. Si un día quieres que las cargas suban solas, usa «Registrar series».','It counts towards your weekly load and streak. If you want loads to progress automatically, use “Log sets”.')}</p><button class="link" data-act="sumclose">${L('Volver','Back')}</button></div>`}
/* imagen de la pizarra (canvas → PNG, mantener pulsado para guardar) */
function bdImage(idx){const b=build(),ph=phase(curWeek()),R=gateR(readiness(S.ck[iso(today())])),as=b.assign[idx];if(!as)return null;
const {rows}=bdRows(b,ph,as,idx,R),grp=bdGroups(rows),t=tplOf(b,as.key),W=1080,lh=[];
const c=document.createElement('canvas');if(!c.getContext)return null;const x=c.getContext('2d');if(!x)return null;
const fit=(tx,mw)=>{if(x.measureText(tx).width<=mw)return tx;let a=tx;while(a.length>3&&x.measureText(a+'…').width>mw)a=a.slice(0,-1);return a.trimEnd()+'…'};let H=300;grp.forEach(g=>{H+=90;g.items.forEach(()=>H+=150)});H+=120;c.width=W;c.height=H;
x.fillStyle='#F7F8FA';x.fillRect(0,0,W,H);x.fillStyle='#113838';x.fillRect(0,0,W,230);
x.fillStyle='#E04810';x.font='700 34px Outfit, Inter, sans-serif';x.fillText('osslab',60,80);
x.fillStyle='#FFFFFF';x.font='700 60px Outfit, Inter, sans-serif';x.fillText(fit(`${L('Sesión','Session')} ${as.key} · ${T(t)}`,W-120),60,160);
x.font='500 32px Inter, sans-serif';x.fillStyle='#C5D8D6';x.fillText(`${b.short?30:t.d} min · ${rows.length} ${L('ejercicios','exercises')}`,60,208);
let y=300;grp.forEach(g=>{x.fillStyle='#E04810';x.font='700 34px Outfit, Inter, sans-serif';x.fillText(`${g.letter} · ${T(BD_CAT[g.cat]).toUpperCase()}`,60,y);y+=50;
 g.items.forEach((it,i)=>{x.fillStyle='#FFFFFF';x.fillRect(48,y-10,W-96,130);x.fillStyle='#113838';x.font='700 36px Outfit, Inter, sans-serif';const side0=[it.kg!=null?`≈ ${fmt(it.kg)} kg`:'',it.rest?`${L('desc.','rest')} ${bdRest(it.rest)}`:''].filter(Boolean).join(' · ');x.font='500 28px Inter, sans-serif';const sw=side0?x.measureText(side0).width+40:0;x.font='700 36px Outfit, Inter, sans-serif';x.fillText(fit(`${g.letter}${i+1}  ${itemName(it.r)}`,W-144-sw),72,y+38);
 x.font='700 40px Inter, sans-serif';x.fillStyle='#0F2A2A';x.fillText(fit(it.rx,W-144),72,y+92);x.font='500 28px Inter, sans-serif';x.fillStyle='#5E6E6C';const side=[it.kg!=null?`≈ ${fmt(it.kg)} kg`:'',it.rest?`${L('desc.','rest')} ${bdRest(it.rest)}`:''].filter(Boolean).join(' · ');if(side){const w=x.measureText(side).width;x.fillText(side,W-72-w,y+38)}y+=150});y+=40});
x.fillStyle='#5E6E6C';x.font='500 26px Inter, sans-serif';x.fillText(L('Al terminar: abre osslab y pulsa «Sesión hecha».','When done: open osslab and tap “Session done”.'),60,H-50);
try{return c.toDataURL('image/png')}catch(e){return null}}
function bdImgSheet(){const u=S.bdImg;if(!u)return '';return `<div class="modal" role="dialog" aria-modal="true" aria-label="${L('Imagen de la sesión','Session image')}"><button class="mbg" data-act="bd-img-close" aria-label="${L('Cerrar','Close')}"></button><div class="sheet bdis"><h2>${L('Tu sesión en una imagen','Your session as an image')}</h2><p class="pr-s">${L('Mantén pulsada la imagen (o clic derecho en el ordenador) para guardarla en tu galería y llévala al gimnasio.','Long-press the image (or right-click on a computer) to save it to your gallery and take it to the gym.')}</p><img src="${u}" alt="${L('Pizarra de la sesión','Session board')}"><button class="link" data-act="bd-img-close">${L('Cerrar','Close')}</button></div></div>`}
/* enganches con el reproductor existente */
const _playerHTML0=playerHTML0;
playerHTML0=function(b,ph,as,idx,R){return modeSeg()+(pMode()==='track'?_playerHTML0(b,ph,as,idx,R):boardHTML(b,ph,as,idx,R))};
const _sumHTML0=sumHTML0;sumHTML0=function(s){return s&&s.board?bdSum(s):_sumHTML0(s)};
function boardAct(t,act,v){const rr=()=>{save();render();return true};
switch(act){
case 'bd-mode':if(S.a){S.a.pmode=v==='track'?'track':'board'}return rr();
case 'bd-tick':{const live=ensureLive(+t.dataset.sx);if(!live.start)live.start=Date.now();live.bd=live.bd||{};live.bd[v]=!live.bd[v];return rr()}
case 'bd-done':{const live=ensureLive(+v);if(!live.start)live.start=Date.now();S.bdSheet={idx:+v};render();return true}
case 'bd-cancel':S.bdSheet=null;render();return true;
case 'bd-rate':{const s=S.bdSheet;if(!s)return true;const live=ensureLive(s.idx),inp=document.getElementById('bd-min');live.srpe=+v;live.min=inp?Math.max(5,Math.min(240,+inp.value||40)):40;S.bdSheet=null;saveSession(build());if(S.lastSum)S.lastSum.board=true;stopRest();wakeOff();save();render();window.scrollTo(0,0);return true}
case 'bd-img':{const u=bdImage(+v);if(u){S.bdImg=u;render()}return true}
case 'bd-img-close':S.bdImg=null;render();return true}
return false}

const _overlays=overlays;overlays=function(){return _overlays()+bdSheet()+bdImgSheet()};
