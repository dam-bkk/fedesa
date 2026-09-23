import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
import type { Metadata } from "next";
import { api } from "@/lib/api";
import { RecordsTable } from "@/components/Data";
import { Progression } from "@/components/Features";
export const revalidate = 3600;
export const metadata: Metadata = { title: "Records du Sénégal", description: "Tous les records du Sénégal homologués, nationaux et régionaux : épreuve, performance, détenteur, lieu et date.", alternates: { canonical: "/records" } };
export default async function Records() {
  const lang = await getLang(); const t = tr(lang);
  const { items } = await api.records();
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">{t("Homologués par la commission des records")}</div><h1>{t("Records")}<br />{t("du Sénégal")}</h1><p className="intro">{t("Records nationaux seniors et records des ligues. Une performance devient record après homologation : chronométrage électrique, vent légal, juges accrédités et licence en cours de validité.")}</p></div>
      <section><div className="wrap">
        <div className="tools"><div className="search"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="#5A6360" strokeWidth="2" /><path d="M11 11l4 4" stroke="#5A6360" strokeWidth="2" strokeLinecap="round" /></svg><label htmlFor="recSearch" className="vis-hidden">{t("Rechercher un record")}</label><input id="recSearch" type="search" placeholder={t("Épreuve, athlète, ligue…")} /></div><span className="mono dim" style={{ fontSize: 12 }} id="recCount">{items.length} {t("records affichés")}</span></div>
        <RecordsTable items={items} full />
        <div className="grid2" style={{ marginTop: 40 }}><Progression ep="400" sexe="F" /><Progression ep="100" sexe="M" /></div>
      </div></section>
    </main>
  );
}
