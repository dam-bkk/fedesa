import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  images: { unoptimized: true },
  poweredByHeader: false,
  async headers() { return [{
    /* images et logos : les noms de fichiers sont stables → RENOMMER un fichier quand on le remplace, sinon le cache ne voit rien */
    source: "/img/:path*",
    headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=604800" }],
  }, { source: "/(.*)", headers: [{ key: "X-Content-Type-Options", value: "nosniff" }, { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }] }]; },
};
export default nextConfig;
