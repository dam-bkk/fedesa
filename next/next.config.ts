import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  images: { unoptimized: true },
  poweredByHeader: false,
  async headers() { return [{
    /* images et logos : les noms de fichiers sont stables → RENOMMER un fichier quand on le remplace, sinon le cache ne voit rien */
    source: "/img/:path*",
    headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=604800" }],
  }, { source: "/(.*)", headers: [{ key: "X-Content-Type-Options", value: "nosniff" }, { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
      /* le site ne charge que ses propres ressources, plus l'API publique de la plateforme */
      { key: "Content-Security-Policy", value: "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https://appfedesa.damien.asia; frame-ancestors 'self'; base-uri 'self'; form-action 'self'" }] }]; },
};
export default nextConfig;
