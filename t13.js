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
 const S=()=>w.__snap().S;
 A('ob-start');A('o1','gi','[data-k="modal"]');A('o1','azul','[data-k="belt"]');A('o1wk','1');A('o1','45','[data-k=\"dur\"]');A('o1','gym','[data-k=\"place\"]');A('o-next');A('o2goal','comp');A('o1','12','[data-k="when"]');A('o-next');A('o3s','montada');A('o3w','tec','[data-s="montada"]');A('o3p','ninguna');A('o-next');A('o-start');A('close-play');
 A('tab','tec');A('tec-lvl','all');ok(/Técnica/.test(txt('.pr-h'))&&$$('.trow').length>=28,'tab with catalogue: '+$$('.trow').length);
 ok(/Para ti/.test(txt('.pad'))&&$$('.pgroup').some(g=>/montada/i.test(g.textContent)),'for-you from step 3 (montada)');
 const ids=[...new Set(w.__snap().S?[]:[])];
 A('tec-cat','sumision');ok($$('.trow').length>=20,'filter submissions: '+$$('.trow').length);A('tec-cat','all');
 const q=$('#tec-q');q.value='triangu';q.dispatchEvent(new w.Event('input',{bubbles:true}));ok($$('.trow').length>=3,'search accent-insensitive');const q2=$('#tec-q');q2.value='';q2.dispatchEvent(new w.Event('input',{bubbles:true}));
 A('tec-open','upa');ok(/Puntos clave/.test(txt('.tdet'))&&$$('.tkeys li').length===3&&$$('.terrs li').length===2,'card: 3 keys + 2 errors');
 ok($('.tvid')&&(/ver vídeo/.test(txt('.tvid'))||$('.tvid iframe')),'video block (preview fallback or iframe)');
 ok(/escapar de la montada/i.test(txt('.twhy')),'why-for-you line');
 ok($('button.tsoc[data-act="tec-pane"]'),'community CTA');
 A('tec-close');A('tec-open','sombra');ok(/Vídeo propio en grabación/.test(txt('.tvid')),'pending state');
 // unique clean ids
 const html=$('.app')?'':'';
 A('tec-close');const gs=$$('.pgroup');const allIds=[...gs[gs.length-1].querySelectorAll('.trow')].map(x=>x.dataset.v);ok(new Set(allIds).size===allIds.length&&allIds.every(i=>/^[a-z0-9-]+$/.test(i)),'unique slug ids ('+allIds.length+')');
 A('tab','plan');const lk=$('[data-act="tec-open"]');ok(!!lk,'plan drills link to card');if(lk){click(lk);ok(S().tab==='tec'&&$('.tdet'),'opens card from plan')}
 A('tab','tec');A('tec-lvl','morado');const m=$$('.trow').length;ok(m>=15&&!/Para ti/.test(txt('.pad')),'belt filter morado: '+m);A('tec-open','heel-hook');ok($('.trule')&&/marrón y negro/.test(txt('.trule')),'rule warning on heel hook');A('tec-close');A('tec-lvl','all');
 ok(errors.length===0,'no errors '+errors.join('|'));console.log(fails?`${fails} FAILED`:'ALL PASSED');process.exit()
},300);
