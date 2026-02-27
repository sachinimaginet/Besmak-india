import { NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db';
import { auth } from '@/auth';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { products } = await req.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "Invalid data format. Expected an array of products." }, { status: 400 });
    }

    // --- OVERWRITE MODE ---
    // Clear all existing products before importing new ones
    await dbQuery("DELETE FROM product");

    // Fetch all categories for name-to-id mapping
    const categories = await dbQuery<any[]>("SELECT id, name FROM category");
    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));

    const now = new Date();
    let createdCount = 0;
    let updatedCount = 0;
    const usedSlugsInBatch = new Set<string>();

    async function generateUniqueSlug(baseName: string, originalSlug?: string) {
      // 1. Initial slug from trimmed name or provided slug
      let baseSlug = (originalSlug || baseName)
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-") // Collapse multiple dashes
        .replace(/^-+|-+$/g, ""); // Trim leading/trailing dashes

      let slug = baseSlug;
      let counter = 1;

      // Check collision with database and current batch
      while (true) {
        const existsInDb = await dbQuery<any[]>("SELECT id FROM product WHERE slug = ?", [slug]);
        if (existsInDb.length === 0 && !usedSlugsInBatch.has(slug)) {
          break;
        }
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      usedSlugsInBatch.add(slug);
      return slug;
    }

    function safeJsonStringify(input: any, defaultValue: string = "{}") {
      try {
        if (!input) return defaultValue;
        
        let obj = input;
        if (typeof input === 'string') {
          // If it's already a string, try to parse it to see if it's valid JSON
          try {
            obj = JSON.parse(input);
          } catch {
            // If it's not valid JSON (e.g. raw string with tabs), we keep it as a string
            // and it will be properly escaped by JSON.stringify below
            obj = input;
          }
        }

        // Handle the case where the input might be a string that contains literal tabs/newlines
        // occurring outside of a standard JSON structure.
        const stringified = JSON.stringify(obj);
        
        // MySQL JSON_VALID check is strict about raw control characters.
        // Even inside a JSON string, a literal tab must be \t.
        // JSON.stringify already handles this, but let's be extra safe if 'obj' was a raw string.
        return stringified;
      } catch (error) {
        console.error('JSON stringify error:', error);
        return defaultValue;
      }
    }

    for (const product of products) {
      let { 
        id, 
        name, 
        slug, 
        description, 
        categoryId, 
        categoryName,
        categorySpecification, 
        images, 
        specifications 
      } = product;

      if (!name) continue; // Skip invalid rows without name

      // 1. Dynamic Slug Generation
      slug = await generateUniqueSlug(name, slug);

      // 2. Dynamic Category Mapping
      if (!categoryId && categoryName) {
        categoryId = categoryMap.get(categoryName.toLowerCase()) || null;
      }
      
      // 3. Handle JSON fields
      const finalImages = safeJsonStringify(images, "[]");
      const finalSpecs = safeJsonStringify(specifications, "{}");

      if (id) {
        // Check if exists
        const exists = await dbQuery<any[]>("SELECT id FROM product WHERE id = ?", [id]);
        if (exists.length > 0) {
          // UPDATE
          await dbQuery(
            "UPDATE product SET name = ?, slug = ?, description = ?, categoryId = ?, categorySpecification = ?, images = ?, specifications = ?, updatedAt = ? WHERE id = ?",
            [name, slug, description || "", categoryId || null, categorySpecification || null, finalImages, finalSpecs, now, id]
          );
          updatedCount++;
        } else {
          // INSERT with provided ID
          await dbQuery(
            "INSERT INTO product (id, name, slug, description, categoryId, categorySpecification, images, specifications, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [id, name, slug, description || "", categoryId || null, categorySpecification || null, finalImages, finalSpecs, now, now]
          );
          createdCount++;
        }
      } else {
        // 4. Dynamic ID Generation
        const newId = crypto.randomUUID();
        await dbQuery(
          "INSERT INTO product (id, name, slug, description, categoryId, categorySpecification, images, specifications, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [newId, name, slug, description || "", categoryId || null, categorySpecification || null, finalImages, finalSpecs, now, now]
        );
        createdCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Bulk operation completed: ${createdCount} created, ${updatedCount} updated.`,
      stats: { created: createdCount, updated: updatedCount }
    });
  } catch (error) {
    console.error('Bulk product error:', error);
    return NextResponse.json({ error: "Failed to process bulk operation" }, { status: 500 });
  }
}
