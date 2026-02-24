import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db';
import { auth } from '@/auth';

// GET media with pagination
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const offset = (page - 1) * limit;

    // Fetch total count
    const countResult = await dbQuery<any[]>("SELECT COUNT(*) as count FROM media");
    const total = countResult[0]?.count || 0;

    // Fetch paginated media
    const media = await dbQuery<any[]>(
      "SELECT * FROM media ORDER BY createdAt DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    return NextResponse.json({
      media,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

// DELETE a media item
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const url = searchParams.get('url');

    if (!id || !url) {
      return NextResponse.json({ error: "ID and URL are required" }, { status: 400 });
    }

    // 1. Delete from Vercel Blob
    try {
        await del(url);
    } catch (blobError) {
        console.error('Error deleting from Vercel Blob:', blobError);
        // We continue to delete from DB even if blob delete fails or file is already gone
    }

    // 2. Delete from Database
    await dbQuery("DELETE FROM media WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Media deleted successfully" });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
