import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
import Athlete from "@/components/parts/Athlete";
import { api } from "@/lib/api";
export const revalidate = 600;
export const metadata: Metadata = { title: "Athlètes", description: "Les meilleurs athlètes sénégalais de la saison, épreuve par épreuve, avec leurs records personnels et leurs résultats.", alternates: { canonical: "/athletes" } };
const TOP: [string, "M" | "F"][] = [["100", "M"], ["100", "F"], ["400", "F"], ["400H", "M"], ["TJ", "M"], ["LJ", "F"], ["800", "M"], ["1500", "F"], ["HH", "M"]];
export default async function Athletes() {
  const lang = await getLang(); const t = tr(lang);
  const bilans = (await Promise.all(TOP.map(([ep, s]) => api.bilan(ep, s, "", 1)))).filter((b) => b && b.items.length);
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">{t("Saison 2025-26 · leaders par épreuve")}</div><h1>{t("Athlètes")}</h1><p className="intro">{t("Les meilleures performances publiées de la saison. Chaque fiche athlète rassemble ses records personnels et son historique de résultats, tenus à jour par la plateforme fédérale.")}</p></div>
      <section><div className="wrap">
        <div className="ath-grid">{bilans.map((b) => { const r = b!.items[0]; return <Link key={b!.eventCode + b!.sex} href={`/athletes/${r.athleteId}`} className="ath"><span className="eyebrow">{b!.event} · {b!.sex === "F" ? "Femmes" : "Hommes"}</span><span className="n">{r.athlete}</span><span className="perf">{r.mark}</span><span className="dim">{r.club} · {r.competition}</span></Link>; })}</div>
      </div></section>
      <Athlete  t={t} />
    </main>
  );
}
