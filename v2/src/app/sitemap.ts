import type { MetadataRoute } from "next";
import { LESSONS } from "@/lib/lessons";

const BASE = "https://semillitasbiblicas.space";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/lecciones`, changeFrequency: "weekly", priority: 0.9 },
    ...LESSONS.map((lesson) => ({
      url: `${BASE}/lecciones/${lesson.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
