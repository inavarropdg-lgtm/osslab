/* ================= v10 · Mat Lab telemetry, voice note ================= */
function segMeter(val,max,cls,n){n=n||10;const on=Math.round(Math.max(0,Math.min(1,val/max))*n);return `<span class="seg ${cls||''}" aria-hidden="true">${Array.from({length:n},(_,i)=>`<i class="${i<on?'on':''}"></i>`).join('')}</span>`}
function teleStrip(b,R){const ls=loadStats(),cw=curWeek(),wc=weekCount(0),plan=(b.assign||[]).length+((S.a&&S.a.days)||[]).length,st=streak();
const rs=R?R.state:null,stTxt={verde:L('LISTO','READY'),ambar:L('AJUSTADA','ADJUSTED'),rojo:L('RECUPERA','RECOVER')},led2={verde:'on',ambar:'amb',rojo:'red'};
const z=ls&&ls.ratio!=null?zone(ls.ratio):null,zc=z?{baja:'lo',ok:'ok',alta:'hi'}[z.k]:'',pct=R?R.s:0,C=2*Math.PI*34;
const zt=z?{baja:L('↓ Bajando','↓ Dropping'),ok:L('= Estable','= Steady'),alta:L('↑ Subiendo mucho','↑ Rising fast')}[z.k]:'';
const tiles=[];
if(R)tiles.push(`<div class="tc tc-r"><p class="tk">${ic('HeartPulse')}${L('CÓMO LLEGAS','HOW YOU FEEL')} ${led(led2[rs])}</p>
<div class="gauge"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="34" class="g-bg"/><circle cx="40" cy="40" r="34" class="g-fg" stroke-dasharray="${(C*pct/100).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 40 40)"/></svg><b class="tv">${R.s}</b></div>
<p class="mono st">${stTxt[rs]}</p></div>`);
if(z)tiles.push(`<div class="tc"><p class="tk">${ic('Activity')}${L('CARGA','LOAD')}</p><p class="tv tvs">${esc(zt)}</p>${spark(ls)}<p class="tz mono ${zc}">${L('VS. TUS 4 SEMANAS','VS. YOUR 4 WEEKS')}</p></div>`);
if(wc>0)tiles.push(`<div class="tc"><p class="tk">${ic('CalendarDays')}${L('SEMANA','WEEK')} ${cw}/12</p><p class="tv">${wc}<small>/${plan}</small></p>${segMeter(wc,Math.max(1,plan),'m-volt',Math.max(1,Math.min(7,plan)))}</div>`);
if(st>0)tiles.push(`<div class="tc"><p class="tk">${ic('Flame')}${L('RACHA','STREAK')}</p><p class="tv">${st}<small>${L('SEM','WK')}</small></p><p class="tz mono">≥2 SES/${L('SEM','WK')}</p></div>`);
if(!tiles.length)return '';
return `<div class="tele n${tiles.length} ${rs?'g-'+rs:'g-none'}" role="group" aria-label="${L('Tu semana','Your week')}">${tiles.join('')}</div>`}
function spark(ls){if(!ls)return '<svg class="spark" viewBox="0 0 100 24" aria-hidden="true"><line x1="0" y1="20" x2="100" y2="20" class="sp0"/></svg>';const w=ls.weeks.slice().reverse().map(x=>x.mat+x.fis),mx=Math.max(1,...w);const pts=w.map((v,i)=>`${(i/(w.length-1)*100).toFixed(1)},${(22-v/mx*18).toFixed(1)}`).join(' ');return `<svg class="spark" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" class="sp1"/></svg>`}
/* voice note: deterministic waveform from the upload id; markers from the class tips */
function waveBars(seed,n){let s=0;for(const c of String(seed))s=(s*31+c.charCodeAt(0))%233280;const out=[];for(let i=0;i<n;i++){s=(s*9301+49297)%233280;const env=.35+.65*Math.sin(Math.PI*i/n);out.push(Math.max(4,Math.round(40*env*(.3+.7*s/233280))))}return out}
function voiceNote(u,topic,tips){const dur=u.dur||(38+waveBars(u.id||topic,3)[1]%60),bars=waveBars(u.id||topic,56),pl=String(S.vnPlay)===String(u.id),mm=x=>`${Math.floor(x/60)}:${String(x%60).padStart(2,'0')}`;
const marks=(tips||[]).slice(0,2).map((t,i)=>({at:Math.round(dur*(.28+.4*i)),txt:T(t).split(/[.:,]/)[0].slice(0,34)}));const st=u.state==='done'?'ANALIZADA':u.state==='uploading'?'SUBIENDO':'EN COLA';
return `<div class="vnote glass" role="region" aria-label="${L('Nota de voz','Voice note')}">
<div class="vn-head"><span class="ava${pl?' live':''}"><b>o</b><i></i></span><div><p class="vn-who">Coach osslab</p><p class="mono dim">${esc(T(CLASST[topic])).toUpperCase()} · ${st} ${led(u.state==='done'?'on':'amb')}</p></div><p class="vn-t mono">${mm(dur)}</p></div>
<svg class="vn-svg${pl?' playing':''}" viewBox="0 0 ${bars.length*4} 48" preserveAspectRatio="none" style="--dur:${dur}s" aria-hidden="true">${bars.map((h,i)=>`<rect x="${i*4}" y="${(48-h)/2}" width="2" height="${h}" rx="1" style="--d:${(i/bars.length).toFixed(3)}"/>`).join('')}${marks.map(m=>`<line x1="${(m.at/dur*bars.length*4).toFixed(1)}" x2="${(m.at/dur*bars.length*4).toFixed(1)}" y1="0" y2="48" class="mk"/>`).join('')}</svg>
<div class="vn-ctl"><button class="vn-b" data-act="vn-seek" data-v="${esc(String(u.id))}" aria-label="-10 s">${ic('RotateCcw')}</button><button class="vn-play" data-act="vn-play" data-v="${esc(String(u.id))}" aria-pressed="${pl}" aria-label="${pl?L('Pausar','Pause'):L('Reproducir','Play')}">${ic(pl?'Pause':'Play')}</button><button class="vn-b" data-act="vn-seek" data-v="${esc(String(u.id))}" aria-label="+10 s">${ic('RotateCw')}</button></div>
${marks.length?`<div class="vn-tags">${marks.map(m=>`<span class="vn-tag mono">${mm(m.at)} · ${esc(m.txt)}</span>`).join('')}</div>`:''}
<p class="small vn-n">${L('Demo: el audio no se transcribe de verdad; las marcas salen de los tips de esta clase.','Demo: the audio is not really transcribed; markers come from this class\'s tips.')}</p></div>`}
function plTag(p){const i=PERKS.filter(x=>x.k===p.k).indexOf(p)+1;return `PL·${({fisio:'FISIO',masaje:'MASAJE',crio:'CRIO',preso:'PRESO',yoga:'MOV',nutri:'NUTRI',psico:'MENTE',fuerza:'FUERZA',gear:'WEB',kimono:'GI',cinturon:'CINTO',cinta:'TAPE',bucal:'BUCAL',proteccion:'PROT'})[p.k]||'PL'}·${String(i).padStart(2,'0')}`}
