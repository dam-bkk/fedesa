import type { Metadata } from "next";
import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
import Link from "next/link";
import Hero from "@/components/parts/Hero";
import Actus from "@/components/parts/Actus";
import Galerie from "@/components/parts/Galerie";
import Athlete from "@/components/parts/Athlete";
import LicencesBand from "@/components/parts/LicencesBand";
import Federation from "@/components/parts/Federation";
import Partenaires from "@/components/parts/Partenaires";
import Faq from "@/components/parts/Faq";
import { Epreuves } from "@/components/Epreuves";
import { RecordsMarquee, LiveMarquee, Agenda, LiveResults, RecordsTable } from "@/components/Data";
import { ClubMap } from "@/components/ClubMap";
import { api, nf } from "@/lib/api";
import { Timeline, Monde, ClubStandings, Weekend } from "@/components/Features";
import { CatCalc } from "@/components/CatCalc";
import { Subscribe } from "@/components/Subscribe";

export const revalidate = 300;
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const lang = await getLang(); const t = tr(lang);
  const [stats, records, clubs, season, tarifs] = await Promise.all([api.stats(), api.records(), api.clubs(), api.season(), api.tarifs()]);
  const today = new Date().toISOString().slice(0, 10); const soon = new Date(Date.now() + 8 * 864e5).toISOString().slice(0, 10);
  const activeCities = season.items.filter((c) => c.dateTo >= today && c.dateFrom <= soon).map((c) => c.city);
  const st = { licensees: stats?.licensees ?? 0, clubs: stats?.clubs ?? clubs.count, ligues: 14, results: stats?.results ?? 0 };
  return (
    <main>
      <Hero stats={st}  t={t} />
      <RecordsMarquee />
      <Epreuves lang={lang} />
      <Actus  t={t} />
      <LiveResults />
      <LiveMarquee />
      <Weekend />
      <Agenda />
      <Monde />
      <Galerie  t={t} />
      <Athlete  t={t} />
      <ClubStandings teaser />
      <section id="regions">
        <div className="wrap">
          <div className="sec-head"><div><div className="eyebrow">{t("De Dakar à Ziguinchor")}</div><h2 style={{ marginTop: 14 }}>{nf(st.clubs)} {t("clubs.")}<br />{t("Une porte")}<br />{t("d'entrée.")}</h2></div><Link href="/clubs" className="sec-link">{t("Trouver le tien")}</Link></div>
          <p className="intro" style={{ maxWidth: "62ch", marginBottom: 26 }}>{t("On ne prend pas sa licence seul : on rejoint un club affilié, qui dépose la demande et reste l'interlocuteur de l'athlète toute la saison. Survolez la carte pour trouver le vôtre.")}</p>
          <ClubMap clubs={clubs.items} active={activeCities} lang={lang} />
        </div>
      </section>
      <section id="records" className="tight">
        <div className="wrap">
          <div className="sec-head"><div><div className="eyebrow">{t("Homologués · à battre")}</div><h2 style={{ marginTop: 14 }}>{t("Records")}<br />{t("du Sénégal")}</h2></div><Link href="/records" className="sec-link">{t("Tous les records")}</Link></div>
          <RecordsTable items={records.items} />
        </div>
      </section>
      <LicencesBand  t={t} />
      <section className="tight"><div className="wrap"><CatCalc lang={lang} fees={tarifs?.fees ?? []} season={tarifs?.season} /></div></section>
      <Timeline />
      <Federation  t={t} />
      <Partenaires  t={t} />
      <Faq  t={t} />
      <section className="tight"><div className="wrap"><Subscribe lang={lang} /></div></section>
    </main>
  );
}
