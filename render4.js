/* ================= v9 · Pro-Lab ================= */
const PLSEC={recup:{n:{es:'Recuperación',en:'Recovery'},s:{es:'Fisio, masaje, crio, presoterapia y movilidad',en:'Physio, massage, cryo, compression and mobility'},cats:['fisio','yoga']},
rend:{n:{es:'Rendimiento',en:'Performance'},s:{es:'Nutrición, preparación física y cabeza',en:'Nutrition, strength coaching and mindset'},cats:['nutri','fuerza','psico']},
equip:{n:{es:'Equipamiento',en:'Gear'},s:{es:'Kimonos, cinturones, cinta y bucales en tiendas cerca, y descuentos online',en:'Gis, belts, tape and mouthguards in nearby shops, plus online discounts'},cats:[]}};
/* DEMO perks: fictional partners, no real deal */
const PERKS=[
{id:'fisio1',sec:'recup',k:'fisio',n:'Fisio Kuzushi',lat:38.349,lon:-0.484,svc:{es:'Descarga y valoración',en:'Release and assessment'},min:45,price:36,was:48,incl:{es:'Valoración de la zona, descarga manual y pautas que la app añade a tu plan.',en:'Assessment of the area, manual release and guidelines the app adds to your plan.'}},
{id:'fisio2',sec:'recup',k:'fisio',n:'Clínica Hikite',lat:38.389,lon:-0.433,svc:{es:'Readaptación de hombro y rodilla',en:'Shoulder and knee rehab'},min:50,price:42,was:55,incl:{es:'Programa de vuelta al tatami con revisión cada 2 semanas, sincronizado con tu plan.',en:'Return-to-mat programme with reviews every 2 weeks, synced with your plan.'}},
{id:'masaje1',sec:'recup',k:'masaje',n:'Estudio Ukemi',lat:38.356,lon:-0.475,svc:{es:'Masaje de descarga',en:'Recovery massage'},min:30,price:28,was:35,incl:{es:'Descarga de espalda, hombros y antebrazos, las zonas que más castiga el agarre.',en:'Back, shoulders and forearms release, the areas grips punish most.'}},
{id:'crio1',sec:'recup',k:'crio',n:'Kōri Crio',lat:38.362,lon:-0.452,svc:{es:'Crioterapia de cuerpo entero',en:'Whole-body cryotherapy'},min:15,price:22,was:30,crio:true,incl:{es:'Sesión de 3 min a −110 °C con supervisión y control de tensión previo.',en:'3-min session at −110 °C, supervised, with a blood-pressure check first.'}},
{id:'preso1',sec:'recup',k:'preso',n:'Estudio Ukemi',lat:38.356,lon:-0.475,svc:{es:'Botas de presoterapia',en:'Compression boots'},min:30,price:15,was:20,incl:{es:'30 min de compresión secuencial en piernas tras días de mucho tatami.',en:'30 min of sequential leg compression after heavy mat days.'}},
{id:'yoga1',sec:'recup',k:'yoga',n:'Flow Grappling Yoga',lat:38.343,lon:-0.479,svc:{es:'Movilidad para grapplers',en:'Mobility for grapplers'},min:60,price:9,was:14,incl:{es:'Clase de cadera, columna y hombros pensada para guardia y escapes.',en:'Hips, spine and shoulders class built for guard work and escapes.'}},
{id:'nutri1',sec:'rend',k:'nutri',n:'Nutrición Waza',lat:38.344,lon:-0.488,svc:{es:'Consulta para dar el peso',en:'Making-weight consultation'},min:45,price:40,was:55,incl:{es:'Plan para llegar a tu categoría sin perder fuerza, con revisión a las 2 semanas.',en:'Plan to reach your division without losing strength, with a 2-week review.'}},
{id:'fuerza1',sec:'rend',k:'fuerza',n:'Base Strength Lab',lat:38.398,lon:-0.430,svc:{es:'Valoración de fuerza',en:'Strength assessment'},min:60,price:35,was:50,incl:{es:'Tests de fuerza y potencia; los resultados ajustan las cargas de tu plan.',en:'Strength and power tests; results tune your plan\'s loads.'}},
{id:'psico1',sec:'rend',k:'psico',n:'Mente Randori',lat:38.352,lon:-0.495,svc:{es:'Sesión de preparación mental',en:'Mental preparation session'},min:50,price:45,was:60,incl:{es:'Rutina previa al combate y manejo de la presión en competición.',en:'Pre-match routine and handling pressure in competition.'}},
{id:'gi2',sec:'equip',k:'kimono',shop:1,n:'Osaekomi Fightshop',lat:38.347,lon:-0.487,price:89,was:115,svc:{es:'Kimono A1 de competición',en:'A1 competition gi'},incl:{es:'Homologado IBJJF, tejido pearl weave 450 g. Pruébatelo en tienda antes de llevártelo.',en:'IBJJF-legal, 450 g pearl weave. Try it on in store first.'}},
{id:'gi3',sec:'equip',k:'kimono',shop:1,n:'Hajime Store',lat:38.396,lon:-0.525,price:65,was:85,svc:{es:'Kimono ligero de entreno',en:'Lightweight training gi'},incl:{es:'Ripstop ligero que seca rápido: para entrenar 3–4 días a la semana.',en:'Light, quick-dry ripstop: for training 3–4 days a week.'}},
{id:'belt1',sec:'equip',k:'cinturon',shop:1,n:'Osaekomi Fightshop',lat:38.347,lon:-0.487,price:18,was:24,svc:{es:'Cinturón de color',en:'Coloured belt'},incl:{es:'Blanco a negro, con barra para grados. Te lo bordan en tienda por 5 €.',en:'White to black, with stripe bar. In-store embroidery for €5.'}},
{id:'tape2',sec:'equip',k:'cinta',shop:1,n:'Ne-Waza Store',lat:38.428,lon:-0.398,price:9,was:12,svc:{es:'Cinta de dedos (pack 12)',en:'Finger tape (12-pack)'},incl:{es:'Cinta de algodón de 1,3 cm para proteger los dedos del agarre.',en:'1.3 cm cotton tape to protect fingers from grips.'}},
{id:'mouth1',sec:'equip',k:'bucal',shop:1,n:'Hajime Store',lat:38.396,lon:-0.525,price:15,was:20,svc:{es:'Bucal termoadaptable',en:'Boil-and-bite mouthguard'},incl:{es:'Te enseñan a moldearlo en tienda en 5 minutos.',en:'They show you how to mould it in store in 5 minutes.'}},
{id:'mouth2',sec:'equip',k:'bucal',shop:1,n:'Ne-Waza Store',lat:38.428,lon:-0.398,price:45,was:60,svc:{es:'Bucal a medida',en:'Custom-fit mouthguard'},incl:{es:'Molde de tu boca en tienda y entrega en una semana. Para sparring duro y competición.',en:'Impression taken in store, ready in a week. For hard sparring and competition.'}},
{id:'rash2',sec:'equip',k:'proteccion',shop:1,n:'Ne-Waza Store',lat:38.428,lon:-0.398,price:35,was:45,svc:{es:'Rashguard manga larga',en:'Long-sleeve rashguard'},incl:{es:'Homologado IBJJF para no-gi, con colores por cinturón.',en:'IBJJF-legal for no-gi, ranked colours.'}},
{id:'gi1',sec:'equip',k:'gear',n:'Shiai Gear',off:15,svc:{es:'Kimono de competición',en:'Competition gi'},incl:{es:'Kimono homologado IBJJF. Código válido en la web de la tienda.',en:'IBJJF-legal gi. Code valid on the store website.'}},
{id:'rash1',sec:'equip',k:'gear',n:'Shiai Gear',off:15,svc:{es:'Rashguard y protector bucal',en:'Rashguard and mouthguard'},incl:{es:'Para no-gi y para los días de sparring duro.',en:'For no-gi and hard sparring days.'}},
{id:'knee1',sec:'equip',k:'gear',n:'Shiai Gear',off:10,svc:{es:'Rodilleras de compresión',en:'Compression knee sleeves'},incl:{es:'Para entrenar con rodilla sensible sin perder movilidad.',en:'Train with a sensitive knee without losing mobility.'}},
{id:'tape1',sec:'equip',k:'gear',n:'Hikite Tape',off:20,svc:{es:'Tape de dedos (pack 10)',en:'Finger tape (10-pack)'},incl:{es:'Protege los dedos del agarre de kimono. Lleva siempre uno en la bolsa.',en:'Protects fingers from gi grips. Always keep one in your bag.'}}];
const PKIND={fisio:{es:'Fisioterapia deportiva',en:'Sports physio'},yoga:{es:'Movilidad y yoga',en:'Mobility and yoga'},fuerza:{es:'Preparación física',en:'Strength coaching'},masaje:{es:'Masaje',en:'Massage'},crio:{es:'Crioterapia',en:'Cryotherapy'},preso:{es:'Presoterapia',en:'Compression'},nutri:{es:'Nutrición',en:'Nutrition'},psico:{es:'Psicología deportiva',en:'Sports psychology'},gear:{es:'Online',en:'Online'},kimono:{es:'Kimono',en:'Gi'},cinturon:{es:'Cinturón',en:'Belt'},cinta:{es:'Cinta',en:'Tape'},bucal:{es:'Bucal',en:'Mouthguard'},proteccion:{es:'Protección',en:'Protection'}};
const PCOL={kimono:'#1e3a8a',cinturon:'#6b2fa3',cinta:'#475569',bucal:'#be123c',proteccion:'#c2410c',yoga:'#6b46c1',fuerza:'#c2410c',fisio:'#0f766e',masaje:'#0e7490',crio:'#113838',preso:'#7c3aed',nutri:'#2f855a',psico:'#113838',gear:'#c2410c'};
const ZONE={hombro:{es:'hombro',en:'shoulder'},rodilla:{es:'rodilla',en:'knee'},cuello:{es:'cuello',en:'neck'},lumbar:{es:'zona lumbar',en:'lower back'},dedos:{es:'dedos',en:'fingers'}};
const perk=id=>PERKS.find(p=>p.id===id);
const kmTo=p=>S.loc&&p.lat?haversine(S.loc,p):null;
const fmtKm=k=>k==null?'':(k<10?k.toFixed(1).replace('.',S.lang==='en'?'.':','):Math.round(k))+' km';
/* --- triggers --- */
function painDays(z){const t=today(),lim=iso(addD(t,-6));return Object.entries(S.painLog||{}).filter(([d,arr])=>d>=lim&&(arr||[]).includes(z)).length}
function plTrigger(){if(!S.a)return null;const ds=iso(today()),ck=S.ck[ds]||{},mut=S.plMute||{},muted=k=>mut[k]&&mut[k]>=ds;
 const zs=Object.keys(ZONE).filter(z=>painDays(z)>=2),jz=ck.joint==='0';
 if((zs.length||jz)&&!muted('fisio'))return {t:'t2',id:'fisio1',zone:zs[0]||((S.a.pain||[])[0])||null,days:zs.length?painDays(zs[0]):1};
 const yd=iso(addD(today(),-1)),hard=(S.log.mat||[]).some(x=>x.date===yd&&(x.type==='duro'||+x.rpe>=8));
 if(hard&&ck.sore==='0'&&!muted('masaje'))return {t:'t1',id:'masaje1'};
 return null}
function plConsentCard(){return `<div class="askcard plc" role="region" aria-label="${L('Servicios','Services')}"><p class="plk">${L('SERVICIOS','SERVICES')}</p><p class="ak-t">${L('¿Te sugerimos recuperación según tu check-in?','Shall we suggest recovery based on your check-in?')}</p><p class="ak-x">${L('Usamos tus respuestas de hoy solo dentro de la app. Los centros no ven tus datos. Puedes cambiarlo cuando quieras en Perfil → Servicios.','We use today\'s answers only inside the app. Centres never see your data. You can change this anytime in Profile → Services.')}</p><div class="seg3 two" role="group"><button data-act="pl-consent" data-v="1">${L('Sí, sugiéremelo','Yes, suggest')}</button><button data-act="pl-consent" data-v="0">${L('No, gracias','No, thanks')}</button></div></div>`}
function plCard(tr,where){const p=perk(tr.id),k=kmTo(p);
 const head=tr.t==='t2'?(tr.zone&&tr.days>=2?L(`Tu ${T(ZONE[tr.zone])} lleva ${tr.days} check-ins molestándote.`,`Your ${T(ZONE[tr.zone])} has bothered you for ${tr.days} check-ins.`):tr.zone?L(`Hoy tu ${T(ZONE[tr.zone])} te limita.`,`Your ${T(ZONE[tr.zone])} is limiting you today.`):L('Hoy tus articulaciones te limitan.','Your joints are limiting you today.')):L('Ayer fue un sparring a tope. Hoy toca soltar.','Yesterday was all-out sparring. Today, let it go.');
 const body=tr.t==='t2'?L('Hoy, recuperación. Si duele en reposo, se hincha o pierdes fuerza, ve al médico antes que a cualquier otra cosa. Si es carga, una valoración de fisio te dice qué ajustar en tu plan.','Recovery today. If it hurts at rest, swells or you lose strength, see a doctor before anything else. If it is load, a physio assessment tells you what to adjust in your plan.'):L('Has marcado agujetas "Mucho". Una descarga de 30 min te devuelve antes a sesión completa.','You marked soreness "A lot". A 30-min release gets you back to full sessions sooner.');
 return `<div class="plcard" role="region" aria-label="${L('Servicios','Services')}"><p class="plk">${L('SERVICIOS','SERVICES')} · ${tr.t==='t2'?L('SALUD PRIMERO','HEALTH FIRST'):L('RECUPERACIÓN','RECOVERY')}</p><p class="plt">${esc(head)}</p><p class="plx">${esc(body)}</p>
<button class="plrow" data-act="pl-open" data-v="${p.id}"><span><b>${esc(T(p.svc))}</b> · ${esc(p.n)}${k!=null?` · ${L('a','')} ${fmtKm(k)}`:''}</span><span class="plp">${p.price} € <s>${p.was} €</s></span></button>
<button class="cta sm" data-act="pl-open" data-v="${p.id}">${tr.t==='t2'?L('Ver fisios cerca','See physios nearby'):L('Ver huecos de hoy','See today\'s slots')}</button>
<div class="plno"><button class="link" data-act="pl-later">${L('Ahora no','Not now')}</button><button class="link" data-act="pl-mute" data-v="${p.k}">${L('No me interesa (30 días)','Not interested (30 days)')}</button></div>
<p class="small">${L('Te lo sugerimos por tu check-in. El centro no ve tus datos.','Suggested from your check-in. The centre never sees your data.')}</p></div>`}
function plSlot(where){if(S.example&&where==='hoy')return '';const ds=iso(today());if(S.plLater===ds)return '';const tr=plTrigger();if(!tr)return '';
 if(S.plConsent===undefined)return plConsentCard();if(S.plConsent===false)return '';return plCard(tr,where)}
/* --- best day --- */
function bestDay(p){const b=build(),d0=dowOf(today()),mat=S.a.days||[],sc=b.assign.map(x=>x.day);
 for(let k=0;k<7;k++){const d=(d0+k)%7,prev=(d+6)%7;if(p.crio){if(!sc.includes(d)&&!sc.includes(prev))return {d,k}}else if(!mat.includes(d)&&S.a.spar!==prev&&!(S.a.spar===d))return {d,k}}return {d:d0,k:0}}
function dayName(x){return x.k===0?L('hoy','today'):x.k===1?L('mañana','tomorrow'):DAYC()[x.d].toLowerCase()}
/* --- perk card + detail --- */
function perkCard(p){const k=kmTo(p),slot=slotOf(p),save=p.off?`−${p.off}%`:`−${p.was-p.price} €`;return `<button class="pkc ${phCls(slot)}"${phStyle(slot)} data-act="pl-open" data-v="${p.id}"><span class="pk-in"><span class="pk-top"><span class="vip mono">${ic('Crown')}VIP ATHLETE ACCESS</span><span class="metal">${save}</span></span><span class="pkk mono"><span class="pltag">${plTag(p)}</span> ${esc(T(PKIND[p.k])).toUpperCase()}${p.shop?' · '+L('TIENDA LOCAL','LOCAL SHOP'):''}</span><span class="pkt">${esc(T(p.svc))}</span><span class="pk-bot"><span class="pks mono">${ic(p.shop||p.off?'Package':'MapPin')}${esc(p.n)}${p.min?` · ${p.min}′`:''}${k!=null?` · ${fmtKm(k)}`:''}</span><span class="pkp">${p.off?`${p.off}%`:`${p.price}€`}${p.off?'':`<s>${p.was}€</s>`}</span></span></span></button>`}
function codeFor(id){let h=7;for(const c of id+(S.start||''))h=(h*31+c.charCodeAt(0))%1679616;return 'RND-'+h.toString(36).toUpperCase().padStart(4,'0').slice(-4)}
function perkDetail(p){const tr=plTrigger(),why=tr&&tr.id===p.id,k=kmTo(p),bd=!p.off&&!p.shop?bestDay(p):null,r=(S.redeem||[]).find(x=>x.id===p.id&&x.exp>=iso(today()));
const slots=bd?['10:00','17:30','19:00']:[],sel=S.plSlot;
return `<div class="pad pld"><button class="link" data-act="pl-close" style="padding:0">← ${L('Servicios','Services')}</button><div class="p4ph pldph ${phCls(slotOf(p))}"${phStyle(slotOf(p))}></div>
<div class="pldh" style="--pc:${PCOL[p.k]}"><p class="pkk"><span class="pltag">${plTag(p)}</span> ${esc(T(PKIND[p.k]))}</p><h1 class="display sm">${esc(T(p.svc))}${p.min?` · ${p.min} min`:''}</h1><p class="mut">${esc(p.n)} · Alicante${k!=null?` · ${L('a','')} ${fmtKm(k)}`:''}</p></div>
<p class="plpart">✓ ${L('Centro colaborador · precio de atleta','Partner centre · athlete pricing')}</p>
<div class="plprice">${p.off?`<b>−${p.off} %</b><span>${L('con tu código osslab','with your osslab code')}</span>`:`<b>${p.price} €</b><s>${p.was} €</s><span>${L('Precio osslab','osslab price')}</span>`}</div>
<dl class="pldl"><dt>${L('Incluye','Includes')}</dt><dd>${esc(T(p.incl))}</dd>
${why?`<dt>${L('Por qué ahora','Why now')}</dt><dd>${tr.t==='t2'?(tr.zone?L(`${tr.days} check-in${tr.days===1?'':'s'} con ${T(ZONE[tr.zone])} molestando`,`${tr.days} check-in${tr.days===1?'':'s'} with ${T(ZONE[tr.zone])} bothering you`):L('Hoy marcaste que las articulaciones te limitan','Today you said your joints limit you')):L('Sparring duro ayer y agujetas "Mucho" hoy','Hard sparring yesterday and "A lot" of soreness today')}</dd>`:''}
${bd?`<dt>${L('Mejor día','Best day')}</dt><dd>${esc(dayName(bd))[0].toUpperCase()+esc(dayName(bd)).slice(1)}: ${p.crio?L('sin sesión de fuerza ese día ni el anterior','no strength session that day or the day before'):L('sin clase de BJJ ni sparring duro en 24 h','no BJJ class or hard sparring within 24 h')}</dd>`:''}</dl>
${p.crio?`<div class="plwarn">❄️ ${L('No la pegues a tu sesión de fuerza: el frío justo después frena lo que acabas de entrenar. Úsala entre combates o en tu semana de competición.','Don\'t stack it right after strength work: cold straight after blunts what you just trained. Use it between matches or in competition week.')}</div>`:''}
${r?`<div class="plcode" role="status"><p class="small">${p.off?L('Tu código','Your code'):p.shop?L('Apartado en','Held at')+' '+esc(p.n):L('Reserva confirmada','Booking confirmed')}${r.slot?` · ${esc(r.slot)}`:''}</p><b>${r.code}</b><p class="small">${p.off?L('Introdúcelo en la web de la tienda.','Enter it on the store website.'):p.shop?L('Enséñalo en caja al recoger.','Show it at the till when you pick up.'):L('Enséñalo en recepción.','Show it at reception.')} ${L('Válido hasta el','Valid until')} ${r.exp.split('-').reverse().join('/')}.</p>${p.off||p.shop?'':`<p class="small">${L('Después te preguntamos cómo fue y ajustamos tu semana.','Afterwards we ask how it went and adjust your week.')}</p>`}<button class="link" data-act="pl-cancel" data-v="${p.id}">${L('Cancelar','Cancel')}</button></div>`
:p.off?`<button class="cta" data-act="pl-redeem" data-v="${p.id}">${L('Obtener mi código','Get my code')}</button>`:p.shop?`<p class="small">${L('Disponible en tienda. Lo apartan a tu nombre 7 días.','In stock. Held under your name for 7 days.')}</p><button class="cta" data-act="pl-redeem" data-v="${p.id}">${L('Apartar para recoger','Hold for pick-up')}</button>`
:`<p class="sub">${L('Elige hora','Pick a time')} · ${esc(dayName(bd))}</p><div class="seg3" role="group">${slots.map(s=>`<button data-act="pl-slot" data-v="${s}" aria-pressed="${sel===s}">${s}</button>`).join('')}</div>
<button class="cta" data-act="pl-redeem" data-v="${p.id}" ${sel?'':'disabled'} style="margin-top:12px">${sel?L(`Reservar ${dayName(bd)} a las ${sel}`,`Book ${dayName(bd)} at ${sel}`):L('Elige una hora','Pick a time')}</button>
<p class="small" style="margin-top:8px">${L('El centro confirma por WhatsApp. Cancelación gratis hasta 12 h antes.','The centre confirms via WhatsApp. Free cancellation up to 12 h before.')}</p>`}
</div>`}
/* --- main tab --- */
function proLabTab(){if(S.plOpen&&perk(S.plOpen))return perkDetail(perk(S.plOpen));
const sec=S.plsec||'recup',view=S.plview||'lista',P=PERKS.filter(p=>p.sec===sec),cats=PLSEC[sec].cats;
let real=[];if(S.loc)real=real.slice().sort((x,y)=>haversine(S.loc,x)-haversine(S.loc,y));
const red=(S.redeem||[]).filter(x=>x.exp>=iso(today()));
const coast=COAST.map(([la,lo])=>proj(la,lo).join(',')).join(' '),sea=`0,360 ${coast} 320,360`;
const towns=TOWNS.map(t=>{const[x,y]=proj(t.lat,t.lon);return `<g><circle cx="${x}" cy="${y}" r="2" fill="var(--mut)"></circle><text x="${x+4}" y="${y+3}" font-size="8" fill="var(--mut)">${esc(t.n)}</text></g>`}).join('');
const vp=real.map(v=>{const gi=VEND.indexOf(v),[x,y]=proj(v.lat,v.lon);return `<g class="vpin${S.vsel===gi?' sel':''}" data-act="vpin" data-v="${gi}" tabindex="0" role="button" aria-label="${esc(v.n)}"><circle class="hit" cx="${x}" cy="${y}" r="12" fill="transparent"></circle><circle cx="${x}" cy="${y}" r="${S.vsel===gi?7:5.5}" fill="${VCOL[v.c]}" opacity=".55"></circle></g>`}).join('');
const pp=P.filter(p=>p.lat).map(p=>{const[x,y]=proj(p.lat,p.lon);return `<g class="vpin" data-act="pl-open" data-v="${p.id}" tabindex="0" role="button" aria-label="${esc(T(p.svc))}"><circle class="hit" cx="${x}" cy="${y}" r="13" fill="transparent"></circle><rect x="${x-7}" y="${y-7}" width="14" height="14" rx="4" fill="${PCOL[p.k]}" stroke="#fff" stroke-width="2"></rect></g>`}).join('');
const me=S.loc?(()=>{const[x,y]=proj(S.loc.lat,S.loc.lon);return x>=0&&x<=320&&y>=0&&y<=360?`<circle cx="${x}" cy="${y}" r="5" fill="#111" stroke="#fff" stroke-width="2"></circle>`:''})():'';
const tr=plSlot('pl');
return `<div class="pad">
<div class="plhead"><h1 class="display sm">Pro-Lab</h1><p class="mut">${L('Ventajas de atleta profesional, conectadas a tu plan.','Pro-athlete perks, connected to your plan.')}</p></div>
<button class="vsbtn plbtn" data-act="acad-list"><span class="pic t-orange">${ic('MapPin')}</span><span class="tb"><span class="tt">${L('Academias y Open Mats','Academies and Open Mats')}</span><span class="ts">${L(`${ACADS.filter(a=>a.om.length).length} con open mat · entrena donde viajes`,`${ACADS.filter(a=>a.om.length).length} with open mat · train wherever you travel`)}</span></span><span class="pch">${ic('ChevronRight')}</span></button>${tr?`<div class="section-h"><h2>${L('Para ti ahora','For you now')}</h2></div>${tr}`:''}
${!S.locAsked?askLoc():S.loc?`<p class="small locl">📍 ${S.loc.src==='gps'?L('Ordenado por distancia a ti','Sorted by distance to you'):S.loc.src==='cp'?L(`Ordenado por distancia al ${S.loc.cp}`,`Sorted by distance to ${S.loc.cp}`):L('Ubicación aproximada: Alicante centro','Approximate location: Alicante centre')} · <button class="link" data-act="loc-reset">${L('Cambiar','Change')}</button></p>`:''}
<div class="plsegs" role="tablist">${Object.entries(PLSEC).map(([k,v])=>`<button role="tab" data-act="pl-sec" data-v="${k}" aria-selected="${sec===k}">${esc(T(v.n))}</button>`).join('')}</div>
<div class="plsub"><p class="small">${esc(T(PLSEC[sec].s))}</p>${`<div class="pltog" role="group"><button data-act="pl-view" data-v="lista" aria-pressed="${view==='lista'}">${L('Lista','List')}</button><button data-act="pl-view" data-v="mapa" aria-pressed="${view==='mapa'}">${L('Mapa','Map')}</button></div>`}</div>
${view==='mapa'?`<div class="vmap" style="margin-top:10px"><svg viewBox="0 0 320 360" role="img" aria-label="${L('Mapa de servicios','Services map')}"><rect width="320" height="360" fill="light-dark(#dbeafe,#0b1a24)"/><polygon points="${sea}" fill="light-dark(#f3f1ec,#141a1e)"/><polyline points="${coast}" fill="none" stroke="light-dark(#9fc5e8,#2b6c8a)" stroke-width="1.5"/>${towns}${vp}${pp}${me}</svg></div>`:''}
<div class="section-h"><h2>${sec==='equip'?L('Tiendas y ofertas','Shops and offers'):L('Centros colaboradores','Partner centres')} <span class="small">· ${P.length}</span></h2></div>
<div class="pklist">${P.map(perkCard).join('')}</div>
${real.length?`<div class="section-h"><h2>${L('Centros cerca','Centres nearby')} <span class="small">· ${L('candidatos','candidates')}</span></h2></div>
<div class="vlist">${real.map(v=>{const gi=VEND.indexOf(v),k=S.loc?haversine(S.loc,v):null;return `<article class="vcard${S.vsel===gi?' sel':''}" id="v-${gi}"><div class="vh"><span class="vcat" style="background:${VCOL[v.c]}">${T(VCAT[v.c])}</span><span class="badge2">${L('Candidato','Candidate')}</span></div><h3>${esc(v.n)}</h3><p class="vl">${esc(v.l)}${k!=null?` · <b>${fmtKm(k)}</b>`:''}</p><p>${esc(T(v.w))}</p>${v.p?`<p class="pr">${esc(T(v.p))}</p>`:''}<a href="${v.u}" target="_blank" rel="noopener">${L('Ver fuente','Source')} ›</a></article>`}).join('')}</div>`:''}
<div class="section-h"><h2>${L('Tus canjes','Your redemptions')}</h2></div>
${red.length?`<div class="pklist">${red.map(r=>{const p=perk(r.id);return `<button class="pkc" data-act="pl-open" data-v="${p.id}"><span class="pkd" style="background:${PCOL[p.k]}"></span><span class="pkb"><span class="pkt">${esc(T(p.svc))}</span><span class="pks">${r.slot?esc(r.slot)+' · ':''}${r.code}</span></span><span class="arr">›</span></button>`}).join('')}</div>`:`<p class="small">${L('Aún no has canjeado nada. Tus códigos y reservas aparecerán aquí.','Nothing redeemed yet. Your codes and bookings will show here.')}</p>`}
<p class="small plfoot">${L('MVP: centros y ofertas de ejemplo con marcas ficticias.','MVP: sample centres and offers with fictional brands.')}</p>
${S.plConsent!==undefined?`<label class="tog" style="margin-top:16px"><input type="checkbox" data-act="pl-consent-tog" ${S.plConsent?'checked':''}><span>${L('Sugerencias según mi check-in','Suggestions from my check-in')}</span></label>`:''}
</div>`}
function plAct(t,act,v){const rr=()=>{save();render();return true};
switch(act){
case 'pl-sec':S.plsec=v;S.vsel=null;return rr();
case 'pl-view':S.plview=v;return rr();
case 'pl-open':S.tab='equipo';S.plOpen=v;S.plSlot=null;S.play=null;save();render();window.scrollTo(0,0);return true;
case 'pl-close':S.plOpen=null;S.plSlot=null;save();render();window.scrollTo(0,0);return true;
case 'pl-slot':S.plSlot=v;return rr();
case 'pl-redeem':{const p=perk(v);S.redeem=(S.redeem||[]).filter(x=>x.id!==v);const bd=p.off||p.shop?null:bestDay(p);
 S.redeem.push({id:v,code:codeFor(v),date:iso(today()),slot:bd?`${dayName(bd)} ${S.plSlot}`:null,exp:iso(addD(today(),p.shop?7:30))});S.plSlot=null;return rr()}
case 'pl-cancel':S.redeem=(S.redeem||[]).filter(x=>x.id!==v);return rr();
case 'pl-later':S.plLater=iso(today());return rr();
case 'pl-mute':S.plMute=Object.assign({},S.plMute,{[v]:iso(addD(today(),30))});return rr();
case 'ph-del':t&&t.closest&&0;delete PHOTOS[v];try{localStorage.setItem('rendai-photos',JSON.stringify(PHOTOS))}catch(e){}return rr();
case 'vn-seek':return true;
case 'tab-tec-dummy':return false;
case 'dev-close':S.devPhotos=false;return rr();
case 'mood':{const cw=curWeek(),m=MOODS.find(x=>x.k===v),g={};for(const k of (S.goals&&S.goals.length?S.goals:build().G))g[k]=m.v;S.fb[cw]={mood:v,g,all:m.v};S.example=false;return rr()}
case 'kcat':S.kcat=v;return rr();
case 'kinfo':S.kinfo=S.kinfo===v?null:v;return rr();
case 'kadd':{const arr=S.tests[v]||[null,null,null],i=+t.dataset.i;let base=null;for(let j=i-1;j>=0;j--)if(arr[j]!=null){base=arr[j];break}S.kedit={id:v,i,val:base!=null?base:(KDEF[v]!=null?KDEF[v]:0)};return rr()}
case 'kstep':S.kedit.val=Math.max(0,+(S.kedit.val+(+v)).toFixed(1));return rr();
case 'kcancel':S.kedit=null;return rr();
case 'ksave':{const e=S.kedit,arr=(S.tests[e.id]||[null,null,null]).slice();arr[e.i]=e.val;S.tests[e.id]=arr;S.kedit=null;S.example=false;return rr()}
case 'vn-play':S.vnPlay=String(S.vnPlay)===String(v)?null:v;return rr();
case 'pl-consent':S.plConsent=v==='1';return rr();
}return false}
