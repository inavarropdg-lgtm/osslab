/* ---------- dates ---------- */
const pad=n=>String(n).padStart(2,'0');
const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const today=()=>{const d=new Date();d.setHours(12,0,0,0);return d};
const addD=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const dowOf=d=>(d.getDay()+6)%7;
const fromIso=s=>{const p=s.split('-').map(Number);return new Date(p[0],p[1]-1,p[2],12)};
const monOf=d=>addD(d,-dowOf(d));
const fmtD=d=>S.lang==='en'?`${DAYC()[dowOf(d)]} ${d.getDate()} ${MESL_.en[d.getMonth()]}`:`${DAYC()[dowOf(d)]} ${d.getDate()} de ${MESL_.es[d.getMonth()]}`;
const fmtS=d=>`${d.getDate()} ${MES_[S.lang==='en'?'en':'es'][d.getMonth()]}`;
const clone=o=>JSON.parse(JSON.stringify(o));
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CHEV='<span class="chev" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>';

/* ---------- training load ---------- */
const MATT={tecnica:{es:'Técnica y drilling',en:'Technique and drilling'},suave:{es:'Sparring suave',en:'Light sparring'},duro:{es:'Sparring duro',en:'Hard sparring'},comp:{es:'Competición',en:'Competition'},open:{es:'Open mat',en:'Open mat'}};
const MATR={tecnica:5,suave:6,duro:8,comp:9,open:7};
const STL={verde:{es:'Verde',en:'Green'},ambar:{es:'Ámbar',en:'Amber'},rojo:{es:'Rojo',en:'Red'}};
function loadStats(){
const t=today(),ents=[];
for(const m of S.log.mat||[])ents.push({date:m.date,ua:m.min*m.rpe,k:'mat'});
for(const s of S.log.ses||[])if(s.min&&s.srpe)ents.push({date:s.date,ua:s.min*s.srpe,k:'fis'});
if(!ents.length)return null;
const weeks=[0,1,2,3,4].map(()=>({mat:0,fis:0}));
for(const e of ents){const di=Math.round((t-fromIso(e.date))/864e5);if(di<0||di>34)continue;weeks[Math.floor(di/7)][e.k]+=e.ua}
const prev=weeks.slice(1),full=prev.filter(w=>w.mat+w.fis>0).length;
const chronic=prev.reduce((n,w)=>n+w.mat+w.fis,0)/4,acute=weeks[0].mat+weeks[0].fis;
return {weeks,acute,chronic,ratio:full>=3&&chronic>0?acute/chronic:null}}
function zone(r){return r==null?null:r<0.8?{k:'baja',t:L('Por debajo de tu media','Below your average'),s:L('por debajo de tu media','below your average')}:r<=1.3?{k:'ok',t:L('En tu rango','In your range'),s:L('dentro de tu rango','within your range')}:{k:'alta',t:L('Pico de carga','Load spike'),s:L('pico: más que tu media','spike: above your average')}}
const CKQ=[['sleep',{es:'¿Cómo has dormido?',en:'How did you sleep?'},[['0',{es:'Mal',en:'Badly'}],['50',{es:'Regular',en:'So-so'}],['100',{es:'Bien',en:'Well'}]]],['sore',{es:'¿Agujetas o cansancio muscular?',en:'Soreness or muscle fatigue?'},[['0',{es:'Mucho',en:'A lot'}],['50',{es:'Algo',en:'Some'}],['100',{es:'Nada',en:'None'}]]],['joint',{es:'¿Molestias en las articulaciones?',en:'Joint niggles?'},[['0',{es:'Me limitan',en:'Limiting'}],['60',{es:'Leves',en:'Mild'}],['100',{es:'Ninguna',en:'None'}]]],['energy',{es:'¿Energía y estrés?',en:'Energy and stress?'},[['0',{es:'Mal',en:'Poor'}],['60',{es:'Normal',en:'Normal'}],['100',{es:'Muy bien',en:'Great'}]]]];
function readiness(ck){if(!ck||CKQ.some(q=>ck[q[0]]==null))return null;
let s=CKQ.reduce((n,q)=>n+(+ck[q[0]]),0)/CKQ.length;const notes=[];
const y=iso(addD(today(),-1)),ym=(S.log.mat||[]).filter(m=>m.date===y);
if(ym.some(m=>m.rpe>=8)){s-=10;notes.push(L(`Ayer: ${ym.map(m=>T(MATT[m.type]).toLowerCase()).join(' y ')} a RPE ${Math.max(...ym.map(m=>m.rpe))} → −10`,`Yesterday: ${ym.map(m=>T(MATT[m.type]).toLowerCase()).join(' and ')} at RPE ${Math.max(...ym.map(m=>m.rpe))} → −10`))}
const Ls=loadStats();if(Ls&&Ls.ratio!=null&&Ls.ratio>1.3){s-=10;notes.push(L(`Últimos 7 días a ${fmt2(Ls.ratio)}× tu media → −10`,`Last 7 days at ${fmt2(Ls.ratio)}× your average → −10`))}
s=Math.max(0,Math.round(s));
return {s,notes,state:ck.joint==='0'||s<45?'rojo':s<70?'ambar':'verde'}}

/* ---------- prescriptions and autoregulation ---------- */
function parseRx(str){
const r={text:str,sets:0,kind:'block',lo:0,hi:0,perSide:/por lado|por pierna/.test(str),rpe:null};
const rp=str.match(/RPE (\d+)(?:–(\d+))?/);if(rp)r.rpe=+rp[1];
const m=str.match(/^(\d+)(\s(?:rondas))?\s×\s(.+)$/);
if(!m)return r;
r.sets=+m[1];const rest=m[3];let x;
if(m[2]){r.kind='rounds';return r}
if((x=rest.match(/^(\d+)(?:–(\d+))?\s*s\b/))){r.kind='time';r.lo=+x[1];r.hi=x[2]?+x[2]:+x[1];return r}
if((x=rest.match(/^(\d+)\s*m\b/))){r.kind='dist';r.lo=r.hi=+x[1];return r}
if(/^máximo/.test(rest)){r.kind='max';return r}
if((x=rest.match(/^(\d+)(?:–(\d+))?/))){r.kind='reps';r.lo=+x[1];r.hi=x[2]?+x[2]:+x[1];return r}
return r}
const isLoaded=id=>!!(EX[id]&&EX[id].inc);
function kindOf(id,rx){if(isLoaded(id)){if(rx.kind==='reps')return 'kg';if(rx.kind==='dist')return 'kgdist'}return rx.kind}
function tRpe(rx,ph,acc,cap){let t=rx.rpe!=null?rx.rpe:ph.dl?6:ph.k==='p1'?7:8;if(acc&&rx.rpe==null)t=Math.min(t,7);if(cap)t=Math.min(t,8);return t}
const e1=(kg,r,rpe)=>kg*(1+(r+Math.max(0,10-rpe))/30);
const kgFor=(e,r,rpe)=>e/(1+(r+Math.max(0,10-rpe))/30);
const rnd=(x,inc)=>Math.round(x/inc)*inc;
function hist(id){return (S.log.ses||[]).filter(s=>s.sets&&s.sets[id]&&s.sets[id].length).sort((x,y)=>x.date<y.date?1:x.date>y.date?-1:0).map(s=>({date:s.date,week:s.week,sets:s.sets[id]}))}
function bestE1(sets){let b=0;for(const x of sets)if(x.kg>0&&x.reps>0&&x.rpe)b=Math.max(b,e1(x.kg,x.reps,x.rpe));return b}
function sugKg(id,reps,t,inc,ls){
const done=(ls||[]).filter(x=>x&&x.done&&x.kg>0&&x.reps>0&&x.rpe);
if(done.length){const l=done[done.length-1];let k=rnd(kgFor(e1(l.kg,l.reps,l.rpe),reps,t),inc);
 if(l.rpe>=t+1)k=Math.min(k,l.kg-inc);else if(l.rpe<=t-1)k=Math.max(k,l.kg+inc);else k=l.kg;
 k=Math.max(inc,Math.min(k,rnd(l.kg*1.1,inc)),rnd(l.kg*0.85,inc));
 const note=l.rpe>=t+1?L(`La serie ${done.length} te costó más de lo previsto: bajamos a ${fmt(k)} kg.`,`Set ${done.length} was harder than planned: dropping to ${fmt(k)} kg.`):l.rpe<=t-1?L(`La serie ${done.length} te resultó fácil: subimos a ${fmt(k)} kg.`,`Set ${done.length} felt easy: going up to ${fmt(k)} kg.`):'';
 return {kg:k,note,warn:l.rpe>=t+1}}
const H=hist(id).slice(0,2);
if(!H.length)return {kg:null,note:L('Primera vez: elige un peso con el que te sobren 2 o 3 repeticiones. A partir de aquí, la app calcula el resto.','First time: pick a weight that leaves 2 or 3 reps in the tank. From here, the app works out the rest.')};
const best=Math.max(...H.map(h=>bestE1(h.sets)));const ws=H[0].sets.filter(x=>x.kg>0);if(!ws.length||!best)return {kg:null,note:''};
const lastKg=Math.max(...ws.map(x=>x.kg)),lr=ws[ws.length-1];
let k=rnd(kgFor(best,reps,t),inc);
if(k>lastKg)k=Math.min(k,Math.max(rnd(lastKg*1.05,inc),lastKg+inc));
if(k<lastKg)k=Math.max(k,rnd(lastKg*0.9,inc));
const df=k-lastKg;
return {kg:k,note:L(`${df>0?`Sube ${fmt(df)} kg`:df<0?`Baja ${fmt(-df)} kg`:'Mismo peso'} respecto a la última vez (${fmt(lastKg)} kg × ${lr.reps}).`,`${df>0?`Up ${fmt(df)} kg`:df<0?`Down ${fmt(-df)} kg`:'Same weight'} from last time (${fmt(lastKg)} kg × ${lr.reps}).`)}}
function sugStep(id,t,inc,ls){
const done=(ls||[]).filter(x=>x&&x.done&&x.kg>0&&x.rpe);let base=done.length?done[done.length-1]:null;
if(!base){const h=hist(id)[0];if(h){const s=h.sets.filter(x=>x.kg>0);base=s[s.length-1]||null}}
if(!base)return {kg:null,note:L('Primera vez: elige un peso que puedas llevar con buena postura.','First time: pick a weight you can carry with good posture.')};
let k=base.kg;if(base.rpe<=t-1)k+=inc;else if(base.rpe>=t+1)k=Math.max(inc,k-inc);
return {kg:k,note:k>base.kg?L(`Sube ${fmt(inc)} kg: la última vez te resultó fácil.`,`Up ${fmt(inc)} kg: last time felt easy.`):k<base.kg?L(`Baja ${fmt(inc)} kg: la última vez te costó.`,`Down ${fmt(inc)} kg: last time was hard.`):'',warn:k<base.kg}}
function lastTxt(id,kind){const h=hist(id)[0];if(!h)return '';const s=h.sets,r=s[s.length-1]||{};
const v=kind==='time'?`${s.length} × ${r.sec} s`:kind==='rounds'?`${r.rounds} ${L('rondas','rounds')}`:`${s.length} × ${r.reps}`;
return L(`La última vez (${fmtS(fromIso(h.date))}): ${v}.`,`Last time (${fmtS(fromIso(h.date))}): ${v}.`)}
function restFor(kind,acc){return kind==='kg'?(acc?90:150):kind==='kgdist'?90:kind==='reps'||kind==='max'?(acc?60:90):kind==='time'?60:0}
function rxLabel(p,kind,n,t){if(kind==='block')return rxT(p);let s=p.replace(/^\d+/,String(n));if(t)s=/RPE/.test(s)?s.replace(/RPE \d+(?:–\d+)?/,'RPE '+t):s+' · RPE '+t;return rxT(s)}
function setTxt(v,kind,per,t){const r=v.rpe&&t?` · ${effLabel(v.rpe,t)}`:'';const ps=per?L(' por lado',' per side'):'';
return kind==='kg'?`${fmt(v.kg)} kg × ${v.reps}${ps}${r}`:kind==='kgdist'?`${fmt(v.kg)} kg${r}`:kind==='time'?`${v.sec} s${ps}${r}`:kind==='rounds'?`${v.rounds} ${L('rondas','rounds')}${r}`:kind==='block'?L('Hecho','Done'):`${v.reps} reps${ps}${r}`}
function presc(str,red,dl,cap){let s=str;const m=s.match(/^(\d+)(\s(?:rondas))?\s×/);
if(m){const k=+m[1];const k2=dl?Math.max(1,Math.ceil(k/2)):(k>2?Math.max(2,k-red):k);s=s.replace(/^\d+/,String(k2))}
if(cap)s=s.replace(/RPE 8–9/g,'RPE 8').replace(/RPE 9/g,'RPE 8');return s}
function exName(id,a,pains){let x=id,why=null,pain=false;
for(const p of pains){if(SUBS[p]&&SUBS[p][x]){x=SUBS[p][x];why={es:`Cambiado por tu molestia de ${T(PAIN[p]).toLowerCase()}`,en:`Swapped for your ${PAIN[p].en.toLowerCase()} niggle`};pain=true;break}}
if(a.place==='casa'&&HOME[x]){x=HOME[x];if(!why)why={es:'Versión para casa',en:'Home version'}}
return [x,why,pain]}
function cd(x,y){const d=Math.abs(x-y);return Math.min(d,7-d)}
function pickDays(a,n,intense,order){
const days=a.days||[],spar=a.spar==null?-1:+a.spar;
const free=[0,1,2,3,4,5,6].filter(d=>!days.includes(d));
let pool=free.slice();
if(pool.length<n)pool=pool.concat(days.filter(d=>d!==spar));
const chosen=[];
while(chosen.length<n){let best=-1,bs=-99;
for(const d of pool){if(chosen.includes(d))continue;let s=chosen.length?Math.min(...chosen.map(c=>cd(c,d))):(spar>=0?cd(d,spar):3);if(!free.includes(d))s-=2;if(s>bs){bs=s;best=d}}
if(best<0)break;chosen.push(best)}
chosen.sort((x,y)=>x-y);
const as=chosen.map((d,i)=>({day:d,key:order[i],note:null}));
if(spar>=0){const before=(spar+6)%7;const bad=as.find(x=>x.day===before&&intense.includes(x.key));if(bad){const sw=as.find(x=>x!==bad&&!intense.includes(x.key));if(sw){const k=bad.key;bad.key=sw.key;sw.key=k}else bad.note={es:'Hazla a RPE 7 como máximo: mañana tienes sparring duro.',en:'Keep it to RPE 7 at most: hard sparring tomorrow.'}}}
return as}

/* ---------- goals: tests and targets ---------- */
const KPI={
comp:[{id:'rondas',n:{es:'Test de rondas',en:'Rounds test'},h:{es:'Tú solo, sin compañero: 5 rondas de 1 min de sprawl, gamba y levantada técnica, con 1 min de descanso. Suma todas las repeticiones.',en:'On your own, no partner: 5 × 1-min rounds of sprawl, shrimp and technical stand-up, 1 min rest. Add up all reps.'},u:{es:'reps',en:'reps'},pct:.15},{id:'dominadas',n:{es:'Dominadas seguidas',en:'Consecutive pull-ups'},h:{es:'Máximo con buena técnica, en barra o con agarre de kimono. Si no haces ninguna, cuenta segundos colgado.',en:'Max with good form, on a bar or gi grips. If you cannot do one, count seconds hanging.'},u:{es:'reps',en:'reps'},abs:2}],
injury:[{id:'faltas',n:{es:'Clases perdidas por molestias',en:'Classes lost to niggles'},h:{es:'Semana 0: las de las 4 semanas anteriores. Semanas 6 y 12: las de las 6 semanas anteriores.',en:'Week 0: the previous 4 weeks. Weeks 6 and 12: the previous 6 weeks.'},u:{es:'clases',en:'classes'},zero:true},{id:'splank',n:{es:'Plancha lateral',en:'Side plank'},h:{es:'Segundos con buena postura; media de los dos lados.',en:'Seconds with good form; average of both sides.'},u:{es:'s',en:'s'},pct:.25}],
strategy:[{id:'plana',n:{es:'Rolls en los que llegas a tu posición favorita (de 5)',en:'Rolls where you reach your favourite position (out of 5)'},h:{es:'Cuéntalo en una clase normal, sin organizar nada especial: de tus 5 primeros rolls, ¿en cuántos llegaste a tu posición?',en:'Count it in a normal class, nothing special: of your first 5 rolls, how many reached your position?'},u:{es:'rondas',en:'rounds'},abs:2}],
train:[{id:'clases',n:{es:'Clases por semana',en:'Classes per week'},h:{es:'Media de las últimas 4 semanas.',en:'Average over the last 4 weeks.'},u:{es:'clases',en:'classes'},abs:1}],
engine:[{id:'rondas',n:{es:'Test de rondas',en:'Rounds test'},h:{es:'5 rondas de 1 min de sprawl, gamba y levantada técnica, con 1 min de descanso. Suma todas las repeticiones.',en:'5 × 1-min rounds of sprawl, shrimp and technical stand-up, 1 min rest. Add up all reps.'},u:{es:'reps',en:'reps'},pct:.15},{id:'salto',n:{es:'Salto horizontal',en:'Broad jump'},h:{es:'Mejor de 3 saltos a pies juntos.',en:'Best of 3 standing broad jumps.'},u:{es:'cm',en:'cm'},pct:.08}],
mind:[{id:'nervios',n:{es:'Nervios antes de competir (1–10)',en:'Pre-competition nerves (1–10)'},h:{es:'Tu nota antes de un sparring de competición. Cuanto más baja, mejor.',en:'Your rating before competition-style sparring. Lower is better.'},u:{es:'/10',en:'/10'},sub:3}]};
function kpisFor(goals){const o=[];for(const g of goals)for(const k of KPI[g]||[])if(!o.some(x=>x.id===k.id))o.push(Object.assign({g},k));return o}
function target(t,s0){if(s0==null||s0==='')return null;if(t.zero)return 0;if(t.pct)return Math.round(s0*(1+t.pct));if(t.sub)return Math.max(1,s0-t.sub);let ab=t.abs;if(t.id==='clases'){const q=S.a.q15;ab=q==='plus2'?2:q==='same'?0:1}if(t.id==='simwin'||t.id==='plana')return Math.min(5,s0+ab);return s0+ab}
function lastVal(v){for(let i=v.length-1;i>0;i--)if(v[i]!=null)return v[i];return null}
function progress(t,v){const s0=v[0],last=lastVal(v);if(s0==null||last==null)return null;
if(t.zero)return last<=0?1:Math.max(0,1-last/Math.max(s0,1));
const tg=target(t,s0);if(t.sub){const span=s0-tg;return span<=0?1:Math.max(0,Math.min(1,(s0-last)/span))}
const span=tg-s0;return span<=0?(last>=s0?1:0):Math.max(0,Math.min(1,(last-s0)/span))}
function tgText(t,tg,pr){if(tg==null)return L('Apunta la semana 0','Log week 0');const u=T(t.u);if(pr!=null&&pr>=1)return L(`Conseguido · objetivo ${fmt(tg)} ${u}`,`Achieved · target ${fmt(tg)} ${u}`);return L(`Objetivo: ${fmt(tg)} ${u}`,`Target: ${fmt(tg)} ${u}`)}
