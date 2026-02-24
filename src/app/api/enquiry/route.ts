import { NextResponse } from 'next/server';
import { z } from 'zod';
import { query as dbQuery } from '@/lib/db';

const enquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  productId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = enquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, message, productId } = result.data;

    try {
        const id = crypto.randomUUID();
        const now = new Date();
        
        await dbQuery(
            "INSERT INTO enquiries (id, name, email, message, productId, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [id, name, email, message, productId || null, "PENDING", now, now]
        );
        
        return NextResponse.json({ success: true, message: "Enquiry saved successfully" }, { status: 201 });
    } catch (dbError) {
        console.error("Database error:", dbError);
        return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
    }

  } catch (error) {
    console.error("Error processing enquiry:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
