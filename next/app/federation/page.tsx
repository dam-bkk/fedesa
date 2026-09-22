import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
import Federation from "@/components/parts/Federation";
import Partenaires from "@/components/parts/Partenaires";
import { BUREAU, LIGUES, CONTACT } from "@/lib/content";
import { api } from "@/lib/api";
import { Timeline } from "@/components/Features";
export const revalidate = 3600;
export const metadata: Metadata = { title: "La fédération", description: "Présentation, bureau fédéral, histoire, les 14 ligues régionales et les partenaires de la FEDESA." };
export default async function FederationPage() {
  const lang = await getLang(); const t = tr(lang);
  const stats = await api.stats();
  const byRegion = new Map((stats?.byRegion ?? []).map((r) => [r.code, r.licensees]));
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">{t("Fédération Sénégalaise d'Athlétisme · depuis 1960")}</div><h1>{t("La")}<br />{t("fédération")}</h1><p className="intro">{t("Affiliée à World Athletics et à la Confédération Africaine d'Athlétisme, la FEDESA organise, forme et sélectionne : 14 ligues régionales, les clubs affiliés, les officiels et les équipes nationales. Siège au Stade Iba Mar Diop, à Dakar.")}</p></div>
      <Federation  t={t} />
      <section id="bureau" style={{ paddingTop: 0 }}><div className="wrap"><div className="sec-head"><div><div className="eyebrow">{t("Élus pour l'olympiade")}</div><h2 style={{ marginTop: 14 }}>{t("Bureau")}<br />{t("fédéral")}</h2></div></div>
        <div className="bureau">{BUREAU.map((b) => <div key={b.role}><span className="r">{t(b.role)}</span><b>{b.name}</b></div>)}</div>
        <p className="dim" style={{ marginTop: 12, fontSize: 13 }}>{t("Composition publiée sur fedesa.sn ; les postes marqués « — » seront complétés par le secrétariat général.")}</p></div></section>
      <Timeline />
      <section id="ligues" style={{ paddingTop: 0 }}><div className="wrap"><div className="sec-head"><div><div className="eyebrow">{t("Situation géographique")}</div><h2 style={{ marginTop: 14 }}>{t("Les 14")}<br />{t("ligues")}</h2></div><Link href="/clubs" className="sec-link">{t("Carte des clubs")}</Link></div>
        <div className="ligues">{LIGUES.map((l) => <div className="ligue" id={`ligue-${l.code}`} key={l.code}><b>{l.name}</b><span>{l.venue}</span><span className="mono dim">{(byRegion.get(l.code) ?? 0).toLocaleString("fr-FR")} {t("licenciés")}</span><span className="dim">{l.bureau ? "Bureau de ligue publié" : "Bureau : non communiqué"}</span><Link href={`/clubs?ligue=${l.code}`} className="sec-link" style={{ marginTop: 6 }}>{t("Clubs de la ligue →")}</Link></div>)}</div></div></section>
      <section id="formations" style={{ paddingTop: 0 }}><div className="wrap"><div className="sec-head"><div><div className="eyebrow">{t("Encadrement")}</div><h2 style={{ marginTop: 14 }}>{t("Formations")}</h2></div></div>
        <div className="steps"><div className="step"><div className="step-n">{t("Entraîneurs")}</div><h4>{t("Niveaux 1 à 3")}</h4><p>{t("Cursus World Athletics dispensé par la direction technique nationale, sessions dans les ligues.")}</p></div><div className="step"><div className="step-n">{t("Officiels")}</div><h4>{t("Juges et chronométreurs")}</h4><p>{t("Homologation des juges-arbitres, starters et juges de concours ; recyclage annuel.")}</p></div><div className="step"><div className="step-n">{t("Dirigeants")}</div><h4>{t("Gestion de club")}</h4><p>{t("Affiliation, licences en ligne, organisation d'une compétition, antidopage avec l'ONADS.")}</p></div></div></div></section>
      <Partenaires  t={t} />
      <section id="contact" style={{ paddingTop: 0 }}><div className="wrap"><div className="sec-head"><div><div className="eyebrow">{t("Nous écrire")}</div><h2 style={{ marginTop: 14 }}>{t("Contact")}</h2></div></div>
        <dl className="kv"><dt>{t("Siège")}</dt><dd>{CONTACT.venue}, {CONTACT.street}, {CONTACT.city}</dd><dt>{t("Téléphone")}</dt><dd className="mono">{CONTACT.phone}</dd><dt>{t("E-mail")}</dt><dd>{CONTACT.email}</dd><dt>{t("Horaires")}</dt><dd>{CONTACT.hours}</dd></dl></div></section>
    </main>
  );
}
