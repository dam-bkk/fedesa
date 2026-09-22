import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
import { api, fmtDate } from "@/lib/api";
import { LiveResults } from "@/components/Data";
import { Progression } from "@/components/Features";
import { Subscribe } from "@/components/Subscribe";
export const revalidate = 300;
export const metadata: Metadata = { title: "Résultats et bilans", description: "Meilleures performances de la saison par épreuve, résultats officiels publiés par la fédération." };
const EVENTS: [string, string][] = [["100", "100 m"], ["200", "200 m"], ["400", "400 m"], ["800", "800 m"], ["1500", "1500 m"], ["5000", "5000 m"], ["HH", "110 m / 100 m haies"], ["400H", "400 m haies"], ["HJ", "Hauteur"], ["PV", "Perche"], ["LJ", "Longueur"], ["TJ", "Triple saut"], ["SP", "Poids"], ["DT", "Disque"], ["JT", "Javelot"], ["HT", "Marteau"], ["10K", "10 km route"], ["MAR", "Marathon"]];
export default async function Resultats({ searchParams }: { searchParams: Promise<{ ep?: string; sexe?: string }> }) {
  const lang = await getLang(); const t = tr(lang);
  const { ep = "100", sexe = "F" } = await searchParams;
  const [b, cal] = await Promise.all([api.bilan(ep, sexe, "", 20), api.season()]);
  const published = cal.items.filter((c) => c.resultsUrl).sort((a, c) => (a.dateFrom < c.dateFrom ? 1 : -1));
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">{t("Saison 2025-26 · résultats publiés uniquement")}</div><h1>{t("Bilans")}</h1>
        <p className="intro">{t("Les vingt meilleures performances de la saison par épreuve, calculées automatiquement à partir des résultats validés et publiés par la fédération. Une seule performance par athlète.")}</p>
        <form className="tools" style={{ marginTop: 22 }}><label htmlFor="ep" className="vis-hidden">{t("Épreuve")}</label><select id="ep" name="ep" defaultValue={ep} className="sel">{EVENTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select><label htmlFor="sexe" className="vis-hidden">{t("Sexe")}</label><select id="sexe" name="sexe" defaultValue={sexe} className="sel" style={{ marginLeft: 8 }}><option value="F">{t("Femmes")}</option><option value="M">{t("Hommes")}</option></select><button className="btn btn-ink btn-sm" style={{ marginLeft: 10 }}>{t("Afficher")}</button></form></div>
      <section><div className="wrap">
        <div className="res-ev" style={{ marginTop: 0 }}><h3>{b?.event ?? ep} <span className="badge b-q">{sexe === "F" ? "Femmes" : "Hommes"}</span></h3>
          <div className="panel-l"><div className="scrollx"><table className="tbl"><thead><tr><th style={{ width: 60 }}>#</th><th>{t("Athlète")}</th><th>{t("Club")}</th><th>{t("Cat.")}</th><th>{t("Perf.")}</th><th>{t("Pts")}</th><th>{t("Où")}</th></tr></thead><tbody>
            {(b?.items ?? []).map((r) => <tr key={r.athleteId}><td><span className={`rank ${r.rank === 1 ? "g" : r.rank === 2 ? "s" : r.rank === 3 ? "b" : ""}`}>{r.rank}</span></td><td><Link href={`/athletes/${r.athleteId}`}>{r.athlete}</Link></td><td className="dim">{r.club}</td><td className="dim">{r.category}</td><td><span className="perf">{r.mark}</span>{r.wind != null && <span className="dim mono" style={{ fontSize: 11, marginLeft: 6 }}>({r.wind > 0 ? "+" : ""}{r.wind.toFixed(1)})</span>}</td><td className="dim mono">{r.points}</td><td className="dim">{fmtDate(r.date)} · <Link href={`/competitions/${r.competitionId}`}>{r.competition}</Link></td></tr>)}
          </tbody></table></div>{!b?.items.length && <div className="empty">{t("Aucune performance publiée pour cette sélection.")}</div>}</div></div>
        <div style={{ marginTop: 30 }}><Progression ep={ep} sexe={sexe} /></div>
      </div></section>
      <LiveResults />
      <section><div className="wrap">
        <div className="sec-head"><div><div className="eyebrow">{t("Compétition par compétition")}</div><h2 style={{ marginTop: 14 }}>{t("Résultats")}<br />{t("officiels")}</h2></div></div>
        <div className="fix-col">{published.map((c) => <Link key={c.id} href={`/competitions/${c.id}`} className="fx"><div className="fx-date"><div className="fx-d">{c.dateFrom.slice(8, 10)}</div><div className="fx-m">{["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"][+c.dateFrom.slice(5, 7) - 1]}</div></div><div><div className="fx-n">{c.name}</div><div className="fx-meta"><span className="pill nat">{c.level}</span> {c.venue} · {c.city}</div></div><div className="fx-go">{t("Résultats →")}</div></Link>)}</div>
      <Subscribe lang={lang} /></div></section>
    </main>
  );
}
