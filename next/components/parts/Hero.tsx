/* Généré depuis v3/index.html — ne pas éditer à la main, relancer le convertisseur. */
export default function Hero({ t, stats }: { t: (s: string) => string; stats: { licensees: number; clubs: number; ligues: number; results: number } }) {
  return (
<>
<section  className="hero">
  <img  className="hero-bg" src="/img/hero-wide.avif" width="2200" height="1228" alt={t("Trois sprinteuses sénégalaises dans les starting-blocks")} />
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
        <img className="hero-mimg" src="/img/hero-start.avif" width="1376" height="768" alt="" aria-hidden="true" />
      </div>

      <figure  className="hero-figure" style={{"margin":"0"}} hidden>
        <div  className="badge-spin" aria-hidden="true">
          <svg  viewBox="0 0 124 124" width="112" height="112">
            <defs><path  id="bcircle" d="M62,62 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
            <text  fontFamily="'JetBrains Mono',monospace" fontSize="10.5" letterSpacing="2.6" fill="#0B1410">
              <textPath  href="#bcircle" startOffset="0">{t("CHAMPIONNATS D'AFRIQUE · DAKAR 2027 · CAA ·")} </textPath>
            </text>
          </svg>
          <span  className="hub"><svg  viewBox="0 0 184 163" width="24" height="21" aria-hidden="true"><g  transform="translate(0,163) scale(0.1,-0.1)" fill="#00E05A"><path  d="M610 1240 l0 -120 190 0 c105 0 190 -3 190 -8 0 -4 -85 -93 -190 -197 l-190 -190 -78 78 -77 77 -168 0 c-92 0 -167 -2 -167 -4 0 -6 483 -486 490 -486 3 0 61 56 130 125 69 69 129 125 135 125 6 0 91 -81 190 -180 l180 -180 170 0 170 0 -270 270 -270 270 270 270 270 270 -488 0 -487 0 0 -120z" /></g></svg></span>
        </div>
        <div  className="frame"><img  src="/img/hero-start.avif" width="1376" height="768" alt={t("Trois sprinteuses sénégalaises dans les starting-blocks")} /></div>
      </figure>
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
