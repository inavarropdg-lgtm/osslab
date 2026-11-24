/* ================= rest timer, sound and wake lock ================= */
const RT={end:0,id:null,next:''};let AC=null,WL=null;
function beep(){try{if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=880;g.gain.value=.18;o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+.35)}catch(e){}}
function tickRT(){const el=$('#rest');if(!el)return;const ms=RT.end-Date.now();el.hidden=false;
if(ms<=0){el.querySelector('.rt').textContent=L('¡A por la siguiente!','Next one!');el.classList.add('go');if(RT.id){clearInterval(RT.id);RT.id=null}beep();try{if(navigator.vibrate)navigator.vibrate([200,100,200])}catch(e){}setTimeout(()=>{if(!RT.id){el.hidden=true;el.classList.remove('go')}},4000);return}
el.classList.remove('go');const s=Math.ceil(ms/1000);el.querySelector('.rt').textContent=`${Math.floor(s/60)}:${pad(s%60)}`;el.querySelector('.rn').textContent=RT.next}
function startRest(sec,next){if(!sec)return;try{const C=window.AudioContext||window.webkitAudioContext;if(C&&!AC)AC=new C();if(AC&&AC.state==='suspended')AC.resume()}catch(e){}RT.end=Date.now()+sec*1000;RT.next=next||'';if(RT.id)clearInterval(RT.id);RT.id=setInterval(tickRT,250);tickRT()}
function stopRest(){if(RT.id)clearInterval(RT.id);RT.id=null;const el=$('#rest');if(el){el.hidden=true;el.classList.remove('go')}}
async function wakeOn(){try{if('wakeLock' in navigator&&!WL){WL=await navigator.wakeLock.request('screen');WL.addEventListener('release',()=>{WL=null})}}catch(e){WL=null}}
function wakeOff(){try{if(WL)WL.release()}catch(e){}WL=null}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){if(S.play&&S.play.open&&S.tab==='hoy')wakeOn();if(RT.id)tickRT()}});
/* ================= voice/video uploads (simulated, offline-safe) ================= */
function processUploads(){const off=navigator.onLine===false;let ch=false;
for(const u of S.uploads||[]){if(off&&u.state==='uploading'){u.state='pending';ch=true}else if(!off&&u.state!=='done'){u.state='done';ch=true}}
if(ch){save();render()}}
window.addEventListener('online',()=>{for(const u of S.uploads||[])if(u.state==='pending')u.state='uploading';render();setTimeout(processUploads,1200)});
window.addEventListener('offline',processUploads);

/* ================= helpers ================= */
function go(tab){S.tab=tab;S.view=null;S.acadOpen=null;S.plOpen=null;S.tecOpen=null;if(S.vs){clearInterval(vsTimer);S.vs=null}S.rate=null;S.play=null;wakeOff();stopRest();save();render();window.scrollTo(0,0)}
function openAcc(id){S.open[id]=true;save();render();const el=document.querySelector(`[data-acc="${id}"]`);if(el&&el.scrollIntoView)el.scrollIntoView({block:'start'})}
function reseedIfExample(){if(S.example){S.live=null;S.lastSum=null;S.play=null;seedExample()}}
function startOnboarding(){const from=S.phaseApp?'app':'welcome';S.confirmNew=false;S.phaseApp=false;S.ob=Object.assign(obNew(),{from});stopRest();save();render()}

/* ================= onboarding finish ================= */
function finishSurvey(){
const a=clone(S.ob.a);const keepLose=(a.lose||[]).filter(s=>s!=='nada');const w={};for(const s of keepLose)if(a.why&&a.why[s])w[s]=a.why[s];a.why=w;a.lose=keepLose;
a.exp=a.exp||'';a.gq=a.gq||{};a.q15=a.gq[S.ob.focus];if(a.gq.engine)a.q15=a.q15||a.gq.engine;
if(S.ob.goals.includes('comp')&&!a.q15)a.q15=a.gq.comp;
a.weeksTo=a.when==='soon'?Math.max(4,Math.min(11,+a.weeksTo||8)):12;
a.mode=a.mode||'parallel';if(a.audio==null)a.audio=true;S.a=a;S.goals=S.ob.goals.slice();S.focus=S.ob.focus;S.example=false;S.cls={};S.clsLast=null;
S.start=iso(monOf(today()));S.startWeek=a.when==='soon'?Math.max(1,Math.min(11,13-a.weeksTo)):1;
S.log={mat:[],ses:[]};S.ex={};S.fb={};S.ms={};S.tests={};S.ck={};S.live=null;S.play=null;S.lastSum=null;S.open={};S.planWeek=null;
S.ob.step='done';save();render()}

/* ================= main click handler ================= */
document.addEventListener('click',e=>{
const t=e.target.closest('[data-act]');if(!t)return;const act=t.dataset.act,v=t.dataset.v,q=t.dataset.q;
/* language */
if(act==='lang'){S.lang=v;save();render();return}
if(v8Act(t,act,v))return;if(plAct(t,act,v))return;if(tecAct(t,act,v))return;if(socAct(t,act,v))return;if(profAct(t,act,v))return;if(coachAct(t,act,v))return;if(boardAct(t,act,v))return;if(act12(t,act,v))return;if(act13(t,act,v))return;
/* onboarding */
if(act==='ob-start'||act==='start-ob'){if(S.phaseApp&&!S.example&&((S.log.ses||[]).length+(S.log.mat||[]).length)>0){S.confirmNew=true;render();const c=$('[data-act="confirm-new"]');if(c)c.focus();return}startOnboarding();return}
if(act==='confirm-new'){startOnboarding();return}
if(act==='retry-save'){save();render();return}
if(act==='eff'){const live=ensureLive(+t.dataset.sx),id=t.dataset.id,k=+t.dataset.i,arr=live.sets[id]=live.sets[id]||[];arr[k]=Object.assign({},arr[k],{rpe:+v});save();render();const f=document.querySelector(`[data-act="eff"][data-v="${v}"][aria-pressed="true"]`);if(f)f.focus();return}
if(act==='fgo'){const live=ensureLive(S.play.sel);live.cur=+v;save();render();window.scrollTo(0,0);const f=$('.player .tick.big')||$('.player .bigtick');if(f)f.focus({preventScroll:true});return}
if(act==='mat-quick'){const q=quickClass();S.log.mat.push({date:iso(today()),type:q.type,min:q.min,rpe:q.rpe});S.example=false;save();render();return}
if(act==='mat-undo'){const ds=iso(today());for(let i=S.log.mat.length-1;i>=0;i--)if(S.log.mat[i].date===ds){S.log.mat.splice(i,1);break}save();render();return}
if(act==='reset-all'){try{localStorage.removeItem('rendai-v17')}catch(err){}stopRest();Object.assign(S,{phaseApp:false,tab:'hoy',ob:null,goals:[],focus:null,a:null,example:false,start:null,startWeek:1,log:{mat:[],ses:[]},ex:{},fb:{},ms:{},tests:{},ck:{},live:null,play:null,lastSum:null,open:{},cls:{},clsLast:null,trial:undefined,remind:undefined,school:false,confirmNew:false,planWeek:null});render();window.scrollTo(0,0);return}
if(act==='cancel-new'){S.confirmNew=false;render();return}
if(act==='see-example'){S.phaseApp=true;S.ob=null;if(!S.a){S.goals=EX_GOALS.slice();S.focus='comp';S.a=clone(EXAMPLE);S.example=true;seedExample()}save();render();return}
if(act==='pickg'){let g=S.ob.goals.slice();g=g.includes(v)?g.filter(x=>x!==v):g.length<3?g.concat(v):g;S.ob.goals=g;if(S.ob.focus&&!g.includes(S.ob.focus))S.ob.focus=null;save();render();return}
if(act==='ob-plan'){S.ob.focus=v;save();render();return}
if(act==='ob-mode'){S.ob.a.mode=v;save();render();return}
if(act==='ob-plans-next'){if(S.ob.focus){S.ob.step='mode';save();render()}return}
if(act==='ob-plans-back'){S.ob.step='survey';S.ob.si=obStepList().length-1;save();render();return}
if(act==='ob-mode-next'){if(S.ob.a.mode)finishSurvey();return}
if(act==='ob-mode-back'){S.ob.step='plans';save();render();return}
if(act==='ob-sv-next'){const steps=obStepList(),i=S.ob.si||0,id=steps[i];if(!validQ(id))return;if(i>=steps.length-1){S.ob.step='plans';save();render()}else{S.ob.si=i+1;save();render();const h=$('#qt')||$('h1');if(h&&h.focus)h.focus()}return}
if(act==='ob-sv-back'){if((S.ob.si||0)>0){S.ob.si--;save();render()}else{const back=S.ob.from==='app';S.ob=null;S.phaseApp=back;save();render()}return}
if(act==='ob-finish'){const sch=!!S.ob.school;S.school=sch;S.remind=S.ob.remind!==false;S.trial=v==='trial'?{start:iso(today()),price:sch?'6,99':'9,99'}:false;S.phaseApp=true;S.tab='hoy';S.ob=null;save();render();window.scrollTo(0,0);return}
/* survey pick */
if(act==='pick'){const a=S.ob?S.ob.a:S.a;if(q.startsWith('why:')){a.why=a.why||{};a.why[q.slice(4)]=v}else if(q.startsWith('gq:')){a.gq=a.gq||{};a.gq[q.slice(3)]=v}else a[q]=v;save();render();return}
if(act==='pickm'){const a=S.ob?S.ob.a:S.a,max=+t.dataset.max;let key=q,arr;if(q.startsWith('gq:')){a.gq=a.gq||{};key=q.slice(3);arr=(a.gq[key]||[]).slice()}else arr=(a[q]||[]).slice();
 const excl=(q==='pain'||q==='lose'||q==='gq:injury')?(q==='lose'?'nada':'ninguna'):null;
 if(excl&&v===excl)arr=arr.includes(excl)?[]:[excl];
 else{if(excl)arr=arr.filter(x=>x!==excl);arr=arr.includes(v)?arr.filter(x=>x!==v):arr.length<max?arr.concat(v):arr}
 if(q.startsWith('gq:'))a.gq[key]=arr;else a[q]=arr;save();render();return}
if(act==='day'){const a=S.ob?S.ob.a:S.a,i=+v;let ds=(a.days||[]).slice();ds=ds.includes(i)?ds.filter(x=>x!==i):ds.concat(i);a.days=ds;if(!ds.includes(a.spar))a.spar=-1;save();render();return}
/* app nav */
if(act==='tab'){go(v);return}
if(act==='goacc'){S.open[v]=!S.open[v];save();render();return}
if(act==='goteam'){S.vfilter=v;S.tab='equipo';save();render();window.scrollTo(0,0);return}
/* today / player */
if(act==='open-play'){S.play={sel:+v,date:iso(today()),open:true};S.lastSum=null;S.tab='hoy';wakeOn();save();render();window.scrollTo(0,0);return}
if(act==='close-play'){S.play=null;wakeOff();stopRest();save();render();window.scrollTo(0,0);return}
if(act==='psel'){S.play={sel:+v,date:iso(today()),open:!!(S.play&&S.play.open)};S.lastSum=null;save();render();return}
if(act==='toggle-ex'){const k=`${iso(today())}:${v}`;if(S.ex[k])delete S.ex[k];else S.ex[k]=true;save();render();return}
if(act==='ck'){const ds=iso(today());S.ck[ds]=Object.assign({},S.ck[ds],{[q]:v});if(readiness(S.ck[ds]))S.ckEdit=false;if(S.live&&!Object.values(S.live.sets).some(a=>(a||[]).some(x=>x&&x.done)))S.live=null;save();render();return}
if(act==='ckedit'){delete S.ck[iso(today())];S.ckEdit=false;if(S.live&&!Object.values(S.live.sets).some(a=>(a||[]).some(x=>x&&x.done)))S.live=null;save();render();return}
if(act==='force'){ensureLive(+v).force=true;save();render();return}
if(act==='set'){onSet(t);return}
if(act==='fin'){if(S.live){S.live.fin=true;save();render()}return}
if(act==='srpe'){if(S.live){S.live.srpe=+v;save();render()}return}
if(act==='save-ses'){saveSession(build());stopRest();wakeOff();save();render();window.scrollTo(0,0);return}
if(act==='sumclose'){S.lastSum=null;S.play=null;wakeOff();save();render();return}
if(act==='rest-add'){RT.end+=30000;if(!RT.id)RT.id=setInterval(tickRT,250);tickRT();return}
if(act==='rest-skip'){stopRest();return}
/* mat log */
if(act==='mf'){const k=t.dataset.k;if(k==='type'){S.mf.type=v;S.mf.rpe=MATR[v]}else S.mf[k]=+v;save();render();return}
if(act==='mat-save'){S.log.mat.push({date:iso(addD(today(),-S.mf.day)),type:S.mf.type,min:S.mf.min,rpe:S.mf.rpe});S.mfOk=true;S.example=false;save();render();return}
/* plan */
if(act==='pweek'){S.planWeek=+v;save();render();return}
if(act==='copy'){const b=build(),it=b.d.teach[+t.dataset.i];if(it){try{navigator.clipboard.writeText(T(it.q)).then(()=>{t.textContent=L('Copiada','Copied')},()=>{t.textContent=L('Error','Error')})}catch(err){t.textContent=L('Error','Error')}}return}
/* progress */
if(act==='fb'){const w=t.dataset.w,g=t.dataset.g;S.fb[w]=S.fb[w]||{g:{}};S.fb[w].g=S.fb[w].g||{};S.fb[w].g[g]=+v;const gs=Object.values(S.fb[w].g);S.fb[w].all=Math.round(gs.reduce((a,b)=>a+b,0)/gs.length);S.example=false;save();render();return}
/* vendors */
if(act==='vfilter'){S.vfilter=v;S.vsel=null;save();render();return}
if(act==='vpin'){S.vsel=+v;save();render();const el=$('#v-'+v);if(el&&el.scrollIntoView)el.scrollIntoView({block:'center'});return}
if(act==='switch-mode'){S.a.mode=(S.a.mode==='clases')?'parallel':'clases';if(S.a.audio==null)S.a.audio=true;S.cls={};S.clsLast=null;save();render();window.scrollTo(0,0);return}
if(act==='toggle-audio2'){S.a.audio=!(S.a.audio!==false);save();render();return}
if(act==='cls-topic'){S.cls=Object.assign({},S.cls,{topic:v});save();render();return}
if(act==='cls-rec'){S.cls=S.cls||{};S.cls.media=S.cls.media===v?null:v;save();render();return}
if(act==='cls-save'){const d=S.cls||{};if(!d.topic)return;S.log.mat.push({date:iso(today()),type:'tecnica',min:90,rpe:6,topic:d.topic,audio:!!d.media});if(d.media){S.uploads=(S.uploads||[]).concat({id:Date.now(),date:iso(today()),topic:d.topic,media:d.media,state:navigator.onLine===false?'pending':'uploading'});setTimeout(processUploads,1500)}S.clsLast={date:iso(today()),topic:d.topic};S.cls={};S.example=false;save();render();window.scrollTo(0,0);return}
if(act==='cls-again'){S.clsLast=null;S.cls={};save();render();return}
if(act==='start-trial'){S.trial={start:iso(today()),price:S.school?'6,99':'9,99'};save();render();return}
if(act==='remind-toggle'){S.remind=!(S.remind!==false);save();render();return}
if(act==='open-matlog'){S.open.matlog=true;save();render();const el=$('#matlog');if(el&&el.scrollIntoView)el.scrollIntoView({block:'start'});return}
});
document.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const t=e.target.closest('.vpin');if(t){e.preventDefault();S.vsel=+t.dataset.v;save();render()}}});
document.addEventListener('toggle',e=>{const el=e.target;if(el&&el.dataset&&el.dataset.acc){S.open[el.dataset.acc]=el.open;save()}},true);

/* ================= set logging ================= */
function onSet(t){
const sx=+t.dataset.sx,id=t.dataset.id,k=+t.dataset.i,live=ensureLive(sx),arr=live.sets[id]=live.sets[id]||[],cur=arr[k]||{};
if(cur.done){cur.done=false;arr[k]=cur;save();render();return}
const row=t.closest('.srow'),tr=+t.dataset.tr,o=Object.assign({},cur,{done:true,nm:t.dataset.nm,kind:t.dataset.kind,t:tr,lo:+t.dataset.lo,inc:+t.dataset.inc});
let bad=null;
if(row)for(const el of row.querySelectorAll('[data-lv]')){const f=el.dataset.lv,val=el.value===''?null:+el.value;if(val==null||isNaN(val)||val<=0){if(!bad)bad=el}else o[f]=val}
if(bad){bad.classList.add('err');bad.setAttribute('aria-invalid','true');bad.focus();return}
if(o.rpe==null&&tr>0)o.rpe=tr;
arr[k]=o;if(!live.start)live.start=Date.now();live.adv=true;
const pend=document.querySelectorAll('.player .srow.pv').length,pl=$('.player'),nxt=pl?pl.dataset.nextex:'';
startRest(+t.dataset.rest,pend?L(`Siguiente: serie ${k+2}`,`Next: set ${k+2}`):nxt?`${L('Siguiente','Next')}: ${nxt}`:L('Última serie: termina la sesión','Last set: finish the session'));
save();render();
const f=$('.player .tick.big')||$('.player .bigtick[aria-pressed="false"]')||$('[data-act="fin"]');if(f)f.focus({preventScroll:true})}

/* ================= inputs ================= */
function liveIn(t){const live=ensureLive(+t.dataset.sx),id=t.dataset.id,k=+t.dataset.i,arr=live.sets[id]=live.sets[id]||[];arr[k]=Object.assign({},arr[k],{[t.dataset.lv]:t.value===''?null:+t.value});t.classList.remove('err');save()}
document.addEventListener('input',e=>{const t=e.target,a=S.ob?S.ob.a:S.a;
if(t.dataset&&t.dataset.lv){liveIn(t);return}
if(t.id==='fin-min'){if(S.live)S.live.min=t.value===''?null:+t.value;save();return}
if(t.id==='q-cl'){a.classes=t.value===''?'':Math.round(+t.value);navOnly()}
else if(t.id==='q-age'){a.age=t.value===''?'':Math.round(+t.value);navOnly()}
else if(t.id==='q-wt'){a.weight=t.value===''?'':Math.round(+t.value*10)/10;navOnly()}
else if(t.id==='q-ht'){a.height=t.value===''?'':Math.round(+t.value);navOnly()}
else if(t.id==='q-wks'){a.weeksTo=t.value===''?'':Math.round(+t.value);navOnly()}
else if(t.dataset&&t.dataset.t){const id=t.dataset.t,i=+t.dataset.i,arr=(S.tests[id]||[null,null,null,null]).slice();arr[i]=t.value===''?null:+t.value;S.tests[id]=arr;S.example=false;save();
 const kp=kpisFor(S.goals).find(x=>x.id===id);if(kp){const tg=target(kp,arr[0]),pr=progress(kp,arr),g=$('#tg-'+id),m=$('#mt-'+id);if(g)g.textContent=tgText(kp,tg,pr);if(m)m.style.width=(pr==null?0:Math.round(pr*100))+'%'}}});
function navOnly(){if(S.ob&&S.ob.step==='survey'){const id=obStepList()[S.ob.si||0],ok=validQ(id),n=$('#obnext'),m=$('#miss');if(n)n.disabled=!ok;if(m)m.textContent=ok?'':missMsg(id)}save()}
document.addEventListener('change',e=>{const t=e.target,a=S.ob?S.ob.a:S.a;if(t.id==='q-spar'){a.spar=+t.value;navOnly()}else if(t.dataset&&t.dataset.act==='toggle-audio'){S.ob.a.audio=t.checked;save()}else if(t.dataset&&t.dataset.act==='school-net'){S.ob.school=t.checked;save();render()}else if(t.dataset&&t.dataset.act==='remind'){S.ob.remind=t.checked;save()}else if(t.dataset&&t.dataset.photo&&t.files&&t.files[0]){savePhoto(t.dataset.photo,t.files[0])}else if(t.dataset&&t.dataset.act==='pl-consent-tog'){S.plConsent=t.checked;save();render()}else if(t.dataset&&t.dataset.act==='school2'){S.school=t.checked;save();render()}});

/* ================= boot ================= */
function boot(data){
if(data&&data.S)Object.assign(S,data.S);else load();
if(!S.log||!S.log.mat)S.log={mat:[],ses:[]};if(!S.ck)S.ck={};if(!S.ex)S.ex={};if(!S.fb)S.fb={};if(!S.ms)S.ms={};if(!S.mf)S.mf={type:'tecnica',day:0,min:90,rpe:5};
if(!S.a){S.phaseApp=false;if(S.ob&&!S.ob.step)S.ob=null}
else if(S.example&&(S.log.seeded!==iso(today()))){reseedIfExample()}
if((S.uploads||[]).some(u=>u.state!=='done'))setTimeout(processUploads,1500);
render()}
if(window.claude&&window.claude.hot&&window.claude.hot.snapshot)window.claude.hot.snapshot(()=>({S}));
if(window.claude&&window.claude.hot&&window.claude.hot.ready)window.claude.hot.ready(boot);else boot((window.claude&&window.claude.hot&&window.claude.hot.data)||{});
}
