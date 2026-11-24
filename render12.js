/* ================= v17 · backlog UX: C2 foco técnico, C3 onboarding, A4 registro mínimo, M1–M5 ================= */
Object.assign(ICN,{"Globe":'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',"Video":'<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',"Camera":'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',"Crosshair":'<circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/>',"BookMarked":'<path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>'});

/* ---------- C3 · onboarding ---------- */
Object.assign(SIT,{espalda:{es:'Escapar de la espalda',en:'Escaping back control'},raspar:{es:'Raspar desde la guardia',en:'Sweeping from guard'},defsub:{es:'Defender sumisiones',en:'Defending submissions'}});
Object.assign(PHYS,{espalda:'peso',raspar:'mov',defsub:'fuerza'});
const SITG=[[{es:'De pie',en:'Standing'},['derribo']],[{es:'Abajo, en mala posición',en:'Stuck underneath'},['montada','lateral','espalda']],[{es:'Desde tu guardia',en:'From your guard'},['retener','raspar']],[{es:'Arriba',en:'On top'},['pasar']],[{es:'Sumisiones',en:'Submissions'},['finalizar','defsub']],[{es:'Cardio',en:'Cardio'},['ritmo']]];
const WHY4=[['tec',{es:'Técnica',en:'Technique'}],['fis',{es:'Físico',en:'Physical'}],['mente',{es:'Me bloqueo',en:'I freeze'}],['nose',{es:'No lo sé',en:'Not sure'}]];
const WK_ST=['', 'bjj','gym','both'],WK_LB={'':'—',bjj:'BJJ',gym:'Gym',both:'BJJ+Gym'};
const DUR3=[['30',{es:'30 min',en:'30 min'}],['45',{es:'45 min',en:'45 min'}],['60',{es:'60 min',en:'60 min'}]];
const EQ3=[['gym',{es:'Gimnasio',en:'Gym'}],['casa',{es:'Casa: kettlebell o mancuernas',en:'Home: kettlebell or dumbbells'}],['nada',{es:'Sin material',en:'No equipment'}]];
const OB_PAIN=[['hombro',PAIN.hombro],['rodilla',PAIN.rodilla],['cuello',PAIN.cuello],['lumbar',PAIN.lumbar],['dedos',{es:'Dedos',en:'Fingers'}]];
obNew=function(){return {step:'p1',goals:[],d:{modal:null,belt:null,stripes:'0',days:[],gym:[],dur:null,place:null,when:null,lose:[],why:{},pain:[],painNone:false}}};
function obD(){const d=S.ob.d;d.gym=d.gym||[];d.pain=d.pain||[];return d}
function dayState(d,i){const b=d.days.includes(i),g=d.gym.includes(i);return b&&g?'both':b?'bjj':g?'gym':''}
obP1=function(){const d=obD(),miss=[];
if(!d.modal)miss.push(L('modalidad','style'));if(!d.belt)miss.push(L('cinturón','belt'));if(!d.days.length)miss.push(L('al menos un día de BJJ','at least one BJJ day'));if(!d.dur)miss.push(L('duración','length'));if(!d.place)miss.push(L('material','equipment'));
const body=`<p class="sub">${L('Modalidad','Style')}</p>${chipRow('modal',[['gi',{es:'Kimono',en:'Gi'}],['nogi',{es:'Sin kimono',en:'No-gi'}],['both',{es:'Las dos',en:'Both'}]],d.modal)}
<p class="sub">${L('Cinturón','Belt')}</p><div class="belts" role="group" aria-label="${L('Cinturón','Belt')}">${ents(BELT).map(([k,v])=>`<button class="belt b-${k}" data-act="o1" data-k="belt" data-v="${k}" aria-pressed="${d.belt===k}"><span class="bs" aria-hidden="true"></span>${esc(T(v))}</button>`).join('')}</div>
${d.belt?`<p class="sub">${L('Grados','Stripes')}</p><div class="stripes" role="group" aria-label="${L('Grados','Stripes')}">${['0','1','2','3','4'].map(v=>`<button data-act="o1" data-k="stripes" data-v="${v}" aria-pressed="${d.stripes===v}" aria-label="${v} ${L('grados','stripes')}">${v==='0'?'0':'<i></i>'.repeat(+v)}</button>`).join('')}</div>`:''}
<p class="sub">${L('Tu semana','Your week')}</p><p class="small obh">${L('Toca cada día: BJJ → Gym → los dos → libre.','Tap each day: BJJ → Gym → both → off.')}</p>
<div class="wkgrid" role="group" aria-label="${L('Tu semana','Your week')}">${DAYS().map((x,i)=>{const st=dayState(d,i);return `<button class="wkd s-${st||'off'}" data-act="o1wk" data-v="${i}" aria-label="${DAYC()[i]}: ${WK_LB[st]}"><b>${x}</b><span>${WK_LB[st]}</span></button>`}).join('')}</div>
${d.days.length&&!d.gym.length?`<p class="small obh">${L('Sin días de gym marcados: los elegimos nosotros, lejos de tus clases duras.','No gym days marked: we pick them, away from your hard classes.')}</p>`:''}
<p class="sub">${L('¿Cuánto tiempo tienes para el físico?','How long do you have for strength work?')}</p>${chipRow('dur',DUR3,d.dur)}
<p class="sub">${L('¿Con qué entrenas?','What do you train with?')}</p><div class="opts">${EQ3.map(([k,v])=>`<button class="opt" data-act="o1" data-k="place" data-v="${k}" aria-pressed="${d.place===k}">${esc(T(v))}</button>`).join('')}</div>`;
return obShell(1,4,L('¿Cómo es tu semana?','What does your week look like?'),L('Con esto ajustamos tu nivel y tus días.','This sets your level and your days.'),body,!miss.length,'o-next','o-back',L('Te falta: ','Missing: ')+miss.join(', '))};
previewLines=function(d){const o=[];for(const s of d.lose){const ws=[].concat(d.why[s]||[]);if(!ws.length)continue;const sit=T(SIT[s]).toLowerCase();
 if(ws.includes('tec')||ws.includes('nose'))o.push(L(`técnica: una cadena de 3 técnicas para ${sit}`,`technique: a 3-technique chain for ${sit.replace(/^escaping/,'escaping')}`));
 if(ws.includes('fis')||ws.includes('nose'))o.push(T(PREV[PHYS[s]]));
 if(ws.includes('mente'))o.push(L(`una rutina para no bloquearte en: ${sit}`,`a routine so you don't freeze when ${sit}`))}return [...new Set(o)]};
obP3=function(){const d=obD(),pv=previewLines(d),noWhy=d.lose.filter(s=>!(d.why[s]||[]).length),full=d.lose.length>=3;
const body=`<p class="small obh"><b class="cnt">${d.lose.length}/3</b> ${full?L('Has elegido 3. Quita una para cambiarla.','You picked 3. Remove one to change it.'):L('Elige hasta 3 situaciones.','Pick up to 3 situations.')}</p>
${SITG.map(([g,ks])=>`<p class="sitg">${esc(T(g))}</p><div class="chips4">${ks.map(k=>{const on=d.lose.includes(k);return `<button class="chipb" data-act="o3s" data-v="${k}" aria-pressed="${on}"${!on&&full?' aria-disabled="true"':''}>${esc(T(SIT[k]))}</button>`}).join('')}</div>`).join('')}
${d.lose.map(s=>{const ws=[].concat(d.why[s]||[]);return `<div class="whyrow"><p class="sub">${L('¿Por qué te cuesta?','Why is it hard?')} · ${esc(T(SIT[s]))} <small>${L('(puedes marcar varias)','(pick any)')}</small></p><div class="seg4" role="group">${WHY4.map(([k,v])=>`<button data-act="o3w" data-s="${s}" data-v="${k}" aria-pressed="${ws.includes(k)}">${esc(T(v))}</button>`).join('')}</div></div>`}).join('')}
<p class="sub">${L('¿Arrastras alguna molestia?','Any current niggles?')}</p><div class="chips4">${OB_PAIN.map(([k,v])=>`<button class="chipb" data-act="o3p" data-v="${k}" aria-pressed="${d.pain.includes(k)}">${esc(T(v))}</button>`).join('')}<button class="chipb" data-act="o3p" data-v="ninguna" aria-pressed="${!!d.painNone}">${L('Ninguna','None')}</button></div>
${pv.length?`<div class="preview" role="status"><p class="plabel">${L('Tu plan va a trabajar','Your plan will work on')}</p><ul>${pv.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}`;
const painOk=d.painNone||d.pain.length>0;
const ok=d.lose.length>=1&&!noWhy.length&&painOk,miss=!d.lose.length?L('Elige al menos una situación','Pick at least one situation'):noWhy.length?L(`Dinos por qué te cuesta: ${noWhy.map(s=>T(SIT[s]).toLowerCase()).join(', ')}`,`Tell us why: ${noWhy.map(s=>T(SIT[s]).toLowerCase()).join(', ')}`):L('Dinos si tienes alguna molestia','Tell us about any niggles');
return obShell(3,4,L('¿Dónde te cuesta más?','Where do you struggle most?'),L('Esto es lo que va a trabajar tu plan, también en técnica.','This is what your plan will work on, technique included.'),body,ok,'o-next','o-back',miss,L('Ver mi plan','See my plan'))};
const _draftToA=draftToA;
draftToA=function(){const d=obD(),a=_draftToA(),why={};
for(const s of d.lose){const ws=[].concat(d.why[s]||[]),o=[];for(const w of ws){if(w==='tec')o.push('tec');else if(w==='mente')o.push('mente');else if(w==='fis')o.push(PHYS[s]);else if(w==='nose'){o.push('tec');o.push(PHYS[s])}}why[s]=[...new Set(o)]}
const gN=d.gym.length,dur=+d.dur||45;
return Object.assign(a,{why,gymDays:d.gym.slice().sort((x,y)=>x-y),time:dur<=30?'2x30':gN>=3?'3x45':'2x45',dur,place:d.place==='gym'?'gym':'casa',equip:d.place,pain:d.pain.slice(),painAsked:true,timeAsked:true})};
/* días de gym elegidos por el usuario */
const _pickDays=pickDays;
pickDays=function(a,n,intense,order){const g=(a.gymDays||[]).slice().sort((x,y)=>x-y);if(!g.length)return _pickDays(a,n,intense,order);
let ch;if(g.length<=n)ch=g.slice();else{let best=null,bs=-1;const combos=(arr,k,st=0,cur=[])=>{if(cur.length===k){const m=Math.min(...cur.map((x,i)=>cur.map((y,j)=>i===j?9:Math.min(Math.abs(x-y),7-Math.abs(x-y)))).flat());if(m>bs){bs=m;best=cur.slice()}return}for(let i=st;i<arr.length;i++){cur.push(arr[i]);combos(arr,k,i+1,cur);cur.pop()}};combos(g,n);ch=best}
if(ch.length<n){const more=_pickDays(Object.assign({},a,{days:(a.days||[]).concat(ch)}),n,intense,order).map(x=>x.day).filter(x=>!ch.includes(x));ch=ch.concat(more.slice(0,n-ch.length))}
ch.sort((x,y)=>x-y);return ch.map((d,i)=>({day:d,key:order[i],note:null}))};
function obAct12(t,act,v){const o=S.ob,d=o&&o.d,rr=()=>{save();render();return true};if(!d&&/^o[13]/.test(act))return false;
switch(act){
case 'o1wk':{obD();const i=+v,st=dayState(d,i),nx=WK_ST[(WK_ST.indexOf(st)+1)%4];d.days=d.days.filter(x=>x!==i);d.gym=d.gym.filter(x=>x!==i);if(nx==='bjj'||nx==='both')d.days.push(i);if(nx==='gym'||nx==='both')d.gym.push(i);return rr()}
case 'o3s':{const k=d.lose.indexOf(v);if(k>=0){d.lose.splice(k,1);delete d.why[v]}else if(d.lose.length<3)d.lose.push(v);return rr()}
case 'o3w':{const s=t.dataset.s;let ws=[].concat(d.why[s]||[]);if(v==='nose')ws=ws.includes('nose')?[]:['nose'];else{ws=ws.filter(x=>x!=='nose');ws=ws.includes(v)?ws.filter(x=>x!==v):ws.concat(v)}d.why[s]=ws;return rr()}
case 'o3p':{obD();if(v==='ninguna'){d.painNone=!d.painNone;if(d.painNone)d.pain=[]}else{d.painNone=false;d.pain=d.pain.includes(v)?d.pain.filter(x=>x!==v):d.pain.concat(v)}return rr()}}
return false}

/* ---------- C2 · foco técnico semanal ---------- */
const CHAINS={montada:['escape-montada-codo-rodilla','upa','media-guardia-escudo'],lateral:['escape-lateral','retencion-guardia','lateral-a-tortuga'],espalda:['defensa-mata-leon','escape-espalda','escape-tortuga'],retener:['gamba','retencion-guardia','guardia-sentada'],raspar:['tijera-guardia-cerrada','raspado-cadera','raspado-pendulo'],pasar:['abrir-guardia-rodillas','pase-toreando','pase-rodilla-cortada'],derribo:['lucha-agarres','single-leg','doble-pierna'],finalizar:['kimura-guardia','llave-brazo-guardia','triangulo'],defsub:['defensa-armbar','defensa-triangulo','defensa-guillotina'],ritmo:['respiracion-cuadrada','control-lateral','mantener-montada'],invertir:['granby','gamba-inversa','retencion-guardia'],marcador:['tirar-guardia','mantener-montada','control-lateral']};
const CHAIN_ADV={montada:['escape-montada-codo-rodilla','upa','escape-montada-alta'],raspar:['mariposa-raspado','raspado-tripode','raspado-hoz'],pasar:['pase-toreando','pase-rodilla-cortada','pase-leg-drag'],finalizar:['triangulo','omoplata','llave-brazo-guardia'],derribo:['single-leg','doble-pierna','snap-down']};
const POSF={montada:{es:'debajo de la montada',en:'under mount'},lateral:{es:'debajo del control lateral',en:'under side control'},espalda:{es:'con el rival en tu espalda',en:'with your partner on your back'},retener:{es:'en guardia abierta, el rival intentando pasar',en:'in open guard, partner trying to pass'},raspar:{es:'en tu guardia',en:'in your guard'},pasar:{es:'dentro de la guardia del rival',en:'inside your partner’s guard'},derribo:{es:'de pie, con agarres',en:'standing, gripped up'},finalizar:{es:'desde tu guardia, buscando la sumisión',en:'from your guard, hunting the submission'},defsub:{es:'con el rival atacando una sumisión',en:'with your partner attacking a submission'},ritmo:{es:'rondas largas a ritmo de combate',en:'long rounds at match pace'},invertir:{es:'en guardia abierta',en:'in open guard'},marcador:{es:'de pie, con el marcador en contra',en:'standing, behind on points'}};
const FSTAGE=[{k:'drill',n:{es:'Entender y drill',en:'Understand and drill'},d:{es:'Lee los puntos clave y haz 3 × 10 repeticiones por lado con compañero, al acabar la clase o en el open mat, sin resistencia.',en:'Read the key points and do 3 × 10 reps per side with a partner, after class or at open mat, without resistance.'}},{k:'pos',n:{es:'Sparring posicional',en:'Positional sparring'},d:{es:'Pide 3 rondas de 3 min empezando {pos}. Objetivo: conseguirlo 2 de cada 5 veces.',en:'Ask for 3 rounds of 3 min starting {pos}. Goal: make it work 2 out of 5 times.'}},{k:'roll',n:{es:'En los rolls',en:'In live rolls'},d:{es:'Búscalo en tus rolls libres. No pasa nada si no sale: lo importante es intentarlo.',en:'Hunt it in your live rolls. It is fine if it does not work: what matters is trying.'}}];
function focusOrder(){const a=S.a||{},adv=['azul','morado','marron','negro'].includes(a.belt);const base=adv?['retener','pasar','finalizar','derribo','montada','raspar']:['montada','retener','lateral','pasar','finalizar','derribo'];return [...new Set((a.lose||[]).filter(x=>x!=='nada'&&CHAINS[x]).concat(base))]}
function focusNow(){if(!S.a)return null;const cw=Math.max(1,curWeek()),bi=Math.floor((cw-1)/3),st=(cw-1)%3,ord=focusOrder(),sit=ord[bi%ord.length],adv=['azul','morado','marron','negro'].includes(S.a.belt);
const ids=((adv&&CHAIN_ADV[sit])||CHAINS[sit]).filter(id=>techById(id));const wkStart=iso(addD(monOf(today()),0));
return {sit,ids,stage:FSTAGE[st],st,block:bi+1,cw,wkStart}}
function fLogWeek(f){const L0=S.fLog||{},o={tried:0,ok:0,n:0};for(const ds in L0){if(ds<f.wkStart)continue;const x=L0[ds];if(x.sit!==f.sit)continue;o.n++;if(x.tried)o.tried++;if(x.ok==='si')o.ok++}return o}
function seenToday(){return ((S.seen||{})[iso(today())]||[]).filter(id=>techById(id))}
function focusCard(compact){const f=focusNow();if(!f)return '';const ds=iso(today()),lg=(S.fLog||{})[ds],wk=fLogWeek(f),pos=T(POSF[f.sit]||{es:'',en:''}),desc=T(f.stage.d).replace('{pos}',pos);
const ask=!S.example&&(isClassDay()||(S.log.mat||[]).some(x=>x.date===ds));
const q=lg?(lg.tried&&!lg.ok?`<p class="fq">${L('¿Te salió?','Did it work?')}</p><div class="seg3" role="group">${[['si',L('Sí','Yes')],['aveces',L('A veces','Sometimes')],['no',L('No','No')]].map(([k,l])=>`<button data-act="f-ok" data-v="${k}">${l}</button>`).join('')}</div>`:`<p class="fdone">${ic('Check')} ${lg.tried?(lg.ok==='si'?L('Hoy te salió. Apuntado.','It worked today. Logged.'):lg.ok==='aveces'?L('Hoy salió a veces. Apuntado.','Worked sometimes today. Logged.'):L('Hoy no salió. Es normal en esta fase.','It did not work today. Normal at this stage.')):L('Hoy no lo intentaste. Apuntado.','You did not try it today. Logged.')} <button class="link" data-act="f-undo">${L('Cambiar','Change')}</button></p>`):ask?`<p class="fq">${L('Tras la clase: ¿lo intentaste?','After class: did you try it?')}</p><div class="seg3 two" role="group"><button data-act="f-try" data-v="1">${L('Sí','Yes')}</button><button data-act="f-try" data-v="0">${L('No','No')}</button></div>`:'';
const sn=seenToday();
return `<section class="pr-card fcard"><div class="fh"><span class="pic t-orange">${ic('Crosshair')}</span><div><p class="fk">${L('Foco técnico','Technique focus')} · ${L('semana','week')} ${f.st+1}/3</p><h3>${esc(T(SIT[f.sit]))}</h3></div></div>
<div class="fsteps" aria-hidden="true">${FSTAGE.map((s,i)=>`<span class="${i<f.st?'ok':i===f.st?'on':''}">${esc(T(s.n))}</span>`).join('')}</div>
<p class="fst"><b>${esc(T(f.stage.n))}.</b> ${esc(desc)}</p>
<div class="fchain">${f.ids.map((id,i)=>{const t=techById(id);return `<button class="fch" data-act="tec-open" data-v="${id}"><span class="fn">${i+1}</span><span class="ft">${esc(T(t.n))}</span>${t.video.type!=='pending'?`<span class="fv">${ic('Play')}</span>`:''}</button>`}).join('')}</div>
${wk.n?`<p class="small fwk">${L(`Esta semana: lo intentaste ${wk.tried} de ${wk.n} días · salió ${wk.ok}`,`This week: tried on ${wk.tried} of ${wk.n} days · worked ${wk.ok}`)}</p>`:''}
${q}
${compact?'':`<div class="fseen"><button class="link" data-act="seen-open">${ic('BookMarked')} ${L('Hoy en clase vimos…','Today in class we did…')}</button>${sn.length?`<div class="fsl">${sn.map(id=>`<button class="tagb" data-act="tec-open" data-v="${id}">${esc(T(techById(id).n))}</button>`).join('')}</div>`:''}</div>`}</section>`}
function seenSheet(){if(!S.seenOpen)return '';const q=(S.seenQ||'').trim(),norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase(),sel=seenToday();
const list=q?TECH.filter(x=>norm(x.n.es+' '+x.n.en).includes(norm(q))).slice(0,8):[];
return `<div class="modal" role="dialog" aria-modal="true" aria-label="${L('Hoy en clase vimos','Today in class we did')}"><button class="mbg" data-act="seen-close" aria-label="${L('Cerrar','Close')}"></button><div class="sheet seens"><h2>${L('Hoy en clase vimos…','Today in class we did…')}</h2><p class="pr-s">${L('Búscala y te la dejamos a mano para repasar.','Find it and we keep it handy for review.')}</p>
<label class="tsearch">${ic('Search')}<input id="seen-q" type="search" placeholder="${L('Ej.: kimura, raspado, montada…','E.g. kimura, sweep, mount…')}" value="${esc(S.seenQ||'')}" autocomplete="off"></label>
${list.length?`<div class="pgroup">${list.map(t=>`<button class="trow" data-act="seen-add" data-v="${t.id}"><span class="tb"><span class="tt">${esc(T(t.n))}</span><span class="ts">${esc(T(TCAT[t.cat]))}</span></span><span class="pch">${sel.includes(t.id)?ic('Check'):ic('Plus')}</span></button>`).join('')}</div>`:q?`<p class="pr-s">${L('No la encontramos. Prueba con otra palabra.','Not found. Try another word.')}</p>`:''}
${sel.length?`<p class="pg-h">${L('Apuntadas hoy','Logged today')}</p><div class="fsl">${sel.map(id=>`<button class="tagb on" data-act="seen-add" data-v="${id}">${esc(T(techById(id).n))} ×</button>`).join('')}</div>`:''}
<button class="cta" data-act="seen-close" style="margin-top:14px">${L('Listo','Done')}</button></div></div>`}
document.addEventListener('input',e=>{const t=e.target;if(t&&t.id==='seen-q'){S.seenQ=t.value;render();const i=document.getElementById('seen-q');if(i){i.focus();const n=i.value.length;try{i.setSelectionRange(n,n)}catch(_){}}}});

/* ---------- A4 · check-in de 1 toque + clase en 2 toques ---------- */
const FACES=[['10','😫',{es:'Fatal',en:'Awful'}],['35','😕',{es:'Cansado',en:'Tired'}],['60','😐',{es:'Normal',en:'Okay'}],['80','🙂',{es:'Bien',en:'Good'}],['100','💪',{es:'A tope',en:'Great'}]];
const _ckHTML=ckHTML;
ckHTML=function(ck,R,compact){if(R&&!S.ckEdit)return _ckHTML(ck,R,compact);const j=ck.joint||'100';
return `<div class="ck ck1" style="margin:14px 0"><div class="ckh"><h3>${L('¿Cómo llegas hoy?','How do you feel today?')}</h3><span class="small">${L('1 toque','1 tap')}</span></div>
<div class="ckq"><span>${L('¿Alguna molestia?','Any niggle?')}</span><div class="seg3" role="group">${[['100',L('No','No')],['60',L('Leve','Mild')],['0',L('Me limita','Limiting')]].map(([v,l])=>`<button data-act="ckj" data-v="${v}" aria-pressed="${j===v}">${l}</button>`).join('')}</div></div>
${j!=='100'?painRow():''}
<div class="faces" role="group" aria-label="${L('Cómo llegas','How you feel')}">${FACES.map(([v,e,l])=>`<button data-act="ck1" data-v="${v}" aria-pressed="${ck.face===v}"><span>${e}</span><small>${esc(T(l))}</small></button>`).join('')}</div>
${ckHealth()}</div>`};
classDayCard0=function(){const ds=iso(today()),done=(S.log.mat||[]).filter(x=>x.date===ds);
if(done.length){const x=done[done.length-1];return `<div class="rowcard classday ok" style="margin-top:14px"><span class="ri">✓</span><span><span class="rt">${L('Clase de hoy registrada','Today\'s class logged')}</span><span class="rs">${esc(T(MATT[x.type]))} · ${x.min} min</span></span><button class="link" data-act="mat-undo" style="margin-left:auto">${L('Deshacer','Undo')}</button></div>`}
const q=quickClass();return `<div class="classcard" style="margin-top:14px"><div class="cc-h"><span class="ri">🥋</span><span><span class="rt">${L('¿Qué tal la clase de hoy?','How was today’s class?')}</span><span class="rs">${q.min} min · ${L('un toque y queda registrada','one tap and it is logged')}</span></span></div><div class="seg3" role="group">${[['4',L('Suave','Easy')],['6',L('Normal','Normal')],['8',L('Dura','Hard')]].map(([v,l])=>`<button data-act="mat-i" data-v="${v}">${l}</button>`).join('')}</div><button class="link" data-act="open-matlog">${L('Cambiar duración o tipo','Change length or type')}</button></div>`};

/* ---------- M1 · pestañas + Comunidad propia; M2 · idioma en Perfil ---------- */
tabbar=function(){const tabs=[['hoy',L('Hoy','Today'),'House'],['plan',L('Plan','Plan'),'CalendarDays'],['tec',L('Técnica','Technique'),'BookOpen'],['com',L('Comunidad','Community'),'Users'],['prog',L('Progreso','Progress'),'ChartColumn']];
return `<nav class="tabbar" aria-label="${L('Navegación','Navigation')}">${tabs.map(([k,n,i])=>`<button data-act="tab" data-v="${k}" aria-current="${S.tab===k?'page':'false'}"><span class="ic">${ic(i)}${S.tab===k?led('on'):''}</span>${esc(n)}</button>`).join('')}</nav>`};
barHTML=function(){const w=curWeek();return `<header class="bar"><span class="wm" aria-label="osslab" role="img">${osslabLogo(28)}</span><span class="wbadge">${L('Sem.','Wk')} ${w}/12</span>${karmaBadge()}<span class="sp"></span>${avatarBtn()}</header>`};
function comTab(){if(S.vs)return vsView();const cs=allClips().slice().sort((a,b)=>b.at>a.at?1:-1),mine=soc().clips;
return `<div class="pad"><header class="pr-h"><h1>${L('Comunidad','Community')}</h1><p>${L('Ejecuciones de técnica valoradas por otros practicantes','Technique executions rated by other grapplers')}</p></header>
${challengeCard(false)}
<button class="vsbtn" data-act="vs-start"><span class="pic t-orange">${ic('Star')}</span><span class="tb"><span class="tt">${L('Valorar clips (60 s)','Rate clips (60 s)')}</span><span class="ts">${L(`${pendingClips().length} clips pendientes · +20 karma por voto`,`${pendingClips().length} clips waiting · +20 karma per vote`)}</span></span><span class="pch">${ic('ChevronRight')}</span></button>
<button class="vsbtn" data-act="com-up"><span class="pic t-indigo">${ic('Video')}</span><span class="tb"><span class="tt">${L('Subir una ejecución','Upload an execution')}</span><span class="ts">${L('Elige la técnica y sube tu clip (+10 karma)','Pick the technique and upload your clip (+10 karma)')}</span></span><span class="pch">${ic('ChevronRight')}</span></button>
<p class="pg-h">${L('Últimas ejecuciones','Latest executions')}</p><div class="pgroup">${cs.slice(0,8).map(c=>{const tt=techById(c.techId),st=clipStats(c);return `<button class="trow" data-act="tec-com" data-v="${tt.id}"><span class="ava sm"><b>${esc(c.author[0])}</b></span><span class="tb"><span class="tt">${esc(T(tt.n))}</span><span class="ts">${esc(c.author)}${c.belt?' · '+esc(T(BELTS5[c.belt])):''} · ${st.n?fmtAvg(st.avg)+' ★ ('+st.n+')':L('sin valorar','unrated')}</span></span><span class="pch">${ic('ChevronRight')}</span></button>`}).join('')}</div>
${mine.length?`<p class="pg-h">${L('Mis ejecuciones','My executions')}</p><div class="pgroup">${mine.map(c=>{const t=techById(c.techId),s=clipStats(c);return `<button class="trow" data-act="tec-com" data-v="${t.id}"><span class="pic sm t-orange">${ic('Play')}</span><span class="tb"><span class="tt">${esc(T(t.n))}</span><span class="ts">${s.n?fmtAvg(s.avg)+' ★ ('+s.n+')':L('sin valoraciones aún','no ratings yet')}</span></span><span class="pch">${ic('ChevronRight')}</span></button>`}).join('')}</div>`:''}
<button class="vsbtn" data-act="karma-open" style="margin-top:14px"><span class="pic t-amber">${ic('Zap')}</span><span class="tb"><span class="tt">${L('Tu karma','Your karma')}: ${soc().karma}</span><span class="ts">${L('Cómo se gana y ranking por academia','How it works and academy ranking')}</span></span><span class="pch">${ic('ChevronRight')}</span></button></div>`}
const _profileView=profileView;
profileView=function(){const h=_profileView(),set=`<p class="pg-h">${L('Ajustes','Settings')}</p><div class="pgroup"><button class="trow" data-act="tab" data-v="equipo"><span class="pic sm t-emerald">${ic('ShieldCheck')}</span><span class="tb"><span class="tt">${L('Servicios','Services')}</span><span class="ts">${L('Fisio, nutrición y material con precio de atleta','Physio, nutrition and gear at athlete prices')}</span></span><span class="pch">${ic('ChevronRight')}</span></button><div class="trow nolink"><span class="pic sm t-slate">${ic('Globe')}</span><span class="tb"><span class="tt">${L('Idioma','Language')}</span></span>${langToggle()}</div></div>`;
const i=h.lastIndexOf('</div>');return h.slice(0,i)+set+h.slice(i)};

/* ---------- M5 · Tengo 30 min / sin gimnasio ---------- */
const _playRows=playRows;
playRows=function(b,ph,as,idx,R,live){const lv=live||liveFor(idx),home=!!(lv&&lv.home)&&b.a.place!=='casa',prev=b.a.place;if(home)b.a.place='casa';let r;try{r=_playRows(b,ph,as,idx,R,live)}finally{if(home)b.a.place=prev}
if(lv&&lv.short&&!b.short&&r.rows.length>4){r.rows=r.rows.slice(0,4)}return r};
function quickAdj(idx){const lv=liveFor(idx)||{};return `<div class="qadj" role="group" aria-label="${L('Ajustes rápidos','Quick adjustments')}"><button data-act="q-short" data-v="${idx}" aria-pressed="${!!lv.short}">${ic('Timer')} ${L('Tengo 30 min','I have 30 min')}</button>${S.a&&S.a.place!=='casa'?`<button data-act="q-home" data-v="${idx}" aria-pressed="${!!lv.home}">${ic('House')} ${L('Sin gimnasio hoy','No gym today')}</button>`:''}</div>`}
const _boardHTML=boardHTML;
boardHTML=function(b,ph,as,idx,R){const lv=liveFor(idx);let h=_boardHTML(b,ph,as,idx,R);if(lv&&lv.short&&!b.short)h=h.replace(/(<span>[^<]*<svg[^>]*>.*?<\/svg>\s*)\d+ min/,'$130 min');return h.replace('<div class="bdmeta">',quickAdj(idx)+'<div class="bdmeta">')};

/* ---------- acciones ---------- */
function act12(t,act,v){if(obAct12(t,act,v))return true;const rr=()=>{save();render();return true},ds=iso(today());
switch(act){
case 'ck1':{const c=Object.assign({},S.ck[ds]);c.sleep=v;c.sore=+v<=35?'0':+v<=60?'50':'100';c.energy=v;c.face=v;if(!c.joint)c.joint='100';S.ck[ds]=c;if(readiness(c))S.ckEdit=false;return rr()}
case 'ckj':{const c=Object.assign({},S.ck[ds]);c.joint=v;S.ck[ds]=c;if(v==='100'){S.painLog=Object.assign({},S.painLog,{[ds]:[]});if(S.a)S.a.pain=[]}else if(S.painLog&&S.painLog[ds]&&!S.painLog[ds].length){const p=Object.assign({},S.painLog);delete p[ds];S.painLog=p}return rr()}
case 'mat-i':{const q=quickClass(),r=+v;S.log.mat.push({date:ds,type:r>=8?'duro':r<=4?'tecnica':(q.type==='duro'?'suave':q.type),min:q.min,rpe:r});S.example=false;return rr()}
case 'f-try':{const f=focusNow();S.fLog=Object.assign({},S.fLog,{[ds]:{sit:f.sit,tried:v==='1',ok:null}});return rr()}
case 'f-ok':{const x=(S.fLog||{})[ds];if(x){x.ok=v;S.fLog=Object.assign({},S.fLog)}return rr()}
case 'f-undo':{const o=Object.assign({},S.fLog);delete o[ds];S.fLog=o;return rr()}
case 'seen-open':S.seenOpen=true;S.seenQ='';render();setTimeout(()=>{const i=document.getElementById('seen-q');if(i)i.focus()},30);return true;
case 'seen-close':S.seenOpen=false;return rr();
case 'seen-add':{const cur=seenToday();S.seen=Object.assign({},S.seen,{[ds]:cur.includes(v)?cur.filter(x=>x!==v):cur.concat(v)});return rr()}
case 'com-up':S.clipPick=true;go('tec');return true;
case 'q-short':{const lv=ensureLive(+v);lv.short=!lv.short;return rr()}
case 'q-home':{const lv=ensureLive(+v);lv.home=!lv.home;return rr()}}
return false}
const _overlays12=overlays;overlays=function(){return _overlays12()+seenSheet()};
function planFocusHTML(){const f=focusNow();if(!f)return '';const ord=focusOrder(),adv=['azul','morado','marron','negro'].includes(S.a.belt);
return `<div class="section-h" style="margin-top:4px"><h2>${L('Técnica: 4 bloques de 3 semanas','Technique: 4 blocks of 3 weeks')}</h2></div>
<p class="small">${L('Cada bloque: semana 1 drill, semana 2 sparring posicional, semana 3 en los rolls.','Each block: week 1 drill, week 2 positional sparring, week 3 live rolls.')}</p>
<div class="fblocks">${[0,1,2,3].map(i=>{const sit=ord[i%ord.length],ids=((adv&&CHAIN_ADV[sit])||CHAINS[sit]).filter(id=>techById(id)),on=i===f.block-1;return `<div class="fblk${on?' on':''}${i<f.block-1?' past':''}"><p class="fbw">${L('Semanas','Weeks')} ${i*3+1}–${i*3+3}${on?` · <b>${L('ahora','now')}</b>`:''}</p><p class="fbs">${esc(T(SIT[sit]))}</p><p class="fbt">${ids.map(id=>esc(T(techById(id).n))).join(' → ')}</p></div>`}).join('')}</div>
${focusCard(true)}`}
