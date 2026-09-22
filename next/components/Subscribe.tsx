"use client";
import { useState } from "react";
import { tr, type Lang } from "@/lib/i18n";
import { APP_URL } from "@/lib/api";
const LIGUES = [["DK", "Dakar"], ["TH", "Thiès"], ["DB", "Diourbel"], ["FK", "Fatick"], ["KL", "Kaolack"], ["KF", "Kaffrine"], ["KD", "Kolda"], ["LG", "Louga"], ["MT", "Matam"], ["SL", "Saint-Louis"], ["SE", "Sédhiou"], ["TC", "Tambacounda"], ["KE", "Kédougou"], ["ZG", "Ziguinchor"]];
/** #10 — fil WhatsApp / e-mail par ligue : l'abonnement est enregistré par la plateforme fédérale. */
export function Subscribe({ lang, compact }: { lang: Lang; compact?: boolean }) {
  const t = tr(lang); const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle"); const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState("busy"); const f = new FormData(e.currentTarget);
    try { const r = await fetch(`${APP_URL}/api/public/abonnements`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channel, contact: f.get("contact"), regionCode: f.get("regionCode") }) }); const j = await r.json(); setState(j.ok ? "ok" : "err"); } catch { setState("err"); }
  }
  return (
    <form className={`sub ${compact ? "compact" : ""}`} onSubmit={submit}>
      {!compact && <div><div className="eyebrow">{t("Les résultats de ma ligue")}</div><h3 className="poster" style={{ marginTop: 10 }}>{t("Sur WhatsApp, dès la publication")}</h3><p className="dim" style={{ fontSize: 13.5, maxWidth: "46ch" }}>{t("Podiums, records et convocations de votre ligue, envoyés le soir même de la publication par la fédération. Réponse STOP pour se désabonner.")}</p></div>}
      <div className="sub-f">
        <div className="seg" role="group" aria-label={t("Canal")}>{(["whatsapp", "email"] as const).map((k) => <button type="button" key={k} className={channel === k ? "on" : ""} onClick={() => setChannel(k)}>{k === "whatsapp" ? "WhatsApp" : "E-mail"}</button>)}</div>
        <select name="regionCode" aria-label={t("Ligue")} defaultValue=""><option value="">{t("Toutes les ligues")}</option>{LIGUES.map(([c, n]) => <option key={c} value={c}>{n}</option>)}</select>
        <input name="contact" required placeholder={channel === "whatsapp" ? "+221 77 000 00 00" : "prenom@exemple.sn"} type={channel === "whatsapp" ? "tel" : "email"} aria-label={t("Contact")} />
        <button className="btn btn-ink" disabled={state === "busy"}>{state === "ok" ? t("Abonné ✓") : t("Recevoir les résultats")}</button>
      </div>
      {state === "err" && <p className="dim" style={{ color: "var(--red)", fontSize: 13 }}>{t("Numéro ou adresse invalide.")}</p>}
      {state === "ok" && <p style={{ fontSize: 13 }}>{t("C'est noté : vous recevrez les résultats dès leur publication.")}</p>}
    </form>
  );
}
