import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, fmtDate } from "@/lib/api";
export const revalidate = 300;
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const c = await api.competition(Number((await params).id)); return { title: "error" in c ? "Résultats" : `Résultats — ${c.name}` }; }
export default async function CompetitionPage({ params }: { params: Promise<{ id: string }> }) {
  const c = await api.competition(Number((await params).id));
  if ("error" in c) notFound();
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">{fmtDate(c.dateFrom, true)}{c.dateTo !== c.dateFrom ? ` → ${fmtDate(c.dateTo, true)}` : ""} · {c.venue}, {c.city} · {c.level}</div><h1>{c.name}</h1>
        <p className="intro">Résultats officiels publiés par la fédération le {fmtDate(c.publishedAt?.slice(0, 10), true)}. {c.events.length} épreuves.</p></div>
      <section><div className="wrap">
        {c.events.map((e) => (
          <div className="res-ev" key={e.eventCode + e.sex}>
            <h3>{e.event} <span className={`badge ${e.sex === "F" ? "b-q" : "b-n"}`}>{e.sex === "F" ? "Femmes" : "Hommes"}</span></h3>
            <div className="panel-l"><div className="scrollx"><table className="tbl"><thead><tr><th style={{ width: 60 }}>Pos</th><th>Athlète</th><th>Club</th><th>Cat.</th><th>Perf.</th>{e.kind === "t" && <th>Vent</th>}<th>Pts</th></tr></thead><tbody>
              {e.results.map((r) => <tr key={r.athleteId}><td><span className={`rank ${r.rank === 1 ? "g" : r.rank === 2 ? "s" : r.rank === 3 ? "b" : ""}`}>{r.rank ?? "—"}</span></td><td><Link href={`/athletes/${r.athleteId}`}>{r.athlete}</Link>{r.record && <span className="badge b-rn" style={{ marginLeft: 8 }}>{r.record}</span>}</td><td className="dim">{r.club}</td><td className="dim">{r.category}</td><td><span className="perf">{r.mark}</span></td>{e.kind === "t" && <td className="dim mono">{r.wind != null ? (r.wind > 0 ? "+" : "") + r.wind.toFixed(1) : "—"}</td>}<td className="dim mono">{r.points || ""}</td></tr>)}
            </tbody></table></div></div>
          </div>
        ))}
        <p style={{ marginTop: 30 }}><Link href="/competitions" className="sec-link">← Calendrier</Link></p>
      </div></section>
    </main>
  );
}
