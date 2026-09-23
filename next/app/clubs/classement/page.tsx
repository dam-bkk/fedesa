import type { Metadata } from "next";
import { ClubStandings } from "@/components/Features";
import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
export const revalidate = 300;
export const metadata: Metadata = { title: "Classement des clubs", description: "Classement des clubs sénégalais sur les compétitions nationales et internationales : titres, podiums et indices de performance.", alternates: { canonical: "/clubs/classement" } };
export default async function Classement() {
  const lang = await getLang(); const t = tr(lang);
  return <main><div className="wrap page-head"><div className="eyebrow">{t("Saison 2025-26 · mis à jour à chaque publication de résultats")}</div><h1>{t("Classement")}<br />{t("des clubs")}</h1><p className="intro">{t("Les clubs sont classés sur les compétitions nationales et internationales publiées : somme des indices de performance de leurs athlètes, titres et podiums. Un indice de 1 000 points correspond au record national de l'épreuve.")}</p></div><ClubStandings limit={60} /></main>;
}
