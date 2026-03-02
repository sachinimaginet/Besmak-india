import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/auth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content } = await request.json();
    const { id } = params;

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    await query(
      "UPDATE page_sections SET content = ?, updatedAt = ? WHERE id = ?",
      [JSON.stringify(content), now, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Error] Failed to update section:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
