import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./fedesa.css";
import { Header } from "@/components/Header";
import Footer from "@/components/parts/Footer";
import { Enhance } from "@/components/Enhance";
import { getLang } from "@/lib/server/lang";
import { tr } from "@/lib/i18n";
import { setLang } from "./actions";

const poster = Anton({ weight: "400", subsets: ["latin"], variable: "--f-poster", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--f-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://fedesa.damien.asia"),
  title: { default: "FEDESA — Fédération Sénégalaise d'Athlétisme", template: "%s · FEDESA" },
  description: "Le site de la Fédération Sénégalaise d'Athlétisme : calendrier, résultats officiels, records, clubs, licences et actualités.",
  openGraph: { type: "website", locale: "fr_SN", siteName: "FEDESA" },
};
export const viewport: Viewport = { themeColor: "#0B1410", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang(); const t = tr(lang);
  return (
    <html lang={lang} className={`${poster.variable} ${body.variable} ${mono.variable}`}>
      <body><Header lang={lang} setLang={setLang} />{children}<Footer t={t} /><Enhance /></body>
    </html>
  );
}
