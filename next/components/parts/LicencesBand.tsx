/* Généré depuis v3/index.html — ne pas éditer à la main, relancer le convertisseur. */
export default function LicencesBand({ t }: { t: (s: string) => string }) {
  return (
<>
<section  className="lic" id="licences">
    <div  className="wrap">
    <div  className="lic-in">
      <div>
        <div  className="eyebrow" style={{"color":"#6B5500"}}>{t("Saison 1")}<sup>{t("er")}</sup> {t("nov. — 31 oct.")}</div>
        <h2  style={{"marginTop":"14px"}}>{t("Trois étapes.")}<br />{t("72 heures.")}<br />{t("Un numéro.")}</h2>
        <p  className="intro">{t("Entraînement encadré, assurance, et le droit de porter un dossard sur toutes les compétitions homologuées — des poussins aux masters.")}</p>
        <a  href="/clubs" className="btn btn-ink" style={{"marginTop":"26px"}}>{t("Trouver un club")}</a>
      </div>
      <div  className="steps">
        <div  className="step"><div  className="step-n">{t("Étape 01")}</div><h3>{t("Rejoindre un club")}</h3>
          <p>{t("Choisissez un club affilié de votre ligue régionale : il reste votre interlocuteur unique toute la saison.")}</p></div>
        <div  className="step"><div  className="step-n">{t("Étape 02")}</div><h3>{t("Constituer le dossier")}</h3>
          <p>{t("Certificat médical de moins de trois mois, pièce d'identité, photo, autorisation parentale pour les mineurs.")}</p></div>
        <div  className="step"><div  className="step-n">{t("Étape 03")}</div><h3>{t("Validation")}</h3>
          <p>{t("La ligue contrôle, la fédération homologue : licence numérique et numéro national sous 72 heures.")}</p></div>
      </div>
    </div>
  </div>
</section>
</>
  );
}
