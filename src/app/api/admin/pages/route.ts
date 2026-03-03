import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pages = await query("SELECT * FROM pages ORDER BY createdAt DESC");
    return NextResponse.json(pages);
  } catch (error) {
    console.error("[API Error] Failed to fetch pages:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, slug, description, keywords } = await request.json();
    const id = Math.random().toString(36).substring(2, 15);
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await query(
      "INSERT INTO pages (id, slug, title, description, keywords, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, slug, title, description, keywords, now, now]
    );

    return NextResponse.json({ id, success: true });
  } catch (error: any) {
    console.error("[API Error] Failed to create page:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
