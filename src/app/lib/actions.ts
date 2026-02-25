'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { verifyCaptcha, generateCaptcha, CaptchaData } from '@/lib/captcha'

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
