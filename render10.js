/* ================= v15 · Super Coaches + Reto de la Semana =================
Modelo de usuario: S.profile.isSuperCoach (bool, verificado) · S.profile.coachReq ('pending'|null)
Votos: {by, stars, chips, comment, at, coach:true?}  → los de coach pesan ×2 en la media y se fijan en «Consejo del Coach»
Revisiones Pro: S.social.reviews {clipId:{at, status:'pending'}}
Reto: id 'ch-<lunes ISO>' · técnica fija por semana · clips participantes con clip.ch === id */
const COACHES={c1:{n:'Prof. Andrés Moya',belt:'negro',deg:2,acad:'turia-bjj-vlc'},c2:{n:'Prof.ª Carla Ibáñez',belt:'negro',deg:1,acad:'raval-jiujitsu-bcn'}};
const COACH_W=2;
/* ---------- reto ---------- */
const CH_ROT=['tijera-guardia-cerrada','escape-montada-codo-rodilla','pase-toreando','triangulo','retencion-guardia','upa'];
function chWeek(){const m=monOf(today());return {mon:m,sun:addD(m,6),key:iso(m)}}
function challenge(){const w=chWeek(),wk=Math.floor((w.mon-new Date(2026,0,5))/(7*864e5));const techId=CH_ROT[(((wk-46)%CH_ROT.length)+CH_ROT.length)%CH_ROT.length];
 const end=new Date(w.sun.getFullYear(),w.sun.getMonth(),w.sun.getDate(),23,59,59);const left=Math.max(0,Math.ceil((end-Date.now())/864e5));return {id:'ch-'+w.key,techId,end,left,wn:curWeek()}}
/* clips de ejemplo extra para el reto (se suman a SEED) */
SEED.push(
{id:'seed-9',techId:'tijera-guardia-cerrada',platform:'youtube',vid:'zXM-s4SeA9Y',belt:'azul',author:'Raquel N.',at:iso(addD(today(),-1)),votes:[{by:'s1',stars:4,chips:['cadera']},{by:'s3',stars:5,chips:['trans']},{by:'c1',coach:true,stars:4,chips:['cadera'],comment:'Buen ángulo antes de cortar. Tira más de la manga al final para que no ponga la mano.',en:'Good angle before cutting. Pull the sleeve more at the end so they can\'t post their hand.'}]},
{id:'seed-10',techId:'tijera-guardia-cerrada',platform:'youtube',vid:'Rq1f-2N-0Ac',belt:'blanco',author:'Mikel A.',at:iso(addD(today(),-2)),votes:[{by:'s2',stars:3,chips:['codos']},{by:'s4',stars:3,chips:['lento']}]});
for(const c of SEED)if(!c.url){c.url='https://www.youtube.com/watch?v='+c.vid;c.seed=true}
Object.assign(SEED.find(c=>c.id==='seed-3'),{at:iso(addD(today(),-3))});
SEED.find(c=>c.id==='seed-2').votes.push({by:'c2',coach:true,stars:4,chips:['cadera'],comment:'Codo bien metido como cuña. Gana más espacio con la gamba antes de meter la rodilla.',en:'Elbow wedged in nicely. Make more space with the shrimp before inserting the knee.'});
SEED.find(c=>c.id==='seed-4').votes.push({by:'c1',coach:true,stars:5,chips:['trans'],comment:'Control de rodillas de libro. Llega a la cadera antes de que reencuadre: nivel competición.',en:'Textbook knee control. Reach the hip before they re-frame: competition level.'});
for(const c of SEED)c.ch=null;
function syncChallengeSeeds(){const ch=challenge();for(const c of SEED)c.ch=c.techId===ch.techId?ch.id:null}
syncChallengeSeeds();
function chEntries(){const ch=challenge();return allClips().filter(c=>c.ch===ch.id)}
function podium(){return chEntries().map(c=>({c,s:clipStats(c)})).filter(x=>x.s.n).sort((a,b)=>b.s.avg-a.s.avg||b.s.n-a.s.n).slice(0,3)}
/* ---------- ranking semanal de karma por academia ---------- */
const ACAD_WEEK={'raval-jiujitsu-bcn':1240,'turia-bjj-vlc':980,'tatami-norte-mad':860,'thames-grappling-lon':720,'tejo-bjj-lis':640,'postiguet-grappling-ali':410,'barrio-grappling-mad':380,'guadalquivir-bjj-sev':300,'poblenou-mat-bcn':150};
function myWeekKarma(){const mon=chWeek().mon.getTime();return soc().log.filter(x=>new Date(x.at).getTime()>=mon).reduce((a,x)=>a+x.pts,0)}
function acadRanking(){const home=prof().acad,mine=Math.max(0,myWeekKarma());return ACADS.map(a=>({a,pts:(ACAD_WEEK[a.id]||0)+(a.id===home?mine:0),home:a.id===home})).sort((x,y)=>y.pts-x.pts)}
/* ---------- UI: reto ---------- */
function challengeCard(compact){const ch=challenge(),t=techById(ch.techId),pd=podium(),n=chEntries().length,mineIn=soc().clips.some(c=>c.ch===ch.id),medal=['🥇','🥈','🥉'];
return `<section class="chcard${compact?' sm':''}"${phSrc('reto')?` style="--chimg:url('${phSrc('reto')}')"`:''}><div class="chtop"><span class="chk">${ic('Flag')} ${L('Reto de la semana','Weekly challenge')}</span><span class="chleft">${ic('Clock')} ${ch.left===1?L('Queda 1 día','1 day left'):L(`Quedan ${ch.left} días`,`${ch.left} days left`)}</span></div>
<h2 class="cht2">${L(`Reto Sem. ${ch.wn}: mejor ejecución de ${T(t.n)}`,`Week ${ch.wn} challenge: best ${T(t.n)}`)}</h2>
<p class="chs">${n} ${n===1?L('participante','entry'):L('participantes','entries')} · ${L('las notas de Super Coach cuentan doble','Super Coach ratings count double')}</p>
${pd.length?`<ol class="podium">${pd.map((x,i)=>`<li><button data-act="ch-clip" data-v="${x.c.id}"><span class="pm">${medal[i]}</span><span class="tb"><span class="tt">${esc(x.c.author)}</span><span class="ts">${x.c.belt?esc(T(BELTS5[x.c.belt]))+' · ':''}${fmtAvg(x.s.avg)} ★ (${x.s.n})</span></span></button></li>`).join('')}</ol>`:`<p class="pr-s">${L('Aún no hay ejecuciones valoradas. ¡La tuya puede ser la primera del podio!','No rated entries yet. Yours could be first on the podium!')}</p>`}
${mineIn?`<p class="cmine">${ic('Check')} ${L('Ya participas. Pide valoraciones en «Valorar clips».','You are in. Get ratings via “Rate clips”.')}</p>`:`<button class="cta chgo" data-act="ch-join">${L('Participar en 1 toque','Join in 1 tap')}</button>`}
${compact?'':`<details class="chrank"><summary>${L('Ranking semanal de karma por academia','Weekly karma ranking by academy')}</summary><ol>${(()=>{const r=acadRanking(),top=r.slice(0,5),hi=r.findIndex(x=>x.home);const rows=top.concat(hi>4?[r[hi]]:[]);return rows.map(x=>`<li class="${x.home?'me':''}"><span>${r.indexOf(x)+1}. ${esc(x.a.n)} <small>${esc(x.a.city)}</small>${x.home?` <span class="pill">${L('Tu academia','Your academy')}</span>`:''}</span><b>${x.pts}</b></li>`).join('')})()}</ol><p class="pr-s">${prof().acad?L('Tus puntos de esta semana suman para tu academia.','Your points this week count for your academy.'):L('Elige tu academia en el perfil para sumar tus puntos.','Pick your academy in your profile to add your points.')}</p></details>`}
</section>`}
/* ---------- UI: consejo del coach + revisión Pro ---------- */
function coachVotes(c){return votesOf(c).filter(v=>v.coach)}
function coachName(v){return v.by==='me'?myName():(COACHES[v.by]||{n:'Super Coach'}).n}
function cmt(v){return S.lang==='en'&&v.en?v.en:v.comment}
function coachBlock(c){const cv=coachVotes(c);if(!cv.length)return '';
return `<div class="coachtip"><p class="ctk">${ic('BadgeCheck')} ${L('Consejo del Coach','Coach\'s advice')}</p>${cv.map(v=>{const co=COACHES[v.by];return `<div class="ctv"><p class="ctn"><b>${esc(coachName(v))}</b> <span class="vbadge">${ic('BadgeCheck')}Super Coach</span>${co?` <small>${esc(T(BELTS5[co.belt]))} ${co.deg}º · ${esc((acadById(co.acad)||{}).n||'')}</small>`:''}</p><p class="ctr">${starsRO(v.stars)} <b>${v.stars}/5</b> · ${esc(T(STARL[v.stars]))}${(v.chips||[]).length?' · '+v.chips.map(k=>FBCHIPS.find(f=>f.k===k).e).join(' '):''}</p>${v.comment?`<p class="ctc">«${esc(cmt(v))}»</p>`:''}</div>`}).join('')}</div>`}
function reviewState(c){return (soc().reviews||{})[c.id]||null}
function reviewBlock(c){if(!c.mine)return '';const r=reviewState(c),cv=coachVotes(c).length;
if(cv)return '';if(r)return `<p class="rvq">${ic('Clock')} ${L('Revisión de Coach solicitada','Coach review requested')} · ${L('un Super Coach te responderá en 48 h como máximo','a Super Coach will reply within 48 h')}</p>`;
return `<button class="cta ghost sm rvbtn" data-act="rv-ask" data-v="${c.id}">${ic('BadgeCheck')} ${L('Pedir revisión de Coach','Request Coach review')}</button>`}
function reviewSheet(c){const t=techById(c.techId),pro=!!S.trial,free=!(soc().reviews&&Object.keys(soc().reviews).length);
return `<div class="modal" role="dialog" aria-modal="true" aria-label="${L('Revisión de Coach','Coach review')}"><button class="mbg" data-act="rv-close" aria-label="${L('Cerrar','Close')}"></button><div class="sheet ksheet rvs">
<span class="pic t-orange">${ic('BadgeCheck')}</span><h2>${L('Revisión prioritaria de Coach','Priority Coach review')}</h2>
<p class="pr-s">${L(`Un cinturón negro verificado revisa tu ${T(t.n).toLowerCase()} y te deja nota, chips y un consejo concreto. Su nota cuenta doble.`,`A verified black belt reviews your ${T(t.n).toLowerCase()} and leaves a rating, chips and one concrete tip. Their rating counts double.`)}</p>
<ul class="rvl"><li>${ic('Check')} ${L('Respuesta en 48 h como máximo','Reply within 48 h')}</li><li>${ic('Check')} ${L('Se fija arriba en «Consejo del Coach»','Pinned on top under “Coach’s advice”')}</li><li>${ic('Check')} ${L('Incluida en osslab Pro · 2 revisiones al mes','Included in osslab Pro · 2 reviews a month')}</li></ul>
<p class="rvp">${pro?L('Incluida en tu prueba Pro','Included in your Pro trial'):free?L('Tu primera revisión es gratis','Your first review is free'):L('4,99 € por revisión o incluida en Pro (9,99 €/mes)','€4.99 per review or included in Pro (€9.99/month)')}</p>
<button class="cta" data-act="rv-confirm" data-v="${c.id}">${pro||free?L('Pedir revisión','Request review'):L('Pedir revisión · 4,99 €','Request review · €4.99')}</button>
<p class="pr-s demo-note">${L('Demo: no se cobra nada y la petición queda en cola hasta que haya servidor y coaches dados de alta.','Demo: nothing is charged and the request stays queued until there is a server and coaches on board.')}</p>
<button class="cta ghost" data-act="rv-close" style="margin-top:6px">${L('Ahora no','Not now')}</button></div></div>`}
function coachProfileBlock(){const p=prof();if(p.isSuperCoach)return `<p class="vbadge lg">${ic('BadgeCheck')}Super Coach ${L('verificado','verified')}</p><p class="pr-s">${L('Tus valoraciones cuentan doble y se fijan como «Consejo del Coach».','Your ratings count double and are pinned as “Coach’s advice”.')}</p>`;
if(myBelt()!=='negro')return '';if(p.coachReq==='pending')return `<p class="rvq">${ic('Clock')} ${L('Verificación de Super Coach en curso: comprobamos tu cinturón con tu academia.','Super Coach verification in progress: we check your belt with your academy.')}</p>`;
return `<button class="cta ghost sm" data-act="coach-req">${ic('BadgeCheck')} ${L('Solicitar verificación de Super Coach','Apply for Super Coach verification')}</button>`}
/* ---------- actions ---------- */
function coachAct(t,act,v){const rr=()=>{save();render();return true},s=soc();
switch(act){
case 'ch-join':{const ch=challenge(),own=s.clips.find(c=>c.techId===ch.techId&&!c.ch);if(own){own.ch=ch.id;S.tab='tec';S.view=null;S.tecOpen=ch.techId;S.tecPane='com';save();render();const el=document.getElementById('clip-'+own.id);if(el&&el.scrollIntoView)el.scrollIntoView({block:'center'});return true}
 S.tab='tec';S.view=null;S.tecOpen=ch.techId;S.tecPane='com';S.socDraft={t:ch.techId,url:'',belt:myBelt(),ch:ch.id};save();render();const i=document.getElementById('soc-url');if(i){i.focus();if(i.scrollIntoView)i.scrollIntoView({block:'center'})}return true}
case 'ch-clip':{const c=clipById(v);if(!c)return true;S.tab='tec';S.view=null;S.tecOpen=c.techId;S.tecPane='com';save();render();const el=document.getElementById('clip-'+v);if(el&&el.scrollIntoView)el.scrollIntoView({block:'center'});return true}
case 'rv-ask':S.rvOpen=v;return rr();
case 'rv-close':S.rvOpen=null;return rr();
case 'rv-confirm':s.reviews=Object.assign({},s.reviews,{[v]:{at:new Date().toISOString(),status:'pending'}});S.rvOpen=null;return rr();
case 'coach-req':prof().coachReq='pending';return rr();
}return false}
document.addEventListener('change',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.act==='dev-coach'){prof().isSuperCoach=t.checked;save();render()}});
