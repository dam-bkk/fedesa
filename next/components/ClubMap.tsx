"use client";
import { useMemo, useState } from "react";
import type { Club } from "@/lib/api";

/* Contour simplifié du Sénégal (lon, lat) et enclave gambienne — projection équirectangulaire. */
const SN: [number, number][] = [[-16.53, 16.06], [-16.2, 16.3], [-15.6, 16.5], [-15.0, 16.65], [-14.3, 16.6], [-13.8, 16.2], [-13.4, 15.9], [-13.2, 15.5], [-12.9, 15.2], [-12.5, 15.0], [-12.2, 14.6], [-12.0, 14.2], [-11.8, 13.6], [-11.4, 13.0], [-11.4, 12.5], [-11.7, 12.4], [-12.2, 12.35], [-12.8, 12.4], [-13.3, 12.6], [-13.7, 12.65], [-14.3, 12.65], [-15.0, 12.6], [-15.6, 12.45], [-16.2, 12.35], [-16.7, 12.35], [-16.75, 12.6], [-16.7, 12.9], [-16.75, 13.2], [-16.8, 13.5], [-16.75, 14.0], [-16.85, 14.2], [-17.0, 14.5], [-17.2, 14.65], [-17.5, 14.7], [-17.45, 14.85], [-17.2, 15.0], [-16.9, 15.3], [-16.6, 15.7]];
const GM: [number, number][] = [[-16.8, 13.15], [-16.0, 13.1], [-15.0, 13.15], [-14.2, 13.25], [-13.8, 13.35], [-13.9, 13.6], [-14.6, 13.6], [-15.4, 13.6], [-16.2, 13.55], [-16.8, 13.5]];
const X = (lon: number) => (lon + 17.7) * 100, Y = (lat: number) => (16.85 - lat) * 100;
const poly = (p: [number, number][]) => p.map(([a, b]) => `${X(a).toFixed(1)},${Y(b).toFixed(1)}`).join(" ");

export function ClubMap({ clubs }: { clubs: Club[] }) {
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const cities = useMemo(() => { const m = new Map<string, { city: string; region: string; lon: number; lat: number; clubs: Club[] }>(); clubs.forEach((c) => { if (c.lon == null || c.lat == null) return; const k = c.city; if (!m.has(k)) m.set(k, { city: c.city, region: c.region, lon: c.lon, lat: c.lat, clubs: [] }); m.get(k)!.clubs.push(c); }); return [...m.values()]; }, [clubs]);
  const cur = cities.find((c) => c.city === (pinned ?? hover));
  return (
    <div className="cmap">
      <svg viewBox="0 0 650 470" role="img" aria-label="Carte des clubs affiliés au Sénégal" onMouseLeave={() => setHover(null)}>
        <defs><pattern id="lanes" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)"><path d="M0 7h14" stroke="rgba(11,20,16,.06)" strokeWidth="1" /></pattern></defs>
        <polygon points={poly(SN)} fill="url(#lanes)" stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round" style={{ fill: "var(--cmap-land)" }} />
        <polygon points={poly(SN)} fill="url(#lanes)" />
        <polygon points={poly(GM)} fill="var(--paper)" stroke="var(--ink)" strokeWidth="1" strokeDasharray="3 3" />
        <text x={X(-15.3)} y={Y(13.36)} fontSize="9" fill="var(--muted)" fontFamily="var(--mono)" letterSpacing="2">GAMBIE</text>
        {cities.map((c) => { const r = 4 + Math.min(10, Math.sqrt(c.clubs.length) * 2.2); const on = (pinned ?? hover) === c.city; return (
          <g key={c.city} transform={`translate(${X(c.lon)} ${Y(c.lat)})`} onMouseEnter={() => setHover(c.city)} onClick={() => setPinned(pinned === c.city ? null : c.city)} style={{ cursor: "pointer" }} tabIndex={0} onFocus={() => setHover(c.city)} aria-label={`${c.city} : ${c.clubs.length} club${c.clubs.length > 1 ? "s" : ""}`}>
            <circle r={r + 6} fill={on ? "rgba(0,224,90,.25)" : "transparent"} />
            <circle r={r} fill={on ? "var(--ink)" : "var(--volt)"} stroke="var(--ink)" strokeWidth="1.5" />
            {c.clubs.length > 4 && <text textAnchor="middle" dy="3.5" fontSize="9" fontWeight="700" fill={on ? "var(--volt)" : "var(--ink)"} fontFamily="var(--mono)">{c.clubs.length}</text>}
            {(r > 8 || on) && <text x={r + 5} dy="3.5" fontSize="10.5" fill="var(--ink)" fontFamily="var(--body)" fontWeight="600">{c.city}</text>}
          </g>); })}
      </svg>
      <div className={`cmap-card ${cur ? "on" : ""}`} aria-live="polite">
        {cur ? (<>
          <div className="cmap-h"><b>{cur.city}</b><span className="mono">{cur.clubs.length} club{cur.clubs.length > 1 ? "s" : ""} · ligue de {cur.region}</span>{pinned && <button type="button" className="cmap-x" onClick={() => setPinned(null)} aria-label="Fermer">×</button>}</div>
          <ul>{cur.clubs.slice(0, 6).map((c) => <li key={c.id}><b>{c.name}</b><span>{c.president ? `Président·e : ${c.president}` : ""}</span><span className="mono">{c.phone}{c.email ? ` · ${c.email}` : ""}</span><span className="dim">{c.licensees} licenciés · fondé en {c.founded}</span></li>)}{cur.clubs.length > 6 && <li className="dim">+ {cur.clubs.length - 6} autres clubs dans l'annuaire ci-dessous</li>}</ul>
        </>) : <p className="dim">Survolez une ville pour voir ses clubs, leur adresse et leurs contacts. Cliquez pour épingler.</p>}
      </div>
    </div>
  );
}
