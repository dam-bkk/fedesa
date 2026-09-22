/* Généré depuis v3/index.html — ne pas éditer à la main, relancer le convertisseur. */
export default function Actus() {
  return (
<>
<section  id="actus">
  <div  className="wrap">
    <div  className="sec-head">
      <div><div  className="eyebrow">Ce qui vient de se passer</div><h2  style={{"marginTop":"14px"}}>À la une</h2></div>
      <div  className="tabs" id="newsChips" role="group" aria-label="Filtrer les actualités">
        <button  className="tab" type="button" data-f="all" aria-selected="true">Tout</button>
        <button  className="tab" type="button" data-f="compet" aria-selected="false">Compétition</button>
        <button  className="tab" type="button" data-f="selection" aria-selected="false">Sélection</button>
        <button  className="tab" type="button" data-f="formation" aria-selected="false">Formation</button>
      </div>
    </div>

    <div  className="news-grid">
      <a  href="/" className="lead" data-cat="compet">
        <div  className="lead-media">
          <span  className="catchip red">Record national</span>
          <img  src="/img/news-1.avif" alt="Finale du 100 m au stade Léopold Sédar Senghor" width="1200" height="800" loading="lazy" />
        </div>
        <div  className="lead-body">
          <div  className="dateline">18 septembre 2026 · Dakar</div>
          <h3>Ibrahima Ndiaye efface le record national du 100 m en 10&quot;23</h3>
          <p>Vent légal (+1,2 m/s), photo-finish à trois millièmes : le sprinteur de l'ASC Dakar Université signe la
            meilleure performance sénégalaise de tous les temps et valide d'entrée les minima pour Dakar 2027.</p>
        </div>
      </a>

      <div  className="rows">
        <a  href="/" className="row" data-cat="formation">
          <div  className="row-img"><img  src="/img/news-2.avif" alt="Séance de détection sur piste" width="800" height="600" loading="lazy" /></div>
          <div><span  className="catchip gold">Formation</span>
            <h4>Plan national de détection : 14 centres régionaux ouverts en octobre</h4>
            <div  className="dateline" style={{"marginTop":"7px"}}>12 septembre 2026</div></div>
        </a>
        <a  href="/" className="row" data-cat="selection">
          <div  className="row-img"><img  src="/img/news-3.avif" alt="Supporters dans les tribunes" width="800" height="600" loading="lazy" /></div>
          <div><span  className="catchip">Sélection</span>
            <h4>Amy Diallo qualifiée pour la finale du Continental Tour à Rabat</h4>
            <div  className="dateline" style={{"marginTop":"7px"}}>09 septembre 2026</div></div>
        </a>
        <a  href="/" className="row" data-cat="compet">
          <div  className="row-img"><img  src="/img/news-4.avif" alt="Coureurs à l'entraînement au crépuscule" width="800" height="600" loading="lazy" /></div>
          <div><span  className="catchip ink">Compétition</span>
            <h4>Le cross national revient à Thiès le 6 décembre, 1 200 engagés attendus</h4>
            <div  className="dateline" style={{"marginTop":"7px"}}>02 septembre 2026</div></div>
        </a>
        <a  href="/" className="row" data-cat="formation">
          <div  className="row-img"><img  src="/img/blocks.avif" alt="Départ en starting-blocks" width="1200" height="800" loading="lazy" /></div>
          <div><span  className="catchip gold">Officiels techniques</span>
            <h4>Homologation des juges-arbitres : inscriptions jusqu'au 15 octobre</h4>
            <div  className="dateline" style={{"marginTop":"7px"}}>28 août 2026</div></div>
        </a>
        <a  href="/" className="row" data-cat="compet">
          <div  className="row-img"><img  src="/img/clubs.avif" alt="Piste d'un stade régional" width="900" height="700" loading="lazy" /></div>
          <div><span  className="catchip">Ligues</span>
            <h4>Les quatorze ligues réunies à Thiès pour caler le calendrier 26/27</h4>
            <div  className="dateline" style={{"marginTop":"7px"}}>22 août 2026</div></div>
        </a>
      </div>
    </div>
  </div>
</section>
</>
  );
}
