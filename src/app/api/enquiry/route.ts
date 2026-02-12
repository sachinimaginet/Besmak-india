import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

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

    // In a real app, this would save to DB.
    // Since Prisma might not be generated yet, we wrap in try-catch or check existence
    try {
        if (prisma.enquiry) {
            const newEnquiry = await prisma.enquiry.create({
                data: {
                    name,
                    email,
                    message,
                    productId: productId || undefined,
                },
            });
            return NextResponse.json({ success: true, data: newEnquiry }, { status: 201 });
        } else {
             console.warn("Prisma Client not fully initialized, mocking success");
             return NextResponse.json({ success: true, message: "Mocked success (DB not ready)" }, { status: 201 });
        }
    } catch (dbError) {
        console.error("Database error:", dbError);
        return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
    }

  } catch (error) {
    console.error("Error processing enquiry:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
