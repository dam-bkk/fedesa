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

export const revalidate = 300;

export default async function Home() {
  const [stats, records, clubs] = await Promise.all([api.stats(), api.records(), api.clubs()]);
  const st = { licensees: stats?.licensees ?? 0, clubs: stats?.clubs ?? clubs.count, ligues: 14, results: stats?.results ?? 0 };
  return (
    <main>
      <Hero stats={st} />
      <RecordsMarquee />
      <Epreuves />
      <Actus />
      <LiveResults />
      <LiveMarquee />
      <Agenda />
      <Galerie />
      <Athlete />
      <section id="regions">
        <div className="wrap">
          <div className="sec-head"><div><div className="eyebrow">De Dakar à Ziguinchor</div><h2 style={{ marginTop: 14 }}>{nf(st.clubs)} clubs.<br />Une porte<br />d&apos;entrée.</h2></div><Link href="/clubs" className="sec-link">Trouver le tien</Link></div>
          <p className="intro" style={{ maxWidth: "62ch", marginBottom: 26 }}>On ne prend pas sa licence seul : on rejoint un club affilié, qui dépose la demande et reste l&apos;interlocuteur de l&apos;athlète toute la saison. Survolez la carte pour trouver le vôtre.</p>
          <ClubMap clubs={clubs.items} />
        </div>
      </section>
      <section id="records" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head"><div><div className="eyebrow">Homologués · à battre</div><h2 style={{ marginTop: 14 }}>Records<br />du Sénégal</h2></div><Link href="/records" className="sec-link">Tous les records</Link></div>
          <RecordsTable items={records.items} />
        </div>
      </section>
      <LicencesBand />
      <Federation />
      <Partenaires />
      <Faq />
    </main>
  );
}
