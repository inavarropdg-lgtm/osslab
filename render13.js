/* ================= v17 · A5 clips grabados en el móvil (IndexedDB, solo en este dispositivo) ================= */
const IDB_NAME='osslab-media',IDB_ST='clips';
function idbOpen(){return new Promise((res,rej)=>{try{const r=indexedDB.open(IDB_NAME,1);r.onupgradeneeded=()=>{r.result.createObjectStore(IDB_ST)};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}})}
function idbPut(id,blob){return idbOpen().then(db=>new Promise((res,rej)=>{const tx=db.transaction(IDB_ST,'readwrite');tx.objectStore(IDB_ST).put(blob,id);tx.oncomplete=()=>res(true);tx.onerror=()=>rej(tx.error)}))}
function idbGet(id){return idbOpen().then(db=>new Promise((res,rej)=>{const q=db.transaction(IDB_ST).objectStore(IDB_ST).get(id);q.onsuccess=()=>res(q.result||null);q.onerror=()=>rej(q.error)}))}
function idbDel(id){try{idbOpen().then(db=>{db.transaction(IDB_ST,'readwrite').objectStore(IDB_ST).delete(id)}).catch(()=>{})}catch(e){}}
const LURL={};
function hydrateLocal(){document.querySelectorAll('video.lvid[data-lid]').forEach(v=>{const id=v.dataset.lid;if(LURL[id]){if(v.src!==LURL[id])v.src=LURL[id];return}
 idbGet(id).then(b=>{if(!b){v.replaceWith(Object.assign(document.createElement('p'),{className:'lvn',textContent:L('Este vídeo ya no está en este dispositivo.','This video is no longer on this device.')}));return}LURL[id]=URL.createObjectURL(b);v.src=LURL[id]}).catch(()=>{v.replaceWith(Object.assign(document.createElement('p'),{className:'lvn',textContent:L('Este navegador no deja guardar vídeos aquí.','This browser does not allow storing videos here.')}))})})}
const _render13=render;render=function(){_render13();try{hydrateLocal()}catch(e){}};
function vidDuration(file){return new Promise(res=>{try{const v=document.createElement('video'),u=URL.createObjectURL(file);v.preload='metadata';v.onloadedmetadata=()=>{const d=v.duration;URL.revokeObjectURL(u);res(isFinite(d)?d:null)};v.onerror=()=>{URL.revokeObjectURL(u);res(null)};v.src=u;setTimeout(()=>res(null),4000)}catch(e){res(null)}})}
document.addEventListener('change',e=>{const t=e.target;if(!t||t.id!=='soc-file'||!t.files||!t.files[0])return;const f=t.files[0];
 const d=S.socDraft&&S.socDraft.t===S.tecOpen?S.socDraft:{t:S.tecOpen,url:'',belt:null};S.socDraft=d;d.fileErr='';
 if(!/^video\//.test(f.type||'video/')){d.fileErr=L('Eso no es un vídeo.','That is not a video.');render();return}
 if(f.size>80*1024*1024){d.fileErr=L('Demasiado grande (máx. 80 MB). Recórtalo en la galería del móvil.','Too large (max 80 MB). Trim it in your phone gallery.');render();return}
 vidDuration(f).then(dur=>{if(dur!=null&&dur>35){d.fileErr=L(`Dura ${Math.round(dur)} s. Recórtalo a 30 s en la galería del móvil y vuelve a elegirlo.`,`It is ${Math.round(dur)} s long. Trim it to 30 s in your phone gallery and pick it again.`);render();return}
  const id='lv-'+Date.now().toString(36);idbPut(id,f).then(()=>{if(d.local)idbDel(d.local.id);d.local={id,dur:dur!=null?Math.round(dur):'≤30'};d.url='';save();render()}).catch(()=>{d.fileErr=L('Este navegador no deja guardar vídeos. Usa un enlace de YouTube oculto.','This browser cannot store videos. Use an unlisted YouTube link.');render()})})});
function act13(t,act,v){if(act==='soc-cons'){const d=S.socDraft&&S.socDraft.t===S.tecOpen?S.socDraft:{t:S.tecOpen,url:'',belt:null};d.consent=!!t.checked;S.socDraft=d;save();render();return true}return false}
