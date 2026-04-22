import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://os.djames.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/plain`, lastModified: now, priority: 0.9 },
    { url: `${SITE_URL}/macos`, lastModified: now, priority: 0.8 },
    { url: `${SITE_URL}/arch`, lastModified: now, priority: 0.8 },
  ];
}
