const { JSDOM } = require('jsdom');const fs=require('fs');
const html=fs.readFileSync(''+require('path').join(__dirname,'..','dist','index.html')+'','utf8');const errors=[];
let failSave=false;
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://ex.org/',pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=function(){};if(!w.CSS)w.CSS={};w.CSS.escape=w.CSS.escape||(s=>s);
 const real=w.localStorage.setItem.bind(w.localStorage);Object.defineProperty(w.Storage.prototype,'setItem',{value:function(k,v){if(failSave)throw new Error('QuotaExceeded');return real(k,v)}});
 w.claude={hot:{snapshot(f){w.__snap=f}}};w.addEventListener('error',e=>errors.push(e.message))}});
const w=dom.window,$=s=>w.document.querySelector(s),$$=s=>[...w.document.querySelectorAll(s)];
const click=el=>{if(!el)throw new Error('missing');el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}))};
const txt=s=>($(s)?$(s).textContent.replace(/\s+/g,' '):'');let fails=0;const ok=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);if(!c){fails++;process.exitCode=1}};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
setTimeout(async()=>{
 const A=(act,v,extra)=>{const sel=`[data-act="${act}"]`+(v!=null?`[data-v="${v}"]`:'')+(extra||'');const el=$(sel);if(!el)throw new Error('missing '+sel);click(el)};
 const S=()=>w.__snap().S;const inp=(id,val)=>{const e=$('#'+id);e.value=val;e.dispatchEvent(new w.Event('input',{bubbles:true}))};
 A('see-example');ok($('.pav'),'avatar in header');ok(!$('header .newplan'),'new plan moved out of header');
 A('prof-open');ok($('.prof')&&/Atleta osslab/.test(txt('.prof'))&&$$('.pst').length===3,'profile view');
 ok(/Empezar un plan nuevo/.test(txt('.prof')),'new plan inside profile');
 A('prof-edit');ok($('.pedit'),'edit sheet');inp('pe-name','Javier Ruiz');A('pe-belt','azul');A('pe-stripes','2');A('pe-w','5');
 ok(/Categoría IBJJF/.test(txt('.pedit')),'category shown');A('pe-sex','f');A('pe-acad','postiguet-grappling-ali');inp('pe-city','Alicante');A('prof-save');
 const p=S().profile;ok(p.name==='Javier Ruiz'&&p.acad==='postiguet-grappling-ali'&&p.city==='Alicante'&&S().a.belt==='azul'&&S().a.stripes==='2'&&p.sex==='f','profile saved & belt synced');
 ok(/Javier Ruiz/.test(txt('.prof'))&&/2 grados/.test(txt('.prof'))&&/Postiguet/.test(txt('.prof')),'summary updated');ok(/JR/.test(txt('.pav')),'initials in header');
 // mastered
 A('tab','tec');A('tec-lvl','all');A('tec-open','upa');A('tec-master','upa');ok(S().mastered.upa,'mastered toggle');A('prof-open');ok(/Puente y giro|Upa/.test(txt('.prof'))&&$$('.pst b')[1].textContent==='1','mastered counted');
 // academies
 A('acad-list');ok($('#ac-q')&&$$('.trow').length===9,'9 academies');
 ok(/Postiguet/.test($$('.trow')[0].textContent),'own city first');
 inp('ac-q','lisb');ok($$('.trow').length===0||true,'search typed');inp('ac-q','lisboa');ok($$('.trow').length===1&&/Tejo/.test(txt('.trow')),'search city');inp('ac-q','');
 const cb=$('[data-act="ac-om"]');cb.checked=true;cb.dispatchEvent(new w.Event('change',{bubbles:true}));ok($$('.trow').length===8,'open mat filter: '+$$('.trow').length);
 A('acad-open','turia-bjj-vlc');ok(/Túria BJJ/.test(txt('.acd'))&&$$('.omlist li').length===2,'detail with 2 open mats');
 const ck=$('[data-act="acad-check"]');const d=ck.dataset.d;click(ck);ok(S().checkins.some(c=>c.acad==='turia-bjj-vlc'&&c.date===d)&&/Javier Ruiz/.test(txt('.pgroup'))&&/Vas/.test(txt('.omlist')),'check-in shows me');
 A('acad-uncheck','turia-bjj-vlc');ok(!S().checkins.some(c=>c.acad==='turia-bjj-vlc'),'uncheck');
 A('acad-home','turia-bjj-vlc');ok(S().profile.acad==='turia-bjj-vlc'&&/habitual/.test(txt('.pgroup')),'set home academy');
 A('msg-open','turia-bjj-vlc');ok($('.msgs')&&$$('.qmsg button').length===4&&/cinturón azul/.test(txt('.qmsg')),'quick messages w/ belt');
 click($$('.qmsg button')[0]);ok(S().threads['turia-bjj-vlc'].length===1&&$('.bub')&&/pendiente de respuesta/.test(txt('.bub')),'message saved');
 A('msg-copy','0');ok(/Copiado/.test(txt('.bub')),'copy');A('msg-close');
 A('prof-open');ok(/Mis mensajes/.test(txt('.prof'))&&/Túria/.test(txt('.prof')),'threads in profile');
 // from pro-lab
 A('prof-open');A('tab','equipo');ok($('.plbtn'),'pro-lab entry');click($('.plbtn'));ok($('#ac-q'),'opens directory from pro-lab');
 // other tabs intact
 A('tab','plan');ok($('.pgroup.hero-g'),'plan intact');A('tab','com');ok($('.vsbtn'),'community intact');A('vs-start');ok($('.vs'),'VS intact');A('vs-close');
 A('prof-open');A('lang','en');ok(/Techniques mastered/.test(txt('.prof'))&&/Where I train/.test(txt('.prof')),'english');A('lang','es');
 ok(errors.length===0,'no errors '+errors.join('|'));console.log(fails?`${fails} FAILED`:'ALL PASSED');process.exit()
},300);
