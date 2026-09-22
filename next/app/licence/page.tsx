import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
import { api, fmtDate } from "@/lib/api";
import Faq from "@/components/parts/Faq";
import LicencesBand from "@/components/parts/LicencesBand";
import { CatCalc } from "@/components/CatCalc";
export const revalidate = 3600;
export const metadata: Metadata = { title: "Prendre une licence", description: "Tarifs, pièces à fournir et démarche pour obtenir sa licence auprès d'un club affilié." };
const fcfa = (n: number) => n.toLocaleString("fr-FR") + " FCFA";
export default async function Licence() {
  const lang = await getLang(); const t = tr(lang);
  const tarifs = await api.tarifs();
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">{t("Saison")} {tarifs?.season ?? "2026-2027"}{tarifs?.campaignOpen ? " · campagne ouverte" : ""}</div><h1>{t("Prendre")}<br />{t("sa licence")}</h1>
        <p className="intro">{t("La licence fédérale donne le droit de s'entraîner en club, d'être assuré et de porter un dossard sur toutes les compétitions homologuées, des poussins aux masters. Elle est valable du")} {tarifs ? fmtDate(tarifs.validFrom, true) : "1er novembre"} {t("au")} {tarifs ? fmtDate(tarifs.validTo, true) : "31 octobre"}.</p>
        <div className="note-warn">{t("Une personne ne peut pas se licencier seule : la demande est déposée par un club affilié.")} <Link href="/clubs" className="sec-link">{t("Trouver un club près de chez soi →")}</Link></div></div>
      <section id="tarifs"><div className="wrap">
        <div className="sec-head"><div><div className="eyebrow">{t("Tarifs officiels · fixés par la fédération")}</div><h2 style={{ marginTop: 14 }}>{t("Combien")}<br />{t("ça coûte")}</h2></div></div>
        {tarifs ? <div className="tarifs">{tarifs.fees.map((f) => <div className="tarif" key={f.code}><span className="l">{t(f.label)}</span><span className="v">{fcfa(f.amount)}</span><span className="s">{t("par saison · réglée au club (Wave, Orange Money, virement ou espèces)")}</span></div>)}</div> : <p className="dim">{t("Tarifs temporairement indisponibles.")}</p>}
        <p className="dim" style={{ marginTop: 14, fontSize: 13 }}>{t("Le club peut ajouter sa propre cotisation (entraînement, équipement) : renseignez-vous auprès de lui. Le montant fédéral est identique dans les 14 ligues.")}</p>
      </div></section>
      <section style={{ paddingTop: 0 }}><div className="wrap">
        <div className="sec-head"><div><div className="eyebrow">{t("Le dossier")}</div><h2 style={{ marginTop: 14 }}>{t("Les pièces")}<br />{t("à remettre au club")}</h2></div></div>
        <ul className="docs">{(tarifs?.documents ?? []).map((d, i) => <li key={d.code}><span className="n">{String(i + 1).padStart(2, "0")}</span>{t(d.label)}<span className="dim" style={{ marginLeft: "auto", fontSize: 12 }}>{{ photo: "nouvelle licence", idcard: "nouvelle licence", medical: "sauf encadrement et officiels", form: "toutes", parental: "mineurs", payment: "toutes", transfer: "mutation", diploma: "encadrement, officiels" }[d.code] ?? ""}</span></li>)}</ul>
        <div className="steps" style={{ marginTop: 30 }}>{(tarifs?.howTo ?? []).map((s, i) => <div className="step" key={i}><div className="step-n">{t("Étape")} {String(i + 1).padStart(2, "0")}</div><h4>{t(s.split(" (")[0])}</h4><p>{i === 0 ? "L'annuaire et la carte listent les clubs affiliés de chaque ligue, avec leurs contacts." : i === 1 ? "Le club vérifie le dossier avant de le déposer : gain de temps pour tout le monde." : i === 2 ? "Le dépôt se fait en ligne sur la plateforme fédérale ; le club encaisse le montant de la licence." : i === 3 ? "Contrôle des pièces, puis attribution du numéro national. En cas de pièce manquante, le club est prévenu immédiatement." : "Carte numérique avec QR code de vérification, historique des résultats et records personnels."}</p></div>)}</div>
      </div></section>
      <section style={{ paddingTop: 0 }}><div className="wrap"><CatCalc lang={lang} fees={tarifs?.fees ?? []} season={tarifs?.season} /></div></section>
      <LicencesBand  t={t} />
      <Faq  t={t} />
    </main>
  );
}
