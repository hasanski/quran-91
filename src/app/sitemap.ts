import type { MetadataRoute } from "next";
import { surahs } from "@/data/surahs";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/surahs`, changeFrequency: "monthly", priority: 0.9 },
    ...surahs.map((s) => ({
      url: `${SITE_URL}/surah/${s.id}`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
