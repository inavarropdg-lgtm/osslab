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
 const goCom=id=>{A('tab','tec');A('tec-lvl','all');A('tec-open',id);A('tec-pane','com')};
 A('see-example');A('tab','com');
 ok($('.chcard')&&/Reto Sem\. \d+: mejor ejecución de Raspado de tijera/.test(txt('.chcard'))&&/Quedan \d+ días|Queda 1 día/.test(txt('.chleft')),'challenge card: '+txt('.cht2')+' / '+txt('.chleft'));
 ok($$('.podium li').length===3&&/Raquel N\./.test(txt('.podium li')),'podium top3, first Raquel (coach-weighted): '+$$('.podium li').map(x=>x.textContent.trim()).join(' | '));
 ok(/3 participantes/.test(txt('.chcard')),'3 entries');
 ok($('.chrank')&&$$('.chrank li').length>=5,'academy ranking');
 // coach advice pinned
 goCom('pase-toreando');ok($('.coachtip')&&/Prof\. Andrés Moya/.test(txt('.coachtip'))&&/Super Coach/.test(txt('.coachtip')),'coach advice pinned');
 // weighting: seed-4 votes 5,4,5 + coach 5x2 → (5+4+5+10)/5=4.8
 ok(/4,8/.test(txt('#clip-seed-4 .cstat')),'coach weighs double: '+txt('#clip-seed-4 .cstat'));
 ok($('.chcard.sm'),'compact challenge in community pane');
 // join challenge (no own clip) -> upload form with challenge flag
 A('tab','com');A('ch-join');ok(S().tecOpen==='tijera-guardia-cerrada'&&S().tecPane==='com'&&/entrará en el reto/.test(txt('.pad')),'join opens upload w/ challenge');
 inp('soc-url','https://youtu.be/abcdefghijk');A('soc-cons');A('soc-pub');const mc=S().social.clips[0];ok(mc.ch&&mc.ch.startsWith('ch-'),'clip entered challenge');
 ok(/4 participantes/.test(txt('.chcard'))&&/Ya participas/.test(txt('.chcard')),'counts me');
 // request coach review
 A('rv-ask',mc.id);ok($('.rvs')&&/primera revisión es gratis/.test(txt('.rvs')),'review sheet');A('rv-confirm',mc.id);ok(S().social.reviews[mc.id].status==='pending'&&/Revisión de Coach solicitada/.test(txt('#clip-'+mc.id)),'review queued');
 // super coach mode via dev toggle
 const p=S().profile||{};w.__snap().S.devPhotos=true;A('tab','prog');const dv=$('[data-act="dev-coach"]');dv.checked=true;dv.dispatchEvent(new w.Event('change',{bubbles:true}));ok(S().profile.isSuperCoach,'super coach on');
 goCom('gamba');A('rate-open','seed-7');click($('[data-act="rate-star"][data-v="5"]'));inp('rate-com','Cadera fuera antes de girar');click($('[data-act="rate-send"]'));
 ok(S().social.votes['seed-7'][0].coach&&/Consejo del Coach/.test(txt('#clip-seed-7'))&&/4,7/.test(txt('#clip-seed-7 .cstat')),'my coach vote pinned & weighted: '+txt('#clip-seed-7 .cstat'));
 A('prof-open');ok(/Super Coach verificado/.test(txt('.prof')),'profile coach badge');
 // EN
 A('prof-open');A('lang','en');A('tab','com');ok(/Week \d+ challenge/.test(txt('.chcard')),'english');A('prof-open');A('lang','es');
 ok(errors.length===0,'no errors '+errors.join('|'));console.log(fails?`${fails} FAILED`:'ALL PASSED');process.exit()
},300);
