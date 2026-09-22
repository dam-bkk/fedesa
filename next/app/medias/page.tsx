import type { Metadata } from "next";
import { GALERIE } from "@/lib/content";
export const metadata: Metadata = { title: "Médias", description: "Galerie photo de la fédération." };
export default function Medias() {
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">Galerie · photos de la fédération et des ligues</div><h1>Médias</h1></div>
      <section><div className="wrap"><div className="gal-grid">{GALERIE.map((g) => <figure key={g.src}><img src={g.src} alt={g.alt} loading="lazy" /><figcaption>{g.cap}</figcaption></figure>)}</div></div></section>
    </main>
  );
}
