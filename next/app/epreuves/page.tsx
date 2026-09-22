import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
import type { Metadata } from "next";
import { Epreuves } from "@/components/Epreuves";
export const metadata: Metadata = { title: "Les épreuves", description: "Les quatorze familles d'épreuves pratiquées au Sénégal : règles, records du monde et du Sénégal." };
export default async function EpreuvesPage() {
  const lang = await getLang(); const t = tr(lang);
  return (
    <main>
      <div className="wrap page-head"><div className="eyebrow">{t("Sprint, haies, demi-fond, sauts, lancers, route…")}</div><h1>{t("Les")}<br />{t("épreuves")}</h1><p className="intro">{t("Cliquez sur une épreuve pour ses règles essentielles, les records du monde et ceux du Sénégal. Les quatre grandes tuiles sont les épreuves où le Sénégal compte un podium mondial ou olympique.")}</p></div>
      <Epreuves lang={lang} />
    </main>
  );
}
