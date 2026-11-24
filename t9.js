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
 ok(/Crear mi plan en 1 minuto/.test(txt('.scr')),'welcome CTA');
 A('ob-start');ok(/Paso 1 de 4/.test(txt('.scr'))&&/Cómo es tu semana/.test(txt('.scr')),'p1 shown');
 ok($('#obnext').disabled&&/modalidad, cinturón, al menos un día de BJJ, duración, material/.test(txt('#miss')),'p1 blocked with miss msg: '+txt('#miss'));
 A('o1','gi','[data-k="modal"]');A('o1','azul','[data-k="belt"]');ok($$('.stripes button').length===5,'stripes after belt');
 A('o1','2','[data-k="stripes"]');A('o1wk','0');A('o1wk','3');A('o1wk','1');A('o1wk','2');A('o1wk','2');A('o1wk','5');A('o1wk','5');A('o1wk','5');
 ok(/BJJ\+Gym/.test(txt('.wkgrid'))&&/Gym/.test(txt('[data-act="o1wk"][data-v="2"]')),'week grid states');ok($('#obnext').disabled,'still needs dur/material');
 A('o1','45','[data-k="dur"]');A('o1','gym','[data-k="place"]');ok(!$('#obnext').disabled,'p1 ok');
 A('o-next');ok(/Paso 2 de 4/.test(txt('.scr')),'p2');
 A('o2goal','comp');A('o2goal','injury');ok(txt('[data-act="o2goal"][data-v="comp"] .chk')==='1'&&txt('[data-act="o2goal"][data-v="injury"] .chk')==='2','priority numbers');
 ok($('#obnext').disabled&&/cuándo compites/.test(txt('#miss')),'needs when');A('o1','12','[data-k="when"]');ok(!$('#obnext').disabled,'p2 ok');
 A('o-next');ok(/Paso 3 de 4/.test(txt('.scr')),'p3');
 A('o3s','montada');A('o3s','pasar');A('o3s','espalda');A('o3s','derribo');ok(S().ob.d.lose.join()==='montada,pasar,espalda'&&$('[data-act="o3s"][data-v="derribo"]').getAttribute('aria-disabled')==='true'&&/3\/3/.test(txt('.cnt')),'max 3, no silent replace');
 ok($$('.whyrow').length===3&&$('#obnext').disabled,'needs why');
 A('o3w','fis','[data-s="montada"]');A('o3w','tec','[data-s="pasar"]');A('o3w','mente','[data-s="pasar"]');A('o3w','nose','[data-s="espalda"]');ok($('.preview')&&/rivales más pesados/.test(txt('.preview'))&&/cadena de 3 técnicas/.test(txt('.preview')),'live preview: '+txt('.preview'));
 ok($('#obnext').disabled&&/molestia/.test(txt('#miss')),'needs pain answer');A('o3p','hombro');
 ok(txt('#obnext')==='Ver mi plan','CTA label');
 A('o-next');const s=S();ok(s.a&&s.a.why.montada.join()==='peso'&&s.a.why.pasar.join()==='tec,mente'&&s.a.why.espalda.join()==='tec,peso'&&s.a.belt==='azul'&&s.a.days.join()==='0,1,3,5'&&s.a.gymDays.join()==='2,5'&&s.a.pain.join()==='hombro'&&s.a.time==='2x45','a mapped');
 ok(/Tu plan está listo/.test(txt('.scr'))&&$$('.wd').length===7&&/Empezar mi primera sesión/.test(txt('.scr')),'p4 hero');
 ok(/Sin cuenta ni pago/.test(txt('.scr')),'no account note');console.log('   p4:',txt('.scr').slice(0,420));
 A('o-others');ok($$('[data-act="o-pick"]').length===1,'other plan shown');
 A('o-start');ok(S().phaseApp&&S().play&&S().play.open,'session opened directly');
 ok($('.faces')&&/1 toque/.test(txt('.ck')),'1-tap check-in');ok($('[data-act="mobq"]'),'mob test ask in player');
 A('ck1','100');ok($('.ckline'),'readiness after 1 tap');
 A('mobq','cuesta');ok(S().a.mob==='cuesta','mob saved');
 const hasAW=!!$('[data-act="aw"]');console.log('   AW ask present:',hasAW);if(hasAW){A('aw','45','[data-k="age"]');A('aw','77','[data-k="weight"]');ok(S().a.age===45&&S().a.weight===77&&!$('[data-act="aw"]'),'age/weight saved and card gone')}
 A('bd-mode','track');let guard=0;while(guard++<60){const tk=$('.player [data-act="set"][aria-pressed="false"]')||$('.player .bigtick[aria-pressed="false"]');if(!tk)break;click(tk);const sk=$('[data-act="rest-skip"]');if(sk&&!$('#rest').hidden)click(sk)}
 A('fin');A('srpe','7');click($('[data-act="save-ses"]'));
 ok(/guardada/.test(txt('.scr'))&&!$('[data-act="dur"]'),'summary, no extra duration ask');
 ok($('[data-act="acct"]')&&/Guarda tu progreso/.test(txt('.scr')),'account ask after first session');A('acct-skip');
 ok(/7 días gratis/.test(txt('.scr'))&&/9,99/.test(txt('.scr')),'trial ask');A('skip-trial');ok(S().trial===false,'trial skipped');
 ok(/Te avisamos al acabar/.test(txt('.scr'))&&/Lun, Mar, Jue, Sáb/.test(txt('.scr')),'notif ask: days');A('notif-yes');ok(S().remind===true&&S().notifAsked,'notif yes');
 ok(!$('.askcard'),'no more asks');A('sumclose');
 // class day today (Mon)
 ok($('.classcard'),'class card');A('mat-i','6');ok($('[data-act="favq"]'),'fav ask after class');A('favq','cerrada');A('fav-done');ok(S().a.favAsked&&!$('[data-act="favq"]'),'fav saved');
 // health ask on 2nd check-in day
 const st=S();st.ck['2026-11-21']=st.ck['2026-11-24'];delete st.ck['2026-11-24'];A('tab','hoy');const op=$('[data-act="open-play"]');click(op);
 ok($('[data-act="health-yes"]'),'health soft-ask on 2nd check-in day');A('health-yes');ok(S().health,'health connected');A('close-play');
 // equipo location
 A('prof-open');A('tab','equipo');ok($('[data-act="loc-cp"]'),'location soft-ask');A('loc-cp');const inp=$('#cp-in');inp.value='03560';A('loc-cp-save');
 ok(S().loc&&S().loc.src==='cp'&&/[\d,]+ km/.test(txt('.pklist'))&&/03560/.test(txt('.scr')),'sorted by distance');
 ok(errors.length===0,'no errors '+errors.join('|'));
 console.log(fails?`${fails} FAILED`:'ALL PASSED');process.exit()
},300);
