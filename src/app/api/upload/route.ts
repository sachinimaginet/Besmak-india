import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    // Read the request body as a stream or buffer for blob upload
    const blob = await put(filename, req.body as any, {
      access: 'public',
    });

    // Save metadata to database
    try {
      const { query: dbQuery } = await import('@/lib/db');
      const id = crypto.randomUUID();
      const now = new Date();
      
      await dbQuery(
        "INSERT INTO media (id, url, filename, contentType, size, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, blob.url, filename, blob.contentType, null, now, now]
      );
    } catch (dbError) {
      console.error('Database error saving media metadata:', dbError);
      // We don't fail the request because the file is already in the blob storage,
      // but we should log it. In a more robust system, we might want to delete the blob if DB fails.
    }

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
