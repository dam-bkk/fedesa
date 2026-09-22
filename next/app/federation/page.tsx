import type { Metadata } from "next";
import Link from "next/link";
import Federation from "@/components/parts/Federation";
import Partenaires from "@/components/parts/Partenaires";
import { BUREAU, HISTOIRE, LIGUES, CONTACT } from "@/lib/content";
import { api } from "@/lib/api";
export const revalidate = 3600;
export const metadata: Metadata = { title: "La fédération", description: "Présentation, bureau fédéral, histoire, les 14 ligues régionales et les partenaires de la FEDESA." };
export default async function FederationPage() {
  const stats = await api.stats();
  const byRegion = new Map((stats?.byRegion ?? []).map((r) => [r.code, r.licensees]));
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">Fédération Sénégalaise d&apos;Athlétisme · depuis 1960</div><h1>La<br />fédération</h1><p className="intro">Affiliée à World Athletics et à la Confédération Africaine d&apos;Athlétisme, la FEDESA organise, forme et sélectionne : 14 ligues régionales, les clubs affiliés, les officiels et les équipes nationales. Siège au Stade Iba Mar Diop, à Dakar.</p></div>
      <Federation />
      <section id="bureau" style={{ paddingTop: 0 }}><div className="wrap"><div className="sec-head"><div><div className="eyebrow">Élus pour l&apos;olympiade</div><h2 style={{ marginTop: 14 }}>Bureau<br />fédéral</h2></div></div>
        <div className="bureau">{BUREAU.map((b) => <div key={b.role}><span className="r">{b.role}</span><b>{b.name}</b></div>)}</div>
        <p className="dim" style={{ marginTop: 12, fontSize: 13 }}>Composition publiée sur fedesa.sn ; les postes marqués « — » seront complétés par le secrétariat général.</p></div></section>
      <section id="histoire" style={{ paddingTop: 0 }}><div className="wrap"><div className="sec-head"><div><div className="eyebrow">1960 → 2027</div><h2 style={{ marginTop: 14 }}>Soixante ans<br />de piste</h2></div></div>
        <ul className="tl">{HISTOIRE.map((h) => <li key={h.y}><div className="y">{h.y}</div><b>{h.t}</b><p>{h.d}</p></li>)}</ul></div></section>
      <section id="ligues" style={{ paddingTop: 0 }}><div className="wrap"><div className="sec-head"><div><div className="eyebrow">Situation géographique</div><h2 style={{ marginTop: 14 }}>Les 14<br />ligues</h2></div><Link href="/clubs" className="sec-link">Carte des clubs</Link></div>
        <div className="ligues">{LIGUES.map((l) => <div className="ligue" id={`ligue-${l.code}`} key={l.code}><b>{l.name}</b><span>{l.venue}</span><span className="mono dim">{(byRegion.get(l.code) ?? 0).toLocaleString("fr-FR")} licenciés</span><span className="dim">{l.bureau ? "Bureau de ligue publié" : "Bureau : non communiqué"}</span><Link href={`/clubs?ligue=${l.code}`} className="sec-link" style={{ marginTop: 6 }}>Clubs de la ligue →</Link></div>)}</div></div></section>
      <section id="formations" style={{ paddingTop: 0 }}><div className="wrap"><div className="sec-head"><div><div className="eyebrow">Encadrement</div><h2 style={{ marginTop: 14 }}>Formations</h2></div></div>
        <div className="steps"><div className="step"><div className="step-n">Entraîneurs</div><h4>Niveaux 1 à 3</h4><p>Cursus World Athletics dispensé par la direction technique nationale, sessions dans les ligues.</p></div><div className="step"><div className="step-n">Officiels</div><h4>Juges et chronométreurs</h4><p>Homologation des juges-arbitres, starters et juges de concours ; recyclage annuel.</p></div><div className="step"><div className="step-n">Dirigeants</div><h4>Gestion de club</h4><p>Affiliation, licences en ligne, organisation d&apos;une compétition, antidopage avec l&apos;ONADS.</p></div></div></div></section>
      <Partenaires />
      <section id="contact" style={{ paddingTop: 0 }}><div className="wrap"><div className="sec-head"><div><div className="eyebrow">Nous écrire</div><h2 style={{ marginTop: 14 }}>Contact</h2></div></div>
        <dl className="kv"><dt>Siège</dt><dd>{CONTACT.venue}, {CONTACT.street}, {CONTACT.city}</dd><dt>Téléphone</dt><dd className="mono">{CONTACT.phone}</dd><dt>E-mail</dt><dd>{CONTACT.email}</dd><dt>Horaires</dt><dd>{CONTACT.hours}</dd></dl></div></section>
    </main>
  );
}
