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

    // Fetch all categories for name-to-id mapping
    const categories = await dbQuery<any[]>("SELECT id, name FROM category");
    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));

    const now = new Date();
    let createdCount = 0;
    let updatedCount = 0;

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
      if (!slug) {
        slug = name
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
      }

      // 2. Dynamic Category Mapping
      if (!categoryId && categoryName) {
        categoryId = categoryMap.get(categoryName.toLowerCase()) || null;
      }
      
      // 3. Handle JSON fields
      const finalImages = typeof images === 'string' ? images : JSON.stringify(images || []);
      const finalSpecs = typeof specifications === 'string' ? specifications : JSON.stringify(specifications || {});

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
