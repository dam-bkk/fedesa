import Link from "next/link";
import { api, fmtDate, dd, mon, nf, type CalItem, type Record_, type Competition } from "@/lib/api";
const isComp = (c: Competition | { error: string }): c is Competition => !("error" in c);

/** Bandeau défilant des records nationaux (or) — depuis l'API. */
export async function RecordsMarquee() {
  const { items } = await api.records();
  const nat = items.filter((r) => r.scope === "national").slice(0, 12);
  if (!nat.length) return null;
  return (
    <div className="mq mq-gold" aria-label="Records nationaux">
      <div className="mq-tag">Records du Sénégal</div>
      <div className="mq-track">{nat.map((r, k) => <span className="mq-i" key={k}><b>{r.event} {r.sex === "F" ? "F" : "H"}</b> {r.holder} <span className="mono">{r.mark}</span></span>)}</div>
    </div>
  );
}
/** Bandeau « en direct » : derniers vainqueurs publiés. */
export async function LiveMarquee() {
  const { items } = await api.season();
  const done = items.filter((c) => c.resultsUrl).sort((a, b) => (a.dateFrom < b.dateFrom ? 1 : -1)).slice(0, 2);
  const comps = (await Promise.all(done.map((c) => api.competition(c.id)))).filter(isComp);
  const feed = comps.flatMap((c) => c.events.map((e) => ({ ev: e.event + (e.sex === "F" ? " F" : " H"), w: e.results[0] }))).filter((x) => x.w).slice(0, 14);
  if (!feed.length) return null;
  return (
    <div className="mq mq-ink" aria-label="Derniers chronos">
      <div className="mq-tag"><span className="dot" />Derniers résultats</div>
      <div className="mq-track">{feed.map((x, k) => <span className="mq-i" key={k}><b>{x.ev}</b> {x.w.athlete} <span className="mono">{x.w.mark}</span></span>)}</div>
    </div>
  );
}
const PILL: Record<string, string> = { Régional: "", National: "nat", International: "intl", Club: "jeune" };
export const Fx = ({ c, res }: { c: CalItem; res?: React.ReactNode }) => (
  <Link href={c.resultsUrl ? `/competitions/${c.id}` : `/competitions#c-${c.id}`} className="fx">
    <div className="fx-date"><div className="fx-d">{dd(c.dateFrom)}</div><div className="fx-m">{mon(c.dateFrom)}</div></div>
    <div><div className="fx-n">{c.name}</div><div className="fx-meta"><span className={`pill ${PILL[c.level] ?? ""}`}>{c.level}</span> {c.venue} · {c.city}</div></div>
    {res ?? <div className="fx-go">{c.status === "entries_open" ? "Engager →" : c.resultsUrl ? "Résultats →" : "Détail →"}</div>}
  </Link>
);
/** Section agenda de la page d'accueil : à venir + derniers résultats, depuis l'API. */
export async function Agenda() {
  const { items } = await api.season();
  const today = new Date().toISOString().slice(0, 10);
  const up = items.filter((c) => c.dateTo >= today).slice(0, 5);
  const past = items.filter((c) => c.resultsUrl).sort((a, b) => (a.dateFrom < b.dateFrom ? 1 : -1)).slice(0, 5);
  return (
    <section id="agenda" className="has-illus">
      <div className="illus" aria-hidden="true"><svg viewBox="0 0 1200 620" preserveAspectRatio="xMidYMid meet" style={{ right: -180, top: "50%", transform: "translateY(-50%)", width: 900, height: 620 }}><path d="M340 60 h420 a250 250 0 0 1 0 500 h-420 a250 250 0 0 1 0-500 z" stroke="rgba(11,20,16,.1)" strokeWidth="1.6" /><path d="M340 110 h420 a200 200 0 0 1 0 400 h-420 a200 200 0 0 1 0-400 z" stroke="rgba(11,20,16,.08)" strokeWidth="1.6" /><path d="M340 160 h420 a150 150 0 0 1 0 300 h-420 a150 150 0 0 1 0-300 z" stroke="rgba(0,224,90,.45)" strokeWidth="1.6" /><path d="M340 210 h420 a100 100 0 0 1 0 200 h-420 a100 100 0 0 1 0-200 z" stroke="rgba(11,20,16,.07)" strokeWidth="1.6" /></svg></div>
      <div className="wrap">
        <div className="sec-head"><div><div className="eyebrow">Saison 26/27 · calendrier fédéral</div><h2 style={{ marginTop: 14 }}>Le prochain<br />dossard</h2></div><Link href="/competitions" className="sec-link">Tout le calendrier</Link></div>
        <div className="fix">
          <div className="fix-col"><h3 className="poster">À venir</h3>{up.map((c) => <Fx key={c.id} c={c} />)}{!up.length && <p className="dim">Calendrier en cours de publication.</p>}</div>
          <div className="fix-col"><h3 className="poster">Derniers résultats</h3>{past.map((c) => <Fx key={c.id} c={c} res={<div className="fx-res"><span className="mono">{c.events.length} épreuves</span></div>} />)}</div>
        </div>
      </div>
    </section>
  );
}
/** « Les chiffres ne mentent pas » : trois finales de la dernière compétition publiée, avec onglets. */
export async function LiveResults() {
  const { items } = await api.season();
  const last = items.filter((c) => c.resultsUrl && c.level !== "Club").sort((a, b) => (a.dateFrom < b.dateFrom ? 1 : -1))[0];
  const comp = last ? await api.competition(last.id) : null;
  if (!comp || "error" in comp) return null;
  const evs = [...comp.events].filter((e) => e.results.length >= 3).sort((a, b) => Math.max(...b.results.map((r) => r.points)) - Math.max(...a.results.map((r) => r.points))).slice(0, 3);
  return (
    <section className="dark" id="live">
      <div className="gridlines" aria-hidden="true" />
      <div className="wrap">
        <div className="sec-head"><div><div className="eyebrow dark">Chronos officiels · résultats publiés par la fédération</div><h2 style={{ marginTop: 14 }}>Les chiffres<br />ne mentent pas</h2></div>
          <div className="tabs" id="resTabs" role="tablist" aria-label="Épreuves">{evs.map((e, k) => <button key={k} className="tab" role="tab" aria-selected={k === 0} data-r={`r${k + 1}`}>{e.event} {e.sex === "F" ? "F" : "H"}</button>)}</div></div>
        {evs.map((e, k) => (
          <div className="panel" id={`r${k + 1}`} key={k} hidden={k !== 0}>
            <div className="panel-top"><div><div className="panel-ev">{e.event} {e.sex === "F" ? "Femmes" : "Hommes"} — Finale</div><div className="panel-meta">{fmtDate(comp.dateFrom)} · {comp.venue}, {comp.city} · {comp.name}</div></div>{e.results.some((r) => r.record) ? <span className="badge b-rn">Record battu</span> : <span className="badge b-q">{e.results.length} classés</span>}</div>
            <div className="scrollx"><table className="tbl"><thead><tr><th style={{ width: 64 }}>Pos</th><th>Athlète</th><th>Club</th><th>Perf.</th>{e.kind === "t" && <th>Vent</th>}<th>Pts</th></tr></thead><tbody>
              {e.results.slice(0, 6).map((r) => <tr key={r.athleteId}><td><span className={`rank ${r.rank === 1 ? "g" : r.rank === 2 ? "s" : r.rank === 3 ? "b" : ""}`}>{r.rank}</span></td><td><div className="who"><span className="ava">{r.athlete.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span><div><div><Link href={`/athletes/${r.athleteId}`}>{r.athlete}</Link></div><div className="who-s">SEN · {r.category}</div></div></div></td><td className="dim">{r.club}</td><td><span className="perf">{r.mark}</span></td>{e.kind === "t" && <td className="dim mono">{r.wind != null ? (r.wind > 0 ? "+" : "") + r.wind.toFixed(1) : "—"}</td>}<td className="dim mono">{r.points}</td></tr>)}
            </tbody></table></div>
          </div>
        ))}
        <p className="dim" style={{ marginTop: 18, fontSize: 13 }}>Résultats saisis par les juges et publiés depuis la plateforme fédérale — <Link href={`/competitions/${comp.id}`} className="sec-link">tous les résultats de {comp.name}</Link></p>
      </div>
    </section>
  );
}
/** Tableau des records nationaux (page d'accueil et page records). */
export function RecordsTable({ items, full }: { items: Record_[]; full?: boolean }) {
  const list = full ? items : items.filter((r) => r.scope === "national").slice(0, 10);
  return (
    <div className="panel-l">
      <div className="scrollx"><table className="tbl" id="recTable"><thead><tr>{full && <th>Niveau</th>}<th>Épreuve</th><th>Performance</th><th>Athlète</th><th>Lieu</th><th>Date</th></tr></thead><tbody>
        {list.map((r, k) => <tr key={k}>{full && <td className="dim">{r.scope === "national" ? "Sénégal" : r.region}</td>}<td>{r.event} — {r.sex === "F" ? "Femmes" : "Hommes"}</td><td><span className="perf">{r.mark}</span></td><td>{r.holder}{r.club ? <span className="dim"> · {r.club}</span> : null}</td><td className="dim">{r.venue ?? "—"}</td><td className="dim mono">{r.date ? fmtDate(r.date) : "—"}</td></tr>)}
      </tbody></table></div>
      <div className="empty" id="recEmpty" hidden>Aucun record ne correspond à cette recherche.</div>
    </div>
  );
}
export { nf };
