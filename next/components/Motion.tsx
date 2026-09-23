"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { EP } from "@/lib/ep";

/**
 * Mise en mouvement du site — une seule boucle de scroll, tout est coupé sous
 * `prefers-reduced-motion` et les effets lourds s'arrêtent sous 821 px.
 * 1. titre du hero qui se lance + compte à rebours à volets
 * 2. bento des épreuves magnétique (icône, inclinaison, record en fond)
 * 4. portrait de l'athlète : photo qui court dans le masque, courbe qui se trace
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

    /* ── 2. bento magnétique ─────────────────────────────────────── */
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

    /* ── 3. révélations à l'entrée ───────────────────────────────── */
    const spark = $<SVGPolylineElement>(".spark polyline");
    if (spark) { const len = spark.getTotalLength(); spark.style.strokeDasharray = `${len}`; spark.style.strokeDashoffset = `${len}`; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "-12% 0px -12% 0px" });
    $$(".spark, .tl-track, .monde-grid").forEach((el) => io.observe(el));
    off.push(() => io.disconnect());

    return () => off.forEach((f) => f());
  }, [path]);
  return null;
}
