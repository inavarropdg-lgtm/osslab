/* ================= state ================= */
let S={lang:'es',phaseApp:true,tab:'hoy',ob:null,goals:[],focus:null,a:null,example:true,
start:null,startWeek:1,log:{mat:[],ses:[]},ex:{},fb:{},ms:{},tests:{},ck:{},ckEdit:false,
live:null,play:null,lastSum:null,mf:{type:'tecnica',day:0,min:90,rpe:5},mfOk:false,open:{},vfilter:'todos',vsel:null};
let D={};
function save(){try{localStorage.setItem('rendai-v17',JSON.stringify({lang:S.lang,phaseApp:S.phaseApp,tab:S.tab,ob:S.ob,goals:S.goals,focus:S.focus,a:S.a,example:S.example,start:S.start,startWeek:S.startWeek,log:S.log,ex:S.ex,fb:S.fb,ms:S.ms,tests:S.tests,ck:S.ck,live:S.live,play:S.play,mf:S.mf,open:S.open,vfilter:S.vfilter,cls:S.cls,clsLast:S.clsLast,trial:S.trial,remind:S.remind,school:S.school,uploads:S.uploads,account:S.account,notifAsked:S.notifAsked,healthAsked:S.healthAsked,health:S.health,locAsked:S.locAsked,loc:S.loc,tecCat:S.tecCat,tecLvl:S.tecLvl,social:S.social,profile:S.profile,mastered:S.mastered,checkins:S.checkins,threads:S.threads,tecOpen:S.tecOpen,socialInt:S.socialInt,plsec:S.plsec,plview:S.plview,plOpen:S.plOpen,redeem:S.redeem,plMute:S.plMute,plLater:S.plLater,plConsent:S.plConsent,painLog:S.painLog}));S.saveErr=false}catch(e){S.saveErr=true}}
function load(){try{const r=localStorage.getItem('rendai-v17');if(r){const o=JSON.parse(r);if(o&&(o.a||o.ob))Object.assign(S,o)}}catch(e){}}

/* ================= icons ================= */
const IC={
comp:'<path d="M6 3h12v3a6 6 0 0 1-12 0V3Z"/><path d="M12 12v4m-3 4h6m-5 0a3 3 0 0 1 4 0"/><path d="M6 5H3v1a4 4 0 0 0 4 4M18 5h3v1a4 4 0 0 1-4 4"/>',
injury:'<path d="M12 21s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.4-7 10-7 10Z"/><path d="M9 11h2l1-2 1 4 1-2h2"/>',
strategy:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
train:'<path d="M4 9v6M8 7v10M20 9v6M16 7v10M8 12h8"/>',
engine:'<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
mind:'<path d="M9 3a5 5 0 0 1 5 4 4 4 0 0 1 3 7 4 4 0 0 1-7 2 4 4 0 0 1-6-4 4 4 0 0 1 1-8 3 3 0 0 1 1-1Z"/><path d="M11 7v10"/>',
hoy:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9h14v-9"/><path d="M9 19v-5h6v5"/>',
plan:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 4v16M4 9h4M4 14h4"/>',
prog:'<path d="M4 19V5M4 19h16"/><path d="M8 16l3-4 3 2 4-6"/>',
equipo:'<circle cx="12" cy="9" r="2.5"/><path d="M12 11.5c-3 0-5 2-5 4.5M12 3a6 6 0 0 1 6 6c0 4-6 11-6 11"/>'};
const svg=(n,c='currentColor')=>`<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;

/* ================= shell ================= */
function render(){
document.documentElement.lang=S.lang;
const sess=S.phaseApp&&S.tab==='hoy'&&S.play&&S.play.open;
document.body.className=(S.phaseApp?'phase-app':'phase-onboard')+(sess?' insess':'');
const app=$('#app');
const err=S.saveErr?`<div class="savebar" role="alert"><span>${L('No se ha podido guardar en este dispositivo.','Could not save on this device.')}</span><button data-act="retry-save">${L('Reintentar','Retry')}</button></div>`:'';
if(!S.phaseApp){app.innerHTML=err+obHTML();return}
app.innerHTML=err+(sess?'':barHTML())+`<div class="scr">${viewHTML()||(S.tab==='hoy'?hoyTab():S.tab==='plan'?planTab():S.tab==='prog'?progTab():S.tab==='tec'?tecTab():S.tab==='com'?comTab():proLabTab())}</div>`+(sess?'':tabbar())+(S.confirmNew?confirmSheet():'')+(S.karmaOpen?karmaSheet():'')+overlays();
}
function confirmSheet(){const n=(S.log.ses||[]).length+(S.log.mat||[]).length;return `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="cm-t"><div class="sheet"><h2 id="cm-t">${L('¿Empezar un plan nuevo?','Start a new plan?')}</h2><p>${L(`Cuando termines el cuestionario nuevo, tu plan actual y su historial (${n} sesiones y clases registradas) se sustituirán. Si te vuelves atrás antes de terminar, no se pierde nada.`,`When you finish the new survey, your current plan and its history (${n} sessions and classes logged) will be replaced. If you go back before finishing, nothing is lost.`)}</p><button class="cta" data-act="confirm-new">${L('Sí, empezar de cero','Yes, start over')}</button><button class="cta ghost" data-act="cancel-new">${L('Cancelar','Cancel')}</button></div></div>`}
function barHTML(){const w=curWeek();
return `<header class="bar"><span class="wm" aria-label="osslab" role="img">${osslabLogo(28)}</span><span class="wbadge">${L('Sem.','Wk')} ${w}/12</span>${karmaBadge()}<span class="sp"></span>${avatarBtn()}${langToggle()}</header>`}
function langToggle(){return `<span class="lang" role="group" aria-label="${L('Idioma','Language')}"><button data-act="lang" data-v="es" aria-pressed="${S.lang==='es'}">ES</button><button data-act="lang" data-v="en" aria-pressed="${S.lang==='en'}">EN</button></span>`}
function tabbar(){const tabs=[['hoy',L('Hoy','Today')],['plan',L('Plan','Plan')],['prog',L('Progreso','Progress')],['tec',L('Técnica','Technique')],['equipo','Pro-Lab']];
return `<nav class="tabbar" aria-label="${L('Navegación','Navigation')}">${tabs.map(([k,n])=>`<button data-act="tab" data-v="${k}" aria-current="${S.tab===k?'page':'false'}"><span class="ic">${ic({hoy:'House',plan:'CalendarDays',prog:'ChartColumn',tec:'BookOpen',equipo:'ShieldCheck'}[k])}${S.tab===k?led('on'):''}</span>${esc(n)}</button>`).join('')}</nav>`}

/* ================= onboarding ================= */
function obStepList(){const g=(S.ob.goals||[]);const loses=(S.ob.a&&S.ob.a.lose||[]).filter(x=>x!=='nada');
let base=['goals','modal','belt','datos','style','fav','lose'];
base=base.concat(loses.map(s=>'why:'+s));
base=base.concat(['gas','mob','pull','pain','rest','days','time']);
base=base.concat((S.ob.goals||[]).map(x=>'goal:'+x));
return base}
function obHTML(){
const o=S.ob;
if(!o){return welcomeHTML()}
if(o.step==='p1')return obP1();if(o.step==='p2')return obP2();if(o.step==='p3')return obP3();if(o.step==='p4')return obP4();
if(o.step==='survey')return obSurvey();
if(o.step==='plans')return obPlans();
if(o.step==='mode')return obMode();
if(o.step==='done')return obDone();
return welcomeHTML()}
function welcomeHTML(){
return `<div class="scr hero-img wel ${phCls('welcome')}"${phStyle('welcome')}>
<div class="pad" style="display:flex;align-items:center"><span class="wm" aria-label="osslab" role="img">${osslabLogo(28)}</span><span class="sp" style="margin-left:auto"></span>${langToggle()}</div>
<div class="pad" style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:18px">
<h1 class="display">${L('Tu sistema completo de evolución en BJJ','Your complete BJJ evolution system')}</h1>
<p class="wsub">${L('Domina tu juego en el tatami, paso a paso.','Master your game on the mat, step by step.')}</p>
<p class="lead2">${L('Construye tu plan a medida, explora el árbol de técnicas, mide tu progreso sin fricción y recibe feedback real de la comunidad en un solo sitio.','Build your tailored plan, map your technique tree, track frictionless progress, and get real feedback from the community—all in one place.')}</p>
</div>
<div class="pad" style="display:grid;gap:10px">
<button class="cta" data-act="ob-start">${L('Crear mi plan en 1 minuto','Build my plan in 1 minute')}</button>
<button class="cta on-dark ghost" data-act="see-example">${L('Ver un plan de ejemplo','See an example plan')}</button>
</div></div>`}
function obShell(step,tot,title,sub,body,ok,nextAct,backAct,miss,cta){
return `<div class="scr pad" style="min-height:100vh;display:flex;flex-direction:column">
<div class="obhead">${backAct?`<button class="link" data-act="${backAct}" aria-label="${L('Atrás','Back')}" style="padding:0 6px">←</button>`:'<span style="width:10px"></span>'}<span class="pg" role="progressbar" aria-label="${L('Progreso del cuestionario','Survey progress')}" aria-valuemin="1" aria-valuemax="${tot}" aria-valuenow="${step}"><i style="width:${Math.round(step/tot*100)}%"></i></span>${langToggle()}</div>
<p class="stepl">${L(`Paso ${step} de ${tot}`,`Step ${step} of ${tot}`)}</p>
<h1 class="display sm" style="margin-top:2px">${esc(title)}</h1>${sub?`<p class="mut" style="margin-top:6px">${esc(sub)}</p>`:''}
<div style="flex:1;margin-top:16px">${body}</div>
<div style="position:sticky;bottom:0;padding:14px 0;background:linear-gradient(transparent,var(--bg) 24%)"><button class="cta" id="obnext" data-act="${nextAct}"${ok?'':' disabled'}>${cta||L('Continuar','Continue')}</button><p class="miss" id="miss" aria-live="polite">${ok?'':esc(miss||'')}</p></div></div>`}
function obGoals(){const g=S.ob.goals||[];
const body=`<div class="goalgrid">${GORD.map(k=>`<button class="goalc" data-act="ob-goal" data-v="${k}" aria-pressed="${g.includes(k)}"><span class="gi">${svg(k)}</span><span style="flex:1"><h3>${esc(T(GOALS[k]))}</h3><p>${esc(T(GOALS[k].s))}</p></span><span class="chk">${svg2check()}</span></button>`).join('')}</div><p class="small" style="margin-top:12px">${g.length}/3 ${L('elegidos','selected')}</p>`;
return obShell(1,4,L('Elige 3 objetivos','Pick 3 goals'),L('Son el núcleo de tus próximas 12 semanas.','They are the core of your next 12 weeks.'),body,g.length===3,'ob-goals-next',null)}
function svg2check(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M5 12l5 5 9-10"/></svg>'}
function obPlans(){const g=S.ob.goals,sel=S.ob.focus,a=S.ob.a,rk=planRank(g,a),top=rk.order[0],hasRec=rk.sc[top]>0,N=obTotal()-2;
const plans=rk.order.map(f=>({focus:f,sup:g.filter(x=>x!==f)}));
const body=`<div class="goalgrid">${plans.map((pl,i)=>{const P=PLANS[pl.focus],rec=i===0&&hasRec;return `<button class="planc min" data-act="ob-plan" data-v="${pl.focus}" aria-pressed="${sel===pl.focus}"><span class="pt">${rec?`<span class="tag rec-badge">${L('Recomendado','Recommended')}</span>`:''}<h3>${esc(T(P))}</h3></span><span class="pb">${rec?`<span class="mline why"><span class="ml-k">${L('Por qué','Why')}</span><span>${esc(rk.why[top].slice(0,2).join(' · '))}</span></span>`:''}<span class="mline"><span class="ml-k">${L('Objetivo','Goal')}</span><span>${esc(T(GOALS[pl.focus]))}</span></span><span class="mline"><span class="ml-k">${L('Compromiso','Commit')}</span><span>${esc(commit(a,pl.focus))}</span></span><span class="mline"><span class="ml-k">${L('Resultado','Result')}</span><span>${esc(T(OUT[pl.focus].f))}</span></span></span></button>`}).join('')}</div>
<div class="coachline" style="margin-top:14px;border-left-color:var(--teal)"><span class="av" style="background:var(--teal);font-size:11px">360</span><span>${L('Con cualquier plan tienes acceso a tu red local —fisio, nutrición, yoga, prepa, psicología— en un mapa, con ofertas y sesiones sueltas.','With any plan you get your local network —physio, nutrition, yoga, strength, psychology— on a map, with offers and one-off sessions.')}</span></div>`;
return obShell(N+1,N+2,L('Tus 3 planes','Your 3 plans'),L('Elige uno. Los otros quedan de reserva.','Pick one. The others stay on reserve.'),body,!!sel,'ob-plans-next','ob-plans-back',L('Elige uno de los 3 planes','Pick one of the 3 plans'))}
function planRank(goals,a){const d=diag(a),gq=a.gq||{},sc={},why={};for(const g of goals){sc[g]=0;why[g]=[]}
const add=(g,n,r)=>{if(!goals.includes(g)||!(n>0))return;sc[g]+=n;why[g].push(r)};
add('comp',a.when==='soon'?4:a.when==='12'?3:0,L('Tienes una competición a la vista','You have a competition coming up'));
add('comp',a.result==='r1'?2:0,L('Sueles caer en primera ronda','You usually lose in round one'));
add('injury',2*d.L.dolor,L('Tienes molestias ahora','You have niggles right now'));
add('injury',d.age>=40?2:0,L(`Con ${d.age} años, la recuperación manda`,`At ${d.age}, recovery rules`));
add('injury',(gq.injury||[]).filter(x=>x!=='ninguna').length,L('Has tenido lesiones en los últimos 2 años','You have had injuries in the last 2 years'));
add('engine',2*d.L.gas,L('Te quedas sin gas','You gas out'));
add('engine',gq.engine?1:0,L('La explosividad o el gas te fallan en combate','Power or gas fail you in matches'));
add('strategy',2*d.L.tec,L('Lo que te frena es técnico','What holds you back is technical'));
add('strategy',['nada','videos'].includes(gq.strategy)?2:0,L('No preparas tus combates','You don\'t prepare your matches'));
add('mind',2*d.L.mente,L('Te bloqueas en momentos clave','You freeze at key moments'));
add('mind',+gq.mind>=7?3:+gq.mind>=5?1:0,L('Los nervios te afectan','Nerves affect you'));
add('train',(a.days||[]).length<=2?2:0,L('Entrenas pocos días: más volumen te rinde','You train few days: more volume pays off'));
add('train',gq.train&&gq.train!=='same'?2:0,L('Quieres sumar clases','You want to add classes'));
const order=goals.slice().sort((x,y)=>(sc[y]-sc[x])||(goals.indexOf(x)-goals.indexOf(y)));
return {order,sc,why}}
function obMode(){const a=S.ob.a,m=a.mode;
const body=`<div class="goalgrid">${ents(MODES).map(([k,v])=>`<button class="goalc" data-act="ob-mode" data-v="${k}" aria-pressed="${m===k}"><span class="gi">${svg(k==='parallel'?'train':'mind')}</span><span style="flex:1"><h3>${esc(T(v))}</h3><p>${esc(T(v.s))}</p></span><span class="chk">${svg2check()}</span></button>`).join('')}</div>${m==='clases'?`<label class="tog"><input type="checkbox" data-act="toggle-audio" ${a.audio!==false?'checked':''}><span><b>${L('Subir notas de voz o vídeo','Upload voice or video notes')}</b><br><span class="small">${L('Si lo apagas, eliges el tema en 2 toques y recibes tips sin subir nada.','If you turn it off, pick the topic in 2 taps and get tips without uploading.')}</span></span></label>`:''}`;
const N=obTotal();return obShell(N,N,L('¿Cómo quieres entrenar?','How do you want to train?'),L('Puedes cambiarlo cuando quieras.','You can change this anytime.'),body,!!m,'ob-mode-next','ob-mode-back',L('Elige cómo quieres entrenar','Choose how you want to train'))}
function obDone(){const o=outcomes(build()),sch=!!S.ob.school,rem=S.ob.remind!==false,price=sch?'6,99':'9,99',days=(S.a.days||[]).slice().sort((x,y)=>x-y).map(i=>DSH()[i]).join(', ');
return `<div class="scr pad hero-img" style="min-height:100vh;display:flex;flex-direction:column;gap:14px;padding-top:36px">
<span class="kick">${L('Tu plan está listo','Your plan is ready')}</span>
<h1 class="display">${esc(T(PLANS[S.focus]))}</h1>
<p class="lead2">${L('En 12 semanas:','In 12 weeks:')}</p>
<div class="outs">${o.map(x=>`<div class="outc" style="background:#14181d;border-color:#2a2f36"><span class="g">${esc(T(GOALS[x.g]))}</span><p style="color:#e8e9e6">${esc(x.t)}</p></div>`).join('')}</div>
<div class="paybox"><p class="pk">${L('7 días gratis','7 days free')}</p><p class="pp">${L('Después','Then')} <b>${price} €</b>/${L('mes','month')}</p>
<label class="tog dk"><input type="checkbox" data-act="school-net" ${sch?'checked':''}><span>${L('Mi escuela está en la red osslab: 6,99 €/mes','My school is in the osslab network: €6.99/month')}</span></label>
<label class="tog dk"><input type="checkbox" data-act="remind" ${rem?'checked':''}><span>${L(`Avísame al acabar mis clases (${days}) para registrarlas`,`Remind me after my classes (${days}) to log them`)}</span></label></div>
<button class="cta" data-act="ob-finish" data-v="trial">${L('Empezar mis 7 días gratis','Start my 7 free days')}</button>
<p class="small" style="text-align:center;color:#9aa0a8;margin:-4px 0 0">${L('Sin cobro durante 7 días. Cancela cuando quieras. Demo: no se cobra nada.','No charge for 7 days. Cancel anytime. Demo: nothing is charged.')}</p>
<button class="link" data-act="ob-finish" data-v="skip" style="color:#cdd1d6;align-self:center">${L('Ahora no, solo quiero mirar','Not now, just looking')}</button></div>`}

/* ================= survey ================= */
function obSurvey(){
const steps=obStepList(),i=Math.min(S.ob.si||0,steps.length-1),id=steps[i];
D=S.ob.a=S.ob.a||{fav:[],lose:[],why:{},pain:[],days:[],spar:-1,gq:{}};
const q=qOf(id),ok=validQ(id);
return obShell(i+1,obTotal(),T(q.t),q.h?T(q.h):'',`<div class="surv">${qBody(id)}</div>`,ok,'ob-sv-next','ob-sv-back',ok?'':missMsg(id));
}
function goalGrid(){const g=S.ob.goals||[];return `<div class="goalgrid">${GORD.map(k=>`<button class="goalc" data-act="pickg" data-v="${k}" aria-pressed="${g.includes(k)}"><span class="gi">${svg(k)}</span><span style="flex:1"><h3>${esc(T(GOALS[k]))}</h3><p>${esc(T(GOALS[k].s))}</p></span><span class="chk">${svg2check()}</span></button>`).join('')}</div><p class="small" style="margin-top:12px">${g.length}/3 ${L('elegidos','selected')}</p>`}
function qOf(id){
if(id==='goals')return {t:{es:'Elige 3 objetivos',en:'Pick 3 goals'},h:{es:'Son el núcleo de tus 12 semanas.',en:'The core of your 12 weeks.'}};
if(id.startsWith('why:')){const s=id.slice(4);return {t:{es:`¿Por qué te cuesta ${T(SIT[s]).toLowerCase()}?`,en:`Why do you struggle with ${T(SIT[s]).toLowerCase()}?`},h:{es:'Si es técnica, te preparamos la pregunta para tu profesor. Si es físico o de cabeza, entra en tu plan.',en:'If it\'s technical we prep the question for your coach. If it\'s physical or mental, it goes in your plan.'}}}
if(id.startsWith('goal:')){const g=id.slice(5);if(g==='comp')return {t:{es:'Tu competición',en:'Your competition'},h:{es:'Para colocar tu pico y tu peso.',en:'To time your peak and your weight.'}};return {t:Q15[g].t,h:null}}
return {modal:{t:{es:'¿Gi o no-gi?',en:'Gi or no-gi?'}},belt:{t:{es:'Tu grado',en:'Your rank'},h:{es:'Ajusta el nivel de los drills de técnica.',en:'Sets the level of the technique drills.'}},datos:{t:{es:'Tus datos',en:'Your numbers'},h:{es:'Para el volumen, la recuperación y tu categoría.',en:'For volume, recovery and your division.'}},style:{t:{es:'¿Cómo juegas?',en:'How do you play?'}},fav:{t:{es:'Tus armas favoritas',en:'Your favourite weapons'},h:{es:'Hasta 3. Son tu plan A.',en:'Up to 3. They are your plan A.'}},lose:{t:{es:'¿Dónde pierdes posiciones?',en:'Where do you lose positions?'},h:{es:'Hasta 3.',en:'Up to 3.'}},gas:{t:{es:'¿Cuándo te falta el aire?',en:'When do you run out of air?'}},mob:{t:{es:'Prueba de movilidad 90/90',en:'90/90 mobility test'},h:{es:'Sentado en 90/90, ¿aguantas la espalda recta sin las manos?',en:'Seated in 90/90, can you keep a tall back without hands?'}},pull:{t:{es:'¿Cuántas dominadas seguidas haces?',en:'How many pull-ups in a row?'}},pain:{t:{es:'¿Alguna molestia ahora?',en:'Any niggles right now?'},h:{es:'Cambiamos los ejercicios que la carguen.',en:'We swap exercises that load it.'}},rest:{t:{es:'Descanso y estrés',en:'Rest and stress'}},days:{t:{es:'¿Qué días entrenas BJJ?',en:'Which days do you train BJJ?'}},time:{t:{es:'Tiempo para el físico',en:'Time for strength work'}}}[id]||{t:{es:'',en:''}}}
function qBody(id){
const a=D;
if(id==='goals')return goalGrid();
if(id==='modal')return opts('modal',ents(MODAL),a.modal);
if(id==='belt')return `${opts('belt',ents(BELT),a.belt)}<p class="sub">${L('Grados','Stripes')}</p><div class="days" role="group">${['0','1','2','3','4'].map(v=>`<button class="day" data-act="pick" data-q="stripes" data-v="${v}" aria-pressed="${a.stripes===v}">${v}</button>`).join('')}</div><div class="field" style="max-width:260px;margin-top:14px"><label for="q-cl">${L('¿Cuántas clases llevas?','How many classes so far?')}</label><input id="q-cl" type="number" inputmode="numeric" min="0" max="9999" value="${a.classes==null?'':a.classes}" placeholder="${L('Ej. 250','e.g. 250')}"></div>`;
if(id==='datos')return `<div class="fields f3"><div class="field"><label for="q-age">${L('Edad','Age')}</label><input id="q-age" type="number" inputmode="numeric" min="18" max="80" value="${a.age||''}"></div><div class="field"><label for="q-wt">${L('Peso (kg)','Weight (kg)')}</label><input id="q-wt" type="number" inputmode="decimal" min="40" max="160" value="${a.weight||''}"></div><div class="field"><label for="q-ht">${L('Altura (cm)','Height (cm)')}</label><input id="q-ht" type="number" inputmode="numeric" min="140" max="220" value="${a.height||''}"></div></div><p class="sub">${L('Complexión','Build')}</p>${opts('build',ents(BUILD).map(([k,v])=>[k,v,BUILD[k].s]),a.build)}`;
if(id==='style')return opts('style',ents(STYLES).map(([k,v])=>[k,v,STYLES[k].s]),a.style);
if(id==='fav')return `${optsMulti('fav',ents(FAV),a.fav,3)}<p class="small">${favs(a).length}/3</p>`;
if(id==='lose')return `${optsMulti('lose',ents(SIT).concat([['nada',{es:'Nada en especial',en:'Nothing in particular'}]]),a.lose,3)}<p class="small">${(a.lose||[]).filter(x=>x!=='nada').length}/3</p>`;
if(id.startsWith('why:'))return opts('why:'+id.slice(4),ents(REASON),(a.why||{})[id.slice(4)]);
if(id==='gas')return opts('gas',ents(GASQ),a.gas);
if(id==='mob')return opts('mob',ents(MOBQ),a.mob);
if(id==='pull')return opts('pull',ents(PULLQ),a.pull);
if(id==='pain')return optsMulti('pain',ents(PAIN),a.pain,9);
if(id==='rest')return `<p class="sub">${L('¿Cuánto duermes de media?','Average sleep?')}</p>${opts('sleep',ents(SLEEP),a.sleep)}<p class="sub">${L('¿Estrés fuera del tatami?','Stress off the mat?')}</p>${opts('stress',ents(STRESS),a.stress)}`;
if(id==='days'){const ds=(a.days||[]).slice().sort((x,y)=>x-y);return `<div class="days" role="group">${DAYS().map((x,i)=>`<button class="day" data-act="day" data-v="${i}" aria-pressed="${ds.includes(i)}" aria-label="${DAYC()[i]}">${x}</button>`).join('')}</div><div class="field" style="margin-top:14px"><label for="q-spar">${L('¿Día de sparring más duro?','Hardest sparring day?')}</label><select id="q-spar"><option value="-1">${L('No hago sparring duro','No hard sparring')}</option>${ds.map(i=>`<option value="${i}"${a.spar===i?' selected':''}>${DAYC()[i]}</option>`).join('')}</select></div>`}
if(id==='time')return `${opts('time',ents(TIME),a.time)}<p class="sub">${L('¿Dónde?','Where?')}</p>${opts('place',ents(PLACE),a.place)}`;
if(id.startsWith('goal:')){const g=id.slice(5);
 if(g==='comp'){return `<p class="sub">${L('¿Tu objetivo?','Your target?')}</p>${opts('gq:comp',ents(Q15.comp.o),(a.gq||{}).comp)}<p class="sub">${L('¿Cuándo es?','When is it?')}</p>${opts('when',ents(WHEN),a.when)}${a.when==='soon'?`<div class="field" style="max-width:240px;margin-top:12px"><label for="q-wks">${L('¿Dentro de cuántas semanas?','In how many weeks?')}</label><input id="q-wks" type="number" inputmode="numeric" min="4" max="11" value="${a.weeksTo||''}"></div>`:''}<p class="sub">${L('Nivel','Level')}</p>${opts('ctype',ents(CTYPE),a.ctype)}<p class="sub">${L('Peso','Weight')}</p>${opts('wcut',ents(WCUT),a.wcut)}<p class="sub">${L('¿Cómo te suele ir?','How does it usually go?')}</p>${opts('result',ents(RESULT),a.result)}`}
 if(Q15[g].multi)return optsMulti('gq:'+g,ents(Q15[g].o),(a.gq||{})[g]||[],9);
 if(Q15[g].scale){const v=(a.gq||{})[g];return `<div class="scale10" role="group">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<button data-act="pick" data-q="gq:${g}" data-v="${n}" aria-pressed="${+v===n}">${n}</button>`).join('')}</div><p class="small">${L('1 = nada · 10 = muchísimo','1 = none · 10 = a lot')}</p>`}
 return opts('gq:'+g,ents(Q15[g].o),(a.gq||{})[g])}
return '';}
const ents=o=>Object.keys(o).map(k=>[k,o[k]]);
function opts(q,list,sel){return `<div class="opts">${list.map(o=>`<button class="opt" data-act="pick" data-q="${q}" data-v="${o[0]}" aria-pressed="${sel===o[0]}"><span class="dot" aria-hidden="true"></span><span>${esc(T(o[1]))}${o[2]?`<small>${esc(T(o[2]))}</small>`:''}</span></button>`).join('')}</div>`}
function optsMulti(q,list,sel,max){sel=sel||[];return `<div class="opts">${list.map(o=>`<button class="opt multi" data-act="pickm" data-q="${q}" data-v="${o[0]}" data-max="${max}" aria-pressed="${sel.includes(o[0])}"><span class="dot" aria-hidden="true"></span><span>${esc(T(o[1]))}</span></button>`).join('')}</div>`}
function validQ(id){const a=D;
if(id==='goals')return (S.ob.goals||[]).length===3;
if(id==='modal')return !!a.modal;
if(id==='belt')return !!a.belt&&a.stripes!=null&&a.stripes!==''&&a.classes!=null&&a.classes!=='';
if(id==='datos')return +a.age>=18&&+a.age<=80&&+a.weight>=40&&+a.weight<=160&&+a.height>=140&&+a.height<=220&&!!a.build;
if(id==='style')return !!a.style;
if(id==='fav')return favs(a).length>=1;
if(id==='lose')return (a.lose||[]).length>=1;
if(id.startsWith('why:'))return !!(a.why||{})[id.slice(4)];
if(['gas','mob','pull','sleep','stress'].includes(id))return !!a[id];
if(id==='rest')return !!a.sleep&&!!a.stress;
if(id==='pain')return (a.pain||[]).length>=1;
if(id==='days')return (a.days||[]).length>=1;
if(id==='time')return !!a.time&&!!a.place;
if(id.startsWith('goal:')){const g=id.slice(5);const gq=(a.gq||{})[g];
 if(g==='comp')return !!gq&&!!a.when&&(a.when!=='soon'||(+a.weeksTo>=4&&+a.weeksTo<=11))&&!!a.ctype&&!!a.wcut&&!!a.result;
 if(Q15[g].multi)return (gq||[]).length>=1;return !!gq}
return false}

/* ================= HOY ================= */
function coachMsg(b,R,ps){const F=b.F;
if(R&&R.state==='rojo')return L('Hoy toca recuperar. Escuchar al cuerpo también es entrenar.','Recovery day. Listening to your body is training too.');
if(ps.pct>=70)return L('Vas por delante de tu plan. Mantén el ritmo.','You\'re ahead of your plan. Keep the pace.');
if(F==='comp'&&b.a.when==='soon')return L(`Quedan ${b.a.weeksTo} semanas para tu competición. Cada sesión cuenta.`,`${b.a.weeksTo} weeks to your competition. Every session counts.`);
return L('Una sesión más cerca de tu mejor versión en el tatami.','One session closer to your best self on the mat.')}
function exampleBanner(){return S.example?`<button class="coachline" data-act="start-ob" style="width:100%;text-align:left;cursor:pointer;margin-top:10px;border-left-color:var(--teal)"><span class="av" style="background:var(--teal)">✦</span><span><b>${L('Esto es un plan de ejemplo.','This is an example plan.')}</b> ${L('Crea el tuyo con el cuestionario →','Build yours with the survey →')}</span></button>`:''}
function hoyTab(){
if((S.a&&S.a.mode||'parallel')==='clases')return clasesHoy(build());
healthFill();const b=build(),ps=progressStats(b),cw=curWeek(),ph=phase(cw),R=gateR(readiness(S.ck[iso(today())]));
const tp=todayPick(b),as=tp.as,sum=S.lastSum&&S.lastSum.date===iso(today())&&S.lastSum.idx===tp.sel;
if(S.play&&S.play.open&&as){
 return `<div class="pad sesswrap"><div class="sesstop"><button class="exit" data-act="close-play">← ${L('Salir','Exit')}</button><span class="sesst">${L('Sesión','Session')} ${as.key} · ${esc(T(tplOf(b,as.key)))}</span></div>
${'wakeLock' in navigator?`<p class="small wl">${L('La pantalla no se apagará durante la sesión.','The screen will stay on during the session.')}</p>`:''}
${ckHTML(S.ck[iso(today())]||{},R,true)}${sum?sumHTML(S.lastSum):playerHTML(b,ph,as,tp.sel,R)}</div>`}
const todayExtras=extrasOn(b,dowOf(today())),first=ps.done===0;
return `<div class="pad">
<div class="hoytop"><div><p class="plabel">${first?L('Tu primera sesión','Your first session'):`${L('Semana','Week')} ${cw} · ${esc(ph.name)}`}</p><h1 class="display sm">${esc(T(PLANS[S.focus]))}</h1><p class="small">${streakTxt()}</p>${S.trial?trialLine():''}</div>${first?'':`<div class="ringsm" style="--p:${ps.pct}" role="img" aria-label="${ps.pct}% ${L('del plan','of plan')}"><b>${ps.pct}%</b></div>`}</div>
${teleStrip(b,R)}${exampleBanner()}${S.trial===false?trialLine():''}
${todayCard(b,tp,R,sum,ph)}${plSlot('hoy')}
${isClassDay()?classDayCard():''}${focusCard()}${sum?'':pendingAsk(false)}
${todayExtras.length?`<div class="section-h"><h2>${L('También hoy','Also today')}</h2></div><div style="display:grid;gap:10px">${todayExtras.map(x=>extraCard(x,b)).join('')}</div>`:''}
<div class="section-h" id="matlog"><h2>${L('Después de clase','After class')}</h2></div>
<button class="rowcard" data-act="goacc" data-v="matlog"><span class="ri">${svg('train')}</span><span><span class="rt">${L('Registrar una clase con detalle','Log a class in detail')}</span><span class="rs">${L('Tipo, duración y esfuerzo. Suma a tu carga semanal.','Type, length and effort. Counts toward your weekly load.')}</span></span><span class="arr">›</span></button>
${S.open.matlog?`<div class="card" style="margin-top:10px">${matForm()}</div>`:''}
<div class="section-h"><h2>${L('Tu forma de usar la app','How you use the app')}</h2></div>
<button class="rowcard" data-act="switch-mode"><span class="ri">${svg('mind')}</span><span><span class="rt">${L('Cambiar a Seguimiento de clases','Switch to Class tracking')}</span><span class="rs">${L('Sin sesión fija: registra clases y recibe tips','No fixed session: log classes and get tips')}</span></span><span class="arr">›</span></button>
${remindRow()}
</div>`}
function quickClass(){const d=dowOf(today()),m=(S.log.mat||[]).slice().reverse(),same=m.find(x=>dowOf(fromIso(x.date))===d),q=same||m[0];
if(S.a.spar===d)return {type:'duro',min:q?q.min:90,rpe:8};return q?{type:q.type,min:q.min,rpe:q.rpe}:{type:'tecnica',min:90,rpe:6}}
function classDayCard(){const ds=iso(today()),done=(S.log.mat||[]).filter(x=>x.date===ds);return classDayCard0()+(done.length&&!S.example&&!S.a.favAsked?askFav():'')}
function classDayCard0(){const ds=iso(today()),done=(S.log.mat||[]).filter(x=>x.date===ds);
if(done.length){const x=done[done.length-1];return `<div class="rowcard classday ok" style="margin-top:14px"><span class="ri">✓</span><span><span class="rt">${L('Clase de hoy registrada','Today\'s class logged')}</span><span class="rs">${esc(T(MATT[x.type]))} · ${x.min} min · ${L('esfuerzo','effort')} ${x.rpe}</span></span><button class="link" data-act="mat-undo" style="margin-left:auto">${L('Deshacer','Undo')}</button></div>`}
const q=quickClass();
return `<div class="classcard" style="margin-top:14px"><div class="cc-h"><span class="ri">🥋</span><span><span class="rt">${L('Hoy tienes clase','You have class today')}</span><span class="rs">${esc(T(MATT[q.type]))} · ${q.min} min · ${L('esfuerzo','effort')} ${q.rpe}</span></span></div><button class="cta" data-act="mat-quick">${L('Registrar la clase de hoy','Log today\'s class')}</button><button class="link" data-act="open-matlog">${L('Cambiar detalles','Change details')}</button></div>`}
function todayCard(b,tp,R,sum,ph){
const as=tp.as;if(!as)return `<div class="sess-hero" style="margin-top:18px"><div class="sb"><h2>${L('Día de descanso','Rest day')}</h2><p class="meta">${L('Nada de físico hoy. Si quieres, 10 min de movilidad o tu rutina mental.','No strength work today. If you like, 10 min of mobility or your mental routine.')}</p></div></div>`;
if(sum)return sumHTML(S.lastSum);
return heroCard(b,tp,R,ph)+(b.assign.length>1?`<div class="minis" style="margin-top:10px">${b.assign.map((x,i)=>`<button class="tag ${i===tp.sel?'t-tec':'neu'}" data-act="psel" data-v="${i}" style="cursor:pointer;border:0;font:inherit;font-weight:700">${DSH()[x.day]} · ${x.key}</button>`).join('')}</div>`:'');
const t=tplOf(b,as.key),it=sessionItems(as,tp.sel,b,ph),nex=it.rows.length+it.mrows.length+it.trows.length;
return `<div class="sess-hero" style="margin-top:18px"><div class="band"><span class="k">${tp.isToday?L('Hoy toca','Today'):L('Próxima sesión','Next session')} · ${fmtS(addD(today(),0))==fmtS(fromIso(iso(addD(monOf(today()),as.day))))?'':''}${DSH()[as.day]}</span></div>
<div class="sb"><h2>${L('Sesión','Session')} ${as.key}: ${esc(T(t))}</h2>
<p class="meta"><span>${b.short?'30':t.d} min</span><span>${nex} ${L('ejercicios','exercises')}</span>${it.trows.length?`<span>${L('+ técnica','+ technique')}</span>`:''}${R?`<span>${L('Forma','Form')} ${R.s}/100</span>`:''}</p>
<button class="cta" data-act="open-play" data-v="${tp.sel}">${R?L('Empezar sesión','Start session'):L('Check-in y empezar','Check-in and start')}</button></div></div>
${b.assign.length>1?`<div class="minis" style="margin-top:10px">${b.assign.map((x,i)=>`<button class="tag ${i===tp.sel?'t-tec':'neu'}" data-act="psel" data-v="${i}" style="cursor:pointer;border:0;font:inherit;font-weight:700">${DSH()[x.day]} · ${x.key}</button>`).join('')}</div>`:''}`}
function extrasOn(b,wd){return (b.place[wd]||[])}
function extraCard(type,b){const map={ment:[L('Rutina mental','Mental routine'),'mind',L('10 min de respiración y visualización','10 min breathing and visualisation')],vid:[L('Sesión de vídeo','Video session'),'strategy',L('20 min analizando combates','20 min reviewing matches')],rec:[L('Recuperación o yoga','Recovery or yoga'),'injury',L('30–40 min suaves','30–40 min easy')]};const[m,ic,s]=map[type];const done=!!S.ex[`${iso(today())}:${type}`];
return `<button class="rowcard" data-act="toggle-ex" data-v="${type}"><span class="ri">${svg(ic)}</span><span><span class="rt">${esc(m)}</span><span class="rs">${esc(s)}</span></span><span class="arr">${done?'<span style="color:var(--teal);font-weight:800">✓</span>':'›'}</span></button>`}
function matForm(){const f=S.mf;const grp=(k,lab,list)=>`<div class="mrow"><span>${lab}</span><div class="chips2" role="group" aria-label="${lab}">${list.map(o=>`<button data-act="mf" data-k="${k}" data-v="${o[0]}" aria-pressed="${String(f[k])===String(o[0])}">${esc(o[1])}</button>`).join('')}</div></div>`;
return `<h3>${L('Registrar clase','Log a class')}</h3>${grp('type',L('Tipo','Type'),ents(MATT).map(([k,v])=>[k,T(v)]))}${grp('day',L('Día','Day'),[[0,L('Hoy','Today')],[1,L('Ayer','Yesterday')]])}${grp('min',L('Duración','Length'),[45,60,75,90,120].map(m=>[m,m+' min']))}${grp('rpe','RPE',[3,4,5,6,7,8,9,10].map(v=>[v,String(v)]))}<div class="mfoot"><span class="small">${L('Carga','Load')}: <b>${fmt(f.min*f.rpe)}</b></span><button class="cta sm" style="width:auto;padding:0 18px" data-act="mat-save">${L('Guardar','Save')}</button></div>${S.mfOk?`<p class="okmsg" role="status">${L('Clase guardada. Carga y plan actualizados.','Class saved. Load and plan updated.')}</p>`:''}`}

/* ---- check-in + player (restyled, reused engine) ---- */
function ckHTML(ck,R,compact){
if(R&&compact&&!S.ckEdit)return `<div class="ckline ck-${R.state}" role="status"><span class="cdot" aria-hidden="true"></span><b>${T(STL[R.state])} · ${R.s}/100</b><span class="small">${R.state==='verde'?L('sesión completa','full session'):R.state==='ambar'?L('una serie menos','one less set'):L('toca recuperar','recovery day')}</span><button class="link" data-act="ckedit">${L('Repetir','Redo')}</button></div>`;
if(R&&!S.ckEdit){const msg={verde:L('Entrena según el plan. Si las series salen fáciles, la app sube el peso.','Train as planned. If sets feel easy, the app adds weight.'),ambar:L('Sesión ajustada: una serie menos y un punto menos de RPE.','Adjusted session: one less set and one RPE lower.'),rojo:ck.joint==='0'?L('Hoy toca recuperar. Si la molestia sigue o va a más, que te vea un fisio.','Recovery today. If the niggle persists or worsens, see a physio.'):L('Hoy toca recuperar: movilidad y cardio suave.','Recovery today: mobility and easy cardio.')}[R.state];
 return `<div class="ck done ck-${R.state}" style="margin:14px 0"><div class="ring" style="--p:${R.s}"><b>${R.s}</b></div><div><p class="ckst">${T(STL[R.state])} · ${R.s}/100</p><p>${esc(msg)}</p>${R.notes.map(n=>`<p class="small">${esc(n)}</p>`).join('')}</div><button class="link" data-act="ckedit">${L('Repetir','Redo')}</button></div>`}
return `<div class="ck" style="margin:14px 0"><div class="ckh"><h3>${L('Check-in de hoy','Today\'s check-in')}</h3><span class="small">${S.a&&!S.a.painAsked?L('5 toques','5 taps'):L('4 toques','4 taps')}</span></div>${S.a&&!S.a.painAsked?painRow():''}${ckHealth()}${CKQ.map(q=>`<div class="ckq"><span>${T(q[1])}</span><div class="seg3" role="group" aria-label="${T(q[1])}">${q[2].map(o=>`<button data-act="ck" data-q="${q[0]}" data-v="${o[0]}" aria-pressed="${ck[q[0]]===o[0]}">${T(o[1])}</button>`).join('')}</div></div>`).join('')}${S.a&&S.a.painAsked&&needZone()?painRow():''}<p class="small">${S.health?L('Sueño: desde Salud (demo).','Sleep: from Health (demo).'):L('Con pulsera (próximamente), sueño y VFC llegan solos.','With a wearable (soon), sleep and HRV sync automatically.')}</p></div>`}
function playRows(b,ph,as,idx,R,live){
const it=sessionItems(as,idx,b,ph);let rows=it.rows.concat(it.mrows,it.trows);const red=!!R&&R.state==='rojo',force=!!(live&&live.force);
if(red&&!force)rows=[{id:'mobgen',p:'15 min',acc:false},{id:'aero',p:'20 min a RPE 3–4',acc:false}];
else if(red&&force)rows=rows.filter(r=>r.tech||parseRx(r.p).kind!=='block').slice(0,3);
return {it,rows,red,force}}
const EFF=t=>[[Math.max(5,t-2),{es:'Fácil',en:'Easy'}],[t,{es:'Justo',en:'Just right'}],[Math.min(10,t+1),{es:'Duro',en:'Hard'}]];
function effLabel(v,t){if(!t||v==null)return '';return T(v<t?{es:'Fácil',en:'Easy'}:v>t?{es:'Duro',en:'Hard'}:{es:'Justo',en:'Just right'})}
function exSpec(r,ph,cap,amber,force){const rx=parseRx(r.p),mob=r.tech||MOBX.has(r.id),kind=r.tech?'block':kindOf(r.id,rx),inc=(EX[r.id]||{}).inc||2.5;
let n=kind==='block'?1:rx.sets;if(amber&&n>1&&!mob)n--;if(force)n=Math.min(n,2);
let t=mob?0:tRpe(rx,ph,r.acc,cap);if(amber&&t)t=Math.max(5,t-1);if(force&&t)t=6;
return {rx,mob,kind,inc,n,t,nrows:kind==='rounds'||kind==='block'?1:n}}
function exHTML(r,sx,R,ph,cap,amber,force,live){
const {rx,mob,kind,inc,n,t,nrows}=exSpec(r,ph,cap,amber,force),ls=(live&&live.sets[r.id])||[];
const sug=kind==='kg'?sugKg(r.id,rx.lo,t,inc,ls):kind==='kgdist'?sugStep(r.id,t,inc,ls):null;
const per=rx.perSide,ps=per?L(' por lado',' per side'):'',pl=per?L('/lado','/side'):'';
const cols=kind==='kg'?[['kg','kg'],['reps','Reps'+pl]]:kind==='kgdist'?[['kg','kg']]:kind==='time'?[['sec',L('Segundos','Seconds')+pl]]:kind==='rounds'?[['rounds',L('Rondas','Rounds')]]:kind==='block'?[]:[['reps','Reps'+pl]];
const def={kg:sug&&sug.kg!=null?sug.kg:null,reps:rx.lo||null,sec:rx.lo||null,rounds:n};
if(kind==='max'){const h=hist(r.id)[0];def.reps=h?h.sets[h.sets.length-1].reps:null}
const data=`data-sx="${sx}" data-id="${esc(r.id)}" data-nm="${esc(itemName(r))}" data-kind="${kind}" data-tr="${t}" data-lo="${rx.lo||0}" data-inc="${inc}" data-rest="${restFor(kind,r.acc||r.mod)}"`;
let fo=-1;for(let k=0;k<nrows;k++)if(!(ls[k]&&ls[k].done)){fo=k;break}
const val=(v,f)=>v[f]!=null?v[f]:def[f];
let big;
if(kind==='block')big=rxT(r.p);
else if(fo<0)big=L('Hecho ✓','Done ✓');
else{const v=ls[fo]||{},kg=val(v,'kg');big=kind==='kg'?`${kg!=null?fmt(kg):'—'} kg × ${val(v,'reps')}${ps}`:kind==='kgdist'?`${kg!=null?fmt(kg):'—'} kg · ${rx.lo} m`:kind==='time'?`${val(v,'sec')} s${ps}`:kind==='rounds'?`${n} ${L('rondas','rounds')}`:`${val(v,'reps')} reps${ps}`}
const setl=kind==='block'||kind==='rounds'?'':fo>=0?L(`Serie ${fo+1} de ${nrows}`,`Set ${fo+1} of ${nrows}`):L(`${nrows} de ${nrows} series`,`${nrows} of ${nrows} sets`);
let body='';
if(kind==='block'){const dn=!!(ls[0]&&ls[0].done);body=`<button class="bigtick" data-act="set" ${data} data-i="0" aria-pressed="${dn}">${dn?L('Hecho ✓ · toca para deshacer','Done ✓ · tap to undo'):L('Marcar como hecho','Mark as done')}</button>`}
else for(let k=0;k<nrows;k++){const v=ls[k]||{};
 if(v.done){body+=`<div class="srow dn"><span class="sn">${k+1}</span><span class="dv">${esc(setTxt(v,kind,per,t))}</span><button class="tick" data-act="set" ${data} data-i="${k}" aria-pressed="true" aria-label="${L('Desmarcar la serie','Unmark set')} ${k+1}">✓</button></div>`;continue}
 if(k!==fo){body+=`<div class="srow pv"><span class="sn">${k+1}</span><span class="dv">${L('Pendiente','To do')}</span></div>`;continue}
 const ef=t?`<div class="eff" role="group" aria-label="${L('¿Cómo ha ido la serie?','How did the set feel?')}">${EFF(t).map(([x,lab])=>`<button data-act="eff" data-sx="${sx}" data-id="${esc(r.id)}" data-i="${k}" data-v="${x}" aria-pressed="${(v.rpe!=null?v.rpe:t)===x}">${T(lab)}</button>`).join('')}</div>`:'';
 body+=`<div class="srow act" style="--nc:${cols.length}"><span class="sn">${k+1}</span>${cols.map(c=>{const x=val(v,c[0]);return `<label class="fin2"><span>${c[1]}</span><input type="number" inputmode="decimal" min="0" step="${c[0]==='kg'?'0.5':'1'}" data-lv="${c[0]}" data-sx="${sx}" data-id="${esc(r.id)}" data-i="${k}" value="${x==null?'':x}"></label>`}).join('')}<button class="tick big" data-act="set" ${data} data-i="${k}" aria-pressed="false" aria-label="${L('Serie hecha','Set done')}">✓</button>${ef}</div>`}
const cue=!r.tech&&EX[r.id]&&EX[r.id].cue?T(EX[r.id].cue):'',how=r.tech?`<ol class="how">${r.drill.how[S.lang==='en'?'en':'es'].map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`:'',lt=!mob&&kind!=='kg'&&kind!=='kgdist'?lastTxt(r.id,kind):'';
const more=(cue||how||r.why||lt)?`<details class="more"><summary>${L('Técnica y detalles','Technique and details')}</summary>${r.why?`<p class="small">${esc(T(r.why))}</p>`:''}${cue?`<p class="cue">${esc(cue)}</p>`:''}${how}${lt?`<p class="small">${esc(lt)}</p>`:''}</details>`:'';
return `<div class="exc focus"><div class="exh"><b class="exn">${esc(itemName(r))}</b>${r.tech?' <span class="tag t-tec">'+L('Técnica','Technique')+'</span>':r.mod?' <span class="tag t-fis">'+L('Módulo','Module')+'</span>':''}</div>${setl?`<p class="setl">${setl}</p>`:''}<p class="bigt">${esc(big)}</p>${sug&&sug.note&&fo>=0?`<p class="sug${sug.warn?' warn':''}">${esc(sug.note)}</p>`:''}${body}${more}</div>`}
function playerHTML(b,ph,as,idx,R){const h=playerHTML0(b,ph,as,idx,R);if(S.example||!S.a)return h;let pre='';
if(!S.a.mob)pre=askMob();else if(!S.a.age||!S.a.weight){const P=playRows(b,ph,as,idx,R,liveFor(idx));if(P.rows.some(r=>exSpec(r,ph,b.cap,false,P.force).kind==='kg'))pre=askAW()}
return pre?h.replace('<div class="player"',pre+'<div class="player"'):h}
function playerHTML0(b,ph,as,idx,R){
const live=liveFor(idx),cap=b.cap,amber=!!R&&R.state==='ambar',P=playRows(b,ph,as,idx,R,live),rows=P.rows;
const specs=rows.map(r=>exSpec(r,ph,cap,amber,P.force)),dn=i=>((live&&live.sets[rows[i].id])||[]).filter(x=>x&&x.done).length>=specs[i].nrows;
const fu=rows.findIndex((r,i)=>!dn(i));
let cur=live&&live.cur!=null?Math.min(live.cur,rows.length-1):(fu<0?rows.length-1:fu);
if(live&&live.adv){if(dn(cur)){let nx=-1;for(let i=cur+1;i<rows.length;i++)if(!dn(i)){nx=i;break}if(nx<0)nx=fu;if(nx>=0)cur=nx}live.adv=false;live.cur=cur}
let nextI=-1;for(let i=cur+1;i<rows.length;i++)if(!dn(i)){nextI=i;break}if(nextI<0)for(let i=0;i<cur;i++)if(!dn(i)){nextI=i;break}
let h='';
if(P.red&&!P.force)h+=`<p class="note">${L('Sesión de recuperación en lugar de la Sesión','Recovery session instead of Session')} ${as.key}. <button class="link" data-act="force" data-v="${idx}">${L('Entrenar igualmente','Train anyway')}</button></p>`;
else if(P.force)h+=`<p class="note">${L('Versión mínima: 3 ejercicios, 2 series y esfuerzo suave.','Minimal version: 3 exercises, 2 sets, easy effort.')}</p>`;
else if(amber)h+=`<p class="note">${L('Hoy, una serie menos y algo más suave.','Today, one less set and a bit easier.')}</p>`;
h+=`<div class="fhead"><span>${L(`Ejercicio ${cur+1} de ${rows.length}`,`Exercise ${cur+1} of ${rows.length}`)}</span><span class="fdots" aria-hidden="true">${rows.map((r,i)=>`<i class="${i===cur?'on':''}${dn(i)?' ok':''}"></i>`).join('')}</span></div>`;
h+=exHTML(rows[cur],idx,R,ph,cap,amber,P.force,live);
h+=`<div class="fnav"><button class="cta ghost sm" data-act="fgo" data-v="${Math.max(0,cur-1)}"${cur===0?' disabled':''}>← ${L('Anterior','Previous')}</button><button class="cta ghost sm" data-act="fgo" data-v="${Math.min(rows.length-1,cur+1)}"${cur===rows.length-1?' disabled':''}>${L('Siguiente','Next')} →</button></div>`;
h+=`<details class="all"><summary>${L('Ver toda la sesión','See the whole session')}</summary>${P.it.notes.map(x=>`<p class="note">${esc(x)}</p>`).join('')}<ol class="allx">${rows.map((r,i)=>`<li><button class="link" data-act="fgo" data-v="${i}">${dn(i)?'✓ ':''}${esc(itemName(r))}</button><span class="small"> ${esc(rxT(r.p))}</span></li>`).join('')}</ol></details>`;
const done=live?Object.values(live.sets).reduce((n,arr)=>n+(arr||[]).filter(x=>x&&x.done).length,0):0;
return `<div class="player" data-nextex="${nextI>=0?esc(itemName(rows[nextI])):''}">${h}${finHTML(live,done,tplOf(b,as.key),fu<0)}</div>`}
function finHTML(live,n,t,all){
if(!n)return '';
if(!live.fin)return `<div class="fin${all?' all':''}">${all?`<p class="alldone">${L('¡Sesión completada!','Session complete!')}</p>`:`<span><b>${n}</b> ${n===1?L('serie hecha','set done'):L('series hechas','sets done')}</span>`}<button class="cta${all?'':' ghost sm'}" style="${all?'':'width:auto;padding:0 18px'}" data-act="fin">${L('Terminar sesión','Finish session')}</button></div>`;
const el=live.start?Math.round((Date.now()-live.start)/60000):0,min=live.min!=null?live.min:Math.max(el,t.d||40);
return `<div class="fin-f"><h3>${L('¿Cómo de dura ha sido la sesión?','How hard was the session?')}</h3><p class="small">${L('De 1 (muy suave) a 10 (a tope).','From 1 (very easy) to 10 (all-out).')}</p><div class="rpe10" role="group">${[1,2,3,4,5,6,7,8,9,10].map(v=>`<button data-act="srpe" data-v="${v}" aria-pressed="${live.srpe===v}">${v}</button>`).join('')}</div><div class="fin-row"><div class="field"><label for="fin-min">${L('Minutos','Minutes')}</label><input id="fin-min" type="number" inputmode="numeric" min="5" max="240" value="${min}"></div><button class="cta sm" style="width:auto;padding:0 18px" data-act="save-ses"${live.srpe?'':' disabled'}>${L('Guardar','Save')}</button></div></div>`}
function sumHTML(s){return sumHTML0(s)+pendingAsk(true)}
function sumHTML0(s){return `<div class="sum" style="margin-top:14px"><div class="sumh"><span class="okc">✓</span><div><h3>${L('Sesión','Session')} ${s.key} ${L('guardada','saved')}</h3><p class="small">${s.n} ${L('series','sets')} · ${s.min} min · ${L('esfuerzo','effort')} ${s.srpe}/10</p></div></div><div class="sumk"><div><span>${L('Carga','Load')}</span><b>${fmt(s.ua)}</b><small>${L('minutos × esfuerzo','minutes × effort')}</small></div><div><span>${L('Volumen','Volume')}</span><b>${s.ton?fmt(s.ton)+' kg':'—'}</b><small>kg × reps</small></div><div><span>${L('Récords','PRs')}</span><b>${s.prs.length}</b><small>${L('de fuerza','strength')}</small></div></div>${s.prs.length?`<h3>${L('Récords de fuerza','Strength records')}</h3><ul class="ul">${s.prs.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${s.next.length?`<h3>${L('La próxima vez','Next time')}</h3><ul class="ul">${s.next.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}<button class="link" data-act="sumclose">${L('Volver','Back')}</button></div>`}
function todayPick(b){const d=dowOf(today());let sel=S.play&&S.play.date===iso(today())&&S.play.sel<b.assign.length?S.play.sel:null;const ti=b.assign.findIndex(x=>x.day===d);
if(sel==null){if(ti>=0)sel=ti;else{let bd=8;sel=0;b.assign.forEach((x,i)=>{const dd=(x.day-d+7)%7;if(dd<bd){bd=dd;sel=i}})}}
const as=b.assign[sel];return {sel,as,isToday:!!as&&as.day===d}}
function liveOk(){return S.live&&(S.live.date===iso(today())||(S.live.start&&Date.now()-S.live.start<12*3600e3))}
function liveFor(idx){return liveOk()&&S.live.idx===idx?S.live:null}
function ensureLive(idx){const ds=iso(today());if(!liveOk()||S.live.idx!==idx)S.live={date:ds,idx,start:null,sets:{},force:false,fin:false,srpe:null,min:null};return S.live}
function saveSession(b){const live=S.live;if(!live||!live.srpe)return;const as=b.assign[live.idx];if(!as)return;
const sets={},meta={};let n=0,ton=0;
for(const id of Object.keys(live.sets))for(const x of live.sets[id]||[])if(x&&x.done){n++;const o={};for(const f of ['kg','reps','sec','rpe','rounds'])if(x[f]!=null)o[f]=x[f];(sets[id]=sets[id]||[]).push(o);meta[id]={kind:x.kind,t:x.t,lo:x.lo,inc:x.inc,nm:x.nm}}
const prs=[],next=[];
for(const id in sets)if(meta[id].kind==='kg'){const pb=Math.max(0,...hist(id).map(h=>bestE1(h.sets))),nb=bestE1(sets[id]);for(const x of sets[id])ton+=(x.kg||0)*(x.reps||0);if(pb>0&&nb>pb+0.05)prs.push(`${meta[id].nm}: ${fmt(Math.round(pb))} → ${fmt(Math.round(nb))} kg`)}
const min=Math.max(5,Math.round(+live.min||40));
S.log.ses.push({date:live.date,key:as.key,week:curWeek(),min,srpe:live.srpe,sets});
for(const id in sets){const m=meta[id],arr=sets[id],avg=arr.reduce((s,x)=>s+(+x.rpe||m.t||0),0)/arr.length;
 if(m.kind==='kg'){const used=Math.max(...arr.map(x=>x.kg||0)),sg=sugKg(id,m.lo,m.t,m.inc,[]);if(sg.kg!=null)next.push(sg.kg>used?L(`${m.nm}: sube a ${fmt(sg.kg)} kg`,`${m.nm}: up to ${fmt(sg.kg)} kg`):sg.kg<used?L(`${m.nm}: baja a ${fmt(sg.kg)} kg`,`${m.nm}: down to ${fmt(sg.kg)} kg`):L(`${m.nm}: mantén ${fmt(used)} kg`,`${m.nm}: keep ${fmt(used)} kg`))}
 else if(m.t&&avg<=m.t-1){if(m.kind==='time')next.push(L(`${m.nm}: +5 s`,`${m.nm}: +5 s`));else if(m.kind==='reps')next.push(L(`${m.nm}: +1 rep`,`${m.nm}: +1 rep`));else if(m.kind==='rounds')next.push(L(`${m.nm}: +1 ronda`,`${m.nm}: +1 round`))}}
S.lastSum={date:live.date,idx:live.idx,key:as.key,n,min,srpe:live.srpe,ua:min*live.srpe,ton:Math.round(ton),prs,next};S.live=null}

/* ================= CLASS-TRACKING MODE ================= */
function clasesHoy(b){
const ps=progressStats(b),cw=curWeek(),draft=S.cls||{},last=S.clsLast;
return `<div class="pad">
<div class="hoytop"><div><p class="plabel">${L('Seguimiento de clases','Class tracking')} · ${esc(T(PLANS[S.focus]))}</p><h1 class="display sm">${L('Tus tips de hoy','Today\'s tips')}</h1><p class="small">${streakTxt()}</p>${S.trial?trialLine():''}</div>${ps.done?`<div class="ringsm" style="--p:${ps.pct}" role="img" aria-label="${ps.pct}%"><b>${ps.pct}%</b></div>`:''}</div>
${teleStrip(b,gateR(readiness(S.ck[iso(today())])))}${exampleBanner()}${S.trial===false?trialLine():''}
${last&&last.date===iso(today())?clsTips(last.topic,b):capCard(b,draft)}
<div class="section-h"><h2>${L('Tu forma de usar la app','How you use the app')}</h2></div>
<button class="rowcard" data-act="switch-mode"><span class="ri">${svg('train')}</span><span><span class="rt">${L('Cambiar a Plan paralelo','Switch to Parallel plan')}</span><span class="rs">${L('Físico + técnica con sesión guiada cada día','Strength + technique with a daily guided session')}</span></span><span class="arr">›</span></button>
<button class="rowcard" data-act="toggle-audio2" style="margin-top:10px"><span class="ri">${svg('mind')}</span><span><span class="rt">${L('Subir notas de voz o vídeo','Upload voice or video notes')}</span><span class="rs">${S.a.audio!==false?L('Activado · toca para desactivar','On · tap to turn off'):L('Desactivado · solo tips, sin subir nada','Off · tips only, no uploads')}</span></span><span class="arr">${S.a.audio!==false?'<span style="color:var(--teal);font-weight:800">●</span>':'○'}</span></button>
${remindRow()}
</div>`}
function capCard(b,draft){const audio=S.a.audio!==false,topic=draft.topic;
return `<div class="sess-hero capph ${phCls('clase')}"${phStyle('clase')}><div class="band"><span class="k">${isClassDay()?L('Hoy tienes clase · regístrala al salir','Class today · log it when you finish'):L('Registra tu clase','Log your class')}</span></div><div class="sb">
<h2>${L('¿Qué trabajasteis hoy?','What did you work on today?')}</h2>
<div class="chips" style="margin:12px 0">${ents(CLASST).map(([k,v])=>`<button class="chip ${topic===k?'ses':'neu'}" data-act="cls-topic" data-v="${k}" style="cursor:pointer;border:0;font:inherit;font-weight:600;padding:7px 12px">${esc(T(v))}</button>`).join('')}</div>
${audio?`<div class="minis" style="margin:4px 0 10px">${[['voz',L('🎙 Nota de voz','🎙 Voice note')],['video',L('🎬 Vídeo','🎬 Video')]].map(([k,lab])=>`<button class="cta ghost on-dark sm" data-act="cls-rec" data-v="${k}" style="width:auto;padding:0 14px;${draft.media===k?'border-color:var(--acc);color:var(--acc)':''}">${lab}</button>`).join('')}</div>${draft.media?`<p class="small" style="color:#9aa0a8">${L('Nota adjunta (demo: no se transcribe de verdad). La app usaría el audio para detectar la técnica y afinar los tips.','Note attached (demo: not actually transcribed). The app would use the audio to detect the technique and sharpen the tips.')}</p>`:''}`:''}
<button class="cta" data-act="cls-save"${topic?'':' disabled'} style="margin-top:6px">${L('Guardar y ver mis tips','Save and see my tips')}</button></div></div>`}
function clsTips(topic,b){return clsTips0(topic,b)+(!S.example&&S.a&&!S.a.favAsked?askFav():'')}
function clsTips0(topic,b){const r=tipsForTopic(topic,b);
return `<div class="sum" style="margin-top:18px"><div class="sumh"><span class="okc">✓</span><div><h3>${L('Clase guardada','Class saved')}: ${esc(T(CLASST[topic]))}</h3><p class="small">${L('Tus tips de esta semana','Your tips this week')}</p></div></div>
<ul class="need" style="margin-top:2px">${r.tips.map(t=>`<li><span class="d">💡</span><span>${esc(T(t))}</span></li>`).join('')}</ul>
${(()=>{const ts=TECH.filter(x=>x.topic.includes(topic)).sort((a,b)=>(a.video.type==='pending')-(b.video.type==='pending')).slice(0,3);return ts.length?`<p class="pg-h" style="margin-top:16px">${L('Técnica de esta clase','Technique from this class')}</p><div class="pgroup">${ts.map(techRow).join('')}</div>`:''})()}${r.drills.length?`<h3 style="margin-top:14px">${L('Drills para practicar en casa','Drills to practise at home')}</h3><div class="drills">${r.drills.map(x=>`<article class="drill"><div class="vid" role="img" aria-label="${L('Vídeo pendiente','Video pending')}">${svg2play()}<span>${L('Vídeo · pendiente','Video · pending')}</span></div><div class="dbody"><h3>${esc(T(x.n))}</h3><p class="small">${esc(T(x.why))}</p><ol class="how">${x.how[S.lang==='en'?'en':'es'].map(h=>`<li>${esc(h)}</li>`).join('')}</ol>${(()=>{const tt=TECH.find(y=>y.drill===x.id);return tt?`<button class="link" data-act="tec-open" data-v="${tt.id}">${L('Ver ficha y vídeo','See card and video')} ›</button>`:''})()}</div></article>`).join('')}</div>`:''}
${(()=>{const u=(S.uploads||[]).filter(x=>x.date===iso(today())&&x.topic===topic).pop();return u?voiceNote(u,topic,r.tips):''})()}${upState(topic)}<button class="link" data-act="cls-again">${L('Registrar otra clase','Log another class')}</button></div>`}
function upState(topic){const u=(S.uploads||[]).filter(x=>x.date===iso(today())&&x.topic===topic).pop();if(!u)return '';
const m={pending:L('⏳ Nota pendiente de subir. Se subirá sola cuando tengas conexión; tus tips ya están aquí.','⏳ Note waiting to upload. It will upload on its own when you are online; your tips are already here.'),uploading:L('Subiendo tu nota…','Uploading your note…'),done:L('Nota subida ✓ (demo: no se transcribe de verdad).','Note uploaded ✓ (demo: not actually transcribed).')}[u.state];
return `<p class="upst up-${u.state}" role="status">${m}</p>`}

/* ================= v6.1: missing-field messages, streak, trial, class-day ================= */
function missMsg(id){const a=D,m=[],F=x=>L('Falta: ','Missing: ')+x.join(', ');
if(id==='goals'){const n=3-(S.ob.goals||[]).length;return L(`Elige ${n} objetivo${n===1?'':'s'} más`,`Pick ${n} more goal${n===1?'':'s'}`)}
if(id==='belt'){if(!a.belt)m.push(L('tu cinturón','your belt'));if(a.stripes==null||a.stripes==='')m.push(L('los grados','your stripes'));if(a.classes==null||a.classes==='')m.push(L('cuántas clases llevas','how many classes'));return F(m)}
if(id==='datos'){if(!(+a.age>=18&&+a.age<=80))m.push(L('edad (18–80)','age (18–80)'));if(!(+a.weight>=40&&+a.weight<=160))m.push(L('peso (40–160 kg)','weight (40–160 kg)'));if(!(+a.height>=140&&+a.height<=220))m.push(L('altura (140–220 cm)','height (140–220 cm)'));if(!a.build)m.push(L('complexión','build'));return F(m)}
if(id==='rest'){if(!a.sleep)m.push(L('sueño','sleep'));if(!a.stress)m.push(L('estrés','stress'));return F(m)}
if(id==='time'){if(!a.time)m.push(L('tiempo disponible','time available'));if(!a.place)m.push(L('dónde entrenas','where you train'));return F(m)}
if(id==='days')return L('Marca al menos un día de clase','Mark at least one class day');
if(id==='pain')return L('Marca «Ninguna» si no tienes molestias','Tick “None” if you have no niggles');
if(id==='fav'||id==='lose')return L('Elige al menos una opción','Pick at least one option');
if(id.startsWith('goal:')){const g=id.slice(5),gq=(a.gq||{})[g];
 if(g==='comp'){if(!gq)m.push(L('tu objetivo','your target'));if(!a.when)m.push(L('cuándo es','when it is'));if(a.when==='soon'&&!(+a.weeksTo>=4&&+a.weeksTo<=11))m.push(L('semanas que faltan (4–11)','weeks to go (4–11)'));if(!a.ctype)m.push(L('nivel','level'));if(!a.wcut)m.push(L('peso','weight'));if(!a.result)m.push(L('cómo te suele ir','how it usually goes'));return F(m)}
 if(Q15[g].multi)return L('Marca «Ninguna» si no has tenido lesiones','Tick “None” if you have had no injuries')}
return L('Elige una opción','Pick an option')}
function weekCount(k){const mon=monOf(today()),s=iso(addD(mon,-7*k)),e=iso(addD(mon,-7*k+6));let n=0;
for(const x of S.log.ses||[])if(x.date>=s&&x.date<=e)n++;for(const x of S.log.mat||[])if(x.date>=s&&x.date<=e)n++;
for(const key of Object.keys(S.ex||{})){const d=key.slice(0,10);if(d>=s&&d<=e)n++}return n}
function streak(){let k=weekCount(0)>=2?0:1,st=0;while(k<60&&weekCount(k)>=2){st++;k++}return st}
function streakTxt(){const st=streak(),now=weekCount(0);
if(st>0)return `🔥 ${L(`Racha de ${st} semana${st===1?'':'s'}`,`${st}-week streak`)}${now<2?L(` · registra ${2-now} más esta semana para mantenerla`,` · log ${2-now} more this week to keep it`):''}`;
return L(`Registra ${Math.max(0,2-now)} entreno${2-now===1?'':'s'} más esta semana para empezar tu racha`,`Log ${Math.max(0,2-now)} more session${2-now===1?'':'s'} this week to start your streak`)}
function trialLine(){if(S.trial&&S.trial.start){const left=Math.max(0,7-Math.round((today()-fromIso(S.trial.start))/864e5));return `<p class="trialp">${L(`Prueba gratis: quedan ${left} día${left===1?'':'s'} · después ${S.trial.price} €/mes`,`Free trial: ${left} day${left===1?'':'s'} left · then €${S.trial.price}/month`)}</p>`}
if(S.trial===false)return `<button class="rowcard trialask" data-act="start-trial" style="margin-top:10px"><span class="ri">✦</span><span><span class="rt">${L('Activa tus 7 días gratis','Start your 7 free days')}</span><span class="rs">${L('Plan completo, tips y tu red 360. Cancela cuando quieras.','Full plan, tips and your 360 network. Cancel anytime.')}</span></span><span class="arr">›</span></button>`;return ''}
function isClassDay(){return (S.a.days||[]).includes(dowOf(today()))}
function remindRow(){const on=S.remind===true,days=(S.a.days||[]).slice().sort((x,y)=>x-y).map(i=>DSH()[i]).join(', ');
return `<button class="rowcard" data-act="remind-toggle" style="margin-top:10px" aria-pressed="${on}"><span class="ri">🔔</span><span><span class="rt">${L('Aviso después de clase','After-class reminder')}</span><span class="rs">${on?L(`Activado: ${days}`,`On: ${days}`):L('Desactivado · toca para activar','Off · tap to turn on')}</span></span><span class="arr">${on?'<span style="color:var(--teal);font-weight:800">●</span>':'○'}</span></button>`}

function obTotal(){return obStepList().filter(s=>!s.startsWith('goal:')).length+3+2}
