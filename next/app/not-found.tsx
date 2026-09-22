import Link from "next/link";
import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
export default async function NotFound() {
  const t = tr(await getLang());
  return <main><div className="wrap page-head"><div className="eyebrow">{t("Erreur 404")}</div><h1>{t("Faux")}<br />{t("départ")}</h1><p className="intro">{t("Cette page n'existe pas ou plus.")} <Link href="/" className="sec-link">{t("Retour à l'accueil →")}</Link></p></div></main>;
}
