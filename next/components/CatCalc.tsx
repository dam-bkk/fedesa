"use client";
import { useState } from "react";
import Link from "next/link";
import { tr, type Lang } from "@/lib/i18n";
const CATS: [string, string, number, number][] = [["U12", "Poussins", 0, 11], ["U14", "Benjamins", 12, 13], ["U16", "Minimes", 14, 15], ["U18", "Cadets", 16, 17], ["U20", "Juniors", 18, 19], ["U23", "Espoirs", 20, 22], ["SEN", "Seniors", 23, 34], ["MAS", "Masters", 35, 120]];
/** #9 — « Quelle est ma catégorie ? » : date de naissance → catégorie de la saison, type de licence, tarif, pièces. À vide : l'échelle des catégories. */
export function CatCalc({ lang, fees, season = "2026-2027" }: { lang: Lang; fees: { code: string; label: string; amount: number }[]; season?: string }) {
  const t = tr(lang); const [dob, setDob] = useState("");
  const endYear = Number(season.slice(5)); const age = dob && dob.length === 10 ? endYear - Number(dob.slice(0, 4)) : null;
  const cat = age == null || age < 5 ? null : CATS.find((c) => age >= c[2] && age <= c[3]) ?? CATS[0];
  const type = cat ? (["U12", "U14", "U16"].includes(cat[0]) ? "jeunes" : "competition") : null;
  const fee = fees.find((f) => f.code === type);
  const minor = age != null && age < 18;
  return (
    <div className="catcalc">
      <div className="cc-l">
        <div className="eyebrow">{t("Quelle est ma catégorie ?")}</div>
        <h2 style={{ marginTop: 14 }}>{t("Ta date")}<br />{t("de naissance suffit")}</h2>
        <label className="cc-field"><span className="cc-lab">{t("Date de naissance")}</span><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} max={`${endYear - 5}-12-31`} min="1930-01-01" /></label>
        <p className="dim" style={{ fontSize: 13, marginTop: 14, maxWidth: "44ch" }}>{t("Catégorie World Athletics : âge atteint dans l'année civile où la saison se termine")} ({endYear}). {t("Saison")} {season}.</p>
      </div>
      <div className="cc-r" aria-live="polite">{cat ? (<>
        <div className="cc-cat">{cat[0]}<small>{t(cat[1])} · {cat[2]}–{cat[3] > 100 ? "…" : cat[3]} {t("ans")}</small></div>
        <dl className="kv" style={{ marginTop: 18 }}><dt>{t("Licence")}</dt><dd>{fee ? t(fee.label) : t("Compétition")}</dd><dt>{t("Tarif fédéral")}</dt><dd><b>{fee ? fee.amount.toLocaleString("fr-FR") + " FCFA" : "—"}</b> / {t("saison")}</dd><dt>{t("Pièces")}</dt><dd>{t("photo, pièce d'identité, certificat médical, fiche signée, règlement")}{minor ? `, ${t("autorisation parentale")}` : ""}</dd></dl>
        <Link href="/clubs" className="btn btn-ink btn-sm" style={{ marginTop: 22 }}>{t("Trouver un club près de chez moi")}</Link>
      </>) : (<>
        <div className="cc-ladder-h"><span>{t("Catégorie")}</span><span>{t("Âge en")} {endYear}</span><span>{t("Licence")}</span></div>
        <ul className="cc-ladder">{CATS.map((c) => { const f = fees.find((x) => x.code === (["U12", "U14", "U16"].includes(c[0]) ? "jeunes" : "competition")); return <li key={c[0]}><b>{c[0]}</b><span>{t(c[1])}</span><span className="mono">{c[2]}–{c[3] > 100 ? "…" : c[3]} {t("ans")}</span><span className="mono">{f ? f.amount.toLocaleString("fr-FR") + " FCFA" : "—"}</span></li>; })}</ul>
      </>)}</div>
    </div>
  );
}
