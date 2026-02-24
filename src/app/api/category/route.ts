import { NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db';

export async function GET() {
  try {
    const categories = await dbQuery<any[]>("SELECT id, name FROM category ORDER BY name ASC");
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
