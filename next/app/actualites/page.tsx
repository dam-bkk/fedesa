import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/content";
import { fmtDate } from "@/lib/api";
export const metadata: Metadata = { title: "Actualités", description: "Top info de la Fédération Sénégalaise d'Athlétisme : compétitions, sélections, formations." };
export default function Actualites() {
  const [lead, ...rest] = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">Top info · communiqués fédéraux</div><h1>Actualités</h1></div>
      <section><div className="wrap">
        <div className="news-grid">
          <Link href={`/actualites/${lead.slug}`} className="lead"><div className="lead-media"><span className="catchip red">{lead.cat}</span><img src={lead.img} alt="" width="1200" height="800" /></div><div className="lead-body"><div className="dateline">{fmtDate(lead.date, true)}</div><h3>{lead.title}</h3><p>{lead.excerpt}</p></div></Link>
          <div className="rows">{rest.map((p) => <Link key={p.slug} href={`/actualites/${p.slug}`} className="row"><div className="row-img"><img src={p.img} alt="" width="800" height="600" loading="lazy" /></div><div><span className={`catchip ${p.cat === "Formation" ? "gold" : p.cat === "Compétition" ? "ink" : ""}`}>{p.cat}</span><h4>{p.title}</h4><div className="dateline" style={{ marginTop: 7 }}>{fmtDate(p.date, true)}</div></div></Link>)}</div>
        </div>
      </div></section>
    </main>
  );
}
