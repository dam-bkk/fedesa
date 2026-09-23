/* Généré depuis v3/index.html — ne pas éditer à la main, relancer le convertisseur. */
export default function Footer({ t }: { t: (s: string) => string }) {
  return (
<>
<footer>
  <div  className="wrap">
    <div  className="f-top">
      <div>
        <div  className="brand" style={{"color":"#fff"}}>
          <span  className="brand-mark" style={{"background":"var(--volt)"}}><svg  viewBox="0 0 184 163" width="26" height="23" aria-hidden="true"><g  transform="translate(0,163) scale(0.1,-0.1)" fill="#0B1410"><path  d="M610 1240 l0 -120 190 0 c105 0 190 -3 190 -8 0 -4 -85 -93 -190 -197 l-190 -190 -78 78 -77 77 -168 0 c-92 0 -167 -2 -167 -4 0 -6 483 -486 490 -486 3 0 61 56 130 125 69 69 129 125 135 125 6 0 91 -81 190 -180 l180 -180 170 0 170 0 -270 270 -270 270 270 270 270 270 -488 0 -487 0 0 -120z" /></g></svg></span>
          <span><span  className="brand-name">{t("FEDESA")}</span><span  className="brand-sub" style={{"display":"block","color":"var(--smoke)"}}>{t("Athlétisme Sénégal")}</span></span>
        </div>
        <p  className="f-about">{t("Fédération Sénégalaise d'Athlétisme — Stade Iba Mar Diop, rue M'baye Worre, Dakar. Membre de World Athletics et de la Confédération Africaine d'Athlétisme.")}</p>
        <div  className="f-soc">
          <a  href="/" aria-label={t("Facebook")}><svg  width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path  d="M9.5 16V9h2.3l.35-2.7H9.5V4.6c0-.78.22-1.31 1.34-1.31h1.43V.87A19 19 0 0 0 10.18.76c-2.06 0-3.48 1.26-3.48 3.58V6.3H4.4V9h2.3v7h2.8Z" /></svg></a>
          <a  href="/" aria-label="X"><svg  width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path  d="M12.3 1h2.3L9.6 6.7 15.5 15h-4.6L7.3 10.3 3.2 15H.9l5.4-6.2L.6 1h4.7l3.3 4.3L12.3 1Zm-.8 12.6h1.3L4.6 2.3H3.2l8.3 11.3Z" /></svg></a>
          <a  href="/" aria-label={t("Instagram")}><svg  width="15" height="15" viewBox="0 0 16 16" fill="none"><rect  x="1.5" y="1.5" width="13" height="13" rx="4" stroke="currentColor" strokeWidth="1.6" /><circle  cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" /><circle  cx="12" cy="4" r="1" fill="currentColor" /></svg></a>
          <a  href="/" aria-label={t("YouTube")}><svg  width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path  d="M15.3 4.8a1.9 1.9 0 0 0-1.3-1.4C12.8 3 8 3 8 3s-4.8 0-6 .4A1.9 1.9 0 0 0 .7 4.8C.4 6 .4 8 .4 8s0 2 .3 3.2a1.9 1.9 0 0 0 1.3 1.4c1.2.4 6 .4 6 .4s4.8 0 6-.4a1.9 1.9 0 0 0 1.3-1.4c.3-1.2.3-3.2.3-3.2s0-2-.3-3.2ZM6.5 10.4V5.6L10.6 8l-4.1 2.4Z" /></svg></a>
        </div>
      </div>
      <div><h2>{t("Compétitions")}</h2><div  className="f-links"><a  href="/competitions">{t("Calendrier fédéral")}</a><a  href="/resultats">{t("Résultats")}</a>
        <a  href="/records">{t("Records nationaux")}</a><a  href="/">{t("Minima de sélection")}</a><a  href="/">{t("Règlements sportifs")}</a></div></div>
      <div><h2>{t("Pratiquer")}</h2><div  className="f-links"><a  href="/clubs">{t("Trouver un club")}</a><a  href="/licence">{t("Prendre une licence")}</a>
        <a  href="/">{t("Athlétisme scolaire")}</a><a  href="/">{t("Para-athlétisme")}</a><a  href="/">{t("Formations")}</a></div></div>
      <div><h2>{t("La fédération")}</h2><div  className="f-links"><a  href="/federation">{t("Comité directeur")}</a><a  href="/">{t("Ligues régionales")}</a>
        <a  href="/">{t("Commissions")}</a><a  href="/federation#partenaires">{t("Partenaires")}</a><a  href="/medias">{t("Médiathèque")}</a></div></div>
    </div>
    <div  className="f-bot">
      <div  className="f-flag"><i  style={{"background":"#00853F"}}></i><i  style={{"background":"#FDEF42"}}></i><i  style={{"background":"#E31B23"}}></i>
        <span  style={{"marginLeft":"8px"}}>{t("© 2026 FEDESA · maquette de démonstration — contenus illustratifs")}</span></div>
      <div  style={{"display":"flex","gap":"18px"}}><a  href="/">{t("Mentions légales")}</a><a  href="/">{t("Données personnelles")}</a><a  href="/">{t("Contact")}</a></div>
    </div>
  </div>
</footer>
</>
  );
}
