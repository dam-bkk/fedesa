"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Bento from "./parts/Bento";
import { EP } from "@/lib/ep";

/** Bento des 14 épreuves (markup v3) + fiche modale : flèches, clavier, taille constante. */
export function Epreuves() {
  const [i, setI] = useState<number | null>(null);
  const [icon, setIcon] = useState("");
  const open = useCallback((n: number) => { const tile = document.querySelectorAll("#epreuves .bx")[n]; setIcon(tile?.querySelector("svg")?.outerHTML ?? ""); setI(n); }, []);
  useEffect(() => {
    const root = document.getElementById("epreuves"); if (!root) return;
    const h = (e: Event) => { const a = (e.target as HTMLElement).closest<HTMLElement>(".bx"); if (!a) return; e.preventDefault(); open(+(a.dataset.ep ?? 0)); };
    root.addEventListener("click", h); return () => root.removeEventListener("click", h);
  }, [open]);
  useEffect(() => {
    if (i == null) { document.body.style.overflow = ""; return; }
    document.body.style.overflow = "hidden";
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setI(null); else if (e.key === "ArrowLeft") open((i + EP.length - 1) % EP.length); else if (e.key === "ArrowRight") open((i + 1) % EP.length); };
    window.addEventListener("keydown", k); return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [i, open]);
  const e = i == null ? null : EP[i];
  const rows = (r: [string, string, string, string][], sen = false) => r.map((x, k) => <div key={k} className={`rec ${sen ? "sen" : ""}`}><span className="cat">{x[0]}</span><span className="who">{x[1]}<span>{x[2]}</span></span><span className="val">{x[3]}</span></div>);
  return (
    <>
      <Bento />
      {e && i != null && (
        <div className="epw" role="dialog" aria-modal="true" aria-labelledby="epmT" onClick={(ev) => { if (ev.target === ev.currentTarget) setI(null); }}>
          <div className="epm">
            <button className="epm-x" type="button" aria-label="Fermer" onClick={() => setI(null)}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" /></svg></button>
            <div className="epm-l">
              <div><div className="epm-ico" aria-hidden="true" dangerouslySetInnerHTML={{ __html: icon }} /><div className="epm-n">Épreuve {String(i + 1).padStart(2, "0")} sur {EP.length}</div><h3 className="epm-t" id="epmT">{e.t}</h3><div className="epm-sub">{e.s}</div></div>
              <ul className="epm-tech">{e.tech.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
            <div className="epm-r">
              <div><h4>Records du monde</h4><div className="recs">{rows(e.wr)}</div></div>
              <div><h4>Records du Sénégal</h4><div className="recs">{rows(e.sen, true)}</div></div>
              <Link href="/competitions" className="btn btn-ink" style={{ alignSelf: "flex-start" }}>Voir le calendrier</Link>
            </div>
            <div className="epm-nav">
              <button type="button" onClick={() => open((i + EP.length - 1) % EP.length)}>‹ Épreuve précédente</button>
              <span className="epm-hint">← → pour naviguer · Échap pour fermer</span>
              <button type="button" onClick={() => open((i + 1) % EP.length)}>Épreuve suivante ›</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
