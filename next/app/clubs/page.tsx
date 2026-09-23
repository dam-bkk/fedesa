import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
import type { Metadata } from "next";
import { api, nf } from "@/lib/api";
import { ClubMap } from "@/components/ClubMap";
import { LIGUES } from "@/lib/content";
export const revalidate = 3600;
export const metadata: Metadata = { title: "Trouver un club", description: "Annuaire et carte des clubs affiliés à la Fédération Sénégalaise d'Athlétisme, avec contacts." };
export default async function Clubs({ searchParams }: { searchParams: Promise<{ ligue?: string }> }) {
  const lang = await getLang(); const t = tr(lang);
  const { ligue = "" } = await searchParams;
  const [{ items }, stats, season] = await Promise.all([api.clubs(), api.stats(), api.season()]);
  const today = new Date().toISOString().slice(0, 10); const soon = new Date(Date.now() + 8 * 864e5).toISOString().slice(0, 10);
  const active = season.items.filter((c) => c.dateTo >= today && c.dateFrom <= soon).map((c) => c.city);
  const byRegion = LIGUES.map((l) => ({ ...l, clubs: items.filter((c) => c.regionCode === l.code) })).filter((l) => !ligue || l.code === ligue);
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">{nf(items.length)} {t("clubs affiliés · 14 ligues")}</div><h1>{t("Trouver")}<br />{t("son club")}</h1>
        <p className="intro">{t("L'athlétisme se pratique en club. C'est le club qui vous accueille, vous inscrit et dépose votre demande de licence auprès de la fédération — il n'y a pas d'inscription individuelle. Choisissez le vôtre par ville ou par ligue, et contactez-le directement.")}</p></div>
      <section><div className="wrap">
        <ClubMap clubs={items} active={active} lang={lang} />
        <div id="chiffres" className="hero-stats" style={{ marginTop: 40 }}>
          <div className="hstat"><div className="hstat-n">{nf(stats?.licensees ?? 0)}</div><div className="hstat-l">{t("Licenciés")}</div></div>
          <div className="hstat"><div className="hstat-n">{nf(items.length)}</div><div className="hstat-l">{t("Clubs affiliés")}</div></div>
          <div className="hstat"><div className="hstat-n">14</div><div className="hstat-l">{t("Ligues régionales")}</div></div>
          <div className="hstat"><div className="hstat-n">{stats ? Math.round((stats.women / Math.max(1, stats.licensees)) * 100) : 0} %</div><div className="hstat-l">{t("de femmes")}</div></div>
        </div>
        <div className="tools" style={{ marginTop: 40 }}><form><label htmlFor="ligue" className="vis-hidden">{t("Ligue")}</label><select id="ligue" name="ligue" defaultValue={ligue} className="sel"><option value="">{t("Toutes les ligues")}</option>{LIGUES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}</select><button className="btn btn-ink btn-sm" style={{ marginLeft: 10 }}>{t("Filtrer")}</button></form></div>
        {byRegion.map((l) => (
          <div key={l.code} id={`ligue-${l.code}`}>
            <div className="dir-h"><h2>{t("Ligue de")} {l.name}</h2><span>{l.clubs.length} {t("club")}{l.clubs.length > 1 ? "s" : ""} · {l.venue}</span></div>
            <div className="dir">{l.clubs.map((c) => <div className="dir-i" key={c.id}><b>{c.name}</b><span>{c.city}{c.founded ? ` · fondé en ${c.founded}` : ""} · {c.licensees} {t("licenciés")}</span>{c.president && <span>{t("Président·e :")} {c.president}</span>}<span className="mono">{c.phone}{c.email ? ` · ${c.email}` : ""}</span></div>)}</div>
          </div>
        ))}
      </div></section>
    </main>
  );
}
