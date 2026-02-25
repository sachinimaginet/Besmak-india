import { NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db';
import { auth } from '@/auth';

export async function GET() {
  try {
    const category = await dbQuery<any[]>("SELECT * FROM category ORDER BY name ASC");
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { id, name, slug } = data;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    const now = new Date();
    await dbQuery(
      "INSERT INTO category (id, name, slug, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
      [
        id || Math.random().toString(36).substr(2, 9),
        name,
        slug,
        now,
        now
      ]
    );

    return NextResponse.json({ success: true, message: "Category created successfully" });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { id, name, slug } = data;

    if (!id || !name || !slug) {
      return NextResponse.json({ error: "ID, Name, and Slug are required" }, { status: 400 });
    }

    const now = new Date();
    await dbQuery(
      "UPDATE category SET name = ?, slug = ?, updatedAt = ? WHERE id = ?",
      [name, slug, now, id]
    );

    return NextResponse.json({ success: true, message: "Category updated successfully" });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    await dbQuery("DELETE FROM category WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
