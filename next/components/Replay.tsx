"use client";
import { useEffect, useRef, useState } from "react";
import { tr, type Lang } from "@/lib/i18n";
type R = { athlete: string; club: string | null; mark: string; raw: number | null; rank: number | null };
/** #15 — rejouer une finale : chaque couloir avance à la vitesse réelle, ramenée à ~5 s ; les écarts à l'arrivée sont ceux des chronos. */
export function Replay({ lang, event, results }: { lang: Lang; event: string; results: R[] }) {
  const t = tr(lang); const rows = results.filter((r) => r.raw && r.rank).slice(0, 8); const [on, setOn] = useState(false); const [k, setK] = useState(0); const raf = useRef(0);
  const win = Math.min(...rows.map((r) => r.raw!)), worst = Math.max(...rows.map((r) => r.raw!)); const DUR = 5000 * (worst / win);
  useEffect(() => { if (!on) return; const t0 = performance.now(); const step = (now: number) => { const p = Math.min(1, (now - t0) / DUR); setK(p); if (p < 1) raf.current = requestAnimationFrame(step); else setOn(false); }; raf.current = requestAnimationFrame(step); return () => cancelAnimationFrame(raf.current); }, [on, DUR]);
  if (rows.length < 2) return null;
  const W = 640, LH = 26, PAD = 120;
  return (
    <div className="replay">
      <div className="rp-h"><b>{t("Rejouer la finale")} — {event}</b><button type="button" className="btn btn-ink btn-sm" onClick={() => { setK(0); setOn(true); }}>{on ? t("En cours…") : k >= 1 ? t("Rejouer") : t("Lancer")}</button></div>
      <svg viewBox={`0 0 ${W} ${rows.length * LH + 10}`} className="rp-svg" role="img" aria-label={t("Rejouer la finale")}>
        {rows.map((r, i) => { const prog = Math.min(1, (k * DUR) / (r.raw! * 1000 / (win * 1000 / 5000)) ); const x = PAD + prog * (W - PAD - 30); const done = prog >= 1; return (
          <g key={i} transform={`translate(0 ${i * LH + 8})`}>
            <line x1={PAD} x2={W - 30} y1={LH / 2} y2={LH / 2} stroke="var(--line)" strokeWidth="1" /><line x1={W - 30} x2={W - 30} y1="2" y2={LH - 2} stroke="var(--ink)" strokeWidth="2" />
            <text x="6" y={LH / 2 + 4} fontSize="11" fontFamily="var(--body)" fill="var(--ink)">{i + 1}. {r.athlete.split(" ").slice(-1)[0].toUpperCase()}</text>
            <circle cx={x} cy={LH / 2} r="7" fill={r.rank === 1 ? "var(--volt)" : "var(--ink)"} stroke="var(--ink)" strokeWidth="1.5" />
            {done && <text x={W - 26} y={LH / 2 + 4} fontSize="11" fontFamily="var(--mono)" fill="var(--ink)">{r.mark}</text>}
          </g>); })}
      </svg>
    </div>
  );
}
