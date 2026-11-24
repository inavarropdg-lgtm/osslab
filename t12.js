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
 A('see-example');A('tab','prog');
 ok($('.pr-sum')&&/Plan completado/.test(txt('.pr-sum'))&&$('.pr-ring'),'exec summary card');
 ok($$('.mood').length===4&&!$('.pad input[type=number]'),'4 mood buttons, no typing inputs');
 A('mood','fatigado');const cw=S().ck&&w.__snap().S;const st=S();const wk=Object.keys(st.fb).map(Number).sort((a,b)=>b-a)[0];ok(st.fb[wk].mood==='fatigado'&&st.fb[wk].all===3,'mood saved as score 3');ok($('.mood[aria-pressed="true"]').dataset.v==='fatigado'&&/Guardado/.test(txt('.pr-ok')),'selected state');
 const nAll=$$('.krow').length;ok(nAll>=3,'tests listed: '+nAll);
 const cats=$$('[data-act="kcat"]');ok(cats.length>=3,'category chips '+cats.map(x=>x.textContent).join(','));
 click(cats[2]);ok($$('.krow').length<nAll,'filter narrows');A('kcat','all');
 const k0=$('[data-act="kinfo"]').dataset.v;A('kinfo',k0);ok($('.kinfo'),'info toggles');
 const add=$('[data-act="kadd"]');const id=add.dataset.v,i=+add.dataset.i;click(add);ok($('.kstep'),'stepper open');
 const before=S().kedit.val;A('kstep','1');A('kstep','1');click($('[data-act="ksave"]'));ok(S().tests[id][i]===before+2,'saved '+id+' wk idx '+i+' = '+S().tests[id][i]);
 ok(errors.length===0,'no errors '+errors.join('|'));console.log(fails?`${fails} FAILED`:'ALL PASSED');process.exit()
},300);
