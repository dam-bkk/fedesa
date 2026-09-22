"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { LIGUES } from "@/lib/content";
import { APP_URL } from "@/lib/api";
import { tr, type Lang } from "@/lib/i18n";

const NAV: [string, string][] = [["/actualites", "Actualités"], ["/competitions", "Compétitions"], ["/resultats", "Résultats"], ["/athletes", "Athlètes"], ["/medias", "Médias"], ["/clubs", "Clubs"], ["/federation", "La Fédé"]];
const COLS: { h: string; links: [string, string][] }[] = [
  { h: "La fédération", links: [["/federation", "À propos"], ["/federation#histoire", "Historique"], ["/federation#ligues", "Situation géographique"], ["/federation#bureau", "Bureau fédéral"], ["/federation#bureau", "Comité directeur"], ["/clubs", "Nombre de clubs"], ["/clubs#chiffres", "Nombre de licenciés"], ["/federation#partenaires", "Partenaires"]] },
  { h: "Compétitions", links: [["/competitions", "Calendrier fédéral"], ["/competitions?niveau=regional", "Calendrier régional"], ["/competitions?niveau=national", "National"], ["/competitions?niveau=international", "International"], ["/resultats", "Résultats techniques"], ["/records", "Records du Sénégal"], ["/competitions#dakar-2027", "Grand rendez-vous"]] },
  { h: "Pratiquer", links: [["/epreuves", "Les épreuves"], ["/clubs", "Trouver un club"], ["/licence", "Prendre une licence"], ["/licence#tarifs", "Tarifs des licences"], ["/federation#formations", "Formations"], ["/athletes", "Athlètes"], ["/medias", "Galerie"], ["/actualites", "Actualités · Top info"]] },
];

export function Header({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => Promise<void> }) {
  const t = tr(lang);
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); }; window.addEventListener("keydown", k); return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; }; }, [open]);
  const Burger = ({ x }: { x?: boolean }) => (<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">{x ? <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" /> : <path d="M3 6h16M3 11h16M3 16h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />}</svg>);
  return (
    <header className="nav">
      <div className="wrap">
        <Link href="/" className="brand" aria-label={t("FEDESA — accueil")}><span className="brand-mark"><Logo size={26} /></span><span><span className="brand-name">FEDESA</span><span className="brand-sub" style={{ display: "block" }}>{t("Athlétisme Sénégal")}</span></span></Link>
        <nav className="nav-links" aria-label={t("Navigation principale")}>{NAV.map(([h, l]) => <Link key={h} href={h} className={path.startsWith(h) ? "on" : ""}>{t(l)}</Link>)}</nav>
        <div className="nav-cta"><div className="lang" role="group" aria-label="Langue / Language">{(["fr", "en"] as const).map((k) => <button key={k} type="button" className={lang === k ? "on" : ""} aria-pressed={lang === k} onClick={() => setLang(k)}>{k.toUpperCase()}</button>)}</div><a href={APP_URL} className="btn btn-oink btn-sm">{t("Espace club")}</a><Link href="/licence" className="btn btn-ink btn-sm">{t("Licences 26/27")}</Link></div>
        <button className="mbtn mbtn-ico" type="button" aria-expanded={open} aria-controls="mega" aria-label={open ? t("Fermer le menu") : t("Ouvrir le menu")} onClick={() => setOpen((o) => !o)}><Burger x={open} /></button>
      </div>
      {open && (
        <div className="mega" id="mega">
          <div className="wrap">
            <div className="mega-top">
              <Link href="/" className="brand"><span className="brand-mark"><Logo size={26} /></span><div><span className="brand-name" style={{ color: "#fff", display: "block" }}>FEDESA</span><span className="brand-sub" style={{ display: "block" }}>{t("Athlétisme Sénégal")}</span></div></Link>
              <button className="mbtn mbtn-ico" type="button" aria-label={t("Fermer le menu")} onClick={() => setOpen(false)}><Burger x /></button>
            </div>
            <div className="mega-cols">
              {COLS.map((c) => <div className="mcol" key={c.h}><h3>{t(c.h)}</h3>{c.links.map(([h, l]) => <Link key={h + l} href={h}>{t(l)}</Link>)}</div>)}
              <div className="mcol"><h3>{t("Les 14 ligues")}</h3><div className="two">{LIGUES.map((l) => <Link key={l.code} href={`/federation#ligue-${l.code}`}>{l.name}</Link>)}</div></div>
            </div>
            <div className="mega-foot">
              <div className="mega-cta"><Link href="/licence" className="btn btn-volt">{t("Prendre une licence")}</Link><Link href="/clubs" className="btn btn-olight">{t("Trouver un club")}</Link><a href={APP_URL} className="btn btn-olight">{t("Espace club")}</a><div className="lang mega-lang" role="group" aria-label="Langue / Language">{(["fr", "en"] as const).map((k) => <button key={k} type="button" className={lang === k ? "on" : ""} aria-pressed={lang === k} onClick={() => setLang(k)}>{k.toUpperCase()}</button>)}</div></div>
              <span className="mono" style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--smoke)" }}>Stade Iba Mar Diop · Dakar · +221 33 821 77 98</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
