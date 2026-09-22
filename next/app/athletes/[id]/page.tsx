import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, fmtDate } from "@/lib/api";
export const revalidate = 600;
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const a = await api.athlete(Number((await params).id)); return { title: a?.name ?? "Athlète" }; }
export default async function AthletePage({ params }: { params: Promise<{ id: string }> }) {
  const a = await api.athlete(Number((await params).id));
  if (!a) notFound();
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">{a.category} · {a.sex === "F" ? "Femme" : "Homme"} · {a.club} · ligue de {a.region}{a.licensed ? " · licence en cours de validité" : ""}</div><h1>{a.name}</h1></div>
      <section><div className="wrap">
        <div className="res-ev" style={{ marginTop: 0 }}><h3>Records personnels</h3><div className="panel-l"><div className="scrollx"><table className="tbl"><thead><tr><th>Épreuve</th><th>Perf.</th><th>Pts</th><th>Où</th></tr></thead><tbody>{a.pbs.map((p) => <tr key={p.eventCode}><td>{p.event}</td><td><span className="perf">{p.mark}</span></td><td className="dim mono">{p.points}</td><td className="dim">{fmtDate(p.date)} · {p.competition}</td></tr>)}</tbody></table></div>{!a.pbs.length && <div className="empty">Aucune performance publiée.</div>}</div></div>
        <div className="res-ev"><h3>Résultats</h3><div className="panel-l"><div className="scrollx"><table className="tbl"><thead><tr><th>Date</th><th>Compétition</th><th>Épreuve</th><th>Rang</th><th>Perf.</th></tr></thead><tbody>{a.results.map((r, i) => <tr key={i}><td className="dim mono">{fmtDate(r.date)}</td><td><Link href={`/competitions/${r.competitionId}`}>{r.competition}</Link></td><td>{r.event}</td><td className="mono">{r.rank ?? "—"}</td><td><span className="perf">{r.mark}</span></td></tr>)}</tbody></table></div></div></div>
      </div></section>
    </main>
  );
}
