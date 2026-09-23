/* Généré depuis v3/index.html — ne pas éditer à la main, relancer le convertisseur. */
export default function Galerie({ t }: { t: (s: string) => string }) {
  return (
<>
<section  id="galerie">
  <div  className="wrap">
    <div  className="sec-head">
      <div><div  className="eyebrow">{t("Médiathèque")}</div><h2  style={{"marginTop":"14px"}}>{t("Ce que la piste")}<br />{t("a retenu")}</h2></div>
      <a  href="/" className="sec-link">{t("Toutes les galeries")}</a>
    </div>
    <div  className="gal">
      <a  href="/" className="g-item"><span  className="g-count">{t("Photos · 128")}</span>
        <img  src="/img/hero-strip.avif" alt={t("Départ d'une finale du 100 m")} width="1600" height="760" loading="lazy" />
        <span  className="g-ov"><span  className="g-date">18.09.2026</span><span  className="g-cap">{t("Championnats nationaux 2026 — finales, jour 3")}</span></span></a>
      <a  href="/" className="g-item"><span  className="g-count">{t("Photos · 42")}</span>
        <img  src="/img/news-3.avif" alt={t("Public dans les tribunes")} width="800" height="600" loading="lazy" />
        <span  className="g-ov"><span  className="g-date">14.09.2026</span><span  className="g-cap">{t("Le public de Dakar")}</span></span></a>
      <a  href="/" className="g-item"><span  className="g-count">{t("Photos · 87")}</span>
        <img  src="/img/blocks.avif" alt={t("Starting-blocks")} width="1200" height="800" loading="lazy" />
        <span  className="g-ov"><span  className="g-date">12.09.2026</span><span  className="g-cap">{t("Détection régionale, Thiès")}</span></span></a>
      <a  href="/" className="g-item"><span  className="g-count">{t("Photos · 25")}</span>
        <img  src="/img/band.avif" alt={t("Coureurs au crépuscule")} width="1600" height="700" loading="lazy" />
        <span  className="g-ov"><span  className="g-date">06.09.2026</span><span  className="g-cap">{t("Stage des espoirs, CNEPS")}</span></span></a>
      <a  href="/" className="g-item"><span  className="g-count">{t("Photos · 61")}</span>
        <img  src="/img/clubs.avif" alt={t("Piste d'un stade régional")} width="900" height="700" loading="lazy" />
        <span  className="g-ov"><span  className="g-date">30.08.2026</span><span  className="g-cap">{t("Meeting de Saint-Louis")}</span></span></a>
    </div>
  </div>
</section>
</>
  );
}
