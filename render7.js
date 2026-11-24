/* ================= v12 · Técnica: pestaña, ficha, vídeo ================= */
/* La vista previa publicada bloquea reproductores de otras webs; en la app instalada/web propia se incrusta */
const CAN_EMBED=!/claude\.ai|claudeusercontent|anthropic|artifact/i.test(location.hostname||'')&&location.protocol!=='file:';
function ytId(u){const m=/[?&]v=([\w-]{11})/.exec(u||'');return m?m[1]:''}
function forYou(){if(!S.a)return [];const lose=S.a.lose||[],fv=favs(S.a);
return TECH.map(t=>({t,s:t.sit.filter(x=>lose.includes(x)).length*3+t.fav.filter(x=>fv.includes(x)).length})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).map(x=>x.t)}
function whyFor(t){if(!S.a)return '';const lose=(S.a.lose||[]).filter(x=>t.sit.includes(x));if(lose.length)return L(`Para tu punto débil: ${T(SIT[lose[0]]).toLowerCase()}`,`For your weak spot: ${T(SIT[lose[0]]).toLowerCase()}`);const f=favs(S.a).filter(x=>t.fav.includes(x));return f.length?L(`De tu juego: ${T(FAV[f[0]]).split(':')[0].toLowerCase()}`,`From your game: ${T(FAV[f[0]]).split(':')[0].toLowerCase()}`):''}
function vBadge(t){return t.video.type==='pending'?`<span class="vb pend">${ic('Clapperboard')}${L('En grabación','Recording')}</span>`:`<span class="vb">${ic('Play')}${L('Vídeo','Video')}</span>`}
function techRow(t){const w=whyFor(t);return `<button class="trow" data-act="tec-open" data-v="${t.id}"><span class="pic sm t-${({drill:'sky',escape:'amber',guardia:'indigo',pase:'orange',derribo:'slate',sumision:'purple',mente:'emerald',control:'sky',defensa:'amber'})[t.cat]}">${ic(({drill:'Activity',escape:'ShieldCheck',guardia:'Shield',pase:'Zap',derribo:'Swords',sumision:'Target',mente:'Brain',control:'Trophy',defensa:'ShieldCheck'})[t.cat]||'Target')}</span><span class="tb"><span class="tt">${esc(T(t.n))}${altName(t)?` <small class="ten">${esc(altName(t))}</small>`:''}</span><span class="ts"><i class="bd l-${t.lvl}" title="${esc(T(TLVL[t.lvl]))}"></i>${esc(T(TCAT[t.cat]))}${w?' · '+esc(w):''}</span></span>${vBadge(t)}</button>`}
function videoBlock(t){const v=t.video;
if(v.type==='native')return `<video class="tvid" src="${esc(v.url)}" controls playsinline preload="metadata"${v.startSeconds?` data-start="${v.startSeconds}"`:''}></video>`;
if(v.type==='youtube'){const id=ytId(v.url),st=v.startSeconds||0;
 if(CAN_EMBED)return `<div class="tvid"><iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1${st?'&start='+st:''}" title="${esc(T(t.n))}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
 return `<div class="tvid tvph"><span class="tplay">${ic('Play')}</span><p class="tvt">${esc(T(t.n))}</p><p class="tvc">${esc(v.ch||'YouTube')}</p><p class="tvn">${L('Vista previa: el reproductor se incrusta en la app instalada. Aquí ábrelo aparte:','Preview: the player is embedded in the installed app. Open it separately here:')} <a href="${esc(v.url)}${st?'&t='+st+'s':''}" target="_blank" rel="noopener">${L('ver vídeo','watch video')} ${ic('ExternalLink')}</a></p></div>`}
return `<div class="tvid tvpend"><span class="tplay pend">${ic('Clapperboard')}</span><p class="tvt">${L('Vídeo propio en grabación','Our own video is being recorded')}</p><p class="tvn">${L('40 segundos, grabado en la academia. Mientras tanto, los puntos clave de abajo son todo lo que necesitas.','40 seconds, filmed at the academy. Meanwhile, the key points below are all you need.')}</p></div>`}
function techDetail(t){const w=whyFor(t),dr=t.drill&&DRILLS.find(d=>d.id===t.drill),rel=TECH.filter(x=>x.id!==t.id&&(x.sit.some(s=>t.sit.includes(s))||x.fav.some(f=>t.fav.includes(f)))).slice(0,3),soc=(S.socialInt||{})[t.id];
const lk=o=>(S.lang==='en'&&o.en?o.en:o.es);
return `<div class="pad tdet"><button class="link tback" data-act="tec-close">${ic('ArrowLeft')} ${L('Técnica','Technique')}</button>
<p class="tcat">${esc(T(TCAT[t.cat]))} · <span class="lvl l-${t.lvl}">${L('Cinturón','Belt')} ${esc(T(TLVL[t.lvl]))}</span></p><div class="tdhead"><h1 class="display sm">${esc(T(t.n))}${altName(t)?`<small class="ten2">${esc(altName(t))}</small>`:''}</h1><button class="kadd${(S.mastered||{})[t.id]?' on':''}" data-act="tec-master" data-v="${t.id}" aria-pressed="${!!(S.mastered||{})[t.id]}">${(S.mastered||{})[t.id]?`${ic('Check')}${L('La domino','Got it')}`:L('La domino','Got it')}</button></div>
${w?`<p class="twhy">${ic('Target')} ${esc(w)}</p>`:''}
<div class="ptabs" role="tablist"><button role="tab" data-act="tec-pane" data-v="tec" aria-selected="${S.tecPane!=='com'}">${L('Técnica','Technique')}</button><button role="tab" data-act="tec-pane" data-v="com" aria-selected="${S.tecPane==='com'}">${L('Comunidad','Community')} <small>${clipsFor(t.id).length}</small></button></div>
${S.tecPane==='com'?communityPane(t):`
${videoBlock(t)}${t.rule?`<div class="trule">${ic('CircleAlert')}<span>${esc(T(t.rule))}</span></div>`:''}
<section class="pr-card"><p class="pr-t2">${L('Puntos clave','Key points')}</p><ol class="tkeys">${lk(t.k).map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section>
<section class="pr-card"><p class="pr-t2">${L('Errores típicos','Common mistakes')}</p><ul class="terrs">${lk(t.e).map(x=>`<li>${ic('CircleAlert')}<span>${esc(x)}</span></li>`).join('')}</ul></section>
${dr?`<section class="pr-card"><p class="pr-t2">${L('Practícalo solo','Drill it solo')}</p><p class="pr-s">${esc(T(dr.n))} · ${esc(rxT(dr.d1))}</p></section>`:''}
${t.topic.length||t.sit.length?`<div class="tconn">${t.sit.map(s=>`<span class="pill">${esc(T(SIT[s]))}</span>`).join('')}${t.topic.map(c=>`<span class="pill">${L('Clase','Class')}: ${esc(T(CLASST[c]))}</span>`).join('')}</div>`:''}
${rel.length?`<p class="pg-h">${L('Relacionadas','Related')}</p><div class="pgroup">${rel.map(techRow).join('')}</div>`:''}
<button class="tsoc" data-act="tec-pane" data-v="com"><span class="pic sm t-slate">${ic('Users')}</span><span class="tb"><span class="pr-t2">${L('¿Ya la practicas? Sube tu ejecución','Already drilling it? Upload your execution')}</span><span class="pr-s">${L(`${clipsFor(t.id).length} ejecuciones de la comunidad · valora y gana karma`,`${clipsFor(t.id).length} community executions · rate and earn karma`)}</span></span><span class="pch">${ic('ChevronRight')}</span></button>`}
</div>`}
function tecTab(){if(S.vs)return vsView();const t=S.tecOpen&&techById(S.tecOpen);if(t)return techDetail(t);
const myLv=({blanco:'blanco',azul:'azul',morado:'morado'})[S.a&&S.a.belt]||'all',q=(S.tecQ||'').trim().toLowerCase(),cat=S.tecCat||'all',lv=S.tecLvl||myLv,fy=forYou(),vo=!!S.tecVid;
const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const LORD={blanco:0,azul:1,morado:2},CORD=Object.keys(TCAT);let list=TECH.filter(x=>(cat==='all'||x.cat===cat)&&(lv==='all'||x.lvl===lv)&&(!vo||x.video.type!=='pending')).sort((a,b)=>(LORD[a.lvl]-LORD[b.lvl])||(CORD.indexOf(a.cat)-CORD.indexOf(b.cat)));if(q)list=TECH.filter(x=>norm(x.n.es+' '+x.n.en+' '+T(TCAT[x.cat])+' '+(S.lang==='en'&&x.k.en?x.k.en:x.k.es).join(' ')).includes(norm(q)));
const nv=TECH.filter(x=>x.video.type!=='pending').length;
return `<div class="pad">
<header class="pr-h"><h1>${L('Técnica','Technique')}</h1><p>${lv!=='all'&&lv===myLv&&!S.tecLvl?L(`Tu temario: cinturón ${T(TLVL[lv]).toLowerCase()}`,`Your syllabus: ${T(TLVL[lv]).toLowerCase()} belt`):`${TECH.length} ${L('técnicas','techniques')} · ${nv} ${L('con vídeo','with video')}`}</p></header>
${S.clipPick?`<div class="note pickn">${ic('Video')} ${L('¿Qué técnica sale en tu clip? Búscala y ábrela.','Which technique is in your clip? Find it and open it.')} <button class="link" data-act="clip-pick-x">${L('Cancelar','Cancel')}</button></div>`:''}
<label class="tsearch">${ic('Search')}<input id="tec-q" type="search" placeholder="${L('Buscar: gamba, triángulo, montada…','Search: shrimp, triangle, mount…')}" value="${esc(S.tecQ||'')}" autocomplete="off"></label>
<div class="belts2" role="group" aria-label="${L('Cinturón','Belt')}">${[['all',L('Todos','All')]].concat(Object.entries(TLVL).map(([k,v])=>[k,T(v)])).map(([k,l])=>`<button data-act="tec-lvl" data-v="${k}" aria-pressed="${lv===k}">${k==='all'?'':`<i class="bd l-${k}"></i>`}${esc(l)} <small>${k==='all'?TECH.length:TECH.filter(x=>x.lvl===k).length}</small></button>`).join('')}</div>
<button class="fchip vtog" data-act="tec-vid" aria-pressed="${vo}">${ic('Play')} ${L('Solo con vídeo','Video only')}<span>${nv}</span></button>
<div class="kcats" role="tablist">${[['all',L('Todas','All')]].concat(Object.entries(TCAT).map(([k,v])=>[k,T(v)])).map(([k,l])=>`<button role="tab" data-act="tec-cat" data-v="${k}" aria-selected="${cat===k}">${esc(l)}</button>`).join('')}</div>
${!q&&cat==='all'&&(lv==='all'||lv===myLv)&&fy.length?`<p class="pg-h">${L('Para ti','For you')}</p><div class="pgroup">${fy.slice(0,4).map(techRow).join('')}</div>`:''}
<p class="pg-h">${q?L(`Resultados (${list.length})`,`Results (${list.length})`):cat==='all'?L('Todas las técnicas','All techniques'):esc(T(TCAT[cat]))}</p>
${list.length?`<div class="pgroup">${list.map(techRow).join('')}</div>`:`<p class="pr-s">${L('Nada con ese nombre. Prueba «guardia» o «escape».','Nothing by that name. Try “guard” or “escape”.')}</p>`}
</div>`}
function tecAct(t,act,v){const rr=()=>{save();render();return true};
switch(act){
case 'tec-com':S.tab='tec';S.tecOpen=v;S.tecPane='com';S.rate=null;S.play=null;save();render();window.scrollTo(0,0);return true;
case 'tec-open':S.tab='tec';S.tecOpen=v;S.tecPane=S.clipPick?'com':'tec';S.clipPick=false;S.rate=null;S.play=null;save();render();window.scrollTo(0,0);return true;
case 'tec-vid':S.tecVid=!S.tecVid;return rr();
case 'clip-pick-x':S.clipPick=false;return rr();
case 'tec-close':S.tecOpen=null;save();render();window.scrollTo(0,0);return true;
case 'tec-cat':S.tecCat=v;return rr();
case 'tec-lvl':S.tecLvl=v;return rr();
case 'tec-social':S.socialInt=Object.assign({},S.socialInt,{[v]:new Date().toISOString()});return rr();
}return false}
document.addEventListener('input',e=>{const t=e.target;if(t&&t.id==='tec-q'){S.tecQ=t.value;render();const i=document.getElementById('tec-q');if(i){i.focus();const n=i.value.length;try{i.setSelectionRange(n,n)}catch(_){}}}});

function altName(t){if(S.lang!=='es')return '';const n=x=>x.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\(.*?\)/g,'').trim();const es=n(t.n.es),en=t.n.en.replace(/\s*\(.*?\)\s*/g,' ').trim();return es.includes(n(en))||n(en).includes(es)?'':en}
