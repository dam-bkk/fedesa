/* ============ constants & reference data ============ */
const APP='FEDESA Licences',DBV=4;
/* The demo runs on a frozen date so expiry reminders and the renewal campaign always tell the same story. */
const TODAY='2026-09-21';
let LANG='fr';try{LANG=localStorage.getItem('fedesa-lang')||((navigator.language||'fr').startsWith('en')?'en':(navigator.language||'').startsWith('wo')?'wo':'fr')}catch(e){}
const tr=(fr,en)=>LANG==='en'?en:LANG==='wo'?(WO[fr]??fr):fr;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
const ic=(n,c='')=>`<i data-lucide="${n}" class="${c}"></i>`;
const ini=n=>String(n||'?').split(/\s+/).filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const hue=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))%360;return h};
const avatar=(n,cls='')=>`<i class="avatar ${cls}" style="background:hsl(${hue(n)} 42% 34%)">${esc(ini(n))}</i>`;

/* dates: YYYY-MM-DD strings, integer arithmetic — never local-time Date maths */
const D={
 toN(s){const [y,m,d]=s.split('-').map(Number);return Math.floor(Date.UTC(y,m-1,d)/864e5)},
 fromN(n){return new Date(n*864e5).toISOString().slice(0,10)},
 add(s,days){return D.fromN(D.toN(s)+days)},
 diff(a,b){return D.toN(a)-D.toN(b)},
 y(s){return +s.slice(0,4)},
 fmt(s,o={}){if(!s)return '—';const [y,m,d]=s.split('-').map(Number);const M=LANG==='wo'?['samw.','fewr.','mars','awr.','me','suwe','sulet','ut','sàtt.','okt.','now.','des.']:LANG!=='en'?['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.']:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];return o.short?`${d} ${M[m-1]}`:`${d} ${M[m-1]} ${y}`},
 month(s){const [y,m]=s.split('-').map(Number);const M=LANG==='wo'?['Samwiye','Fewriye','Mars','Awril','Me','Suwe','Sulet','Ut','Sàttumbar','Oktoobar','Nowàmbar','Desàmbar']:LANG!=='en'?['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']:['January','February','March','April','May','June','July','August','September','October','November','December'];return `${M[m-1]} ${y}`},
 mon3(s){const m=+s.slice(5,7);return (LANG!=='en'?['JAN','FÉV','MAR','AVR','MAI','JUIN','JUIL','AOÛT','SEPT','OCT','NOV','DÉC']:['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'])[m-1]},
 dt(iso){if(!iso)return '—';return D.fmt(iso.slice(0,10))+(iso.length>10?' · '+iso.slice(11,16):'')}
};
const nowISO=()=>TODAY+'T'+new Date().toISOString().slice(11,19);

/* 14 regions; ligue=true where the federation lists an active regional league */
const REGIONS=[['DK','Dakar',1],['TH','Thiès',1],['DB','Diourbel',0],['FK','Fatick',0],['KL','Kaolack',1],['KF','Kaffrine',0],['KD','Kolda',1],['LG','Louga',1],['MT','Matam',1],['SL','Saint-Louis',1],['SE','Sédhiou',1],['TC','Tambacounda',1],['KE','Kédougou',1],['ZG','Ziguinchor',1]].map(([code,name,ligue])=>({code,name,ligue:!!ligue}));
const CITIES={DK:['Dakar','Pikine','Guédiawaye','Rufisque','Keur Massar','Diamniadio'],TH:['Thiès','Mbour','Tivaouane','Saly','Joal-Fadiouth'],DB:['Diourbel','Touba','Mbacké','Bambey'],FK:['Fatick','Foundiougne','Gossas'],KL:['Kaolack','Nioro du Rip','Guinguinéo'],KF:['Kaffrine','Koungheul'],KD:['Kolda','Vélingara'],LG:['Louga','Linguère','Kébémer'],MT:['Matam','Ourossogui','Kanel'],SL:['Saint-Louis','Richard-Toll','Dagana','Podor'],SE:['Sédhiou','Goudomp'],TC:['Tambacounda','Bakel'],KE:['Kédougou','Saraya'],ZG:['Ziguinchor','Bignona','Oussouye']};
const VENUES={DK:'Stade Iba Mar Diop',TH:'Stade Lat Dior',KL:'Stade Lamine Guèye',SL:'Stade Me Babacar Sèye',ZG:'Stade Aline Sitoé Diatta',LG:'Stade Alboury Ndiaye',DB:'Stade Ely Manel Fall',FK:'Stade Massène Sène',TC:'Stade régional de Tambacounda',KD:'Stade régional de Kolda',MT:'Stade régional de Matam',SE:'Stade municipal de Sédhiou',KE:'Stade municipal de Kédougou',KF:'Stade municipal de Kaffrine'};
const regionName=c=>REGIONS.find(r=>r.code===c)?.name||c;

/* categories keyed on birth year, age reached in the calendar year the season ends (World Athletics rule) */
const CATS=[['U12','Poussins','U12',0,11],['U14','Benjamins','U14',12,13],['U16','Minimes','U16',14,15],['U18','Cadets','U18',16,17],['U20','Juniors','U20',18,19],['U23','Espoirs','U23',20,22],['SEN','Seniors','Seniors',23,34],['MAS','Masters','Masters',35,120]].map(([code,fr,en,min,max])=>({code,fr,en,min,max}));
const catOf=(dob,seasonEndYear=2026)=>{const a=seasonEndYear-D.y(dob);return (CATS.find(c=>a>=c.min&&a<=c.max)||CATS[0]).code};
const catLabel=c=>{const k=CATS.find(x=>x.code===c);return k?tr(k.fr,k.en):c};
const ageOn=(dob,on=TODAY)=>{let a=D.y(on)-D.y(dob);if(on.slice(5)<dob.slice(5))a--;return a};

/* events: kind t=time (lower is better) d=distance h=height; ref = national record used as the 1000-pt anchor of the performance index */
const EVENTS=[
 ['100','100 m','100 m','t','sprint',1,{M:10.03,F:11.24}],['200','200 m','200 m','t','sprint',1,{M:20.21,F:22.64}],['400','400 m','400 m','t','sprint',0,{M:44.94,F:49.86}],
 ['800','800 m','800 m','t','middle',0,{M:104.06,F:127.25}],['1500','1500 m','1500 m','t','middle',0,{M:218.88,F:260.03}],['5000','5000 m','5000 m','t','distance',0,{M:815,F:960}],['10000','10 000 m','10,000 m','t','distance',0,{M:1700,F:2010}],
 ['HH','110 m / 100 m haies','110 m / 100 m hurdles','t','hurdles',1,{M:13.33,F:12.94}],['400H','400 m haies','400 m hurdles','t','hurdles',0,{M:47.23,F:54.75}],['3000SC','3000 m steeple','3000 m steeplechase','t','distance',0,{M:510,F:615}],
 ['HJ','Hauteur','High jump','h','jumps',0,{M:2.26,F:1.83}],['PV','Perche','Pole vault','h','jumps',0,{M:5.0,F:3.6}],['LJ','Longueur','Long jump','d','jumps',1,{M:8.46,F:6.64}],['TJ','Triple saut','Triple jump','d','jumps',1,{M:17.07,F:15.08}],
 ['SP','Poids','Shot put','d','throws',0,{M:16.44,F:13.10}],['DT','Disque','Discus','d','throws',0,{M:54.0,F:48.0}],['JT','Javelot','Javelin','d','throws',0,{M:79.30,F:51.05}],['HT','Marteau','Hammer','d','throws',0,{M:58.0,F:52.0}]
].map(([code,fr,en,kind,group,wind,ref])=>({code,fr,en,kind,group,wind:!!wind,ref}));
const EV=c=>EVENTS.find(e=>e.code===c);
const evName=(c,sex)=>{const e=EV(c);if(!e)return c;if(c==='HH')return sex==='F'?tr('100 m haies','100 m hurdles'):sex==='M'?tr('110 m haies','110 m hurdles'):tr(e.fr,e.en);return tr(e.fr,e.en)};
const GROUPS={sprint:['Sprint','Sprints'],middle:['Demi-fond','Middle distance'],distance:['Fond','Distance'],hurdles:['Haies','Hurdles'],jumps:['Sauts','Jumps'],throws:['Lancers','Throws']};
const lowerBetter=c=>EV(c).kind==='t';
/* performance formatting in the federation's notation: 10''42, 1'48''32, 7m85 */
function fmtPerf(code,v){if(v==null||v==='')return '—';const e=EV(code);if(e.kind==='t'){const m=Math.floor(v/60),s=v-m*60;const ss=s.toFixed(2).padStart(5,'0').replace('.',"''");return m?`${m}'${ss}`:`${s.toFixed(2).replace('.',"''")}`}return v.toFixed(2).replace('.','m')}
/* accepts 10.42, 10''42, 1:48.32, 1'48''32, 7m85 */
function parsePerf(code,str){str=String(str||'').trim().replace(',','.');if(!str)return null;const e=EV(code);if(e.kind==='t'){let s=str.replace(/''/g,'.').replace(/"/g,'.');let m=0;const mm=s.match(/^(\d+)[':](.+)$/);if(mm){m=+mm[1];s=mm[2]}const v=m*60+parseFloat(s);return isFinite(v)&&v>0?Math.round(v*100)/100:null}const v=parseFloat(str.replace('m','.'));return isFinite(v)&&v>0?Math.round(v*100)/100:null}
/* Performance index: 1000 pts = national record. Indicative only — production would use the World Athletics scoring tables. */
function points(code,sex,v){if(v==null)return 0;const r=EV(code).ref[sex];const q=lowerBetter(code)?r/v:v/r;return Math.max(0,Math.round(1000*Math.pow(q,lowerBetter(code)?3:2)))}
const levelOf=p=>p>=940?'IA':p>=880?'N1':p>=820?'N2':p>=760?'N3':p>=690?'IR':p>=610?'R1':p>=520?'R2':'D';

const LIC_TYPES={competition:['Compétition','Competition',5000],jeunes:['Jeunes (U12–U16)','Youth (U12–U16)',2000],loisir:['Loisir / Running','Leisure / Running',3000],encadrement:['Encadrement (entraîneur, dirigeant)','Staff (coach, club official)',4000],officiel:['Officiel / Juge','Technical official',2500]};
const licType=k=>tr(LIC_TYPES[k][0],LIC_TYPES[k][1]);
const fcfa=n=>new Intl.NumberFormat(LANG!=='en'?'fr-FR':'en-US').format(n)+' FCFA';
const DOCS={
 photo:['Photo d’identité récente','Recent ID photo','image'],
 idcard:['CNI CEDEAO ou extrait de naissance','ECOWAS ID card or birth certificate','id-card'],
 medical:['Certificat médical de non contre-indication','Medical certificate of fitness','stethoscope'],
 form:['Fiche de demande signée','Signed application form','file-signature'],
 parental:['Autorisation parentale (mineur)','Parental consent (minor)','users'],
 payment:['Justificatif de paiement','Proof of payment','receipt'],
 transfer:['Lettre de sortie du club quitté','Release letter from previous club','arrow-left-right'],
 diploma:['Diplôme / attestation de formation','Coaching or officiating certificate','graduation-cap']};
const docName=k=>tr(DOCS[k][0],DOCS[k][1]);
function requiredDocs(a){if(a.kind==='renewal'){const r=['medical','form','payment'];if(a.type==='encadrement'||a.type==='officiel')r.shift();if(ageOn(a.dob)<18)r.push('parental');return r}const r=['photo','idcard','form','payment'];if(a.type!=='encadrement'&&a.type!=='officiel')r.splice(2,0,'medical');if(ageOn(a.dob)<18)r.push('parental');if(a.kind==='transfer')r.push('transfer');if(a.type==='encadrement'||a.type==='officiel')r.push('diploma');return r}

const APP_STATUS={draft:['Brouillon','Draft','','hollow'],submitted:['Soumise','Submitted','info',''],in_review:['En instruction','In review','info',''],info_requested:['Complément demandé','More documents requested','warn',''],approved:['Validée','Approved','ok',''],rejected:['Refusée','Rejected','crit','']};
const LIC_STATUS={active:['Active','Active','ok',''],expiring:['Expire bientôt','Expiring soon','warn',''],expired:['Expirée','Expired','crit','hollow'],suspended:['Suspendue','Suspended','crit',''],none:['Sans licence','No licence','','hollow']};
const COMP_STATUS={draft:['Brouillon','Draft','','hollow'],submitted:['En attente de validation','Awaiting approval','info',''],approved:['Inscrite au calendrier','On the calendar','ok','hollow'],entries_open:['Engagements ouverts','Entries open','ok',''],entries_closed:['Engagements clos','Entries closed','warn',''],results:['Résultats en saisie','Results in progress','warn',''],published:['Résultats publiés','Results published','ok','']};
const LEVELS={club:['Club','Club'],regional:['Régional','Regional'],national:['National','National'],international:['International','International']};
const CTYPES={stade:['Stade','Track & field'],cross:['Cross','Cross country'],route:['Route','Road'],salle:['Salle','Indoor']};
const pill=(map,k)=>{const s=map[k]||[k,k,'',''];return `<span class="pill ${s[2]} ${s[3]}">${esc(tr(s[0],s[1]))}</span>`};

/* roles & permissions */
const ROLES={superadmin:['Super admin fédération','Federation super admin','shield-check'],licences:['Agent licences','Licensing officer','badge-check'],ligue:['Ligue régionale','Regional league','map'],club:['Responsable de club','Club manager','users'],official:['Officiel / juge','Technical official','timer'],athlete:['Athlète licencié','Licensed athlete','medal']};
const roleName=r=>tr(ROLES[r][0],ROLES[r][1]);
const FEATURES=[
 ['apps.submit','Déposer des demandes de licence','Submit licence applications','Licences'],
 ['apps.review','Instruire les demandes (pièces, complément)','Review applications (documents, requests)','Licences'],
 ['apps.decide','Valider / refuser et attribuer le numéro','Approve / reject and issue the number','Licences'],
 ['lic.view','Consulter le registre des licenciés','View the licensee register','Licences'],
 ['lic.edit','Modifier une fiche licencié','Edit a licensee record','Licences'],
 ['lic.suspend','Suspendre / réactiver une licence','Suspend / reinstate a licence','Licences'],
 ['lic.export','Exporter le registre','Export the register','Licences'],
 ['remind.send','Envoyer les relances d’expiration','Send expiry reminders','Licences'],
 ['clubs.manage','Gérer les clubs et affiliations','Manage clubs and affiliations','Structures'],
 ['comp.create','Créer une compétition','Create a competition','Compétitions'],
 ['comp.approve','Valider l’inscription au calendrier','Approve calendar registration','Compétitions'],
 ['comp.entries','Engager des athlètes','Enter athletes','Compétitions'],
 ['comp.results','Saisir les résultats','Enter results','Compétitions'],
 ['comp.publish','Contrôler et publier les résultats','Check and publish results','Compétitions'],
 ['records.ratify','Homologuer un record','Ratify a record','Compétitions'],
 ['admin.users','Gérer utilisateurs et rôles','Manage users and roles','Administration'],
 ['admin.settings','Paramètres (saison, tarifs, pièces)','Settings (season, fees, documents)','Administration'],
 ['admin.activity','Journal d’activité','Activity log','Administration']];
const DEFAULT_PERMS={
 superadmin:Object.fromEntries(FEATURES.map(f=>[f[0],true])),
 licences:{'apps.review':1,'apps.decide':1,'lic.view':1,'lic.edit':1,'lic.suspend':1,'lic.export':1,'remind.send':1,'clubs.manage':1,'admin.activity':1},
 ligue:{'apps.review':1,'lic.view':1,'lic.export':1,'remind.send':1,'comp.create':1,'comp.approve':1,'comp.entries':0,'comp.publish':1},
 club:{'apps.submit':1,'lic.view':1,'lic.export':1,'remind.send':1,'comp.create':1,'comp.entries':1,'comp.results':1},
 official:{'lic.view':1,'comp.results':1},
 athlete:{}};

/* ============ seed ============ */
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function seed(){
 const R=rng(20260921),pick=a=>a[Math.floor(R()*a.length)],rint=(a,b)=>a+Math.floor(R()*(b-a+1)),gauss=()=>{let s=0;for(let i=0;i<4;i++)s+=R();return (s-2)/0.58};
 const MN=['Mamadou','Ibrahima','Cheikh','Moussa','Ousmane','Abdoulaye','Modou','Pape','Babacar','Amadou','Aliou','Serigne','Assane','Lamine','El Hadji','Souleymane','Malick','Idrissa','Omar','Khadim','Alioune','Mor','Youssou','Saliou','Daouda','Boubacar'];
 const FN=['Fatou','Aminata','Aïssatou','Mariama','Khady','Ndèye','Awa','Astou','Coumba','Adama','Bineta','Sokhna','Mame Diarra','Rokhaya','Dieynaba','Seynabou','Maïmouna','Oumou','Yacine','Ramatoulaye','Penda','Ngoné','Marème','Daba'];
 const SN=['Ndiaye','Diop','Fall','Guèye','Mbaye','Seck','Niang','Thiam','Sarr','Faye','Diouf','Sène','Ngom','Sow','Ba','Diallo','Kane','Sy','Ly','Diatta','Badji','Sagna','Mendy','Gomis','Coly','Cissé','Touré','Camara','Dramé','Wade','Samb','Dieng','Lô','Tall'];
 /* fictional clubs — any resemblance to a real club is coincidental */
 const CL=[['ACA','AC Almadies','DK','Dakar',2009,1.25],['UAD','Université Athlé Dakar','DK','Dakar',1998,1.2],['EPK','Espoirs de Pikine','DK','Pikine',2012,1.0],['ROA','Rufisque Océan Athlé','DK','Rufisque',2006,.95],['GSA','Guédiawaye Sprint Académie','DK','Guédiawaye',2016,1.05],
  ['RAT','Rail Athlétique de Thiès','TH','Thiès',1987,1.15],['PCA','Petite Côte Athlétisme','TH','Mbour',2010,1.0],['NAS','Ndar Athlé Saint-Louis','SL','Saint-Louis',1994,1.05],['SSK','Saloum Sprint Kaolack','KL','Kaolack',2003,.95],['CAZ','Casamance Athlétic Ziguinchor','ZG','Ziguinchor',2001,1.0],
  ['BAD','Baol Athlé Diourbel','DB','Diourbel',2014,.85],['TEC','Touba Endurance Club','DB','Touba',2018,.9],['FAL','Ferlo Athlé Louga','LG','Louga',2011,.85],['NAT','Niokolo Athlé Tambacounda','TC','Tambacounda',2015,.8],['FAK','Fouladou Athlé Kolda','KD','Kolda',2017,.8],['SAF','Sine Athlé Fatick','FK','Fatick',2019,.8]];
 /* the federation counts about 300 affiliated clubs: 16 hand-written ones carry the demo stories, the rest are generated per region */
 const QUOTA={DK:90,TH:45,SL:22,DB:22,KL:20,ZG:20,LG:14,FK:12,TC:12,KD:11,MT:9,KF:9,SE:8,KE:6};
 const QRT=['Médina','Grand Yoff','Parcelles','HLM','Liberté','Sicap','Ouakam','Yoff','Ngor','Santhiaba','Escale','Léona','Darou Salam','Ndiolofène','Boucotte','Thialy','Diamaguène','Kasnack','Sor','Pout','Thiaroye','Mbao','Yeumbeul','Malika','Sangalkam','Bargny','Ngaparou','Nianing','Keur Madiop','Randoulène'];
 const PAT=[(c,q)=>`ASC ${q} ${c}`,(c,q)=>`AS ${c} Athlétisme`,(c,q)=>`US ${q}`,(c,q)=>`${c} Athlé Club`,(c,q)=>`Espoirs de ${q}`,(c,q)=>`Foyer des jeunes de ${q}`,(c,q)=>`Académie d’athlétisme de ${c}`,(c,q)=>`Olympique ${q}`,(c,q)=>`Étoile de ${q}`,(c,q)=>`ASC Jeunesse de ${c}`,(c,q)=>`Lycée ${q} Athlé`,(c,q)=>`Club athlétique ${q}`];
 const usedN=new Set(CL.map(x=>x[1])),usedC=new Set(CL.map(x=>x[0]));
 Object.entries(QUOTA).forEach(([reg,n])=>{let have=CL.filter(x=>x[2]===reg).length,guard=0;while(have<n&&guard++<2000){const city=pick(CITIES[reg]),name=pick(PAT)(city,pick(QRT));if(usedN.has(name))continue;let code=name.replace(/[^A-Za-zÀ-ÿ ]/g,'').split(' ').filter(w=>w.length>2).map(w=>w[0]).join('').toUpperCase().normalize('NFD').replace(/[^A-Z]/g,'').slice(0,3).padEnd(3,'A');let k=0;while(usedC.has(code))code=code.slice(0,2)+'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[k++%26]+(k>26?k:'');usedN.add(name);usedC.add(code);CL.push([code,name,reg,city,rint(1992,2024),.72+R()*.3]);have++}});
 const clubs=CL.map(([code,name,region,city,founded,q],i)=>({id:'c'+(i+1),code,name,region,city,founded,q,affiliation:(i===15||i%41===17)?'pending':(i===12||i%29===11)?'late':'ok',affiliationPaid:(i===15||i%41===17||i===12||i%29===11)?null:'2025-11-'+String(rint(3,28)).padStart(2,'0'),president:pick(MN)+' '+pick(SN),phone:'+221 33 8'+rint(20,69)+' '+rint(10,99)+' '+rint(10,99),email:'contact@'+code.toLowerCase()+'-athle.example',venue:VENUES[region]}));
 const phone=()=>'+221 '+pick(['77','78','76','70'])+' '+rint(100,999)+' '+rint(10,99)+' '+rint(10,99);
 const nin=(sex,dob)=>`${sex==='M'?1:2} ${pick(['G','B','A','K'])}${String(rint(1,48)).padStart(2,'0')} ${D.y(dob)} ${String(rint(1,9999)).padStart(5,'0')}`;
 const groups=Object.keys(GROUPS),gEv=g=>EVENTS.filter(e=>e.group===g).map(e=>e.code);
 let licSeq=104200;const people=[];
 const sizes=[34,30,24,20,22,28,20,22,18,20,14,16,14,12,12,8];
 clubs.forEach((c,ci)=>{const size=sizes[ci]??rint(3,13);for(let i=0;i<size;i++){
  const sex=R()<.56?'M':'F',r=R();
  const age=r<.10?rint(10,13):r<.24?rint(14,15):r<.42?rint(16,17):r<.58?rint(18,19):r<.72?rint(20,22):r<.93?rint(23,33):rint(35,52);
  const dob=`${2026-age}-${String(rint(1,12)).padStart(2,'0')}-${String(rint(1,28)).padStart(2,'0')}`;
  const g=pick(groups),evs=gEv(g);const main=[pick(evs)];const second=pick(evs);if(second!==main[0])main.push(second);if(g==='sprint'&&R()<.3&&!main.includes('LJ'))main.push('LJ');
  const staff=age>30&&R()<.35;const type=staff?(R()<.6?'encadrement':'officiel'):age<16?'jeunes':age>34?'loisir':R()<.9?'competition':'loisir';
  const first=pick(sex==='M'?MN:FN),last=pick(SN);
  /* licence story for the frozen demo date: season 2025-26 ends 31 Oct 2026, renewal campaign for 2026-27 is open */
  const st=R();let status='active',licences=[];const since=Math.max(2015,2026-rint(0,Math.min(9,age-9)));
  const no='SN'+String(licSeq+=rint(1,9));
  for(let y=since;y<2025;y++)if(R()<.85)licences.push({season:`${y}-${y+1}`,from:`${y}-11-01`,to:`${y+1}-10-31`,type});
  if(st<.80){licences.push({season:'2025-2026',from:'2025-'+pick(['11','11','12'])+'-'+String(rint(2,27)).padStart(2,'0'),to:'2026-10-31',type})}
  if(st>=.80&&st<.92){status='expired'}
  if(st<.17){licences.push({season:'2026-2027',from:'2026-09-'+String(rint(1,19)).padStart(2,'0'),to:'2027-10-31',type})}
  if(st>=.92&&st<.94){licences.push({season:'2025-2026',from:'2025-11-14',to:'2026-10-31',type});status='suspended'}
  if(st>=.94){licences.push({season:'2025-2026',from:'2025-12-03',to:'2026-10-31',type})}
  if(!licences.length){licences.push({season:'2024-2025',from:'2024-11-10',to:'2025-10-31',type});status='expired'}
  const medExp=D.add(TODAY,st<.5?rint(-20,75):rint(60,320));
  people.push({id:'p'+people.length,no,first,last,sex,dob,pob:pick(CITIES[c.region]),nat:R()<.96?'SEN':pick(['GMB','MLI','GIN','MRT','CPV']),nin:age>=15?nin(sex,dob):'',birthCert:age<15?`${rint(100,4999)}/${D.y(dob)}`:'',
   address:pick(['Cité','Quartier','Villa n°','Parcelle','HLM'])+' '+pick(['Keur Gorgui','Médina','Grand Standing','Escale','Santhiaba','Darou Salam','Léona','Ndiolofène','Boucotte','Grand Yoff','Sacré-Cœur','Liberté 6'])+' '+rint(1,240),
   city:R()<.7?c.city:pick(CITIES[c.region]),region:c.region,phone:phone(),email:(first+'.'+last).toLowerCase().normalize('NFD').replace(/[^a-z.]/g,'')+rint(1,99)+'@example.sn',
   emergency:{name:pick(R()<.5?MN:FN)+' '+last,phone:phone(),rel:pick(['Père','Mère','Frère','Sœur','Oncle','Conjoint(e)'])},guardian:age<18?{name:pick(R()<.5?MN:FN)+' '+last,phone:phone()}:null,
   clubId:c.id,type,events:staff?[]:main,group:g,ability:Math.min(.98,Math.max(.05,.5+gauss()*.19+(c.q-1)*.5)),coach:'',since,licences,status,medExp,height:sex==='M'?rint(168,196):rint(158,184),photo:null,consent:true,docs:{}})}});
 clubs.forEach(c=>{const st=people.filter(p=>p.clubId===c.id&&p.type==='encadrement');people.filter(p=>p.clubId===c.id&&p.events.length).forEach(p=>{p.coach=st.length?pick(st).id:''})});

 /* performances: a plausible mark for an athlete, given ability, category and a little day-form noise */
 const CATF={U12:.70,U14:.76,U16:.83,U18:.90,U20:.95,U23:.98,SEN:1,MAS:.88};
 function mark(p,code,form){const e=EV(code),ref=e.ref[p.sex];const q=(0.70+0.27*p.ability)*CATF[catOf(p.dob)]*(1+form);return e.kind==='t'?Math.round(ref/Math.pow(q,e.group==='distance'||e.group==='middle'?.75:.62)*100)/100:Math.round(ref*Math.pow(q,1.25)*100)/100}
 const comps=[],results=[];
 const mkComp=(o)=>{const c={id:'k'+(comps.length+1),code:String(261040+comps.length*7),entries:[],events:[],officials:{director:pick(MN)+' '+pick(SN),referee:pick(FN)+' '+pick(SN),timing:o.level==='club'?'manual':'electronic'},fee:o.level==='national'?1000:500,history:[],...o};c.venue=c.venue||VENUES[c.region];c.contact={phone:'+221 33 8'+rint(20,69)+' '+rint(10,99)+' '+rint(10,99),email:'competitions@fedesa.example'};c.gallery=[];comps.push(c);return c};
 const CAPS=[['blocks','Départ du 100 m — dans les starting-blocks','100 m start — in the blocks'],['band','Dernier virage du 800 m au coucher du soleil','Final bend of the 800 m at sunset'],['news-1','Relance sur la ligne opposée','Pushing on down the back straight'],['clubs','Reconnaissance du parcours la veille','Course recce the day before'],['blocks','Passage de témoin, relais 4 × 100 m','Baton exchange, 4 × 100 m relay'],['band','Tour d’honneur des finalistes','Finalists’ lap of honour']];
 const PAST=[['Cross d’ouverture de la saison','2025-12-13','TH','Thiès','regional','cross','c6'],['Meeting d’ouverture de Dakar','2026-02-14','DK','Dakar','regional','stade','c1'],['Championnats régionaux de Thiès','2026-03-21','TH','Thiès','regional','stade','c6'],['Meeting du Fleuve','2026-04-18','SL','Saint-Louis','regional','stade','c8'],['Championnats régionaux de Dakar','2026-05-09','DK','Dakar','regional','stade','c2'],['Meeting de la Casamance','2026-05-30','ZG','Ziguinchor','regional','stade','c10'],['Championnats nationaux cadets et juniors','2026-06-27','TH','Thiès','national','stade',null],['Championnats nationaux seniors','2026-07-25','DK','Dakar','national','stade',null],['Meeting de clôture — Petite Côte','2026-08-22','TH','Mbour','club','stade','c7'],['Meeting de rentrée de Thiès','2026-09-19','TH','Thiès','regional','stade','c6'],['Meeting Iba Mar Diop — rentrée','2026-09-20','DK','Dakar','club','stade','c1']];
 PAST.forEach(([name,date,region,city,level,type,org],ci)=>{
  const c=mkComp({name,start:date,end:level==='national'?D.add(date,1):date,region,city,level,type,organiserClubId:org,status:'published',entryDeadline:D.add(date,-7),venue:city==='Mbour'?'Stade Caroline Faye':undefined});
  c.gallery=CAPS.slice(0,type==='cross'?3:rint(4,6)).map(([k,fr,en],i)=>({id:uid(),src:'@'+(type==='cross'&&i===0?'clubs':k),fr,en,credit:'Photo d’illustration',press:i%2===0,by:'u1',ts:date+'T18:00:00'}));
  if(type==='cross')return;
  const prog=level==='national'?EVENTS.map(e=>e.code):['100','200','400','800','1500','5000','HH','400H','HJ','LJ','TJ','SP','DT','JT'];
  const cats=name.includes('cadets')?['U18','U20']:['SEN'];
  let tm=9*60;
  prog.forEach(code=>['M','F'].forEach(sex=>cats.forEach(cat=>{
   const evId=c.id+'-'+code+sex+(cat==='SEN'?'':cat);
   const pool=people.filter(p=>p.sex===sex&&p.events.includes(code)&&p.licences.some(l=>l.season==='2025-2026')&&(cat==='SEN'?['U20','U23','SEN','U18'].includes(catOf(p.dob)):catOf(p.dob)===cat)&&(level==='national'?p.ability>.42:(p.region===region||R()<.25)));
   if(pool.length<2)return;
   const field=pool.sort(()=>R()-.5).slice(0,level==='national'?12:8);
   c.events.push({id:evId,code,sex,cat:cat==='SEN'?'TC':cat,time:`${String(Math.floor(tm/60)).padStart(2,'0')}:${String(tm%60).padStart(2,'0')}`,round:'F'});tm+=rint(10,20);
   const wind=EV(code).wind?Math.round((gauss()*1.4+.4)*10)/10:null;
   const rows=field.map(p=>{const r=R();const st=r<.03?'DNS':r<.05?(EV(code).kind==='t'?'DNF':'NM'):r<.06?'DQ':'OK';const w=EV(code).wind?(EV(code).kind==='t'?wind:Math.round((wind+gauss()*.6)*10)/10):null;
    return {id:uid(),compId:c.id,evId,a:p.id,code,sex,perf:st==='OK'?mark(p,code,gauss()*.012+ci*.0022+(w>2?.006:0)):null,wind:w,st,date,place:null}});
   rankRows(rows,code);rows.forEach(r=>{results.push(r);c.entries.push({id:uid(),evId,a:r.a,seed:null,bib:null,status:'confirmed'})});
  })));
  let bib=1;const seen={};c.entries.forEach(e=>{seen[e.a]=seen[e.a]||bib++;e.bib=seen[e.a]});
 });
 /* upcoming */
 const UP=[['Cross de rentrée de Pikine','2026-10-10','DK','Pikine','club','cross','c3','entries_open'],['Meeting de rentrée — Jeunes talents Dakar 2026','2026-10-17','DK','Dakar','regional','stade','c1','entries_open'],['Semi-marathon de Saly','2026-11-08','TH','Saly','regional','route','c7','approved'],['Cross national d’ouverture 2026-2027','2026-11-21','TH','Thiès','national','cross',null,'approved'],['Meeting du Saloum','2026-12-05','KL','Kaolack','regional','stade','c9','submitted'],['Soirée sprint & haies de Guédiawaye','2026-12-12','DK','Guédiawaye','club','stade','c5','draft']];
 UP.forEach(([name,date,region,city,level,type,org,status])=>{const c=mkComp({name,start:date,end:date,region,city,level,type,organiserClubId:org,status,entryDeadline:D.add(date,-6),venue:city==='Saly'?'Parcours de Saly-Portudal':undefined});
  if(type==='stade'){let tm=15*60;['100','200','400','800','1500','HH','LJ','TJ','SP','JT'].forEach(code=>['M','F'].forEach(sex=>{c.events.push({id:c.id+'-'+code+sex,code,sex,cat:name.includes('Jeunes')?'U18':'TC',time:`${String(Math.floor(tm/60)).padStart(2,'0')}:${String(tm%60).padStart(2,'0')}`,round:'F'});tm+=12}))}});
 /* a few entries on the open meeting */
 const open=comps.find(c=>c.name.includes('Jeunes talents'));let b=1;
 people.filter(p=>catOf(p.dob)==='U18'&&p.events.length&&p.licences.some(l=>l.to>=open.start||l.season==='2025-2026')).slice(0,34).forEach(p=>{const ev=open.events.find(e=>e.code===p.events[0]&&e.sex===p.sex);if(ev)open.entries.push({id:uid(),evId:ev.id,a:p.id,seed:null,bib:b++,status:'confirmed'})});

 /* applications in every state of the workflow */
 const apps=[];let aseq=212;
 const mkApp=(o)=>{const a={id:'D-2026-'+String(aseq++).padStart(4,'0'),season:'2026-2027',history:[],complement:null,number:null,...o};a.fee=LIC_TYPES[a.type][2];apps.push(a);return a};
 const fresh=(clubId,sex,age,type,kind='new')=>{const c=clubs.find(x=>x.id===clubId);const dob=`${2026-age}-${String(rint(1,12)).padStart(2,'0')}-${String(rint(1,28)).padStart(2,'0')}`;const first=pick(sex==='M'?MN:FN),last=pick(SN);return {kind,clubId,type,first,last,sex,dob,pob:c.city,nat:'SEN',nin:age>=15?nin(sex,dob):'',birthCert:age<15?`${rint(100,4999)}/${D.y(dob)}`:'',address:'Quartier Escale '+rint(1,90),city:c.city,region:c.region,phone:phone(),email:(first+'.'+last).toLowerCase().normalize('NFD').replace(/[^a-z.]/g,'')+'@example.sn',emergency:{name:pick(MN)+' '+last,phone:phone(),rel:'Père'},guardian:age<18?{name:pick(FN)+' '+last,phone:phone()}:null,events:[pick(['100','200','400','800','LJ','TJ','JT'])],consent:true}};
 const docsFor=(a,state)=>Object.fromEntries(requiredDocs(a).map(k=>[k,{status:state==='missing'?'missing':state,file:state==='missing'?null:{name:k+'-'+a.last.toLowerCase()+(k==='photo'?'.jpg':'.pdf'),size:rint(120,900)*1024},note:'',date:k==='medical'?D.add(TODAY,-rint(5,40)):null}]));
 const H=(a,ts,who,action,note='')=>a.history.push({ts,who,action,note});
 [['c1','F',16,'competition'],['c6','M',19,'competition'],['c3','M',13,'jeunes'],['c8','F',24,'competition'],['c10','M',17,'competition']].forEach(([cl,sx,ag,ty],i)=>{const a=mkApp({...fresh(cl,sx,ag,ty),status:'submitted',submittedAt:D.add(TODAY,-i)+'T10:1'+i+':00',paid:{method:pick(['Wave','Orange Money']),ref:'TX'+rint(100000,999999)}});a.docs=docsFor(a,'provided');H(a,a.submittedAt,'u4','submitted')});
 {const a=mkApp({...fresh('c2','F',21,'competition'),status:'in_review',submittedAt:D.add(TODAY,-4)+'T09:20:00',paid:{method:'Wave',ref:'TX481220'}});a.docs=docsFor(a,'provided');a.docs.photo.status='accepted';a.docs.idcard.status='accepted';H(a,a.submittedAt,'u5','submitted');H(a,D.add(TODAY,-3)+'T14:02:00','u2','opened')}
 {const a=mkApp({...fresh('c1','M',15,'jeunes'),status:'info_requested',submittedAt:D.add(TODAY,-6)+'T11:00:00',paid:{method:'Orange Money',ref:'TX771034'}});a.docs=docsFor(a,'accepted');a.docs.medical.status='rejected';a.docs.medical.note='Certificat daté de plus d’un an — merci d’en fournir un récent.';a.docs.parental.status='missing';a.docs.parental.file=null;a.complement={docs:['medical','parental'],message:'Le certificat médical date de 2025 et l’autorisation parentale n’est pas signée. Merci de compléter avant le 5 octobre.',at:D.add(TODAY,-2)+'T16:30:00',by:'u2'};H(a,a.submittedAt,'u4','submitted');H(a,a.complement.at,'u2','info_requested',a.complement.message)}
 {const a=mkApp({...fresh('c6','F',18,'competition','transfer'),status:'info_requested',submittedAt:D.add(TODAY,-8)+'T08:45:00',paid:{method:'Wave',ref:'TX220981'},fromClubId:'c7'});a.docs=docsFor(a,'accepted');a.docs.transfer.status='missing';a.docs.transfer.file=null;a.complement={docs:['transfer'],message:'Mutation : la lettre de sortie de Petite Côte Athlétisme est requise.',at:D.add(TODAY,-5)+'T10:00:00',by:'u2'};H(a,a.submittedAt,'u6','submitted');H(a,a.complement.at,'u2','info_requested',a.complement.message)}
 {const a=mkApp({...fresh('c9','M',27,'competition'),status:'rejected',submittedAt:D.add(TODAY,-12)+'T13:00:00',decidedAt:D.add(TODAY,-9)+'T09:00:00',reason:'Doublon : athlète déjà licencié sous un autre numéro (même nom, même date de naissance).',paid:{method:'Espèces',ref:''}});a.docs=docsFor(a,'provided');H(a,a.submittedAt,'u4','submitted');H(a,a.decidedAt,'u2','rejected',a.reason)}
 {const a=mkApp({...fresh('c1','F',20,'competition'),status:'draft',submittedAt:null,paid:null});a.docs=docsFor(a,'missing')}
 {const src=people.find(p=>p.clubId!=='c3'&&catOf(p.dob)==='U20'&&p.sex==='M'&&p.nin);const a=mkApp({...fresh('c3','M',16,'competition'),status:'submitted',submittedAt:TODAY+'T08:40:00',paid:{method:'Wave',ref:'TX903317'}});a.first=src.first;a.last=src.last;a.email=(src.first+'.'+src.last).toLowerCase().normalize('NFD').replace(/[^a-z.]/g,'')+'@example.sn';a.dob=(D.y(src.dob)+2)+src.dob.slice(4);a.pob=src.pob;a.nin=nin('M',a.dob);a.guardian={name:pick(MN)+' '+src.last,phone:phone()};a.docs=docsFor(a,'provided');H(a,a.submittedAt,'u4','submitted')}
 /* renewals already approved this month match the 2026-27 licences seeded above */
 people.filter(p=>p.licences.some(l=>l.season==='2026-2027')).slice(0,40).forEach((p,i)=>{const l=p.licences.find(x=>x.season==='2026-2027');const a=mkApp({kind:'renewal',licenseeId:p.id,clubId:p.clubId,type:p.type,first:p.first,last:p.last,sex:p.sex,dob:p.dob,status:'approved',submittedAt:D.add(l.from,-2)+'T10:00:00',decidedAt:l.from+'T15:00:00',number:p.no,paid:{method:pick(['Wave','Wave','Orange Money','Virement']),ref:'TX'+rint(100000,999999)}});a.docs={};H(a,a.submittedAt,'u4','submitted');H(a,a.decidedAt,'u2','approved')});

 const users=[
  {id:'u1',name:'Aïssatou Ndiaye',role:'superadmin',title:'Secrétariat général',scope:{kind:'all'},email:'a.ndiaye@fedesa.example',active:true},
  {id:'u2',name:'Mamadou Sarr',role:'licences',title:'Service des licences',scope:{kind:'all'},email:'m.sarr@fedesa.example',active:true},
  {id:'u3',name:'Fatou Diop',role:'ligue',title:'Ligue régionale de Thiès',scope:{kind:'region',value:'TH'},email:'ligue.thies@fedesa.example',active:true},
  {id:'u4',name:'Ibrahima Fall',role:'club',title:'AC Almadies',scope:{kind:'club',value:'c1'},email:'i.fall@aca-athle.example',active:true},
  {id:'u5',name:'Cheikh Guèye',role:'official',title:'Juge-arbitre fédéral',scope:{kind:'all'},email:'c.gueye@fedesa.example',active:true},
  {id:'u6',name:'Khady Sow',role:'club',title:'Rail Athlétique de Thiès',scope:{kind:'club',value:'c6'},email:'k.sow@rat-athle.example',active:true},
  {id:'u7',name:'Omar Diatta',role:'ligue',title:'Ligue régionale de Dakar',scope:{kind:'region',value:'DK'},email:'ligue.dakar@fedesa.example',active:true}];
 /* the athlete persona is a real licensee of the demo club with a full season behind them */
 const star=people.filter(p=>p.clubId==='c1'&&p.events.length&&p.status==='active').sort((a,b)=>results.filter(r=>r.a===b.id&&r.st==='OK').length-results.filter(r=>r.a===a.id&&r.st==='OK').length)[0];
 {const bestPts={};results.forEach(r=>{if(r.st==='OK'&&r.perf!=null&&(r.wind==null||r.wind<=2)){const v=points(r.code,r.sex,r.perf);if(!(bestPts[r.a]>=v))bestPts[r.a]=v}});
  const adult=p=>['U20','U23','SEN'].includes(catOf(p.dob));const rankd=people.filter(p=>adult(p)&&bestPts[p.id]).sort((a,b)=>bestPts[b.id]-bestPts[a.id]);
  ['F','M'].forEach(sx=>{const pool=[...(star.sex===sx?[star]:[]),...rankd.filter(p=>p.sex===sx&&p!==star)].slice(0,5);pool.forEach((p,i)=>{p.photo='@p'+sx.toLowerCase()+(i+1)})})}
 users.push({id:'u8',name:star.first+' '+star.last,role:'athlete',title:'AC Almadies',scope:{kind:'self',value:star.id},email:star.email,active:true});
 const activity=[
  {ts:D.add(TODAY,-2)+'T16:30:00',who:'u2',actor:null,action:'Complément demandé',cat:'licences',target:apps.find(a=>a.status==='info_requested').id,ip:'41.82.14.'+rint(2,250)},
  {ts:D.add(TODAY,-1)+'T09:12:00',who:'u1',actor:null,action:'Compétition inscrite au calendrier',cat:'competitions',target:'Semi-marathon de Saly',ip:'41.82.14.7'},
  {ts:D.add(TODAY,-1)+'T11:40:00',who:'u4',actor:null,action:'Demande soumise',cat:'licences',target:apps[1].id,ip:'154.124.3.'+rint(2,250)}].reverse();
 return {v:DBV,season:{current:'2025-2026',start:'2025-11-01',end:'2026-10-31',next:'2026-2027',nextStart:'2026-11-01',nextEnd:'2027-10-31',renewalOpen:'2026-09-01'},clubs,people,comps,results,apps,users,perms:JSON.parse(JSON.stringify(DEFAULT_PERMS)),activity,
  settings:{reminders:{enabled:true,days:[60,30,15,7],sms:true,whatsapp:true,email:true},fees:Object.fromEntries(Object.entries(LIC_TYPES).map(([k,v])=>[k,v[2]])),transferFee:10000,medicalMonths:12,licSeq},
  reminders:[],votes:{},records:[]}}

/* rank rows of one event: valid marks sorted, ties share a place, non-finishers unranked */
function rankRows(rows,code){const ok=rows.filter(r=>r.st==='OK'&&r.perf!=null).sort((a,b)=>lowerBetter(code)?a.perf-b.perf:b.perf-a.perf);ok.forEach((r,i)=>{r.place=i&&ok[i-1].perf===r.perf?ok[i-1].place:i+1});rows.filter(r=>r.st!=='OK'||r.perf==null).forEach(r=>r.place=null);return rows}
