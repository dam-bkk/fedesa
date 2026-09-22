import Link from "next/link";
export default function NotFound() { return <main><div className="wrap page-head"><div className="eyebrow">Erreur 404</div><h1>Faux<br />départ</h1><p className="intro">Cette page n&apos;existe pas ou plus. <Link href="/" className="sec-link">Retour à l&apos;accueil →</Link></p></div></main>; }
