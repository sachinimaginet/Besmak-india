'use server'

import { signIn, auth } from '@/auth'
import { AuthError } from 'next-auth'
import { verifyCaptcha, generateCaptcha, CaptchaData } from '@/lib/captcha'
import { query as dbQuery } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function getNewCaptcha(): Promise<CaptchaData> {
  return generateCaptcha();
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const captchaToken = formData.get('captchaToken') as string;
    const captchaAnswer = formData.get('captchaAnswer') as string;

    if (!captchaToken || !captchaAnswer || !verifyCaptcha(captchaToken, captchaAnswer)) {
      return 'Invalid or expired CAPTCHA. Please try again.';
    }

    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}

export async function verifyAdminPassword(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return { success: false, error: 'Unauthorized' };
    }

    const users = await dbQuery<any[]>("SELECT * FROM adminuser WHERE email = ? LIMIT 1", [session.user.email]);
    const user = users[0];

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return { success: false, error: 'Incorrect password' };
    }

    return { success: true };
  } catch (error) {
    console.error('Password verification error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
