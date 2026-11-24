/* ---------- 12-week periodisation ---------- */
const H12=[44,54,64,30,68,78,86,32,82,74,64,26];
function phase(w){
if(w<=3)return {k:'p1',name:L('Base','Base'),desc:L('Construyes la base: técnica limpia y volumen moderado.','Build the base: clean technique and moderate volume.')};
if(w===4)return {k:'p1',dl:true,test:true,ms:1,name:L('Descarga e hito 1','Deload and milestone 1'),desc:L('Mitad de series con la misma carga. Al final de la semana, hito 1.','Half the sets at the same load. Milestone 1 at the end of the week.')};
if(w<=7)return {k:'p2',name:L('Construcción','Build'),desc:L('Más intensidad y trabajo más parecido al combate.','More intensity and work closer to a real match.')};
if(w===8)return {k:'p2',dl:true,test:true,ms:2,name:L('Descarga e hito 2','Deload and milestone 2'),desc:L('Mitad de series. Al final de la semana, hito 2.','Half the sets. Milestone 2 at the end of the week.')};
if(w<=11)return {k:'p3',name:L('Específico de competición','Competition-specific'),desc:L('Menos volumen, más calidad y ritmo de combate.','Less volume, more quality and match pace.')};
return {k:'p3',dl:true,test:true,ms:3,taper:true,name:L('Competición o test final','Competition or final test'),desc:L('Semana suave para llegar fresco. Hito final.','Easy week to arrive fresh. Final milestone.')}}
const curWeek=()=>{if(!S.start)return 1;const w=(S.startWeek||1)+Math.floor(Math.round((monOf(today())-fromIso(S.start))/864e5)/7);return Math.max(1,Math.min(12,w))};

/* ---------- plans offered for any 3 goals ---------- */
function plansFor(goals){return goals.map(f=>({focus:f,sup:goals.filter(g=>g!==f)}))}
function weekShape(focus,sup){const all=[focus].concat(sup),o=[];
const sc=all.filter(g=>GTPL[g]).length;o.push(sc?L('2–3 sesiones de físico de 40–50 min','2–3 strength and conditioning sessions of 40–50 min'):L('2 sesiones de fuerza general de 45 min','2 general strength sessions of 45 min'));
o.push(L('10 min de técnica en solitario en cada sesión','10 min of solo technique in every session'));
if(all.includes('strategy'))o.push(focus==='strategy'?L('2 sesiones de vídeo de 20 min','2 video sessions of 20 min'):L('1 sesión de vídeo de 20 min','1 video session of 20 min'));
if(all.includes('mind'))o.push(focus==='mind'?L('4 rutinas mentales de 10 min','4 mental routines of 10 min'):L('2 rutinas mentales de 10 min','2 mental routines of 10 min'));
if(all.includes('train')||all.includes('injury'))o.push(L('1 sesión de recuperación o yoga','1 recovery or yoga session'));
return o}

/* ---------- athlete diagnosis ---------- */
function favs(a){return Array.isArray(a.fav)?a.fav:a.fav?[a.fav]:[]}
function levelOf(a){if(a.belt)return a.belt==='blanco'?'inicial':a.belt==='azul'?'intermedio':'avanzado';const n=+a.classes||0;return n>=400?'avanzado':n>=100?'intermedio':'inicial'}
const LEVL={inicial:{es:'Inicial',en:'Beginner'},intermedio:{es:'Intermedio',en:'Intermediate'},avanzado:{es:'Avanzado',en:'Advanced'}};
function diag(a){
const Lm={tec:0,fuerza:0,peso:0,gas:0,mov:0,mente:0,agarre:0,dolor:0},items=[],extra=[];
for(const s of (a.lose||[]).filter(x=>x!=='nada')){for(const r of [].concat((a.why||{})[s]||[]))if(r&&Lm[r]!=null){Lm[r]++;items.push({s,lim:r})}}
if(a.gas==='1'){Lm.gas+=2;extra.push({b:{es:'Te falta el aire en el primer minuto',en:'You run out of air in the first minute'},lim:'gas'})}else if(a.gas==='3'){Lm.gas+=1;extra.push({b:{es:'Te falta el aire a mitad de combate',en:'You run out of air halfway through a match'},lim:'gas'})}
if(a.mob==='no'){Lm.mov+=2;extra.push({b:{es:'La prueba 90/90 no te sale sin manos',en:'You can\'t do the 90/90 test without hands'},lim:'mov'})}else if(a.mob==='cuesta'){Lm.mov+=1;extra.push({b:{es:'La prueba 90/90 te cuesta',en:'The 90/90 test is hard for you'},lim:'mov'})}
if(a.pull==='0'){Lm.fuerza++;Lm.agarre++;extra.push({b:{es:'Todavía no haces dominadas',en:'You can\'t do a pull-up yet'},lim:'fuerza'})}else if(a.pull==='1-4')Lm.fuerza++;
const pains=(a.pain||[]).filter(p=>p!=='ninguna');Lm.dolor+=Math.min(2,pains.length);
if(pains.length)extra.push({b:{es:`Molestias de ${pains.map(p=>PAIN[p].es.toLowerCase()).join(' y ')}`,en:`${pains.map(p=>PAIN[p].en).join(' and ')} niggles`},lim:'dolor'});
if(a.stress==='alto'){Lm.mente++;extra.push({b:{es:'Estrés alto fuera del tatami',en:'High stress off the mat'},lim:'mente'})}
const teach=[],seen=new Set();
for(const i of items){const q=i.lim==='tec'?TEACH[i.s]:i.lim==='peso'?TEACH_PESO:null;if(q&&!seen.has(q.es)){seen.add(q.es);teach.push({s:i.s,q})}}
return {L:Lm,items,extra,teach,pains,age:+a.age||0,drills:pickDrills(a,items,favs(a),pains),level:levelOf(a)}}
function pickDrills(a,items,F,pains){
const pool=DRILLS.filter(x=>!(x.neck&&pains.some(p=>['cuello','hombro'].includes(p))));
const sc=pool.map((x,i)=>{let s=0;for(const it of items)if(x.for.includes(it.s))s+=['tec','peso','mov'].includes(it.lim)?3:2;for(const f of F)if(x.for.includes(f))s+=1;return {x,s,i}});
const top=sc.filter(o=>o.s>0).sort((p,q)=>(q.s-p.s)||(p.i-q.i)).map(o=>o.x);
for(const id of ['gamba','levantada','shadowg']){const x=pool.find(d=>d.id===id);if(top.length<3&&x&&!top.includes(x))top.push(x)}
return top.slice(0,3)}
function drillDose(x,lv,ph){return lv==='avanzado'||(lv==='intermedio'&&ph.k!=='p1')?x.d2:x.d1}

/* ---------- the plan ---------- */
function build(){
const a=S.a,G=S.goals,F=S.focus,sup=G.filter(g=>g!==F),d=diag(a),cap=d.age>=40;
const matN=(a.days||[]).length,n=a.time==='3x45'&&matN<=4?3:2,short=a.time==='2x30'||matN>=5;
const tpls=[];const take=(g,k)=>{if(!GTPL[g])return;for(const t of GTPL[g]){if(tpls.length>=n||k<=0)break;if(!tpls.includes(t)){tpls.push(t);k--}}};
let pref=GTPL[F]?F:null;
if(F==='engine'&&a.q15==='gas'&&!tpls.length){tpls.push('cond')}
if(pref)take(pref,n===3?2:1);for(const g of sup)take(g,1);if(pref)take(pref,3);for(const g of sup)take(g,3);
while(tpls.length<n)tpls.push(tpls.includes('full')?'aerob':'full');
const keys=['A','B','C'].slice(0,n),sessions=keys.map((k,i)=>({key:k,tpl:tpls[i]}));
const intense=sessions.filter(s=>TPL[s.tpl].intense).map(s=>s.key);
const assign=pickDays(a,n,intense,keys);
let redAll=(a.sleep==='<6'?1:0)+(matN>=5?1:0)+(a.stress==='alto'?1:0);const redAcc=cap?1:0;
const Ls=S.log?loadStats():null,spike=!!(Ls&&Ls.ratio!=null&&Ls.ratio>1.3);if(spike)redAll++;
/* modules: goals not covered by a session, then limiters */
const mc={};const addm=(m,w,src)=>{if(!MOD[m])return;mc[m]=mc[m]||{w:0,src:[]};mc[m].w+=w;if(!mc[m].src.includes(src))mc[m].src.push(src)};
const has=list=>tpls.some(t=>list.includes(t));
if(G.includes('injury')&&!has(['durab','mobcore']))addm('blindaje',3,'injury');
if(G.includes('engine')&&!has(['power','cond','strend'])){const q=F==='engine'?a.q15:null;addm(q==='pot'?'potencia':(q==='gas'||d.L.gas>0)?'gas':'potencia',3,'engine')}
if(d.items.some(i=>['montada','lateral'].includes(i.s)&&['peso','fuerza'].includes(i.lim)))addm('escapes',d.L.peso+d.L.fuerza+1,'limit');
if(d.L.agarre>0)addm('agarre',d.L.agarre,'limit');
if(d.L.mov>0&&!has(['mobcore']))addm('movilidad',d.L.mov,'limit');
if(d.L.gas>0&&!has(['cond','match','strend']))addm('gas',d.L.gas,'limit');
const mods=Object.keys(mc).sort((x,y)=>mc[y].w-mc[x].w).slice(0,2);
/* weekly extras: mental, video, recovery */
const extras=[];
if(G.includes('mind'))for(let i=0;i<(F==='mind'?4:2);i++)extras.push('ment');
else if(F==='comp')extras.push('ment');
if(G.includes('strategy'))for(let i=0;i<(F==='strategy'?2:1);i++)extras.push('vid');
if(G.includes('train')||G.includes('injury')||cap)extras.push('rec');
const busy=d=>(a.days||[]).includes(d)||assign.some(x=>x.day===d);
const place={};const putX=(type,pref)=>{for(const day of pref){const cur=place[day]||[];if(cur.includes(type))continue;place[day]=cur.concat(type);return}};
const freeD=[0,1,2,3,4,5,6].filter(x=>!busy(x)),noSc=[0,1,2,3,4,5,6].filter(x=>!assign.some(y=>y.day===x));
for(const t of extras){const order=t==='rec'?freeD.concat(noSc):t==='vid'?freeD.concat(noSc):noSc.concat(freeD);putX(t,order.length?order:[6])}
/* services by week */
const svc=[];
if(d.pains.length)svc.push({c:'fisio',w:1});
if(G.includes('injury')){svc.push({c:'fisio',w:4},{c:'fisio',w:8})}else if(cap||d.pains.length)svc.push({c:'fisio',w:6});
if(['cut2','cut5','unsure'].includes(a.wcut)){svc.push({c:'nutri',w:1},{c:'nutri',w:6})}else if(G.includes('comp'))svc.push({c:'nutri',w:2});
if(G.includes('mind'))for(const w of F==='mind'?[2,6,10]:[3,9])svc.push({c:'psico',w});
if((F==='engine'||F==='comp')&&a.place==='gym')svc.push({c:'fuerza',w:1});
const adj=[];
adj.push(L(`${matN} ${matN===1?'día':'días'} de tatami → ${n} sesiones de físico por semana${short?', en versión corta':''}`,`${matN} mat ${matN===1?'day':'days'} → ${n} strength sessions per week${short?', short version':''}`));
if(a.spar>=0)adj.push(L(`Sparring duro el ${DAYC_.es[a.spar].toLowerCase()} → nada intenso el día antes`,`Hard sparring on ${DAYC_.en[a.spar]} → nothing intense the day before`));
if(cap)adj.push(L(`${d.age} años → una serie menos en los accesorios y RPE máximo 8`,`${d.age} years old → one less set on accessories and RPE 8 max`));
if(a.sleep==='<6'||a.stress==='alto')adj.push(L('Poco sueño o estrés alto → un 20 % menos de volumen','Short sleep or high stress → 20% less volume'));
if(d.pains.length){let k=0;for(const as of assign)for(const it of TPL[sessions.find(s=>s.key===as.key).tpl].items)if(exName(it[0],a,d.pains)[2])k++;if(k)adj.push(L(`Molestia de ${d.pains.map(p=>PAIN[p].es.toLowerCase()).join(' y ')} → ${k} ${k===1?'ejercicio cambiado':'ejercicios cambiados'}`,`${d.pains.map(p=>PAIN[p].en).join(' and ')} niggle → ${k} ${k===1?'exercise swapped':'exercises swapped'}`))}
if(a.place==='casa')adj.push(L('Entrenas en casa → kettlebell, mancuernas y peso corporal','Training at home → kettlebell, dumbbells and bodyweight'));
for(const m of mods){const s=mc[m].src;adj.push(s.includes('limit')?L(`Lo que te frena → ${MOD[m].es}`,`What holds you back → ${MOD[m].en}`):L(`${T(GSHORT[s[0]])} sin sesión propia → ${MOD[m].es}`,`${T(GSHORT[s[0]])} without its own session → ${MOD[m].en}`))}
if(d.drills.length)adj.push(L(`Refuerzo técnico → 10 min de drills en solitario en cada sesión (nivel ${T(LEVL[d.level]).toLowerCase()})`,`Technique reinforcement → 10 min of solo drills in every session (${T(LEVL[d.level]).toLowerCase()} level)`));
if(spike)adj.push(L(`Últimos 7 días con un ${Math.round((Ls.ratio-1)*100)} % más de carga que tu media → una serie menos en cada ejercicio esta semana`,`Last 7 days ${Math.round((Ls.ratio-1)*100)}% above your average load → one less set per exercise this week`));
return {a,G,F,sup,d,cap,n,short,sessions,assign,intense,redAll,redAcc,mods,mc,place,extras,svc,adj,matN}}
function tplOf(b,key){return TPL[b.sessions.find(s=>s.key===key).tpl]}
function sessionItems(as,idx,b,ph){
const a=b.a,t=tplOf(b,as.key),cap=b.cap,red=b.redAll+(ph.k==='p3'&&!ph.dl?1:0);
const pk=ph.k==='p1'?1:2;
let rows=t.items.map(it=>{const [id,why]=exName(it[0],a,b.d.pains);const ac=it[3]==='acc';return {id,why,acc:ac,p:presc(it[pk],red+(ac?b.redAcc:0),ph.dl,cap)}});
if(b.short)rows=rows.slice(0,4);
const ids=new Set(rows.map(r=>r.id));
const mk=b.mods.length?b.mods[idx%b.mods.length]:null,md=mk?MOD[mk]:null;
const mrows=md?md.items.map(it=>{const [id,why]=exName(it[0],a,b.d.pains);return {id,why,acc:true,mod:true,p:presc(it[pk],red,ph.dl,cap)}}).filter(r=>!ids.has(r.id)):[];
const dr=b.d.drills;const tp=dr.length?[dr[idx%dr.length],dr[(idx+1)%dr.length]].filter((x,i,arr)=>arr.indexOf(x)===i):[];
const trows=tp.map(x=>({drill:x,id:'drill:'+x.id,why:{es:'Refuerzo técnico: '+x.why.es.toLowerCase(),en:'Technique: '+x.why.en.toLowerCase()},acc:true,tech:true,p:drillDose(x,b.d.level,ph)}));
const notes=[t.note?T(t.note):'',ph.dl&&!ph.taper?L('Semana de descarga: mitad de series y la misma carga.','Deload week: half the sets at the same load.'):'',ph.taper?L('Semana de competición: series cortas y nada nuevo. Llegas fresco.','Competition week: short sets and nothing new. Arrive fresh.'):'',b.short?L('Versión corta: los 4 primeros ejercicios.','Short version: the first 4 exercises.'):'',as.note?T(as.note):''].filter(Boolean);
return {t,rows,md,mrows,trows,notes}}
const itemName=r=>r.drill?T(r.drill.n):T(EX[r.id]);

/* ---------- what you need, what you get, milestones ---------- */
function needs(b){const a=b.a,d=b.d,o=[],G=b.G;
if(G.includes('comp')||b.F==='comp'){
 if(a.when==='soon')o.push(L(`Tu competición es en ${a.weeksTo} semanas: empiezas en la semana ${13-a.weeksTo} del plan para llegar en pico.`,`Your competition is in ${a.weeksTo} weeks: you start at week ${13-a.weeksTo} of the plan to peak on time.`));
 if(a.wcut==='cut2'||a.wcut==='cut5')o.push(L(`Tienes que bajar ${a.wcut==='cut2'?'hasta 2 kg':'de 2 a 5 kg'}: como mucho medio kilo por semana, con nutricionista y sin cortes de agua de última hora.`,`You need to drop ${a.wcut==='cut2'?'up to 2 kg':'2 to 5 kg'}: half a kilo a week at most, with a nutritionist and no last-minute water cuts.`));
 if(a.wcut==='unsure')o.push(L('No sabes tu categoría: lo primero es confirmarla con tu profesor y con un nutricionista.','You don\'t know your category: first confirm it with your coach and a nutritionist.'));
 if(a.result==='r1')o.push(L('Sueles perder en la primera ronda: dos simulaciones de competición con árbitro y ritmo de combate.','You usually lose in the first round: two competition simulations with a referee and match pace.'));
 if(a.record==='0'||a.ctype==='first')o.push(L('Es tu primera competición: rutina previa y simulación para que nada te pille por sorpresa.','It\'s your first competition: a pre-match routine and a simulation so nothing catches you off guard.'))}
for(const i of d.items){const s=T(SIT[i.s]).toLowerCase();
 if(i.lim==='peso')o.push(L(`Con rivales más pesados no consigues ${s}: Módulo Escapes y una pregunta para tu profesor.`,`Against heavier opponents you struggle with ${s}: Escapes module and a question for your coach.`));
 else if(i.lim==='gas')o.push(L(`Te quedas sin gas en ${s}: rondas a ritmo de combate.`,`You gas out when ${s}: match-pace rounds.`));
 else if(i.lim==='mente')o.push(L(`Te bloqueas en ${s}: rutina de respiración antes de cada ronda dura.`,`You freeze when ${s}: a breathing routine before every hard round.`));
 else if(i.lim==='tec')o.push(L(`${T(SIT[i.s])} es técnica: te preparamos la pregunta para tu profesor y drills en solitario.`,`${T(SIT[i.s])} is technical: we prepare the question for your coach and solo drills.`))}
if(d.pains.length)o.push(L(`Molestia de ${d.pains.map(p=>PAIN[p].es.toLowerCase()).join(' y ')}: ejercicios cambiados y fisio antes de cargar más.`,`${d.pains.map(p=>PAIN[p].en).join(' and ')} niggle: exercises swapped and a physio visit before loading more.`));
if(b.cap)o.push(L(`Con ${d.age} años, la recuperación manda: una serie menos en accesorios y RPE máximo 8.`,`At ${d.age}, recovery rules: one less set on accessories and RPE 8 max.`));
if(a.sleep==='<6'||a.stress==='alto')o.push(L('Duermes poco o tienes estrés alto: un 20 % menos de volumen y una sesión de recuperación.','Short sleep or high stress: 20% less volume and a recovery session.'));
if(G.includes('strategy')&&['nada','videos'].includes(a.q15))o.push(L('No preparas tus combates: plan A y plan B por escrito en la semana 1.','You don\'t prepare your matches: plan A and plan B written down in week 1.'));
if(G.includes('mind')&&+a.q15>=7)o.push(L(`Tus nervios están en ${a.q15}/10: rutinas mentales cada semana y sesiones con un psicólogo.`,`Your nerves are at ${a.q15}/10: weekly mental routines and sessions with a psychologist.`));
if(b.F==='train'&&a.q15&&a.q15!=='same')o.push(L(`Quieres ${a.q15==='plus2'?'dos clases':'una clase'} más por semana: subimos de una en una con la carga vigilada.`,`You want ${a.q15==='plus2'?'two more classes':'one more class'} a week: we add one at a time while watching your load.`));
return [...new Set(o)].slice(0,7)}
function outcomes(b){return [b.F].concat(b.sup).map((g,i)=>({g,t:T(OUT[g][i===0?'f':'s'])}))}
const MS={
comp:[{es:'Primera simulación: 3 rondas de 6 min con árbitro y marcador',en:'First simulation: 3 × 6-min rounds with referee and score'},{es:'Peso a menos de 1 kg de tu categoría',en:'Weight within 1 kg of your category'},{es:'Competición con tu plan, tu rutina y tu peso',en:'Compete with your plan, routine and weight'}],
injury:[{es:'Tests de blindaje hechos',en:'Armour tests done'},{es:'Revisión con fisio',en:'Physio check-up'},{es:'12 semanas sin perder clases por molestias',en:'12 weeks without missing classes to niggles'}],
strategy:[{es:'Plan A y plan B escritos',en:'Plan A and plan B written down'},{es:'6 combates analizados en vídeo',en:'6 matches analysed on video'},{es:'Plan A impuesto en 3 de 5 rondas',en:'Plan A imposed in 3 out of 5 rounds'}],
train:[{es:'3 semanas seguidas cumpliendo tus clases',en:'3 weeks in a row hitting your classes'},{es:'Carga estable, nunca por encima de 1,3× tu media',en:'Stable load, never above 1.3× your average'},{es:'Una clase más por semana durante 4 semanas',en:'One more class per week for 4 weeks'}],
engine:[{es:'Tests de rondas y salto',en:'Rounds and jump tests'},{es:'Retest a mitad de plan',en:'Mid-plan retest'},{es:'Test final: +15 % en rondas',en:'Final test: +15% on rounds'}],
mind:[{es:'Rutina previa hecha 10 veces',en:'Pre-match routine done 10 times'},{es:'Nervios 2 puntos más bajos en la simulación',en:'Nerves 2 points lower in the simulation'},{es:'Competir o hacer sparring de competición con tu rutina',en:'Compete or spar competition-style with your routine'}]};
function milestones(b){return [4,8,12].map((w,i)=>({w,i,items:[b.F].concat(b.sup).map(g=>({g,key:`${w}:${g}`,t:T(MS[g][i])}))}))}
function objectives(b){const a=b.a,d=b.d,F=favs(a),o=[];
const worst=d.items.find(i=>['tec','peso','mov'].includes(i.lim));
if(worst)o.push(L(`2 rondas empezando en tu peor posición: ${T(SIT[worst.s]).toLowerCase()}`,`2 rounds starting in your worst position: ${T(SIT[worst.s]).toLowerCase()}`));
if(F[0])o.push(L(`Busca tu plan A: ${T(CHAIN[F[0]])}`,`Go for your plan A: ${T(CHAIN[F[0]])}`));
if(b.G.includes('strategy'))o.push(L('Ronda con marcador: gana por puntos con tu plan A','Round with a score: win on points with your plan A'));
if(b.G.includes('mind'))o.push(L('Antes de la ronda más dura: tu rutina de respiración','Before your hardest round: your breathing routine'));
if(b.G.includes('comp'))o.push(L('Ronda de competición: 6 minutos a tope, con reglas','Competition round: 6 minutes all-out, with rules'));
if(!o.length)o.push(L('Una ronda trabajando tu arma favorita','One round working your favourite weapon'));
const days=(a.days||[]).slice().sort((x,y)=>x-y),m={};
days.forEach((day,i)=>{m[day]=day===a.spar?o[o.length-1]:o[i%o.length]});return m}
function gamePlan(b){const F=favs(b.a),o=[];
if(F[0])o.push({k:L('Plan A','Plan A'),t:T(CHAIN[F[0]])});
if(F[1])o.push({k:L('Plan B','Plan B'),t:T(CHAIN[F[1]])});
else o.push({k:L('Plan B','Plan B'),t:L('Si no llegas a tu plan A: guardia cerrada o media guardia y volver a tu juego','If plan A fails: closed or half guard and back to your game')});
const w=b.d.items.find(i=>['tec','peso'].includes(i.lim));
if(w)o.push({k:L('Plan de escape','Escape plan'),t:L(`${T(SIT[w.s])}: lo trabajas con tu profesor (te dejamos la pregunta preparada).`,`${T(SIT[w.s])}: work it with your coach (question ready below).`)});
if(b.G.includes('strategy'))o.push({k:L('Marcador','Score'),t:L('Puntuación IBJJF: derribo y barrida 2, pasaje 3, rodilla en el estómago 2, montada y espalda 4. Si vas por delante en el último minuto, controla y no arriesgues.','IBJJF scoring: takedown and sweep 2, pass 3, knee on belly 2, mount and back 4. If you are ahead in the last minute, control and don\'t take risks.')});
return o}
const VIDT=[{es:'Graba 3 rondas tuyas de sparring',en:'Film 3 of your sparring rounds'},{es:'Analiza tus 3 rondas: dónde pierdes la posición',en:'Review your 3 rounds: where you lose position'},{es:'2 combates de tu categoría: los primeros 2 minutos',en:'2 matches in your division: the first 2 minutes'},{es:'Escribe tu plan A y tu plan B',en:'Write your plan A and plan B'},{es:'2 combates de un atleta con tu mismo juego',en:'2 matches of an athlete with your game'},{es:'Graba la simulación y apunta 3 errores',en:'Film the simulation and note 3 mistakes'},{es:'Cómo empiezan los combates en tu categoría',en:'How matches start in your division'},{es:'Gestión del marcador: 2 finales ajustadas',en:'Score management: 2 close finals'},{es:'Revisa tu plan A con tu profesor',en:'Review your plan A with your coach'},{es:'Graba la segunda simulación',en:'Film the second simulation'},{es:'Repasa tus 3 mejores rondas',en:'Rewatch your 3 best rounds'},{es:'Visualiza tu primer combate',en:'Visualise your first match'}];

/* ---------- progress ---------- */
function plannedPerWeek(b){return b.n+(b.a.days||[]).length+b.extras.length}
function progressStats(b){
const per=plannedPerWeek(b),total=per*12,start=S.start||iso(monOf(today()));
const ses=(S.log.ses||[]).filter(s=>s.date>=start).length,mat=(S.log.mat||[]).filter(m=>m.date>=start).length,ex=Object.keys(S.ex||{}).filter(k=>k.slice(0,10)>=start).length;
const done=Math.min(total,ses+mat+ex);
const cw=curWeek(),sw=S.startWeek||1,elapsed=Math.max(0,cw-sw),due=per*elapsed;
const fbw=Object.keys(S.fb||{}),fbSum=fbw.reduce((n,w)=>n+(+S.fb[w].all||0),0);
const weeksLeft=13-sw,fbScore=weeksLeft>0?fbSum/(5*weeksLeft):0;
const pct=Math.max(0,Math.min(100,Math.round(100*(0.7*done/(per*weeksLeft)+0.3*fbScore))));
return {pct,done,total:per*weeksLeft,due,adh:due?Math.min(100,Math.round(100*done/due)):null,fbN:fbw.length,fbAvg:fbw.length?fbSum/fbw.length:null,per}}

/* ---------- example athlete with 5 weeks of history ---------- */
const EXAMPLE={painAsked:true,timeAsked:true,favAsked:true,modal:'nogi',belt:'azul',stripes:'2',exp:'3-6',classes:420,age:42,weight:77,height:178,build:'atletica',when:'12',ctype:'national',wcut:'cut2',record:'1-3',result:'r1',style:'guardero',fav:['abierta','mariposa'],lose:['montada','retener','ritmo'],why:{montada:'peso',retener:'mov',ritmo:'gas'},gas:'3',mob:'cuesta',pull:'1-4',pain:['hombro'],sleep:'6-7',stress:'medio',days:[0,2,4],spar:4,time:'2x45',place:'gym',q15:'win1'};
const EX_GOALS=['comp','injury','engine'];
function seedExample(){
S.log={mat:[],ses:[]};S.ex={};S.fb={};S.ms={};
const t=today(),mon=monOf(t);S.start=iso(addD(mon,-35));S.startWeek=1;
const b=build(),log={mat:[],ses:[],seeded:iso(t)};
for(let di=35;di>=1;di--){const d=addD(t,-di),wd=dowOf(d),ds=iso(d);if(ds<S.start)continue;
 const wk=1+Math.floor(Math.round((monOf(d)-fromIso(S.start))/864e5)/7);
 if(wd===0||wd===2)log.mat.push({date:ds,type:'tecnica',min:90,rpe:6});
 if(wd===4)log.mat.push({date:ds,type:'duro',min:90,rpe:8});
 if((b.place[wd]||[]).includes('rec')&&wk!==3)S.ex[`${ds}:rec`]=true;
 if((b.place[wd]||[]).includes('ment'))S.ex[`${ds}:ment`]=true;
 const idx=b.assign.findIndex(x=>x.day===wd);if(idx<0)continue;
 const as=b.assign[idx],ph=phase(wk),it=sessionItems(as,idx,b,ph),sets={};
 for(const r of it.rows.concat(it.mrows,it.trows)){const rx=parseRx(r.p),kind=r.tech?rx.kind:kindOf(r.id,rx);if(kind==='block')continue;
  const tr=tRpe(rx,ph,r.acc,b.cap),rp=wk===1?tr-1:tr,arr=[],n=kind==='rounds'?1:rx.sets;
  for(let k=0;k<n;k++){const o={done:true};if(!MOBX.has(r.id)&&!r.tech)o.rpe=rp;
   if(kind==='kg'||kind==='kgdist'){const pr=KGP[r.id];o.kg=pr?pr[Math.min(pr.length-1,wk-1)]:10}
   if(kind==='kg'||kind==='reps')o.reps=rx.lo;if(kind==='max')o.reps=6;if(kind==='time')o.sec=rx.lo;if(kind==='rounds')o.rounds=rx.sets;
   arr.push(o)}
  sets[r.id]=arr}
 const mins=(it.t.d||40)+(it.md&&it.mrows.length?it.md.d:0)+(it.trows.length?10:0);
 log.ses.push({date:ds,key:as.key,week:wk,min:mins,srpe:ph.dl?5:as.key==='A'?7:6,sets})}
log.mat.push({date:iso(addD(t,-2)),type:'open',min:60,rpe:7});
S.log=log;S.fb={1:{all:4,g:{comp:3,injury:4,engine:4}},2:{all:4,g:{comp:4,injury:4,engine:3}},3:{all:3,g:{comp:3,injury:3,engine:3}},4:{all:4,g:{comp:4,injury:4,engine:4}},5:{all:5,g:{comp:4,injury:5,engine:4}}};
S.ms={'4:comp':true,'4:injury':true,'4:engine':true};
S.tests={dominadas:[4,6,null],faltas:[3,0,null],splank:[45,52,null],rondas:[60,66,null],salto:[205,212,null]}}

/* ---------- v6 helpers ---------- */
function dailyMin(a){return a.time==='2x30'?'15–30':a.time==='2x45'?'30–45':'30–60'}
function commit(a,focus){const n=a.time==='3x45'&&(a.days||[]).length<=4?3:2,cap=a.time==='2x30',wk=focus==='comp'&&a.when==='soon'?(+a.weeksTo||8):12;
const mx=a.time==='2x30'?30:a.time==='2x45'?45:60,R=(lo,hi)=>{const h=Math.min(hi,mx),l=Math.min(lo,h-10);return `${l}–${h}`};
const m={comp:L(`${n} sesiones/sem de ${R(45,60)} min + 2 simulaciones de competición`,`${n} sessions/wk of ${R(45,60)} min + 2 competition simulations`),
injury:L(`${n} sesiones/sem de ${R(30,45)} min + 1 de yoga o recuperación`,`${n} sessions/wk of ${R(30,45)} min + 1 yoga or recovery`),
strategy:L(`${n} sesiones/sem de ${R(30,45)} min + 2 vídeos de 20 min`,`${n} sessions/wk of ${R(30,45)} min + 2 videos of 20 min`),
train:L(`${n} sesiones/sem de ${R(30,40)} min + 1 de recuperación`,`${n} sessions/wk of ${R(30,40)} min + 1 recovery`),
engine:L(`${n} sesiones/sem de ${R(40,50)} min de potencia y gas`,`${n} sessions/wk of ${R(40,50)} min of power and gas`),
mind:L(`${n} sesiones/sem de ${R(30,45)} min + 4 rutinas mentales de 10 min`,`${n} sessions/wk of ${R(30,45)} min + 4 mental routines of 10 min`)}[focus];
return L(`${wk} semanas · `,`${wk} weeks · `)+m}
function tipsForTopic(topic,b){const T0=TIPS[topic]||{t:[],drills:[]};const tips=T0.t.slice();const drills=(T0.drills||[]).map(id=>DRILLS.find(d=>d.id===id)).filter(Boolean);
/* add one tip for the athlete's own focus area if different */
const F=favs(b.a)[0];if(F&&CHAIN[F])tips.push({es:`Y no olvides tu juego: busca tu plan A (${T(CHAIN[F])}).`,en:`And don't forget your game: hunt your plan A (${CHAIN[F].en}).`});
return {tips,drills:drills.slice(0,2)}}
