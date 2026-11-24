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
 A('see-example');
 ok($('.kbadge')&&/0/.test(txt('.kbadge')),'karma badge in header: '+txt('.kbadge'));
 A('tab','com');ok($('.vsbtn')&&/10 clips pendientes/.test(txt('.vsbtn')),'VS button with 10 pending: '+txt('.vsbtn'));
 ok(/Últimas ejecuciones/.test(txt('.pad')),'latest executions feed');
 A('tab','tec');A('tec-lvl','all');A('tec-open','upa');ok($$('.ptabs button').length===2&&/Comunidad\s*1/.test(txt('.ptabs')),'tabs Técnica|Comunidad (1)');
 A('tec-pane','com');ok($$('.clip').length===1&&/Laura M\./.test(txt('.clip'))&&/3,3/.test(txt('.cstat'))&&/3 valoraciones/.test(txt('.cstat')),'seed clip with avg: '+txt('.cstat'));
 // validation
 ok($('#soc-pub').disabled,'publish disabled empty');
 inp('soc-url','https://vm.tiktok.com/ZM123');ok(/enlaces cortos/.test(txt('#soc-msg'))&&$('#soc-pub').disabled,'short tiktok rejected');
 inp('soc-url','hola');ok(/Pega un enlace/.test(txt('#soc-msg')),'garbage rejected');
 inp('soc-url','https://www.instagram.com/reel/C9abcDEFghi/?igsh=x');ok(/Instagram detectado/.test(txt('#soc-msg'))&&$('#soc-pub').disabled,'instagram ok, publish waits for consent');
 inp('soc-url','https://www.tiktok.com/@bjj.alicante/video/7312345678901234567');ok(/TikTok detectado/.test(txt('#soc-msg')),'tiktok ok');
 inp('soc-url','https://youtu.be/dQw4w9WgXcQ?si=abc');ok(/YouTube detectado/.test(txt('#soc-msg')),'youtu.be ok');
 A('soc-belt','azul');A('soc-cons');A('soc-pub');ok(S().social.clips.length===1&&S().social.clips[0].belt==='azul'&&S().social.karma===10,'published +10 karma');
 ok($$('.clip').length===2&&/Tú/.test(txt('.clip'))&&$('.kbadge')&&/10/.test(txt('.kbadge')),'own clip shown, badge 10');
 ok(!$('[data-act="rate-open"][data-v^="me-"]'),'cannot rate own clip');
 // duplicate
 inp('soc-url','https://www.youtube.com/watch?v=dQw4w9WgXcQ');A('soc-cons');A('soc-pub');ok(/ya está publicado/.test(txt('#soc-msg'))&&S().social.clips.length===1,'duplicate blocked');
 // rate seed clip
 A('rate-open','seed-1');ok($('.rate')&&$$('.rstars button').length===5,'rating panel');ok(/Lista para spar/.test(txt('.rlabel'))||/Toca de 1 a 5/.test(txt('.rlabel')),'labels');
 click($('[data-act="rate-star"][data-v="4"]'));ok(/4\/5 · Lista para spar/.test(txt('.rlabel')),'star label 4');
 A('rate-chip','cadera');A('rate-chip','trans');inp('rate-com','Muy buen ángulo');click($('[data-act="rate-send"]'));
 const st=S().social;ok(st.votes['seed-1']&&st.votes['seed-1'][0].stars===4&&st.votes['seed-1'][0].chips.length===2&&st.votes['seed-1'][0].comment==='Muy buen ángulo'&&st.karma===30,'vote saved +20 (karma 30)');
 ok(/Tu valoración: 4\/5/.test(txt('#clip-seed-1'))&&/3,5/.test(txt('#clip-seed-1 .cstat'))&&/4 valoraciones/.test(txt('#clip-seed-1 .cstat')),'avg updated: '+txt('#clip-seed-1 .cstat'));
 ok(/Muy buen ángulo/.test(txt('#clip-seed-1')),'comment shown');
 // voting session
 A('tec-close');A('tab','com');ok(/9 clips pendientes/.test(txt('.vsbtn')),'pending 9 now');A('vs-start');
 ok($('.vs')&&$('#vs-bar')&&/1\/9/.test(txt('.vstop')),'VS view');
 ok($$('[data-act="vs-chip"][disabled]').length===4,'chips disabled until stars');
 const first=S().vs.q[0];click($('[data-act="rate-star"][data-v="5"]'));A('vs-chip','trans');
 ok(S().social.votes[first]&&S().vs.i===1&&/2\/9/.test(txt('.vstop')),'auto-advance after chip');
 click($('[data-act="rate-star"][data-v="3"]'));A('vs-send');ok(S().vs.i===2,'send without chip advances');
 A('vs-skip');ok(S().vs.i===3,'skip');
 ok(S().social.karma===70,'karma 70 after 2 VS votes: '+S().social.karma);
 // finish by timer
 S().vs.end=Date.now()-1;await new Promise(r=>setTimeout(r,400));ok(/Sesión terminada/.test(txt('.vsdone'))&&/2 clips/.test(txt('.vsdone'))&&/40 puntos/.test(txt('.vsdone')),'timer ends session: '+txt('.vsdone p'));
 A('vs-close');
 // karma sheet
 A('karma-open');ok($('.ksheet')&&/Valoraste a otro atleta/.test(txt('.ksheet'))&&/\+10/.test(txt('.ksheet')),'karma sheet log');
 A('karma-close');ok(!$('.ksheet'),'sheet closes');
 // delete own
 A('tab','com');A('tec-com','upa');A('clip-del',S().social.clips[0].id);ok(S().social.clips.length===0&&S().social.karma===60,'delete refunds -10');
 // EN
 A('prof-open');A('lang','en');A('view-close');A('tab','tec');A('tec-open','upa');A('tec-pane','com');ok(/Upload your execution/.test(txt('.pad'))&&/Community/.test(txt('.ptabs')),'english');A('prof-open');A('lang','es');A('view-close');
 ok(errors.length===0,'no errors '+errors.join('|'));console.log(fails?`${fails} FAILED`:'ALL PASSED');process.exit()
},300);
