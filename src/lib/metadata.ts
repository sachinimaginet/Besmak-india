import { query } from "@/lib/db";
import { Metadata } from "next";

export async function getPageMetadata(slug: string): Promise<Metadata> {
  try {
    const pages = await query(
      "SELECT title, description, keywords FROM pages WHERE slug = ? LIMIT 1",
      [slug]
    );
    const page = pages[0];

    if (!page) return {};

    return {
      title: {
        absolute: page.title,
      },
      description: page.description,
      keywords: page.keywords?.split(",").map((k: string) => k.trim()) || [],
      openGraph: {
        title: page.title,
        description: page.description,
      },
    };
  } catch (error) {
    console.error(`[Metadata Error] Failed to fetch for ${slug}:`, error);
    return {};
  }
}
