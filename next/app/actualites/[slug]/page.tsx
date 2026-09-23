import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS } from "@/lib/content";
import { fmtDate } from "@/lib/api";
export function generateStaticParams() { return POSTS.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const p = POSTS.find((x) => x.slug === slug); return { title: p?.title ?? "Actualité", description: p?.excerpt, alternates: { canonical: `/actualites/${slug}` }, openGraph: { type: "article", publishedTime: p?.date, images: p?.img ? [p.img] : undefined } }; }
export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const lang = await getLang(); const t = tr(lang);
  const { slug } = await params; const p = POSTS.find((x) => x.slug === slug);
  if (!p) notFound();
  const ld = { "@context": "https://schema.org", "@type": "NewsArticle", headline: p.title, description: p.excerpt, datePublished: p.date, image: [`https://fedesa.damien.asia${p.img}`], articleSection: p.cat, inLanguage: lang, mainEntityOfPage: `https://fedesa.damien.asia/actualites/${p.slug}`, publisher: { "@type": "SportsOrganization", name: "Fédération Sénégalaise d'Athlétisme", url: "https://fedesa.damien.asia" } };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="wrap page-head"><div className="eyebrow">{t(p.cat)} · {fmtDate(p.date, true)}</div><h1 style={{ fontSize: "clamp(36px,5.5vw,72px)" }}>{t(p.title)}</h1></div>
      <section><div className="wrap"><article className="post"><p className="intro" style={{ fontSize: 19, marginTop: 0 }}>{t(p.excerpt)}</p><div className="lead-media"><img src={p.img} alt="" width="1200" height="800" /></div>{p.body.map((t, i) => <p key={i}>{t}</p>)}<p><Link href="/actualites" className="sec-link">{t("← Toutes les actualités")}</Link></p></article></div></section>
    </main>
  );
}
