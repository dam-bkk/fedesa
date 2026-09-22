import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
import type { Metadata } from "next";
import { GALERIE } from "@/lib/content";
export const metadata: Metadata = { title: "Médias", description: "Galerie photo de la fédération." };
export default async function Medias() {
  const lang = await getLang(); const t = tr(lang);
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">{t("Galerie · photos de la fédération et des ligues")}</div><h1>{t("Médias")}</h1></div>
      <section><div className="wrap"><div className="gal-grid">{GALERIE.map((g) => <figure key={g.src}><img src={g.src} alt={t(g.alt)} loading="lazy" /><figcaption>{t(g.cap)}</figcaption></figure>)}</div></div></section>
    </main>
  );
}
