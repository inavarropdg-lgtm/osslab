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
 A('ob-start');A('o1','nogi','[data-k="modal"]');A('o1','azul','[data-k="belt"]');A('o1wk','0');A('o1','45','[data-k=\"dur\"]');A('o1','gym','[data-k=\"place\"]');A('o-next');A('o2goal','strategy');A('o-next');A('o3s','pasar');A('o3w','tec','[data-s="pasar"]');A('o3p','ninguna');A('o-next');A('o-start');A('close-play');
 ok(!$('.tele'),'no empty telemetry on day 1 (A3)');
 A('switch-mode');
 const tp=$('[data-act="cls-topic"]');click(tp);A('cls-rec','voz');A('cls-save');
 ok($('.vnote')&&$$('.vn-svg rect').length===56,'voice note waveform');ok($$('.vn-tag').length>=1,'coach markers: '+txt('.vn-tags'));
 click($('[data-act="vn-play"]'));ok($('.vn-svg.playing')&&$('[data-act="vn-play"]').getAttribute('aria-pressed')==='true','play toggles');
 A('prof-open');A('tab','equipo');ok(/PL·FISIO·01/.test(txt('.pklist')),'lab tags on Pro-Lab');
 ok(errors.length===0,'no errors '+errors.join('|'));console.log(fails?`${fails} FAILED`:'ALL PASSED');process.exit()
},300);
