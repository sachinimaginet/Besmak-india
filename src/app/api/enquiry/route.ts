import { NextResponse } from 'next/server';
import { z } from 'zod';
import { query as dbQuery } from '@/lib/db';
import { verifyCaptcha } from '@/lib/captcha';
import crypto from 'crypto';

const enquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  message: z.string().optional(),
  productId: z.string().optional(),
  productIds: z.array(z.string()).optional(),
  captchaToken: z.string(),
  captchaAnswer: z.string(),
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

    const { 
      name, email, phone, company, industry, message, 
      productId, productIds, captchaToken, captchaAnswer 
    } = result.data;

    // Verify Captcha
    if (!verifyCaptcha(captchaToken, captchaAnswer)) {
      return NextResponse.json({ error: "Invalid or expired captcha" }, { status: 400 });
    }

    // Prepare consolidated message
    let finalMessage = message || "Interested in these products.";
    if (company || industry) {
      finalMessage += `\n\n--- Additional Info ---\nCompany: ${company || 'N/A'}\nIndustry: ${industry || 'N/A'}`;
    }

    // If productIds is provided (multi-product query)
    const productsToRecord = productIds && productIds.length > 0 ? productIds : (productId ? [productId] : []);

    try {
        const now = new Date();
        
        // We record one enquiry entry but we can refer to multiple products if needed.
        // For now, let's keep the existing schema logic but maybe join product names in the message if it's a bulk query.
        const id = crypto.randomUUID();
        
        // If it's a bulk enquiry, we might want to list products in the message explicitly 
        // because the 'productId' column only holds one ID.
        let bulkInfo = "";
        if (productsToRecord.length > 1) {
            bulkInfo = `\n\n--- Bulk Enquiry ---\nProducts IDs: ${productsToRecord.join(', ')}`;
        }

        await dbQuery(
            "INSERT INTO enquiry (id, name, email, phone, message, productId, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              id, 
              name, 
              email, 
              phone || null, 
              finalMessage + bulkInfo, 
              productsToRecord.length === 1 ? productsToRecord[0] : null, 
              "PENDING", 
              now, 
              now
            ]
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
