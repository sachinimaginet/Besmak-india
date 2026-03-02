import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, slug, description, keywords, isActive } = await request.json();
    const { id } = params;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await query(
      "UPDATE pages SET title = ?, slug = ?, description = ?, keywords = ?, isActive = ?, updatedAt = ? WHERE id = ?",
      [title, slug, description, keywords, isActive, now, id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API Error] Failed to update page:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    
    // Check if it's the home page (slug='home')
    const page = await query("SELECT slug FROM pages WHERE id = ?", [id]);
    if (page[0]?.slug === 'home') {
      return NextResponse.json({ error: "Cannot delete home page" }, { status: 400 });
    }

    await query("DELETE FROM pages WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] Failed to delete page:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
