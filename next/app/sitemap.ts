import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/content";
import { api } from "@/lib/api";

const BASE = "https://fedesa.damien.asia";
export const revalidate = 3600;

/** Plan du site : pages fixes + articles + compétitions dont les résultats sont publiés. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const fixed: [string, number, "daily" | "weekly" | "monthly"][] = [
    ["", 1, "daily"], ["/competitions", 0.9, "daily"], ["/resultats", 0.9, "daily"], ["/records", 0.8, "weekly"],
    ["/clubs", 0.8, "weekly"], ["/clubs/classement", 0.6, "weekly"], ["/licence", 0.9, "monthly"], ["/epreuves", 0.7, "monthly"],
    ["/athletes", 0.7, "weekly"], ["/actualites", 0.8, "weekly"], ["/medias", 0.5, "monthly"], ["/federation", 0.7, "monthly"], ["/week-end", 0.6, "weekly"],
  ];
  const { items } = await api.season();
  return [
    ...fixed.map(([p, priority, changeFrequency]) => ({ url: BASE + p, lastModified: now, changeFrequency, priority })),
    ...POSTS.map((p) => ({ url: `${BASE}/actualites/${p.slug}`, lastModified: new Date(p.date), changeFrequency: "yearly" as const, priority: 0.5 })),
    ...items.filter((c) => c.resultsUrl).map((c) => ({ url: `${BASE}/competitions/${c.id}`, lastModified: new Date(c.dateTo), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
