import SectionRenderer from "@/components/sections/SectionRenderer";
import { query } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return getPageMetadata(params.slug);
}

async function getPageSections(slug: string) {
  const page = await query(
    "SELECT id FROM pages WHERE slug = ? AND isActive = TRUE LIMIT 1",
    [slug],
  );
  if (page.length === 0) return null;

  const sections = await query(
    `
    SELECT ps.* 
    FROM page_sections ps
    WHERE ps.pageId = ? AND ps.isActive = TRUE
    ORDER BY ps.sortOrder ASC
  `,
    [page[0].id],
  );

  return sections;
}

export default async function DynamicPage({
  params,
}: {
  params: { slug: string };
}) {
  const sections = await getPageSections(params.slug);

  if (!sections) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      {sections.map((section: any) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
