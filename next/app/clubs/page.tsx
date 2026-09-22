import type { Metadata } from "next";
import { api, nf } from "@/lib/api";
import { ClubMap } from "@/components/ClubMap";
import { LIGUES } from "@/lib/content";
export const revalidate = 3600;
export const metadata: Metadata = { title: "Trouver un club", description: "Annuaire et carte des clubs affiliés à la Fédération Sénégalaise d'Athlétisme, avec contacts." };
export default async function Clubs({ searchParams }: { searchParams: Promise<{ ligue?: string }> }) {
  const { ligue = "" } = await searchParams;
  const [{ items }, stats] = await Promise.all([api.clubs(), api.stats()]);
  const byRegion = LIGUES.map((l) => ({ ...l, clubs: items.filter((c) => c.regionCode === l.code) })).filter((l) => !ligue || l.code === ligue);
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">{nf(items.length)} clubs affiliés · 14 ligues</div><h1>Trouver<br />son club</h1>
        <p className="intro">L&apos;athlétisme se pratique en club. C&apos;est le club qui vous accueille, vous inscrit et dépose votre demande de licence auprès de la fédération — il n&apos;y a pas d&apos;inscription individuelle. Choisissez le vôtre par ville ou par ligue, et contactez-le directement.</p></div>
      <section><div className="wrap">
        <ClubMap clubs={items} />
        <div id="chiffres" className="hero-stats" style={{ marginTop: 40 }}>
          <div className="hstat"><div className="hstat-n">{nf(stats?.licensees ?? 0)}</div><div className="hstat-l">Licenciés</div></div>
          <div className="hstat"><div className="hstat-n">{nf(items.length)}</div><div className="hstat-l">Clubs affiliés</div></div>
          <div className="hstat"><div className="hstat-n">14</div><div className="hstat-l">Ligues régionales</div></div>
          <div className="hstat"><div className="hstat-n">{stats ? Math.round((stats.women / Math.max(1, stats.licensees)) * 100) : 0} %</div><div className="hstat-l">de femmes</div></div>
        </div>
        <div className="tools" style={{ marginTop: 40 }}><form><label htmlFor="ligue" className="vis-hidden">Ligue</label><select id="ligue" name="ligue" defaultValue={ligue} className="sel"><option value="">Toutes les ligues</option>{LIGUES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}</select><button className="btn btn-ink btn-sm" style={{ marginLeft: 10 }}>Filtrer</button></form></div>
        {byRegion.map((l) => (
          <div key={l.code} id={`ligue-${l.code}`}>
            <div className="dir-h"><h3>Ligue de {l.name}</h3><span>{l.clubs.length} club{l.clubs.length > 1 ? "s" : ""} · {l.venue}</span></div>
            <div className="dir">{l.clubs.map((c) => <div className="dir-i" key={c.id}><b>{c.name}</b><span>{c.city}{c.founded ? ` · fondé en ${c.founded}` : ""} · {c.licensees} licenciés</span>{c.president && <span>Président·e : {c.president}</span>}<span className="mono">{c.phone}{c.email ? ` · ${c.email}` : ""}</span></div>)}</div>
          </div>
        ))}
      </div></section>
    </main>
  );
}
