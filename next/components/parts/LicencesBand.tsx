/* Généré depuis v3/index.html — ne pas éditer à la main, relancer le convertisseur. */
export default function LicencesBand({ t }: { t: (s: string) => string }) {
  return (
<>
<section  className="lic has-illus" id="licences">
  <div  className="illus" aria-hidden="true">
    <svg  viewBox="0 0 1400 400" preserveAspectRatio="none" style={{"left":"0","top":"0","width":"100%","height":"100%"}}>
      <path  d="M60 340 L200 200 L340 340" stroke="rgba(11,20,16,.1)" strokeWidth="14" />
      <path  d="M320 340 L460 200 L600 340" stroke="rgba(11,20,16,.08)" strokeWidth="14" />
      <path  d="M580 340 L720 200 L860 340" stroke="rgba(11,20,16,.06)" strokeWidth="14" />
      <path  d="M840 340 L980 200 L1120 340" stroke="rgba(11,20,16,.05)" strokeWidth="14" />
      <path  d="M1100 340 L1240 200 L1380 340" stroke="rgba(11,20,16,.04)" strokeWidth="14" />
    </svg>
  </div>
  <div  className="wrap">
    <div  className="lic-in">
      <div>
        <div  className="eyebrow" style={{"color":"#6B5500"}}>{t("Saison 1")}<sup>{t("er")}</sup> {t("nov. — 31 oct.")}</div>
        <h2  style={{"marginTop":"14px"}}>{t("Trois étapes.")}<br />{t("72 heures.")}<br />{t("Un numéro.")}</h2>
        <p  className="intro">{t("Entraînement encadré, assurance, et le droit de porter un dossard sur toutes les compétitions homologuées — des poussins aux masters.")}</p>
        <a  href="/clubs" className="btn btn-ink" style={{"marginTop":"26px"}}>{t("Trouver un club")}</a>
      </div>
      <div  className="steps">
        <div  className="step"><div  className="step-n">{t("Étape 01")}</div><h4>{t("Rejoindre un club")}</h4>
          <p>{t("Choisissez un club affilié de votre ligue régionale : il reste votre interlocuteur unique toute la saison.")}</p></div>
        <div  className="step"><div  className="step-n">{t("Étape 02")}</div><h4>{t("Constituer le dossier")}</h4>
          <p>{t("Certificat médical de moins de trois mois, pièce d'identité, photo, autorisation parentale pour les mineurs.")}</p></div>
        <div  className="step"><div  className="step-n">{t("Étape 03")}</div><h4>{t("Validation")}</h4>
          <p>{t("La ligue contrôle, la fédération homologue : licence numérique et numéro national sous 72 heures.")}</p></div>
      </div>
    </div>
  </div>
</section>
</>
  );
}
