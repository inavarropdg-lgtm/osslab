/* ================= v14 · Perfil de atleta + Academias / Open Mats =================
S.profile  {name, sex:'m'|'f', weight, cat, acad, acadTxt, city}  (cinturón y grados se sincronizan con S.a)
S.mastered {techId:true}   S.checkins [{acad, date}]   S.threads {acadId:[{me:true, txt, at}]} */
const DOW_ES=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'],DOW_EN=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const dowName=i=>S.lang==='en'?DOW_EN[i]:DOW_ES[i];
const DROP={abierto:{es:'Drop-in abierto',en:'Open drop-in'},avisar:{es:'Avisa antes de venir',en:'Message before coming'},miembros:{es:'Solo miembros e invitados',en:'Members and guests only'}};
/* academias de ejemplo (nombres ficticios) */
const ACADS=[
{id:'tatami-norte-mad',n:'Tatami Norte BJJ',city:'Madrid',cc:'ES',area:'Chamberí',om:[{d:5,h:'11:00–13:00',k:'gi'}],drop:'abierto',fee:'10 €',mats:'Gi y no-gi',ath:[{n:'Carlos V.',b:'morado'},{n:'Lucía R.',b:'azul'},{n:'Héctor F.',b:'blanco'}]},
{id:'barrio-grappling-mad',n:'Barrio Grappling Club',city:'Madrid',cc:'ES',area:'Lavapiés',om:[{d:6,h:'10:30–12:30',k:'nogi'},{d:2,h:'20:00–21:30',k:'nogi'}],drop:'avisar',fee:'Gratis el domingo',mats:'No-gi',ath:[{n:'Iván M.',b:'azul'},{n:'Sara D.',b:'marron'}]},
{id:'raval-jiujitsu-bcn',n:'Raval Jiu-Jitsu',city:'Barcelona',cc:'ES',area:'El Raval',om:[{d:5,h:'12:00–14:00',k:'gi'}],drop:'abierto',fee:'12 €',mats:'Gi',ath:[{n:'Jordi P.',b:'negro'},{n:'Marta C.',b:'azul'},{n:'Àlex B.',b:'blanco'},{n:'Nil G.',b:'morado'}]},
{id:'poblenou-mat-bcn',n:'Poblenou Mat Lab',city:'Barcelona',cc:'ES',area:'Poblenou',om:[],drop:'miembros',fee:'—',mats:'Gi y no-gi',ath:[{n:'Oriol S.',b:'azul'}]},
{id:'turia-bjj-vlc',n:'Túria BJJ',city:'Valencia',cc:'ES',area:'Benimaclet',om:[{d:5,h:'10:00–12:00',k:'gi'},{d:3,h:'21:00–22:00',k:'nogi'}],drop:'abierto',fee:'8 €',mats:'Gi y no-gi',ath:[{n:'Pau R.',b:'azul'},{n:'Elena V.',b:'morado'},{n:'Toni L.',b:'blanco'}]},
{id:'postiguet-grappling-ali',n:'Postiguet Grappling',city:'Alicante',cc:'ES',area:'Centro',om:[{d:5,h:'10:30–12:30',k:'nogi'}],drop:'abierto',fee:'Gratis',mats:'No-gi',ath:[{n:'Rubén A.',b:'azul'},{n:'Nuria P.',b:'blanco'}]},
{id:'tejo-bjj-lis',n:'Tejo Jiu-Jitsu',city:'Lisboa',cc:'PT',area:'Alcântara',om:[{d:5,h:'11:00–13:00',k:'gi'}],drop:'abierto',fee:'15 €',mats:'Gi',ath:[{n:'João M.',b:'marron'},{n:'Inês S.',b:'azul'}]},
{id:'thames-grappling-lon',n:'Thames Grappling Co.',city:'Londres',cc:'GB',area:'Bermondsey',om:[{d:6,h:'12:00–14:00',k:'nogi'},{d:4,h:'18:30–20:00',k:'gi'}],drop:'avisar',fee:'£15',mats:'Gi y no-gi',ath:[{n:'Tom H.',b:'morado'},{n:'Priya K.',b:'azul'},{n:'Dan W.',b:'blanco'}]},
{id:'guadalquivir-bjj-sev',n:'Guadalquivir BJJ',city:'Sevilla',cc:'ES',area:'Triana',om:[{d:5,h:'10:00–12:00',k:'gi'}],drop:'avisar',fee:'10 €',mats:'Gi',ath:[{n:'Álvaro J.',b:'azul'}]}];
const acadById=id=>ACADS.find(a=>a.id===id);
const QUICKMSG=[
{es:'¡Buenas! Voy a estar por la ciudad este finde, ¿se puede pasar al Open Mat?',en:'Hi! I\'ll be in town this weekend, can I join the Open Mat?'},
{es:'Hola, ¿cuánto cuesta el drop-in y hace falta reservar?',en:'Hi, how much is the drop-in and do I need to book?'},
{es:'¿El Open Mat es con kimono o no-gi? Quiero traer lo correcto.',en:'Is the Open Mat gi or no-gi? I want to bring the right kit.'},
{es:'Soy cinturón {belt} de visita, ¿os va bien que entrene con vosotros?',en:'I\'m a visiting {belt} belt, is it ok if I train with you?'}];
/* categorías IBJJF adulto con kimono (aprox.) */
const CATM=[[57.5,{es:'Gallo',en:'Rooster'}],[64,{es:'Pluma',en:'Light feather'}],[70,{es:'Pena',en:'Feather'}],[76,{es:'Ligero',en:'Light'}],[82.3,{es:'Medio',en:'Middle'}],[88.3,{es:'Medio-pesado',en:'Medium heavy'}],[94.3,{es:'Pesado',en:'Heavy'}],[100.5,{es:'Superpesado',en:'Super heavy'}],[999,{es:'Pesadísimo',en:'Ultra heavy'}]];
const CATF=[[48.5,{es:'Gallo',en:'Rooster'}],[53.5,{es:'Pluma',en:'Light feather'}],[58.5,{es:'Pena',en:'Feather'}],[64,{es:'Ligero',en:'Light'}],[69,{es:'Medio',en:'Middle'}],[74,{es:'Medio-pesado',en:'Medium heavy'}],[79.3,{es:'Pesado',en:'Heavy'}],[999,{es:'Superpesado',en:'Super heavy'}]];
function catFor(kg,sex){if(!kg)return null;const t=sex==='f'?CATF:CATM;for(const [lim,n] of t)if(kg<=lim)return {n,lim};return null}
function prof(){if(!S.profile)S.profile={name:'',sex:'m',weight:S.a&&S.a.weight?+S.a.weight:null,acad:null,acadTxt:'',city:''};return S.profile}
function myBelt(){return (S.a&&S.a.belt)||prof().belt||'blanco'}
function myStripes(){return +((S.a&&S.a.stripes)||prof().stripes||0)}
function myName(){return prof().name||L('Atleta osslab','osslab athlete')}
function initials(n){return (n||'?').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0].toUpperCase()).join('')||'O'}
function beltBar(b,st){return `<span class="bbar l-${b}"><span class="bbtip">${'<i></i>'.repeat(st||0)}</span></span>`}
function mastered(){const m=Object.keys(S.mastered||{}).filter(k=>S.mastered[k]&&techById(k));for(const c of soc().clips){const s=clipStats(c);if(s.n>=2&&s.avg>=4&&!m.includes(c.techId))m.push(c.techId)}return m}
function nextDate(d){const t=today(),dw=dowOf(t);let k=(d-dw+7)%7;return addD(t,k)}
function myCheckins(){const td=iso(today());return (S.checkins||[]).filter(c=>c.date>=td)}
function whoAt(a){const td=iso(today()),me=[];if(prof().acad===a.id)me.push({n:myName(),b:myBelt(),me:true,tag:L('habitual','regular')});
for(const c of (S.checkins||[]).filter(c=>c.acad===a.id&&c.date>=td))me.push({n:myName(),b:myBelt(),me:true,tag:fmtDay(c.date)});return me.concat(a.ath)}
function fmtDay(ds){const d=new Date(ds+'T12:00:00'),t=iso(today());if(ds===t)return L('hoy','today');if(ds===iso(addD(today(),1)))return L('mañana','tomorrow');return dowName(dowOf(d)).toLowerCase()+' '+d.getDate()}
/* ---------- header avatar ---------- */
function avatarBtn(){return `<button class="pav" data-act="prof-open" aria-label="${L('Mi perfil','My profile')}"><span>${esc(initials(prof().name||'osslab'))}</span>${beltBar(myBelt(),0)}</button>`}
/* ---------- profile view ---------- */
function profileView(){const p=prof(),k=soc().karma,m=mastered(),mine=soc().clips,c=catFor(p.weight,p.sex),home=acadById(p.acad),ci=myCheckins(),th=Object.keys(S.threads||{}).filter(id=>(S.threads[id]||[]).length);
const avgMine=(()=>{const v=mine.map(clipStats).filter(s=>s.n);return v.length?v.reduce((a,s)=>a+s.avg,0)/v.length:null})();
return `<div class="pad prof"><button class="link tback" data-act="view-close">${ic('ArrowLeft')} ${L('Volver','Back')}</button>
<section class="pr-card phead"><span class="pav lg"><span>${esc(initials(p.name||'osslab'))}</span></span><div class="phb"><h1 class="display sm">${esc(myName())}</h1>
<p class="pr-s">${beltBar(myBelt(),myStripes())} ${esc(T(BELTS5[myBelt()]))}${myStripes()?` · ${myStripes()} ${myStripes()===1?L('grado','stripe'):L('grados','stripes')}`:''}</p>
<p class="pr-s">${[p.weight?`${fmt(p.weight)} kg${c?' · '+esc(T(c.n)):''}`:'',home?esc(home.n):p.acadTxt?esc(p.acadTxt):'',p.city?esc(p.city):''].filter(Boolean).join(' · ')||L('Completa tu perfil para que otros atletas te encuentren.','Complete your profile so other athletes can find you.')}</p></div>
<button class="kadd" data-act="prof-edit">${L('Editar','Edit')}</button></section>
${coachProfileBlock()}<div class="pstats"><button class="pst" data-act="karma-open"><b>${k}</b><span>Karma</span></button><div class="pst"><b>${m.length}</b><span>${L('Técnicas dominadas','Techniques mastered')}</span></div><div class="pst"><b>${mine.length}</b><span>${L('Ejecuciones','Executions')}${avgMine!=null?` · ${fmtAvg(avgMine)} ★`:''}</span></div></div>
<p class="pg-h">${L('Técnicas dominadas','Techniques mastered')}</p>
${m.length?`<div class="pgroup">${m.map(id=>techRow(techById(id))).join('')}</div>`:`<p class="pr-s">${L('Marca «La domino» en cualquier ficha del árbol, o consigue 4★ de media en una ejecución tuya.','Tap “I’ve got it” on any card in the tree, or get a 4★ average on one of your executions.')}</p>`}
<p class="pg-h">${L('Mis ejecuciones','My executions')}</p>
${mine.length?`<div class="pgroup">${mine.map(c=>{const t=techById(c.techId),s=clipStats(c);return `<button class="trow" data-act="tec-com" data-v="${t.id}"><span class="pic sm t-orange">${ic('Play')}</span><span class="tb"><span class="tt">${esc(T(t.n))}</span><span class="ts">${esc(PLAT[c.platform])} · ${s.n?fmtAvg(s.avg)+' ★ ('+s.n+')':L('sin valoraciones aún','no ratings yet')}</span></span><span class="pch">${ic('ChevronRight')}</span></button>`}).join('')}</div>`:`<p class="pr-s">${L('Sube tu primera ejecución desde la pestaña Comunidad de una técnica (+10 karma).','Upload your first execution from a technique’s Community tab (+10 karma).')}</p>`}
<p class="pg-h">${L('Dónde entreno','Where I train')}</p>
<div class="pgroup">${home?acadRow(home):''}${ci.map(x=>{const a=acadById(x.acad);return a?`<button class="trow" data-act="acad-open" data-v="${a.id}"><span class="pic sm t-indigo">${ic('MapPin')}</span><span class="tb"><span class="tt">${esc(a.n)}</span><span class="ts">${L('Voy a ir','Going')} · ${esc(fmtDay(x.date))}</span></span><span class="pch">${ic('ChevronRight')}</span></button>`:''}).join('')}
<button class="trow" data-act="acad-list"><span class="pic sm t-sky">${ic('Search')}</span><span class="tb"><span class="tt">${L('Academias y Open Mats','Academies and Open Mats')}</span><span class="ts">${ACADS.filter(a=>a.om.length).length} ${L('con open mat','with open mat')} · ${ACADS.length} ${L('academias','academies')}</span></span><span class="pch">${ic('ChevronRight')}</span></button></div>
${th.length?`<p class="pg-h">${L('Mis mensajes','My messages')}</p><div class="pgroup">${th.map(id=>{const a=acadById(id),last=S.threads[id][S.threads[id].length-1];return `<button class="trow" data-act="msg-open" data-v="${id}"><span class="pic sm t-slate">${ic('Users')}</span><span class="tb"><span class="tt">${esc(a.n)}</span><span class="ts">${esc(last.txt.slice(0,60))}${last.txt.length>60?'…':''}</span></span><span class="pch">${ic('ChevronRight')}</span></button>`}).join('')}</div>`:''}
<button class="cta ghost" data-act="start-ob" style="margin-top:22px">${L('Empezar un plan nuevo','Start a new plan')}</button>
</div>`}
function profEditSheet(){const d=S.pedit;const c=catFor(d.weight,d.sex);
return `<div class="modal" role="dialog" aria-modal="true" aria-label="${L('Editar perfil','Edit profile')}"><button class="mbg" data-act="prof-cancel" aria-label="${L('Cerrar','Close')}"></button><div class="sheet ksheet pedit">
<h2>${L('Tu perfil','Your profile')}</h2>
<label class="fld"><span>${L('Nombre','Name')}</span><input id="pe-name" maxlength="40" autocomplete="name" value="${esc(d.name||'')}" placeholder="${L('Cómo te verán en el tatami','How you will appear')}"></label>
<div class="fld"><span>${L('Cinturón','Belt')}</span><div class="beltpick">${Object.entries(BELTS5).map(([k,v])=>`<button data-act="pe-belt" data-v="${k}" aria-pressed="${d.belt===k}"><i class="bd l-${k}"></i>${esc(T(v))}</button>`).join('')}</div></div>
<div class="fld"><span>${L('Grados','Stripes')}</span><div class="stripes5">${[0,1,2,3,4].map(n=>`<button data-act="pe-stripes" data-v="${n}" aria-pressed="${d.stripes===n}" aria-label="${n}">${beltBar(d.belt,n)}<small>${n}</small></button>`).join('')}</div></div>
<div class="fld"><span>${L('Peso','Weight')}</span><div class="ksb"><button data-act="pe-w" data-v="-5">−5</button><button data-act="pe-w" data-v="-1" aria-label="-1">${ic('Minus')}</button><b>${d.weight?fmt(d.weight):'—'}<small> kg</small></b><button data-act="pe-w" data-v="1" aria-label="+1">${ic('Plus')}</button><button data-act="pe-w" data-v="5">+5</button></div>
<div class="seg2"><button data-act="pe-sex" data-v="m" aria-pressed="${d.sex!=='f'}">${L('Masculino','Men')}</button><button data-act="pe-sex" data-v="f" aria-pressed="${d.sex==='f'}">${L('Femenino','Women')}</button></div>
<p class="pr-s">${c?L(`Categoría IBJJF con kimono (aprox.): <b>${T(c.n)}</b>${c.lim<999?` · hasta ${fmt(c.lim)} kg`:''}`,`IBJJF gi division (approx.): <b>${T(c.n)}</b>${c.lim<999?` · up to ${fmt(c.lim)} kg`:''}`):L('Ajusta tu peso para ver tu categoría.','Set your weight to see your division.')}</p></div>
<div class="fld"><span>${L('Academia base','Home academy')}</span><div class="acpick">${ACADS.map(a=>`<button data-act="pe-acad" data-v="${a.id}" aria-pressed="${d.acad===a.id}">${esc(a.n)} <small>${esc(a.city)}</small></button>`).join('')}<button data-act="pe-acad" data-v="otra" aria-pressed="${d.acad==='otra'}">${L('Otra','Other')}</button></div>
${d.acad==='otra'?`<input id="pe-acadtxt" maxlength="60" value="${esc(d.acadTxt||'')}" placeholder="${L('Nombre de tu academia','Your academy name')}">`:''}</div>
<label class="fld"><span>${L('Ciudad','City')}</span><input id="pe-city" maxlength="40" autocomplete="address-level2" value="${esc(d.city||'')}" placeholder="Alicante"></label>
<button class="cta" data-act="prof-save">${L('Guardar perfil','Save profile')}</button><button class="cta ghost" data-act="prof-cancel" style="margin-top:8px">${L('Cancelar','Cancel')}</button></div></div>`}
/* ---------- academies ---------- */
function acadRow(a){const om=a.om.length,home=prof().acad===a.id,ci=myCheckins().find(x=>x.acad===a.id);
return `<button class="trow" data-act="acad-open" data-v="${a.id}"><span class="pic sm ${om?'t-orange':'t-slate'}">${ic('MapPin')}</span><span class="tb"><span class="tt">${esc(a.n)}${home?` <span class="pill ok">${L('Mi academia','My academy')}</span>`:''}${ci?` <span class="pill">${L('Vas','Going')} ${esc(fmtDay(ci.date))}</span>`:''}</span><span class="ts">${esc(a.city)} · ${esc(a.area)} · ${om?a.om.map(o=>dowName(o.d).slice(0,3)+' '+o.h.split('–')[0]).join(', '):L('sin open mat','no open mat')}</span></span><span class="pch">${ic('ChevronRight')}</span></button>`}
function acadListView(){const q=(S.acQ||'').trim(),om=!!S.acOM,norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const list=ACADS.filter(a=>(!om||a.om.length)&&(!q||norm(a.n+' '+a.city+' '+a.area).includes(norm(q)))).sort((a,b)=>(prof().city&&norm(b.city)===norm(prof().city))-(prof().city&&norm(a.city)===norm(prof().city))||a.city.localeCompare(b.city));
return `<div class="pad"><button class="link tback" data-act="${S.acFrom==='prof'?'prof-open':'view-close'}">${ic('ArrowLeft')} ${S.acFrom==='prof'?L('Perfil','Profile'):'Pro-Lab'}</button>
<header class="pr-h"><h1>${L('Academias y Open Mats','Academies and Open Mats')}</h1><p>${L('Entrena donde viajes. Mira quién va y pregunta en 1 toque.','Train wherever you travel. See who is going and ask in 1 tap.')}</p></header>
<label class="tsearch">${ic('Search')}<input id="ac-q" type="search" placeholder="${L('Ciudad o academia: Lisboa, Túria…','City or academy: Lisbon, Túria…')}" value="${esc(S.acQ||'')}" autocomplete="off"></label>
<label class="tog acom"><input type="checkbox" data-act="ac-om" ${om?'checked':''}><span>${L('Tienen Open Mat','Has Open Mat')}</span></label>
<p class="pg-h">${list.length} ${list.length===1?L('academia','academy'):L('academias','academies')}</p>
${list.length?`<div class="pgroup">${list.map(acadRow).join('')}</div>`:`<p class="pr-s">${L('Ninguna coincide. Prueba con otra ciudad o quita el filtro.','No matches. Try another city or remove the filter.')}</p>`}
<p class="pr-s demo-note">${L('Academias de ejemplo con nombres ficticios. Las academias reales entrarán cuando se den de alta en osslab.','Sample academies with fictional names. Real academies will appear once they join osslab.')}</p></div>`}
function acadDetail(a){const home=prof().acad===a.id,who=whoAt(a),ci=myCheckins().find(x=>x.acad===a.id),days=a.om.map(o=>({o,date:iso(nextDate(o.d))})).sort((x,y)=>x.date<y.date?-1:1);
return `<div class="pad acd"><button class="link tback" data-act="acad-list">${ic('ArrowLeft')} ${L('Academias','Academies')}</button>
<p class="tcat">${esc(a.city)} · ${esc(a.area)}</p><h1 class="display sm">${esc(a.n)}</h1>
<div class="tconn"><span class="pill ${a.drop==='abierto'?'ok':a.drop==='avisar'?'lo':''}">${esc(T(DROP[a.drop]))}</span><span class="pill">${esc(a.mats)}</span><span class="pill">Drop-in: ${esc(a.fee)}</span></div>
<section class="pr-card" style="margin-top:14px"><p class="pr-t2">Open Mat</p>${a.om.length?`<ul class="omlist">${days.map(({o,date})=>`<li><span><b>${esc(dowName(o.d))}</b> · ${esc(o.h)} · ${o.k==='gi'?L('Kimono','Gi'):'No-gi'}</span>${ci&&ci.date===date?`<button class="kadd" data-act="acad-uncheck" data-v="${a.id}">${ic('Check')}${L('Vas','Going')}</button>`:`<button class="kadd" data-act="acad-check" data-v="${a.id}" data-d="${date}">${L('Voy a ir','I\'m going')} · ${esc(fmtDay(date))}</button>`}</li>`).join('')}</ul>`:`<p class="pr-s">${L('No tiene open mat. Pregunta por una clase como visitante.','No open mat. Ask about joining a class as a visitor.')}</p>`}</section>
<div class="acbtns"><button class="cta${home?' ghost':''}" data-act="acad-home" data-v="${a.id}">${home?`${ic('Check')} ${L('Mi academia habitual','My regular academy')}`:L('Marcar como mi academia habitual','Set as my regular academy')}</button>
<button class="cta ghost" data-act="msg-open" data-v="${a.id}">${L('Preguntar sobre Drop-in / Open Mat','Ask about Drop-in / Open Mat')}</button></div>
<p class="pg-h">${L('Atletas de osslab que entrenan aquí','osslab athletes who train here')} · ${who.length}</p>
<div class="pgroup">${who.map(x=>`<div class="arow"><span class="ava sm"><b>${esc(initials(x.n))}</b></span><span class="tb"><span class="tt">${esc(x.n)}${x.me&&prof().isSuperCoach?` <span class="vbadge">${ic('BadgeCheck')}Coach</span>`:''}${x.me?` <span class="pill">${L('Tú','You')}${x.tag?' · '+esc(x.tag):''}</span>`:''}</span><span class="ts">${beltBar(x.b,0)} ${esc(T(BELTS5[x.b]))}</span></span></div>`).join('')}</div>
<p class="pr-s demo-note">${L('Academia y atletas de ejemplo.','Sample academy and athletes.')}</p></div>`}
function msgSheet(a){const th=(S.threads||{})[a.id]||[],belt=T(BELTS5[myBelt()]).toLowerCase(),fill=m=>T(m).replace('{belt}',belt);
return `<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(a.n)}"><button class="mbg" data-act="msg-close" aria-label="${L('Cerrar','Close')}"></button><div class="sheet ksheet msgs">
<h2>${esc(a.n)}</h2><p class="pr-s">${L('Toca un mensaje para enviarlo.','Tap a message to send it.')}</p>
${th.length?`<div class="thread">${th.map((m,i)=>`<div class="bub"><p>${esc(m.txt)}</p><span>${new Date(m.at).toLocaleString(S.lang==='en'?'en-GB':'es-ES',{weekday:'short',hour:'2-digit',minute:'2-digit'})} · ${L('pendiente de respuesta','awaiting reply')}</span><button class="link" data-act="msg-copy" data-v="${i}" data-a="${a.id}">${S.copied===a.id+':'+i?`${ic('Check')} ${L('Copiado','Copied')}`:L('Copiar','Copy')}</button></div>`).join('')}</div>`:''}
<div class="qmsg">${QUICKMSG.map((m,i)=>`<button data-act="msg-send" data-v="${i}" data-a="${a.id}">${esc(fill(m))}</button>`).join('')}</div>
<p class="pr-s demo-note">${L('Demo sin servidor: el mensaje queda guardado aquí y puedes copiarlo para enviarlo por WhatsApp o Instagram a la academia.','Demo without a server: the message is saved here and you can copy it to send to the academy by WhatsApp or Instagram.')}</p>
<button class="cta ghost" data-act="msg-close">${L('Cerrar','Close')}</button></div></div>`}
/* ---------- router helpers ---------- */
function viewHTML(){if(S.view==='prof')return profileView();if(S.view==='acad'){const a=S.acadOpen&&acadById(S.acadOpen);return a?acadDetail(a):acadListView()}return null}
function overlays(){return (S.rvOpen&&clipById(S.rvOpen)?reviewSheet(clipById(S.rvOpen)):'')+(S.pedit?profEditSheet():'')+(S.msgOpen&&acadById(S.msgOpen)?msgSheet(acadById(S.msgOpen)):'')}
/* ---------- actions ---------- */
function profAct(t,act,v){const rr=()=>{save();render();return true},top=()=>{save();render();window.scrollTo(0,0);return true};
switch(act){
case 'prof-open':S.view='prof';S.acadOpen=null;S.tecOpen=null;S.plOpen=null;S.play=null;S.karmaOpen=false;return top();
case 'view-close':S.view=null;S.acadOpen=null;return top();
case 'prof-edit':{const p=prof();S.pedit={name:p.name,belt:myBelt(),stripes:myStripes(),weight:p.weight||(S.a&&S.a.weight?+S.a.weight:null),sex:p.sex||'m',acad:p.acad||(p.acadTxt?'otra':null),acadTxt:p.acadTxt||'',city:p.city||''};return rr()}
case 'prof-cancel':S.pedit=null;return rr();
case 'pe-belt':S.pedit.belt=v;return rr();
case 'pe-stripes':S.pedit.stripes=+v;return rr();
case 'pe-w':{const w=S.pedit.weight||75;S.pedit.weight=Math.max(35,Math.min(200,w+(+v)));return rr()}
case 'pe-sex':S.pedit.sex=v;return rr();
case 'pe-acad':S.pedit.acad=S.pedit.acad===v?null:v;return rr();
case 'prof-save':{const d=S.pedit,p=prof();p.name=(d.name||'').trim().slice(0,40);p.sex=d.sex;p.weight=d.weight||null;p.acad=d.acad&&d.acad!=='otra'?d.acad:null;p.acadTxt=d.acad==='otra'?(d.acadTxt||'').trim().slice(0,60):'';p.city=(d.city||'').trim().slice(0,40);p.belt=d.belt;p.stripes=String(d.stripes||0);
 if(S.a){S.a.belt=d.belt;S.a.stripes=String(d.stripes||0);if(d.weight)S.a.weight=d.weight}S.pedit=null;return rr()}
case 'acad-list':if(t.closest&&t.closest('.prof'))S.acFrom='prof';else if(t.closest&&t.closest('.plbtn'))S.acFrom='prolab';S.view='acad';S.acadOpen=null;return top();
case 'acad-open':S.view='acad';S.acadOpen=v;return top();
case 'acad-home':{const p=prof();p.acad=p.acad===v?null:v;if(p.acad)p.acadTxt='';return rr()}
case 'acad-check':{S.checkins=(S.checkins||[]).filter(c=>!(c.acad===v&&c.date===t.dataset.d));S.checkins.push({acad:v,date:t.dataset.d});return rr()}
case 'acad-uncheck':{const td=iso(today());S.checkins=(S.checkins||[]).filter(c=>!(c.acad===v&&c.date>=td));return rr()}
case 'msg-open':S.msgOpen=v;S.copied=null;return rr();
case 'msg-close':S.msgOpen=null;S.copied=null;return rr();
case 'msg-send':{const a=t.dataset.a,m=QUICKMSG[+v],txt=T(m).replace('{belt}',T(BELTS5[myBelt()]).toLowerCase());S.threads=Object.assign({},S.threads);S.threads[a]=(S.threads[a]||[]).concat([{me:true,txt,at:new Date().toISOString()}]);return rr()}
case 'msg-copy':{const a=t.dataset.a,m=((S.threads||{})[a]||[])[+v];if(m){try{const p=navigator.clipboard&&navigator.clipboard.writeText(m.txt);if(p&&p.catch)p.catch(()=>{})}catch(e){}S.copied=a+':'+v}return rr()}
case 'tec-master':S.mastered=Object.assign({},S.mastered,{[v]:!(S.mastered||{})[v]});return rr();
}return false}
document.addEventListener('input',e=>{const t=e.target;if(!t)return;
if(S.pedit){if(t.id==='pe-name')S.pedit.name=t.value;if(t.id==='pe-city')S.pedit.city=t.value;if(t.id==='pe-acadtxt')S.pedit.acadTxt=t.value}
if(t.id==='ac-q'){S.acQ=t.value;render();const i=document.getElementById('ac-q');if(i){i.focus();const n=i.value.length;try{i.setSelectionRange(n,n)}catch(_){}}}});
document.addEventListener('change',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.act==='ac-om'){S.acOM=t.checked;save();render()}});
