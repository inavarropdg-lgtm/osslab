/* ================= v8 · 4-step onboarding ================= */
const SIT4=['montada','retener','pasar','derribo','finalizar','ritmo'];
const PHYS={montada:'peso',lateral:'peso',retener:'mov',pasar:'fuerza',derribo:'fuerza',finalizar:'fuerza',ritmo:'gas'};
const WHY3=[['tec',{es:'Técnica',en:'Technique'}],['fis',{es:'Físico',en:'Physical'}],['mente',{es:'Me bloqueo',en:'I freeze'}]];
const G2={comp:{es:'Ganar más combates en competición',en:'Win more competition matches'},injury:{es:'Entrenar sin lesiones',en:'Train without injuries'},strategy:{es:'Tener un plan de juego',en:'Have a game plan'},train:{es:'Entrenar más y mejor',en:'Train more and better'},engine:{es:'Explosividad y gas',en:'Explosiveness and gas'},mind:{es:'Cabeza fría bajo presión',en:'Calm under pressure'}};
const WHEN3=[['soon',{es:'En menos de 12 semanas',en:'In under 12 weeks'}],['12',{es:'En unas 12 semanas',en:'In about 12 weeks'}],['none',{es:'Sin fecha todavía',en:'No date yet'}]];
const PREV={peso:{es:'fuerza para escapar de rivales más pesados',en:'strength to escape heavier opponents'},mov:{es:'movilidad de cadera para retener la guardia',en:'hip mobility to retain guard'},fuerza:{es:'fuerza para romper agarres y terminar',en:'strength to break grips and finish'},gas:{es:'gas para aguantar el ritmo del combate',en:'gas to keep the match pace'}};
function obNew(){return {step:'p1',goals:[],d:{modal:null,belt:null,stripes:'0',days:[],when:null,lose:[],why:{}}}}
function chipRow(k,list,sel,act){return `<div class="chips4" role="group">${list.map(([v,lab])=>`<button class="chipb" data-act="${act||'o1'}" data-k="${k}" data-v="${v}" aria-pressed="${sel===v}">${esc(T(lab))}</button>`).join('')}</div>`}
function obP1(){const d=S.ob.d,miss=[];
if(!d.modal)miss.push(L('modalidad','style'));if(!d.belt)miss.push(L('cinturón','belt'));if(!d.days.length)miss.push(L('días de BJJ','BJJ days'));
const body=`<p class="sub">${L('Modalidad','Style')}</p>${chipRow('modal',[['gi',{es:'Kimono',en:'Gi'}],['nogi',{es:'Sin kimono',en:'No-gi'}],['both',{es:'Las dos',en:'Both'}]],d.modal)}
<p class="sub">${L('Cinturón','Belt')}</p><div class="belts" role="group" aria-label="${L('Cinturón','Belt')}">${ents(BELT).map(([k,v])=>`<button class="belt b-${k}" data-act="o1" data-k="belt" data-v="${k}" aria-pressed="${d.belt===k}"><span class="bs" aria-hidden="true"></span>${esc(T(v))}</button>`).join('')}</div>
${d.belt?`<p class="sub">${L('Grados','Stripes')}</p><div class="stripes" role="group" aria-label="${L('Grados','Stripes')}">${['0','1','2','3','4'].map(v=>`<button data-act="o1" data-k="stripes" data-v="${v}" aria-pressed="${d.stripes===v}" aria-label="${v} ${L('grados','stripes')}">${v==='0'?'0':'<i></i>'.repeat(+v)}</button>`).join('')}</div>`:''}
<p class="sub">${L('¿Qué días entrenas BJJ?','Which days do you train BJJ?')}</p><div class="days" role="group" aria-label="${L('Días de BJJ','BJJ days')}">${DAYS().map((x,i)=>`<button class="day" data-act="o1day" data-v="${i}" aria-pressed="${d.days.includes(i)}" aria-label="${DAYC()[i]}">${x}</button>`).join('')}</div>`;
return obShell(1,4,L('¿Cómo es tu BJJ ahora mismo?','What does your BJJ look like right now?'),L('Unos toques. Con esto ajustamos tu nivel.','A few taps. This sets your level.'),body,!miss.length,'o-next','o-back',L('Te falta: ','Missing: ')+miss.join(', '))}
function obP2(){const d=S.ob.d,g=S.ob.goals,needW=g.includes('comp');
const body=`<div class="goalgrid">${GORD.map(k=>{const i=g.indexOf(k);return `<button class="goalc" data-act="o2goal" data-v="${k}" aria-pressed="${i>=0}"><span class="gi">${svg(k)}</span><span style="flex:1"><h3>${esc(T(G2[k]))}</h3></span><span class="chk num" aria-hidden="true">${i>=0?i+1:''}</span></button>`}).join('')}</div>
${needW?`<p class="sub">${L('¿Cuándo compites?','When do you compete?')}</p>${chipRow('when',WHEN3,d.when)}`:''}`;
const ok=g.length>=1&&(!needW||!!d.when),miss=!g.length?L('Elige al menos un objetivo','Pick at least one goal'):L('Te falta: cuándo compites','Missing: when you compete');
return obShell(2,4,L('¿Qué quieres conseguir en 12 semanas?','What do you want to achieve in 12 weeks?'),L('Elige hasta 3. El primero que marques será tu prioridad.','Pick up to 3. The first one you tap is your priority.'),body,ok,'o-next','o-back',miss)}
function previewLines(d){const o=[];for(const s of d.lose){const w=d.why[s];if(!w)continue;const sit=T(SIT[s]).toLowerCase();
 if(w==='tec')o.push(L(`una pregunta para tu profesor sobre ${sit}`,`a question for your coach about ${sit}`));
 else if(w==='mente')o.push(L(`una rutina para no bloquearte al ${sit.replace(/^escapar/,'escapar')}`,`a routine so you don't freeze when ${sit}`));
 else o.push(T(PREV[PHYS[s]]))}return o}
function obP3(){const d=S.ob.d,pv=previewLines(d),noWhy=d.lose.filter(s=>!d.why[s]);
const body=`<div class="chips4">${SIT4.map(k=>`<button class="chipb" data-act="o3sit" data-v="${k}" aria-pressed="${d.lose.includes(k)}">${esc(T(SIT[k]))}</button>`).join('')}</div>
${d.lose.map(s=>`<div class="whyrow"><p class="sub">${L('¿Por qué te cuesta?','Why is it hard?')} · ${esc(T(SIT[s]))}</p><div class="seg3" role="group">${WHY3.map(([k,v])=>`<button data-act="o3why" data-s="${s}" data-v="${k}" aria-pressed="${d.why[s]===k}">${esc(T(v))}</button>`).join('')}</div></div>`).join('')}
${pv.length?`<div class="preview" role="status"><p class="plabel">${L('Tu plan va a trabajar','Your plan will work on')}</p><ul>${pv.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}`;
const ok=d.lose.length>=1&&!noWhy.length,miss=!d.lose.length?L('Elige 1 o 2 situaciones','Pick 1 or 2 situations'):L(`Dinos por qué te cuesta: ${noWhy.map(s=>T(SIT[s]).toLowerCase()).join(', ')}`,`Tell us why: ${noWhy.map(s=>T(SIT[s]).toLowerCase()).join(', ')}`);
return obShell(3,4,L('¿Dónde pierdes las posiciones?','Where do you lose positions?'),L('Elige 1 o 2. Esto es lo que vamos a atacar.','Pick 1 or 2. This is what we will attack.'),body,ok,'o-next','o-back',miss,L('Ver mi plan','See my plan'))}
function draftToA(){const d=S.ob.d,why={};for(const s of d.lose){const w=d.why[s];why[s]=w==='tec'?'tec':w==='mente'?'mente':PHYS[s]}
const comp=S.ob.goals.includes('comp');
return {modal:d.modal,belt:d.belt,stripes:d.stripes,days:d.days.slice().sort((x,y)=>x-y),spar:-1,lose:d.lose.slice(),why,fav:[],pain:[],gq:{},when:comp?d.when:null,weeksTo:comp&&d.when==='soon'?8:12,time:'2x30',place:'gym',sleep:'7-8',stress:'medio',mode:'parallel',audio:true}}
function commitPlan(){S.a=draftToA();S.goals=S.ob.goals.slice();const rk=planRank(S.goals,S.a);S.focus=S.ob.pick&&S.goals.includes(S.ob.pick)?S.ob.pick:rk.order[0];
S.example=false;S.start=iso(monOf(today()));S.startWeek=S.a.when==='soon'?Math.max(1,13-S.a.weeksTo):1;
S.log={mat:[],ses:[]};S.ex={};S.fb={};S.ms={};S.tests={};S.ck={};S.live=null;S.play=null;S.lastSum=null;S.open={};S.planWeek=null;S.cls={};S.clsLast=null;S.uploads=[];
S.account=undefined;S.trial=undefined;S.notifAsked=false;S.remind=undefined;S.healthAsked=false;S.health=false;S.locAsked=false;S.loc=null}
function nextClassDay(){const d=dowOf(today()),ds=S.a.days||[];for(let k=0;k<7;k++){const x=(d+k)%7;if(ds.includes(x))return x}return null}
function obP4(){const b=build(),rk=planRank(S.goals,S.a),P=PLANS[S.focus],why=rk.why[S.focus]||[],isRec=S.focus===rk.order[0]&&rk.sc[S.focus]>0;
const week=DSH().map((dn,i)=>{const as=b.assign.find(x=>x.day===i),mat=(S.a.days||[]).includes(i);return `<div class="wd${as||mat?' on':''}"><b>${dn}</b><span>${mat?'BJJ':''}${as?`${mat?'<br>':''}${L('Físico','S&C')} ${as.key}`:''}${!as&&!mat?'—':''}</span></div>`}).join('');
const tp=todayPick(b),as=tp.as,it=as?sessionItems(as,tp.sel,b,phase(curWeek())):null,t=as?tplOf(b,as.key):null,nex=it?it.rows.length+it.mrows.length+it.trows.length:0;
const q=b.d.teach[0],nb=nextClassDay(),vc=c=>VEND.filter(v=>v.c===c).length,others=S.goals.filter(g=>g!==S.focus);
return `<div class="scr pad hero-img" style="min-height:100vh;display:flex;flex-direction:column;gap:12px">
<div class="obhead"><button class="link" data-act="o-back" aria-label="${L('Atrás','Back')}">←</button><span class="pg" role="progressbar" aria-valuemin="1" aria-valuemax="4" aria-valuenow="4"><i style="width:100%"></i></span>${langToggle()}</div>
<div class="p4ph ${phCls('belt')}"${phStyle('belt')}></div>
<p class="stepl" style="color:#9aa0a8">${L('Paso 4 de 4','Step 4 of 4')}</p>
<span class="kick">${L('Tu plan está listo','Your plan is ready')}</span>
<h1 class="display">${esc(T(P))}</h1>
${isRec?`<p class="lead2">${L('Te recomendamos este porque','We recommend this one because')} ${esc(why.slice(0,2).join(L(' y ',' and ')).toLowerCase())}.</p>`:`<p class="lead2">${esc(T(P.h))}</p>`}
<div class="wstrip" role="list" aria-label="${L('Tu semana','Your week')}">${week}</div>
${as?`<div class="outc dk"><span class="g">${L('Sesión 1','Session 1')} · ${tp.isToday?L('hoy','today'):L(`prevista el ${DAYC()[as.day].toLowerCase()}, puedes hacerla hoy`,`planned for ${DAYC()[as.day]}, you can do it today`)}</span><p><b>${esc(T(t))}</b> · ${b.short?30:t.d} min · ${nex} ${L('ejercicios','exercises')}</p><p class="small">${it.rows.slice(0,3).map(r=>esc(itemName(r))).join(' · ')}…</p></div>`:''}
${q?`<div class="outc dk"><span class="g">${L('Pregúntale a tu profesor','Ask your coach')}${nb!=null?' · '+DAYC()[nb]:''}</span><p>«${esc(T(q.q))}»</p></div>`:''}
<div class="outc dk"><span class="g">${L('Servicios','Services')}</span><p>${L(`${PERKS.filter(p=>p.lat).length} centros de recuperación y rendimiento en Alicante con precio de atleta, y descuentos en material.`,`${PERKS.filter(p=>p.lat).length} recovery and performance centres in Alicante with athlete pricing, plus gear discounts.`)}</p></div>
<button class="cta" data-act="o-start" style="margin-top:6px">${L('Empezar mi primera sesión','Start my first session')}</button>
<p class="small" style="text-align:center;color:#9aa0a8;margin:-2px 0 0">${L('Sin cuenta ni pago. Empiezas ya.','No account, no payment. Start now.')}</p>
${others.length?`<button class="link" data-act="o-others" style="color:#cdd1d6;align-self:center">${S.ob.showOthers?L('Ocultar los otros planes','Hide the other plans'):L(`Ver ${others.length===1?'el otro plan':`los otros ${others.length} planes`}`,`See the other ${others.length===1?'plan':others.length+' plans'}`)}</button>`:''}
${S.ob.showOthers?`<div class="goalgrid">${others.map(f=>`<button class="planc min" data-act="o-pick" data-v="${f}" aria-pressed="false"><span class="pt"><h3>${esc(T(PLANS[f]))}</h3></span><span class="pb"><span class="mline"><span class="ml-k">${L('Compromiso','Commit')}</span><span>${esc(commit(S.a,f))}</span></span><span class="mline"><span class="ml-k">${L('Resultado','Result')}</span><span>${esc(T(OUT[f].f))}</span></span></span></button>`).join('')}</div>`:''}
</div>`}

/* ================= v8 · progressive profiling + timed asks ================= */
function needZone(){if(!S.a)return false;if(!S.a.painAsked)return true;const ds=iso(today()),ck=S.ck[ds]||{};return !!ck.joint&&ck.joint!=='100'&&!(S.painLog||{})[ds]}
function gateR(R){return needZone()?null:R}
function askcard(title,text,btns,cls){return `<div class="askcard${cls?' '+cls:''}" role="region" aria-label="${esc(title)}"><p class="ak-t">${esc(title)}</p>${text?`<p class="ak-x">${text}</p>`:''}${btns}</div>`}
function askAW(){const a=S.a,ch=(k,list)=>`<div class="chips4" role="group">${list.map(([v,l])=>`<button class="chipb" data-act="aw" data-k="${k}" data-v="${v}" aria-pressed="${String(a[k])===v}">${l}</button>`).join('')}</div>`;
return askcard(L('Para sugerirte un peso:','To suggest a weight:'),L('¿tu edad y tu peso aproximado?','your age and approximate weight?'),`${ch('age',[['25',L('<30 años','<30 yrs')],['35','30–39'],['45','40–49'],['52','50+']])}${ch('weight',[['65','<70 kg'],['77','70–85 kg'],['92','85–100 kg'],['105','100+ kg']])}`)}
function askMob(){return askcard(L('Prueba rápida','Quick test'),L('Siéntate en 90/90: una pierna doblada delante y la otra detrás. ¿Mantienes la espalda recta sin manos?','Sit in 90/90: one leg bent in front, the other behind. Can you keep a tall back without hands?'),`<div class="seg3" role="group">${ents(MOBQ).map(([k,v])=>`<button data-act="mobq" data-v="${k}">${esc(T(v).split(',')[0])}</button>`).join('')}</div>`)}
function askDur(){return askcard(L('¿Esta duración te va bien?','Did this length suit you?'),'',`<div class="seg3" role="group">${[['short',L('Más corta','Shorter')],['ok',L('Bien','Good')],['long',L('Más larga','Longer')]].map(([k,l])=>`<button data-act="dur" data-v="${k}">${l}</button>`).join('')}</div><p class="sub" style="margin-top:10px">${L('¿Dónde entrenas?','Where do you train?')}</p><div class="seg3 two" role="group">${[['gym',L('Gimnasio','Gym')],['casa',L('Casa','Home')]].map(([k,l])=>`<button data-act="placeq" data-v="${k}" aria-pressed="${S.a.place===k}">${l}</button>`).join('')}</div>`)}
function askAcct(){return askcard(L('Guarda tu progreso','Save your progress'),L('Sin cuenta, tu progreso se queda solo en este móvil.','Without an account, your progress stays on this phone only.'),`<div class="acctb"><button class="cta sm" data-act="acct" data-v="apple"> ${L('Continuar con Apple','Continue with Apple')}</button><button class="cta ghost sm" data-act="acct" data-v="google">${L('Continuar con Google','Continue with Google')}</button><button class="cta ghost sm" data-act="acct" data-v="email">${L('Continuar con email','Continue with email')}</button></div><button class="link" data-act="acct-skip">${L('Ahora no','Not now')}</button><p class="small">${L('Demo: no se crea ninguna cuenta.','Demo: no account is created.')}</p>`,'dk')}
function askTrial(){const sch=!!S.school,price=sch?'6,99':'9,99';return askcard(L('Sigue con tu plan 12 semanas','Keep going with your 12-week plan'),L(`7 días gratis, después <b>${price} €/mes</b>. Cancela cuando quieras.`,`7 days free, then <b>€${price}/month</b>. Cancel anytime.`),`<label class="tog dk"><input type="checkbox" data-act="school2" ${sch?'checked':''}><span>${L('Mi escuela está en la red osslab: 6,99 €/mes','My school is in the osslab network: €6.99/month')}</span></label><button class="cta" data-act="start-trial" style="margin-top:10px">${L('Empezar mis 7 días gratis','Start my 7 free days')}</button><button class="link" data-act="skip-trial">${L('Ahora no','Not now')}</button><p class="small">${L('Demo: no se cobra nada.','Demo: nothing is charged.')}</p>`,'dk')}
function askNotif(){const days=(S.a.days||[]).map(i=>DSH()[i]).join(', ');return askcard(L('¿Te avisamos al acabar tus clases?','Shall we remind you after your classes?'),L(`Un aviso a las 21:30 los ${days} para registrar la clase en 1 toque.`,`A reminder at 21:30 on ${days} to log the class in 1 tap.`),`<div class="seg3 two" role="group"><button data-act="notif-yes">${L('Sí, avísame','Yes, remind me')}</button><button data-act="notif-no">${L('Ahora no','Not now')}</button></div>`)}
function askFav(){const f=favs(S.a);return askcard(L('¿Qué te salió bien hoy?','What went well today?'),L('Elige hasta 3. Será tu plan A.','Pick up to 3. It becomes your plan A.'),`<div class="chips4" role="group">${ents(FAV).map(([k,v])=>`<button class="chipb" data-act="favq" data-v="${k}" aria-pressed="${f.includes(k)}">${esc(T(v).split(':')[0])}</button>`).join('')}</div>${f.length?`<button class="cta sm" data-act="fav-done" style="margin-top:10px">${L('Listo','Done')}</button>`:''}`)}
function pendingAsk(inSummary){if(S.example||!S.a)return '';
if(inSummary&&!S.a.timeAsked)return askDur();
const any=(S.log.ses||[]).length+(S.log.mat||[]).length>0;if(!any)return '';
if(S.account===undefined)return askAcct();
if(S.trial===undefined)return askTrial();
if(!S.notifAsked)return askNotif();
return ''}
function askHealth(){return askcard(L('¿Leemos tu sueño y tu pulso automáticamente?','Shall we read your sleep and heart rate automatically?'),L('Te ahorras preguntas cada día y el plan se ajusta mejor.','You skip daily questions and the plan adapts better.'),`<div class="seg3 two" role="group"><button data-act="health-yes">${L('Conectar','Connect')}</button><button data-act="health-no">${L('Prefiero contestar yo','I\'ll answer myself')}</button></div><p class="small">${L('Demo: en la app real se conectaría con Apple Salud o Health Connect.','Demo: the real app would connect to Apple Health or Health Connect.')}</p>`)}
function painRow(){const pl=(S.painLog||{})[iso(today())],p=pl||[],asked=!!pl,daily=!!S.a.painAsked;return `<div class="ckq pain"><span>${daily?L('¿Dónde te molesta?','Where does it bother you?'):L('¿Te molesta algo hoy?','Anything bothering you today?')}</span><div class="chips4" role="group">${[['hombro',PAIN.hombro],['rodilla',PAIN.rodilla],['cuello',PAIN.cuello],['lumbar',PAIN.lumbar],['dedos',{es:'Dedos',en:'Fingers'}],['ninguna',{es:'Nada',en:'Nothing'}]].map(([k,v])=>`<button class="chipb" data-act="ckpain" data-v="${k}" aria-pressed="${k==='ninguna'?asked&&!p.length:p.includes(k)}">${esc(T(v))}</button>`).join('')}</div></div>`}
function haversine(a,b){const R=6371,dl=(b.lat-a.lat)*Math.PI/180,dn=(b.lon-a.lon)*Math.PI/180,x=Math.sin(dl/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(x))}
function askLoc(){return askcard(L('Para mostrarte fisios y nutricionistas cerca de ti','To show you physios and nutritionists near you'),'',`<div class="seg3 two" role="group"><button data-act="loc-yes">${L('Usar mi ubicación','Use my location')}</button><button data-act="loc-cp">${L('Escribir mi código postal','Enter my postcode')}</button></div>${S.cpOpen?`<div class="cprow"><label for="cp-in" class="small">${L('Código postal','Postcode')}</label><input id="cp-in" inputmode="numeric" maxlength="5" placeholder="03001"><button class="cta sm" data-act="loc-cp-save" style="width:auto;padding:0 16px">${L('Guardar','Save')}</button></div>`:''}`)}
function healthFill(){if(!S.health||!S.a)return;const ds=iso(today()),c=S.ck[ds]||{};if(c.sleep==null){S.ck[ds]=Object.assign({},c,{sleep:'100',src:'health'})}}
function ckHealth(){if(S.example||!S.a||S.healthAsked)return '';const ds=iso(today()),prev=Object.keys(S.ck||{}).filter(d=>d!==ds&&S.ck[d]&&S.ck[d].sleep!=null).length;return prev>=1?askHealth():''}
const CPLOC={"0356":[38.428,-0.398],"0369":[38.385,-0.523],"030":[38.3452,-0.481],"035":[38.395,-0.437],"031":[38.27,-0.70],"032":[38.27,-0.70]};
function cpToLoc(cp){const k=[cp.slice(0,4),cp.slice(0,3)].find(x=>CPLOC[x]);const c=k?CPLOC[k]:[38.3452,-0.481];return {lat:c[0],lon:c[1],src:'cp',cp}}
function v8Act(t,act,v){const o=S.ob,d=o&&o.d,a=S.a,rr=()=>{save();render();return true};
switch(act){
case 'o1':if(!d)return false;if(v===d[t.dataset.k]&&t.dataset.k!=='stripes'&&t.dataset.k!=='belt')d[t.dataset.k]=null;else d[t.dataset.k]=v;return rr();
case 'o1day':{const i=+v,k=d.days.indexOf(i);if(k>=0)d.days.splice(k,1);else d.days.push(i);return rr()}
case 'o2goal':{const k=o.goals.indexOf(v);if(k>=0){o.goals.splice(k,1);if(v==='comp')d.when=null}else if(o.goals.length<3)o.goals.push(v);o.pick=null;return rr()}
case 'o3sit':{const k=d.lose.indexOf(v);if(k>=0){d.lose.splice(k,1);delete d.why[v]}else{if(d.lose.length>=2){const r=d.lose.shift();delete d.why[r]}d.lose.push(v)}return rr()}
case 'o3why':d.why[t.dataset.s]=v;return rr();
case 'o-next':{if(o.step==='p1')o.step='p2';else if(o.step==='p2')o.step='p3';else if(o.step==='p3'){commitPlan();o.step='p4';o.showOthers=false}save();render();window.scrollTo(0,0);return true}
case 'o-back':{if(o.step==='p1'){if(o.from==='app'&&S.a){S.phaseApp=true;S.ob=null}else S.ob=null}else o.step={p2:'p1',p3:'p2',p4:'p3'}[o.step];save();render();window.scrollTo(0,0);return true}
case 'o-others':o.showOthers=!o.showOthers;return rr();
case 'o-pick':S.focus=v;o.pick=v;o.showOthers=false;save();render();window.scrollTo(0,0);return true;
case 'o-start':{S.phaseApp=true;S.tab='hoy';S.ob=null;const tp=todayPick(build());S.play={sel:tp.sel,date:iso(today()),open:true};S.lastSum=null;wakeOn();save();render();window.scrollTo(0,0);return true}
case 'ckpain':{const ds=iso(today());let p=((S.painLog||{})[ds]||[]).slice();if(v==='ninguna')p=[];else{const k=p.indexOf(v);if(k>=0)p.splice(k,1);else p.push(v)}a.pain=p;a.painAsked=true;S.painLog=Object.assign({},S.painLog,{[ds]:p});return rr()}
case 'aw':a[t.dataset.k]=+v;return rr();
case 'mobq':a.mob=v;return rr();
case 'dur':{if(v==='short')a.time='2x30';else if(v==='long')a.time=(a.days||[]).length<=4?'3x45':'2x45';a.timeAsked=true;return rr()}
case 'placeq':a.place=v;return rr();
case 'acct':S.account=v;return rr();
case 'acct-skip':S.account=false;return rr();
case 'skip-trial':S.trial=false;return rr();
case 'notif-yes':S.notifAsked=true;S.remind=true;try{if(window.Notification&&Notification.permission==='default')Notification.requestPermission()}catch(e){}return rr();
case 'notif-no':S.notifAsked=true;S.remind=false;return rr();
case 'favq':{const f=(a.fav||[]).slice(),k=f.indexOf(v);if(k>=0)f.splice(k,1);else if(f.length<3)f.push(v);a.fav=f;return rr()}
case 'fav-done':a.favAsked=true;return rr();
case 'health-yes':S.healthAsked=true;S.health=true;healthFill();return rr();
case 'health-no':S.healthAsked=true;return rr();
case 'loc-yes':{S.locAsked=true;S.cpOpen=false;const fb=()=>{S.loc={lat:38.3452,lon:-0.481,src:'aprox'};save();render()};
 try{if(navigator.geolocation)navigator.geolocation.getCurrentPosition(p=>{S.loc={lat:p.coords.latitude,lon:p.coords.longitude,src:'gps'};save();render()},fb,{timeout:6000,maximumAge:6e5});else fb()}catch(e){fb()}return rr()}
case 'loc-cp':S.cpOpen=true;render();{const i=$('#cp-in');if(i)i.focus()}return true;
case 'loc-cp-save':{const i=$('#cp-in'),cp=(i&&i.value||'').trim();if(!/^\d{5}$/.test(cp)){if(i){i.setAttribute('aria-invalid','true');i.focus()}return true}S.loc=cpToLoc(cp);S.locAsked=true;S.cpOpen=false;return rr()}
case 'loc-reset':S.locAsked=false;S.loc=null;return rr();
}return false}
