import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, fmtDate } from "@/lib/api";
import { Replay } from "@/components/Replay";
export const revalidate = 300;
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const c = await api.competition(Number((await params).id)); return { title: "error" in c ? "Résultats" : `Résultats — ${c.name}` }; }
export default async function CompetitionPage({ params }: { params: Promise<{ id: string }> }) {
  const lang = await getLang(); const t = tr(lang);
  const c = await api.competition(Number((await params).id));
  if ("error" in c) notFound();
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">{fmtDate(c.dateFrom, true)}{c.dateTo !== c.dateFrom ? ` → ${fmtDate(c.dateTo, true)}` : ""} · {c.venue}, {c.city} · {c.level}</div><h1>{c.name}</h1>
        <p className="intro">{t("Résultats officiels publiés par la fédération le")} {fmtDate(c.publishedAt?.slice(0, 10), true)}. {c.events.length} {t("épreuves.")}</p></div>
      <section><div className="wrap">
        {c.events.map((e) => (
          <div className="res-ev" key={e.eventCode + e.sex}>
            <h3>{e.event} <span className={`badge ${e.sex === "F" ? "b-q" : "b-n"}`}>{e.sex === "F" ? "Femmes" : "Hommes"}</span></h3>
            <div className="panel-l"><div className="scrollx"><table className="tbl"><thead><tr><th style={{ width: 60 }}>{t("Pos")}</th><th>{t("Athlète")}</th><th>{t("Club")}</th><th>{t("Cat.")}</th><th>{t("Perf.")}</th>{e.kind === "t" && <th>{t("Vent")}</th>}<th>{t("Pts")}</th></tr></thead><tbody>
              {e.results.map((r) => <tr key={r.athleteId}><td data-th="Pos" className="c-pos"><span className={`rank ${r.rank === 1 ? "g" : r.rank === 2 ? "s" : r.rank === 3 ? "b" : ""}`}>{r.rank ?? "—"}</span></td><td className="c-main" data-th={t("Athlète")}><Link href={`/athletes/${r.athleteId}`}>{r.athlete}</Link>{r.record && <span className="badge b-rn" style={{ marginLeft: 8 }}>{r.record}</span>}</td><td className="dim" data-th={t("Club")}>{r.club}</td><td className="dim" data-th={t("Cat.")}>{r.category}</td><td className="c-perf" data-th={t("Perf.")}><span className="perf">{r.mark}</span></td>{e.kind === "t" && <td className="dim mono" data-th={t("Vent")}>{r.wind != null ? (r.wind > 0 ? "+" : "") + r.wind.toFixed(1) : "—"}</td>}<td className="dim mono" data-th="Pts">{r.points || ""}</td></tr>)}
            </tbody></table></div></div>
            {e.kind === "t" && e.results.length >= 2 && <Replay lang={lang} event={`${e.event} ${e.sex === "F" ? "F" : "H"}`} results={e.results.map((r) => ({ athlete: r.athlete, club: r.club, mark: r.mark, raw: r.raw, rank: r.rank }))} />}
          </div>
        ))}
        <p style={{ marginTop: 30 }}><Link href="/competitions" className="sec-link">{t("← Calendrier")}</Link></p>
      </div></section>
    </main>
  );
}
