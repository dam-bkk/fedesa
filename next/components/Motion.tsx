"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { EP } from "@/lib/ep";

/**
 * Mise en mouvement du site — une seule boucle de scroll, tout est coupé sous
 * `prefers-reduced-motion` et les effets lourds s'arrêtent sous 821 px.
 * 1. titre du hero qui se lance + compte à rebours à volets
 * 2. chrono de scroll avec temps de passage et couloir courant
 * 3. couloirs de piste en parallaxe dans les sections claires
 * 4. bento des épreuves magnétique (icône, inclinaison, record en fond)
 * 5. portrait de l'athlète : photo qui court dans le masque, courbe qui se trace
 * 6. bascule en mode nuit avant le pied de page
 */
export function Motion() {
  const path = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wide = window.matchMedia("(min-width:821px)").matches;
    const off: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(el: Window | Document | Element, ev: K | string, fn: EventListenerOrEventListenerObject, o?: AddEventListenerOptions) => { el.addEventListener(ev, fn, o); off.push(() => el.removeEventListener(ev, fn, o)); };
    const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);
    const $$ = <T extends Element = HTMLElement>(s: string) => Array.from(document.querySelectorAll<T>(s));

    /* ── 1. titre du hero ────────────────────────────────────────── */
    const h1 = $(".hero-h1");
    if (h1 && !h1.dataset.split) {
      h1.dataset.split = "1";
      const groups: Node[][] = [[]];
      h1.childNodes.forEach((n) => { if (n.nodeName === "BR") { groups.push([]); (groups[groups.length - 2] as Node[]).push(n); } else groups[groups.length - 1].push(n); });
      const frag = document.createDocumentFragment();
      let i = 0;
      groups.forEach((g) => {
        const text = g.filter((n) => n.nodeName !== "BR");
        if (text.some((n) => (n.textContent ?? "").trim())) {
          while (text.length && !(text[0].textContent ?? "").trim()) frag.appendChild(text.shift()!);
          const tail: Node[] = [];
          while (text.length && !(text[text.length - 1].textContent ?? "").trim()) tail.unshift(text.pop()!);
          const outer = document.createElement("span"); outer.className = "hl";
          const inner = document.createElement("span"); inner.className = "hl-i"; inner.style.animationDelay = `${i++ * 110}ms`;
          text.forEach((n) => inner.appendChild(n)); outer.appendChild(inner); frag.appendChild(outer);
          tail.forEach((n) => frag.appendChild(n));
        } else text.forEach((n) => frag.appendChild(n));
        g.filter((n) => n.nodeName === "BR").forEach((n) => frag.appendChild(n));
      });
      h1.appendChild(frag);
      h1.classList.add("pre");
      requestAnimationFrame(() => requestAnimationFrame(() => h1.classList.add("go")));
    }
    /* compte à rebours : chaque chiffre qui change bascule */
    const cd = $("#cd");
    if (cd) {
      const last = new Map<string, string>();
      const obs = new MutationObserver(() => {
        cd.querySelectorAll<HTMLElement>("[data-u]").forEach((el) => {
          const u = el.dataset.u!, v = el.textContent ?? "";
          if (last.get(u) !== undefined && last.get(u) !== v) { el.classList.remove("flip"); void el.offsetWidth; el.classList.add("flip"); }
          last.set(u, v);
        });
      });
      obs.observe(cd, { subtree: true, characterData: true, childList: true });
      off.push(() => obs.disconnect());
    }

    /* ── 2. chrono de scroll ─────────────────────────────────────── */
    const SECTIONS: [string, string][] = [["epreuves", "Épreuves"], ["actus", "À la une"], ["live", "Résultats"], ["weekend", "Le week-end"], ["agenda", "Calendrier"], ["monde", "Dans le monde"], ["athlete", "Athlète"], ["classement", "Clubs"], ["regions", "Carte"], ["records", "Records"], ["licences", "Licence"], ["histoire", "Histoire"], ["federation", "Fédération"], ["faq", "Questions"]];
    const marks = SECTIONS.map(([id, label], k) => ({ el: document.getElementById(id), label, lane: String((k % 8) + 1).padStart(2, "0"), done: false })).filter((m) => m.el);
    let hud: HTMLElement | null = null, hudTime: HTMLElement | null = null, hudLane: HTMLElement | null = null, hudBar: HTMLElement | null = null, hudSplit: HTMLElement | null = null;
    if (wide && marks.length > 2) {
      hud = document.createElement("aside"); hud.className = "chrono"; hud.setAttribute("aria-hidden", "true");
      hud.innerHTML = '<span class="ch-t"><b data-t>00</b><i>&#39;&#39;</i><b data-c>00</b></span><span class="ch-l"><span data-lane>01</span> <span data-sec></span></span><span class="ch-bar"><i></i></span><span class="ch-split" data-split></span>';
      document.body.appendChild(hud); off.push(() => hud?.remove());
      hudTime = hud.querySelector("[data-t]"); hudLane = hud.querySelector("[data-lane]"); hudBar = hud.querySelector(".ch-bar i"); hudSplit = hud.querySelector("[data-split]");
    }
    const hudCs = hud?.querySelector<HTMLElement>("[data-c]") ?? null;
    const hudSec = hud?.querySelector<HTMLElement>("[data-sec]") ?? null;
    let splitTimer = 0;

    /* ── 3. couloirs en parallaxe ────────────────────────────────── */
    const laneTargets = wide ? ["epreuves", "weekend", "faq", "classement", "agenda"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[] : [];
    const lanes: { host: HTMLElement; layers: SVGGElement[] }[] = [];
    laneTargets.forEach((host) => {
      if (host.querySelector(":scope > .lanes")) return;
      host.classList.add("has-lanes");
      const ns = "http://www.w3.org/2000/svg";
      const wrap = document.createElement("span"); wrap.className = "lanes"; wrap.setAttribute("aria-hidden", "true");
      const svg = document.createElementNS(ns, "svg"); svg.setAttribute("viewBox", "0 0 1200 1200"); svg.setAttribute("preserveAspectRatio", "none");
      const layers: SVGGElement[] = [];
      for (let i = 0; i < 8; i++) {
        const g = document.createElementNS(ns, "g"); g.setAttribute("data-s", String(0.08 + i * 0.05));
        const x = 60 + i * 155;
        const line = document.createElementNS(ns, "path"); line.setAttribute("d", `M${x} -400 V1600`); line.setAttribute("stroke", "currentColor"); line.setAttribute("stroke-width", "1.5"); g.appendChild(line);
        for (let y = -400; y < 1600; y += 200) { const t = document.createElementNS(ns, "path"); t.setAttribute("d", `M${x - 9} ${y} H${x + 9}`); t.setAttribute("stroke", "currentColor"); t.setAttribute("stroke-width", i % 2 ? "3" : "6"); g.appendChild(t); }
        svg.appendChild(g); layers.push(g);
      }
      wrap.appendChild(svg); host.insertBefore(wrap, host.firstChild);
      lanes.push({ host, layers });
    });

    /* ── 4. bento magnétique ─────────────────────────────────────── */
    const tiles = $$<HTMLElement>("#epreuves .bx");
    tiles.forEach((tile) => {
      const n = Number(tile.dataset.ep ?? 0), e = EP[n];
      if (e && !tile.querySelector(".bx-big")) {
        const rec = (e.sen.find((r) => r[3] !== "—") ?? e.wr.find((r) => r[3] !== "—"))?.[3];
        if (rec) { const b = document.createElement("span"); b.className = "bx-big"; b.setAttribute("aria-hidden", "true"); b.textContent = rec; tile.appendChild(b); }
      }
      if (!wide) return;
      const ico = tile.querySelector<SVGElement>("svg");
      const move = (ev: MouseEvent) => {
        const r = tile.getBoundingClientRect();
        const dx = (ev.clientX - r.left) / r.width - 0.5, dy = (ev.clientY - r.top) / r.height - 0.5;
        tile.style.setProperty("--rx", `${(-dy * 5).toFixed(2)}deg`);
        tile.style.setProperty("--ry", `${(dx * 5).toFixed(2)}deg`);
        if (ico) ico.style.transform = `translate(${(dx * 14).toFixed(1)}px, ${(dy * 14).toFixed(1)}px)`;
      };
      const leave = () => { tile.style.setProperty("--rx", "0deg"); tile.style.setProperty("--ry", "0deg"); if (ico) ico.style.transform = ""; };
      on(tile, "mousemove", move as EventListener); on(tile, "mouseleave", leave as EventListener);
    });

    /* ── 5. portrait de l'athlète ────────────────────────────────── */
    const oval = $<HTMLImageElement>(".spot-fig .oval img");
    const spark = $<SVGPolylineElement>(".spark polyline");
    if (spark) { const len = spark.getTotalLength(); spark.style.strokeDasharray = `${len}`; spark.style.strokeDashoffset = `${len}`; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "-12% 0px -12% 0px" });
    $$(".spark, .cmap svg, .tl-track, .monde-grid").forEach((el) => io.observe(el));
    off.push(() => io.disconnect());

    /* ── 6. mode nuit avant le pied de page ──────────────────────── */
    const nightZone = $$<HTMLElement>("main > section").slice(-1)[0] ?? null;
    nightZone?.classList.add("night-zone");

    /* ── boucle unique ───────────────────────────────────────────── */
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY, vh = window.innerHeight;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const p = Math.min(1, Math.max(0, y / max));
      if (hud) {
        const s = p * 60, sec = Math.floor(s), cs = Math.floor((s - sec) * 100);
        if (hudTime) hudTime.textContent = String(sec).padStart(2, "0");
        if (hudCs) hudCs.textContent = String(cs).padStart(2, "0");
        if (hudBar) hudBar.style.transform = `scaleX(${p.toFixed(4)})`;
        hud.classList.toggle("on", y > vh * 0.6);
        let cur = marks[0];
        marks.forEach((m) => { const top = m.el!.getBoundingClientRect().top; if (top < vh * 0.45) cur = m; if (!m.done && top < vh * 0.45 && top > -vh) { m.done = true; if (hudSplit) { hudSplit.textContent = `${m.label} ${String(sec).padStart(2, "0")}''${String(cs).padStart(2, "0")}`; hudSplit.classList.add("show"); clearTimeout(splitTimer); splitTimer = window.setTimeout(() => hudSplit?.classList.remove("show"), 1900); } } });
        if (hudLane && hudLane.textContent !== cur.lane) hudLane.textContent = cur.lane;
        if (hudSec && hudSec.textContent !== cur.label) hudSec.textContent = cur.label;
      }
      lanes.forEach(({ host, layers }) => {
        const r = host.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const prog = (vh - r.top) / (vh + r.height);
        layers.forEach((g) => { const s = Number(g.getAttribute("data-s")); g.style.transform = `translateY(${((prog - 0.5) * 340 * s).toFixed(1)}px)`; });
      });
      if (oval && wide) { const r = oval.parentElement!.getBoundingClientRect(); if (r.bottom > -100 && r.top < vh + 100) { const prog = (vh - r.top) / (vh + r.height); oval.style.transform = `translateY(${((0.5 - prog) * 46).toFixed(1)}px) scale(1.12)`; } }
      if (nightZone) { const r = nightZone.getBoundingClientRect(); const n = Math.min(1, Math.max(0, (vh - r.top) / Math.max(1, Math.min(r.height, vh * 0.9)))); nightZone.style.setProperty("--night", n.toFixed(3)); }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    on(window, "scroll", onScroll, { passive: true }); on(window, "resize", onScroll);
    update();
    return () => { off.forEach((f) => f()); clearTimeout(splitTimer); };
  }, [path]);
  return null;
}
