import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, fmtDate } from "@/lib/api";
export const revalidate = 600;
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const id = Number((await params).id); const a = await api.athlete(id); return { title: a?.name ?? "Athlète", description: a ? `${a.name} — ${a.category}, ${a.club ?? "club"} : records personnels et résultats officiels publiés par la Fédération Sénégalaise d'Athlétisme.` : undefined, alternates: { canonical: `/athletes/${id}` } }; }
export default async function AthletePage({ params }: { params: Promise<{ id: string }> }) {
  const lang = await getLang(); const t = tr(lang);
  const a = await api.athlete(Number((await params).id));
  if (!a) notFound();
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">{a.category} · {a.sex === "F" ? "Femme" : "Homme"} · {a.club} {t("· ligue de")} {a.region}{a.licensed ? " · licence en cours de validité" : ""}</div><h1>{a.name}</h1></div>
      <section><div className="wrap">
        <div className="res-ev" style={{ marginTop: 0 }}><h2>{t("Records personnels")}</h2><div className="panel-l"><div className="scrollx"><table className="tbl"><thead><tr><th>{t("Épreuve")}</th><th>{t("Perf.")}</th><th>{t("Pts")}</th><th>{t("Où")}</th></tr></thead><tbody>{a.pbs.map((p) => <tr key={p.eventCode}><td>{p.event}</td><td><span className="perf">{p.mark}</span></td><td className="dim mono">{p.points}</td><td className="dim">{fmtDate(p.date)} · {p.competition}</td></tr>)}</tbody></table></div>{!a.pbs.length && <div className="empty">{t("Aucune performance publiée.")}</div>}</div></div>
        <div className="res-ev"><h2>{t("Résultats")}</h2><div className="panel-l"><div className="scrollx"><table className="tbl"><thead><tr><th>{t("Date")}</th><th>{t("Compétition")}</th><th>{t("Épreuve")}</th><th>{t("Rang")}</th><th>{t("Perf.")}</th></tr></thead><tbody>{a.results.map((r, i) => <tr key={i}><td className="dim mono">{fmtDate(r.date)}</td><td><Link href={`/competitions/${r.competitionId}`}>{r.competition}</Link></td><td>{r.event}</td><td className="mono">{r.rank ?? "—"}</td><td><span className="perf">{r.mark}</span></td></tr>)}</tbody></table></div></div></div>
      </div></section>
    </main>
  );
}
