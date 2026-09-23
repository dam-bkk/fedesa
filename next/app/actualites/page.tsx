import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/content";
import { fmtDate } from "@/lib/api";
export const metadata: Metadata = { title: "Actualités", description: "Top info de la Fédération Sénégalaise d'Athlétisme : compétitions, sélections, formations." };
export default async function Actualites() {
  const lang = await getLang(); const t = tr(lang);
  const [lead, ...rest] = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">{t("Top info · communiqués fédéraux")}</div><h1>{t("Actualités")}</h1></div>
      <section><div className="wrap">
        <div className="news-grid">
          <Link href={`/actualites/${lead.slug}`} className="lead"><div className="lead-media"><span className="catchip red">{t(lead.cat)}</span><img src={lead.img} alt="" width="1200" height="800" /></div><div className="lead-body"><div className="dateline">{fmtDate(lead.date, true)}</div><h2 className="lead-h">{t(lead.title)}</h2><p>{t(lead.excerpt)}</p></div></Link>
          <div className="rows">{rest.map((p) => <Link key={p.slug} href={`/actualites/${p.slug}`} className="row"><div className="row-img"><img src={p.img} alt="" width="800" height="600" loading="lazy" /></div><div><span className={`catchip ${p.cat === "Formation" ? "gold" : p.cat === "Compétition" ? "ink" : ""}`}>{t(p.cat)}</span><h3>{t(p.title)}</h3><div className="dateline" style={{ marginTop: 7 }}>{fmtDate(p.date, true)}</div></div></Link>)}</div>
        </div>
      </div></section>
    </main>
  );
}
