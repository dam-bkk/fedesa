
(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s);};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};

  var mega=$('#mega'), megaBtn=$('#megaBtn'), megaClose=$('#megaClose');
  function openMega(){mega.hidden=false;megaBtn.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';}
  function closeMega(){mega.hidden=true;megaBtn.setAttribute('aria-expanded','false');document.body.style.overflow='';}
  megaBtn.addEventListener('click',function(){mega.hidden?openMega():closeMega();});
  megaClose.addEventListener('click',closeMega);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!mega.hidden)closeMega();});
  $$('#mega a').forEach(function(a){a.addEventListener('click',closeMega);});

  ['#mq1','#mq2'].forEach(function(s){var t=$(s); if(t) t.innerHTML=t.innerHTML+t.innerHTML;});

  var target=new Date('2027-05-12T09:00:00Z').getTime(), cd=$('#cd');
  function pad(n){return (n<10?'0':'')+n;}
  function tick(){
    var left=Math.max(0,target-Date.now()), s=Math.floor(left/1000);
    $('[data-u="d"]',cd).textContent=Math.floor(s/86400);
    $('[data-u="h"]',cd).textContent=pad(Math.floor(s%86400/3600));
    $('[data-u="m"]',cd).textContent=pad(Math.floor(s%3600/60));
    $('[data-u="s"]',cd).textContent=pad(s%60);
  }
  tick(); setInterval(tick,1000);

  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    $$('.hstat-n[data-count]').forEach(function(el){
      var end=parseInt(el.getAttribute('data-count'),10),t0=null,dur=1100;
      function step(ts){
        if(!t0)t0=ts;
        var p=Math.min(1,(ts-t0)/dur), e=1-Math.pow(1-p,3);
        el.textContent=Math.round(end*e).toLocaleString('fr-FR').replace(/ /g,' ');
        if(p<1)requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  var chips=$$('#newsChips .tab');
  chips.forEach(function(c){c.addEventListener('click',function(){
    chips.forEach(function(o){o.setAttribute('aria-selected',o===c?'true':'false');});
    var f=c.getAttribute('data-f');
    $$('[data-cat]').forEach(function(i){i.hidden=!(f==='all'||i.getAttribute('data-cat')===f);});
  });});

  var rTabs=$$('#resTabs .tab');
  rTabs.forEach(function(t){t.addEventListener('click',function(){
    rTabs.forEach(function(o){o.setAttribute('aria-selected',o===t?'true':'false');});
    ['r1','r2','r3'].forEach(function(id){$('#'+id).hidden=(id!==t.getAttribute('data-r'));});
  });});

  var search=$('#recSearch'), rows=$$('#recTable tbody tr'), count=$('#recCount'), empty=$('#recEmpty');
  function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');}
  search.addEventListener('input',function(){
    var q=norm(search.value.trim()), shown=0;
    rows.forEach(function(r){var hit=!q||norm(r.textContent).indexOf(q)>-1; r.hidden=!hit; if(hit)shown++;});
    count.textContent=shown+(shown>1?' records affichés':' record affiché');
    empty.hidden=shown!==0;
  });

  $$('#faqList .faq-q').forEach(function(btn){btn.addEventListener('click',function(){
    var item=btn.parentElement, open=item.classList.contains('open');
    $$('#faqList .faq-i').forEach(function(i){i.classList.remove('open');$('.faq-q',i).setAttribute('aria-expanded','false');});
    if(!open){item.classList.add('open');btn.setAttribute('aria-expanded','true');}
  });});

  $('#findForm').addEventListener('submit',function(e){
    e.preventDefault();
    var b=$('#findForm button[type="submit"]'), city=$('#f-city').value.trim()||'votre région';
    b.textContent='Recherche : '+city+'…';
    setTimeout(function(){b.textContent='Chercher';},2200);
  });


  var KEY='fedesa.v3.feedback';
  var panel=$('#fbPanel'), fbBtn=$('#fbBtn'), list=$('#fbList'), badge=$('#fbCount');
  function read(){try{return JSON.parse(localStorage.getItem(KEY))||[];}catch(e){return [];}}
  function write(n){try{localStorage.setItem(KEY,JSON.stringify(n));}catch(e){}}
  function render(){
    var notes=read(); badge.textContent=notes.length; list.innerHTML='';
    notes.slice().reverse().forEach(function(n){
      var d=document.createElement('div'); d.className='fb-note';
      d.innerHTML='<b></b><span class="mono" style="font-size:10px;color:var(--muted)"></span><div style="margin-top:6px"></div>';
      d.children[0].textContent=n.type+' · '+n.section;
      d.children[1].textContent='  '+new Date(n.at).toLocaleString('fr-FR');
      d.children[2].textContent=n.text;
      list.appendChild(d);
    });
  }
  fbBtn.addEventListener('click',function(){
    var open=panel.hidden; panel.hidden=!open; fbBtn.setAttribute('aria-expanded',open?'true':'false');
  });
  $('#fbSave').addEventListener('click',function(){
    var t=$('#fb-msg').value.trim(); if(!t){$('#fb-msg').focus();return;}
    var n=read(); n.push({type:$('#fb-type').value,section:$('#fb-sec').value,text:t,at:Date.now()});
    write(n); $('#fb-msg').value=''; render();
  });
  $('#fbExport').addEventListener('click',function(){
    var out=JSON.stringify({page:'FEDESA v3',exported:new Date().toISOString(),notes:read()},null,2);
    if(navigator.clipboard) navigator.clipboard.writeText(out);
    var b=$('#fbExport'); b.textContent='Copié'; setTimeout(function(){b.textContent='Export JSON';},1600);
  });
  $('#fbClear').addEventListener('click',function(){write([]);render();});
  render();

  if('IntersectionObserver' in window){
    var ioI=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('in');ioI.unobserve(e.target);}});},{rootMargin:'-10% 0px -10% 0px'});
    $$('.illus').forEach(function(el){ioI.observe(el);});
  } else { $$('.illus').forEach(function(el){el.classList.add('in');}); }

  /* ── fiches d'épreuve ────────────────────────────────────────────── */
  var EP=[
   {t:'Sprint',s:'100 m · 200 m · 400 m',
    tech:['Couloirs de 1,22 m, starting-blocks obligatoires jusqu’au 400 m.',
          'Vent mesuré sur 100 et 200 m : au-delà de +2,0 m/s, la performance n’est pas homologable.',
          'Temps de réaction inférieur à 0,100 s = faux départ.'],
    wr:[['H','100 m — Usain Bolt','Berlin 2009','9″58'],['F','100 m — Florence Griffith-Joyner','Indianapolis 1988','10″49'],
        ['H','400 m — Wayde van Niekerk','Rio 2016','43″03'],['F','400 m — Marita Koch','Canberra 1985','47″60']],
    sen:[['F','400 m — Amy Mbacké Thiam','Edmonton 2001','49″86'],['H','100 m','à renseigner','—']]},
   {t:'Haies',s:'100 m H · 110 m H · 400 m H',
    tech:['110 m haies : 10 obstacles de 1,067 m, espacés de 9,14 m.',
          '100 m haies femmes : 10 obstacles de 0,838 m, espacés de 8,50 m.',
          '400 m haies : 10 obstacles, 35 m d’intervalle, hauteur 0,914 m (H) et 0,762 m (F).'],
    wr:[['H','110 m H — Aries Merritt','Bruxelles 2012','12″80'],['F','100 m H — Tobi Amusan','Eugene 2022','12″12'],
        ['H','400 m H — Karsten Warholm','Tokyo 2021','45″94'],['F','400 m H — Sydney McLaughlin-Levrone','Eugene 2024','50″37']],
    sen:[['H','400 m H — Amadou Dia Ba','Séoul 1988','47″23'],['F','100 m H','à renseigner','—']]},
   {t:'Demi-fond',s:'800 m · 1 500 m',
    tech:['800 m : départ en couloirs, rabattement autorisé après 100 m.',
          '1 500 m : départ groupé sur ligne courbe, 3 tours ¾.',
          'Aucune limite de vent : les performances sont homologables par tout temps.'],
    wr:[['H','800 m — David Rudisha','Londres 2012','1’40″91'],['F','800 m — Jarmila Kratochvílová','Munich 1983','1’53″28'],
        ['H','1 500 m — Hicham El Guerrouj','Rome 1998','3’26″00'],['F','1 500 m — Faith Kipyegon','Paris 2024','3’49″04']],
    sen:[['H','800 m','à renseigner','—'],['F','1 500 m','à renseigner','—']]},
   {t:'Fond',s:'5 000 m · 10 000 m',
    tech:['5 000 m : 12 tours et demi. 10 000 m : 25 tours.',
          'Ravitaillement en eau autorisé sur 10 000 m au-delà de certaines conditions de chaleur.',
          'Départ groupé, classement au photo-finish.'],
    wr:[['H','5 000 m — Joshua Cheptegei','Monaco 2020','12’35″36'],['F','5 000 m — Gudaf Tsegay','Eugene 2023','14’00″21'],
        ['H','10 000 m — Joshua Cheptegei','Valence 2020','26’11″00'],['F','10 000 m — Letesenbet Gidey','Hengelo 2021','28’54″14']],
    sen:[['H','5 000 m','à renseigner','—'],['F','10 000 m','à renseigner','—']]},
   {t:'Marche athlétique',s:'10 km · 20 km',
    tech:['Contact permanent avec le sol à l’œil nu : jamais de phase de suspension visible.',
          'Jambe avant tendue du contact au passage à la verticale.',
          'Trois cartons rouges de juges différents : pénalité en zone d’attente, puis disqualification.'],
    wr:[['H','20 km — Yusuke Suzuki','Nomi 2015','1 h 16’36'],['F','20 km — Yang Jiayu','Huangshan 2021','1 h 23’49']],
    sen:[['H','20 km','à renseigner','—'],['F','20 km','à renseigner','—']]},
   {t:'Cross-country',s:'Championnats nationaux d’hiver',
    tech:['Parcours naturel, boucles de 1 500 à 2 000 m, terrain varié.',
          'Distances usuelles : 10 km hommes, 8 km femmes, réduites pour les catégories jeunes.',
          'Classement par équipes : addition des places des quatre premiers coureurs du club.'],
    wr:[['—','Aucun record homologué','les parcours varient d’une édition à l’autre','—']],
    sen:[['—','Titre national','décerné chaque hiver','—']]},
   {t:'Sauts horizontaux',s:'Longueur · triple saut',
    tech:['Planche d’appel de 20 cm, mesure perpendiculaire à la trace la plus proche.',
          'Triple saut : cloche-pied, foulée bondissante, saut — dans cet ordre.',
          'Six essais, les huit meilleurs disputent les trois derniers.'],
    wr:[['H','Longueur — Mike Powell','Tokyo 1991','8,95 m'],['F','Longueur — Galina Tchistiakova','Leningrad 1988','7,52 m'],
        ['H','Triple — Jonathan Edwards','Göteborg 1995','18,29 m'],['F','Triple — Yulimar Rojas','Belgrade 2022','15,74 m']],
    sen:[['H','Triple saut — Ndiss Kaba Badji','2010','17,06 m'],['F','Longueur','à renseigner','—']]},
   {t:'Sauts verticaux',s:'Hauteur · perche',
    tech:['Trois essais par hauteur ; trois échecs consécutifs éliminent.',
          'Hauteur : franchissement dorsal, appel d’un seul pied.',
          'Perche : la perche peut être de n’importe quelle longueur et matériau.'],
    wr:[['H','Hauteur — Javier Sotomayor','Salamanque 1993','2,45 m'],['F','Hauteur — Yaroslava Mahuchikh','Paris 2024','2,10 m'],
        ['H','Perche — Armand Duplantis','record régulièrement amélioré','6,30 m +'],['F','Perche — Yelena Isinbayeva','Zurich 2009','5,06 m']],
    sen:[['H','Hauteur','à renseigner','—'],['F','Perche','à renseigner','—']]},
   {t:'Lancers',s:'Poids · disque · marteau',
    tech:['Aire circulaire : 2,135 m au poids, 2,50 m au disque et au marteau.',
          'Secteur de chute de 34,92°, mesure au centimètre inférieur.',
          'Engins seniors : poids 7,26 kg (H) et 4 kg (F) ; disque 2 kg et 1 kg.'],
    wr:[['H','Poids — Ryan Crouser','Los Angeles 2023','23,56 m'],['F','Poids — Natalya Lisovskaya','Moscou 1987','22,63 m'],
        ['H','Disque — Mykolas Alekna','Ramona 2024','74,35 m'],['F','Marteau — Anita Włodarczyk','Varsovie 2016','82,98 m']],
    sen:[['H','Poids','à renseigner','—'],['F','Disque','à renseigner','—']]},
   {t:'Javelot',s:'Javelot',
    tech:['Élan de 30 m minimum, lancer par-dessus l’épaule.',
          'La pointe doit toucher le sol avant toute autre partie de l’engin.',
          'Engins seniors : 800 g (H) et 600 g (F).'],
    wr:[['H','Jan Železný','Iéna 1996','98,48 m'],['F','Barbora Špotáková','Stuttgart 2008','72,28 m']],
    sen:[['H','Javelot','à renseigner','—'],['F','Javelot','à renseigner','—']]},
   {t:'Relais',s:'4 × 100 m · 4 × 400 m',
    tech:['Zone de transmission de 30 m ; le témoin, pas le coureur, doit y être transmis.',
          'Témoin creux de 28 à 30 cm, 12 cm de circonférence.',
          '4 × 400 m : premier relais en couloirs, rabattement ensuite.'],
    wr:[['H','4 × 100 m — Jamaïque','Londres 2012','36″84'],['F','4 × 100 m — États-Unis','Londres 2012','40″82'],
        ['H','4 × 400 m — États-Unis','Stuttgart 1993','2’54″29'],['F','4 × 400 m — URSS','Séoul 1988','3’15″17']],
    sen:[['H','4 × 100 m','à renseigner','—'],['F','4 × 400 m','à renseigner','—']]},
   {t:'Marathon',s:'42,195 km · semi-marathon',
    tech:['Parcours mesuré et certifié ; dénivelé négatif limité pour l’homologation.',
          'Ravitaillements officiels tous les 5 km.',
          'Au Sénégal : le Marathon Eiffage de Dakar, avec le soutien technique de la fédération.'],
    wr:[['H','Kelvin Kiptum','Chicago 2023','2 h 00’35'],['F','Ruth Chepngetich','Chicago 2024','2 h 09’56']],
    sen:[['H','Marathon','à renseigner','—'],['F','Marathon','à renseigner','—']]},
   {t:'Épreuves combinées',s:'Décathlon · heptathlon',
    tech:['Décathlon : 10 épreuves sur deux jours, réservé aux hommes.',
          'Heptathlon : 7 épreuves sur deux jours, réservé aux femmes.',
          'Barème de points fixé par World Athletics, identique dans le monde entier.'],
    wr:[['H','Décathlon — Kevin Mayer','Talence 2018','9 126 pts'],['F','Heptathlon — Jackie Joyner-Kersee','Séoul 1988','7 291 pts']],
    sen:[['H','Décathlon','à renseigner','—'],['F','Heptathlon','à renseigner','—']]},
   {t:'Para-athlétisme',s:'Piste · concours',
    tech:['Classification fonctionnelle : T pour la piste, F pour les concours.',
          'T11 à T13 : déficience visuelle, guide autorisé en T11.',
          'T51 à T54 : athlètes en fauteuil ; T61 à T64 : amputations et prothèses.'],
    wr:[['—','Records par classe','établis séparément pour chaque classification','—']],
    sen:[['—','Sélection para','à renseigner','—']]}
  ];
  var epw=$('#epw'), epi=0;
  function epRows(rows){
    return rows.map(function(r){
      return '<div class="rec"><span class="cat">'+r[0]+'</span><span class="who">'+r[1]+
             '<span>'+r[2]+'</span></span><span class="val">'+r[3]+'</span></div>';
    }).join('');
  }
  function epRender(i){
    var e=EP[i]; epi=i;
    var tile=$$('#epreuves .bx')[i]; var sv=tile&&tile.querySelector('svg');
    $('#epmIco').innerHTML=sv?sv.outerHTML:'';
    $('#epmN').textContent='Épreuve '+(i+1<10?'0':'')+(i+1)+' sur '+EP.length;
    $('#epmT').textContent=e.t;
    $('#epmS').textContent=e.s;
    $('#epmTech').innerHTML=e.tech.map(function(t){return '<li>'+t+'</li>';}).join('');
    $('#epmWR').innerHTML=epRows(e.wr);
    $('#epmSEN').innerHTML=epRows(e.sen.map(function(r){return r;}));
    $$('#epmSEN .rec').forEach(function(el){el.classList.add('sen');});
  }
  function epOpen(i){ epRender(i); epw.hidden=false; document.body.style.overflow='hidden'; }
  function epClose(){ epw.hidden=true; document.body.style.overflow=''; }
  function epGo(d){ epRender((epi+d+EP.length)%EP.length); }
  $$('#epreuves .bx').forEach(function(b){
    b.addEventListener('click',function(ev){ ev.preventDefault(); epOpen(+b.getAttribute('data-ep')||0); });
  });
  $('#epX').addEventListener('click',epClose);
  $('#epPrev').addEventListener('click',function(){epGo(-1);});
  $('#epNext').addEventListener('click',function(){epGo(1);});
  epw.addEventListener('click',function(ev){ if(ev.target===epw) epClose(); });
  document.addEventListener('keydown',function(ev){
    if(epw.hidden) return;
    if(ev.key==='Escape'){epClose();}
    else if(ev.key==='ArrowLeft'){epGo(-1);}
    else if(ev.key==='ArrowRight'){epGo(1);}
  });

})();
