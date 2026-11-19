import type { MetadataRoute } from "next";
import { causes } from "@/content/causes";
import { site } from "@/content/site";
import { stories } from "@/content/stories";

type Entry = { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] };

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/donate", priority: 1, changeFrequency: "monthly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about/team", priority: 0.6, changeFrequency: "monthly" },
    { path: "/our-work", priority: 0.8, changeFrequency: "monthly" },
    ...causes.map((c) => ({ path: `/our-work/${c.slug}`, priority: 0.8, changeFrequency: "monthly" as const })),
    { path: "/events", priority: 0.8, changeFrequency: "weekly" },
    { path: "/stories", priority: 0.7, changeFrequency: "weekly" },
    ...stories.map((s) => ({ path: `/stories/${s.slug}`, priority: 0.6, changeFrequency: "yearly" as const })),
    { path: "/get-involved", priority: 0.7, changeFrequency: "monthly" },
    { path: "/get-involved/volunteer", priority: 0.8, changeFrequency: "monthly" },
    { path: "/get-involved/partner", priority: 0.7, changeFrequency: "monthly" },
    { path: "/transparency", priority: 0.7, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms-and-conditions", priority: 0.3, changeFrequency: "yearly" },
    { path: "/refund-policy", priority: 0.3, changeFrequency: "yearly" },
  ];
  return entries.map((e) => ({
    url: `${site.url}${e.path === "/" ? "" : e.path}`,
    priority: e.priority,
    changeFrequency: e.changeFrequency,
  }));
}
