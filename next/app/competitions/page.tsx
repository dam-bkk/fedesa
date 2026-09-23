import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { Fx } from "@/components/Data";
import { Subscribe } from "@/components/Subscribe";
export const revalidate = 300;
export const metadata: Metadata = { title: "Calendrier des compétitions", description: "Calendrier fédéral et régional : stade, cross, route. Statut des engagements et résultats publiés." };
const ML = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
export default async function Competitions({ searchParams }: { searchParams: Promise<{ niveau?: string }> }) {
  const lang = await getLang(); const t = tr(lang);
  const { niveau = "" } = await searchParams;
  const { items } = await api.season();
  const list = items.filter((c) => !niveau || c.level.toLowerCase().startsWith(niveau.slice(0, 5)));
  const months = new Map<string, typeof list>(); list.forEach((c) => { const k = c.dateFrom.slice(0, 7); months.set(k, [...(months.get(k) ?? []), c]); });
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">{t("Saison 2026-27 · calendrier officiel · mis à jour depuis la plateforme fédérale")}</div><h1>{t("Calendrier")}</h1>
        <p className="intro">{t("Toutes les compétitions inscrites au calendrier par la fédération et les ligues. Les engagements se font par les clubs ; les résultats sont publiés ici dès leur validation par les juges.")}</p>
        <div className="tabs" style={{ marginTop: 22 }}>{[["", "Tout"], ["regional", "Régional"], ["national", "National"], ["international", "International"]].map(([k, l]) => <Link key={k} href={k ? `/competitions?niveau=${k}` : "/competitions"} className="tab" aria-current={niveau === k ? "page" : undefined}>{l}</Link>)}</div></div>
      <section><div className="wrap">
        {[...months.entries()].map(([m, cs]) => <div key={m}><h2 className="cal-month">{ML[+m.slice(5, 7) - 1]} {m.slice(0, 4)}</h2><div className="fix-col">{cs.map((c) => <div id={`c-${c.id}`} key={c.id}><Fx c={c} res={c.resultsUrl ? <div className="fx-res"><span className="badge b-q">{t("Résultats")}</span></div> : c.status === "entries_open" ? <div className="fx-go">{t("Engagements ouverts →")}</div> : <div className="fx-go">{c.events.length} {t("épreuves")}</div>} /></div>)}</div></div>)}
        {!list.length && <p className="dim">{t("Aucune compétition pour ce filtre.")}</p>}
        <div id="dakar-2027" className="hero-strip" style={{ marginTop: 50 }}><div className="hs-l"><span className="dot" style={{ color: "var(--volt)" }} />{t("Grand rendez-vous — Championnats d'Afrique, Dakar · 12–16 mai 2027")}</div><Link href="/epreuves" className="btn btn-ink btn-sm">{t("Les épreuves")}</Link></div>
        <div style={{ marginTop: 40 }}><Subscribe lang={lang} /></div>
      </div></section>
    </main>
  );
}
