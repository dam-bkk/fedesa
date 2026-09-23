"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

/** Changement de page « changement de couloir » : un volet volt balaie l'écran, la page suivante entre derrière. */
export function Transition() {
  const router = useRouter();
  const path = usePathname();
  const [out, setOut] = useState(false);
  const first = useRef(true);
  const going = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const click = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || a.target === "_blank" || a.hasAttribute("download") || href.startsWith("#") || href.startsWith("mailto") || href.startsWith("tel")) return;
      let url: URL;
      try { url = new URL(href, location.href); } catch { return; }
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      if (going.current) return;
      going.current = true;
      setOut(true);
      window.setTimeout(() => { router.push(url.pathname + url.search + url.hash); }, 190);
    };
    document.addEventListener("click", click, true);
    return () => document.removeEventListener("click", click, true);
  }, [router]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    going.current = false;
    setOut(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [path]);

  return <div className={`wipe ${out ? "out" : ""}`} aria-hidden="true"><span /></div>;
}
