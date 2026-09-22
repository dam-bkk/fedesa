/* ============ storage (IndexedDB, localStorage fallback) ============ */
const idb={db:null,
 open(){return new Promise(res=>{try{if(!('indexedDB' in window))return res(null);const r=indexedDB.open('fedesa-licences',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>res(null);r.onblocked=()=>res(null)}catch(e){res(null)}})},
 get(k){return new Promise(res=>{if(!this.db){try{res(JSON.parse(localStorage.getItem('fedesa:'+k)))}catch(e){res(null)}return}try{const t=this.db.transaction('kv','readonly').objectStore('kv').get(k);t.onsuccess=()=>res(t.result??null);t.onerror=()=>res(null)}catch(e){res(null)}})},
 set(k,v){return new Promise(res=>{if(!this.db){try{localStorage.setItem('fedesa:'+k,JSON.stringify(v))}catch(e){}return res()}try{const t=this.db.transaction('kv','readwrite');t.objectStore('kv').put(JSON.parse(JSON.stringify(v)),k);t.oncomplete=()=>res();t.onerror=()=>res()}catch(e){res()}})}};
let DB=null,ME=null,ACTOR=null,FEEDBACK=[],BOOTED=false,RIDX=null;
function save(){RIDX=null;idb.set('db',DB)}
function saveFeedback(){idb.set('feedback',FEEDBACK)}
const U=id=>DB.users.find(u=>u.id===id),P=id=>DB.people.find(p=>p.id===id),CLUB=id=>DB.clubs.find(c=>c.id===id),COMP=id=>DB.comps.find(c=>c.id===id),APPL=id=>DB.apps.find(a=>a.id===id);
const uname=id=>U(id)?.name||tr('Système','System');
const fullName=p=>p?`${p.first} ${p.last}`:'—';
const can=f=>!!(ME&&DB.perms[ME.role]?.[f]);
function log(action,cat,target,before,after){DB.activity.unshift({ts:nowISO(),who:ME.id,actor:ACTOR?.id||null,action,cat,target,before,after,ip:'41.82.'+(hue(ME.id)%200+10)+'.'+(hue(ME.name)%240+5)});save()}

/* scope — what the signed-in role may see. Filtered here in one place, never in the pages. */
function inScope(o){const s=ME?.scope||{kind:'none'};if(s.kind==='all')return true;if(s.kind==='region')return o.region===s.value||(o.clubId&&CLUB(o.clubId)?.region===s.value);if(s.kind==='club')return o.clubId===s.value||o.id===s.value||o.organiserClubId===s.value;if(s.kind==='self')return o.id===s.value||o.licenseeId===s.value;return false}
const myPeople=()=>DB.people.filter(inScope);
const myApps=()=>DB.apps.filter(a=>inScope(a)&&(ME.role==='club'||a.status!=='draft'));
const myClubs=()=>ME.scope.kind==='all'?DB.clubs:DB.clubs.filter(c=>ME.scope.kind==='region'?c.region===ME.scope.value:c.id===ME.scope.value||c.id===P(ME.scope.value)?.clubId);
const canManageComp=c=>ME.role==='superadmin'||(ME.role==='ligue'&&c.region===ME.scope.value)||(ME.role==='club'&&c.organiserClubId===ME.scope.value);
const scopeLabel=u=>{const s=u.scope;return s.kind==='all'?tr('Tout le Sénégal','All of Senegal'):s.kind==='region'?tr('Région de ','Region: ')+regionName(s.value):s.kind==='club'?CLUB(s.value)?.name:s.kind==='self'?tr('Sa fiche uniquement','Own record only'):'—'};

/* licence state */
const lastLic=p=>p.licences.slice().sort((a,b)=>a.to<b.to?1:-1)[0];
function licStatus(p){if(p.status==='suspended')return 'suspended';const l=lastLic(p);if(!l)return 'none';if(l.to<TODAY)return 'expired';if(D.diff(l.to,TODAY)<=60)return 'expiring';return 'active'}
const validOn=(p,date)=>p.status!=='suspended'&&p.licences.some(l=>l.from<=date&&l.to>=date);
const renewed=p=>p.licences.some(l=>l.season===DB.season.next);
const medStatus=p=>!p.events.length?'na':p.medExp<TODAY?'expired':D.diff(p.medExp,TODAY)<=30?'expiring':'ok';

/* results index: per athlete per event, chronological, with PB-at-the-time and season-best flags */
const legal=r=>r.st==='OK'&&r.perf!=null&&(r.wind==null||r.wind<=2.0);
function ridx(){if(RIDX)return RIDX;const by={};DB.results.forEach(r=>{(by[r.a]=by[r.a]||{});(by[r.a][r.code]=by[r.a][r.code]||[]).push(r)});const flags={};
 Object.values(by).forEach(evs=>Object.entries(evs).forEach(([code,rs])=>{rs.sort((a,b)=>a.date<b.date?-1:1);let best=null,n=0;const lb=lowerBetter(code);rs.forEach(r=>{if(!legal(r))return;n++;if(best==null||(lb?r.perf<best:r.perf>best)){if(n>1)flags[r.id]='PB';best=r.perf}});
  const lg=rs.filter(legal);if(lg.length){const sb=lg.reduce((m,r)=>(lb?r.perf<m.perf:r.perf>m.perf)?r:m);if(!flags[sb.id])flags[sb.id]='SB'}}));
 return RIDX={by,flags}}
const resultsOf=pid=>Object.values(ridx().by[pid]||{}).flat().sort((a,b)=>a.date<b.date?1:-1);
function bestOf(pid,code,onlyLegal=true){const rs=(ridx().by[pid]?.[code]||[]).filter(r=>onlyLegal?legal(r):r.st==='OK'&&r.perf!=null);if(!rs.length)return null;const lb=lowerBetter(code);return rs.reduce((m,r)=>(lb?r.perf<m.perf:r.perf>m.perf)?r:m)}
const flagTag=r=>{const f=ridx().flags[r.id];return (f==='PB'?`<span class="tag pb" title="${tr('Record personnel','Personal best')}">${tr('RP','PB')}</span>`:f==='SB'?`<span class="tag sb" title="${tr('Meilleure performance de la saison','Season best')}">SB</span>`:'')+(r.wind>2?` <span class="tag w" title="${tr('Vent favorable > 2,0 m/s','Wind-assisted > 2.0 m/s')}">w</span>`:'')+(r.nr?` <span class="tag nr">${tr('RN','NR')}</span>`:'')};
const windTxt=w=>w==null?'':(w>0?'+':'')+w.toFixed(1);

/* ============ router ============ */
let RT=null;try{RT=location.hash?decodeURIComponent(location.hash.replace(/^#\/?/,'')):null}catch(e){}
function route(){const h=RT||'';const [path,q]=h.split('?');const parts=path.split('/').filter(Boolean);return {parts,params:Object.fromEntries(new URLSearchParams(q||'')),path}}
function go(p){RT=p;try{if(location.hash!=='#/'+p)history.pushState(null,'','#/'+p)}catch(e){}MENU=false;render()}
function setParams(o){const {path,params}=route();const n={...params,...o};Object.keys(n).forEach(k=>{if(n[k]===''||n[k]==null)delete n[k]});const q=new URLSearchParams(n).toString();RT=path+(q?'?'+q:'');try{history.replaceState(null,'','#/'+RT)}catch(e){}render({keepScroll:true})}
window.addEventListener('popstate',()=>{try{RT=decodeURIComponent(location.hash.replace(/^#\/?/,''));render()}catch(e){}});
window.addEventListener('hashchange',()=>{try{const h=decodeURIComponent(location.hash.replace(/^#\/?/,''));if(h!==RT){RT=h;render()}}catch(e){}});
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#/"]');if(a&&!e.metaKey&&!e.ctrlKey){e.preventDefault();go(a.getAttribute('href').slice(2))}const tr_=e.target.closest('tr[data-go]');if(tr_&&!e.target.closest('a,button,input,select'))go(tr_.dataset.go)});

/* ============ shell ============ */
let MENU=false;
const SECTIONS={home:['Tableau de bord','Dashboard'],applications:['Licences','Licences'],licensees:['Licenciés','Licensees'],renewals:['Renouvellements','Renewals'],competitions:['Compétitions','Competitions'],rankings:['Bilans','Rankings'],stats:['Statistiques','Statistics'],clubs:['Clubs','Clubs'],admin:['Administration','Administration'],ideas:['Feuille de route','Roadmap'],feedback:['Retours','Feedback'],me:['Ma carte','My card'],verify:['Vérification','Verification']};
function navItems(){const r=ME.role,pend=myApps().filter(a=>['submitted','in_review'].includes(a.status)).length,toFix=myApps().filter(a=>a.status==='info_requested').length;
 const it=[];
 if(r==='athlete')it.push(['me','id-card',tr('Ma carte d’identité sportive','My sports ID card'),tr('Licence, QR code, résultats, bilan','Licence, QR code, results, season review'),'main']);
 else it.push(['home','layout-dashboard',tr('Tableau de bord','Dashboard'),tr('Indicateurs, alertes, à traiter','Indicators, alerts, to-do'),'main']);
 if(can('apps.submit')||can('apps.review'))it.push(['applications','file-badge',tr('Demandes de licence','Licence applications'),can('apps.review')?tr('Instruire, demander un complément, valider','Review, request documents, approve'):tr('Déposer et suivre les demandes du club','Submit and track the club’s applications'),'main',can('apps.review')?pend:toFix,can('apps.review')?'':'warn']);
 if(can('lic.view'))it.push(['licensees','contact',tr('Licenciés','Licensees'),tr('Registre, cartes d’identité sportive','Register, sports ID cards'),'main']);
 if(can('lic.view')&&r!=='official')it.push(['renewals','bell-ring',tr('Expirations & relances','Expiries & reminders'),tr('Licences et certificats médicaux à renouveler','Licences and medical certificates to renew'),'lic']);
 it.push(['competitions','calendar-days',tr('Compétitions','Competitions'),tr('Calendrier, engagements, résultats','Calendar, entries, results'),'main']);
 it.push(['rankings','trophy',tr('Bilans','Rankings'),tr('Meilleures performances, records, classement des clubs','Top lists, records, club standings'),'main']);
 if(can('lic.view')&&r!=='official')it.push(['stats','chart-column',tr('Statistiques','Statistics'),tr('Effectifs, pyramide des âges, fidélisation, densité sportive','Membership, age pyramid, retention, sporting depth'),'lic']);
 if(r!=='athlete'&&r!=='official')it.push(['clubs','building-2',tr('Clubs','Clubs'),tr('Affiliations et effectifs','Affiliations and membership'),'lic']);
 if(can('admin.users'))it.push(['admin/users','user-cog',tr('Utilisateurs & rôles','Users & roles'),tr('Comptes, périmètres','Accounts, scopes'),'adm']);
 if(can('admin.users'))it.push(['admin/permissions','key-round',tr('Permissions','Permissions'),tr('Matrice rôle × fonctionnalité','Role × feature matrix'),'adm']);
 if(can('admin.settings'))it.push(['admin/settings','settings-2',tr('Paramètres','Settings'),tr('Saison, tarifs, pièces, relances, sauvegarde','Season, fees, documents, reminders, backup'),'adm']);
 if(can('admin.activity'))it.push(['admin/activity','scroll-text',tr('Journal d’activité','Activity log'),tr('Qui a fait quoi, quand','Who did what, when'),'adm']);
 it.push(['ideas','sparkles',tr('Feuille de route','Roadmap'),tr('Fonctionnalités proposées — votez','Proposed features — vote'),'proto']);
 if(FEEDBACK_ON&&!window.__BLUELINE__)it.push(['feedback','message-square-text',tr('Retours sur le prototype','Prototype feedback'),tr('Notes par écran, export','Notes per screen, export'),'proto',FEEDBACK.filter(f=>!f.done).length]);
 return it}
/* the SenTrack mark, reused as is */
const LOGO=`<svg viewBox="0 0 184 163" fill="currentColor" aria-hidden="true"><g transform="translate(0,163) scale(0.1,-0.1)"><path d="M610 1240 l0 -120 190 0 c105 0 190 -3 190 -8 0 -4 -85 -93 -190 -197 l-190 -190 -78 78 -77 77 -168 0 c-92 0 -167 -2 -167 -4 0 -6 483 -486 490 -486 3 0 61 56 130 125 69 69 129 125 135 125 6 0 91 -81 190 -180 l180 -180 170 0 170 0 -270 270 -270 270 270 270 270 270 -488 0 -487 0 0 -120z"/></g></svg>`;
function shell(inner,p0,o={}){const items=navItems(),main=items.filter(i=>i[4]==='main');const sec=SECTIONS[p0]||SECTIONS.home;
 const q=[['competitions','calendar-days',tr('Calendrier','Calendar')],['competitions?view=results','list-ordered',tr('Résultats','Results')],['rankings','trophy',tr('Bilans','Rankings')],...(can('lic.view')&&ME.role!=='official'?[['stats','chart-column',tr('Statistiques','Statistics')]]:[]),['verify','scan-qr-code',tr('Vérifier une licence','Verify a licence')]];
 return `<div class="wrap"><header class="hdr">
 <a class="brand" href="#/${ME.role==='athlete'?'me':'home'}"><span class="mark">${LOGO}</span><span><b>FEDESA</b><span>${tr('Licences & compétitions','Licences & competitions')}</span></span></a>
 <nav class="topnav" aria-label="${tr('Navigation principale','Main navigation')}">${main.map(i=>`<a href="#/${i[0]}" class="${(i[0].split('/')[0]===p0)?'on':''}">${ic(i[1])}${esc(i[2].split(' ')[0]==='Demandes'?tr('Licences','Licences'):i[0]==='me'?tr('Ma carte','My card'):i[2].replace(/ applications$/,''))}${i[5]?`<span class="badge ${i[6]||''}">${i[5]}</span>`:''}</a>`).join('')}</nav>
 ${langSwitch()}
 <div class="me">${avatar(ME.name)}<span><b>${esc(ME.name)}</b><span>${esc(roleName(ME.role))}</span></span></div>
 <button class="menu-btn" onclick="toggleMenu()" aria-expanded="${MENU}" aria-label="Menu">MENU<span class="dots"><i></i><i></i><i></i><i></i></span></button>
 </header>
 <div class="banner ${o.crumbs?'slim':''}"><div class="lanes"></div><div class="flagline"></div><h2>${esc(tr(sec[0],sec[1]))}</h2><div class="quick">${q.map(x=>`<a href="#/${x[0]}" title="${esc(x[2])}" aria-label="${esc(x[2])}" class="${RT===x[0]?'on':''}">${ic(x[1])}</a>`).join('')}</div></div>
 <div class="crumbs"><a class="back" href="javascript:history.back()">${ic('arrow-left')} ${tr('Retour','Back')}</a><span class="demo-date" title="${tr('La démo tourne à date figée pour que les échéances restent parlantes','The demo runs on a frozen date so deadlines stay meaningful')}">${ic('calendar-clock')}<span>${tr('Date de démo','Demo date')} · </span>${D.fmt(TODAY)}</span><span class="trail" style="display:flex;gap:8px;align-items:center"><a class="u" href="#/${ME.role==='athlete'?'me':'home'}">${tr('Accueil','Home')}</a>${(o.crumbs||[[tr(sec[0],sec[1])]]).map(c=>`<span>&gt;</span>${c[1]?`<a class="u" href="#/${c[1]}">${esc(c[0])}</a>`:`<span>${esc(c[0])}</span>`}`).join('')}</span></div>
 <main class="rise">${inner}</main></div>${MENU?megaMenu(items,p0):''}${viewAsBar()}`}
function megaMenu(items){const G={main:tr('Au quotidien','Day to day'),lic:tr('Suivi','Follow-up'),adm:tr('Administration','Administration'),proto:tr('Prototype','Prototype')};let i=0;
 return `<div class="mega" onclick="if(event.target===this)toggleMenu()"><div class="sheet" role="dialog" aria-label="Menu"><div class="mh"><div class="row">${avatar(ME.name)}<div><b>${esc(ME.name)}</b><div class="sm muted">${esc(roleName(ME.role))} · ${esc(scopeLabel(ME))}</div></div></div><button class="icon-btn" onclick="toggleMenu()" aria-label="${tr('Fermer','Close')}">${ic('x')}</button></div>
 <div class="row" style="justify-content:space-between">${langSwitch()}<button class="btn sm" onclick="signOut()">${ic('log-out')} ${tr('Changer de profil','Switch profile')}</button></div>
 ${Object.entries(G).map(([g,l])=>{const its=items.filter(x=>x[4]===g);return its.length?`<h3>${l}</h3>`+its.map(x=>`<a class="mi ${RT?.startsWith(x[0])?'on':''}" style="animation-delay:${(i++)*25}ms" href="#/${x[0]}"><span class="ib">${ic(x[1])}</span><span>${esc(x[2])}<small>${esc(x[3])}</small></span>${x[5]?`<span class="badge ${x[6]||''}">${x[5]}</span>`:''}</a>`).join(''):''}).join('')}
 <div style="margin-top:auto;padding-top:18px" class="xs muted">${tr('Prototype — données entièrement fictives, enregistrées dans ce navigateur uniquement. Portraits : photos d’illustration libres de droits (Pexels), sans lien avec les noms affichés.','Prototype — entirely fictional data, stored in this browser only. Portraits: free-licence illustration photos (Pexels), unrelated to the names shown.')} <a href="javascript:resetDemo()" style="text-decoration:underline">${tr('Réinitialiser la démo','Reset demo data')}</a></div></div></div>`}
const langSwitch=()=>`<div class="lang" data-l="${LANG}" role="group" aria-label="Langue / Language / Làkk"><i></i>${[['fr','FR','Français'],['en','EN','English'],['wo','WO','Wolof']].map(([k,l,t])=>`<button class="${LANG===k?'on':''}" onclick="setLang('${k}')" title="${t}" aria-pressed="${LANG===k}">${l}</button>`).join('')}</div>`;
function toggleMenu(){MENU=!MENU;render({keepScroll:true})}
function setLang(l){LANG=l;try{localStorage.setItem('fedesa-lang',l)}catch(e){}document.documentElement.lang=l;render({keepScroll:true});if(l==='wo')toast('Wolof : tekki bi des na — li des mu ngi ci farãse (traduction partielle, à valider)','languages')}
function signOut(){ME=null;ACTOR=null;MENU=false;idb.set('me',null);go('login')}
async function resetDemo(){if(!confirmSoft(tr('Réinitialiser toutes les données de démo ? Vos notes de retour sont conservées.','Reset all demo data? Your feedback notes are kept.')))return;DB=seed();save();MENU=false;toast(tr('Données de démo réinitialisées','Demo data reset'));go(ME?.role==='athlete'?'me':'home')}
/* window.confirm blocks automated browsers and embedded viewers; a two-click guard is enough for a prototype */
let _cf=null;function confirmSoft(msg){if(_cf===msg){_cf=null;return true}_cf=msg;toast(msg+' — '+tr('cliquez à nouveau pour confirmer','click again to confirm'),'alert-triangle');setTimeout(()=>{_cf=null},4000);return false}

/* view-as: frosted bar, bottom centre. Only a super admin can impersonate; the log records both identities. */
function viewAsBar(){const real=ACTOR||ME;if(real.role!=='superadmin')return '';
 return `<div class="viewas ${ACTOR?'viewing':''}" role="toolbar" aria-label="${tr('Voir en tant que','View as')}"><span class="lbl">${ic('eye')}<span>${tr('Voir en tant que','View as')}</span></span><div class="roles">${Object.keys(ROLES).map(k=>`<button class="${ME.role===k?'on':''}" onclick="viewAs('${k}')" title="${esc(DB.users.find(u=>u.role===k)?.name||'')}">${ic(ROLES[k][2])}${esc(tr(...({superadmin:['Admin','Admin'],licences:['Licences','Licensing'],ligue:['Ligue','League'],club:['Club','Club'],official:['Officiel','Official'],athlete:['Athlète','Athlete']}[k])))}</button>`).join('')}</div>${ACTOR?`<button class="x" onclick="viewAs('superadmin')" aria-label="${tr('Quitter','Exit')}">${ic('x')}</button>`:''}</div>`}
function viewAs(role){const real=ACTOR||ME;if(real.role!=='superadmin')return;if(role==='superadmin'){ME=real;ACTOR=null}else{ACTOR=real;ME=DB.users.find(u=>u.role===role)}toast(tr('Vue : ','Viewing as: ')+ME.name+' — '+roleName(ME.role),'eye');go(ME.role==='athlete'?'me':'home')}

/* ============ ui helpers ============ */
function toast(msg,icon='check-circle-2'){const t=document.createElement('div');t.className='toast';t.innerHTML=ic(icon)+`<span>${esc(msg)}</span>`;$('#toasts').appendChild(t);icons();setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),320)},3200)}
function modal(title,body,onOk,okLabel,o={}){$('#modal').innerHTML=`<div class="modal-bg" onclick="if(event.target===this)closeModal()"><div class="modal ${o.wide?'wide':''}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="hd"><h2>${esc(title)}</h2><button class="btn ghost sm" onclick="closeModal()" aria-label="${tr('Fermer','Close')}">${ic('x')}</button></div><div class="bd">${body}</div>${onOk===null?'':`<div class="ft"><button class="btn" onclick="closeModal()">${tr('Annuler','Cancel')}</button><button class="btn ${o.danger?'danger':'pri'}" id="m-ok">${esc(okLabel||tr('Enregistrer','Save'))}</button></div>`}</div></div>`;
 if(onOk)$('#m-ok').onclick=()=>{if(onOk()===false)return;closeModal();save();render({keepScroll:true})};icons();const f=$('#modal .bd input,#modal .bd textarea,#modal .bd select');if(f&&!o.noFocus)f.focus()}
function closeModal(){$('#modal').innerHTML=''}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#modal').innerHTML)closeModal();else if(MENU)toggleMenu()}});
function icons(){try{window.lucide&&lucide.createIcons()}catch(e){}}
function exportBox(title,text){modal(title,`<p class="muted sm" style="margin-bottom:8px">${tr('Les téléchargements sont bloqués dans l’aperçu partagé : copiez le contenu.','Downloads are blocked in the shared preview: copy the content instead.')}</p><textarea class="inp mono" rows="14" readonly style="font-size:12px">${esc(text)}</textarea>`,()=>{navigator.clipboard?.writeText(text);toast(tr('Copié','Copied'),'copy')},tr('Copier','Copy'),{wide:true})}
const csv=rows=>rows.map(r=>r.map(v=>{v=String(v??'');if(/^[=+\-@]/.test(v))v="'"+v;return /[",;\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(';')).join('\n');
const field=(id,label,val='',o={})=>`<label class="f ${o.full?'full':''}" for="${id}"><span>${esc(label)}${o.req?' <span class="req">*</span>':''}</span>${o.options?`<select id="${id}" ${o.attr||''}>${o.options.map(x=>{const [v,l]=Array.isArray(x)?x:[x,x];return `<option value="${esc(v)}" ${String(v)===String(val)?'selected':''}>${esc(l)}</option>`}).join('')}</select>`:o.area?`<textarea id="${id}" rows="${o.rows||3}" ${o.attr||''}>${esc(val)}</textarea>`:`<input id="${id}" type="${o.type||'text'}" value="${esc(val)}" ${o.ph?`placeholder="${esc(o.ph)}"`:''} ${o.attr||''}>`}${o.hint?`<span class="hint">${esc(o.hint)}</span>`:''}</label>`;
const val=id=>($('#'+id)?.value||'').trim();
const kpi=(label,value,delta,icon,cls='',href='')=>`<${href?`a href="#/${href}"`:'div'} class="panel kpi ${cls}"><div class="l">${esc(label)}</div><div class="v" data-count="${typeof value==='number'?value:''}">${typeof value==='number'?0:esc(value)}</div><div class="d">${delta||'&nbsp;'}</div><span class="ic">${ic(icon)}</span></${href?'a':'div'}>`;
function countUp(){$$('[data-count]').forEach(el=>{const to=+el.dataset.count;if(!el.dataset.count||isNaN(to))return;if(matchMedia('(prefers-reduced-motion:reduce)').matches){el.textContent=to.toLocaleString(LANG);return}const t0=performance.now(),dur=700;const step=t=>{const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=Math.round(to*e).toLocaleString(LANG!=='en'?'fr-FR':'en-US');if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)})}
const EMPTY_ART=`<svg class="art" viewBox="0 0 160 120" fill="none" aria-hidden="true"><ellipse cx="80" cy="104" rx="56" ry="7" fill="#E9F3ED"/><path d="M26 92c0-30 24-54 54-54s54 24 54 54" stroke="#C9F0DC" stroke-width="10"/><path d="M42 92c0-21 17-38 38-38s38 17 38 38" stroke="#E9F3ED" stroke-width="10"/><circle cx="118" cy="34" r="7" fill="#E9B824"/><circle cx="118" cy="34" r="13" fill="#E9B824" opacity=".18"/><path d="M76 92V70l14 7-14 7" stroke="#0F6B43" stroke-width="3" stroke-linejoin="round" fill="#0F6B43"/></svg>`;
const empty=(t,s='')=>`<div class="empty">${EMPTY_ART}<b>${esc(t)}</b>${s?`<div class="sm" style="margin-top:4px">${s}</div>`:''}</div>`;
const tabs=(base,cur,list)=>`<div class="tabs" role="tablist">${list.map(([k,l,i,b])=>`<a href="#/${base}${k?'?tab='+k:''}" class="${cur===k?'on':''}" role="tab" aria-selected="${cur===k}">${i?ic(i):''}${esc(l)}${b?`<span class="badge ${b[1]||''}">${b[0]}</span>`:''}</a>`).join('')}</div>`;
const photoSrc=p=>p&&p.photo?(p.photo[0]==='@'?STOCK[p.photo.slice(1)]:p.photo):null;
const who=(p,sub)=>`<span class="who">${photoSrc(p)?`<i class="avatar" style="overflow:hidden"><img src="${photoSrc(p)}" alt="" style="width:100%;height:100%;object-fit:cover"></i>`:avatar(fullName(p))}<span><b>${esc(fullName(p))}</b><span>${sub??esc(CLUB(p.clubId)?.name||'')}</span></span></span>`;
function qrSvg(text){try{const q=qrcode(0,'M');q.addData(text);q.make();const n=q.getModuleCount();let d='';for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c))d+=`M${c} ${r}h1v1h-1z`;return `<svg viewBox="-1 -1 ${n+2} ${n+2}" shape-rendering="crispEdges" role="img" aria-label="QR"><rect x="-1" y="-1" width="${n+2}" height="${n+2}" fill="#fff"/><path d="${d}" fill="#0A2E1F"/></svg>`}catch(e){return `<svg viewBox="0 0 10 10"><rect width="10" height="10" fill="#E9F3ED"/></svg>`}}

/* ============ charts (hand-built SVG; one scale per chart, hover layer, text in ink tokens) ============ */
function hbars(rows,o={}){const max=Math.max(1,...rows.map(r=>r.v.reduce((a,b)=>a+b,0)));const col=o.colors||['var(--c1)'];
 return `${o.legend?`<div class="legend" style="margin-bottom:10px">${o.legend.map((l,i)=>`<span><i style="background:${col[i]}"></i>${esc(l)}</span>`).join('')}</div>`:''}${rows.map((r,ri)=>{const tot=r.v.reduce((a,b)=>a+b,0);return `<div class="hbar" title="${esc(r.l)} — ${r.v.map((x,i)=>(o.legend?o.legend[i]+' ':'')+x).join(' · ')}"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.href?`<a href="#/${r.href}">${esc(r.l)}</a>`:esc(r.l)}</span><span class="trk" style="width:${Math.max(2,tot/max*100)}%;background:none">${r.v.map((x,i)=>x?`<i style="flex:${x};background:${col[i]};animation-delay:${ri*35}ms"></i>`:'').join('')}</span><span class="tnum" style="text-align:right;font-weight:600">${tot}</span></div>`}).join('')}`}
function lineChart(pts,o={}){/* pts:[{x:label,y:number,tip}] */if(pts.length<2)return `<div class="muted sm" style="padding:20px 0">${tr('Pas assez de performances pour tracer une progression.','Not enough marks to draw a progression.')}</div>`;
 const W=640,H=220,L=54,Rr=16,T=14,B=30;let lo=Math.min(...pts.map(p=>p.y)),hi=Math.max(...pts.map(p=>p.y));const pad=(hi-lo||1)*.15;lo-=pad;hi+=pad;
 const X=i=>L+(W-L-Rr)*i/(pts.length-1),Y=v=>o.invert?T+(H-T-B)*(v-lo)/(hi-lo):T+(H-T-B)*(1-(v-lo)/(hi-lo));
 const ticks=[0,1,2,3].map(i=>lo+(hi-lo)*i/3);const path=pts.map((p,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(p.y).toFixed(1)).join(' ');
 const bestI=pts.reduce((m,p,i)=>(o.invert?p.y<pts[m].y:p.y>pts[m].y)?i:m,0);
 return `<div class="chart" data-chart><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label||'')}">${ticks.map(t=>`<line class="gridl" x1="${L}" x2="${W-Rr}" y1="${Y(t)}" y2="${Y(t)}"/><text x="${L-8}" y="${Y(t)+4}" text-anchor="end">${esc(o.fmt?o.fmt(t):t.toFixed(2))}</text>`).join('')}
 <path d="${path} L${X(pts.length-1)} ${H-B} L${L} ${H-B} Z" fill="var(--c1)" opacity=".07"/><path d="${path}" fill="none" stroke="var(--c1)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1s var(--ease) forwards"/>
 ${pts.map((p,i)=>`<circle cx="${X(i)}" cy="${Y(p.y)}" r="${i===bestI?6:4}" fill="${i===bestI?'var(--gold)':'var(--surface)'}" stroke="var(--c1)" stroke-width="2"/><rect x="${X(i)-16}" y="${T}" width="32" height="${H-T-B}" fill="transparent" data-tip="${esc(p.tip)}" data-x="${X(i)/W*100}" data-y="${Y(p.y)/H*100}"/>`).join('')}
 ${pts.map((p,i)=>(i===0||i===pts.length-1||pts.length<7)?`<text x="${X(i)}" y="${H-10}" text-anchor="${i===0?'start':i===pts.length-1?'end':'middle'}">${esc(p.x)}</text>`:'').join('')}
 <text x="${X(bestI)}" y="${Y(pts[bestI].y)-12}" text-anchor="middle" style="font-weight:600;fill:var(--ink)">${esc(o.fmt?o.fmt(pts[bestI].y):pts[bestI].y)}</text></svg><div class="tip"></div></div>`}
function colChart(cols,o={}){/* cols:[{l,v,tip}] */const W=440,H=230,L=36,B=26,T=10;const max=Math.max(1,...cols.map(c=>c.v));const bw=(W-L)/cols.length;const ticks=[0,.5,1].map(k=>Math.round(max*k));
 return `<div class="chart" data-chart><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label||'')}">${ticks.map(t=>{const y=T+(H-T-B)*(1-t/max);return `<line class="gridl" x1="${L}" x2="${W}" y1="${y}" y2="${y}"/><text x="${L-6}" y="${y+4}" text-anchor="end">${t}</text>`}).join('')}
 ${cols.map((c,i)=>{const h=(H-T-B)*c.v/max,x=L+i*bw+bw*.2,w=bw*.6;return `<rect x="${x}" y="${H-B-h}" width="${w}" height="${Math.max(h,0)}" rx="4" fill="${c.hl?'var(--gold)':'var(--c1)'}" style="transform-origin:0 ${H-B}px;transform-box:view-box;animation:growy .7s var(--ease) ${i*30}ms both"/><rect x="${L+i*bw}" y="${T}" width="${bw}" height="${H-T-B}" fill="transparent" data-tip="${esc(c.tip||c.l+' : '+c.v)}" data-x="${(x+w/2)/W*100}" data-y="${(H-B-h)/H*100}"/><text x="${x+w/2}" y="${H-8}" text-anchor="middle">${esc(c.l)}</text>`}).join('')}</svg><div class="tip"></div></div>`}
document.addEventListener('mousemove',e=>{const r=e.target.closest?.('[data-tip]');$$('.chart .tip.on').forEach(t=>t.classList.remove('on'));if(!r)return;const c=r.closest('.chart'),t=c.querySelector('.tip');t.textContent=r.dataset.tip;t.style.left=r.dataset.x+'%';t.style.top=r.dataset.y+'%';t.classList.add('on')});
