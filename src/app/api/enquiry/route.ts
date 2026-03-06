import { NextResponse } from 'next/server';
import { z } from 'zod';
import { query as dbQuery } from '@/lib/db';

const enquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  message: z.string().optional(),
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

    const { name, email, phone, company, industry, message, productId } = result.data;

    // Format message to include company and industry if provided
    let finalMessage = message || "Interested in this product.";
    if (company || industry) {
      finalMessage += `\n\n--- Additional Info ---\nCompany: ${company || 'N/A'}\nIndustry: ${industry || 'N/A'}`;
    }

    try {
        const id = crypto.randomUUID();
        const now = new Date();
        
        await dbQuery(
            "INSERT INTO enquiry (id, name, email, phone, message, productId, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [id, name, email, phone || null, finalMessage, productId || null, "PENDING", now, now]
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
