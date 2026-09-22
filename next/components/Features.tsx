import Link from "next/link";
import { api, fmtDate, type Lang } from "@/lib/api";
import { tr } from "@/lib/i18n";
import { HISTOIRE, MONDE } from "@/lib/content";
import { getLang } from "@/lib/server/lang";

/** #8 — frise horizontale 1960 → 2027. */
export async function Timeline() {
  const t = tr(await getLang());
  return (
    <section id="histoire" className="tl-sec"><div className="wrap"><div className="sec-head"><div><div className="eyebrow">1960 → 2027</div><h2 style={{ marginTop: 14 }}>{t("Soixante ans")}<br />{t("de piste")}</h2></div><span className="mono dim" style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" }}>{t("Faites défiler →")}</span></div></div>
      <div className="tl-scroll"><div className="tl-track">{HISTOIRE.map((h, i) => <article className={`tl-card ${i === HISTOIRE.length - 1 ? "next" : ""}`} key={h.y}><div className="tl-y">{h.y}</div><b>{t(h.t)}</b><p>{t(h.d)}</p></article>)}</div></div>
    </section>
  );
}
/** « Dans le monde » — Sénégalais sur la scène internationale, pour inspirer les athlètes des ligues. */
export async function Monde() {
  const t = tr(await getLang());
  const M: Record<string, string> = { or: t("Or"), argent: t("Argent"), bronze: t("Bronze") };
  return (
    <section id="monde" className="dark monde"><div className="gridlines" aria-hidden="true" /><div className="wrap">
      <div className="sec-head"><div><div className="eyebrow dark">{t("Dans le monde")}</div><h2 style={{ marginTop: 14 }}>{t("Ils ont porté")}<br />{t("le maillot")}</h2></div><p className="dim" style={{ maxWidth: "44ch", fontSize: 14 }}>{t("Séoul, Edmonton, Alger, Kinshasa : les Sénégalais qui ont brillé loin de Dakar. La prochaine ligne s'écrira ici, en 2027.")}</p></div>
      <div className="monde-grid">{MONDE.map((m, i) => <article className={`mcard ${m.medal ?? ""} ${m.year === "2027" ? "next" : ""}`} key={i}><div className="mc-top"><span className="mono">{m.year} · {m.city}</span>{m.medal && <span className={`medal ${m.medal}`}>{M[m.medal]}</span>}</div><div className="mc-perf">{m.mark === "à écrire" ? t("à écrire") : m.mark}</div><b>{m.athlete}</b><span className="mc-ev">{t(m.event)} · {t(m.meet)}</span><p>{t(m.note)}</p></article>)}</div>
    </div></section>
  );
}
/** #17 — classement des clubs (temps réel depuis l'app). */
export async function ClubStandings({ limit = 6, teaser }: { limit?: number; teaser?: boolean }) {
  const t = tr(await getLang());
  const data = await api.standings();
  const rows = data.items.slice(0, limit);
  if (!rows.length) return null;
  return (
    <section id="classement" style={teaser ? { paddingTop: 0 } : undefined}><div className="wrap">
      {teaser && <div className="sec-head"><div><div className="eyebrow">{t("Classement des clubs · mis à jour à chaque publication")}</div><h2 style={{ marginTop: 14 }}>{t("Qui mène")}<br />{t("la saison")}</h2></div><Link href="/clubs/classement" className="sec-link">{t("Classement complet")}</Link></div>}
      <div className="stand">{rows.map((r) => <Link href={`/clubs?ligue=${r.regionCode}#ligue-${r.regionCode}`} className="st-row" key={r.id}><span className="st-rank">{String(r.rank).padStart(2, "0")}</span><span className="st-club"><b>{r.club}</b><small>{r.city} · {t("ligue de")} {r.region}</small></span><span className="st-n"><b>{r.gold}</b><small>{t("titres")}</small></span><span className="st-n"><b>{r.podiums}</b><small>{t("podiums")}</small></span><span className="st-n"><b>{r.athletes}</b><small>{t("athlètes")}</small></span><span className="st-pts">{r.points.toLocaleString("fr-FR")}<small>pts</small></span></Link>)}</div>
      <p className="dim" style={{ marginTop: 12, fontSize: 12.5 }}>{t("Compétitions nationales et internationales publiées, saison 2025-26. Points = somme des indices de performance (1 000 = record national).")}</p>
    </div></section>
  );
}
/** #13 — progression nationale : meilleure perf par année + record de référence. */
export async function Progression({ ep, sexe }: { ep: string; sexe: string }) {
  const t = tr(await getLang());
  const p = await api.progression(ep, sexe);
  if (!p || !p.years.length) return null;
  const W = 640, H = 220, L = 60, B = 30, T = 16;
  const vals = p.years.map((y) => y.raw).concat(p.record ? [p.record.raw] : []);
  const min = Math.min(...vals), max = Math.max(...vals), span = Math.max(1e-6, max - min);
  const y = (v: number) => (p.lowerIsBetter ? T + ((v - min) / span) * (H - T - B) : H - B - ((v - min) / span) * (H - T - B));
  const xs = p.years.length > 1 ? p.years.map((_, i) => L + (i / (p.years.length - 1)) * (W - L - 20)) : [W / 2];
  return (
    <div className="prog"><div className="prog-h"><b>{t("Progression nationale")} — {p.event} {sexe === "F" ? t("Femmes") : t("Hommes")}</b><span className="dim sm">{t("meilleure performance publiée par année")}{p.record ? ` · ${t("record")} ${p.record.mark} (${p.record.holder}${p.record.year ? ", " + p.record.year : ""})` : ""}</span></div>
      <svg viewBox={`0 0 ${W} ${H}`} className="prog-svg" role="img" aria-label={t("Progression nationale")}>
        {p.record && <><line x1={L} x2={W - 20} y1={y(p.record.raw)} y2={y(p.record.raw)} stroke="var(--volt)" strokeWidth="2" strokeDasharray="6 5" /><text x={W - 20} y={y(p.record.raw) - 6} textAnchor="end" fontSize="11" fill="var(--ink)" fontFamily="var(--mono)">NR {p.record.mark}</text></>}
        <polyline points={p.years.map((v, i) => `${xs[i]},${y(v.raw)}`).join(" ")} fill="none" stroke="var(--ink)" strokeWidth="2" />
        {p.years.map((v, i) => <g key={v.year}><circle cx={xs[i]} cy={y(v.raw)} r="5" fill="var(--ink)" /><text x={xs[i]} y={y(v.raw) - 12} textAnchor="middle" fontSize="12" fontFamily="var(--mono)" fill="var(--ink)">{v.mark}</text><text x={xs[i]} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--muted)" fontFamily="var(--mono)">{v.year}</text></g>)}
      </svg>
      <p className="dim" style={{ fontSize: 12 }}>{t("Historique disponible depuis la mise en service de la plateforme ; les archives papier antérieures seront importées par la commission des statistiques.")}</p>
    </div>
  );
}
/** #5 — le week-end en chiffres : podiums et records du dernier week-end de compétition publié. */
export async function Weekend({ full }: { full?: boolean }) {
  const t = tr(await getLang());
  const { items } = await api.season();
  const pub = items.filter((c) => c.resultsUrl).sort((a, b) => (a.dateFrom < b.dateFrom ? 1 : -1));
  if (!pub.length) return null;
  const last = pub[0]; const d0 = new Date(last.dateFrom + "T00:00:00Z"); const dow = d0.getUTCDay(); const sat = new Date(d0); sat.setUTCDate(d0.getUTCDate() - ((dow + 1) % 7)); const sun = new Date(sat); sun.setUTCDate(sat.getUTCDate() + 1);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const wk = pub.filter((c) => c.dateFrom >= iso(sat) && c.dateFrom <= iso(sun));
  const comps = (await Promise.all(wk.map((c) => api.competition(c.id)))).filter((c): c is Exclude<typeof c, { error: string }> => !("error" in c));
  const all = comps.flatMap((c) => c.events.map((e) => ({ c, e })));
  const records = all.flatMap(({ c, e }) => e.results.filter((r) => r.record).map((r) => ({ c, e, r })));
  const best = all.flatMap(({ c, e }) => e.results.slice(0, 1).map((r) => ({ c, e, r }))).sort((a, b) => b.r.points - a.r.points);
  return (
    <section id="weekend" className="wk"><div className="wrap">
      <div className="sec-head"><div><div className="eyebrow">{t("Le week-end en chiffres")} · {fmtDate(iso(sat), true)} – {fmtDate(iso(sun), true)}</div><h2 style={{ marginTop: 14 }}>{t("Ce que")}<br />{t("le week-end a donné")}</h2></div>{!full && <Link href="/week-end" className="sec-link">{t("Tous les podiums")}</Link>}</div>
      <div className="wk-stats"><div><b>{comps.length}</b><span>{t("compétitions")}</span></div><div><b>{all.length}</b><span>{t("finales")}</span></div><div><b>{all.reduce((n, x) => n + x.e.results.length, 0)}</b><span>{t("performances")}</span></div><div><b>{records.length}</b><span>{t("records")}</span></div></div>
      <div className="wk-grid">
        <div><h3 className="poster">{t("Meilleures performances")}</h3><div className="fix-col">{best.slice(0, full ? 12 : 6).map(({ c, e, r }, i) => <Link key={i} href={`/competitions/${c.id}`} className="fx"><div className="fx-date"><div className="fx-d">{i + 1}</div><div className="fx-m">{r.points} pts</div></div><div><div className="fx-n">{r.athlete} — {e.event} {e.sex === "F" ? "F" : "H"}</div><div className="fx-meta">{r.club} · {c.name}</div></div><div className="fx-res"><span className="mono">{r.mark}</span>{r.record && <span className="badge b-rn" style={{ fontSize: 9 }}>{r.record}</span>}</div></Link>)}</div></div>
        <div><h3 className="poster">{t("Podiums")}</h3><div className="podiums">{all.slice(0, full ? 60 : 8).map(({ c, e }, i) => <div className="pod" key={i}><b>{e.event} {e.sex === "F" ? "F" : "H"}</b><small className="dim">{c.name}</small><ol>{e.results.slice(0, 3).map((r) => <li key={r.athleteId}><span className={`rank ${r.rank === 1 ? "g" : r.rank === 2 ? "s" : "b"}`}>{r.rank}</span><Link href={`/athletes/${r.athleteId}`}>{r.athlete}</Link><span className="mono">{r.mark}</span></li>)}</ol></div>)}</div></div>
      </div>
    </div></section>
  );
}
export type { Lang };
