"use client";
import { useState } from "react";
import Link from "next/link";
import { tr, type Lang } from "@/lib/i18n";
const CATS: [string, string, number, number][] = [["U12", "Poussins", 0, 11], ["U14", "Benjamins", 12, 13], ["U16", "Minimes", 14, 15], ["U18", "Cadets", 16, 17], ["U20", "Juniors", 18, 19], ["U23", "Espoirs", 20, 22], ["SEN", "Seniors", 23, 34], ["MAS", "Masters", 35, 120]];
/** #9 — « Quelle est ma catégorie ? » : date de naissance → catégorie 2026-27, type de licence, tarif, pièces. */
export function CatCalc({ lang, fees, season = "2026-2027" }: { lang: Lang; fees: { code: string; label: string; amount: number }[]; season?: string }) {
  const t = tr(lang); const [dob, setDob] = useState("");
  const endYear = Number(season.slice(5)); const age = dob ? endYear - Number(dob.slice(0, 4)) : null;
  const cat = age == null ? null : CATS.find((c) => age >= c[2] && age <= c[3]) ?? CATS[0];
  const type = cat ? (["U12", "U14", "U16"].includes(cat[0]) ? "jeunes" : "competition") : null;
  const fee = fees.find((f) => f.code === type);
  const minor = age != null && endYear - Number(dob.slice(0, 4)) < 18;
  return (
    <div className="catcalc">
      <div className="cc-l"><div className="eyebrow">{t("Quelle est ma catégorie ?")}</div><h3 className="poster" style={{ marginTop: 10 }}>{t("Ta date de naissance suffit")}</h3><label className="cc-field"><span className="vis-hidden">{t("Date de naissance")}</span><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} max={`${endYear - 5}-12-31`} min="1930-01-01" /></label><p className="dim" style={{ fontSize: 12.5, marginTop: 8 }}>{t("Catégorie World Athletics : âge atteint dans l'année civile où la saison se termine")} ({endYear}).</p></div>
      <div className="cc-r" aria-live="polite">{cat ? (<>
        <div className="cc-cat">{cat[0]}<small>{t(cat[1])}</small></div>
        <dl className="kv" style={{ marginTop: 10 }}><dt>{t("Licence")}</dt><dd>{fee ? t(fee.label) : t("Compétition")}</dd><dt>{t("Tarif fédéral")}</dt><dd><b>{fee ? fee.amount.toLocaleString("fr-FR") + " FCFA" : "—"}</b> / {t("saison")}</dd><dt>{t("Pièces")}</dt><dd>{t("photo, pièce d'identité, certificat médical, fiche signée, règlement")}{minor ? `, ${t("autorisation parentale")}` : ""}</dd></dl>
        <Link href="/clubs" className="btn btn-ink btn-sm" style={{ marginTop: 14 }}>{t("Trouver un club près de chez moi")}</Link>
      </>) : <p className="dim">{t("Saisissez une date de naissance : la catégorie, le tarif et les pièces s'affichent ici.")}</p>}</div>
    </div>
  );
}
