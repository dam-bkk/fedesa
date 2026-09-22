"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
/** Comportements DOM des sections statiques (onglets, accordéons, compteurs, marquees, tracés) — même logique que la maquette v3, montée après hydratation. */
export function Enhance() {
  const path = usePathname();
  useEffect(() => {
    const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => Array.from(c.querySelectorAll<T>(s));
    const off: (() => void)[] = [];
    const on = (el: Element | Window | Document, ev: string, fn: EventListenerOrEventListenerObject) => { el.addEventListener(ev, fn); off.push(() => el.removeEventListener(ev, fn)); };
    // marquees : doubler la piste pour un défilement continu
    $$(".mq-track:not([data-doubled])").forEach((t) => { t.innerHTML += t.innerHTML; t.setAttribute("data-doubled", "1"); });
    // compte à rebours Dakar 2027
    const cd = document.getElementById("cd");
    if (cd) { const target = Date.parse("2027-05-12T09:00:00Z"); const pad = (n: number) => String(n).padStart(2, "0"); const tick = () => { const s = Math.max(0, Math.floor((target - Date.now()) / 1000)); const set = (u: string, v: string) => { const e = cd.querySelector(`[data-u="${u}"]`); if (e) e.textContent = v; }; set("d", String(Math.floor(s / 86400))); set("h", pad(Math.floor((s % 86400) / 3600))); set("m", pad(Math.floor((s % 3600) / 60))); set("s", pad(s % 60)); }; tick(); const id = setInterval(tick, 1000); off.push(() => clearInterval(id)); }
    // compteurs
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) $$(".hstat-n[data-count]").forEach((el) => { const end = parseInt(el.getAttribute("data-count") ?? "0", 10); let t0: number | null = null; const step = (ts: number) => { if (t0 == null) t0 = ts; const p = Math.min(1, (ts - t0) / 1100), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(end * e).toLocaleString("fr-FR"); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); });
    // onglets génériques : [data-tabs] > .tab[data-target] ; cibles [data-tab-panel]
    $$("[role=tablist], .tabs[role=group]").forEach((group) => { const tabs = $$<HTMLButtonElement>(".tab", group); tabs.forEach((t) => on(t, "click", () => { tabs.forEach((o) => o.setAttribute("aria-selected", o === t ? "true" : "false")); const r = t.getAttribute("data-r"); if (r) $$("[id^=r]", group.closest("section") ?? document).filter((p) => /^r\d+$/.test(p.id)).forEach((p) => { (p as HTMLElement).hidden = p.id !== r; }); const f = t.getAttribute("data-f"); if (f) $$("[data-cat]").forEach((i) => { (i as HTMLElement).hidden = !(f === "all" || i.getAttribute("data-cat") === f); }); })); });
    // recherche dans un tableau
    const search = document.getElementById("recSearch") as HTMLInputElement | null;
    if (search) { const rows = $$<HTMLTableRowElement>("#recTable tbody tr"), count = document.getElementById("recCount"), empty = document.getElementById("recEmpty"); const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); on(search, "input", () => { const q = norm(search.value.trim()); let shown = 0; rows.forEach((r) => { const hit = !q || norm(r.textContent ?? "").includes(q); r.hidden = !hit; if (hit) shown++; }); if (count) count.textContent = shown + (shown > 1 ? " records affichés" : " record affiché"); if (empty) (empty as HTMLElement).hidden = shown !== 0; }); }
    // FAQ
    $$(".faq-q").forEach((btn) => on(btn, "click", () => { const item = btn.parentElement!, open = item.classList.contains("open"); $$(".faq-i").forEach((i) => { i.classList.remove("open"); i.querySelector(".faq-q")?.setAttribute("aria-expanded", "false"); }); if (!open) { item.classList.add("open"); btn.setAttribute("aria-expanded", "true"); } }));
    // tracés illustrés
    const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io?.unobserve(e.target); } }), { rootMargin: "-10% 0px -10% 0px" }) : null;
    $$(".illus").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
    return () => { off.forEach((f) => f()); io?.disconnect(); };
  }, [path]);
  return null;
}
