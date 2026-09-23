import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: "https://fedesa.damien.asia/sitemap.xml", host: "https://fedesa.damien.asia" };
}
