/* Généré depuis v3/index.html — ne pas éditer à la main, relancer le convertisseur. */
export default function Athlete({ t }: { t: (s: string) => string }) {
  return (
<>
<section  className="spot" id="athlete">
  <div  className="wrap">
    <div  className="spot-in">
      <figure  className="spot-fig" style={{"margin":"0"}}>
        <span  className="spot-no" aria-hidden="true">01</span>
        <div  className="oval"><img  src="/img/athlete.avif" alt={t("Ibrahima Ndiaye à l'entraînement")} width="1100" height="1300" loading="lazy" /></div>
      </figure>
      <div>
        <div  className="eyebrow onvolt">{t("Athlète du mois · septembre")}</div>
        <h2  style={{"marginTop":"14px"}}>{t("Ibrahima")}<br />{t("Ndiaye")}</h2>
        <div  className="spot-disc">{t("Sprint — 100 m / 200 m · ASC Dakar Université")}</div>
        <div  className="spot-stats">
          <div  className="sstat"><div  className="sstat-v">{t("10\"23")}</div><div  className="sstat-k">{t("Record 100 m")}</div></div>
          <div  className="sstat"><div  className="sstat-v">{t("20\"41")}</div><div  className="sstat-k">{t("Record 200 m")}</div></div>
          <div  className="sstat"><div  className="sstat-v">{t("4×")}</div><div  className="sstat-k">{t("Sélections A")}</div></div>
          <div  className="sstat"><div  className="sstat-v">24</div><div  className="sstat-k">{t("Ans")}</div></div>
        </div>
        <div  className="spark">
          <div  className="spark-h"><span>{t("Progression 100 m — saison 2026")}</span><span  style={{"color":"var(--volt)"}}>{t("−0,41 s")}</span></div>
          <svg  viewBox="0 0 520 110" width="100%" height="110" role="img" aria-label={t("Progression du chrono sur 100 m : de 10,64 s en février à 10,23 s en septembre 2026")}>
            <line  x1="0" y1="92" x2="520" y2="92" stroke="rgba(255,255,255,.18)" strokeWidth="1" />
            <line  x1="0" y1="50" x2="520" y2="50" stroke="rgba(255,255,255,.1)" strokeWidth="1" />
            <line  x1="0" y1="12" x2="520" y2="12" stroke="rgba(255,255,255,.1)" strokeWidth="1" />
            <polyline  points="22,20 118,36 214,31 310,57 406,68 498,88" fill="none" stroke="#00E05A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle  cx="22" cy="20" r="4" fill="#0B1410" stroke="#00E05A" strokeWidth="2.5" />
            <circle  cx="118" cy="36" r="4" fill="#0B1410" stroke="#00E05A" strokeWidth="2.5" />
            <circle  cx="214" cy="31" r="4" fill="#0B1410" stroke="#00E05A" strokeWidth="2.5" />
            <circle  cx="310" cy="57" r="4" fill="#0B1410" stroke="#00E05A" strokeWidth="2.5" />
            <circle  cx="406" cy="68" r="4" fill="#0B1410" stroke="#00E05A" strokeWidth="2.5" />
            <circle  cx="498" cy="88" r="6.5" fill="#FFD100" stroke="#0B1410" strokeWidth="2.5" />
            <text  x="22" y="108" fill="#8FA396" fontSize="10" fontFamily="monospace">10,64</text>
            <text  x="498" y="108" fill="#fff" fontSize="10" fontFamily="monospace" textAnchor="end">10,23</text>
          </svg>
        </div>
        <p  className="spot-q">{t("« Courir pour le Sénégal, c'est courir pour les gamins de Pikine qui s'entraînent pieds nus sur le sable. Le record, il est à eux autant qu'à moi. »")}</p>
        <div  className="spot-cta">
          <a  href="/" className="btn btn-ink">{t("Profil complet")}</a>
          <a  href="/" className="btn btn-oink">{t("Tous les athlètes")}</a>
        </div>
      </div>
    </div>
  </div>
</section>
</>
  );
}
