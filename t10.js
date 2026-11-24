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
 // fast onboarding
 A('ob-start');A('o1','nogi','[data-k="modal"]');A('o1','azul','[data-k="belt"]');A('o1wk','0');A('o1wk','3');A('o1','45','[data-k=\"dur\"]');A('o1','gym','[data-k=\"place\"]');A('o-next');A('o2goal','injury');A('o-next');A('o3s','retener');A('o3w','fis','[data-s="retener"]');A('o3p','ninguna');A('o-next');A('o-start');A('close-play');
 ok(txt('.tabbar').includes('Comunidad')&&!txt('.tabbar').includes('Pro-Lab'),'tabbar v17');
 A('prof-open');A('tab','equipo');ok(/Ventajas de atleta profesional/.test(txt('.scr'))&&$$('[data-act="pl-sec"]').length===3,'3 sections');
 ok($$('.pklist .pkc').length===6&&!/DEMO/.test(txt('.scr'))&&!$('.vlist'),'recup: 6 partners, no DEMO, no real clinics');
 A('pl-view','mapa');ok($('.vmap rect[rx]'),'map with perk pins');
 A('pl-sec','equip');ok($$('.pklist .pkc').length===11,'gear: 11 items');A('pl-view','mapa');ok($$('.vmap rect[rx]').length===7,'shop pins on map');A('pl-open','mouth1');ok(/Tienda local/.test(txt('.scr'))===false&&/Apartar para recoger/.test(txt('.scr')),'shop item hold');A('pl-redeem','mouth1');ok(/Apartado en Hajime Store/.test(txt('.plcode'))&&!/null/.test(txt('.plcode'))&&/caja/.test(txt('.plcode')),'held code');A('pl-close');
 A('pl-open','tape1');ok(/−20 %/.test(txt('.plprice'))&&/Centro colaborador/.test(txt('.plpart')),'gear detail');A('pl-redeem','tape1');ok(/RND-\w{4}/.test(txt('.plcode')),'code issued: '+txt('.plcode b'));
 A('pl-close');ok(/RND-/.test(txt('.scr'))&&/Tus canjes/.test(txt('.scr')),'listed in redemptions');
 A('pl-sec','recup');A('pl-open','crio1');ok(/No la pegues a tu sesión de fuerza/.test(txt('.plwarn')),'crio warning');console.log('   crio best day:',txt('.pldl'));
 ok($('[data-act="pl-redeem"]').disabled,'book disabled until slot');A('pl-slot','17:30');A('pl-redeem','crio1');ok(/Reserva confirmada/.test(txt('.plcode'))&&/17:30/.test(txt('.plcode')),'booking confirmed');
 A('pl-close');A('tab','hoy');
 // T1: hard sparring yesterday + soreness a lot
 const st=S();st.log.mat.push({date:'2026-11-23',type:'duro',min:90,rpe:9});
 click($('[data-act="open-play"]'));A('ck1','35');
 if($('[data-act="ckpain"][data-v="ninguna"]'))A('ckpain','ninguna');ok(!$('.plcard')&&!$('[data-act="pl-consent"]'),'no Pro-Lab card during session');A('close-play');
 ok($('[data-act="pl-consent"]'),'consent asked before first suggestion');A('pl-consent','1');
 ok(/Ayer fue un sparring a tope/.test(txt('.plcard'))&&/Masaje de descarga/.test(txt('.plcard')),'T1 card in Hoy');
 A('pl-later');ok(!$('.plcard'),'Ahora no hides it today');
 // T2: shoulder 2 check-ins in 7 days
 S().plLater=null;S().painLog={'2026-11-21':['hombro'],'2026-11-24':['hombro']};A('tab','hoy');
 ok(/Tu hombro lleva 2 check-ins/.test(txt('.plcard'))&&/ve al médico/.test(txt('.plcard')),'T2 health-first card');
 A('pl-open','fisio1');ok(/Por qué ahora/.test(txt('.pldl'))&&/hombro/.test(txt('.pldl')),'detail shows why now');A('pl-close');
 A('pl-mute','fisio');A('tab','hoy');ok(!/Tu hombro/.test(txt('.scr')),'mute 30 days');
 // daily zone question when joints hurt
 const s2=S();delete s2.ck['2026-11-24'];delete s2.painLog['2026-11-24'];A('tab','hoy');const op=$('[data-act="open-play"]');if(op)click(op);
 if($('[data-act="ckedit"]'))A('ckedit');A('ckj','60');A('ck1','100');
 ok(/¿Dónde te molesta/.test(txt('.ck'))&&!$('.ckline'),'zone asked when joints niggle');A('ckpain','rodilla');ok($('.ckline')&&S().painLog['2026-11-24'][0]==='rodilla','zone logged, readiness shown');
 ok(errors.length===0,'no errors '+errors.join('|'));
 console.log(fails?`${fails} FAILED`:'ALL PASSED');process.exit()
},300);
