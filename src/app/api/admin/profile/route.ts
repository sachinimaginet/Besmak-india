import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { query as dbQuery } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, password } = await req.json();
    const currentEmail = session.user.email;

    if (!email && !password) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    if (email) {
      // Check if email already exists for another user
      const existing = await dbQuery<any[]>("SELECT id FROM adminuser WHERE email = ? AND email != ?", [email, currentEmail]);
      if (existing.length > 0) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }

      await dbQuery("UPDATE adminuser SET email = ? WHERE email = ?", [email, currentEmail]);
    }

    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await dbQuery("UPDATE adminuser SET password = ? WHERE email = ?", [hashedPassword, email || currentEmail]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
