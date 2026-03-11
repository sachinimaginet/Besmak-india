import { NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await req.json();

    if (!status || !['PENDING', 'COMPLETED'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const now = new Date();
    await dbQuery(
      "UPDATE enquiry SET status = ?, updatedAt = ? WHERE id = ?",
      [status, now, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
