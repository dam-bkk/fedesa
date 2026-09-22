import type { Metadata } from "next";
import { Weekend } from "@/components/Features";
import { Subscribe } from "@/components/Subscribe";
import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
export const revalidate = 300;
export const metadata: Metadata = { title: "Le week-end en chiffres" };
export default async function WeekEnd() {
  const lang = await getLang(); const t = tr(lang);
  return <main><div className="wrap page-head"><div className="eyebrow">{t("Généré automatiquement le dimanche soir depuis les résultats publiés")}</div><h1>{t("Le week-end")}<br />{t("en chiffres")}</h1></div><Weekend full /><section style={{ paddingTop: 0 }}><div className="wrap"><Subscribe lang={lang} /></div></section></main>;
}
