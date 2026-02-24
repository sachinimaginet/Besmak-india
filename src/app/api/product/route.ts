import { NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db';
import { auth } from '@/auth';

// GET a specific product by ID OR all products (though listing is usually handled in the page)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const results = await dbQuery<any[]>("SELECT * FROM product WHERE id = ? LIMIT 1", [id]);
      if (results.length === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(results[0]);
    }

    const products = await dbQuery<any[]>("SELECT * FROM product ORDER BY createdAt DESC");
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// POST create a new product
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { id, name, slug, description, categoryId, images, specifications } = data;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    const now = new Date();
    await dbQuery(
      "INSERT INTO product (id, name, slug, description, categoryId, images, specifications, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id || Math.random().toString(36).substr(2, 9),
        name,
        slug,
        description || "",
        categoryId || null,
        images ? JSON.stringify(images) : "[]",
        specifications ? JSON.stringify(specifications) : "{}",
        now,
        now
      ]
    );

    return NextResponse.json({ success: true, message: "Product created successfully" });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// PUT update an existing product
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { id, name, slug, description, categoryId, images, specifications } = data;

    if (!id || !name || !slug) {
      return NextResponse.json({ error: "ID, Name, and Slug are required" }, { status: 400 });
    }

    const now = new Date();
    await dbQuery(
      "UPDATE product SET name = ?, slug = ?, description = ?, categoryId = ?, images = ?, specifications = ?, updatedAt = ? WHERE id = ?",
      [
        name,
        slug,
        description || "",
        categoryId || null,
        images ? JSON.stringify(images) : "[]",
        specifications ? JSON.stringify(specifications) : "{}",
        now,
        id
      ]
    );

    return NextResponse.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await dbQuery("DELETE FROM product WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
