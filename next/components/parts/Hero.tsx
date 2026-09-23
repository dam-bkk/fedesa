/* Généré depuis v3/index.html — ne pas éditer à la main, relancer le convertisseur. */
export default function Hero({ t, stats }: { t: (s: string) => string; stats: { licensees: number; clubs: number; ligues: number; results: number } }) {
  return (
<>
<section  className="hero">
  <img  className="hero-bg" fetchPriority="high" decoding="async" src="/img/hero-wide.avif" width="2200" height="1228" alt={t("Trois sprinteuses sénégalaises dans les starting-blocks")} />
  <div  className="hero-scrim" aria-hidden="true"></div>
  <span  className="hero-arc a1" aria-hidden="true"></span>
  <span  className="hero-arc a2" aria-hidden="true"></span>
  <span  className="hero-arc a3" aria-hidden="true"></span>
  <div  className="hero-grain" aria-hidden="true"></div>
  <div  className="wrap">
    <div  className="hero-in">
      <div  className="hero-copy">
        <span  className="hero-kick"><span  className="flagbar"><i  style={{"background":"#00853F"}}></i><i  style={{"background":"#FDEF42"}}></i><i  style={{"background":"#E31B23"}}></i></span>{t("Saison 26/27 · ouverte")}</span>
        <h1  className="hero-h1">{t("Courir")}<br className="br-d" /> {t("pour")}<br className="br-m" /> {t("le")}<br className="br-d" /> <span  className="ol">{t("Sénégal")}</span></h1>
        <p  className="hero-sub">{t("Une licence. Un club. Un dossard. Tout part d'ici — de la piste de quartier jusqu'à la ligne d'arrivée de Dakar 2027.")}</p>
        <div  className="hero-btns">
          <a  href="/licence" className="btn btn-ink">{t("Licence")}</a>
          <a  href="/competitions" className="btn btn-oink">{t("Calendrier 26/27")}</a>
        </div>
        <img className="hero-mimg" loading="lazy" decoding="async" src="/img/hero-start.avif" width="1376" height="768" alt="" aria-hidden="true" />
      </div>

      
    </div>

    <div  className="hero-strip">
      <div  className="hs-l"><span  className="dot" style={{"color":"var(--volt)"}}></span>{t("Prochain objectif majeur — Championnats d'Afrique, Dakar · 12–16 mai 2027")}</div>
      <div  className="hs-cd" id="cd">
        <span  className="v" data-u="d">—</span><span  className="u">{t("j")}</span>
        <span  className="v" data-u="h">—</span><span  className="u">{t("h")}</span>
        <span  className="v" data-u="m">—</span><span  className="u">{t("min")}</span>
        <span  className="v" data-u="s">—</span><span  className="u">{t("s")}</span>
      </div>
    </div>

    <div  className="hero-stats">
      <div  className="hstat"><div className="hstat-n" data-count={stats.licensees}>{stats.licensees.toLocaleString("fr-FR")}</div><div  className="hstat-l">{t("Licenciés")}</div></div>
      <div  className="hstat"><div className="hstat-n" data-count={stats.clubs}>{stats.clubs}</div><div  className="hstat-l">{t("Clubs affiliés")}</div></div>
      <div  className="hstat"><div className="hstat-n" data-count={stats.ligues}>{stats.ligues}</div><div  className="hstat-l">{t("Ligues régionales")}</div></div>
      <div  className="hstat"><div className="hstat-n" data-count={stats.results}>{stats.results.toLocaleString("fr-FR")}</div><div  className="hstat-l">{t("Performances publiées")}</div></div>
    </div>
  </div>
</section>
</>
  );
}
